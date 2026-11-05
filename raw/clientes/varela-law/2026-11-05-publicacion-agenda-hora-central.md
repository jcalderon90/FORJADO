---
tags: [forjado, cliente, varela-law, n8n, agenda, slack, timezone]
tipo: raw
cliente: Varela Law
fecha: 2026-11-05
---

# Publicación de Agenda en hora Central (Chicago) tras reporte de Mario en Slack

Continuación de [[2026-10-19-agenda-hora-chicago-e-idioma-saludo-texto]]. Mario envió una captura de pantalla de Slack `#reports` donde el reporte de hoy (Nov 5) y ayer (Nov 4) seguía mostrando las horas con la etiqueta `(Miami time)` (ej. `2:30 PM (Miami time)` para la mediación de Abner Valdez).

## Causa raíz
El 2026-10-19 se habían actualizado los nodos `Filter Upcoming (next 5 days)` y `Build Report HTML` para usar `timeZone: 'America/Chicago'` y la etiqueta `(Central time)`, pero los cambios habían quedado guardados en **borrador (draft)** y no se había ejecutado `publish_workflow`. La versión activa en producción seguía siendo la del 2026-10-14 con `America/New_York` y `(Miami time)`.

## Solución aplicada (2026-11-05)
- Verificado vía MCP `n8n-varela_law` que el borrador contenía la lógica correcta (`America/Chicago` y `(Central time)`).
- Ejecutado `publish_workflow` para el workflow `4QsJaKlmHDhkVtBV` (**Radar Billing - Agenda Deadlines y Audiencias (Diario)**).
- **Nueva versión activa en producción:** `af2131eb-0b52-4a2f-b7e3-4bd81f346497` (`activeVersionId == versionId`).
- A partir del próximo disparo diario (7:00 AM America/Chicago), tanto el correo a Mario como los mensajes de Slack `#reports` se emitirán con la hora de Texas y la etiqueta `(Central time)`.
