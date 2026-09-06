---
tags: [forjado, cliente, carwarriors, mongo, rsvp, appointments, bug]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-05
---

# 2026-09-05 — Auditoría de leads/appointments en Mongo + calidad de conversaciones: leads sanos, bug real en cancelación/reagendamiento de citas

**Contexto:** Jorge pidió comprobar (1) si los leads se guardan bien en la BD con sus datos, (2) si algún lead llegó a hacer un appointment y si se guardó bien, y (3) analizar conversaciones reales para ver si las respuestas están bien dadas.

**Método:** la credencial Mongo de Carwarriors no es accesible desde el MCP de MongoDB de esta sesión (apunta a otro cluster). Se repitió el patrón ya usado antes (ver `2026-09-01-bot-invento-direccion-fisica-fix-guardrail`): workflow temporal de solo lectura en n8n (`TEMP - Diagnostico Leads/Appointments/Chats Mongo`), webhook → MongoDB find parametrizado desde el body, ejecutado en modo manual vía `execute_workflow` (sin pinning de credenciales). **Archivado inmediatamente después de usarlo.** Para verificar contra la realidad (no solo Mongo) se agregó un segundo nodo HTTP GET a `contacts/{contactId}/appointments` de GHL, usando la credencial real `Header Auth GHL - Carwarriors`. Cero escrituras en todo el proceso.

## 1. Leads (`users`) — sanos

Muestreados 25 leads recientes (2026-09-03 a 2026-09-05, ambos dealers). Se guardan correctamente con datos ricos: `contactId`, `dealer`, `language`, `interes_vehiculo`, `metodo_pago`, `city`, `resumen_ai`, `last_bot_message`, `has_reservation`, etc. El clasificador de spam funciona: 2 de los 25 leads muestreados (mensajes de "7xoxo"/bloggers de WhatsApp) quedaron con `spam_bloqueado: true` correctamente. Nada que corregir de este lado.

## 2. Appointments (`appointments`) — se crean bien, pero **bug real: cancelaciones y reagendamientos nunca llegan al calendario real de GHL**

13 appointments históricos en Mongo, todos con datos de lead/vehículo/fecha bien guardados. Verificado contra GHL en vivo (no solo Mongo) para 3 contactos:

- **Jose Arcos** (`NXusZv8G0wYHmRRDpc5C`): Mongo dice `confirmada: true`, `fecha_hora: 2026-09-05T10:00`. GHL real: evento `kkYRnskLqcQU3PsOJvKR`, `confirmed`, mismo horario. ✅ coincide.
- **Dylan Santiago** (`lKWrJYHpzTEj7Rj8c7Sz`): Mongo dice `cancelada: true, confirmada: false` (el bot le dijo al lead que su cita fue cancelada). **GHL real: el evento `O0PbUXHejy8ASvjccxCv` sigue `appointmentStatus: "confirmed"`, `deleted: false`, fecha 2026-10-15 — la cita real NUNCA se canceló en el calendario de verdad.** ❌ discrepancia confirmada.

**Causa raíz encontrada y confirmada byte a byte (ejecución real `3341` de `RSVP`, 2026-08-30):** ninguno de los 13 appointments tiene el campo `ghl_event_id` guardado (`{ghl_event_id: {$exists:true}}` devuelve 0 resultados), a pesar de que el evento sí se crea correctamente en GHL cada vez (confirmado con `GHL Crear Cita`, que sí devuelve `id` real). El nodo `Guardar Event ID` arma `{_id: d._id, ghl_event_id: $json.id, ...}` tomando `d._id` de `Decidir Accion Calendario`, pero ese nodo solo saca el `_id` de `$('Insert Appointment').first().json._id` o `$('Update Appointment').first().json._id` — ninguno de los dos corre en la ejecución donde realmente se llama a GHL (el appointment ya se había insertado en un turno/ejecución anterior de la conversación), así que `_id` queda `null`. El update de Mongo (`Mongo Guardar GHL Event ID`, filtro `_id: null`) no matchea ningún documento real y falla en silencio (sin error visible, `executionStatus: success`).

**Consecuencia verificada, no teórica:** como `ghl_event_id` nunca se guarda, el gate `IF Tiene Evento GHL` (`!!(Find Appointment.ghl_event_id)`) siempre evalúa `false`:
- **Cancelación:** siempre toma la rama "no tiene evento" (`Preparar Cancelacion Mongo`), que solo marca `cancelada: true` en Mongo y le dice al lead que se canceló, **sin llamar nunca a `GHL Cancelar Cita`**. El caso de Dylan Santiago lo prueba en producción real.
- **Reagendamiento:** en `Decidir Accion Calendario`, `accion: ghlEventId ? 'reagendar' : 'crear'` — como `ghlEventId` nunca existe, la acción **siempre es `'crear'`, nunca `'reagendar'`**. Un lead que pide cambiar su cita no mueve el evento existente — el flujo intenta crear uno nuevo. En la conversación de Jose Arcos (ver sección 3) se ve exactamente este patrón: el agente vuelve a invocar `rsvp` para el mismo lead ya agendado y GHL responde "ese horario ya no está disponible" (porque el propio slot ya estaba ocupado por su cita real) — evitó por suerte un doble-booking ahí, pero el mecanismo de fondo es el problema: no hay reagendamiento real, solo intentos de creación repetidos.

**No confirmado, no verificado en esta sesión:** si `RSVP - Rances Car` tiene el mismo bug heredado (comparte la misma estructura de nodos; no se auditó su código directamente esta vez, solo se infiere por similitud).

**Fix propuesto (no aplicado, pendiente confirmar con Jorge):** en `Decidir Accion Calendario`, agregar un fallback a `$('Find Appointment').first().json._id` cuando `Insert Appointment`/`Update Appointment` no corrieron en la ejecución actual — ese nodo sí corre siempre al inicio de RSVP y tiene el `_id` real del documento existente.

## 3. Calidad de conversaciones — 2 hallazgos reales

Analizadas 2 conversaciones completas de `chat_histories` (memoria del agente, no leads sintéticos):

**a) Jose Arcos (Carwarriors LLC, interesado en Tacoma) — el guardrail de dirección (fix del 09-01) no da la dirección real, solo evita inventar una falsa.** El lead pidió la dirección/número de contacto **8 veces distintas** a lo largo de la conversación ("donde queda eso", "mandame la ubicacion", "dame el numero", etc.), incluyendo mientras decía estar "en camino" y luego "ya estoy en miami" — es decir, un lead real conduciendo hacia el lote sin haber recibido nunca la dirección real (3620 NW 27th Ave). El bot llamó a `kb_search` dos veces con consultas directas de dirección/inventario y ambas veces la herramienta devolvió "no tengo esa información en mi base de datos" — el guardrail evita que el bot invente una dirección falsa, pero **`kb_search` no está devolviendo la dirección real tampoco**, así que el bot solo deflecta repetidamente con "un asesor te contacta por WhatsApp" (frase repetida ~7 veces) sin que haya evidencia de que un asesor realmente haya intervenido. Esto es evidencia real (no solo hipotética) de que el pendiente abierto "confirmar con tráfico real que el guardrail de dirección funciona" **no está resuelto end-to-end** — falta que la dirección real llegue al lead, no solo que no se invente una falsa.

Además, en el mismo hilo: cuando el lead pidió agendar de nuevo estando ya agendado, la herramienta `rsvp` devolvió "ese horario ya no está disponible — el más cercano es sábado 3:10pm, ¿te sirve?" y la respuesta final del agente **ignoró completamente esa información**, respondiendo con la frase genérica de "un asesor te contacta" — el lead nunca se enteró de que su horario pudiera haber cambiado. Bug de calidad: el agente no siempre incorpora el resultado real de sus propias tool calls en la respuesta final.

**b) Lead de Rances Car (mal crédito, repo de una Chevy Silverado) — la memoria de conversación de `PRINCIPAL - Rances Car` guarda el JSON crudo completo del LLM, no solo el texto.** Verificado que esto **no llega al cliente** (el nodo `SEND GHL MESSAGE` usa `Parse response.respuesta.trim()`, ya limpio) — es solo lo que queda grabado en `chat_histories` como memoria propia del agente. Pero eso significa que cada turno nuevo de esa conversación reenvía al LLM, como su propio historial, el JSON completo (`estado_lead`, `accion`, `escalar`, `metadatos`, `depuracion`) de cada respuesta anterior — bloat de tokens que crece con cada mensaje, y riesgo a mediano plazo de que el modelo empiece a imitar ese formato en su respuesta visible (ya hay guardrails de parsing para ese escenario, pero es una fragilidad extra). No es un bug de cara al cliente hoy, es ineficiencia/riesgo a vigilar.

## Pendiente real

- [ ] Decidir con Jorge si aplicar el fix de `Decidir Accion Calendario` (fallback a `Find Appointment._id`) en `RSVP` y `RSVP - Rances Car`, y verificar además si Rances Car ya tiene o no el mismo bug antes de tocar nada.
- [ ] Después del fix: confirmar con una cancelación/reagendamiento real que el evento en GHL sí cambia.
- [ ] Investigar por qué `kb_search` no devuelve la dirección real del lote ante preguntas directas (el dato existe en la KB, confirmado en `2026-09-01-bot-invento-direccion-fisica-fix-guardrail`) — el guardrail actual solo bloquea la invención, no garantiza la entrega.
- [ ] Opcional/no urgente: revisar si vale la pena que `PRINCIPAL - Rances Car` guarde en memoria solo el texto de `respuesta` en vez del JSON completo, para no acumular bloat de tokens turno a turno.

## Actualización (misma sesión) — fix aplicado y publicado en ambos dealers

Con confirmación de Jorge: se aplicó el fix propuesto arriba en `Decidir Accion Calendario` de `RSVP` y `RSVP - Rances Car` — se agregó `if (!_id) { try { _id = existing && existing._id; } catch(e) {} }` como tercer fallback (después de `Insert Appointment`/`Update Appointment`), usando `existing` (`$('Find Appointment').first().json`), que ya estaba definido en el propio nodo y siempre corre al inicio de RSVP. Se confirmó primero que `RSVP - Rances Car` tenía el mismo bug — código idéntico byte a byte en los 4 nodos clave (`Decidir Accion Calendario`, `Guardar Event ID`, `Mongo Guardar GHL Event ID`, `IF Tiene Evento GHL`), y comparte la misma colección `appointments` (la consulta `$exists:true` que dio 0 resultados ya cubría ambos dealers).

Publicado en ambos y verificado byte a byte: `RSVP` (`versionId` y `activeVersionId` ambos `b35c7554-e49a-4b8a-81f9-4795df426ed2`), `RSVP - Rances Car` (`a35b5d68-799e-4e85-91b3-49269b0ab849`), con la línea del fix presente en la versión activa de los dos.

**No se probó con una ejecución sintética.** Al intentar diseñar la prueba controlada se encontró que `RSVP` no se invoca por webhook sino como sub-herramienta del agente `PRINCIPAL` (trigger `executeWorkflowTrigger`, sin contrato JSON simple para invocar directo), necesitaría un contacto real de GHL (uno inventado haría fallar `GHL Crear Cita`), dispararía notificaciones reales a Slack (`notificaciones`) de creación y cancelación para un lead de prueba, y depende del LLM interpretando lenguaje natural para la fecha/hora (no determinístico). Se le presentó esto a Jorge explícitamente y decidió no simular — esperar la próxima cancelación/reagendamiento real para confirmar que `ghl_event_id` se guarda y que el evento en GHL se mueve/cancela de verdad.

## Relacionado

- [[carwarriors-llc]]
- [[2026-08-26-rsvp-token-ghl-vencido]]
- [[2026-09-01-bot-invento-direccion-fisica-fix-guardrail]]
- [[2026-09-01-auditoria-parsing-json-deepseek-rambling]]
