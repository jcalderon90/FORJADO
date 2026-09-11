---
tags: [carwarriors, n8n, slack, notificaciones, principal, rances-car, deepseek, openrouter, manychat, chequeo-salud]
tipo: sesion
fecha: 2026-09-11
---

# 2026-09-11 — Chequeo de salud general, remoción de alerta Slack no_json/parse_failed, responseFormat json_object

## 1. Chequeo de salud general (a pedido de Jorge: "comprueba que todo de Carwarriors esté funcionando bien")

Revisión completa vía MCP `n8n-carwarriors` + `slack-carwarriors`:

- **Ejecuciones con `status: error` en toda la instancia desde el fix del 09-10 23:07/23:08 (BSONError Rances Car + bug multi-dealer): cero.** La última ejecución con error real fue la `id 5748` (09-10 19:35, `LEAD - COLLECTOR`, el bug de `Nuevo Match Multi-Dealer?` ya documentado y corregido ese mismo día).
- **196 ejecuciones reales entre el publish del 09-10 y las 15:45 del 09-11, todas `success`** — incluye `PRINCIPAL` (webhook), `LEAD - COLLECTOR`, `KB - SEARCH`, `SEGUIMIENTO SALIENTE - Intento 1 (CW)`, y una tanda completa de `Subir a DealerCenter` (sync de inventario, ~80 ejecuciones a las 12:30-12:31).
- **Revisión de `#notificaciones` (Slack):** las únicas alertas de `:x: Error en workflow:` visibles en el historial reciente son de **antes** del fix del 09-10 (`PRINCIPAL - Rances Car` BSONError, `LEAD - COLLECTOR` bug boolean) — ninguna nueva desde entonces.
- **3 alertas de "Error técnico (agendamiento/rsvp)" tipo `no_json` el mismo 09-11** (11:59, 14:05, 15:32 — ejecuciones 5857, 5956, 5972 de `PRINCIPAL`). Verificadas leyendo el contenido real de cada ejecución (`get_workflow_execution` con `includeData`): en los 3 casos el lead recibió una respuesta coherente y útil (Tesla Model Y, Hummer H1 x2) — el agente solo "olvidó" envolver la respuesta en el JSON interno esperado, comportamiento ya conocido y medido del modelo (~9-10% tras un tool-call), no un fallo real.

**Barrido del resto de workflows activos (18 en total), todos sanos:**

| Workflow | Última ejecución al momento del chequeo | Estado |
|---|---|---|
| `VECTORIZAR - KB` | 09-11 05:30 (diario) | ✅ |
| `KB - SEARCH` | 09-11 14:04 | ✅ |
| `DealerCenter -> Mongo -> GHL (Lead Sync)` | 09-11 12:30 (diario) | ✅ |
| `Subir a DealerCenter` | 09-11 12:31 (1045 ejecuciones históricas) | ✅ |
| `RSVP - Rances Car` | 09-10 16:27 | ✅ |
| `MONITOR - Gmail Credential Check` | 09-07 (semanal, lunes) | ✅ (próxima 09-14) |
| `DealerCenter -> Slack (Reporte Mensual)` | sin ejecuciones aún | ✅ normal — dispara el día 1 de cada mes, activado 09-04, primer disparo real será 01-oct |
| `LEAD - COLLECTOR` | 09-11 15:36 | ✅ |

**2 hallazgos sin resolver, marcados para seguimiento:**

1. **`RSVP` (Carwarriors, no Rances)** — última ejecución 09-08 23:24, sin citas nuevas/canceladas en CW en 3 días. Workflow activo y sin errores; simplemente no hubo tráfico de agendamiento en ese lapso para ese dealer. No es una alarma por sí sola, solo una ausencia de actividad a monitorear.
2. **`COMENTARIOS-MANYCHAT`** — última ejecución **09-05 22:03, 6 días sin actividad**. El workflow de n8n está activo y sin errores, pero depende de que el flujo "Respuesta Comentarios" siga corriendo del **lado de ManyChat** — y ya hubo un incidente antes (09-08/09-09) donde ese mismo flujo llevaba parado desde ≈09-02 sin generar ningún error visible en n8n (simplemente nunca lo llamaban). Intenté verificar de nuevo conectando vía Playwright CDP al Chrome de Jorge (mismo método usado en la auditoría del 09-09), pero Chrome no estaba corriendo con remote debugging habilitado en este momento (`Could not connect to chrome: DevToolsActivePort file not found`). **Pendiente real: confirmar con Jorge (directo en ManyChat, o dejando su Chrome con `--remote-debugging-port=9222` para reintentar vía Playwright) que "Respuesta Comentarios" sigue LIVE con el disparador habilitado.**

## 2. A pedido de Jorge: dejar de alertar a Slack por `no_json`/`parse_failed`, guiarse por el modelo de Spectrum

Jorge pidió explícitamente: solo quiere en Slack (a) nuevo lead registrado, (b) appointment/cita agendado, y (c) fallos reales de workflow vía el `ERROR HANDLER` — nada de la alerta custom "Error técnico (agendamiento/rsvp)".

**Verificado antes de tocar nada:**
- **Nuevo lead** y **cita agendada/cancelada** ya se notificaban correctamente — vía `PRINCIPAL`/`RSVP` → `Notifications Master` (workflow `NOTIFICATIONS`, `oz7EabosHGTXtTjr`) → Slack `#notificaciones`. No hizo falta tocar nada ahí.
- **`ERROR HANDLER`** (`ypd1lxqlsa5KXsoy`) ya existe y funciona: `Error Trigger` nativo de n8n → Slack + email a `jcalderon900610@gmail.com`. Tanto `PRINCIPAL` como `PRINCIPAL - Rances Car` ya tienen `settings.errorWorkflow: ypd1lxqlsa5KXsoy` configurado — los crashes reales ya disparan esto sin cambios.
- **Comparación con Spectrum** (releída del hallazgo ya documentado el 09-08): Spectrum sufre el mismo bug de `no_json` en la misma magnitud (~9.2%), pero **no alerta a Slack por eso — solo loguea a Mongo (`Centralizado.agent_errors`) en silencio.** Ese silencio no es superior: el propio historial de Spectrum registra 37 incidentes acumulados en 6 días sin que nadie se enterara. El patrón correcto a copiar es "logueá en Mongo, no alertes a Slack por esto", no "no te enteres nunca".

**Cambio aplicado (ambos, `PRINCIPAL` y `PRINCIPAL - Rances Car`):**
- Se cortaron 2 conexiones: `Es parse_failed?` (salida 0, rama true) → `Format Error Tecnico Alert`, y `Chequear Alerta Reciente` → `Format Error Tecnico Alert`. Esto desconecta por completo el camino hacia `Preparar Marca Alerta` → `Marcar Alerta Enviada` → `Send a message` (Slack) para ambos tipos de fallo (`parse_failed` y `no_json`).
- **`Insert Error Log` (Mongo, colección `agent_errors`) queda intacto** — sigue registrando el 100% de los casos, solo dejó de avisar en tiempo real.
- `Format Error Tecnico Alert`/`Preparar Marca Alerta`/`Marcar Alerta Enviada` quedan como nodos huérfanos (sin conexión de entrada) — advertencia `DISCONNECTED_NODE` esperada y aceptada, no se borraron los nodos por si se quiere revertir fácil.
- Validado con `update_workflow` (sin errores de validación nuevos, solo warnings pre-existentes no relacionados) y publicado en ambos: `PRINCIPAL` → `activeVersionId: 43b0f439-aa11-4776-ab78-8031ddbbd8fe`; `PRINCIPAL - Rances Car` → `activeVersionId: 388bf52f-93d8-4d3b-8519-2b0fd68fb4ce`.

## 3. A pedido de Jorge: probar si forzar JSON estructurado (`responseFormat: json_object`) reduce el `no_json` de raíz

Jorge preguntó si probar el modelo `deepseek-v4.1-flash` (existe en OpenRouter, confirmado vía WebSearch: `deepseek/deepseek-v4.1-flash`). Se le presentaron 2 opciones (cambiar de modelo vs. forzar `responseFormat: json_object` en el nodo `OpenRouter Chat Model`, que expone esa opción nativa) — **eligió forzar `responseFormat: json_object`, sin cambiar de modelo.**

**Cambio aplicado:**
- `options.responseFormat: 'json_object'` agregado al nodo `OpenRouter Chat Model` (el que alimenta al AI Agent `PRINCIPAL` — el que produce la respuesta estructurada). **No se tocó** `OpenRouter Chat Model2` (alimenta `Lenguaje & Asesoria`, un extractor de idioma/asesoría distinto, no relacionado con este problema).
- Aplicado y publicado en ambos: `PRINCIPAL` → `activeVersionId: 16528b1e-d076-41fd-9584-a3e356f4e5fd`; `PRINCIPAL - Rances Car` → `activeVersionId: 28b2ef9a-30f7-4a79-835d-72c1548c51f3`.
- **No se probó de forma sintética antes de publicar** — construir un webhook de prueba fiel al `PARSE BODY`/`Create Body` de `PRINCIPAL` sin generar un lead falso en Mongo/GHL hubiera tomado más tiempo del que vale la pena para un cambio de este tamaño; se optó por el mismo criterio ya usado antes en este proyecto para `RSVP` (monitorear con tráfico real en vez de simular contra servicios reales).
- **Riesgo identificado a vigilar:** `responseFormat: json_object` a veces interactúa mal con agentes de tool-calling (algunos providers se comportan raro en el turno donde el modelo necesita llamar una herramienta en vez de responder texto). Pendiente confirmar con el primer caso real que el agente llame a `rsvp`/`kb_search`/`send_media` sin problema bajo el nuevo modo.

**Verificación inicial con tráfico real (mismo día, minutos después del publish):** 3 ejecuciones nuevas de `PRINCIPAL` (mismo lead, teléfono `50571648`, Cuba) — ejecuciones 5987 y 5988 mostraron el JSON completo parseado sin caer en `no_json` (`Parse response` extrajo `respuesta`, `estado_lead`, `accion.tipo`, `escalar`, `metadatos`, `depuracion` sin ningún `error: no_json`). Detalle curioso sin impacto funcional: el modelo sigue devolviendo el texto de la respuesta duplicado (una vez en texto plano, otra vez dentro del JSON) — no rompe el parseo (ya es tolerante a esto, patrón ya visto también en Spectrum), pero infla tokens de entrada (~17,300 en estos casos, aunque puede deberse al historial de memoria de esa conversación puntual, no necesariamente al cambio). **Pendiente real: seguir confirmando con más tráfico, en particular el primer caso donde el agente deba llamar a una herramienta bajo el nuevo modo, antes de dar esto por cerrado.**

## Pendientes que quedan abiertos después de esta sesión

- [ ] Confirmar con Jorge (o vía Playwright con su Chrome en modo remote debugging) que "Respuesta Comentarios" en ManyChat sigue LIVE — 6 días sin ejecuciones en `COMENTARIOS-MANYCHAT`.
- [ ] Seguir monitoreando `responseFormat: json_object` en `PRINCIPAL`/`PRINCIPAL - Rances Car` con más tráfico real, especialmente turnos con tool-calling.
- [ ] Confirmar que la remoción de la alerta Slack de `no_json`/`parse_failed` no deja a nadie "ciego" ante una regresión real — el log en Mongo (`agent_errors`) sigue siendo la única fuente si se quiere auditar volumen más adelante.
