---
tags: [forjado, cliente, varela-law, n8n, mycase, produccion]
tipo: raw
cliente: Varela Law
fecha: 2026-10-12
---

# Activadas en producción: Agenda de Deadlines y Borrador de Avisos de Facturas

Continuación de [[2026-08-27-build-5-oportunidades-api]] (oportunidades #3 parcial y #4, construidas el 08-27 y apagadas desde entonces). **Jorge decidió activarlas el 2026-10-12 sin esperar el visto bueno de Mario**, para verlas funcionar y dejarlas corriendo; ambas solo mandan correo a `mvarela@varela.law` (nunca a clientes). Jorge debe avisarle a Mario que le llegarán estos correos; el borrador del mensaje está en [[mensajes/mensaje-mario-2026-10-12-activar-agenda-y-borrador-avisos.txt]] (redactado como pregunta; ajustarlo a "ya están prendidas, avísame si no las quieres").

## Verificación antes de publicar

- Revisada la configuración de ambos (destinatario, zona `America/New_York`, `errorWorkflow` al `ERROR HANDLER`, credencial Outlook `automations@varela.law`, token vía `MyCase - Token Manager`).
- **Borrador de Avisos** (`lTVFM7I3wJBpW7we`): ejecución manual #2773, `success`; 0 facturas nuevas en 24 h, rama sin envío (comportamiento esperado, no manda nada si no hay facturas nuevas).
- **Agenda** (`4QsJaKlmHDhkVtBV`): ejecución manual #2771, `success`, 0 eventos. Se comprobó que MyCase sí devuelve los eventos (125 en total, de 2021 a 2027; 15 desde hoy) y se encontró un **bug**: los eventos de **todo el día** de hoy venían como fecha sin hora (`2026-10-12`), que JavaScript interpreta como las 00:00 UTC, ya pasada cuando corre el workflow a las 7 AM, así que se descartaban (justo los deadlines del día).
- **Corrección** (versión "Fix: incluir eventos de todo el dia de hoy"): el filtro `Filter Upcoming (next 3 days)` ahora compara por día calendario en `America/New_York`, ventana hoy..hoy+3. Ejecución manual #2775, `success`: encontró 2 deadlines de hoy (`MEDIATON OR ADR DEADLINE` de David Reyes – Divorce, y `Deadline for Deficiency Letter` de Egbule, Nnenna – Divorce) y **envió el correo de prueba a Mario** (real).

## Mejoras aplicadas el mismo día (con el visto bueno de Jorge)

- **Agenda** (`Build Report HTML`): la fecha ahora sale legible en español: `lun, 12 de oct de 2026 (todo el día)` o `mar, 13 de oct de 2026, 10:00 a.m. (hora de Miami)` (antes `2026-10-12` / ISO UTC). Sigue incluyendo todos los tipos de evento.
- **Borrador de Avisos** (`Build Draft Messages`): el saludo usa el nombre del cliente sacado del nombre del caso (lo que va antes de ` - `; invierte `Apellido, Nombre`), p. ej. `Hola Nnenna Egbule`; si no hay caso, `Hola,`. Es una heurística: depende de que los casos se llamen `Cliente - Tipo - Expediente`.
- Probadas **sin enviar nada**: primero el código en local y luego con `test_workflow` (datos simulados, nodo de correo simulado): ejecuciones #2777 (agenda: ordena, formatea y deja fuera un evento lejano) y #2778 (avisos: una factura reciente sí, una vieja no).
- Republicadas (las versiones activas pasan a `bc8d41ee…` la agenda y `3c10e7f7…` los avisos). Ojo: tras `update_workflow` sobre un workflow ya publicado hay que volver a publicar para que el cambio corra.
- No se ha visto aún cómo quedan en un correo real: se verá en la ejecución de mañana 7:00 AM (si hay eventos).

## Estado

- Ambas **publicadas** (activas): Agenda 7:00 AM y Borrador de Avisos 8:30 AM, hora de Nueva York, todos los días.
- Agenda: manda solo si hay algo en los próximos 3 días; incluye todos los tipos de evento (Court, Deadline, reuniones, etc.), con la fecha/hora en formato crudo de MyCase (`2026-10-12` o ISO UTC). Mejora posible: formatear la fecha y filtrar por tipo si a Mario le parece mucho ruido.
- Borrador de Avisos: el mensaje sugerido saluda con el **nombre del caso** ("Hola David Reyes - Divorce - ..."), no con el nombre del cliente; solo es borrador para Mario. Mejora posible si lo usa.
- Cualquiera se apaga con `unpublish_workflow` o desde el editor de n8n.

## Pendientes

- [ ] Avisar a Mario de que le llegó un correo de prueba hoy (agenda de hoy con 2 deadlines) y que las dos quedaron activas.
- [ ] Mañana: revisar que corrieron a las 7:00 y 8:30 AM (ejecuciones en modo `trigger`, sin errores) y si Mario respondió algo sobre el formato.
