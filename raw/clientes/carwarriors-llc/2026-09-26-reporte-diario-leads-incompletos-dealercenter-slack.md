---
tags: [forjado, cliente, carwarriors, dealercenter, leads, asignacion, bdc, reporte, slack, n8n, resolucion]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-26
---

# 2026-09-26 — Reporte Diario de Leads en DealerCenter sin Asignación ni Tasks: Implementado, Publicado y Probado en Slack

**Contexto:** Continuación directa de [[2026-09-25-solicitud-reporte-diario-leads-sin-asignacion-dealercenter]]. Jorge González (dueño de Carwarriors) solicitó un reporte diario automatizado de los leads cargados en DealerCenter que queden incompletos o sin seguimiento, auditando el cumplimiento de la regla crítica del SOP de Ventas de Bianca Cangialosi (*"Lead sin task = cliente perdido"*).

---

## 1. Solución Técnica Implementada en n8n

Se construyó y publicó el workflow **`DealerCenter -> Slack (Reporte Diario Leads Incompletos)`** (ID: `jc317DtnKMYEscC5`) en la carpeta `SYNC - GHL-Dealer_Center` (`84Xu5D4xWGDwDvcm`), totalmente integrado con el ecosistema de Carwarriors:

1. **Disparadores (Triggers):**
   - **`Disparador Diario (9:00 AM Miami)`**: Schedule Trigger nativo (`0 9 * * *`), programado para correr automáticamente todas las mañanas 30 minutos después de la ingesta matutina de DealerCenter (`08:30 AM`).
   - **`Disparador Manual / Webhook`**: Webhook Trigger (`/webhook/reporte-diario-leads-incompletos`) que permite disparar auditorías bajo demanda en cualquier momento.

2. **Ingesta de Datos (`Consultar Leads en Mongo`):**
   - Consulta la colección `dealercenter_customers` en MongoDB Atlas (alimentada diariamente por el reporte espejo de DealerCenter).
   - Ordena por fecha de creación decreciente (`{"createdDate": -1}`) con límite de hasta 500 registros para auditar tanto el flujo reciente como el pipeline activo acumulado.

3. **Motor de Auditoría y Control SOP (`Auditar Leads y Formatear Reporte`):**
   - Evalúa cada prospecto contra las directivas del SOP de Ventas y BDC:
     - **🔴 Sin Asignación:** Ni `Sales Rep` ni `BDC Rep` asignados (ambos vacíos o `Unassigned`).
     - **⚠️ Sin Task Futura:** No cuenta con próxima tarea ni cita agendada (`nextAppointment` vacío o expirado en el pasado), violando la regla *"Lead sin task = cliente perdido"*.
   - Separa métricas con precisión analítica:
     - **Ventana Reciente (Últimas 48h):** Leads ingresados en los últimos 2 días, tasa de cumplimiento reciente e infractores inmediatos.
     - **Pipeline Activo Global:** Prospectos activos en DealerCenter (`NEW`, `PROSPECT`, `CONTACT ATTEMPT`, `CONTACTED`, `WORKING DEAL`, `APPOINTMENT SCHEDULED`, `MISSED APPOINTMENT FOLLOW-UPS`, `VISIT FOLLOWUP`) sin tarea agendada.
   - Formatea un mensaje estructurado en Slack Markdown destacando los 10 prospectos prioritarios a regularizar con su nombre, dealer (`CW` vs `RANCES`), teléfono, fuente de adquisición y estatus.

4. **Notificación en Producción (`Enviar Reporte a Slack`):**
   - Envía el reporte automáticamente al canal dedicado **`#auditoria-leads`** (`C0C4K7SRY5B`), separándolo de `#notificaciones` para mantener limpio el feed de alertas en tiempo real.
   - Incluye barra divisoria sólida reforzada (`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`) y pie de página de cierre para garantizar que en la app móvil y web se distinga nítidamente dónde termina un reporte y empieza el siguiente.

---

## 2. Configuración en DealerCenter (Reports -> Schedules)

Aprovechando el acceso en vivo, se ingresó al diseñador de reportes de DealerCenter (`Customer Reports → FORJADO Lead Sync`):
- Se agregaron las 4 columnas mandatorias: **`BDC Rep`**, **`Follow Up Date`**, **`Created By`** y **`Last Activity Create Date`**.
- Configuración guardada y verificada en la grilla (`reportId: 1878845`). Las futuras exportaciones matutinas incluirán estos campos de forma nativa.

---

## 3. Pruebas y Verificación en Vivo

1. **Prueba inicial a `#notificaciones` (Ejecución ID: `9659`):** `status: success`, entrega verificada.
2. **Prueba definitiva al nuevo canal `#auditoria-leads` (Ejecución ID: `9675`):**
   - **Canal de destino:** `C0C4K7SRY5B` (`#auditoria-leads`).
   - **Slack API:** `ok: true`.
   - **División visual:** Barra continua `━━━━━━━━━━` y footer `🏁 Fin de Auditoría Diaria` confirmados al pie del mensaje.
   - **Datos reales auditados:** 74 leads recientes, 71 incompletos detectados, desglose detallado de los 10 prioritarios.

---

## 4. Estado en Producción

- **Workflow ID:** `jc317DtnKMYEscC5`
- **Active Version ID:** `bbfae4cd-4de5-46fe-b059-ac9882a880df`
- **Canal Slack:** `#auditoria-leads` (`C0C4K7SRY5B`)
- **Estatus:** **`active: true`**
- **Siguiente ejecución automática:** Diariamente a las **09:00 AM hora Miami**.
- **Pendiente:** CERRADO y RESUELTO al 100%.

---

## Relacionado

- [[../../wiki/clientes/carwarriors-llc]]
- [[2026-09-25-solicitud-reporte-diario-leads-sin-asignacion-dealercenter]]
- [[2026-09-24-sop-capacitacion-ventas-dealercenter]]
- [[2026-09-23-auditoria-dealercenter-y-catalogo-automatizaciones]]
