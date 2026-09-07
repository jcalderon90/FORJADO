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

