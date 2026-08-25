---
tags: [forjado, cliente, varela-law, automatizacion, legal]
tipo: cliente
estado: activo
servicio: automatizacion
contacto: Mario Varela
creado: 2026-06-17
actualizado: 2026-08-25
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
4. Todos los workflows tienen `errorWorkflow` conectado a `ERROR HANDLER` (email automático a `jcalderon900610@gmail.com` ante cualquier fallo).

## Pendientes abiertos (al 2026-08-25)

- [ ] **Riesgo activo, no bloqueante hoy** — el nodo `OpenRouter Chat Model` del tracking de Zelle usa el slug `openrouter/free`, que OpenRouter ya avisó que dejó de sostener (falló 2 veces el 2026-08-24 con 404, se auto-resolvió sin cambios y sigue corriendo bien desde entonces). Puede volver a fallar sin aviso — pendiente cambiarlo a un modelo de pago estable (ej. `deepseek/deepseek-v4-flash`, ya en uso en el resto de la cuenta). Detalle: [[../../raw/clientes/varela-law/2026-08-25-zelle-tracking-descubierto]].
- [ ] Enviar a Mario el mensaje ya redactado sobre Radar Billing pidiendo que confirme los 4 clientes sin match automático en ID MAP (Joj Santos, Medina Manuel, Marquez Dimas, Rojas Tovar Manuel) — ver [[../../raw/clientes/varela-law/mensajes/mensaje-mario-2026-07-25-radar-billing-completo.txt]].
- [ ] **Esperando a Mario** — priorizar cuál de las 5 oportunidades del análisis completo de API (2026-07-28) atacar primero: (1) facturas vencidas/cobros para Rosa, (2) Leads, (3) Tasks/Events por caso, (4) mensajes automáticos a clientes, (5) documentos/contratos. Ver [[../../raw/clientes/varela-law/mensajes/mensaje-mario-2026-07-28-analisis-api-completo.txt]]. No preguntar proactivamente — avisará él.
- [ ] Hablar con **Adalberto** sobre el sistema automático de contratos (sin fecha).
- [ ] Pendiente menor, no bloqueante: sacar `N8N_BLOCK_ENV_ACCESS_IN_NODE` del VPS para volver a usar `$env` en vez de credenciales hardcodeadas en el nodo del Token Manager.
- [ ] Construir workflows funcionales nuevos (Cases, Tasks, Time Entries, Events) — depende de la priorización de Mario arriba.

## Relacionado

- [[../interno/estado-proyecto|Estado del Proyecto — FORJADO]]
- [[../index|Índice de la bóveda]]
