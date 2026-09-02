---
tags: [forjado, cliente, carwarriors, dealercenter, investigacion, tasks, auth0]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — Investigación: automatizar reasignación de tasks viejos en DealerCenter (punto 2 del brief de Bianca)

**Contexto:** Jorge priorizó este ítem del brief de Bianca (ver [[2026-08-28-brief-automatizacion-bianca]]) como el primero a construir del backlog nuevo: detectar tasks estancados (+48/72h sin tocar) y reasignarlos automáticamente. Antes de diseñar el workflow en n8n, se investigó en vivo (Playwright, login con `jcalderon90`) qué expone realmente DealerCenter para esto.

## Hallazgo 1 — Sí existe una vista/reporte usable: "Customer Reports → My Follow Ups"

Ruta: **Customer → My Follow Ups** (`Customer Reports`, `reportId=-1012`). Filtros disponibles: Include (Pending/Complete/Cancelled), Types (Customer — hay más tipos en el combo, no explorados), **Due Date** (solo 3 opciones: "Overdue & Due Today", "Due Today", "Due in Future" — no hay un rango custom ni "últimos N días"), Assigned To (multi-select de los ~41 usuarios de la cuenta, sin opción "seleccionar todos" en la UI — se seleccionaron los 41 uno por uno vía script). Con los 41 assignees + "Overdue & Due Today" salieron **31 resultados, de los cuales solo 2 eran realmente overdue (ambos de 1 día, 31 de agosto)** — el resto eran "Due Today". Es decir, en el estado actual el equipo de Carwarriors no tiene una acumulación grande de tasks viejos vencidos por varios días — al menos no capturados por este reporte puntual, en este momento.

Cada tarjeta de resultado trae: nombre del cliente, "Assigned to", "Subject", "Due on", teléfono, y un botón **Complete** (y a nivel lista, "Complete All"/"Cancel All"). **No hay ninguna acción de reasignación masiva ni individual en esta vista.**

## Hallazgo 2 — Dato clave que sí sirve para "task viejo": el customer detail trae "Days Since Activity"

Entrando al detalle de un cliente (click en el nombre) se ve un panel con: **Overdue Tasks** (con link "Since [fecha]"), Pending Tasks, **Days Old**, **Days Since Activity** — este último es exactamente la métrica de "hace cuánto nadie lo toca" que pide el brief. La pestaña "Tasks" de la actividad muestra cada task individual con estado (`Pending - Overdue`, `Completed`), Assigned To, Due Date, Subject, y quién la creó/completó.

**El menú "⋮" de una task individual solo ofrece: Complete, Cancel, Flag.** No hay "Reassign" ni "Edit assigned to" en ningún lugar de la UI explorado hoy. Reasignar un task existente, tal como lo expone la UI, aparentaría requerir cancelar el task viejo y crear uno nuevo con "Add Task" asignado a otra persona (no confirmado end-to-end, no se probó por no escribir en producción sin necesidad).

## Hallazgo 3 — Sí existe una API interna real detrás de esta vista, pero con el mismo problema de auth ya conocido

Inspeccionando el Network tab mientras cargaba el reporte: la SPA llama a `POST https://app.dealercenter.net/api-gateway/report-api/CRMCustomReport/GetActivitiesReport` (una vez por cada `AssignedTo` seleccionado, con `DueDate`/`DueDateOperator` en el body) — un endpoint REST real, no un truco de scraping. Confirma que técnicamente es posible leer/auditar tasks de todos los reps vía HTTP directo, sin recorrer la UI a mano.

**Pero el header `authorization` es un JWT de Auth0 (`auth.dealercenter.net` / `dealercenterauth.us.auth0.com`) con vida de exactamente 10 minutos** (`iat`/`exp` con diferencia de 600s), más un `x-xsrf-token` y headers `dc-user`/`dc-location`. Revisado `localStorage`/`sessionStorage` del tab: **no hay ningún refresh token persistido** — consistente con que el SPA usa renovación silenciosa de Auth0 (iframe oculto con `prompt=none`), el mismo mecanismo que ya bloqueó el intento anterior de automatizar el refresh de fotos de DealerCenter (ver memoria `project_carwarriors_dealercenter_lead_sync` y el punto 7 abandonado en `carwarriors-llc-source-2026-08-25.md`: "tres intentos (headless, headless+Xvfb, VNC+login manual) bloqueados por anti-bot de DealerCenter/Auth0").

**Conclusión de riesgo:** construir un workflow n8n desatendido que llame directamente a este endpoint requeriría re-autenticarse cada ~10 minutos contra Auth0 (login por usuario/contraseña + 2FA por email, sin SMS) — exactamente el mismo tipo de obstáculo que ya hizo abandonar la automatización de fotos. No es un problema técnico distinto, es el mismo.

## Qué es realista construir sin repetir el fracaso anterior

- **Sí, con bajo riesgo:** un chequeo periódico *semi-automatizado* — ej. un script/workflow que se ejecuta con una sesión de navegador ya autenticada manualmente (similar a como hoy se hace el refresh de fotos "a demanda"), o simplemente mantener la auditoría manual (Customer List filtrado) que ya se documentó como mitigación del bug de BDC Rep — no es nuevo, es extender ese mismo hábito a "Days Since Activity" alto.
- **Riesgoso / probablemente bloqueado igual que antes:** un workflow 100% desatendido en n8n con login+MFA automático repitiéndose cada 10 minutos contra Auth0, para leer Y escribir (reasignar) tasks.
- **No confirmado si es siquiera posible:** reasignar un task *existente* sin pasar por Cancel + Add Task nuevo — no se encontró la acción en la UI.

## Pendiente

- **Decisión de Jorge:** ¿seguir empujando este ítem sabiendo que probablemente choque con el mismo muro de Auth0/anti-bot que la automatización de fotos, o repriorizar hacia otro punto del brief de Bianca (recorridos diferenciados del bot, IA de scoring) mientras esto se re-evalúa? No se avanzó más para no repetir el patrón ya vivido de invertir horas en un camino ya probado como bloqueado.
- Si se decide seguir: confirmar con un login real si "Cancel + Add Task" es efectivamente el único camino de reasignación, y explorar si el toggle "Enable BDC Rep Support" / campo "Sales Rep" a nivel cliente (visto en el tab Buyer) es un mejor punto de automatización que el task individual (cambiar el dueño del *cliente* en vez de reasignar cada task suelto).
