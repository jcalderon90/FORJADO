---
fecha: 2026-09-08
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, slack, notificaciones, principal, rances-car, deepseek, spectrum, bug]
---

# 2026-09-08 — Verificación de fixes del 09-05/09-07 con tráfico real + causa raíz del ruido de "no_json" + rate-limit aplicado

Jorge (Carwarriors) preguntó cómo iba todo. Se hizo un repaso de pendientes y, a pedido suyo, se siguió investigando el más reciente: el ruido de alertas "Error técnico (agendamiento/rsvp)" en Slack que se había dado por "corregido" el 09-07.

## 1. Verificación con tráfico real de fixes recientes

- **Fix `ghl_event_id` (09-05, cancelaciones/reagendamientos → GHL real):** confirmado sano en una ejecución real de creación de cita (RSVP - Rances Car, 09-06 18:29) — `Decidir Accion Calendario` → `GHL Crear Cita` → `Guardar Event ID` → Mongo persistió el campo correctamente (antes nunca se guardaba). Sigue sin verse un caso real de cancelación/reagendamiento para cerrar el ciclo completo, pero el mecanismo de fondo ya está confirmado.
- **Fix de duplicación por `executeOnce` (09-07):** revisando el historial real de Slack (`slack_get_channel_history`, canal `#notificaciones`) se encontraron ráfagas de hasta 23 alertas idénticas para un mismo contacto. Al bajar a la ejecución de n8n detrás de una ráfaga posterior al fix (09-07 22:26 UTC, contato `g6kqzKdgKGXdl7mOw0S2`), se confirmó que **el fix de `executeOnce` sí funciona**: cada ejecución individual genera exactamente 1 alerta. Las ráfagas grandes correspondían a ejecuciones *previas* al fix (ya explicadas) o a una sola conversación con varios turnos consecutivos de `no_json` (una alerta real y distinta por turno, no una duplicación).

## 2. Hallazgo nuevo: el `no_json` está sistemáticamente correlacionado con turnos donde el agente acaba de usar una tool

Se revisaron 6 ejecuciones reales de `no_json` (ambos dealers, distintos contactos, distintos días: `g6kqzKdgKGXdl7mOw0S2`×5 en Rances Car 09-07 18:24-18:29, y una de CW 09-07 16:24 contacto `nyszZHA47vr1mOiZZhKJ`). **Las 6 de 6** ocurrieron justo en el turno donde `PRINCIPAL` (o su clon Rances Car) acababa de llamar una tool (`lead_collector`, `kb_search`, `rsvp`, `send_media`) y, al componer la respuesta final, el modelo (`deepseek/deepseek-v4-flash` vía OpenRouter) devolvió texto plano coherente en vez del JSON de 6 campos obligatorio — no es el bug de "rambling"/JSON repetido ya conocido y corregido el 09-01, es una omisión total del JSON.

Hipótesis: el formato de salida es complejo (6 objetos anidados) y las instrucciones de "qué hacer con la respuesta de una tool" viven en una sección aparte (`MANEJO DE RESPUESTAS DE TOOLS`), sin ningún recordatorio del formato JSON reforzado justo después de una tool call — el modelo tiende a "olvidar" el schema en ese punto específico.

## 3. Comparación con Spectrum Vivienda (bot de Garoo, en producción)

A pedido de Jorge, se investigó `/Users/jorgecalderon/Desktop/PROYECTOS/Garoo/Agent-Spectrum` (2 subagentes Explore) buscando cómo ese bot evita este problema. Resultado, contrario a la premisa inicial:

- **Spectrum sufre exactamente el mismo bug.** Su propio changelog (`docs/estado_proyecto.md`, entrada 2026-07-28) documenta que DeepSeek omitía el JSON en **~9.2% de las conversaciones** (33 de 357 en una semana) — mismo orden de magnitud que Carwarriors. No hay structured output/JSON schema forzado ni reintento al LLM en ningún lado; ambos proyectos dependen de instrucciones de texto puro.
- El JSON de salida de Spectrum es igual o más complejo (7 campos top-level) que el de Carwarriors — descarta "simplicidad del schema" como explicación.
- Lo que Spectrum sí hace bien y que **Carwarriors ya replica**: un parser tolerante (regex `\{[\s\S]*\}` en vez de exigir JSON puro) que, si no encuentra el bloque, usa el **texto real del modelo** como respuesta al lead en vez de un mensaje de error genérico — confirmado en las ejecuciones de Carwarriors revisadas (el lead siempre recibía una respuesta coherente).
- **Diferencia real: Spectrum no alerta a Slack (ni a nada) por `no_json`/`parse_failed` — solo lo inserta en Mongo (`Centralizado.agent_errors`), sin avisar a nadie en tiempo real.** Esto no es superior: el propio historial de Spectrum registra que **37 incidentes de `no_json` se acumularon en 6 días sin que nadie se enterara**, descubiertos solo al revisar Mongo a mano. O sea, el silencio de Spectrum ya causó el problema inverso (ceguera) al que tiene Carwarriors ahora (ruido).

Conclusión: no copiar el silencio de Spectrum. Mantener la visibilidad de Carwarriors pero limitar la frecuencia.

## 4. Fix aplicado: rate-limit de 30 min por contacto en la alerta de `no_json`

Con confirmación explícita de Jorge, se aplicó un ajuste **solo en `PRINCIPAL` (Carwarriors LLC, `Kif9lWwDHvR7TT39`)**, sin tocar `PRINCIPAL - Rances Car` todavía:

- Nodo nuevo **`Chequear Alerta Reciente`** (Code): revisa los documentos que `Contar no_json Previos` ya trae de Mongo (hasta 10, mismo `contactId` + `error_type: "no_json"`) buscando alguno con `alert_sent: true` cuyo `fecha_error` sea de hace menos de 30 minutos. Si encuentra uno, retorna `[]` (0 items) y corta la rama — no llega a `Format Error Tecnico Alert`. Si no encuentra ninguno (o es la primera vez), deja pasar el item y la alerta sigue su curso normal.
- Nodos nuevos **`Preparar Marca Alerta`** (Set) → **`Marcar Alerta Enviada`** (Mongo update, `updateKey: _id`): se intercalaron entre `Format Error Tecnico Alert` y `Send a message` (el nodo Slack compartido). Marcan `alert_sent: true` en el mismo documento que `Insert Error Log` ya había insertado, usando su `_id`, justo antes de mandar el mensaje a Slack — así la próxima vez que este contacto falle en JSON, `Chequear Alerta Reciente` lo detecta.
- **`parse_failed` (error real) no pasa por este gate** — sigue alertando siempre, sin rate-limit, tal como estaba diseñado desde el 09-07.
- **`Insert Error Log` sigue logueando el 100% de los casos en Mongo sin cambios** — el rate-limit solo afecta si se manda o no la alerta a Slack, no el registro.

Validado con `validate_node_config` (3 nodos, todos `valid: true`) antes de aplicar. Aplicado vía `update_workflow` (10 operaciones: 3 `addNode` + 3 `removeConnection`/`addConnection` de reconexión), verificado el cableado resultante con `get_workflow_details` (`3+ no_json Seguidos? → Chequear Alerta Reciente → Format Error Tecnico Alert → Preparar Marca Alerta → Marcar Alerta Enviada → Send a message`), y publicado (`activeVersionId: 115d870f-044f-4908-9223-e6726599383b`).

## 5. Replicado en `PRINCIPAL - Rances Car` (mismo día, tras confirmar el cableado en CW)

Mismo fix aplicado en `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`) con los mismos 3 nodos y el mismo recableado. **Nota operativa:** el primer intento de `update_workflow` colgó (timeout tras 120s+) — se verificó con `get_workflow_history` que no había quedado ninguna versión nueva guardada (atomicidad confirmada, nada a medias) antes de reintentar. El reintento aplicó las 10 operaciones sin warnings. Verificado el cableado con `get_workflow_details` (`3+ no_json Seguidos? → Chequear Alerta Reciente → Format Error Tecnico Alert → Preparar Marca Alerta → Marcar Alerta Enviada → Send a message`) y publicado (`activeVersionId: 7e527ef9-9f4e-4eb3-a190-38f2d8a1996e`).

## 6. Cerrados los 2 gaps restantes de paridad CW↔Rances Car de la auditoría del 09-06

Del pendiente "Misma auditoría (09-06): alertas de spam, rsvp/kb_search sin manejo de fallos, LEAD-COLLECTOR/RSVP sin timeout — replicado solo parcialmente en Rances Car el 09-07" quedaban 2 gaps reales sin cerrar (confirmados con `get_workflow_details`, no solo releyendo el raw):

- **`LEAD - COLLECTOR`** resultó ser un único workflow compartido por ambos dealers (`4r00JFnCyoUpZgXU`, confirmado con `search_workflows` — no existe `LEAD - COLLECTOR - Rances Car`) — el fix de timeout del 09-03/09-06 **ya aplicaba a los dos dealers desde el principio**, no había nada que replicar ahí.
- **Timeout de `RSVP - Rances Car`**: seguía en `timeout:60000/maxRetries:1` en el nodo `OpenRouter Chat Model`, mientras `RSVP` (CW) ya tenía `timeout:90000/maxRetries:2`. Igualado. Publicado (`activeVersionId: 4822f2ee-68e2-40ff-8d0b-211da397dde4`).
- **`kb_search` (tool) en `PRINCIPAL - Rances Car`**: no tenía `onError`/`retryOnFail` configurados, mientras la misma tool en `PRINCIPAL` (CW) sí (`onError: continueRegularOutput`, `retryOnFail: true`, desde el 09-06). Igualado con `setNodeSettings`. Publicado (`activeVersionId: eb1e7bc1-d779-40c4-82a5-7d1de32268a1`).

Con esto, la auditoría del 09-06 queda con paridad completa entre los 2 dealers.

## Pendiente real

- Confirmar con tráfico real, en ambos dealers, que ahora solo llega **una** alerta a Slack por ráfaga de 30 min, no una por turno.
- El hallazgo de que el `no_json` está correlacionado con turnos post-tool-call queda documentado pero sin corregir a nivel de prompt — no hay evidencia (ni en Carwarriors ni en Spectrum) de que un ajuste de prompt lo resuelva de fondo; el LLM (`deepseek-v4-flash`) parece tener una tasa base de omisión del formato tras tool calls que ningún fix de texto ha eliminado en ninguno de los 2 proyectos.
- Confirmar con tráfico real que el timeout de 90s de `RSVP - Rances Car` y el `onError` de `kb_search` en `PRINCIPAL - Rances Car` no rompen nada (mismo patrón ya validado en CW, riesgo bajo).
