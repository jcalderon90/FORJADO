---
tags: [forjado, cliente, varela-law, n8n, zelle, google-sheets, fix]
tipo: raw
cliente: Varela Law
fecha: 2026-09-15
---

# Fix en Tracking de Pagos Zelle entrantes — Ruteo por Pestañas de Mes y Parsing de IA / Fechas

## Diagnóstico y Causa Raíz

Se investigó el flujo de n8n **`TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK`** (`BruqJ1jdEV9xl5zG`) debido al reporte de que no se estaban guardando los pagos en la pestaña correspondiente de Google Sheet para cada mes.

Se identificaron cuatro causas raíz acumuladas en la definición del flujo:

1. **Ruteo de pestañas roto en Google Sheets (`Append row in sheet`)**:
   - Para el mes 1 (Enero), la expresión de `sheetName` evaluaba `$('Edit Fields').item.json.month == 1 ? 'Jan'`.
   - Para los meses de Febrero (2) a Noviembre (11), la expresión evaluaba `$json.month == X`.
   - Sin embargo, la entrada `$json` de ese nodo provenía del nodo anterior `Insert documents` (MongoDB), el cual **no transmitía la propiedad `month`**.
   - Al ser `$json.month` siempre `undefined`, todas las condiciones de Febrero a Noviembre daban `false`, derivando al bloque por defecto `: 'Dec'`. Todos los pagos de esos meses terminaban guardados erróneamente en Diciembre.

2. **Fallo en parseo de fechas en Luxon (`Edit Fields`)**:
   - `Edit Fields` intentaba parsear la fecha con `$json.extracted.sentDate.toDateTime('LLL dd, yyyy')`.
   - Cuando el correo contenía el nombre completo del mes (ej. `"September 14, 2026"` en lugar de `"Sep 14, 2026"`), Luxon fallaba en la especificación `'LLL'`, resultando en una fecha inválida y devolviendo `NaN`/`undefined` para el mes, lo que también derivaba a Diciembre.

3. **String de respuesta de IA sin parsear en nodo `RESPONSE`**:
   - El nodo `RESPONSE` asignaba el texto crudo del modelo (`$json.text`). Si la IA devolvía el JSON con sintaxis markdown (`` ```json ... ``` ``), `$json.response` quedaba como String.
   - En el nodo `If`, la expresión `Number($json.response.amount)` resultaba en `NaN`. Al comparar `NaN == 100`, daba `false`, enviando un email de falso error y cancelando el guardado en Sheet y Mongo.

4. **Configuración en desuso en `Basic LLM Chain`**:
   - El nodo `Basic LLM Chain` tenía activado `needsFallback: true` sin tener un subnodo de modelo secundario conectado, lo que bloqueaba las ejecuciones de prueba con un error de infraestructura n8n.

## Cambios Aplicados y Publicados

1. **`Code in JavaScript1`**:
   - Se añadió parseo nativo en JS para obtener de forma robusta la fecha corta (`Sep 14, 2026`), el número de mes `month` (1-12) y el nombre de pestaña `sheetName` (`Jan`, `Feb`, `Mar`, etc.).
2. **`RESPONSE`**:
   - Se incluyó un limpiador inline con `JSON.parse()` que remueve marcadores markdown de la IA antes de asignar el objeto.
3. **`Edit Fields` y `DATA FIELDS`**:
   - Se incluyeron los campos `month` y `sheetName` explícitamente en ambos nodos `Set`.
4. **`Append row in sheet`**:
   - Se simplificó `sheetName` a `={{ $('Edit Fields').item.json.sheetName || ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][($('Edit Fields').item.json.month || 12) - 1] }}`.
5. **`Basic LLM Chain` y limpieza de nodos**:
   - Se cambió `needsFallback` a `false` y se eliminó el nodo desconectado `OpenRouter Chat Model`.
6. **Publicación**:
   - Flujo actualizado y publicado exitosamente en el n8n de Varela Law (`activeVersionId: 063e3dbb-5cb9-4ce4-8031-3c62bfb4b19c`).

## Verificación

Se corrieron ejecuciones de prueba con `test_workflow` usando `pinData` simulado para distintos meses:
- **Ejecución 2545 (Septiembre):** `September 14, 2026` → `STATUS: SUCCESS` (Ruteado correctamente a la pestaña `Sep`).
- **Ejecución 2546 (Octubre):** `October 5, 2026` → `STATUS: SUCCESS` (Ruteado correctamente a la pestaña `Oct`).
- **Ejecución 2548 (Marzo):** `March 18, 2026` → `STATUS: SUCCESS` (Ruteado correctamente a la pestaña `Mar`).

## Cierre y Verificación del Usuario (2026-09-15 12:05)

El usuario confirmó y envió captura de pantalla mostrando que trasladó manualmente las 17 filas de pagos acumulados de Septiembre (Gladys Pardo Cristia, Nubia Torres, Cledia Mejia, Pedro Sandovalbecer, Zainab M Jivanjee, Jonatan Perla, Temiloluwa Adegbite, Jessica Cuicas Diaz, Aziz Hlal, Johnathan Paredes Najarro, Jeronima Guzman, Iftikhar Ahmed, Dat Vo, Olvin Cruz, Daniel Coronel, Rasheedat Abegbeyo) desde la pestaña `Dec` hacia la pestaña `Sep`.

La hoja de Google Sheets ("Incoming Zelle Payments") quedó 100% al día y corregida. Con el fix desplegado en n8n, todos los pagos futuros se guardarán de forma directa e independiente en la pestaña del mes que les corresponda.
