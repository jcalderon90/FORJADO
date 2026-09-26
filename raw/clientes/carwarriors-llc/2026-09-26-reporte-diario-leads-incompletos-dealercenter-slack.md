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
   - Envía el reporte automáticamente al canal `#notificaciones` (`C0BPV2Z2S3C`) utilizando la credencial oficial `Slack FORJADO` (`wUpEjaBadmKdhhqM`).

---

## 2. Pruebas y Verificación en Vivo

Se ejecutó la prueba manual (Ejecución ID: `9659`):
- **Estatus:** **`success`** (100% de los nodos ejecutados en 3.08 segundos).
- **Slack API:** `ok: true`, entregado en canal `C0BPV2Z2S3C`.
- **Datos reales auditados en la prueba:**
  - Leads analizados (últimas 48h): **74 leads**.
  - Leads recientes incompletos: **71 leads** (59 sin asignación de vendedor/BDC, 65 sin task/cita futura programada).
  - Tasa de cumplimiento reciente del SOP: **4%**.
  - Pipeline activo global: **482 prospectos activos** (457 con falta de task futura).
  - Listado de prospectos con banderas claras: `🔴 SIN ASIGNACIÓN` y `⚠️ SIN TASK FUTURA`.

---

## 3. Estado en Producción

- **Workflow ID:** `jc317DtnKMYEscC5`
- **Active Version ID:** `9bc742fb-8f14-4b65-8273-e79775da482e`
- **Estatus:** **`active: true`**
- **Siguiente ejecución automática:** Diariamente a las **09:00 AM hora Miami**.
- **Pendiente:** CERRADO y RESUELTO al 100%.

---

## Relacionado

- [[../../wiki/clientes/carwarriors-llc]]
- [[2026-09-25-solicitud-reporte-diario-leads-sin-asignacion-dealercenter]]
- [[2026-09-24-sop-capacitacion-ventas-dealercenter]]
- [[2026-09-23-auditoria-dealercenter-y-catalogo-automatizaciones]]
