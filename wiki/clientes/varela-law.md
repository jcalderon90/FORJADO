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
3. Ambos workflows tienen `errorWorkflow` conectado a `ERROR HANDLER` (email automático a `jcalderon900610@gmail.com` ante cualquier fallo).

## Pendientes abiertos (al 2026-08-25)

- [ ] Enviar a Mario el mensaje ya redactado sobre Radar Billing pidiendo que confirme los 4 clientes sin match automático en ID MAP (Joj Santos, Medina Manuel, Marquez Dimas, Rojas Tovar Manuel) — ver [[../../raw/clientes/varela-law/mensajes/mensaje-mario-2026-07-25-radar-billing-completo.txt]].
- [ ] **Esperando a Mario** — priorizar cuál de las 5 oportunidades del análisis completo de API (2026-07-28) atacar primero: (1) facturas vencidas/cobros para Rosa, (2) Leads, (3) Tasks/Events por caso, (4) mensajes automáticos a clientes, (5) documentos/contratos. Ver [[../../raw/clientes/varela-law/mensajes/mensaje-mario-2026-07-28-analisis-api-completo.txt]]. No preguntar proactivamente — avisará él.
- [ ] Hablar con **Adalberto** sobre el sistema automático de contratos (sin fecha).
- [ ] Pendiente menor, no bloqueante: sacar `N8N_BLOCK_ENV_ACCESS_IN_NODE` del VPS para volver a usar `$env` en vez de credenciales hardcodeadas en el nodo del Token Manager.
- [ ] Construir workflows funcionales nuevos (Cases, Tasks, Time Entries, Events) — depende de la priorización de Mario arriba.

## Relacionado

- [[../interno/estado-proyecto|Estado del Proyecto — FORJADO]]
- [[../index|Índice de la bóveda]]
