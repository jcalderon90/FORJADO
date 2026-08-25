# 2026-08-25 (noche) — Token GHL de RSVP vencido de nuevo, 1 cita real confirmada al cliente pero nunca creada en el calendario de GHL

**Contexto:** chequeo de rutina de ejecuciones en vivo (`n8n-carwarriors`), sin reporte previo del cliente.

**Hallazgo:** ejecución `2378` del workflow `RSVP` (`2trw9S1LM8ttZlFb`, Carwarriors LLC), 2026-08-25 21:57:09 UTC, terminó en error en el nodo `GHL Crear Cita` — `401 Invalid JWT` al llamar `POST https://services.leadconnectorhq.com/calendars/events/appointments`, credencial `Header Auth GHL` (`YCJ3zHy1B4X234DO`).

**Secuencia real (contactId GHL `5AwOYRFGqEHAUEEVHp3G`, lead de una "Llamada Saliente CW ***6659", interesado en cambiar su Mustang):**
1. El lead escribió "voy a salir para allá para verlo y así negociamos" → el agente `RSVP Agent` propuso sábado 29 de agosto 10:00 a.m.
2. El lead confirmó ("Si") → el agente marcó `cita_confirmada: true` y le respondió al cliente: *"¡Perfecto! Tu cita presencial quedó agendada para el sábado 29 de agosto a las 10:00 a.m. Un asesor te contactará para confirmar los detalles."*
3. El workflow guardó la cita en Mongo (`confirmada: true`) y consultó disponibilidad real en GHL (13 slots libres ese día, incluido el 10:00 a.m. pedido).
4. Al intentar crear el evento real en el calendario de GHL (`GHL Crear Cita`, calendario `Df63U68gVBdWZVna0AGi`, asesora Nallely `fsJHUN2otlovodHjJGYP`) — **falló con 401 Invalid JWT**. El token de la credencial `Header Auth GHL` venció otra vez (mismo patrón recurrente que 2026-08-13, 2026-08-18, 2026-08-20).

**Resultado real:** el cliente cree que tiene una cita confirmada para el sábado 29 a las 10am. Mongo dice `confirmada: true`. **El evento nunca se creó en el calendario real de GHL** — ningún asesor lo va a ver ahí. Es el mismo tipo de gap silencioso que motivó la alerta enriquecida de Slack del 2026-08-24 (contacto perdido), pero aquí el problema es la cita, no el mensaje de chat.

**Alerta:** el `ERROR HANDLER` (workflow `ypd1lxqlsa5KXsoy`) se disparó correctamente (ejecución `2379`, éxito) — mandó la alerta tanto a Slack `#notificaciones` como por email a `jcalderon900610@gmail.com` (rama de email agregada el 2026-08-25). **Esto confirma, con un error real, que la nueva rama de email del ERROR HANDLER sí funciona** — cierra el pendiente que quedó abierto el 2026-08-25 de "validar con un error real".

**Sin corregir todavía:**
- Renovar el token de la credencial `Header Auth GHL` (`YCJ3zHy1B4X234DO`) usada específicamente por `GHL Crear Cita`/`GHL Consultar Disponibilidad` en `RSVP` — no confirmado si es la misma credencial que usa `PRINCIPAL`/`SEND GHL MESSAGE` (esos siguen funcionando con éxito, 178 ejecuciones hoy sin error), lo que sugiere que podría ser una credencial GHL distinta específica de RSVP, o con scopes distintos que expiraron por separado.
- Contactar al lead del Mustang (contactId `5AwOYRFGqEHAUEEVHp3G`) para confirmar la cita manualmente, ya que el bot le prometió algo que no quedó agendado de verdad en GHL.
- Revisar si otras citas de `RSVP` fallaron de la misma forma desde que este token expiró (no se investigó el rango completo, solo esta ejecución puntual).
