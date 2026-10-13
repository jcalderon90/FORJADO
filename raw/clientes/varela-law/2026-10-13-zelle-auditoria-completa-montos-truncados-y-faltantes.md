---
tags: [forjado, cliente, varela-law, zelle, n8n, sheets, auditoria]
tipo: raw
cliente: Varela Law
fecha: 2026-10-13
---

# Zelle: auditoría completa Outlook vs Sheet (nov-2025 a oct-2026), solo lectura

Continuación de [[2026-10-13-zelle-atraso-medido-contra-outlook-y-sheet]]. Un workflow temporal de n8n (manual, solo lectura, ya archivado; ejecución #2799) leyó todos los correos Zelle desde 2025-11-01 y las 11 pestañas del Sheet (`2025`, `Jan`…`Oct`) y los cruzó **por número de transacción / confirmación**. La auditoría fue solo lectura; las correcciones se aplicaron después con la autorización de Jorge (ver "Aplicado"). (Un primer intento, #2798, dio un resultado falso porque el nodo de Sheets leyó siempre la misma pestaña; se descartó.)

## Resultado

- 514 pagos distintos en correo (deduplicados por transacción) contra 580 filas en el Sheet (2025: 134, Jan 44, Feb 64, Mar 48, Apr 56, May 46, Jun 41, Jul 53, Aug 38, Sep 40, Oct 16).
- **79 filas con el monto truncado a la décima parte** (el Sheet tiene $1,000 -> $100, $2,500 -> $250, $1,918.80 -> $191, $1,105.25 -> $110, etc.). Siempre pagos de 4 cifras o más; es el bug de ceros que se corrigió en el código el 10-09. Por pestaña: 2025 14, Jan 11, Feb 17, Mar 11, Apr 7, May 11, Jun 8; **Jul en adelante, ninguno**. Total real de esas 79 filas ≈ $125,600; en el Sheet figuran ≈ $12,560 (subestimado ≈ $113,000; cálculo a mano sobre la lista, no exacto al centavo). Incluye 4 transferencias de MARIO VARELA de junio (Jun filas 9, 10, 28 y 29: $3,500, $2,000, $3,500 y $2,700 figuran como $350, $200, $350 y $270).
- **20 pagos de Chase sin fila en el Sheet**, todos del 2025-11-19 al 2025-12-04 (el flujo se creó el 11-23 y se afinaba): suman ≈ $14,730. Transacciones: 27020790534, 27029139256, 27030113149, 27031964783, 27033841494, 27040992751, 27041982925, 27044477245, 27055222261, 27064991256, 27078722091, 27091543944, 27122916279, 27168988750, 27176296637, 27180423584, 27188898608, 27190850556, 27191051832, 27200687391.
- **Duplicados en el Sheet** (misma transacción en varias filas): `26939540171` (2025 filas 70–71), `26996882151` (2025 filas 76–77), `27830831509` (Jan filas 38–39, Sergio Vazquezarbella $400), `30469509435` (Aug filas 24–26, Phillip Whittington $400).
- Todo lo demás (Mar–Oct) cuadra con los correos, incluidas las correcciones del 10-13.

## Cómo regenerar la lista fila por fila

El detalle (transacción, remitente, monto correcto, pestaña y fila de cada una de las 79) está en la ejecución #2799 del workflow archivado `TMP auditoria Zelle 2 (solo lectura)` (`mn11a074izdgO7Rw`). Si se pierde, repetir: leer los correos con Outlook `getAll`, un nodo de Sheets `read` por pestaña y comparar por transacción.

## Propuesta (autorizada por Jorge el 2026-10-13; ver "Aplicado")

1. Corregir en el Sheet el monto de las 79 filas (solo columna Amount, con el valor del correo, formato `$X,XXX.XX`).
2. Añadir las 20 filas faltantes de nov/dic-2025 (al final de la pestaña `2025`, con memo `No memo provided`; sin ID, no hay Mongo en esa época).
3. Borrar a mano los duplicados (Zapier no borra filas): `2025` 71 y 77, `Jan` 39, `Aug` 25 y 26.
4. No tocar Mongo (son anteriores a la migración).

## Verificación previa a corregir

Antes de escribir se miró el texto original de 6 correos de Chase: dicen `Amount $1500.00`, `$2000.00`, `$1440.00`, `$1918.80`, etc. (Chase escribe los montos sin coma), mientras el Sheet tenía $150, $200, $144 y $191. Control: Zainab Jivanjee $450.00 coincidía en ambos lados. Es el bug de ceros del flujo viejo.

## Aplicado (2026-10-13, vía Zapier Google Sheets)

- **79 montos corregidos** (solo columna Amount, formato `$X,XXX.XX`): 2025 14 filas, Jan 11, Feb 17, Mar 11, Apr 7, May 11, Jun 8. Cada respuesta de escritura devolvió la transacción esperada de esa fila.
- **20 filas añadidas** al final de la pestaña `2025` (filas 136 a 155; no se pudo insertarlas en su lugar, que es entre las filas 85 y 86), con sender sin el prefijo "payment", fecha y transacción del correo; **memo e ID vacíos** (no se extrajo el memo de los correos). Una de las escrituras (Dairon Leiva, fila 146) devolvió un error del proxy pero sí se había escrito; se verificó leyendo las filas 144–155 y no hay duplicados.
- Sin cambios en Mongo (todo es anterior a la migración).

## Pendientes

- [ ] Borrar a mano los 5 duplicados: `2025` filas 71 y 77, `Jan` fila 39, `Aug` filas 25 y 26 (Zapier no borra filas).
- [ ] Opcional: ordenar la pestaña `2025` por fecha (las 20 filas nuevas están al final) y completar su memo.
- [ ] Preguntar a Mario/Rosa si alguien usó los totales viejos (el Sheet subestimaba ≈ $113,000 entre dic-2025 y jun-2026).
- [ ] Una nueva auditoría puede repetirse comparando por transacción (ver arriba) para confirmar que quedó en cero.
