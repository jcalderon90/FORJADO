---
tags: [forjado, cliente, carwarriors, n8n, bug, openrouter, timeout, fix]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-03
---

# 2026-09-03 — 4 timeouts de 10 min en OpenRouter (LEAD - COLLECTOR); timeout corto agregado en 6 workflows

**Contexto:** Jorge reportó estar recibiendo notificaciones de error de los agentes de Rances Car y Carwarriors. Se auditó via MCP `n8n-carwarriors` (reconectado al inicio de la sesión, estaba caído).

## Diagnóstico

`search_workflow_executions` mostró 4 ejecuciones en error de `LEAD - COLLECTOR` (workflow compartido por ambos dealers) en las últimas ~14h: 2026-09-02 12:38 (CW), 17:13 (CW), 20:36 (CW), 2026-09-03 02:40 (RANCES). Las 4 con el mismo error exacto: nodo `Lead Agent` → `OpenRouter Chat Model` (`deepseek/deepseek-v4-flash`) — `NodeApiError: Request timed out.` tras ~600000ms (10 min) exactos, sin timeout configurado en el nodo (usa el default de la SDK).

**Impacto real en el lead:** `lead_collector` está conectado como `ai_tool` del agente `PRINCIPAL` (tool-calling síncrono) — cuando el tool se cuelga, el agente principal queda bloqueado ese tiempo completo antes de recuperar y responder. Confirmado con la ejecución padre `4231` (`PRINCIPAL - Rances Car`): terminó en `status: success` con una respuesta real y coherente (`"Great for daily driving! When are you looking to get it — this week or next month?"`), pero tardó los mismos ~10.5 minutos en total — el lead sí fue atendido, pero con ~10 min de demora en vez de segundos. Ejecuciones exitosas del mismo workflow en el mismo período tardan 4-41s (máximo real observado: 41.1s).

**Causa probable de fondo:** degradación intermitente del lado de OpenRouter/proveedor de `deepseek-v4-flash` (no un bug de nuestro código) — coincide con reportes públicos de degradación de este modelo específico. No hay forma de arreglar eso desde nuestro lado; sí hay forma de que el sistema se recupere rápido en vez de bloquear al lead 10 minutos.

## Fix aplicado

Se agregó `options.timeout: 60000` (60s, con margen sobre el máximo real observado de 41s) y `options.maxRetries: 1` al nodo `OpenRouter Chat Model`/`OpenRouter Chat Model2` (mismo modelo, sin timeout configurado) en los 6 workflows que lo usan:

1. `LEAD - COLLECTOR` (`4r00JFnCyoUpZgXU`, compartido ambos dealers) — el que realmente falló.
2. `PRINCIPAL` (`Kif9lWwDHvR7TT39`) — preventivo, es el LLM del agente principal en sí (sin fallback si se cuelga, a diferencia de un tool).
3. `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`) — preventivo, mismo motivo.
4. `KB - SEARCH` (`oB2bc9YTIpXqt5zH`, compartido ambos dealers) — preventivo, mismo modelo sin timeout.
5. `RSVP` (`2trw9S1LM8ttZlFb`) — preventivo, mismo modelo sin timeout.
6. `RSVP - Rances Car` (`lFiO37FkvMmGUsdi`) — preventivo, mismo modelo sin timeout.

**Gotcha de MCP (ya documentado antes, se repitió):** el primer `update_workflow` (`updateNodeParameters`) reporta éxito pero solo actualiza el *draft* — la versión activa (la que corre en producción) queda intacta hasta publicar explícitamente con `publish_workflow`. Se publicaron los 6 y se verificó **byte a byte** con `get_workflow_version` sobre el `activeVersionId` resultante que `timeout: 60000, maxRetries: 1` quedó en la versión realmente corriendo, no solo en el draft.

## Verificación

Búsqueda de ejecuciones en error desde 2026-09-03T00:00 tras el fix (publicado ~12:34 UTC): solo aparece la ejecución `4232` (la de las 02:40, previa al fix). Cero errores nuevos desde entonces — pero no ha pasado tráfico suficiente todavía para confirmar con un stall real de OpenRouter que el timeout corto efectivamente recorta la demora de 10 min a segundos.

## Verificación adicional con prueba real (post-fix, 2026-09-03 ~12:39 UTC)

Con un `contactId` de prueba claramente ficticio (`test-verif-fix-openrouter-01`, no corresponde a ningún contacto real de GHL), se ejecutó `PRINCIPAL - Rances Car` end-to-end simulando un lead real preguntando el precio de un Honda Civic — mismo código, mismo webhook, sin tocar datos de clientes reales.

**Resultado: el bot respondió correctamente** — aplicó el gate de teléfono como está diseñado: *"¡Hola! Antes de darte info del Civic, ¿me ayudas con tu número de teléfono para pasarte los detalles completos?"*. Tiempos de los nodos OpenRouter con el fix ya activo: `OpenRouter Chat Model` (LEAD-COLLECTOR) 9.2s, `OpenRouter Chat Model2` (agente principal) 7.8s, agente `PRINCIPAL` completo 14.1s — todos muy por debajo del nuevo límite de 60s, confirmando que el timeout corto no corta llamadas normales. Sin errores.

## Pendiente real

- [ ] Sigue faltando ver el fix actuar ante un stall *real* de OpenRouter (la prueba de arriba confirma que no corta llamadas normales, pero no reprodujo un colgado real — eso solo se confirma si vuelve a pasar en producción).
- [ ] Si los timeouts de OpenRouter siguen siendo frecuentes, evaluar fallback a un segundo modelo/proveedor en el mismo nodo (multi-provider failover) en vez de solo fallar rápido.

## Relacionado

- [[carwarriors-llc]]
- [[2026-08-29-fix-notificaciones-vacias-y-gratis-whatsapp]]
- [[2026-09-01-auditoria-parsing-json-deepseek-rambling]]
