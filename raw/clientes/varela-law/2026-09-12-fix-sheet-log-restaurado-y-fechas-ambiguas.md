---
fecha: 2026-09-12
cliente: varela-law
tipo: sesion
tags: [varela-law, n8n, mongo, google-sheets, bug-critico, fecha-ambigua, contratos, ai-agent, prompt]
---

# 2026-09-12 — Restaurado el log a Google Sheets, backfill de contrato perdido, y fix de fechas ambiguas en `CONTRACTS FROM SLACK`

Sesión disparada por Jorge: "revisa los últimos contratos de Slack que entraron en Varela Law, creo que no se están guardando en la Sheet".

## 1. Diagnóstico: la Sheet dejó de recibir datos el 2026-09-08 — comportamiento esperado, no un bug

Confirmado contra la documentación de la sesión anterior ([[2026-09-08-migracion-airtable-mongo-contratos-y-fix-timezone-zelle]]): el workflow `CONTRACTS FROM SLACK` (`jLgZaTceNMLtM9sh`) se migró de Airtable+Google Sheets a MongoDB ese día. El nodo `Append row in sheet` (que escribía en la Sheet "SLACK CONTRACTS") fue reemplazado por nodos Mongo — la Sheet quedó congelada a propósito. Verificado contra ejecuciones reales vía el MCP `n8n-varela_law` (reconectado esta sesión tras un timeout inicial): 3 contratos reales procesados después de la migración (Erica Hogan 09-08, Zainab Jivanjee 09-09, Brenda S. Botea 09-10), todos correctos en Mongo (`contracts_log`), ninguno en la Sheet (esperado).

## 2. Encontrado un contrato real que se perdió por completo: Gerber Medardo Dominguez

Revisando el historial de ejecuciones, la ejecución real `2472` (webhook, 2026-09-08 20:35, **antes** de la migración) — contrato de Gerber Medardo Dominguez / Maria Nelly Dominguez (FOIA) — falló en el nodo `Create Contact as Contact` (Airtable) con `TOO_MANY_RECORDS_IN_BASE`. Como el error ocurrió antes de llegar al nodo de la Sheet, el contrato no quedó registrado en ningún lado (ni Airtable, ni Sheet, ni Mongo — Mongo aún no existía en el workflow). Este fallo fue probablemente el disparador original de la migración esa misma tarde.

Las ejecuciones manuales `2474`, `2476`, `2477`, `2480` (mismo día, más tarde) se usaron para probar la migración con los datos reales de este contrato. **`2476`, `2477` y `2480` fueron pruebas simuladas con `test_workflow`/pin data** (IDs falsos tipo `client-TEST`, `pdfUrl: example.com/test.pdf`) — pero **`2474` fue una ejecución REAL** (`pinData: null`, IDs Mongo reales), hecha con el prompt del AI Agent aún en v1.8 (antes del fix que agregaba teléfono/tipo de caso desde el bloque de firma) — ver hallazgo en la sección 6.

## 3. Restaurado el nodo `Append row in sheet` en producción

Encontrada la Sheet real vía `spreadSheetsSearch` (ID `1oweAcuD2n_pspkBdZG0HbgaTLkA_kxQp9whMH31mkZs`, pestaña `2026` = gid `660559903`; también existen pestañas `2025` y `Pruebas`). Header real leído vía `getSheetHeaderRow` (18 columnas en español con tildes: "Fecha Contrato", "Cliente Nombre", "Cliente Dirección", etc., orden ligeramente distinto al de los campos internos — "Comments" va en la posición 8, no al final).

Se agregó un nodo `n8n-nodes-base.googleSheets` (`Append row in sheet`, v4.7) al workflow `CONTRACTS FROM SLACK`, conectado en paralelo a `Log Contract` (ambos alimentados por `Prep Contract Log Fields`), con mapeo `defineBelow` campo por campo hacia los headers reales. Publicado. Desde ahora cada contrato nuevo por Slack queda en Mongo **y** en la Sheet.

## 4. Backfill del contrato de Gerber Medardo Dominguez

`execute_workflow` no soporta disparar workflows con `Slack Trigger` (solo Schedule/Webhook/Form/Chat), así que no se pudo re-disparar el trigger real de producción. Se construyó un workflow temporal (`BACKFILL - Gerber Medardo Dominguez Contract`, vía SDK) que replica el tramo final de `CONTRACTS FROM SLACK` desde `AGENT RESPONSE` en adelante (con los datos reales ya extraídos del PDF, corroborados palabra por palabra contra el texto del contrato), con un Webhook Trigger propio y **sin** los nodos de notificación Slack/Gmail (para no reenviar una confirmación de un contrato de hace 4 días). Ejecutado en modo producción (real, no simulado — confirmado por `pinData: {}` vacío e IDs Mongo reales), verificado, y el workflow temporal archivado.

Resultado: `contracts_log` `_id: 6aa5b7e5c068a04ee44f46bf`, Case y 2 Contacts creados con IDs reales, fila escrita en la Sheet (fila 129).

## 5. Bug real encontrado: formato de fecha ambiguo en el prompt del AI Agent

Jorge notó que las fechas "a veces tienen mal el orden de día y mes y tiende a confundir". Causa raíz: el `systemMessage` del `AI Agent` (v1.9) pedía `fecha_contrato` en formato `M/D/YYYY` (ejemplo dado: `"11/8/2025"`) — ambiguo por diseño (`09/08/2026` no dice si es 8 o 9 de septiembre sin conocer la convención). Verificado contra los 4 contratos reales: el agente era consistente (siempre M/D/YYYY), el problema era puramente de legibilidad/ambigüedad, no de extracción incorrecta.

**Fix**: `systemMessage` actualizado a v1.10 — `fecha_contrato` ahora en ISO `YYYY-MM-DD` sin ambigüedad, con instrucción explícita de preferir la fecha con mes en palabras del certificado de firma electrónica (DocuSign/SignWell, ej. "Sep 09, 2026") sobre la fecha numérica manuscrita/tipeada junto a la firma, cuando exista. Publicado en producción.

## 6. Corrección de las 4 fechas ya guardadas — dos intentos, el primero falló silenciosamente

Se intentó reformatear las 4 fechas ya logueadas (Hogan, Jivanjee, Botea, Gerber) a ISO en Mongo y en la Sheet, vía un workflow temporal con `mongoDb update` (por `_id`) y `googleSheets update` (por `matchingColumns: ["PDF URL"]`).

- **Mongo**: los 4 `update` por `_id` (`updateKey`) funcionaron correctamente — verificado después con un `find` real.
- **Sheet**: el `update` por `matchingColumns: ["PDF URL"]` **reportó éxito pero no escribió nada** — confirmado con una lectura real posterior (la fila de Gerber seguía en `09/08/2026`). Bug conocido de n8n: el nodo puede no encontrar la fila por matching de texto y aun así devolver "success" haciendo eco del input, sin error visible.
- **Fix**: reintentado usando `matchingColumns: ["row_number"]` (leyendo primero la fila real con un nodo `read`, patrón más confiable) — verificado con una segunda lectura real: sí quedó escrito (`Fecha Contrato: 2026-09-08`).
- **Nota aparte**: Hogan, Jivanjee y Botea nunca tuvieron fila en la Sheet (sus ejecuciones reales son anteriores a que existiera el nodo — punto 1), así que no había nada que corregir ahí para esos tres; solo sus documentos en Mongo necesitaban el reformateo, que sí funcionó a la primera.

**Lección**: un nodo de Sheets o Mongo con "matching" (`update`/`upsert` por columna o por query) puede reportar `success` sin haber encontrado ni escrito nada real. Siempre verificar con una lectura (`read`/`find`) posterior antes de dar por buena una escritura de este tipo, especialmente al operar fuera de la UI de n8n.

## 7. Hallazgo adicional: documento duplicado e incompleto de Gerber Medardo Dominguez en Mongo, desde el 09-08

Al verificar los fechas vía `find`, apareció un **quinto documento** en `contracts_log` no relacionado con el backfill de hoy: `_id: 6aa08214c068a04ee44f46a9`, creado el 2026-09-08 21:45 por la ejecución real `2474` (ver sección 2) — con `clienteTelefono: "N/A"` y `tipoCaso: "N/A"` (exactamente el bug que se corrigió esa tarde con el prompt v1.9, pero esta corrida real ya había escrito los datos incompletos en Mongo antes del fix, y nadie lo había limpiado). Traía también un Case (`_id: 6aa08213c068a04ee44f46a8`, `caseType: "N/A"`) y 2 Contacts (`_id: 6aa08212c068a04ee44f46a7` y `...a6`).

Confirmado con Jorge, se borró: primero un dry-run con `find` usando los campos propios (`caseId: "case-2474"`, `contactId: "client-2474"`/`"contact-2474"`, más `clienteNombre`+`pdfUrl` para el log) para verificar el match exacto (1 documento cada uno, sin sorpresas), luego el `delete` real — confirmado `deletedCount: 1` en los 4. (Nota técnica: el query JSON de `delete`/`find` de este nodo Mongo **no** castea strings a `ObjectId` automáticamente ni soporta `$oid` — a diferencia de `updateKey` en `update`, que sí lo hace. Matchear por campos propios de negocio, no por `_id` crudo, cuando se opera fuera de `updateKey`.)

Estado final: un solo documento de Gerber Medardo Dominguez en Mongo (`_id: 6aa5b7e5...`, datos completos) + su fila en la Sheet, ambos con fecha ISO correcta.

## Pendiente

- Nada abierto de esta sesión — workflow de producción verificado y publicado, backfill y correcciones confirmados con lecturas reales, duplicado limpiado, todos los workflows temporales archivados.
- Sigue sin cambios el pendiente de fondo ya conocido: riesgo de negocio de la API de MyCase (mensaje a Mario del 2026-08-28, sin respuesta, no perseguir proactivamente) y el backlog de ideas del 2026-08-28.
