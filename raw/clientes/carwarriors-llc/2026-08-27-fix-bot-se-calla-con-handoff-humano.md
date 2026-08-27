# 2026-08-27 (tarde) — Construido y publicado: el bot se calla cuando un humano toma control de la conversación

**Contexto:** primero de los 4 frentes pedidos por Jorge hoy (ver `2026-08-27-requerimientos-jorge-4-frentes.md`). Nallely reportó que el bot seguía respondiendo en paralelo cuando ella atendía manual a un lead.

**Investigación real (no supuesta) antes de construir:** se probó en vivo `GET /conversations/{id}/messages` contra una conversación real de producción (Máximo Ferrufino, `rr4FvDLlQ9D51MxGok4J`) con un workflow temporal de diagnóstico (`TEMP - Debug Conv Messages`, borrado después de usarlo). **Hallazgo clave:** GHL no distingue en absoluto entre un mensaje mandado por un humano desde la UI y uno mandado por el bot vía API — ambos quedan con el mismo `userId` (el asesor asignado a la conversación) y `source: "app"`. Los campos que parecían candidatos (`assignedTo`, `lastOutboundMessageAction`) tampoco sirven: siempre dicen "manual" sin importar quién mandó el mensaje realmente. Conclusión: la única forma confiable es que el bot lleve registro de lo que él mismo mandó, y comparar contra el último mensaje saliente real de la conversación.

**Decisión de Jorge:** ventana de silencio de **2 horas** — si un humano escribió y no vuelve a hacerlo en 2h, el bot retoma solo el lead.

**Construido y publicado en ambos dealers** (`PRINCIPAL` `Kif9lWwDHvR7TT39` y `PRINCIPAL - Rances Car` `N68IYzm4Bf6AVTXP`, estructura idéntica en ambos, 16 operaciones aplicadas a cada uno sin warnings):
1. **`Check GHL Last Message`** (nuevo, HTTP GET a `/conversations/search`, mismo patrón/token dinámico que el ya existente `Get Contact Phone`) — insertado justo después de `Find User`, antes de `If USER NOT EXIST`, para no gastar la llamada al LLM si el bot se va a callar.
2. **`Human Took Over?`** (nuevo IF, 3 condiciones AND): último mensaje saliente real es `outbound` AND su body no coincide con `last_bot_message` guardado en Mongo AND pasaron menos de 7,200,000 ms (2h) desde ese mensaje.
3. Rama verdadera → **`Bot Silenced - Human Active`** (NoOp, termina la ejecución sin responder). Rama falsa → sigue el flujo normal hacia `If USER NOT EXIST` (sin cambios de comportamiento).
4. **`Build Last Bot Message` → `Save Last Bot Message`** (nuevos, Set + Mongo update por `contactId`) — insertados después de `SEND GHL MESSAGE` (rama de éxito), antes de `Calculate Respond Time`, para que el bot recuerde el último mensaje que él mismo mandó y pueda comparar la próxima vez.

**Fail-safe:** si la llamada a `Check GHL Last Message` falla (token vencido, red, etc.), `onError: continueRegularOutput` hace que la condición 1 (`lastMessageDirection === 'outbound'`) quede indefinida/falsa → el bot sigue respondiendo normal (nunca se queda mudo por un error técnico).

**Publicación:** Rances Car se publicó sin problema. `PRINCIPAL` (Carwarriors LLC, el bot con más tráfico real) fue bloqueado por el clasificador de permisos de la sesión al ser el workflow más sensible — se le explicó a Jorge y confirmó ("si adelante"), publicado después con su autorización explícita.

**Verificado:**
- Estructuralmente: se releyeron ambos workflows post-edición, wiring y parámetros correctos, sin warnings de `update_workflow`.
- Con lógica real: el hallazgo de campos (`lastMessageDirection`, `lastMessageBody`, `lastMessageDate` en epoch ms) viene de una llamada real a producción, no inventado.
- **Pendiente real:** no hubo tráfico real nuevo en los ~4 minutos después de publicar (última ejecución real de `PRINCIPAL` antes de publicar fue las 12:52 UTC, publish fue ~16:40 UTC) para confirmar el flujo completo end-to-end con un lead real. Falta revisar las próximas ejecuciones reales de ambos dealers para confirmar que nada se rompió (ninguna alerta de error a Slack esperada si todo va bien).

**Sin tocar todavía:** los otros 3 frentes de hoy (comentarios de IG/FB, ticket a DealerCenter, notificaciones SMS de leads calientes).
