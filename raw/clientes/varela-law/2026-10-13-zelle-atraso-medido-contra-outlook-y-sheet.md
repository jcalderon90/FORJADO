---
tags: [forjado, cliente, varela-law, zelle, n8n, sheets]
tipo: raw
cliente: Varela Law
fecha: 2026-10-13
---

# Zelle: tamaño real del atraso (Outlook vs Sheet), solo lectura

Continuación de [[2026-10-12-texto-conexion-reconectada-y-zelle-reproceso]]. Se leyó la bandeja de `automations@varela.law` con dos workflows temporales de n8n (ya archivados; Outlook `getAll`, sin marcar nada como leído) y se compararon con las pestañas del Sheet `Incoming Zelle Payments` (`1j_2va73Riv9_gmkVbDAKkGq9u661ZldS9BaaAkTNHYQ`) vía Zapier (solo lectura). La medición fue solo lectura; las correcciones de abajo se aplicaron después con la autorización de Jorge (ver "Aplicado"). Mongo no se tocó.

## Lo que se vio

- 329 correos Zelle reenviados por `mvarela@varela.law` entre 2026-03-07 y 2026-10-13 (Mar 36, Abr 56, May 46, Jun 41, Jul 53, Ago 41, Sep 40, Oct 16). Solo 11 están sin leer.
- **Chase: sin atraso.** Los sin leer de Chase (Cedillo $250 del 04-07; Zapata Castro $200 y Ruiz Esqueda $500 del 09-17; Sandoval $650 del 10-09) **ya están en el Sheet**. "Sin leer" no significa "sin registrar" (las versiones viejas del flujo no marcaban como leído). Los correos Chase sin leer de nov-2025 a feb-2026 también están en el Sheet (con IDs `rec…` de Airtable).
- **Wells Fargo (todos son transferencias de Mario/su firma): 6 pagos distintos, 4 mal o faltantes.**

| Fecha | Monto | Confirmación | Estado en el Sheet |
|---|---|---|---|
| 08-09 | $1,000 | `BACuj52i1wre` | **Falta** (pestaña Aug) |
| 08-09 | $3,000 | `BACyo9715y1x` | Fila 8 de Aug mal: `Wells Fargo \| 3000 \| 2026-08-09 \| 3000` |
| 08-27 | $400 | `BACzr0366hzw` | Fila 35 de Aug mal: `Wells Fargo \| 400 \| 2026-08-27 \| Transaction number not found` |
| 09-04 | $1,000 | `BACzwd52cssa` | Fila 4 de Sep mal: `Wells Fargo \| 1000 \| Sep 4, 2026 \| Transaction number not found` |
| 10-05 | $1,000 | `JPM99cyuc7ds` | **Falta** (pestaña Oct); **no estaba en el inventario anterior** |
| 10-08 | $1,000 | `JPM99cz8odsb` | OK (fila 15 de Oct, cargada el 10-12); sin registro en Mongo |

- Correos duplicados (reenviados varias veces): `BACuj52i1wre` x2, `BACyo9715y1x` x3, `30469509435` (Phillip Whittington $400) x3; en el Sheet, Phillip sigue triplicado (filas 24–26 de Aug).
- Las filas viejas de Chase de enero tienen montos truncados (p. ej. MARIA AMAYA $1,500 -> $150, CHANICE COLON $1,000 -> $100); es el bug de ceros ya corregido en el código el 10-09; no se auditó el resto de meses.

## Propuesta (autorizada por Jorge el 2026-10-13; ver "Aplicado")

1. Corregir en el Sheet las 3 filas malas (Aug 8, Aug 35, Sep 4) con los datos del correo (remitente `MARIO VARELA`, `$X.00`, fecha, confirmación).
2. Añadir las 2 que faltan (08-09 $1,000 y 10-05 $1,000 "Owner withdrawal"). Memo de los correos de octubre: `Owner withdrawal`; los de agosto/septiembre sin verificar el memo.
3. Borrar las 2 filas duplicadas de Phillip Whittington (Aug 25 y 26).
4. Mongo (`zelle_payments`) sigue sin esos pagos; insertarlos a mano o dejarlo (el Sheet es lo que usa Mario).
5. No se necesita marcar correos como leídos: el trigger solo ve correos nuevos.

## Aplicado (2026-10-13, vía Zapier Google Sheets, conexión varelalawremote@gmail.com)

- **Corregidas 3 filas** (solo columnas Sender, Amount y Transaction; fecha, memo e ID intactos): Aug fila 8 -> `MARIO VARELA | $3,000.00 | 2026-08-09 | BACyo9715y1x`; Aug fila 35 -> `MARIO VARELA | $400.00 | 2026-08-27 | BACzr0366hzw`; Sep fila 4 -> `MARIO VARELA | $1,000.00 | Sep 4, 2026 | BACzwd52cssa`. Las tres conservan el memo `No memo provided` y su ID viejo (Sep fila 4 sigue con ID `Transaction number not found-2026/09/04/02:00`).
- **Añadidas 2 filas** al final de su pestaña, con Memo e ID vacíos (el memo no se verificó en los correos): Aug fila 39 -> `MARIO VARELA | $1,000.00 | 2026-08-09 | BACuj52i1wre`; Oct fila 17 -> `LAW OFFICE OF MARIO VARELA, PLLC | $1,000.00 | Oct 5, 2026 | JPM99cyuc7ds`.
- **No se pudieron borrar los 2 duplicados de Phillip Whittington** (Aug filas 25 y 26, la fila 24 es la buena): el conector de Zapier no tiene acción de borrar filas. Borrarlas a mano en el Sheet. (Se evitó vaciarlas para no dejar filas en blanco.)
- **Memo:** los correos de agosto, septiembre y del 10-05 no traen memo; las filas Aug 39 y Oct 17 quedaron con `No memo provided`. Solo el 10-08 trae `Owner withdrawal`.
- **Mongo (`zelle_payments`), inserción única el 2026-10-13** (workflow temporal, ejecución #2797, ya archivado; no se reejecutó): `_id` `6ace87ced5d9537edfebe03c` (Chase Pedro Sandovalbecer $650, trans. 31145442877, 10-09), `…03d` (Wells Fargo $1,000 `JPM99cz8odsb`, 10-08, Owner withdrawal), `…03e` (Wells Fargo $1,000 `JPM99cyuc7ds`, 10-05, sin memo). `rawText` = "Carga manual 2026-10-13 desde el correo de Outlook". Esos `_id` se escribieron en la columna ID del Sheet (Oct filas 14, 15 y 17).
- **No se insertaron en Mongo** los de agosto ni el del 09-04: son anteriores a la migración a Mongo (todo agosto tiene IDs de Airtable `rec…`), igual que el resto del histórico.

## Pendientes

- [x] Memo y Mongo hechos (ver arriba).
- [ ] Borrar a mano Aug filas 25 y 26 (Phillip Whittington duplicado).
- [ ] Opcional: auditar montos truncados de meses anteriores (enero tiene casos).
