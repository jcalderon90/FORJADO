---
fecha: 2026-09-08
cliente: varela-law
tipo: sesion
tags: [varela-law, n8n, mongo, airtable, migracion, bug-critico, zelle, timezone, ai-agent, prompt]
---

# 2026-09-08 — Migración Airtable→MongoDB en `CONTRACTS FROM SLACK` (workflow no documentado hasta ahora) + fix crítico de zona horaria en `TRACKING INCOMING ZELLE PAYMENTS`

Primera sesión de trabajo con Varela Law usando el MCP server `n8n-varela_law` (agregado en esta sesión con `claude mcp add --transport http n8n-varela_law https://n8n.srv957125.hstgr.cloud/mcp-server/http` — antes no existía acceso directo, solo se conocía el detalle de los workflows por documentación previa).

## 1. Descubrimiento: `CONTRACTS FROM SLACK` (`jLgZaTceNMLtM9sh`) nunca se había documentado en la bóveda

Workflow en producción desde 2025-08-23, activo, que **no aparecía en `wiki/clientes/varela-law.md`** ni en ningún raw previo. Qué hace: Mario reenvía por Slack el PDF de un contrato firmado → el workflow descarga el PDF, lo analiza con Google Gemini (extracción de texto) + un AI Agent (OpenRouter, con Structured Output Parser) que extrae ~19 campos estructurados (cliente, contacto/responsable de pago, tipo de caso, honorarios, fechas) → crea registros de Contact(s) y Case en una base de tipo CRM, los enlaza entre sí, y notifica por Slack/Gmail.

Hasta hoy esa base era **Airtable** (base "Legal Case Tracking and Billing", tablas Contacts/Cases con linked records) + un **Google Sheets** paralelo ("SLACK CONTRACTS") como log de respaldo.

## 2. Disparador: Airtable llegó al límite de su plan

Mario reportó el error nativo de Airtable "This base is or will be over its record limits" en este workflow. Pidió explícitamente sacar Airtable del flujo.

## 3. Migración a MongoDB

Se reemplazaron los 4 nodos Airtable (`Create Contact as Contact`, `Create Client as Contact`, `Create Case`, `Update Contact`) **y** el nodo Google Sheets (`Append row in sheet`) por nodos MongoDB, usando la credencial `mongoDb` "Varela Law" (`UZv1zIWjbmmfIJyv`) que ya existía en la instancia (sin crear nada nuevo). 3 colecciones nuevas:

- `contacts` — insert (contacto secundario y cliente)
- `cases` — insert
- `contracts_log` — insert (reemplaza el Google Sheet)

Airtable manejaba las relaciones Contact↔Case con **linked records** nativos, algo que Mongo no tiene. Se resolvió generando IDs propios (`contactId`/`caseId`, basados en `$execution.id`, ej. `client-2474`) en nodos Set ("Prep ... Fields") antes de cada insert/update — el `Update Contact` (ahora un `mongoDb` update con `updateKey: "contactId"`) sigue enlazando el caso nuevo al contacto del cliente igual que antes.

Probado end-to-end con datos reales (contrato de FOIA, cliente Gerber Medardo Dominguez): las 5 escrituras Mongo salieron limpias, sin errores, con las relaciones Contact↔Case correctas y `date` convertido a tipo Date real vía `options.dateFields`. Publicado.

## 4. Bug real encontrado al revisar la prueba: el AI Agent perdía datos que sí estaban en el PDF

Mario probó con datos que antes daban error. Al revisar la ejecución, la migración funcionó, pero varios campos salían `"N/A"` (`cliente_telefono`, `tipo_caso`). Investigando el texto real extraído del PDF (no solo la salida del agente), se confirmó que el contrato **sí** trae esos datos, en un bloque de firma al final del documento (`Información del Cliente: / Información Responsable de Pago (si es distinto al Cliente):` con Nombre/Dirección/Teléfono/Email) que el `systemMessage` del AI Agent nunca instruía a revisar — el agente solo miraba el cuerpo del contrato y la sección "PARTES DE ESTE ACUERDO" al inicio, donde esos datos no estaban.

Este bug es independiente de la migración Airtable→Mongo (hubiera pasado igual con Airtable) — es un problema de extracción del AI Agent que probablemente lleva tiempo ahí.

**Fix**: se actualizó el `systemMessage` del nodo `AI Agent` (v1.8→v1.9) agregando una sección `ubicacion_datos_contacto` que instruye explícitamente a revisar ese bloque de firma antes de marcar un campo como ausente, y se agregó "FOIA" como keyword de la categoría `Civil` en `tipo_caso` (el contrato de prueba era una "Solicitud y Analisis de FOIA", categoría que antes no matcheaba ninguna de las 4 opciones permitidas).

Verificado re-corriendo el mismo texto real del contrato con el prompt nuevo (vía `test_workflow` con pin data, sin escribir nada real en Mongo/Slack/Gmail): `cliente_telefono` pasó de `N/A` a `(503)729-33504` (el dato real: 50372933504) y `tipo_caso` de `N/A` a `Civil`. Los campos que siguen en `N/A` (dirección/email del cliente y del contacto, relación del contacto) se confirmaron línea por línea como genuinamente vacíos en el PDF — no es un bug, el agente ya no inventa.

De paso se deshabilitó `Extract from File`, un nodo sin ninguna conexión de salida (dead code, no alimenta nada del flujo real — el texto lo provee `Analyze document` vía Gemini) que además fallaba en el entorno de prueba por falta de binary data.

Publicado.

## 5. Segundo pedido: revisar `TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK` (`BruqJ1jdEV9xl5zG`)

Mario/Jorge pidió "arreglar lo que esté mal" sin especificar el bug. Todas las ejecuciones recientes tenían `status: success` — no había ningún error visible, había que encontrar un problema de **corrección de datos**, no de crash.

### Bug encontrado: corrimiento de fecha por zona horaria

El workflow no tenía `settings.timezone` configurado — heredaba la zona horaria del servidor n8n (confirmado: UTC+2). Dos nodos (`Edit Fields` para calcular el mes de la pestaña del Sheet, y `DATA FIELDS` para el campo `sentDate` que se guarda en Mongo) llaman `.toDateTime()` sobre un string no-ISO (`"Sep 08, 2026"`) **sin especificar formato**, lo que ancla el resultado a esa zona equivocada.

Confirmado con un pago real (TEMILOLUWA ADEGBITE, $500.00, transacción 30736838675, Sep 8 2026): el `sentDate` guardado (`2026-09-08T02:00:00.000+02:00`) equivale, visto en la hora real de Houston (America/Chicago), a **2026-09-07T19:00** — un día antes. En casos límite de fin de mes esto podría además mandar el pago a la pestaña del mes equivocado en el Google Sheet ("Inconming Mail Payments").

Segundo bug relacionado en el mismo nodo: el `mongoDb` node `Insert documents` tenía `options.dateFields` puesto como `={{ $json.sentDate }}` — una expresión que evalúa al **valor** de la fecha, cuando `dateFields` espera el **nombre literal** del campo (`"sentDate"`). Con esto mal puesto, Mongo nunca convertía `sentDate` a un tipo Date real — quedaba como string, sin poder ordenar/filtrar por fecha correctamente en Mongo.

**Fix** (3 cambios, un solo `update_workflow`):
1. `settings.timezone = "America/Chicago"` en el workflow.
2. `.toDateTime('LLL dd, yyyy')` (formato Luxon explícito) en `Edit Fields` y `DATA FIELDS`, en vez de `.toDateTime()` sin argumento.
3. `options.dateFields` corregido a `"sentDate"` (literal) en `Insert documents`.

Verificado reusando el email real del pago de TEMILOLUWA ADEGBITE (vía `test_workflow`, con Outlook Trigger pineado al contenido real y Mongo/Sheets/Outlook simulados para no reescribir producción): `sentDate` salió `2026-09-08T00:00:00.000-05:00` — correcto, sin corrimiento. Publicado.

Nota aparte, no tocada: el validador marca `Basic LLM Chain` por tener 2 conexiones `ai_languageModel` (OpenRouter + Google Gemini) — es el patrón normal de modelo principal + fallback (`needsFallback: true`), no un error real.

## Pendiente

- Nada abierto de esta sesión — ambos workflows quedaron publicados y verificados. `CONTRACTS FROM SLACK` queda documentado por primera vez en la bóveda (ver `wiki/clientes/varela-law.md`).
