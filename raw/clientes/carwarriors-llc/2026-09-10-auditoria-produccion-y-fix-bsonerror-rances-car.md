---
fecha: 2026-09-10
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, mongo, bug-critico, produccion]
---

# 2026-09-10 — Auditoría de los 4 pendientes del 09-09 con tráfico real + hallazgo y fix de BSONError activo en `PRINCIPAL - Rances Car`

Jorge pidió retomar Carwarriors y saber qué falta para tener todo en producción al 100%. Se auditaron con datos reales (no solo "¿publicado?") los 4 pendientes dejados el 09-09.

## Hallazgo nuevo: `PRINCIPAL - Rances Car` tenía el mismo BSONError que `PRINCIPAL`, sin fix — corregido

El fix del 09-09 (`.toString()` explícito en `Preparar Marca Alerta` → `_id`) solo se aplicó al workflow `PRINCIPAL` (`Kif9lWwDHvR7TT39`). `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`) es un clon separado con su propia copia del mismo nodo, nunca actualizada. Encontradas **4 ejecuciones reales con error** (`BSONError: input must be a 24 character hex string...`) en esa rama: 09-09 21:06, y 3 más hoy 09-10 (12:55, 14:01, 14:03) — bug activo en producción en el momento de la auditoría, no algo hipotético.

**Fix aplicado:** mismo cambio que en `PRINCIPAL` (`={{ $('Insert Error Log').first().json._id.toString() }}`), validado con `validate_node_config` (`valid: true`), aplicado vía `update_workflow` (`updateNodeParameters`, 1 operación, 0 `validationWarnings`) y publicado (`activeVersionId: 04fe5f35-8ef3-49e0-8a24-65f275e8bc11`). **Pendiente verificar con la próxima vez que esa rama de alerta se dispare en Rances Car** (mismo patrón de verificación diferida que el fix original).

## Verificación de los 4 pendientes del 09-09

1. **BSONError `PRINCIPAL`:** cero errores nuevos desde el fix — sigue sin dispararse esa rama en el `PRINCIPAL` original (Carwarriors LLC). Sí se disparó (y falló) en el clon de Rances Car — ver arriba.
2. **Sync de inventario (Rances Car + `markAsRead`):** **confirmado funcionando.** La corrida automática real del 09-10 05:30 UTC (primera desde el publish) ejecutó con éxito `Marcar Email Leido (Inventario)`, `Generar Chunks RANCES` y `Reinyectar Chunks (RANCES)` — los 3 nodos en `success`. Pendiente cerrado.
3. **`leads_master` / alerta multi-dealer:** sigue sin probarse con un caso real. Revisadas varias ejecuciones recientes de `LEAD - COLLECTOR` (incluyendo las más nuevas, hasta 14:03 de hoy) — el campo `telefono` sigue vacío en todas, la rama `Tiene Telefono (Master)?` sigue evaluando `false`. Wiring sano, simplemente no ha habido tráfico real con teléfono capturado todavía.
4. **Flujo "Respuesta Comentarios" de ManyChat (reactivado 09-09 ~19:15):** sigue en cero tráfico real — la única ejecución de `COMENTARIOS-MANYCHAT` en la cuenta sigue siendo la prueba sintética del 09-05. Van casi 24h desde la reactivación sin un comentario real de Instagram.

## Relacionado

- [[2026-09-09-fix-bson-inventario-rances-y-dedupe-leads]]
- [[carwarriors-llc]]

## Continuación (misma sesión, más tarde): publicado `SEGUIMIENTO SALIENTE - Intento 1 (CW)` con autorización de Jorge, y falso positivo de "VPS caído" aclarado

Jorge autorizó explícitamente publicar `SEGUIMIENTO SALIENTE - Intento 1 (CW)` (`Fh4fB5Cgk1hchvxe`), que llevaba desde el 09-07 construido en Draft esperando su revisión. Publicado y confirmado activo (`active: true`, `triggerCount: 1`).

**Incidente aparente en el camino, resuelto como falso positivo:** durante varios minutos todas las llamadas al MCP de n8n-carwarriors (y SSH al VPS `2.24.106.87`) dieron timeout total — se investigó como posible caída real de producción. Se le pidió a Jorge diagnosticar directamente el VPS por SSH: servidor sano (42 días de uptime, memoria/disco normales), pero se encontró que el SSH `carwarriors-vps` de este entorno apunta a **un VPS distinto** (IP `82.29.180.111`, hosteando un bot de WhatsApp con RAG/embeddings de otro proyecto, no Carwarriors) — no es el servidor real de Carwarriors (`2.24.106.87`). Jorge confirmó desde su navegador que el n8n real de Carwarriors sí respondía con normalidad — el problema era solo de conectividad/VPN de este entorno hacia esa IP específica, no un incidente de producción. Conexión al MCP se restableció sola minutos después.

**Nota para el futuro:** el alias SSH `carwarriors-vps` en este entorno NO es confiable para diagnosticar el VPS real de Carwarriors — apunta a otro servidor. Si se necesita SSH real al VPS de Carwarriors (`2.24.106.87`), hay que confirmar/reconfigurar el alias correcto primero.

## Relacionado (adicional)

- Mensajes/recordatorios redactados para los pendientes bloqueados en terceros (Bianca, Jorge González, soporte DealerCenter) — WhatsApp Rances Car (permiso Meta), compra de número SMS, automation "AutosMiami", reporte BDC Rep, tokens de Yoan, Team Inbox, ROI DealerCenter, ticket BDC Rep — entregados a Jorge para que los envíe.

## Continuación 2 (misma sesión): confirmado con tráfico real el gate de teléfono → sync a DealerCenter, en ambos dealers

Pendiente abierto desde el 09-01 (intentado sin éxito el 09-08 por limitaciones de método). Esta vez se verificó directamente en `Subir a DealerCenter` (`ZxcF7cmf3V8FZabx`) en vez de cruzar la colección `users`:

- **Carwarriors LLC:** lead nuevo real "Amarilys López Morales" (`contactId 0RA3fMQvvjIDSEteroqU`), `dateAdded` 17:52:23, teléfono `+17027253589` capturado por el bot, sync disparado 17:56:54, ADF XML subido con éxito por SFTP, `leadSource: "TESLA CW"`.
- **Rances Car:** lead nuevo real "Rene A Barrios" (`contactId wj5uOuygiOIhJAAsBaX2`), teléfono `+17863937704`, sync exitoso, `leadSource: "TESLA RANCES"`, tag `dealercenter-synced` agregado en GHL.

Ambos casos reconfirman también el mapeo de Lead Source Tesla (fix del 09-05) con datos frescos de hoy en los dos dealers. El lead de Rances Car es el mismo `contactId` de una de las 4 ejecuciones con BSONError corregidas hoy — confirma que ese fix era necesario con tráfico real, no solo hipotético.

**Sigue sin confirmarse por separado:** si el canal real de esa conversación fue WhatsApp — el campo `channel` en esa ejecución puntual venía `"unknown"` (el `source: "Whatsapp"` de GHL es atribución de Meta, no necesariamente el canal de mensajería real). El pendiente de "confirmar con un mensaje real de WhatsApp" sigue abierto.

## Continuación 3 (misma sesión): bug crítico real encontrado en `leads_master` — nunca podía poblarse, corregido

Persiguiendo la confirmación real del gate de teléfono (arriba), se encontró que la ejecución de `LEAD - COLLECTOR` para el lead real de Amarilys (CW, teléfono capturado) llegaba hasta el nodo `Buscar Lead Master` y se detenía ahí — `Merge Lead Master`, `Upsert Lead Master` y `Nuevo Match Multi-Dealer?` nunca se ejecutaron pese a que el teléfono sí llegó.

**Causa raíz:** `Buscar Lead Master` (Mongo `find` en `leads_master`) no tenía `alwaysOutputData: true`. Con 0 documentos encontrados (el caso normal la primera vez que un teléfono es nuevo — no puede haber match porque nunca se creó nada antes), n8n corta la ejecución de la rama ahí mismo por defecto. Consecuencia real: la feature de deduplicación multi-dealer construida y publicada el 09-09 **era estructuralmente incapaz de poblar `leads_master` jamás**, sin importar cuánto tráfico real llegara — no era "falta de tráfico", como se pensaba, era un bug que bloqueaba el 100% de los casos.

**Fix:** `alwaysOutputData: true` agregado a `Buscar Lead Master` (mismo patrón ya usado correctamente en `Buscar Recontacto Previo` de `SEGUIMIENTO SALIENTE`, construido el mismo 09-07). Publicado (`activeVersionId: 57bda2c9-c3ab-45c2-b0dd-d870cea1dd05`). **No se hizo backfill del caso de Amarilys** (su ejecución ya pasó y no se reprocesó) — pendiente real: confirmar con el próximo teléfono nuevo capturado que `leads_master` recibe su primer documento de verdad.

## Continuación 4 (misma sesión, chequeo automático): segundo bug real expuesto por el fix de `Buscar Lead Master`, corregido

El chequeo automático programado detectó 2 ejecuciones nuevas con error en `LEAD - COLLECTOR` (5746, 5748) inmediatamente después del fix del punto anterior — mismo lead real (Amarilys, CW).

**No era una regresión del fix — era un segundo bug independiente, agazapado desde el 09-09**, que nunca se había podido disparar porque la ejecución siempre moría antes en `Buscar Lead Master`. Al desbloquearlo, la ejecución avanzó por primera vez hasta `Nuevo Match Multi-Dealer?` (IF) — que tenía `rightValue: ""` (string vacío) con `typeValidation: strict` para un operador `boolean/true`, y hasta ahora nunca se había ejecutado con datos reales. Error real: `NodeOperationError: Wrong type: '' is a string but was expecting a boolean`. Como no tiene `onError` configurado, el error cortó la ejecución completa **antes de que `Upsert Lead Master` (el nodo que realmente escribe en `leads_master`) llegara a correr** — confirmado en el trace: `Merge Lead Master` sí calculó `nuevoMatchCrossDealer: false` correctamente, pero el IF nunca llegó a evaluarlo por el error de tipo.

**Fix:** `rightValue: true` (booleano explícito) en vez de string vacío. Validado (`validate_node_config`) y publicado (`activeVersionId: 86abd884-8391-4d86-bb7c-7d8b1b73b956`).

**Estado real tras ambos fixes:** `leads_master` sigue en cero documentos — el caso real de Amarilys que expuso el bug ya pasó y no se reprocesó (no se hizo backfill manual a propósito). Pendiente real: confirmar con el próximo teléfono nuevo capturado que el ciclo completo corre sin errores de punta a punta.

## Continuación 5 (chequeo automático): confirmado de punta a punta — `leads_master` ya tiene su primer documento real

Ejecución real 5755 (20:09, mismo lead `+17027253589`, ahora interesado también en una van): `Buscar Lead Master` → `Merge Lead Master` → `Upsert Lead Master` corrieron sin ningún error tras los 2 fixes de esta sesión. `leads_master` ya tiene su primer documento real en producción. Único pendiente real que queda de esta cadena: un caso con match en más de un dealer para probar `Avisar Lead Multi-Dealer` (Slack) — sigue sin haber ocurrido un cruce real CW/RANCES para el mismo teléfono.

## Continuación 6: mensajes enviados a Bianca/Jorge González

Jorge envió hoy 5 de los 8 mensajes/recordatorios redactados durante la sesión (retiró SMS, automation "AutosMiami" y tokens de Yoan de esta tanda — siguen como pendientes abiertos, solo no se enviaron ahora):

1. WhatsApp Rances Car — permiso de Admin del Business Portfolio en Meta (a Bianca).
2. Reporte guardado en DealerCenter para BDC Rep vacío (a Jorge González).
3. Confirmación de si el Team Inbox vacío quedó resuelto (a Bianca).
4. ROI de DealerCenter — cargar gasto real + borrar categorías legacy (a Jorge González).
5. Seguimiento del ticket de soporte DealerCenter `#TICKET-20586098` (a Jorge González/Bianca).

Esperando respuesta de los 5. Sin novedad todavía.

## Continuación 7: reporte de Jorge — notificaciones de leads a Slack "sin datos", investigado y NO era un bug

Jorge reportó que las notificaciones de leads a Slack estaban llegando sin datos. Investigado con ejecuciones reales de `NOTIFICATIONS` (`oz7EabosHGTXtTjr`) cruzadas contra el contacto real de GHL (`Get Contact Info`) en cada caso:

- El mapeo restaurado el 09-06 sigue funcionando bien: encontrado un caso limpio (lead "Arian", Rances Car, ejecución 5692) con `telefono_lead: "+17542769990"` e `interes_vehiculo: "Tesla Model 3"` — datos reales, correctos.
- Los casos que mostraban "No registrado" (Amarilys, Rene, Dayron, Yosvany) correspondían a leads que **genuinamente no habían dado su teléfono todavía** en el momento exacto de esa alerta — confirmado contra `Get Contact Info.contact` real en cada caso (sin campo `phone`), y en un caso (Amarilys) el bot literalmente le estaba pidiendo el teléfono en ese mismo turno ("Disculpa, ¿me pasas tu número de teléfono?").

**Causa de fondo (no un bug de wiring):** la alerta `interes_precios` se dispara en el momento en que el lead pregunta por precio — que casi siempre es **antes** de que el gate de teléfono lo capture, porque ese es precisamente el propósito del gate. No era una regresión del mapeo, era el diseño original de cuándo dispara esa alerta.

**A pedido explícito de Jorge, ajustado igual:** agregado un chequeo real de teléfono antes de disparar la alerta. Nodo nuevo `Buscar Lead (Para Alerta Precios)` (Mongo `find` en la colección `leads` —donde `LEAD - COLLECTOR` guarda el teléfono estructurado—, `alwaysOutputData: true`) insertado entre `Insert Analytics` e `IF INTERES PRECIOS`, y agregada una segunda condición al IF (`telefono` no vacío, combinador `and`). Ahora la alerta de "interés en precios" solo se dispara si ya hay un teléfono capturado. Aplicado y publicado en ambos dealers (`PRINCIPAL` `activeVersionId: 1a3ed953-a13b-44b1-84bd-f294041c360a`, `PRINCIPAL - Rances Car` `activeVersionId: 097dfc69-4466-41a5-8d01-92773d7e9b20`). Pendiente real: confirmar con el próximo caso real que la alerta ya solo llega con teléfono presente.
