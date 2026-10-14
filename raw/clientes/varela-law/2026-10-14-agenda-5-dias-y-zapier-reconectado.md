---
tags: [forjado, cliente, varela-law, n8n, agenda, zapier, texto]
tipo: raw
cliente: Varela Law
fecha: 2026-10-14
---

# Agenda de 3 a 5 días y captura de "Reconnected" en Zapier

Continuación de [[2026-10-14-reportes-en-ingles-y-envio-desde-gmail-varela]] y de [[2026-10-13-texto-conexion-vencida-otra-vez-bloquea-la-prueba]].

## Agenda: ventana de 3 a 5 días (publicado)

Jorge pidió (con la captura del correo de las 6:01 AM) cambiar "Agenda de 3 días" a 5 días. Workflow `Radar Billing - Agenda Deadlines y Audiencias (Diario)` (`4QsJaKlmHDhkVtBV`), versión activa `dd24e458-5249-4c68-9e10-087d0ad3f588` ("Agenda: ventana de 3 a 5 dias"):

- Filtro: hoy .. hoy+5 días calendario en `America/New_York` (antes hoy+3). El nodo pasó a llamarse `Filter Upcoming (next 5 days)`; las conexiones siguen bien.
- Encabezado del reporte (`Build Report HTML`): "Agenda for the next 5 days — N event(s)/deadline(s)."
- Asunto del correo (`Enviar Agenda a Mario`): `Agenda for the next 5 days - Deadlines and hearings (<fecha>)`.
- La versión de Slack (`#reports`) sale del mismo HTML (el título se toma del `<p>`), así que también dice 5 días; sigue recortada a 15 filas.
- **Se mantuvo en inglés** porque Mario lo pidió hoy para el personal que no habla español (la captura que mandó Jorge era la versión anterior, en español).
- Sin ejecución de prueba; no se envió nada. Con 5 días habrá más eventos por correo que con 3 (el 10-13 con 3 días salía 1 evento).

## Zapier: captura "Reconnected" (sin acción tomada)

Jorge mandó una captura de `connect.zapier.com` desde el celular: **"Reconnected — Your connection has been reconnected."**, conexión **`Mario Varela - Mario Varela Law Firm`** (v1.2.0), Connection ID `02bce20a-b517-831f-9463-70e35f39d36c`. El reloj del teléfono marca 2:08 (sin fecha ni AM/PM).

- Por el nombre y la versión coincide con la conexión de **Texto** que se venció dos veces (10-12 y 10-13); la captura no dice "Texto", así que está deducido, no verificado. No se pudo confirmar por el MCP de Zapier (se necesita el `selected_api` de la app) ni quién reconectó (Mario es el único con acceso a su cuenta de Texto).
- No se probó el Zap ni se activó nada.
- Hay que vigilar si se vuelve a vencer en ~24 h: las dos veces anteriores caducó en ~19-20 h sin que Zapier la refrescara.

## Verificado después (misma sesión)

- **Zapier:** `list_zapier_connections` de Texto devuelve la conexión `02bce20a-b517-831f-9463-70e35f39d36c` (la misma de la captura), `is_stale: false`, creada 2026-10-12 00:21 UTC y **`last_refreshed_at` 2026-10-14 19:08:07 UTC**. Confirma que la captura es de **Texto** y que la reconexión fue el 10-14 ~15:08 hora de Miami (las 2:08 del teléfono serían hora Central). Siguiente chequeo: ver si `last_refreshed_at` sigue avanzando el 10-15 (si se vuelve a vencer, ya van 3 veces).
- **Agenda 5 días:** el filtro se probó en local (Node) con fecha simulada 10-15 7 AM Miami: ventana 10-15..10-20; incluye eventos de todo el día 10-15 y 10-20 y los ISO que caen el 10-20 en hora de Nueva York, excluye 10-14 y 10-21. No se ejecutó el workflow.

## Prueba de `Create Lead` por MCP (2026-10-14, ~19:20 UTC / 3:20 PM Miami)

- Con visto bueno de Jorge ("dale de nuevo"). El primer intento (y un intento de abrir la pestaña `Test` del Zap en el navegador automatizado) fue bloqueado por el clasificador de permisos de Claude Code; al reintentarlo con la instrucción explícita de Jorge pasó. No se usó ninguna otra vía.
- `texto_create_lead` con la conexión `02bce20a-…`, `phoneNumber` `+18327158757` (celular de Mario, el que él indicó para pruebas), `firstName` `Mario`, `lastName` `Prueba`: respuesta `{"results":[{"success":true,"isSampleData":false}]}` (igual que el 10-11: sin id de lead ni datos del mensaje).
- Esto prueba la **conexión**, no el Zap: no pasó por el paso 1 ni por el mapeo de campos del Zap `383180348` (sigue `Draft`, apagado; el editor cargó con la sesión de Mario, el panel de campos no terminó de cargar).
- **Sin confirmar que el SMS llegó** (falta que Mario/Jorge lo digan y la hora). Mario no fue avisado por mí; Jorge debe decírselo si no lo hizo.
- Es un lead real creado en Texto con nombre "Mario Prueba"; puede quedar en su lista de leads.

## Pendientes

- [ ] Confirmar con Mario/Jorge que llegó el SMS de las ~3:20 PM (hora, idioma, firma) y borrar el lead "Mario Prueba" si molesta.

- [ ] 2026-10-15 7 AM: comprobar que la agenda llegó en inglés, con "next 5 days", remitente Varela Law y que `#reports` publicó (es también la primera prueba real del cambio a Gmail del 10-14).
- [ ] Texto/Zapier: confirmar de qué app es la conexión reconectada; si es la de Texto, hacer el `Test step` del Zap `383180348` (envía un SMS real; avisar a Mario) y NO activar hasta que soporte de Texto explique cómo mantener la conexión viva. Ver [[mensajes/consulta-soporte-texto-2026-10-13.txt]].
- [ ] Mario aún no dijo en qué idioma quiere el mensaje sugerido al cliente (borrador de avisos).
