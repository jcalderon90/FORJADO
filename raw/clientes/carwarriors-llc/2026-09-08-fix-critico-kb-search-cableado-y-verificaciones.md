---
fecha: 2026-09-08
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, kb-search, mongo, rag, bug-critico, whatsapp, direccion]
---

# 2026-09-08 (continuación) — Fix crítico: `KB - SEARCH` nunca llegaba a usar sus propios resultados + verificaciones con datos reales

Continuación de la sesión de verificación de pendientes. Se armó un workflow temporal de solo lectura (`TEMP - Verificacion pendientes`, borrado al final) con nodos Mongo directos (colecciones `users` y `chat_histories`, credencial `MongoDB Carwarriors`) para verificar 4 pendientes sin tener que revisar cientos de ejecuciones de n8n una por una.

## Hallazgo crítico: bug de cableado en `KB - SEARCH` (`oB2bc9YTIpXqt5zH`)

Al investigar por qué el guardrail de dirección (fix del 09-01) seguía sin funcionar en un caso real posterior al fix (contacto `W2574trRpnY3S3Khn6ME`, Rances Car, 2026-09-07, preguntó "Dnd están ubicados?" y el bot respondió "no tengo la dirección exacta a la mano"), se encontró la causa raíz real — no era un problema del guardrail ni del prompt, era un **bug de cableado que afecta cada llamada a `kb_search` en ambos dealers, desde siempre**:

- El nodo `Search Context` conecta en **paralelo** tanto a `Knowledge Base` (búsqueda vectorial) como a `Code in JavaScript` (arma el contexto para el LLM).
- `Knowledge Base` (vectorStoreMongoDBAtlas) **no tenía ninguna conexión de salida** — sus resultados (documentos reales encontrados) nunca llegaban a ningún lado.
- `Code in JavaScript` procesaba el item de `Search Context` (que no tiene campo `document`), no el de `Knowledge Base` — así que siempre construía `contexto: "[1] "` (vacío, solo el marcador de cita).
- Confirmado con la ejecución real `4997` (2026-09-07, KB - SEARCH): la búsqueda vectorial SÍ encontró el documento correcto con `score: 0.865` — el texto completo con la dirección real de Rances Car (`3620 NW 27th Ave, Miami, FL 33142`) — pero el LLM recibió `contexto` vacío y respondió que no tenía la dirección a la mano.

**Esto significa que el KB casi seguramente ha estado devolviendo contexto vacío al LLM en TODAS las consultas de `kb_search` desde que este workflow existe** (precios, horarios, financiamiento, dirección, todo) — no solo direcciones. Explica de fondo varios síntomas ya documentados por separado: el guardrail de dirección "no funcionando", y probablemente parte de por qué el agente "a veces inventaba inventario" (09-06) pese al guardrail anti-alucinación en el prompt — el LLM operaba casi siempre con un KB vacío.

### Fix aplicado

Recableado (`update_workflow`, 2 operaciones): quitada la conexión `Search Context → Code in JavaScript`, agregada `Knowledge Base → Code in JavaScript`. Ahora el flujo es secuencial y correcto: `Search Context → Knowledge Base → Code in JavaScript → GENERAL AGENT → RESPONSE`.

### Verificación

No se pudo ejecutar `KB - SEARCH` directamente (su trigger es `executeWorkflowTrigger`, no soportado para ejecución directa vía MCP). Se usó `test_workflow` con `pinData` simulando la salida real de `Knowledge Base` (el mismo documento de dirección que ya se había confirmado real en la ejecución 4997) para verificar que, con el cableado corregido, `Code in JavaScript` sí arma el contexto completo y el LLM responde correctamente:

> "Claro, la dirección de Rances Car Miami es 3620 NW 27th Ave, Miami, FL 33142. ¿Te gustaría agendar una visita o un test drive? 😊"

Publicado (`activeVersionId: 1f8b62bf-2472-4f37-868b-eb1a86c9ffa9`). Confirmado con Jorge antes de publicar (cambio de alto impacto, afecta cada consulta de `kb_search` en ambos dealers).

## Pendiente real

- Confirmar con el próximo caso real (no simulado) que el contexto llega completo — la búsqueda vectorial en sí ya está confirmada sana (ejecución 4997), solo faltaba el cableado, así que el riesgo de que no funcione es bajo, pero no se ha visto un caso 100% real post-fix todavía.
- Revisar si este mismo bug de cableado explica retroactivamente otros síntomas ya cerrados como "resueltos" que en realidad solo se mitigaron a nivel de prompt (ej. el guardrail anti-alucinación de inventario del 09-06) — no investigado todavía.

## Otras verificaciones de esta sesión (con el workflow temporal de Mongo)

- **WhatsApp respondiendo en Carwarriors LLC**: los 5 documentos de `users` con `input_channel: "whatsapp"` son todos contactos de prueba (`contact_test_001`, `contact_test_kb_002`, etc.) — **sigue sin confirmarse un lead real por WhatsApp**, pese a que el canal está activo desde el 09-01.
- **Guardrail de dirección con tráfico real**: encontrados 5 casos reales de leads pidiendo la dirección (`8SpyrYxz8yNzRArNKG8H`, `EWX1A6PO3CSkQzcshBsq`, `WBd05A9jR49jgaJ6ndo1`, `rre2Meoq7tX23TxHTt2l`, `W2574trRpnY3S3Khn6ME`) — todos, incluido el único caso posterior al fix del 09-01 (`W2574...`, 09-07), recibieron una respuesta que **evade dar la dirección** ("un asesor te la dará", "no tengo la dirección exacta a la mano") en vez de darla directamente — exactamente el síntoma causado por el bug de cableado de arriba, ahora corregido. Falta un caso real posterior a este fix para confirmar que ya se resolvió.
- **Sync Tesla/Trade-In con tráfico real** (ver sesión anterior del mismo día): confirmado con un caso real de Tesla (`TESLA CW`), sin caso de Trade-In todavía.
- **Comentarios IG/FB**: workflow `COMENTARIOS-MANYCHAT` (`07BgeGy4vukFJDlu`) sigue en cero ejecuciones reales — la única ejecución nueva desde el 08-31 (`4609`, 09-05) fue la prueba sintética por curl de la auditoría de ese mismo día, no tráfico real. Van 8 días completos sin un solo comentario real.

## Gate de teléfono — parcialmente verificado

La colección `users` **no guarda el teléfono como campo estructurado** (solo queda mencionado dentro de `resumen_ai` en texto libre, ej. "Proporciono su numero 2396921104") — así que no se pudo hacer un cruce limpio contactId↔DealerCenter por Mongo. Además, `search_workflow_executions` con `startDate`/`endDate` **no filtra correctamente ventanas antiguas** (pedí 2026-08-22 y devolvió el mismo lote de ~985 ejecuciones recientes hasta 08-25, ignorando el rango) — limitación de la herramienta a tener en cuenta en futuras verificaciones históricas. La captura del teléfono en sí ya se había confirmado funcionando dentro de la misma conversación en la sesión de hoy (ver ejecuciones de `LEAD - COLLECTOR` revisadas antes), pero el cruce específico "teléfono capturado → sync a DealerCenter disparado" sigue sin confirmarse con un caso reciente y trazable.

## Regresión propia detectada y corregida: alertas de Slack llegando como "undefined"

A pedido de Jorge ("revisa las notificaciones que están llegando a Slack") se revisó el historial real de `#notificaciones` y se encontraron **2 mensajes reales en producción cuyo texto era literalmente `undefined`** (09-08 17:32 UTC, `PRINCIPAL`/CW, ejecución `5233`; 09-08 18:11 UTC, `PRINCIPAL - Rances Car`, ejecuciones `5245`/`5246`).

**Causa: una regresión introducida por mí en el fix de rate-limit del `no_json` de esta misma sesión.** El nodo nuevo `Preparar Marca Alerta` (Set, `mode: raw`) se había escrito como `{{ { _id: ..., alert_sent: true } }}` — reemplazando *todo* el `$json` en vez de solo agregarle esos 2 campos. Como se insertó entre `Format Error Tecnico Alert` (que arma `{text: "..."}`) y `Send a message` (que lee `{{ $json.text }}`), el campo `text` se perdía y Slack recibía literalmente la cadena `"undefined"` en cada alerta de `no_json`/`parse_failed` que pasara el rate-limit — en ambos dealers, desde que se publicó el fix original (~15:45 UTC).

**Fix aplicado de inmediato:** `Preparar Marca Alerta` ahora hace `{{ { ...$json, _id: ..., alert_sent: true } }}` (spread primero, preserva `text`). Publicado en `PRINCIPAL` (`activeVersionId: 2ad888f5-...`) y `PRINCIPAL - Rances Car` (`activeVersionId: a0612c12-...`). Verificado en la ejecución real `5233` que el bug existía exactamente como se describe (campo `text` ausente en `Preparar Marca Alerta`, `Send a message` recibiendo `undefined`).

**Lección:** al insertar un nodo Set en modo `raw` en medio de una cadena existente, siempre hacer spread de `$json` primero salvo que se quiera reemplazar deliberadamente todos los campos — verificado y corregido en menos de 30 minutos desde que se publicó el bug original, pero de todos modos generó 2 alertas reales rotas en Slack antes de detectarse.

### Continuación (mismo día, ~1h después): el primer hotfix estaba roto — 2 bugs reales más, encontrados ANTES de romper nada más

Jorge preguntó explícitamente "¿seguro que está corregido? Siempre aparecen nuevos errores" — con razón: en vez de solo reafirmar, se armó un **workflow de prueba aislado** (`TEMP3`, borrado al final) que reproduce el mismo patrón de 3 nodos, ejecutado en vivo contra Mongo real (colección de prueba dedicada `temp_test_verificacion_fix`, no toca `agent_errors`), para confirmar el hotfix con evidencia real en vez de solo razonamiento. Encontrados **2 bugs reales, ninguno detectado por el hotfix anterior** porque nunca había ocurrido un `no_json` real desde que se publicó:

1. **El spread `{{ {...$json, _id, alert_sent} }}` en modo `raw` lanza `Cannot convert undefined or null to object`** — no es una construcción válida en el contexto de expresión de este nodo. El próximo `no_json` real habría **roto la ejecución completa** (peor que mandar "undefined": ni siquiera se hubiera logueado el error a Slack).
2. **Aunque se arregle el Set, el nodo Mongo `Marcar Alerta Enviada` seguía recortando su output al `fields` configurado (`"_id,alert_sent"`, una lista fija)** — confirmado que un nodo MongoDB `update` en n8n solo devuelve en su output los campos listados en `fields` (menos el `updateKey`), no todo el input. `text` se perdía en este paso sin importar lo que hiciera el Set anterior.

**Fix real (validado con 3 ejecuciones reales en el workflow de prueba antes de tocar producción):**
- `Preparar Marca Alerta`: cambiado de `mode: raw` a `mode: manual` + `includeOtherFields: true` (patrón soportado por n8n para agregar campos sin reemplazar todo, en vez de spread en raw).
- `Marcar Alerta Enviada`: `fields` cambiado de la lista fija a `={{ Object.keys($json).filter(k => k !== '_id').join(',') }}` — mismo patrón dinámico ya usado en `Update User`/`Update Appointment` de estos mismos workflows (por eso esos nodos nunca mostraron este problema).

Publicado en ambos dealers (`PRINCIPAL: activeVersionId 966cf5f8-...`, `PRINCIPAL - Rances Car: activeVersionId b9f6b431-...`). Confirmado con `get_workflow_details` que el config real en producción coincide con lo probado. Pendiente real: seguir sin un caso 100% real (no simulado) que confirme el flujo completo end-to-end, pero el patrón exacto de nodos ya se probó en vivo contra Mongo real.

## Workflow temporal usado y borrado

`TEMP - Verificacion pendientes (borrar despues)` (`2QQD70lC5KjPoZdh`): Manual Trigger + 3 nodos MongoDB (find en `users` por `input_channel`, find en `users` por regex de `last_user_input`, find de muestra en `chat_histories`). Ejecutado una vez (ejecución `5224`), archivado inmediatamente después de extraer los datos.

`TEMP2 - Verificacion gate telefono (borrar despues)` (`1CF6QXcStpDnU8vw`): Manual Trigger + 1 nodo MongoDB (find en `users` por `datos_completos: true`). Ejecutado, archivado después de confirmar que `telefono` no existe como campo estructurado en esta colección.
