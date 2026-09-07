---
fecha: 2026-09-07
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, slack, notificaciones, principal, bug]
---

# 2026-09-07 — Ruido de alertas "Error técnico (agendamiento/rsvp)" en Slack: diagnosticado y corregido con umbral

## Reporte inicial

Jorge escribió: "me siguen llegando notificaciones de errores a Slack". Sin más contexto al inicio.

## Primer paso: descartar el ERROR HANDLER

Revisé ejecuciones reales de los dos stacks de n8n disponibles (Carwarriors y Mundo Verde) con `search_workflow_executions` filtrando `status: error`:

- **Carwarriors, `ERROR HANDLER` (`ypd1lxqlsa5KXsoy`)**: última ejecución de error fue el 6-sep 22:29 UTC, antes de que se publicaran los fixes de la auditoría del 6-sep (publicados 00:24 UTC del 7-sep). Cero errores desde entonces (~13h de ejecuciones limpias al momento de revisar).
- **Mundo Verde**: última racha de errores (`hd4kZOAD0BCYRf9u`) fue el 5-sep, nada desde entonces.

Con esto no encontré ninguna ejecución de `Error Trigger` reciente que explicara el reporte — le pedí a Jorge que pegara el texto exacto del mensaje de Slack en vez de seguir adivinando.

## El mensaje real: no era el ERROR HANDLER

Jorge pegó ~13 mensajes de Slack, todos con el formato:

```
🚨 Error técnico (agendamiento/rsvp)
Contacto: <contactId>
Dealer: CW
Canal: unknown
Tipo de error: no_json
Mensaje del usuario: <texto del lead>
Execution ID: <n>
Fecha: <timestamp>
```

Esto **no viene del `ERROR HANDLER`** (que tiene su propio formato `:x: Error en workflow: ...`) — viene de un nodo que yo mismo agregué el 6-sep como parte de la auditoría completa (ver `2026-09-06-auditoria-completa-notificaciones-slack-gmail-monitor.md`, punto 7): `Format Error Tecnico Alert`, conectado a `Insert Error Log` → `Send a message` (mismo canal `#notificaciones`), dentro de **PRINCIPAL** (`Kif9lWwDHvR7TT39`).

## Causa raíz confirmada con ejecuciones reales

Inspeccioné la ejecución 4978 con `get_workflow_execution(includeData: true)` (guardado a archivo por tamaño, leído con `jq`):

- El agente `PRINCIPAL` respondió en **texto plano**: `"Entiendo, un auto para trabajar es una inversion real. ¿Me pasas tu numero para coordinarte mejor?"` — sin envolver la respuesta en el JSON estructurado que el resto del pipeline espera (`respuesta`, `accion`, `escalar`, `estado_lead`, `metadatos`, etc.).
- El nodo `Parse response` (código ya conocido, documentado desde el 09-01 por el bug de rambling de deepseek-v4-flash) no encuentra ningún objeto JSON con la clave `respuesta` en el texto → cae al fallback: `accion_tipo: "error", error: "no_json"`, usando el propio texto plano como `respuesta` (el lead sí recibe una respuesta coherente, nada se pierde para él).
- `Detectar Error Tecnico` (IF: `accion_tipo == "error"`) → true → `Build Error Log` → `Insert Error Log` (Mongo `agent_errors`) → `Format Error Tecnico Alert` → Slack.

El problema: esta rama trata **cualquier respuesta en texto plano** (algo común en charla normal, no solo fallos de RSVP) igual que un fallo técnico real, y el nombre "(agendamiento/rsvp)" es enganoso — no tiene nada que ver con RSVP específicamente.

**Evidencia cuantitativa:** 11 alertas en ~16h (ejecuciones 4816, 4817, 4820, 4821, 4822, 4902, 4905, 4978, 4980, 4983, 4986), todas `error_type: no_json`, todas con el lead recibiendo una respuesta normal de todos modos (verificado en la 4978).

## Decisión con Jorge

Le expliqué el hallazgo y propuse 3 opciones (suprimir del todo el aviso de `no_json`, umbral de repetición, o resumen diario). Primera respuesta: "solo diagnóstico, no toques nada todavía" — documenté el hallazgo en memoria de Claude Code sin tocar el workflow.

Jorge volvió después con la pregunta "si lo suprimo no me entero de los errores ¿cierto?" — le aclaré que `Insert Error Log` sigue registrando el 100% en Mongo (`agent_errors`) sin importar qué rama de Slack se toque, y que `parse_failed` (excepción real, distinta de `no_json`) seguiría alertando sin cambios bajo cualquier opción. Le di 3 formas de mantener visibilidad sin el ruido; eligió: **alertar a Slack solo si el mismo contacto acumula 3+ `no_json`**.

## Implementación

Workflow `PRINCIPAL` (`Kif9lWwDHvR7TT39`), vía `update_workflow` (operaciones atómicas, no reescritura de código completo):

1. **`Es parse_failed?`** (IF nuevo) — se intercala entre `Insert Error Log` y `Format Error Tecnico Alert`. Condición: `$('Build Error Log').first().json.error_type == 'parse_failed'`.
   - **true** → sigue directo a `Format Error Tecnico Alert` → Slack, **sin cambios respecto a antes** (una excepción real de parseo sigue avisando siempre).
   - **false** (`no_json`) → sigue a...
2. **`Contar no_json Previos`** (nodo MongoDB, `resource: document`, `operation: find`, typeVersion 1.4) — consulta `agent_errors` filtrando por `contactId` (de `Build Error Log`) + `error_type: "no_json"`, usando el patrón recomendado de `query` con placeholders `$1`/`$2` + `queryParameters` (evita problemas de tipo Date/BSON que hubiera tenido un filtro de ventana de tiempo — se descartó esa idea por esa razón, se decidió contar el histórico total del contacto en vez de una ventana de minutos). `options.limit: 10`.
3. **`3+ no_json Seguidos?`** (IF nuevo) — condición `{{ $input.all().length }} >= 3` sobre los items devueltos por el find anterior.
   - **true** → conecta también a `Format Error Tecnico Alert` (el mismo nodo, ahora con dos entradas posibles) → Slack.
   - **false** → sin conexión (mismo patrón que ya usaba `Detectar Error Tecnico` para su rama false — se descarta en silencio).

`Insert Error Log` no se tocó — sigue logueando el 100% de los casos (`no_json` y `parse_failed`) en Mongo sin importar si Slack avisa o no.

Los 3 nodos nuevos se validaron con `validate_node_config` (los tres `valid: true`) antes de aplicar. `update_workflow` reportó `appliedOperations: 9` (3 `addNode` + 1 `removeConnection` + 5 `addConnection`), con una única advertencia pre-existente y no relacionada (`Send a message` sin `resource` explícito — ya estaba así desde antes). Publicado con `publish_workflow` → `activeVersionId: 9e8cf7c5-b22a-4062-9d75-1dd56fd63dba`.

## Limitación conocida (aceptada)

"3+ Previos" cuenta el histórico total de `no_json` del contacto en `agent_errors`, no estrictamente "3 seguidos sin un turno exitoso de por medio" — no hay una forma barata de saber si hubo una respuesta exitosa entre medio sin también loguear los éxitos (que hoy no se loguean, por diseño, solo se loguean errores). En la práctica es una aproximación razonable: la gran mayoría de contactos tiene 0 `no_json` en su historial, así que llegar a 3 ya es señal real de que algo no está funcionando bien para ese lead.

## Pendiente real

- Confirmar con tráfico real que el umbral se comporta como se espera (que un contacto con 1-2 `no_json` sueltos no genera alerta, y que al llegar al 3ro sí llega a Slack). No se simuló a propósito — mismo criterio que otras ramas de este workflow que tocan producción real (RSVP, notificaciones), se prefiere esperar el caso real.
- La causa raíz de fondo (que el system prompt de `PRINCIPAL` no garantiza al 100% que el modelo envuelva su respuesta en el JSON esperado, por eso existe `no_json` en primer lugar) sigue sin atacarse — no era lo que Jorge pidió resolver hoy, solo bajar el ruido de las alertas.
- Este cambio **no se replicó en `PRINCIPAL - Rances Car`** (que probablemente tiene el mismo `Parse response`/`Detectar Error Tecnico` heredado, sin confirmar si también tiene la rama de alerta a Slack conectada) — no investigado en esta sesión.

---

# 2026-09-07 (continuación, misma sesión) — Conversación de WhatsApp con Bianca: ROI cerrado con datos reales, y cambio de personalidad del bot (más directo/urgente) implementado en ambos dealers

Jorge compartió el log completo de WhatsApp con Bianca (marketing), del 4 al 7 de septiembre. Tres hilos distintos.

## 1. DealerCenter ROI — cerrado con datos reales

Contexto: el 4-sep Jorge ya le había explicado a Bianca por qué el ROI daba $0.00 (DealerCenter no tiene API para jalar gasto de marketing, hay que cargarlo a mano — ver `2026-09-04-roi-include-checkbox-confirmado.md`). El 7-sep Bianca respondió:

- Preguntó si se pueden borrar las categorías legacy del reporte ROI (las ~230 sin uso que tapan las 3-4 que sí importan). Jorge confirmó que sí se puede (usando el checkbox "Include in ROI" ya confirmado el 09-04).
- Mandó el gasto real de marketing por campaña, primero por audio (aproximado: "cuatro campañas, Tesla CLW, TradeIn CLW, TradeIn Francés [sic, es Rances] y Tesla Rances, como $1000/mes cada una") y después con una captura de pantalla de la plataforma de ads con el gasto exacto de agosto (1-31): RANCES TESLA - NUEVA $1,017.07, CW - TESLA $1,037.64, CW - Mensajes $1,022.69, Rances trade in $1,005.92.

**Nota importante de confidencialidad, explícita de Bianca:** "los agentes de IA no tienen por qué tener esta info... no puede difundirse esa info, es muy interna". Jorge confirmó ("ok copiado!"). Estos montos se documentan aquí (raw interno de la agencia) únicamente para que quede registro de que Bianca los entregó — **nunca deben terminar en el prompt de `PRINCIPAL`/`PRINCIPAL - Rances Car`, en la Knowledge Base, ni en ningún lugar al que el bot tenga acceso.**

**Pendiente real:** cargar estos 4 valores en el reporte ROI de DealerCenter y borrar las categorías legacy — ambas son acciones manuales en la UI de DealerCenter (sigue sin API, confirmado y no se vuelve a investigar, ver `carwarriors-dealercenter-sin-api`), las tiene que hacer Jorge, no son automatizables desde n8n/Claude Code.

## 2. Cambio de personalidad del bot — implementado y publicado en ambos dealers

Bianca pidió explícitamente (mensaje de texto + audio) que el bot sea más directo y urgente, con un playbook BDC claro:

- Filosofía: no dejar enfriar al lead, empujar a agendar cita ya, generar urgencia/escasez real (auto no dura, hay más interesados) sin ser molesto.
- 5 cosas prohibidas ("ERRORES QUE TU IA NO PUEDE COMETER"): explicar detalles del carro, hablar de precio por chat, conversaciones largas, preguntas abiertas, esperar a que el cliente decida.
- Ejemplo concreto de lo que no quiere: el bot diciendo "ME ENCANTA TESLA" (lenguaje de entusiasmo propio) en vez de ir directo: "PERFECTO, TENEMOS TAL Y TAL TESLA. ¿CUÁNDO PUEDES VENIR?".

Jorge le respondió a Bianca "voy a hacer los cambios te aviso cuando esté implementado todo" — implementado en la misma sesión.

**Hallazgo clave antes de escribir nada nuevo:** revisando el prompt de `PRINCIPAL - Rances Car` se encontró que **ya tenía una sección `URGENCIA Y CIERRE (PLAYBOOK BDC)` que `PRINCIPAL` (Carwarriors LLC) no tiene**, y que cubre casi textualmente los 5 puntos prohibidos de Bianca (mencionado de pasada en la auditoría de mojibake del 09-04, nunca se había investigado el porqué del desbalance). En vez de escribir un playbook nuevo desde cero, se portó esa sección ya probada de Rances Car hacia Carwarriors LLC.

**Cambios aplicados (vía `update_workflow` con `setNodeParameter` sobre `/options/systemMessage` del nodo agente `PRINCIPAL` en cada workflow, verificado byte a byte contra el contenido en vivo antes de publicar, luego `publish_workflow`):**

1. **`PRINCIPAL` (Carwarriors LLC, `Kif9lWwDHvR7TT39`, `activeVersionId` nuevo `3f5e4cf6-2fa1-4e57-bdb6-b4d8fa25f3a8`):** se agregó la sección completa `URGENCIA Y CIERRE (PLAYBOOK BDC)` (portada de Rances Car) justo después de `OFERTA DE APPOINTMENT`, con una regla nueva agregada explícitamente por el ejemplo de Bianca: "Nunca expreses entusiasmo propio (\"me encanta\", \"genial\", \"que lindo auto\") — confirma directo lo que pidió + pregunta de cierre concreta".
2. **`PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`, `activeVersionId` nuevo `e9b30036-6dbd-4178-ad0c-0f11bf81ea39`):** se agregó la misma regla nueva de "no entusiasmo propio" a su sección `URGENCIA Y CIERRE` ya existente (para que ambos dealers queden consistentes con el pedido de Bianca). De paso, aprovechando que ya estaba abierto el prompt, se restauró una línea que faltaba ahí desde el 09-06: el guardrail `Si kb_search falla... NUNCA afirmes disponibilidad/precio por tu cuenta` — se había agregado a `PRINCIPAL` ese día pero nunca se replicó en Rances Car (gap ya documentado como pendiente, no investigado hasta ahora).

**No se tocó** la sección `PRECIOS E INVENTARIO` (sigue permitiendo mostrar máximo 3 datos básicos — año, color, kilometraje — al mostrar inventario, que ya convivía sin problema con el mismo playbook en Rances Car) ni la sección `DETECCION ANTI-SPAM / BAJO INTERES` propia de Rances Car (Carwarriors LLC ya tiene su propio mecanismo de spam vía nodos de n8n — `SPAM CHECK`/`SPAM GET`/`SPAM INCR`/etc. — agregar una capa de detección a nivel de prompt hubiera sido redundante).

**Pendiente real:** confirmar con tráfico real que el bot suena más directo y sigue el playbook (no se puede probar sintéticamente sin arriesgar una respuesta rara a un lead real); avisarle a Bianca cuando esté confirmado, tal como Jorge le prometió.

**Actualización (misma sesión, más tarde):** Jorge le avisó a Bianca por WhatsApp que el cambio ya está implementado y publicado en ambos dealers (mensaje redactado en esta sesión, tono casual acorde a como Jorge le escribe, sin mencionar el tema de ROI/gasto de marketing por separado). Compromiso ("te aviso cuando esté implementado") cerrado. Sigue pendiente confirmar con tráfico real que el bot efectivamente suena más directo en conversaciones reales.

---

# 2026-09-07 (continuación) — Replicado en `PRINCIPAL - Rances Car` el fix de umbral `no_json`, con hallazgo nuevo: la rama de alerta a Slack no existía ahí

Jorge pidió retomar el pendiente explícito de la sección de arriba ("Este cambio no se replicó en `PRINCIPAL - Rances Car`"). Antes de tocar nada se conectó por primera vez en esta sesión el MCP de n8n de Carwarriors (`n8n-carwarriors`, agregado por Jorge con `claude mcp add --transport http n8n-carwarriors https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/mcp-server/http`) — sesiones anteriores de este mismo hilo de trabajo solo tenían acceso al n8n de "Mundo Verde".

## Hallazgo antes de replicar: el gap era más grande de lo asumido

Se comparó `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`) contra `PRINCIPAL` (`Kif9lWwDHvR7TT39`) nodo por nodo (`get_workflow_details` de ambos). Dos diferencias, no una:

1. **`Insert Error Log` en Rances Car no tenía ninguna conexión de salida** — los errores técnicos (`parse_failed` y `no_json`) quedaban logueados en Mongo (`agent_errors`) pero **nunca llegaban a Slack**, con ningún formato, ni antes ni después del fix del 09-06/09-07. No era que le faltara solo el umbral — le faltaba la rama de alerta completa (no existían `Format Error Tecnico Alert` ni ningún nodo relacionado).
2. **El nodo Slack compartido `Send a message` (canal `#notificaciones`, credencial `Slack FORJADO`) estaba `disabled: true`** en este workflow — mismo nodo al que ya entraban (sin salir, por estar apagado) `Format Spam Alert` y `Format Spam Alert - Engagement`. O sea que las alertas de spam de Rances Car tampoco estaban saliendo a Slack, independientemente de este fix.

Se le presentó el hallazgo a Jorge antes de tocar el nodo compartido (afecta más que solo esta rama) — eligió explícitamente **habilitarlo**, aceptando que de paso se reactivan las alertas de spam de este dealer.

## Implementación

Vía `update_workflow` (11 operaciones atómicas, `appliedOperations: 11`, sin `validationWarnings`):

1. **4 nodos nuevos agregados** (mismo tipo/versión/parámetros que su equivalente en `PRINCIPAL`, verificado campo por campo contra el original, validados con `validate_node_config` antes de aplicar — los 4 `valid: true`):
   - `Es parse_failed?` (IF) — `Build Error Log().error_type == 'parse_failed'`.
   - `Format Error Tecnico Alert` (Set) — arma el texto del mensaje de Slack, mismo formato que `PRINCIPAL`.
   - `Contar no_json Previos` (MongoDB find sobre `agent_errors`, filtrando `contactId` + `error_type: "no_json"`, `limit: 10`) — reusa la misma credencial `MongoDB Carwarriors` que ya usaba `Insert Error Log`.
   - `3+ no_json Seguidos?` (IF) — `$input.all().length >= 3`.
2. **Cableado:** `Insert Error Log` → `Es parse_failed?` → (true) `Format Error Tecnico Alert` / (false) `Contar no_json Previos` → `3+ no_json Seguidos?` → (true, misma entrada) `Format Error Tecnico Alert` → `Send a message`. Cableado idéntico al de `PRINCIPAL`, verificado byte a byte después de aplicar.
3. **`Send a message` habilitado** (`setNodeDisabled: false`) — confirmado en la relectura post-cambio (`disabled: false`, credenciales intactas).

Quedó guardado primero como draft (`versionId` nuevo `00d292c4-a758-455e-bfe7-7b218f91ab69` ≠ `activeVersionId` viejo), publicado después con `publish_workflow` → `activeVersionId` pasó a `00d292c4-a758-455e-bfe7-7b218f91ab69`.

`Insert Error Log` no se tocó — sigue logueando el 100% de los casos en Mongo sin importar Slack, mismo criterio que en `PRINCIPAL`.

## Pendiente real

- Confirmar con tráfico real: que el umbral se comporte igual que en `PRINCIPAL` (1-2 `no_json` sueltos no alertan, el 3ro sí), y que las alertas de spam de Rances Car (reactivadas de paso al habilitar `Send a message`) no generen ruido inesperado ahora que sí llegan a Slack — no se había podido observar su comportamiento real hasta hoy porque el nodo estaba apagado.
- No se investigó si hay otras ramas del workflow que también dependían de `Send a message` estando deshabilitado (se revisaron y son solo las 3 ya mencionadas: error técnico nuevo, spam, spam engagement) — sin sorpresas encontradas, pero vale la pena que Jorge esté atento a los primeros mensajes reales.

---

# 2026-09-07 (continuación) — Construida la cadencia de re-contacto saliente (Intento 1), piloto Carwarriors LLC — DRAFT, sin publicar

Jorge pidió retomar el gap documentado desde el 08-17 (`raw/2026-08-25...arquitectura-migracion`, sección "gap real identificado"): el playbook BDC de Bianca pide llamar/reenganchar a un lead que se queda en silencio (5-8 contactos en 48h), pero nada en el sistema lo hacía — `PRINCIPAL` es puramente reactivo.

## Decisiones tomadas con Jorge antes de construir

1. **Solo WhatsApp/GHL automatizado** — no hay marcador de llamadas conectado; las llamadas reales las sigue haciendo el equipo humano de BDC, sin cambios.
2. **Piloto en un solo dealer** (Carwarriors LLC / `CW`) antes de replicar en Rances Car.
3. **Solo leads nuevos sin respuesta** (que se quedaron callados tras la última respuesta del bot), no leads FRIO ya reactivados.
4. **Hallazgo clave antes de diseñar:** el intake de Carwarriors es 100% reactivo (todo lead entra escribiendo, confirmado en `carwarriors-llc-arquitectura-migracion.md`) — el "contacto instantáneo" (0-2 min) del playbook **ya se cumple hoy** por el simple hecho de que `PRINCIPAL` responde de forma síncrona. Lo único que faltaba construir era la parte de "Seguimiento" (reenganche tras silencio).
5. **Riesgo real identificado y confirmado con Jorge:** WhatsApp Business API y Messenger (IG/FB) solo permiten texto libre dentro de una ventana de **24h** desde el último mensaje del lead — pasada esa ventana se necesita un template pre-aprobado por Meta, que esta cuenta no tiene (confirmado con Jorge: "no tengo idea / probablemente no"). La cadencia completa del PDF (5 intentos en 48h) cruzaría esa ventana en los intentos tardíos. **Decisión: construir solo el Intento 1** ("urgencia directa", el único tramo seguro dentro de la ventana de 24h); los intentos 2-5+ quedan documentados como bloqueados, no construidos.
6. **Ventana de silencio elegida: 1 hora** tras la última respuesta del bot (recomendada por mí, elegida por Jorge sobre 15 min / 3 horas).
7. **No se tocó `PRINCIPAL`** (workflow en producción real, todas las conversaciones reales pasan por ahí) — en vez de agregarle un campo de reset, el estado se rastrea por completo en una colección Mongo nueva (`recontacto_saliente`), manejada solo por el workflow nuevo.

## Diseño y construcción

Workflow nuevo `SEGUIMIENTO SALIENTE - Intento 1 (CW)` (n8n id `Fh4fB5Cgk1hchvxe`), 13 nodos, creado vía `create_workflow_from_code` (Workflow SDK) después de `get_workflow_sdk_reference`/`get_workflow_best_practices("scheduling")`/`search_nodes`/`get_node_types` y `validate_node_config` en cada nodo nuevo (todos `valid: true`) + `validate_workflow` del código completo (`valid: true, nodeCount: 13`).

**Lógica:**
1. **`Cada 15 Min`** (Schedule Trigger).
2. **`Buscar Leads Silenciosos`** (MongoDB find sobre `users`): `dealer: "CW"`, `spam_bloqueado`/`has_reservation` != true, `last_interaction` entre hace 75 y 60 minutos (ventana del ancho del propio schedule, para no reprocesar el mismo lead en cada corrida). Reusa la credencial `MongoDB Carwarriors`.
3. **`Iterar Leads`** (Split in Batches, tamaño 1) — por cada lead candidato:
   - **`Buscar Recontacto Previo`** (MongoDB find sobre la colección nueva `recontacto_saliente`, por `contactId`, `alwaysOutputData: true` para no cortar la cadena cuando nunca se le mandó nada).
   - **`Evaluar Estado Recontacto`** (Set): reconstruye los campos del candidato original (referenciándolo explícitamente por nombre de nodo, no por `$json`, porque el nodo Mongo anterior reemplaza el JSON) y calcula `yaEnviado` comparando el `last_interaction` actual contra el guardado la última vez que se envió un Intento 1 a este contacto — si son iguales, ya se le mandó el reenganche para *este* silencio específico.
   - **`Ya Enviado Para Este Silencio?`** (IF): rama verdadera → vuelve al loop sin hacer nada más; rama falsa → sigue a mandar el mensaje.
   - **`Buscar Credenciales Dealer`** (Data Table `GHL Locations`, mismo patrón que `Get Account Credentials` de `PRINCIPAL`) → **`Buscar Conversacion GHL`** (mismo endpoint/lógica que `Get Contact Phone` de `PRINCIPAL` para detectar canal real) → **`Determinar Tipo Mensaje`** (misma lógica exacta que el nodo `Parameter Type` de `PRINCIPAL`, portada tal cual) → **`Armar Mensaje Intento 1`** (arma el texto bilingüe — español si `language != 'en'` — usando el ejemplo textual del PDF de Bianca: *"¡Hola! Vi que estabas interesado [en el {vehículo}]. Tengo disponibilidad hoy para que lo veas — ¿te queda mejor a las 4pm o a las 6pm?"*, con fallback sin vehículo si `interes_vehiculo` está vacío) → **`Enviar Mensaje GHL`** (POST `/conversations/messages`, mismo patrón que `SEND GHL MESSAGE` de `PRINCIPAL`) → **`Preparar Registro Recontacto`** → **`Registrar Envio`** (MongoDB upsert en `recontacto_saliente` por `contactId`, guarda `last_interaction_relevante` para que la próxima vez que este contacto se quede en silencio sí se le vuelva a mandar el Intento 1).

Verificado con `get_workflow_details` después de crear: cableado idéntico al diseñado (IF con ambas ramas volviendo al loop, `active: false`, `activeVersionId: null`). `create_workflow_from_code` avisó que los 2 nodos HTTP Request no tienen credencial asignada — esperado, la autenticación va por header `Authorization` armado con expresión (mismo patrón sin credential-object que ya usan `SEND GHL MESSAGE`/`Get Contact Phone` en `PRINCIPAL`), no un problema.

## Estado: DRAFT, no publicado a propósito

Es automatización nueva que le manda mensajes reales a leads reales — a diferencia del fix de umbral (que replicaba algo ya probado), acá no hay antecedente en producción. Queda en n8n sin publicar, pendiente que Jorge la revise (contenido del mensaje, ventana de 1h, y el propio diseño) antes de activarla.

## Pendiente real

- Publicar (`publish_workflow`) solo cuando Jorge confirme que el mensaje/diseño le sirve.
- Una vez publicado: confirmar con tráfico real que el Intento 1 sale cuando corresponde y no antes/después de tiempo, y que no se duplica.
- Los intentos 2-5+ del playbook siguen sin construir — bloqueados por la ventana de 24h de Meta hasta que exista un template aprobado.
- Replicar en `PRINCIPAL - Rances Car` solo después de validar el piloto en Carwarriors LLC.

---

# 2026-09-07 (continuación) — Bug real encontrado: el umbral `no_json` del fix de esta mañana enviaba la alerta duplicada 3-6 veces por ejecución

Jorge reportó (molesto, con razón): "me entraron errores en Slack nuevamente, por qué no acabas de solucionar ya eso de los errores, siempre dices que lo solucionas y siguen apareciendo más".

## Diagnóstico (con acceso directo a Slack vía MCP, no adivinando)

Con el MCP de n8n ya confirmado sin ejecuciones en estado `error` hoy, se conectó por primera vez un MCP de Slack (`slack-carwarriors`, agregado por Jorge con `claude mcp add slack-carwarriors --env SLACK_BOT_TOKEN=... --env SLACK_TEAM_ID=T0AQRFA32E8 -- npx -y @modelcontextprotocol/server-slack`, reusando el bot token ya existente "Slack FORJADO") y se leyó el historial real de `#notificaciones` (`slack_get_channel_history`, canal `C0BPV2Z2S3C`).

Encontrado: la alerta `🚨 Error técnico (agendamiento/rsvp)` de un mismo `Execution ID` se estaba enviando **varias veces idénticas, en menos de medio segundo entre copias** — no un reenvío por retry, mensajes de Slack distintos con `ts` distintos pero contenido y `Execution ID` idénticos:

| Execution ID | Contacto | Copias enviadas |
|---|---|---|
| 5080 | `2FR57nBn5gGJw6jTxpy1` | **6** |
| 5078 | `2FR57nBn5gGJw6jTxpy1` | **5** |
| 5074 | `2FR57nBn5gGJw6jTxpy1` | **4** |
| 5072 | `2FR57nBn5gGJw6jTxpy1` | **3** |
| 5065 | `TU71Vhj2CEGXAxvKi873` | **3** |
| 5048 | `mtkjxXZ4jMbBRSh99lCV` | **3** |
| 5026 | `nyszZHA47vr1mOiZZhKJ` | **3** |

## Causa raíz

El nodo `3+ no_json Seguidos?` (agregado en el fix de esta misma mañana) comparaba `{{ $input.all().length }} >= 3`. El problema: un nodo IF de n8n corre **una vez por cada item de su entrada**, no una sola vez por ejecución del workflow. `Contar no_json Previos` (el `find` de Mongo) devuelve **un item por cada documento histórico de `no_json` de ese contacto** — si el contacto ya acumuló 6, el IF recibe 6 items, y en **cada una** de esas 6 corridas `$input.all().length` sigue siendo 6 (mismo array completo, evaluado 6 veces) → 6 evaluaciones `true` → 6 disparos de `Format Error Tecnico Alert` → 6 mensajes idénticos a Slack.

Esto explica exactamente la queja de Jorge: no eran "los mismos errores de siempre sin arreglar" — el umbral de 3+ funcionaba bien para decidir *si* alertar, pero cada vez que alertaba lo hacía multiplicado por la cantidad de veces que ese contacto ya había fallado, y entre más se repetía el problema real, más copias llegaban. El primer intento de fix (esta mañana) nunca se probó con un contacto que de verdad llegara a 3+ — se decidió esperar tráfico real, y el tráfico real expuso este bug en cuanto ocurrió.

## Fix aplicado

Vía `update_workflow`, en `PRINCIPAL` (`Kif9lWwDHvR7TT39`) y `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`, mismo bug heredado aunque no lo había disparado tráfico real ahí todavía):

- Nodo nuevo **`Contar Total no_json`** (Set, `mode: raw`, `jsonOutput: {{ { count: $input.all().length } }}`, **`executeOnce: true`**) intercalado entre `Contar no_json Previos` y `3+ no_json Seguidos?`. Con `executeOnce: true` este nodo corre **una sola vez** sin importar cuántos items le lleguen, colapsando el array a un único item `{count: N}`.
- `3+ no_json Seguidos?` actualizado para comparar `{{ $json.count }} >= 3` (el conteo ya colapsado) en vez de `$input.all().length` (el array crudo, re-evaluado por item).

Verificado con `get_workflow_details` después de aplicar: cableado `Contar no_json Previos → Contar Total no_json → 3+ no_json Seguidos?`, `executeOnce: true` confirmado en el nodo nuevo. Publicado en ambos (`PRINCIPAL` activeVersionId `b9a8c50e-fa9d-46f9-8f90-544ea5c837d8`, `PRINCIPAL - Rances Car` `cb02d604-83d7-4067-8a2e-393897a3a441`).

## Pendiente real

- Confirmar con el próximo contacto real que llegue a 3+ `no_json` que la alerta sale **una sola vez**, no duplicada.
- `Insert Error Log` sigue sin tocarse — el log en Mongo sigue completo al 100% sin importar este bug (el bug era solo de cuántas veces se notificaba a Slack, no de qué se guardaba).

