---
fecha: 2026-09-09
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, mongo, gmail, dealercenter, ghl, leads, bug-critico]
---

# 2026-09-09 — 4 hallazgos/fixes en una sola sesión: BSONError en `PRINCIPAL`, correos de inventario sin marcar leídos, pipeline de inventario construido para Rances Car, y deduplicación de leads entre dealers

Jorge abrió con 2 reportes: una ejecución con error de `PRINCIPAL` del 08-sep ~7:27, y correos de inventario sin procesar acumulándose en Gmail. De ahí se derivaron 4 hallazgos/fixes reales.

## 1. BSONError en `PRINCIPAL` (Marcar Alerta Enviada) — corregido

Causa raíz: el nodo `Preparar Marca Alerta` asignaba `_id` como string vía `={{ $('Insert Error Log').first().json._id }}` — n8n's Set-node string coercion llama `JSON.stringify()` sobre el objeto `ObjectId` de Mongo (que tiene `toJSON()` devolviendo el hex string), produciendo un string con comillas literales embebidas (26 caracteres en vez de 24 hex válidos). El downstream `Marcar Alerta Enviada` (mongoDb update por `_id`) fallaba con `BSONError`.

**Fix:** cambiado a `={{ $('Insert Error Log').first().json._id.toString() }}` (llamada explícita a `.toString()` antes de que corra la coerción de n8n). Publicado (`activeVersionId: e3272b60-a324-4078-aa23-302b558c4d5c`). **No verificado todavía con un caso real** — pendiente confirmar la próxima vez que esa rama de alerta se dispare de verdad.

## 2. Correos de inventario ("FORJADO Inventory Sync") acumulándose sin leer — corregido

`FORJADO Inventory Sync Email` (Gmail Trigger de `VECTORIZAR - KB`) filtra `readStatus: unread`, pero ningún nodo posterior marcaba el mensaje como leído tras procesarlo — footgun clásico de Gmail Trigger. Contados 5 correos pendientes con un workflow temporal de solo lectura (`TEMP - Count Unread Inventory Emails`, archivado después).

**Fix:** nodo nuevo `Marcar Email Leido (Inventario)` (Gmail, `markAsRead`, `messageId` del propio email del trigger), conectado en paralelo desde `Reinyectar Chunks`. Publicado (`activeVersionId: e660d7fb-27ab-491e-8274-7ee622077420`). El backlog de 5 correos ya existentes en la bandeja se dejó para que Jorge los marque manualmente (no se automatizó un backfill de eso).

## 3. Rances Car nunca tuvo sync de inventario propio — pipeline construido y backfill real ejecutado

Al revisar "¿Rances Car tiene el mismo bug?" se encontró que Rances Car simplemente **nunca tuvo ningún pipeline de inventario** — el reporte diario de DealerCenter y `VECTORIZAR - KB` son 100% específicos de Carwarriors LLC (dealer `CW`). Jorge aclaró: **Rances Car no tiene cuenta de DealerCenter propia — debe nutrirse del mismo reporte que ya llega para Carwarriors** (inventario físico compartido entre ambos dealers).

**Ambigüedad de datos encontrada y resuelta antes de tocar nada:** la data table `GHL Locations` tenía 3 filas con distinto `dealer` para el mismo `locationId` de Rances Car (`Rances Car`, `RC`, `RANCES`). En vez de asumir, se le preguntó a Jorge cómo decidir — eligió "verificar cuál usa producción ahora". Se confirmó contra Mongo real (`TEMP - Distinct Dealers in Mongo`, aggregate por `dealer`): `RANCES` con 10 documentos reales vs `CW` con 137 — `RANCES` es el código real en uso.

**Construido en `VECTORIZAR - KB` (`47Lbdo6oI4fUYEzN`):** rama paralela que reusa el mismo Excel de DealerCenter ya parseado (`Parsear Inventario a Chunks`), remapea cada chunk a `dealer: 'RANCES'` con id `inv_RANCES_*` (nodo `Generar Chunks RANCES`), borra el inventario viejo de Rances en Mongo (`Borrar Inventario Anterior (RANCES)`, filtro `{dealer: "RANCES", categoria: "inventario"}`) y reinyecta los chunks (`Reinyectar Chunks (RANCES)`) hacia el mismo `Split Out`/vector store compartido. Publicado (`activeVersionId: a250e7e4-0226-4a99-b459-f3eef38a2eda`).

**Backfill real inmediato** (no se esperó al próximo correo): workflow temporal `TEMP - Backfill Inventario RANCES` ejecutó el pipeline completo real (Gmail → Excel → parse → remap dealer → delete → reinject → split → vector insert). Verificado con conteo real en Mongo (`TEMP - Count Inventario por Dealer`): **CW: 133, RANCES: 133** — paridad exacta confirmada. Todos los workflows temporales usados (5 en total: conteo de correos, listado de locations, distinct dealers, test del remap, backfill, conteo final) fueron archivados inmediatamente después de usarse.

**Limpieza de datos:** a pedido explícito de Jorge ("limpia las filas duplicadas de GHL Locations"), se borraron las 2 filas obsoletas/incorrectas de la data table `GHL Locations` (`id=3` dealer `Rances Car`, `id=4` dealer `RC`), dejando solo `id=1` (`CW`) e `id=2` (`RANCES`) — las 2 en uso real. Hecho con dry-run primero (`options.dryRun: true`), confirmado que solo afectaría esas 2 filas, y luego la eliminación real. Workflow temporal (`TEMP - Delete Duplicate GHL Locations Rows`) archivado después.

## 4. Deduplicación de leads entre dealers (Tesla CW / Tesla Rances) — construido y publicado

**Reporte de Bianca (vía Jorge):** cuando un lead entra por "Tesla Carwarriors" se registra bien, pero si el mismo lead real entra también por "Tesla Rances" se duplica — se pidió que exista un solo lead, con constancia clara de por cuáles dealers entró.

**Causa raíz confirmada:** los contactos de GHL viven en sub-cuentas (locations) separadas por dealer — el mismo teléfono real genera un `contactId` distinto en cada location. `LEAD - COLLECTOR` (workflow único, compartido por `PRINCIPAL` y `PRINCIPAL - Rances Car`) guarda la colección `leads` en Mongo keyed por `contactId` — sin ningún vínculo entre los 2 documentos que puede generar la misma persona real. **Verificado con datos reales, no solo teoría:** se encontró el mismo teléfono (`+17862981911`) en 2 `contactId` distintos dentro de `leads` (workflow temporal de inspección `TEMP - Inspect Leads Schema`, archivado después) — el caso exacto que describió Bianca, ya ocurriendo en producción. De paso se confirmó que la colección `leads` **no guarda un campo `dealer` por documento**, lo que descarta un backfill retroactivo confiable (no hay forma de reconstruir con certeza por cuál dealer entró cada lead histórico).

**Fix aplicado en `LEAD - COLLECTOR` (`4r00JFnCyoUpZgXU`):** rama nueva en paralelo a la existente (no la reemplaza), que corre cuando hay teléfono:
- `Tiene Telefono (Master)?` (IF) → `Buscar Lead Master` (Mongo find en colección nueva `leads_master` por teléfono) → `Merge Lead Master` (Code: mergea un array `fuentes` con `{dealer, locationId, contactId, canal, primeraEntrada, ultimaEntrada}`, dedupeando por `dealer`+`contactId`) → `Upsert Lead Master` (Mongo update/upsert por `telefono`).
- En paralelo, `Nuevo Match Multi-Dealer?` (IF: `nuevoMatchCrossDealer === true`, calculado cuando se agrega una fuente nueva Y ya hay más de un dealer distinto) → `Avisar Lead Multi-Dealer` (Slack `#notificaciones`, credencial `Slack FORJADO`), para que la primera vez que un teléfono aparece en más de un dealer quede visible, no solo enterrado en Mongo.

6 nodos nuevos, todos validados con `validate_node_config` antes de aplicarse (`valid: true`), aplicados atómicamente vía `update_workflow` (12 operaciones, 0 `validationWarnings`), wiring verificado con `get_workflow_details` post-cambio, publicado (`activeVersionId: 859099a1-689c-492c-9d69-80d9834da148`). Como es el mismo workflow compartido por ambos dealers, el fix cubre `PRINCIPAL` y `PRINCIPAL - Rances Car` sin necesidad de replicarlo por separado.

## Pendiente real

- Confirmar con tráfico real la próxima vez que la rama de `Marcar Alerta Enviada` de `PRINCIPAL` se dispare (fix BSONError sin verificar en vivo todavía).
- Confirmar con el próximo correo real de "FORJADO Inventory Sync" que la corrida automática (no manual) sigue funcionando con el fix de `markAsRead` y con la nueva rama de Rances Car juntas.
- Confirmar con tráfico real que `leads_master` se puebla correctamente y que la alerta de Slack de "lead multi-dealer" sale una sola vez por match (no duplicada) — mismo criterio de esperar tráfico real usado en otros fixes recientes de esta cuenta.
- Sin backfill histórico de `leads_master` — el gap de datos (`leads` sin campo `dealer`) impide reconstruir con certeza el historial; el fix aplica solo hacia adelante desde el 09-09.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-08-fix-critico-sync-inventario-vacio]]
- [[2026-09-05-auditoria-sync-leads-ghl-dealercenter-bidireccional]]
- [[../../wiki/clientes/carwarriors-llc-inventario-ghl]]
