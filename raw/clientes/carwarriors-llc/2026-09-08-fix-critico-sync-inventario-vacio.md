---
fecha: 2026-09-08
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, dealercenter, inventario, mongo, gmail, bug-critico]
---

# 2026-09-08 (continuación) — Bug crítico: el sync diario de inventario llevaba días vaciando la KB sin repoblarla

Jorge preguntó por qué le llegaban correos de DealerCenter ("FORJADO Inventory Sync") sin saber para qué eran. Se le explicó que es un reporte programado (creado 2026-08-17) que el workflow `VECTORIZAR - KB` consume vía Gmail Trigger para mantener actualizado el inventario en la base de conocimiento del bot. Jorge respondió "al parecer no está funcionando" — se investigó y tenía razón: había un bug real y grave.

## Causa raíz

El workflow `VECTORIZAR - KB` (`47Lbdo6oI4fUYEzN`) tiene esta cadena: `FORJADO Inventory Sync Email` (Gmail Trigger) → `Extraer Excel Inventario` → `Parsear Inventario a Chunks` (arma `{chunks: [...]}`) → `Borrar Inventario Anterior (CW)` (Mongo delete) → `Split Out` (`fieldToSplitOut: chunks`) → `MongoDB Atlas Vector Store CHUNKS` (inserta con embeddings).

**El nodo `Borrar Inventario Anterior (CW)` (operación `delete` de Mongo) solo devuelve `{deletedCount: N}` en su output — no pasa el campo `chunks` que traía el nodo anterior.** Confirmado con el propio hint de n8n en cada ejecución revisada (09-04, 09-05, 09-07, 09-08): *"The field 'chunks' wasn't found in any input item"*. Resultado: `Split Out` recibía 0 items todas las noches, `MongoDB Atlas Vector Store CHUNKS` nunca se ejecutaba, y el inventario borrado **nunca se repoblaba** — la KB del bot llevaba (al menos) desde el 4 de septiembre con el inventario completamente vacío para consultas de disponibilidad de vehículos.

Mismo patrón de bug que el hotfix de alertas de esta misma sesión (un nodo Mongo no pasa los campos que un nodo posterior necesita) — esta vez en un flujo completamente distinto, encontrado porque Jorge insistió en verificar en vez de aceptar la explicación inicial.

## Fix aplicado y verificado

Probado primero en un workflow aislado (`TEMP4`, borrado después) con datos falsos antes de tocar producción: nodo nuevo **`Reinyectar Chunks`** (Set, `mode: manual` + `includeOtherFields: true`) insertado entre `Borrar Inventario Anterior (CW)` y `Split Out`, que reinyecta `chunks` referenciando directamente `$('Parsear Inventario a Chunks').first().json.chunks` — no depende de lo que pase por el nodo Mongo. Publicado en producción (`activeVersionId` intermedio, luego reemplazado por la versión de limpieza final).

## Backfill inmediato (a pedido de Jorge, no esperar hasta mañana)

El fix solo aplica hacia adelante — el correo de hoy (1:16 AM) ya se había procesado con el bug activo. Se hizo un backfill manual real:
1. Se agregaron temporalmente 3 nodos (`Backfill Manual Trigger` → `Backfill Buscar Email` (Gmail `getAll`) → `Backfill Obtener Adjunto` (Gmail `get`, `simple: false`, `downloadAttachments: true`)) conectados a `Extraer Excel Inventario`, para re-obtener el correo de hoy (seguía marcado `UNREAD` en Gmail) y re-procesarlo con el fix ya aplicado.
2. Se deshabilitó temporalmente el trigger manual viejo (`When clicking 'Execute workflow'`, que tenía `chunks: []` hardcodeado) para poder ejecutar específicamente la rama de backfill.
3. Ejecutado: `Parsear Inventario a Chunks` encontró **135 vehículos reales** (ej. `2021 HYUNDAI TUCSON ULTIMATE SPORT UTILITY 4D`, `2019 CHEVROLET TAHOE LT SPORT UTILITY 4D`, con color/millas/stock#/estado reales) — todos insertados correctamente con embeddings reales.
4. **Verificado con un conteo real en Mongo** (`aggregate` con `$match` + `$count`, workflow temporal `TEMP5`, borrado después): **135 documentos** `{dealer: "CW", categoria: "inventario"}` — coincide exacto con lo parseado.
5. Nodos temporales de backfill eliminados, trigger manual viejo re-habilitado, publicado limpio (`activeVersionId: 4943c279-...`).

## Pendiente real

- Confirmar mañana (~1:30 AM) que la corrida automática normal sigue funcionando con el fix aplicado (debería, ya que usa el mismo nodo `Reinyectar Chunks`).
- No se investigó si Rances Car tiene un sync de inventario equivalente — el reporte "FORJADO Inventory Sync" y este workflow son específicos de Carwarriors LLC (dealer `CW`). Pendiente confirmar si Rances Car necesita lo mismo.
