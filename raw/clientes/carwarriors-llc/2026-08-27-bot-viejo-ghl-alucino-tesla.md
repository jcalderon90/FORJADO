# 2026-08-27 (tarde, más tarde) — Bianca reporta que el bot viejo de GHL inventó que venden Tesla; apagado permanentemente vía API

**Contexto:** Bianca le mandó captura a Jorge de una conversación real (contacto "Simwemba Maiko", canal tipo Messenger/IG) donde, al preguntar por Tesla, un bot respondió **"Tenemos Tesla Model 3 (sedán) y Model Y (SUV); promociones desde $1,000 down y $399/mes"** — información inventada, Carwarriors no vende Tesla. La captura muestra el banner nativo de GHL "Has tomado el control de este chat de tu agente de IA", confirmando que un humano tuvo que intervenir manualmente para corregir: "No manejamos Tesla, pero tenemos otras opciones interesantes."

**Verificación real (no supuesta):** se consultó en vivo la API de GHL Conversation AI (`GET /conversation-ai/agents/search`) para ambas sub-cuentas, usando los PIT documentados en este mismo archivo (tabla de Accesos Centrales). Confirmado:

- **No es el bot nuevo de n8n** (`PRINCIPAL`). Es el bot **legacy nativo de GHL Conversation AI**: agente único por sub-cuenta, `"Asistente Social CarWarriors"` (Carwarriors LLC, id `UFnIBDWtM64QJgjsaGJP`) y `"Agente Social RancesCar"` (Rances Car, id `7d2DMiUdHfLb1uXPFO7F`).
- Esto contradice la suposición previa de que estos bots viejos ya no tenían tráfico real desde la migración a n8n (2026-08-19) — sí lo tenían, al menos este caso.
- El prompt real de ese bot **incluye explícitamente** la regla "Never invent availability" (Inventory Governance) — el LLM se saltó su propia instrucción y alucinó. Es un fallo de modelo, no de diseño de prompt (el prompt está bien escrito).
- Al momento de la consulta, ambos agentes ya aparecían con `mode: "off"` vía API (causa exacta sin confirmar — pudo ser alguien reaccionando al incidente, o ya estaba así desde antes).

**Acción tomada (autorizada por Jorge, "si adelante"):** se reescribió explícitamente vía `PUT /conversation-ai/agents/:agentId` el estado de ambos agentes — `mode: "off"`, `isPrimary: false` — para ambas sub-cuentas, en vez de confiar en el estado heredado. Confirmado con una lectura posterior: ambos quedan `mode: "off"` / `isPrimary: false`.

**Limitación encontrada:** la API rechaza `channels: []` con `422 "At least one channel must be provided"` — no es posible remover completamente los canales como capa extra de seguridad. `mode: "off"` es el único freno disponible por esta vía; si alguien vuelve a poner `mode: "auto-pilot"` o `"suggestive"` desde la UI de GHL, el bot volvería a responder con los mismos 4 canales (IG, FB, WhatsApp, SMS) ya habilitados.

**Pendiente real:** este hallazgo revive el pendiente que estaba "sin fecha" de decidir cuándo apagar del todo los bots viejos de GHL Conversation AI — ya no es de baja prioridad, quedó demostrado que puede dar información falsa a clientes reales. Recomendado a Jorge comunicarle a Bianca que ya está apagado del lado técnico.

## 2026-08-27 (tarde, aún más tarde) — Borrados por completo, no solo apagados

Jorge pidió ir un paso más allá: **borrar los dos agentes por completo** en vez de dejarlos solo en `mode: off`. Ejecutado vía `DELETE /conversation-ai/agents/:agentId` con los mismos PIT — ambos devolvieron `{"success": true}`. Confirmado con una relectura de `GET /conversation-ai/agents/search`: **`totalCount: 0` en ambas sub-cuentas** — ya no existe ningún agente de Conversation AI nativo en ninguno de los dos dealers, ni forma de reactivarlo por accidente desde la UI de GHL (a diferencia de `mode: off`, que sí se podía revertir manualmente). Pendiente cerrado.
