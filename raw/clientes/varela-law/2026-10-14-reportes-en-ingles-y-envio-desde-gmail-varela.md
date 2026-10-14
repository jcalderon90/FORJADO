---
tags: [forjado, cliente, varela-law, n8n, reportes, slack, gmail]
tipo: raw
cliente: Varela Law
fecha: 2026-10-14
---

# Reportes en inglés y enviados desde el Gmail de Varela Law Remote

Pedido de Mario (2026-10-14, con captura del correo de la agenda de las 6:01 AM): "cambiar los reportes al inglés, tenemos personal que no habla español" y "que salga del correo de varela law remote y no del mío Jorge Calderon". El correo salía por la credencial Outlook `automations@varela.law` (`a0yzNDuRyO9AwgcW`), que en el buzón de Mario aparece como "Jorge Calderon".

## Qué se cambió (publicado el 2026-10-14)

- **Correo:** en los 3 reportes, el nodo Outlook de envío se reemplazó por un nodo Gmail v2.2 con el mismo nombre, la credencial `Gmail account` (`JeoA3ck6F9AaFBSc`, del proyecto `Varela Law <varelalawremote@gmail.com>`), `senderName: "Varela Law"`, HTML y sin la firma de n8n. Destinatario sin cambios: `mvarela@varela.law`.
- **Inglés:** asuntos, títulos, encabezados de tabla, fechas (`en-US`, "(Miami time)", "(all day)"), el texto de Slack ("…and N more. Full details in the email.") y el pie ("Report · …").
  - Agenda `4QsJaKlmHDhkVtBV`, versión activa `484421df`. Asunto: `Agenda for the next 3 days - Deadlines and hearings (…)`.
  - Borrador de avisos `lTVFM7I3wJBpW7we`, versión activa `c3c6558e`. **El mensaje sugerido para el cliente también quedó en inglés** (antes estaba en español); si Mario lo quiere en español para los clientes, se cambia solo esa línea.
  - Facturas vencidas `ZxZONW1XANkoP1ay`, versión activa `b663e243`.
- **Zelle `BruqJ1jdEV9xl5zG`** (versión activa `6bedd2aa`): los dos avisos de `#notifications` en inglés ("Zelle recorded" / "Zelle needs manual review"). El correo de alerta a Jorge sigue en español y sale de Gmail (es interno).

## Sin verificar

- Que la credencial `Gmail account` envíe desde `varelalawremote@gmail.com`: se deduce del proyecto n8n donde vive, pero no se confirmó con un envío. Lo confirma el primer correo real (agenda de mañana 7 AM, si hay eventos).
- Ningún envío de prueba hecho; no se reejecutó nada.

## Pendientes

- [ ] Revisar mañana (2026-10-15) que la agenda de las 7 AM llegó en inglés y con remitente Varela Law (varelalawremote@gmail.com), y que `#reports` publicó.
- [ ] Responder a Mario que quedó hecho.

## Seguimiento

- 2026-10-14: Jorge le avisó a Mario que quedó hecho. Falta que responda en qué idioma quiere el mensaje sugerido al cliente.
- 2026-10-14 (revisión): el borrador de avisos corrió a las 8:30 (ejecución #2805) con la versión anterior (la nueva se publicó a las 10:36 Miami) y con 0 facturas nuevas, así que no envió correo ni publicó en Slack; no sirve como prueba. La primera prueba real sigue siendo la agenda del 10-15 a las 7 AM.
- 2026-10-14: según Jorge, ya hechos: aviso a Mario del 10-13, invitación a `#reports` y `#notifications`, borrado de filas duplicadas del Sheet y envío del mensaje de reconexión de Texto.
