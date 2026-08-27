# 2026-08-27 — Construyendo las 5 oportunidades del análisis de API, una por una, en versión genérica

**Contexto:** Mario sigue sin responder cuál de las 5 oportunidades del mensaje del 2026-07-28 priorizar (ver [[mensajes/mensaje-mario-2026-07-28-analisis-api-completo.txt]]). Jorge decidió no seguir esperando en el vacío: construir las 5 en versión genérica/razonable, todas **inactivas**, para que Mario elija cuál activar (y ajustamos detalles según lo que diga) en vez de perseguirlo con preguntas de diseño antes de tener nada que mostrarle.

## Oportunidad #1 — Facturas vencidas / cobros pendientes — CONSTRUIDA (inactiva)

Workflow `Radar Billing - Reporte Facturas Vencidas (Semanal)` (`ZxZONW1XANkoP1ay`), creado inactivo.

**Qué hace:** cada lunes 8am (America/New_York) — reutiliza el patrón ya probado del Token Manager + paginación de `Radar Billing - Write Production` — trae `/cases` y `/invoices` de MyCase, filtra las facturas con `status: "overdue"` (campo nativo de MyCase, no hubo que inferir vencimiento por fecha), calcula balance pendiente (`total_amount - paid_amount`) y días de atraso (`hoy - due_date`), arma una tabla HTML ordenada por más atrasada primero con link directo a cada factura, y si hay al menos 1 vencida manda un email a `mvarela@varela.law` vía Outlook (`automations@varela.law`). Si no hay ninguna vencida esa semana, no manda nada (evita ruido).

**Verificado con `test_workflow` (pin data, sin tocar producción):** con 2 facturas overdue simuladas (usando la forma real de `/invoices` inspeccionada contra MyCase en vivo — ver abajo) y 1 pagada de control, el balance salió exacto ($6350-$1300=$5050 y $6050-$2650=$3400), el orden por días de atraso fue correcto, y el IF enrutó bien hacia el nodo de email (pinneado, no se envió nada real).

**Inspección previa del shape real de `/invoices`:** se creó un workflow temporal de solo lectura (`INSPECT - Invoices Shape`, `mcO0jm2QHZZIBFSo`) para confirmar los nombres de campo reales antes de construir — `id`, `case.id`, `invoice_number`, `invoice_date`, `due_date`, `total_amount`, `paid_amount`, `status` (`paid`/`overdue`/`forwarded`), `view_url`. Ejecutado una vez contra MyCase real (lectura, `per_page=5`, no escribió nada). Ya archivado.

**Pendiente de Mario para pasar a producción:**
- Confirmar si el destinatario debe ser solo él o también Rosa (contabilidad) — no tenemos su email.
- Confirmar cadencia (semanal quedó como default razonable, puede ser diaria).
- Decidir si además quiere el recordatorio automático al cliente mencionado en la propuesta original, o solo el reporte interno por ahora.

**errorWorkflow** conectado al `ERROR HANDLER` compartido, timezone fijado a `America/New_York`.

## Oportunidad #2 — Leads — BLOQUEADA, no se construyó

Se intentó inspeccionar `GET /leads` (workflow temporal `INSPECT - Leads and Staff Shape`, `d69YdqyxG1iqiB78`, solo lectura, ya archivado) para confirmar los campos reales antes de construir la asignación automática (decidido con Jorge: asignar por defecto a Mario, `staff.id = 23703361`, confirmado vía `GET /staff`).

**Bloqueo real:** `GET /leads` devolvió **0 registros** — Varela Law no tiene ningún lead cargado en MyCase actualmente. Sin datos reales no hay forma de confirmar los nombres de campo del objeto lead (fecha, fuente, y sobre todo el campo de asignación para el `PUT`). La documentación oficial de MyCase (Stoplight) es una SPA que no se pudo leer por fetch — ya hay precedente de que esa doc trae errores (endpoint de token, paginación), así que tampoco es confiable a ciegas.

**Decisión:** no construir #2 sobre una suposición no verificable de un campo que escribe en MyCase. Queda pendiente hasta que aparezca un lead real (de prueba o real) contra el cual verificar el shape, o hasta conseguir acceso legible a la doc. Se salta a la #3.

## Oportunidad #3 — Tareas y fechas límite por caso — PARCIALMENTE CONSTRUIDA (inactiva)

La propuesta original tenía dos partes: (a) crear automáticamente la checklist de tareas típicas al abrir un caso nuevo, y (b) recordatorios antes de fechas de corte/audiencias.

**(a) Checklist automática al abrir caso — NO construida a propósito.** No es algo que se pueda "genericar" con seguridad: la checklist real de un despacho legal (qué tareas van, en qué orden, con qué plazos) depende de su forma de trabajar interna, y ya se ve en los `/tasks` reales que las tareas varían mucho por tipo de caso (familia, inmigración, etc. — ver ejemplos como "INTAKE", "Homework Meeting", "Draft Discovery Request"). Inventar una checklist genérica arriesgaría crear tareas mal pensadas en casos reales de clientes. Queda bloqueada hasta que Mario defina su checklist real.

**(b) Recordatorios de deadlines/audiencias — construida.** Workflow `Radar Billing - Agenda Deadlines y Audiencias (Diario)` (`4QsJaKlmHDhkVtBV`), creado inactivo. Cada día a las 7am trae `/events` de MyCase (mismo patrón de paginación), filtra los que caen en los próximos 3 días (cualquier `event_type`: Court, Deadline, TRIAL, etc. — no se filtró por tipo porque no está claro cuáles cuentan como "audiencia/deadline" vs reunión normal, mejor mostrar todo y que Mario decida qué excluir), resuelve nombre de caso y staff asignado, y manda un email a `mvarela@varela.law` con la agenda si hay algo. Verificado con `test_workflow` (pin data): filtró correctamente un evento lejano (diciembre) fuera de la ventana de 3 días, mantuvo los 2 dentro de la ventana, resolvió nombres correctamente y ordenó por fecha.

**errorWorkflow** conectado al `ERROR HANDLER`, timezone `America/New_York`.

**Inspección previa:** workflow temporal `INSPECT - Tasks and Events Shape` (`Jv4W3bqFAZe4JDx6`), solo lectura, ya archivado — confirmó los campos reales de `/tasks` (`name`, `priority`, `due_date`, `staff[{id}]`, `case{id}`, `completed`) y `/events` (`name`, `start`/`end`, `all_day`, `event_type`, `case{id}`, `staff[{id}]`).

## Oportunidad #4 — Mensajes automáticos a clientes — CONSTRUIDA en modo borrador (inactiva)

Jorge decidió no construir el envío automático directo a clientes (más riesgo: mensaje mal calibrado llegando a un cliente real de un despacho legal). Versión conservadora: **detecta y redacta, no envía**.

Workflow `Radar Billing - Borrador Avisos de Facturas Nuevas (Diario)` (`lTVFM7I3wJBpW7we`), creado inactivo. Cada día 8:30am trae `/invoices`, filtra las creadas en las últimas 24h, arma un mensaje sugerido por factura (cliente/caso, monto, vencimiento, link), y manda un email-borrador a `mvarela@varela.law` — nunca al cliente. Verificado con `test_workflow`: filtró correctamente una factura vieja (nov-2025) y solo generó el borrador de la nueva (creada dentro de la ventana de 24h).

**Pendiente de Mario:** decidir si algún día quiere que esto (u otro disparador como "próxima cita") se envíe automático al cliente — hoy es solo apoyo interno.

**errorWorkflow** conectado al `ERROR HANDLER`, timezone `America/New_York`.

## Oportunidad #5 — Documentos / contratos — NO construida

Explícitamente ligada a una conversación con Adalberto que todavía no ha ocurrido (ver pendiente en la wiki del cliente). No hay alcance definido, construir algo aquí sería inventar sobre una conversación que no ha pasado. Queda bloqueada hasta esa conversación.

## Mensaje enviado a Mario (2026-08-27)

Jorge le mandó por WhatsApp el resumen de las 3 piezas construidas (#1 facturas vencidas, #3-parcial agenda de deadlines, #4 borrador de avisos), explicando en términos no técnicos qué hace cada una, que están todas apagadas hasta que él confirme, y que #2 (Leads) y #5 (Documentos) quedaron pendientes por las razones ya documentadas arriba. Se le pidió que diga cuál(es) activar y si quiere ajustes de destinatario/cadencia/contenido antes de prender cualquiera.

## Respuesta de Mario (2026-08-27) — activada #1 en producción

Mario respondió el mismo día: **"Empecemos con el #1 para ver qué información tiene. Por favor envíamelo a mí."**

Acciones tomadas:
1. **Publicado/activado** `Radar Billing - Reporte Facturas Vencidas (Semanal)` (`ZxZONW1XANkoP1ay`) — pasa de borrador a producción, corre solo cada lunes 8am (America/New_York) de ahora en adelante.
2. **Disparado manualmente en modo producción** (ejecución `2362`) para que le llegara el reporte real ese mismo día, sin esperar al lunes.
3. **Resultado real:** correo entregado con éxito a `mvarela@varela.law` — **54 facturas vencidas, $81,324.76 de balance total pendiente**, la más antigua con 511 días de atraso (Vilsa Veronica Pedro Lopez, $500.00).

**#1 queda en producción activa.** #3 (agenda deadlines) y #4 (borrador avisos) siguen inactivas, esperando que Mario diga si también las quiere — no preguntar proactivamente, avisará él (mismo patrón ya usado antes).
