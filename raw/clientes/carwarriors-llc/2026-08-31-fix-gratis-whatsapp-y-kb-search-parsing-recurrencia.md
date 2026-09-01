# 2026-08-31 — Recurrencia del fix de 08-29: `GRATIS - Send GHL` 422 WhatsApp + `KB - SEARCH` parsing roto, esta vez corregido en la ruta correcta

**Contexto:** Jorge reportó "están llegando notificaciones al correo" sin más detalle. Se investigó desde cero (no se asumió que era el mismo bug ya "arreglado" el 2026-08-29 — ver [[2026-08-29-fix-notificaciones-vacias-y-gratis-whatsapp|raw/2026-08-29]]).

## Hallazgo: el fix del 08-29 no estaba realmente vivo

Revisando ejecuciones con error de `PRINCIPAL` (`Kif9lWwDHvR7TT39`) del día 31 ago, aparecieron 4 fallas idénticas al bug ya documentado como corregido el 08-29: `GRATIS - Send GHL` con 422 `CONVERSATIONS_MSG_NO_PHONE`, siempre con `type: "WhatsApp"` hardcodeado, para leads con `channel: "unknown"` (típico de Facebook/Instagram sin teléfono en GHL). Contactos afectados: Jose Martin Espinoza (`ronDpDYLtvuDy571UiSk`, 21:38), Julia Virginia Socarras Tellez Tellez (`0MBQ6h390ZrfVwSt2W37`, 14:23), Jose Antonio Garcia (`nHH6hiyRACVcnhbKMJVM`, 04:24), Sebastian Solano (`Z72SVHO0dSKpkQhEGTe5`, 00:48).

Al inspeccionar el JSON del nodo `GRATIS - Respuesta`, se encontró la causa: el parámetro vive duplicado — hay un `parameters.assignments.assignments` (array, formato correcto, es el que n8n **ejecuta**) con la lógica simple vieja (instagram/messenger/sms → fallback WhatsApp), y un segundo bloque anidado y huérfano `parameters.assignments.assignments` (objeto indexado `"0"`, sin `id`/`name`/`type`) con la lógica completa y correcta (fallback real vía `Check GHL Last Message` + mapeo de `lastMessageType`). Ese segundo bloque **no es ejecutable** por n8n — es dead code. Todo indica que el fix de 08-29 se escribió ahí por error (probablemente una operación de update que anidó el objeto en vez de reemplazar el array vivo) y nunca tuvo efecto real en producción, aunque el raw de esa fecha lo documenta como "aplicado y publicado".

Se encontró el **mismo patrón exacto** en `KB - SEARCH` → nodo `RESPONSE`: el parseo seguro con regex (el fix documentado el 08-29) también estaba solo en el bloque anidado huérfano; la ruta viva seguía asignando `{{ $json.output }}` directo como objeto sin parsear. Causó una falla real el 31 ago 12:38pm: un lead preguntó por Tesla, el LLM (`deepseek/deepseek-v4-flash`) devolvió texto de razonamiento que degeneró en un loop de repetición de la palabra "response" en vez de JSON limpio, y el Set node tronó con `NodeOperationError` (`'response' expects a object`).

**Lección para futuras ediciones de nodos Set/assignments vía MCP:** verificar después de aplicar un fix que la ruta *viva* (`parameters.assignments.assignments` como array) es la que cambió, no un bloque anidado. Considerar auditar otros nodos Set del sistema por el mismo patrón de duplicación/anidamiento fantasma si se repite un tercer caso.

## Fix aplicado (esta vez en la ruta viva, verificado)

- `GRATIS - Respuesta` (`PRINCIPAL`, `Kif9lWwDHvR7TT39`): reemplazado el campo `type` con la lógica completa (mismo texto que ya usa `Parameter Type` en el flujo principal) directamente en `parameters.assignments.assignments[]`. Publicado (`activeVersionId a3efdf17-9822-4b8b-adde-2e24f887e819`).
- `RESPONSE` (`KB - SEARCH`, `oB2bc9YTIpXqt5zH`): reemplazado el campo `response` con el parseo seguro (regex + fallback a texto truncado) en la misma ruta viva. Publicado (`activeVersionId 08932c77-4bde-4cd1-97ad-604ef2e12f0c`).
- **Nota:** no se tocó `PRINCIPAL - Rances Car` en esta sesión — no se investigó si tiene el mismo bug/mismo patrón de dead code heredado del clon. Pendiente revisar.

## Verificación con tráfico real

Se reenviaron los 4 webhooks originales (mismo `contactId`/mensaje) contra `PRINCIPAL` en modo producción para que esos leads recibieran su respuesta pendiente:

- Jose Martin Espinoza → éxito, `GRATIS - Send GHL` envió el mensaje sin error.
- Jose Antonio Garcia → éxito, mismo resultado.
- Julia Virginia Socarras Tellez Tellez → éxito (no se confirmó explícitamente si volvió a caer en la rama GRATIS).
- Sebastian Solano → éxito, pero esta vez el clasificador barato no lo mandó a la rama GRATIS (fue por el flujo normal) — la reclasificación del LLM no es 100% determinista entre corridas, no es un problema del fix.

Sin errores nuevos en `PRINCIPAL` ni `KB - SEARCH` desde la publicación (revisado explícitamente después).

**Pendiente:** confirmar con un lead nuevo real (no reenviado) que vuelva a activar la rama GRATIS con canal Facebook/Instagram, para blindar contra otra falsa sensación de "arreglado". Revisar si `PRINCIPAL - Rances Car` y otros nodos Set del sistema tienen el mismo patrón de bloque anidado huérfano.
