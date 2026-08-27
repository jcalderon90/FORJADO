---
tags: [forjado, cliente, varela-law, automatizacion, legal]
tipo: cliente
estado: activo
servicio: automatizacion
contacto: Mario Varela
creado: 2026-06-17
actualizado: 2026-08-27
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

## Sistemas en producción

1. **MyCase API — Token Manager** (`MOpVRrvErCfgs2mn`): refresca el OAuth de MyCase cada 23h vía MongoDB (`VarelaLaw.mycase_tokens`). 100% operativo. Detalle: [[varela-law-mycase-api]].
2. **Radar Billing Automation**: escribe automáticamente F (Total Amount Collected), H (Total Invoiced Amount) y J (Uninvoiced Balance) en la pestaña `07-05-26` del Google Sheet de Mario todos los días a las 5:00 AM. Trust Balance no disponible vía API de MyCase (confirmado con soporte) — queda manual. Detalle: [[varela-law-radar-billing]].
3. **Tracking de pagos Zelle entrantes** (`TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK`, `BruqJ1jdEV9xl5zG`) — detectado 2026-08-25, no documentado antes en la bóveda. Lee los correos que Mario reenvía (`FW: You received money with Zelle`) por Outlook, extrae remitente/monto/fecha/transacción con doble método (regex + LLM), y si coinciden crea el registro en Airtable y en el Google Sheet "Incoming Mail Payments"; si no coinciden, alerta por email para revisión manual. Detalle: [[../../raw/clientes/varela-law/2026-08-25-zelle-tracking-descubierto]].
4. **Reporte semanal de facturas vencidas** (`Radar Billing - Reporte Facturas Vencidas (Semanal)`, `ZxZONW1XANkoP1ay`) — EN PRODUCCIÓN desde 2026-08-27, primera oportunidad activada del análisis de API de MyCase (2026-07-28). Cada lunes 8am trae `/invoices` y `/cases` de MyCase, filtra las de `status: "overdue"`, y manda a `mvarela@varela.law` una tabla con balance pendiente, días de atraso y link directo a cada factura. Primer envío real (2026-08-27): 54 facturas vencidas, $81,324.76 de balance total pendiente.
5. Todos los workflows tienen `errorWorkflow` conectado a `ERROR HANDLER` (email automático a `jcalderon900610@gmail.com` ante cualquier fallo).

## Pendientes abiertos (al 2026-08-27)

- [ ] **🔴 Aclarar con Mario — riesgo de negocio, no técnico:** mencionó haber dejado de pagar la API de MyCase (por el Trust Balance no disponible vía API). Verificado que sigue 100% viva ahora mismo (Token Manager y Radar Billing corrieron con éxito hoy). Pero si la cancela de verdad, se caen 4 sistemas en producción a la vez: Token Manager, Radar Billing (F/H/J diario), el reporte semanal de facturas vencidas (lanzado hoy mismo), y el tracking de Zelle. Jorge tiene que confirmarle que la API vale más allá del Trust antes de que la corte. Detalle: [[../../raw/clientes/varela-law/2026-08-27-mario-posible-cancelacion-api-mycase|raw/2026-08-27]].
- [ ] **Esperando a Mario** — de las 5 oportunidades del análisis de API (2026-07-28), la #1 (facturas vencidas) ya está en producción (ver arriba). Quedan por confirmar:
  - (2) Leads — **bloqueada**: MyCase no tiene ningún lead cargado (`GET /leads` devolvió 0), sin datos reales no se puede confirmar el shape del objeto para escribir la asignación con seguridad. Retomar si aparece un lead real.
  - (3) Agenda de deadlines/audiencias — **construida, inactiva**, `Radar Billing - Agenda Deadlines y Audiencias (Diario)` (`4QsJaKlmHDhkVtBV`), esperando que Mario confirme si la quiere. La otra mitad de esta oportunidad (checklist automática de tareas al abrir un caso nuevo) sigue sin construir — depende de que Mario defina su checklist real, no es algo inventable sin riesgo.
  - (4) Borrador de avisos a clientes — **construida, inactiva**, `Radar Billing - Borrador Avisos de Facturas Nuevas (Diario)` (`lTVFM7I3wJBpW7we`), detecta facturas nuevas y redacta el mensaje sugerido pero no lo envía al cliente (solo a Mario para revisión).
  - (5) Documentos/contratos — **bloqueada**: depende de una conversación con Adalberto que no ha ocurrido.
  - No preguntar proactivamente — avisará él. Detalle completo: [[../../raw/clientes/varela-law/2026-08-27-build-5-oportunidades-api]].
- [ ] **Baja prioridad** — 4 de 99 clientes sin match automático en ID MAP (Joj Santos, Medina Manuel, Marquez Dimas, Rojas Tovar Manuel): el sistema los deja intactos, mismo trabajo manual que Mario ya hacía antes, sin riesgo de dato incorrecto. Mario no ha reportado ningún inconveniente. Mensaje ya redactado, listo para enviar cuando surja la ocasión — ver [[../../raw/clientes/varela-law/mensajes/mensaje-mario-2026-07-25-radar-billing-completo.txt]].
- [ ] Hablar con **Adalberto** sobre el sistema automático de contratos (sin fecha).
- [ ] Construir workflows funcionales nuevos (Cases, Tasks, Time Entries, Events) — depende de la priorización de Mario arriba.

## Relacionado

- [[../interno/estado-proyecto|Estado del Proyecto — FORJADO]]
- [[../index|Índice de la bóveda]]
