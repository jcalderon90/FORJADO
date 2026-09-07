---
tags: [forjado, cliente, carwarriors, n8n, slack, notificaciones, gmail, oauth, bug]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-06
---

# 2026-09-06 (noche) — Auditoría completa de notificaciones Slack + causa raíz y fix de credencial Gmail + nuevo monitor semanal

**Contexto:** Jorge reportó que le estaban llegando notificaciones de error a Slack sobre Carwarriors. Esta sesión es distinta de [[2026-09-06-fix-notificaciones-slack-sin-nombre-datos|la sesión anterior del mismo día]] (que corrigió el bug de "Nombre: No registrado" restaurando el mapeo a `Get Contact Info`) — esta sesión empezó **horas después**, revisando ejecuciones reales, y encontró que ese mismo fix restaurado había introducido una regresión de crash en producción, más un segundo bug de cableado totalmente independiente en `NOTIFICATIONS`. Sesión larga, con 3 rondas de trabajo (diagnóstico inicial → auditoría completa a pedido de Jorge → "arréglalos todos") más el tema de Gmail al final.

## Ronda 1 — Diagnóstico inicial: `Get Contact Info` sin guarda de ejecución

Se revisaron las ejecuciones fallidas recientes de `PRINCIPAL` (`Kif9lWwDHvR7TT39`) vía `search_workflow_executions`: 6 fallos solo el 06-sep (10:25, 19:03, 19:36, 19:38 ×2, 22:27 UTC), 58 acumulados. Todas con el mismo stack trace exacto en los 3 nodos `'Notifications Master' Nuevos Leads/Escalation/Interés Precios`:

```
ExpressionError: Node 'Get Contact Info' hasn't been executed
```

**Causa exacta:** el mapeo restaurado por la sesión anterior (`$('Get Contact Info').first().json.contact?.name || ...`) es correcto en cuanto a los datos, pero `Get Contact Info` es un nodo `httpRequest` **sin conexiones de salida** (cuelga de `Find User` en paralelo con `Check GHL Last Message`, solo existe para ser referenciado por expresión) — y con `executionOrder: v1` su turno en la cola no está garantizado antes de los nodos profundos de notificación. En varias rutas de conversación real, `Get Contact Info` no llegaba a ejecutarse antes de estos 3 nodos, y la referencia sin guarda tumbaba toda la ejecución. Confirmado con `includeData` en 3 ejecuciones reales (4783, 4769, 4760): mismo error, mismo `nodeCause: "Get Contact Info"`.

**Fix aplicado (primero de la sesión):** en los 3 nodos, resolver el contacto una sola vez con guarda (mismo patrón que la expresión ya usaba para `Check GHL Last Message`):

```js
const gci = $('Get Contact Info');
const contact = (gci.isExecuted ? gci.first().json.contact : null) || {};
```

Con fallback adicional a `PARSE BODY.current_body` para teléfono/correo (antes solo el nombre tenía ese fallback). Validado localmente con Node (`--check` + simulación de 3 escenarios: ejecutado, no ejecutado, ejecutado-pero-sin-`.contact` por el `onError: continueRegularOutput` de `Get Contact Info`) antes de aplicar. Publicado en `PRINCIPAL` (`Kif9lWwDHvR7TT39`), `activeVersionId` final de este paso: `42a4ed52-ad65-45a4-8bb5-aab75eabdc0f`. Verificado sin errores nuevos en las 4 ejecuciones posteriores (22:29→22:55 UTC), todas `success`.

## Ronda 2 — Auditoría completa a pedido de Jorge ("revisa todo")

Se listaron los 16 workflows del proyecto y se buscaron errores desde 2026-08-30. Se lanzaron 3 agentes en paralelo para investigar: (A) `NOTIFICATIONS` + `ERROR HANDLER`, (B) `LEAD - COLLECTOR`, (C) `RSVP` + `KB - SEARCH`. En paralelo, revisión propia de `PRINCIPAL` buscando nodos deshabilitados y nodos sin conexión de salida referenciados por expresión (mismo patrón de bug que el de la Ronda 1).

### Hallazgo propio 1 — Alertas de spam a Slack completamente apagadas

El nodo Slack `Send a message` en `PRINCIPAL` (canal `notificaciones`/`C0BPV2Z2S3C`, credencial `Slack FORJADO`) — el que recibe el texto ya armado de `Format Spam Alert` y `Format Spam Alert - Engagement` — tenía `disabled: true`. Cada bloqueo de spam armaba el mensaje y lo descartaba sin error. **Fix:** habilitado (`setNodeDisabled`). Publicado junto con el fix de LEAD-COLLECTOR de abajo.

### Hallazgo propio 2 — Bug "OFF TOPIC" confirmado en vivo (ya documentado como diseño, nunca aplicado en producción)

Al buscar nodos `disabled:true` en todo `PRINCIPAL` (91 nodos), apareció también `OFF TOPIC - Respond` (HTTP a ManyChat `sendContent`). Cadena completa: `IF SPAM ENGAGEMENT` (rama false) → `IF FUERA DE CONTEXTO` → `OFF TOPIC - Respuesta` (arma el texto) → `OFF TOPIC - Respond` (lo envía — **deshabilitado**). El texto en `OFF TOPIC - Respuesta` sigue diciendo *"Soy una asistente virtual y exclusiva de **SPECTRUM VIVIENDA**"* (inmobiliaria, otro cliente de FORJADO, código pegado sin adaptar). Este bug **ya estaba documentado como pendiente de diseño** en [[carwarriors-llc-guardrail-anti-spam|la guía de implementación del guardrail anti-spam]] (sección "5. Corregir ruta OFF TOPIC", con dos opciones: borrar la rama o rewirarla a GHL) — confirmado hoy con lectura directa del workflow en producción que **ninguna de las dos opciones se aplicó nunca**: sigue exactamente igual que cuando se documentó. La descripción del workflow clonado `PRINCIPAL - Rances Car` también lo menciona explícitamente ("sin el bug OFF TOPIC heredado") — el clon sí lo corrigió, `PRINCIPAL` nunca recibió el mismo tratamiento de vuelta.

**Decisión con Jorge (esta sesión):** dejarlo tal cual por ahora — como está deshabilitado no genera daño activo hoy (el AI ya maneja mensajes fuera de contexto en su respuesta principal vía el `## GUARDRAIL ##` del prompt), se revisa con más calma otro día. No se aplicó ninguna de las 2 opciones de la guía.

### Hallazgo del Agente A — `NOTIFICATIONS`: 2 de 3 tipos de alerta nunca llegaban a Slack (bug independiente, no relacionado a `Get Contact Info`)

Este es el hallazgo más grave de la sesión, y es la pieza que le faltaba al diagnóstico de [[2026-09-06-fix-notificaciones-slack-sin-nombre-datos|la sesión anterior]] — explica por qué, aun con el mapeo de datos corregido, las alertas de escalación/precios seguían sin llegar de forma consistente:

En `NOTIFICATIONS` (`oz7EabosHGTXtTjr`), el `Switch Alerta` enruta por `tipo_alerta` a 5 nodos `Payload *` (Nuevo Lead, Precios, Cita, Escalación, Cita Cancelada), pero en las `connections` del workflow **solo `Payload Nuevo Lead` y `Payload Cita` estaban conectados** a `Edit Fields` → `Send a message`. `Payload Precios`, `Payload Escalación` y `Payload Cita Cancelada` eran nodos huérfanos: armaban el texto (`lastNodeExecuted` confirmado en ejecuciones reales 4710 y 4676) y ahí terminaba la ejecución, con `status: "success"` — sin ningún error que lo delatara en los logs.

Es decir: de los 3 tipos de alerta que dispara `PRINCIPAL`, **la escalación a humano y el interés en precios nunca llegaban a Slack**, sin importar si el dato de nombre/teléfono era correcto o no — esto es consistente con por qué la sesión anterior, al revisar 32 ejecuciones de `NOTIFICATIONS`, vio el texto "No registrado" en el JSON del nodo `Payload` pero eso no garantizaba que `Send a message` hubiera corrido — de hecho para escalación/precios nunca corría.

**Fix:** agregadas las 3 conexiones faltantes (`Payload Precios/Escalación/Cita Cancelada` → `Edit Fields`), mismo patrón que las 2 que ya funcionaban. Verificado post-publish: las 5 ramas del Switch ahora llegan a `Send a message`. `activeVersionId` final: `a423da15-7d62-4fb0-99b1-ff6410b32453`.

### Hallazgo del Agente A — `ERROR HANDLER`: credencial Gmail vencida, pero Slack SÍ funcionaba

`ypd1lxqlsa5KXsoy` aparecía con `status: "error"` en casi cada disparo. Causa: `Send Error Email` (Gmail, credencial `jcalderon900610@gmail.com` id `3dOfYyrrSn84ZGBs`) fallaba con `credential needs to be reconnected` — la rama de Slack (`Format Slack Message` → `Send a message`) corre en paralelo (no en serie) y **sí se entregaba bien**, confirmado con `{"ok":true}` de la API de Slack en 3 ejecuciones reales inspeccionadas. Es decir: no se perdían notificaciones de error a Slack, solo el correo — pero el handler completo se marcaba como fallido en los logs, generando ruido/confusión. Este hallazgo llevó al tema de Gmail que se retoma más abajo.

### Hallazgo del Agente B — `LEAD - COLLECTOR`: hasta 10-12 min de silencio para el lead

El nodo `OpenRouter Chat Model` (usado por `Lead Agent`) no tenía `timeout` configurado en la versión publicada actual → caía al default del cliente HTTP subyacente (~600 000ms = 10 min, confirmado con 2 ejecuciones reales de exactamente esa duración: 4232, 4092). Dato relevante: el propio historial de este nodo mostraba que **el 2026-09-03 alguien ya había puesto `timeout: 60000`** (ejecución 4339, truena justo en ese límite) — pero esa versión nunca quedó publicada, y el workflow en producción volvió a quedar expuesto al default de 10 min. Como `lead_collector` es una AI Agent Tool síncrona invocada por `PRINCIPAL`, el lead sí recibía respuesta al final, pero con ese retraso completo (confirmado con las ejecuciones padre de `PRINCIPAL`: 11m29s y 2m28s de principio a fin en los 2 casos revisados).

**Fix:** `options.timeout: 30000` + `options.maxRetries: 2` explícitos en el nodo. `activeVersionId` final: `5445c002-930c-4dda-bdde-61b4eb557871`.

### Hallazgo del Agente C — `RSVP`: timeout al límite + fallos sin notificar

Un timeout puntual (60 008ms contra un límite de 60 000ms configurado) en el nodo LLM de `RSVP` (ejecución 4742). Históricamente en agosto hubo también un JWT de GHL vencido (ya resuelto solo, sin relación con hoy). Cuando `rsvp` falla, `PRINCIPAL` lo detecta internamente (`Detectar Error Tecnico`, `accion_tipo: "error"`) y lo guarda en Mongo (`Insert Error Log`) — pero ese log **no se notificaba a nadie**, ni a Slack ni al lead de forma explícita (el lead sí recibía un mensaje genérico de disculpa vía el flujo normal de `Parse response` → `SEND GHL MESSAGE`, pero sin mencionar que la cita específicamente no se agendó).

### Hallazgo del Agente C — `KB - SEARCH`: riesgo de alucinación de inventario

El bug técnico de parseo de JSON (mismo patrón "rambling" de `deepseek-v4-flash` ya documentado el 08-31/09-01 en otros workflows) **ya se había corregido solo el 2026-09-03**, sin intervención de ninguna sesión de Claude — la versión activa actual ya tiene extracción robusta con regex + fallback. Lo que seguía sin resolver: cuando el tool `kb_search` falla técnicamente (no cuando devuelve "sin resultados", que ya está bien manejado), `PRINCIPAL` no tenía ninguna instrucción de qué hacer, y en una ejecución real (3704/3705, 31-ago) terminó **afirmando por su cuenta "sí tenemos Tesla en Miami"** sin haber consultado la KB real — justo la clase de alucinación que el guardrail de dirección del 09-01 ya había prohibido para direcciones pero no para inventario/precios ante un fallo técnico del tool.

## Ronda 3 — "Arréglalos todos"

Con confirmación de Jorge, se aplicaron los 3 fixes restantes que habían quedado solo diagnosticados (no los de la Ronda 2 principal, que ya se habían aplicado):

1. **`ERROR HANDLER`** (`ypd1lxqlsa5KXsoy`): `Send Error Email` con `onError: continueRegularOutput` + `retryOnFail` (2 intentos, 2s de espera) — un fallo de correo ya no marca todo el handler como error. **No corrige la causa** (la credencial seguía vencida en este punto) — eso se resolvió después, ver abajo. `activeVersionId`: `63ddbb22-67ae-42c1-916a-494aed67952b`.
2. **`RSVP`** (`2trw9S1LM8ttZlFb`): timeout del LLM subido de 60000ms/maxRetries 1 → 90000ms/maxRetries 2. `activeVersionId`: `952088f6-af64-461c-b23d-b9f9d6900412`.
3. **`PRINCIPAL`** — dos cambios en el mismo publish:
   - Nuevo nodo `Format Error Tecnico Alert` conectado `Insert Error Log` → `Format Error Tecnico Alert` → `Send a message` (mismo Slack #notificaciones, ahora con 3 fuentes: spam normal, spam engagement, y error técnico/rsvp). El lead ya recibía su mensaje genérico de disculpa por otra vía — no se tocó eso.
   - Guardrail nuevo en el prompt del agente `PRINCIPAL` (sección `## MANEJO DE RESPUESTAS DE TOOLS ##`, verificado el ancla exacta antes de insertar, un solo párrafo nuevo, sin tocar el resto del prompt de 10 178 caracteres): *"Si `kb_search` falla, no responde, o devuelve error: NUNCA afirmes disponibilidad, precio o existencia de un vehículo específico por tu cuenta ni de memoria..."* + `onError: continueRegularOutput` + retry en el nodo tool `kb_search`. `activeVersionId` final: `bbe65352-4d37-4c84-a5d3-25d1d7fdb0f7`.

Cada uno de estos 3 cambios se verificó releyendo el workflow completo desde el servidor (conexiones/parámetros exactos) **antes** de publicar, no solo confiando en el "OK" de la API — en 2 casos anteriores de esta misma sesión (`update_workflow` sobre PRINCIPAL) la respuesta trae validationWarnings pre-existentes sobre el nodo Slack "Send a message" (falta `parameters.resource`) que no se tocaron — n8n usa el default del nodo en runtime, confirmado que no es un problema real (mismo patrón en varios workflows del proyecto).

## Tema aparte: causa raíz y fix de la credencial Gmail que se vencía sola

A raíz del hallazgo del `ERROR HANDLER`, Jorge preguntó qué hacer con la credencial de Gmail que se vencía. Diagnóstico: la app OAuth de Google Cloud (proyecto "CarWarriors") estaba en modo **Testing**, donde Google revoca el refresh token cada 7 días sin excepción, independientemente del uso. Jorge inicialmente pensó que el problema era que la cuenta de Gmail es una cuenta gratuita/personal (no Workspace) — aclarado que eso **no es el obstáculo real**: el tipo de usuario "External" del consent screen está diseñado exactamente para cuentas Gmail personales, publicar a producción no requiere cuenta paga ni organización.

Jorge también preguntó si el paso de "Publish App" implica una demora de revisión de Google — aclarado que son dos procesos distintos: "Publish App" (Testing→Production) es instantáneo, sin cola de revisión; "Submit for verification" (lo que sí demora días/semanas) es un botón separado y completamente opcional para este caso (solo hace falta para quitar la advertencia de "app no verificada", no para que funcione).

**Pasos que siguió Jorge (confirmado con screenshot):** publicó la app a "En producción" en Google Cloud Console (banner de verificación pendiente, ignorado a propósito) → reconectó la credencial `jcalderon900610@gmail.com` en n8n aceptando la advertencia de "app no verificada" (Advanced → Go to app unsafe).

**Verificado con ejecución real:** se ejecutó manualmente el nuevo workflow `MONITOR - Gmail Credential Check` (ver abajo) — `Test Gmail Send` corrió con `executionStatus: "success"`, Gmail devolvió un id de mensaje real (`1a07982ca01beb1f`) con labels `SENT`/`INBOX`. La credencial funciona de verdad, no solo "no tira error".

### Nuevo workflow: `MONITOR - Gmail Credential Check`

Creado desde cero con el SDK de workflows de n8n (`create_workflow_from_code`, validado antes de crear). Workflow nuevo `VQxUXBWCOcQgBFOi`, en el proyecto personal de Jorge Calderón. Diseño: dado que el fix del `ERROR HANDLER` (punto 1 de la Ronda 3) hace que un futuro vencimiento de esta credencial **falle en silencio** (ya no se ve como error en los logs de n8n), este monitor prueba activamente la credencial cada semana:

- **Trigger:** `Schedule Trigger`, todos los lunes 8:00 AM, timezone `America/New_York` (agregado explícitamente vía `setWorkflowSettings`, igual que `errorWorkflow: ypd1lxqlsa5KXsoy` para consistencia con el resto del proyecto).
- **`Test Gmail Send`** (Gmail, `onError: continueErrorOutput`): se manda un correo de prueba a sí misma (`jcalderon900610@gmail.com`).
- **Éxito:** rama sin conexión de salida — silencio, no genera ruido.
- **Error:** `Format Gmail Alert` (Set, arma el texto con el error) → `Send a message` (Slack `#notificaciones`, mismo canal/credencial del resto del proyecto).

Publicado y activo. Probado una vez manualmente (`execute_workflow`, modo manual) — confirmado éxito real, como se documentó arriba. Primer disparo automático real: el próximo lunes.

## Estado final de todos los cambios de esta sesión (todos publicados y verificados)

| Workflow | Cambio | `activeVersionId` final |
|---|---|---|
| `PRINCIPAL` (`Kif9lWwDHvR7TT39`) | Guarda `isExecuted` en `Get Contact Info` (3 nodos) | `42a4ed52-ad65-45a4-8bb5-aab75eabdc0f` |
| `PRINCIPAL` | Habilitar `Send a message` (alertas de spam) + fix LEAD-COLLECTOR (ver abajo) | `5cec3e26-185f-4a30-8a3a-62bd80f9bb9a` |
| `NOTIFICATIONS` (`oz7EabosHGTXtTjr`) | Conectar Payload Precios/Escalación/Cita Cancelada → Slack | `a423da15-7d62-4fb0-99b1-ff6410b32453` |
| `LEAD - COLLECTOR` (`4r00JFnCyoUpZgXU`) | Timeout 30s + maxRetries 2 en OpenRouter | `5445c002-930c-4dda-bdde-61b4eb557871` |
| `ERROR HANDLER` (`ypd1lxqlsa5KXsoy`) | `continueRegularOutput` + retry en `Send Error Email` | `63ddbb22-67ae-42c1-916a-494aed67952b` |
| `RSVP` (`2trw9S1LM8ttZlFb`) | Timeout 90s en OpenRouter | `952088f6-af64-461c-b23d-b9f9d6900412` |
| `PRINCIPAL` | Nodo `Format Error Tecnico Alert` (rsvp→Slack) + guardrail kb_search en prompt + onError kb_search | `bbe65352-4d37-4c84-a5d3-25d1d7fdb0f7` |
| `VQxUXBWCOcQgBFOi` (nuevo) | `MONITOR - Gmail Credential Check` creado, publicado, probado con éxito real | `dcd2f2a4-4cdd-4ddc-b6cd-c5d02d090a82` |

## Pendiente real

- [ ] Confirmar con tráfico real (próxima escalación/interés en precios) que las 2 alertas antes huérfanas de `NOTIFICATIONS` ya llegan a Slack de punta a punta.
- [ ] Confirmar que el guardrail nuevo de `kb_search` en el prompt de `PRINCIPAL` efectivamente evita una alucinación de inventario la próxima vez que el tool falle técnicamente (no reproducible a demanda).
- [ ] Confirmar que la alerta nueva de error técnico/rsvp a Slack dispara correctamente la próxima vez que `rsvp` falle de verdad.
- [ ] Observar el primer disparo automático real de `MONITOR - Gmail Credential Check` el próximo lunes (el manual ya confirmó que funciona).
- [ ] Bug "OFF TOPIC" — dejado a propósito sin corregir (decisión de Jorge). Las 2 opciones ya documentadas en [[carwarriors-llc-guardrail-anti-spam]] siguen vigentes si se retoma.
- [ ] No se replicó ninguno de estos fixes en `PRINCIPAL - Rances Car` / `RSVP - Rances Car` — el bug de `Get Contact Info` sin guarda y el de timeouts podrían existir ahí también (mismo patrón que otros bugs "heredados" de este proyecto); no se investigó en esta sesión.
- [ ] Hallazgo de la sesión anterior sin tocar en esta: la notificación de "cita creada" en `RSVP` casi nunca dispara (`IF CONFIRMADA` rara vez se cumple) — sigue sin resolver, decisión de esperar tráfico real después del fix de `_id`/`ghl_event_id` del 09-05.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-06-fix-notificaciones-slack-sin-nombre-datos|2026-09-06 (sesión anterior, mismo día — fix de mapeo que esta sesión encontró con la regresión de crash)]]
- [[2026-09-05-auditoria-leads-appointments-conversaciones-mongo]]
- [[carwarriors-llc-guardrail-anti-spam|Guía de implementación del guardrail anti-spam (documenta el bug OFF TOPIC desde antes)]]
- [[2026-09-03-timeouts-openrouter-lead-collector-fix|2026-09-03 (fix de timeout anterior en 6 workflows, que en LEAD-COLLECTOR no había quedado publicado)]]
