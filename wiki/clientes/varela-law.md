---
tags: [forjado, cliente, varela-law, automatizacion, legal]
tipo: cliente
estado: activo
servicio: automatizacion
contacto: Mario Varela
creado: 2026-06-17
actualizado: 2026-10-07
fuente_raw: raw/clientes/varela-law/
---

# Cliente — Varela Law

> [!info] Cómo leer esta página
> Página **compilada**: solo el estado actual. El historial completo día a día vive en [[../../raw/clientes/varela-law/varela-law-source-2026-08-25|raw/clientes/varela-law/]] (ver [[../../README|arquitectura de la bóveda]]).

## Datos

| Campo | Valor |
|---|---|
| **Empresa** | Varela Law |
| **Representante** | Mario Varela |
| **Sector** | Legal / Bufete de abogados, Miami |
| **Servicio principal** | Automatización (n8n) |
| **Estado** | En producción, sin bloqueos técnicos |

## Accesos

> [!warning] Información sensible — no compartir
> Credenciales completas (Google, Outlook, MyCase, SSH, n8n) en el snapshot raw: [[../../raw/clientes/varela-law/varela-law-source-2026-08-25]].

## Infraestructura del cliente

| Campo | Valor |
|---|---|
| **Proveedor VPS** | Hostinger, KVM 1, Ubuntu 24.04, Boston — `72.60.31.74` / `srv957125.hstgr.cloud` |
| **n8n** | https://n8n.srv957125.hstgr.cloud |
| **Servicios Docker** | `root-n8n-1` (5678), `root-traefik-1` (80/443, reverse proxy HTTPS) |
| **MCP `n8n-varela_law`** | Agregado 2026-09-08 (`claude mcp add --transport http n8n-varela_law https://n8n.srv957125.hstgr.cloud/mcp-server/http`) — acceso directo a workflows/credenciales/ejecuciones de esta instancia n8n desde Claude Code. Requiere reiniciar la sesión tras agregarlo la primera vez. |

## Sistemas en producción

1. **MyCase API — Token Manager** (`MOpVRrvErCfgs2mn`): refresca el OAuth de MyCase cada 23h vía MongoDB (`VarelaLaw.mycase_tokens`). 100% operativo. Detalle: [[varela-law-mycase-api]].
2. **Radar Billing Automation**: escribe automáticamente F (Total Amount Collected), H (Total Invoiced Amount) y J (Uninvoiced Balance) en la pestaña `07-05-26` del Google Sheet de Mario todos los días a las 5:00 AM. Trust Balance no disponible vía API de MyCase (confirmado con soporte) — queda manual. Detalle: [[varela-law-radar-billing]].
3. **Tracking de pagos Zelle entrantes** (`TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK`, `BruqJ1jdEV9xl5zG`) — detectado 2026-08-25, no documentado antes en la bóveda. Lee los correos que Mario reenvía (`FW: You received money with Zelle`) por Outlook, extrae remitente/monto/fecha/transacción con doble método (regex + LLM), y si coinciden crea el registro en MongoDB (`zelle_payments`) y en el Google Sheet "Incoming Mail Payments"; si no coinciden, alerta por email para revisión manual. **Fix 2026-09-08:** `timezone: America/Chicago` + formato Luxon explícito. **Fix 2026-09-15:** Corregido bug crítico en la selección de pestaña por mes en Google Sheets (todos los pagos de Feb-Nov caían en `Dec` porque `$json.month` venía del nodo de Mongo y era `undefined`). También corregido el parseo de nombres de mes completos en Luxon (`September` vs `Sep`), el parseo de respuestas JSON formateadas con markdown por la IA en el nodo `RESPONSE`, y removida la exigencia de fallback model en `Basic LLM Chain`. Publicado y verificado con ejecuciones de prueba (IDs 2545, 2546, 2548). El usuario trasladó manualmente los 17 registros acumulados de Septiembre a la pestaña `Sep`, quedando la hoja 100% al día. Detalle: [[../../raw/clientes/varela-law/2026-09-15-fix-zelle-tracking-month-sheets-routing-and-json-parsing]].
4. **Procesamiento de contratos firmados por Slack** (`CONTRACTS FROM SLACK`, `jLgZaTceNMLtM9sh`) — en producción desde 2025-08-23. Mario reenvía por Slack el PDF de un contrato firmado; el workflow lo analiza con Gemini + un AI Agent (OpenRouter) que extrae ~19 campos (cliente, contacto/responsable de pago, tipo de caso, honorarios, fechas), crea los registros de Contact(s) y Case enlazados entre sí, y notifica por Slack/Gmail. **09-08: migrado de Airtable + Google Sheets a MongoDB** (colecciones `contacts`, `cases`, `contracts_log`) porque Airtable llegó a su límite de registros; las relaciones Contact↔Case que Airtable manejaba con linked records ahora usan IDs propios (`contactId`/`caseId`). De paso se corrigió un bug real del AI Agent: no revisaba el bloque de firma final del contrato ("Información del Cliente"/"Información Responsable de Pago"), perdiendo teléfono/categoría de caso que sí estaban en el PDF. Detalle: [[../../raw/clientes/varela-law/2026-09-08-migracion-airtable-mongo-contratos-y-fix-timezone-zelle]]. **09-12: restaurado el log dual a Sheet+Mongo** — la migración del 09-08 había dejado la Sheet "SLACK CONTRACTS" sin escribir (comportamiento no comunicado); se re-agregó el nodo de Sheets en paralelo a Mongo. De paso se encontró y recuperó un contrato real perdido (Gerber Medardo Dominguez, FOIA) que había fallado por el límite de Airtable justo antes de la migración y nunca quedó registrado en ningún lado — reprocesado con backfill verificado. También corregido un bug de formato: `fecha_contrato` salía en `M/D/YYYY` (ambiguo, ej. `09/08/2026`) — el prompt del AI Agent ahora exige ISO `YYYY-MM-DD` (v1.10), y se reformatearon las 4 fechas ya guardadas. De paso se encontró y limpió un documento duplicado/incompleto de Gerber Medardo Dominguez en Mongo, generado por una prueba real (no simulada) del 09-08 antes del fix del prompt. Detalle: [[../../raw/clientes/varela-law/2026-09-12-fix-sheet-log-restaurado-y-fechas-ambiguas]].
5. **Reporte semanal de facturas vencidas** (`Radar Billing - Reporte Facturas Vencidas (Semanal)`, `ZxZONW1XANkoP1ay`) — EN PRODUCCIÓN desde 2026-08-27, primera oportunidad activada del análisis de API de MyCase (2026-07-28). Cada lunes 8am trae `/invoices` y `/cases` de MyCase, filtra las de `status: "overdue"`, y manda a `mvarela@varela.law` una tabla con balance pendiente, días de atraso y link directo a cada factura. Primer envío real (2026-08-27): 54 facturas vencidas, $81,324.76 de balance total pendiente.
6. **Texto + FindMyFirm — leads por SMS (parte 1 de 2, 2026-10-07)** — `Texto - Leads FindMyFirm (Parte 1)` (`zyPZ9H05SA4a3V9s`), **sin publicar**. Mario pidió conectar el Google Sheet que FindMyFirm alimenta con cada lead del formulario web (`*a - DON'T DELETE - Lead Export - Varela`, pestaña `Sheet1`) con **Texto** (SMS con IA que contacta al prospecto al instante y ofrece evaluación gratuita). Se hizo en **n8n y no en Zapier** (ya hay n8n en el VPS; Zapier gratis revisa cada 15 min). Hoy: trigger de Google Sheets (fila nueva, cada minuto) → Set que deja solo First Name, Last Name, Phone Number y Email; probado con las filas reales (ejecución 2734). **Aún no envía nada a Texto.** Parte 2 bloqueada esperando a Mario: URL/token del webhook de Texto (no es pública), celular de prueba y que acepte n8n en vez de Zapier. Datos a resolver en parte 2: teléfono llega sin `+`, hay leads mal capturados (apellido `true`, filas de prueba) y las filas ya existentes no se enviarán. Detalle: [[../../raw/clientes/varela-law/2026-10-07-texto-leads-findmyfirm-parte1-n8n]].
7. Todos los workflows tienen `errorWorkflow` conectado a `ERROR HANDLER` (email automático a `jcalderon900610@gmail.com` ante cualquier fallo).

## Pendientes abiertos (al 2026-08-28; Texto actualizado 2026-10-07)

- [ ] **Texto — parte 2 (esperando a Mario, mensaje enviado 2026-10-07):** URL/token del webhook de Texto (o acceso a su panel / soporte), celular de prueba y OK a n8n en vez de Zapier. Luego: HTTP Request a Texto, normalizar teléfono a `+1...`, filtrar leads inválidos, prueba con su número, conectar `errorWorkflow` a `ERROR HANDLER` y publicar. Riesgo: si Texto solo ofrece app de Zapier y no webhook, ese paso requeriría Zapier. Ver [[../../raw/clientes/varela-law/2026-10-07-texto-leads-findmyfirm-parte1-n8n]].

- [x] **Corregir el parser de `Radar Billing - Build ID MAP`** — resulta que ya estaba corregido desde 2026-08-14 (nunca quedó documentado). Verificado hoy: funciona, resolvió una de las 4 filas históricas sin match (Marquez, Dimas), y señala correctamente 6 filas que sí necesitan criterio humano en vez de asignarlas mal. Ver [[../../raw/clientes/varela-law/2026-08-28-parser-id-map-ya-corregido]].

- [x] **Mensaje enviado a Mario (2026-08-28)** explicando que la API de MyCase sostiene 4 sistemas en producción (Token Manager, Radar Billing F/H/J diario, reporte semanal de facturas vencidas, tracking de Zelle), no solo el Trust Balance que cree que no sirve. Ver [[../../raw/clientes/varela-law/mensajes/mensaje-mario-2026-08-28-riesgo-cancelacion-api.txt]]. **Esperando su respuesta** — no perseguir proactivamente.
- [ ] **Esperando a Mario** — de las 5 oportunidades del análisis de API (2026-07-28), la #1 (facturas vencidas) ya está en producción (ver arriba). Quedan por confirmar:
  - (2) Leads — **bloqueada**: MyCase no tiene ningún lead cargado (`GET /leads` devolvió 0), sin datos reales no se puede confirmar el shape del objeto para escribir la asignación con seguridad. Retomar si aparece un lead real.
  - (3) Agenda de deadlines/audiencias — **construida, inactiva**, `Radar Billing - Agenda Deadlines y Audiencias (Diario)` (`4QsJaKlmHDhkVtBV`), esperando que Mario confirme si la quiere. La otra mitad de esta oportunidad (checklist automática de tareas al abrir un caso nuevo) sigue sin construir — depende de que Mario defina su checklist real, no es algo inventable sin riesgo.
  - (4) Borrador de avisos a clientes — **construida, inactiva**, `Radar Billing - Borrador Avisos de Facturas Nuevas (Diario)` (`lTVFM7I3wJBpW7we`), detecta facturas nuevas y redacta el mensaje sugerido pero no lo envía al cliente (solo a Mario para revisión).
  - (5) Documentos/contratos — **bloqueada**: depende de una conversación con Adalberto que no ha ocurrido.
  - No preguntar proactivamente — avisará él. Detalle completo: [[../../raw/clientes/varela-law/2026-08-27-build-5-oportunidades-api]].
- [ ] **Baja prioridad** — 4 de 99 clientes sin match automático en ID MAP (Joj Santos, Medina Manuel, Marquez Dimas, Rojas Tovar Manuel): el sistema los deja intactos, mismo trabajo manual que Mario ya hacía antes, sin riesgo de dato incorrecto. Mario no ha reportado ningún inconveniente. Mensaje ya redactado, listo para enviar cuando surja la ocasión — ver [[../../raw/clientes/varela-law/mensajes/mensaje-mario-2026-07-25-radar-billing-completo.txt]].
- [ ] Hablar con **Adalberto** sobre el sistema automático de contratos (sin fecha).
- [ ] Construir workflows funcionales nuevos (Cases, Tasks, Time Entries, Events) — depende de la priorización de Mario arriba.
- [ ] **Backlog de ideas nuevas (2026-08-28, investigación externa, sin enviar a Mario todavía):** webhooks de MyCase para tiempo real en vez de polling; checklist automático al abrir caso; conflicto de interés al crear lead (bloqueado por lo mismo que la oportunidad #2 de arriba); seguimiento de clientes sin contacto reciente; y dos que no requieren trabajo nuevo — activar la Agenda de Deadlines ya construida, y ampliar el Borrador de Avisos de Facturas para que se envíe directo al cliente. Recomendado empujar estas dos últimas en el próximo mensaje a Mario. Detalle completo: [[../../raw/clientes/varela-law/2026-08-28-brainstorm-nuevas-ideas-mycase-api]].
- [ ] **Backlog de ideas que NO dependen de la API de MyCase (2026-08-28 noche, investigación externa, sin enviar a Mario todavía):** más relevante ahora por el riesgo de cancelación de la API. Prioridad #1 — detectar deadlines desde notificaciones de e-filing/corte que lleguen al correo de Mario (mismo patrón que el tracking de Zelle, ataca el mismo dolor que la Agenda de Deadlines pero sin depender de MyCase); prioridad #2 — chequeo de conflicto de interés vía un Google Form de intake propio en vez de `/leads` de MyCase (desatasca lo que estaba bloqueado por falta de datos). Además: disparar el checklist de apertura de caso desde el correo de firma de retainer (DocuSign/HelloSign) en vez de MyCase; flag de correspondencia de contraparte sin respuesta; digest semanal de salud de cartera leyendo el Sheet ya existente; recordatorios administrativos internos genéricos. Pendiente confirmar con Mario si de verdad reciben notificaciones de e-filing por correo antes de proponerlo. Detalle completo: [[../../raw/clientes/varela-law/2026-08-28-brainstorm-ideas-fuera-de-mycase]].

## Relacionado

- [[../interno/estado-proyecto|Estado del Proyecto — FORJADO]]
- [[../index|Índice de la bóveda]]
