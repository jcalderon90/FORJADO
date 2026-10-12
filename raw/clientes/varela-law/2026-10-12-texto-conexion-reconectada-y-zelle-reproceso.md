---
tags: [forjado, cliente, varela-law, zapier, texto, zelle, n8n]
tipo: raw
cliente: Varela Law
fecha: 2026-10-12
---

# Texto: conexión reconectada, prueba del Zap sin hacer; Zelle: cómo reprocesar los 2 pagos

Continuación de [[2026-10-12-texto-conexion-vencida-y-sin-nombre-albert]]. Solo lectura; no se cambió nada ni se envió ningún SMS.

## Texto / Zapier

- La conexión `Mario Varela - Mario Varela Law Firm` tiene ahora `last_refreshed_at` 2026-10-12 19:49 UTC (antes solo el de la creación, 00:21 UTC). Quién la reconectó no está confirmado (probablemente Mario).
- En el editor del Zap `383180348` el paso 2 (`Create Lead`) ya **no** marca la conexión como vencida: Setup, Configure y Test con check; `Test run` y `Publish` habilitados.
- Campos mapeados del paso 2 con la fila de muestra: First Name `Mario`, Last Name `Prueba`, Phone `+18327158757` (celular de Mario), Email vacío. La prueba solo toca el celular de Mario.
- **La prueba del Zap no se pudo hacer desde el navegador automatizado:** el editor tardó más de 90 s en cargar con 40+ errores de consola, el panel Test quedó en blanco y `Test run`/`Publish` volvieron a salir deshabilitados. Hay que hacerla en el navegador de Jorge (`Test step` del paso 2; enviará un SMS al celular de Mario, ya autorizado el 10-12, y puede seguir firmado "Albert").

## Zelle — reprocesar los 2 pagos del 10-09

- Desde la #2748 (10-09) no hay ejecuciones nuevas: no hay correo real de Wells Fargo para probar el parser.
- Datos del Wells Fargo (sacados de la ejecución #2745): remitente `LAW OFFICE OF MARIO VARELA, PLLC`, $1,000.00, fecha 10/08/2026, confirmación `JPM99cz8odsb`, memo `Owner withdrawal`. La IA de esa ejecución (anterior al fix) inventó el número de transacción `6334`; el valor correcto es la confirmación.
- **No se puede reprocesar desde el MCP de n8n:** `test_workflow` simula los nodos con credenciales (Mongo, Sheets, Outlook) y `execute_workflow` no acepta un correo como entrada del trigger de Outlook. Para que queden en Mongo y en el Sheet con su `_id`, hay que ejecutar el workflow desde el editor de n8n con el correo como evento de prueba (o insertar en ambos sitios a mano). Escribir solo en el Sheet los dejaría sin registro en Mongo.

## Intento de reprocesar desde el editor de n8n (2026-10-12 tarde) — no se ejecutó nada

- El nodo `Microsoft Outlook Trigger` filtra: no leídos, de `mvarela@varela.law`, asunto contiene `FW: You received money with Zelle`, polling cada minuto.
- Tenía un evento **fijado** que era un Chase de $200 del 2026-09-22 (trans. `30917208666`), una prueba vieja: ejecutarlo habría duplicado ese pago. Se desfijó y se pulsó `Fetch Test Event`: trajo otro correo, un **Wells Fargo de $1,000 del 2026-08-09 (conf. `BACuj52i1wre`)**, tampoco uno de los dos pendientes. **No se ejecutó el workflow.**
- Hallazgo: hay correos Zelle **no leídos más antiguos** (al menos ese del 08-09). Falta comprobar si ese pago ya está en la pestaña `Aug` del Sheet y en Mongo, o si nunca se procesó.
- **Verificación en la pestaña `Aug` (solo lectura):** el Wells Fargo de $1,000 del 08-09 (conf. `BACuj52i1wre`) **no está registrado**. Lo único del 08-09 es una fila `Wells Fargo | 3000 | 2026-08-09 | Transaction "3000"` (importe distinto, parseo malo de antes del fix), y la fila del 08-27 `Wells Fargo | 400 | Transaction number not found`. Las filas de agosto tienen IDs de Airtable (`rec…`), anteriores a la migración a Mongo. Además hay 3 filas idénticas de Phillip Whittington $400 (08-19, trans. `30469509435`), duplicado viejo. Conclusión: hay correos de Wells Fargo viejos sin leer/mal registrados; el tamaño del atraso solo se ve mirando el Outlook.
- **Filas listas para cargar en la pestaña `Oct`** (formato idéntico al de las filas existentes; la columna ID es el `_id` de Mongo y quedaría vacía si se cargan solo en el Sheet):
  - `PEDRO SANDOVALBECER | $650.00 | Oct 9, 2026 | 31145442877 | PEDRO SANDOVALBECER | (ID vacío)`
  - `LAW OFFICE OF MARIO VARELA, PLLC | $1,000.00 | Oct 8, 2026 | JPM99cz8odsb | Owner withdrawal | (ID vacío)`
  - Datos de las ejecuciones #2746 (Chase, regex con confianza alta) y #2745 (Wells Fargo). La IA de esas ejecuciones dio un modelo de seguridad sin JSON (Chase) y un número de transacción inventado (`6334`, Wells Fargo); por eso se usan los valores del regex/correo.
  - **Cargadas el 2026-10-12 con la autorización de Jorge** (conexión de Zapier `Create Spreadsheet Row`, spreadsheet `1j_2va73Riv9_gmkVbDAKkGq9u661ZldS9BaaAkTNHYQ`, pestaña `Oct`): fila 14 (Chase $650.00) y fila 15 (Wells Fargo $1,000.00). Verificadas leyendo la pestaña: formato idéntico a las filas existentes, sin duplicados. El primer intento había sido denegado por el permiso de la sesión; se repitió tras la autorización explícita.
  - **Quedan fuera de Mongo** (`zelle_payments`): las dos filas tienen la columna ID vacía. **No reprocesar esos dos correos por el workflow** (duplicaría las filas del Sheet); si se quieren en Mongo, insertarlos a mano.
- Segundo intento por el editor de n8n (cargar el correo como evento fijado): la sesión de n8n en el navegador caducó (se retomó con el autocompletado del navegador) y la API interna rechazó las lecturas (401). No se ejecutó nada.
- Efecto colateral: n8n guardó el desfijado como borrador (`updatedAt` 22:03 UTC, versión `8c90f28f`). El diff contra la versión publicada (`e76e3483`) no muestra nodos ni conexiones distintos; producción sigue igual. Solo se perdió el evento fijado de prueba (el Chase de $200 del 09-22).
- Camino pendiente: `Fetch Test Event` solo devuelve un correo no leído arbitrario. Para reprocesar los dos del 10-09 hay que pegar su contenido como evento fijado (los datos están en las ejecuciones #2745 y #2746), o insertarlos en Mongo y Sheets a mano.

## Revisión de salud de los workflows (2026-10-12, solo lectura)

- Sin ejecuciones con `error`/`crashed` salvo la #2731 (prueba manual del workflow de Texto el 10-07, ya conocida).
- `MyCase - Token Manager`: ejecuciones `success` hoy 03:00, 12:00 y 17:00 UTC.
- `Radar Billing - Write Production`: `success` los días 10, 11 y 12 a las 3:00 UTC (~4–6 min).
- `Reporte Facturas Vencidas (Semanal)`: `success` el lunes 10-12 (12:00 UTC) y el 10-05.
- Zelle: última ejecución la #2748 (10-09), sin correos nuevos desde entonces.

## Borradores preparados (no enviados)

- Para Mario: [[mensajes/mensaje-mario-2026-10-12-texto-nombre-del-agente-y-prueba.txt]] (quitar "Albert", la prueba, quién reconectó).
- Para soporte de Texto: [[mensajes/consulta-soporte-texto-2026-10-12.txt]] (vencimiento de la conexión, nombre del agente, marcar "enviado").

## Auditoría de las pestañas `Jul`, `Aug`, `Sep`, `Oct` de `Incoming Zelle Payments` (2026-10-12, solo lectura)

- **`Jul` (53 pagos):** sin filas con datos malos ni duplicados. Solo curiosidades: un `NUBIA TORRES $1.00` (07-17, probable prueba) y dos Johnathan Paredes $500 el 07-24 con transacciones distintas (válidos).
- **`Sep` (40 pagos):** sin duplicados. Una fila mala: `Wells Fargo | 1000 | Sep 4, 2026 | Transaction number not found` (ID `Transaction number not found-2026/09/04/02:00`). Las filas 3–9 tienen IDs con formato intermedio (`transacción-fecha`), de la migración Airtable→Mongo; desde el 09-10 los IDs son `_id` de Mongo.
- **`Aug` (37 pagos):** 3 filas idénticas de Phillip Whittington $400 (08-19, trans. `30469509435`); `Wells Fargo | 3000 | 2026-08-09` y `Wells Fargo | 400 | 2026-08-27 | Transaction number not found`; falta el Wells Fargo $1,000 del 08-09 (`BACuj52i1wre`). Sus IDs son de Airtable (`rec…`).
- **Patrón:** todas las filas "Wells Fargo" anteriores al fix del 10-09 salieron con remitente `Wells Fargo`, importe sin formato y sin número de transacción (parseo malo): 08-09 ($3000), 08-27 ($400) y 09-04 ($1000). Para limpiarlas hay que ver el correo original y decidir con Mario; no se tocó nada.

## Confirmaciones de Jorge (2026-10-12, noche)

- **Mario fue quien reconectó la cuenta de Texto hoy** (según Jorge). Cierra la duda de quién lo hizo: fue una reconexión manual, no un refresco automático. Sigue sin saberse por qué se venció la primera conexión en menos de un día.
- **Jorge ya envió a Mario** el mensaje de [[mensajes/mensaje-mario-2026-10-12-texto-nombre-del-agente-y-prueba.txt]] (quitar "Albert", la prueba después de quitarlo, quién reconectó). **Esperando su respuesta.**

## Pendientes

- [ ] Jorge: `Test step` del Zap en su navegador; luego dejar apagado.
- [ ] Comprobar ~24 h después (2026-10-13 ~20:00 UTC) que la conexión de Texto sigue sin vencerse.
- [ ] Quitar "Albert" del agente de Texto (Mario o soporte) antes de activar.
- [x] Chase $650.00 y Wells Fargo $1,000.00 cargados al Sheet (filas 14 y 15 de `Oct`). [ ] Pendiente opcional: insertarlos en Mongo `zelle_payments` y poner el `_id` en la columna ID.
- [ ] Atraso viejo de Zelle: Wells Fargo $1,000 del 2026-08-09 (conf. `BACuj52i1wre`) sin registrar, fila `Wells Fargo | 3000` del 08-09 y `Wells Fargo | 400` del 08-27 con datos malos, y 3 filas duplicadas de Phillip Whittington $400 (08-19). Hay que mirar el Outlook para saber cuántos correos más hay sin leer.
