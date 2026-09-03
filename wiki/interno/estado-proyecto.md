---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-09-03
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | **09-03: Jorge reportó notificaciones de error de ambos agentes — diagnosticado y corregido.** 4 timeouts de 10 min de OpenRouter (`deepseek-v4-flash`) en `LEAD - COLLECTOR` (compartido por ambos dealers) bloqueaban al lead esa demora antes de que el agente recuperara y respondiera. Fix (`timeout: 60s` + 1 reintento) aplicado y publicado en los 6 workflows que usan ese modelo (`LEAD - COLLECTOR`, `PRINCIPAL`, `PRINCIPAL - Rances Car`, `KB - SEARCH`, `RSVP`, `RSVP - Rances Car`), verificado byte a byte en producción y con una prueba end-to-end real (bot respondió correctamente, OpenRouter en 8-9s, muy por debajo del nuevo límite). Aparte, cuenta de DealerCenter (`jcalderon90`) bloqueada (09-03) — pausa cualquier tarea que requiera su UI — y WhatsApp Messaging de Rances Car sigue bloqueado por falta de permiso de Admin de Business Portfolio en Meta (mensaje enviado a Bianca con 2 opciones, esperando). Contexto previo (09-01/09-02): WhatsApp en producción en Carwarriors LLC, gate de teléfono bloqueante, guardrail de dirección, recorridos diferenciados por etapa del lead — todo publicado. 🟡 Varios fixes de la semana sin confirmar todavía con tráfico real. 🟡 Bug de auto-asignación de BDC Rep sin resolver, ticket `#TICKET-20586098` Open. 🟡 Reporte mensual de ventas bloqueado en que Bianca/DealerCenter entreguen el reporte correcto. Ver detalle completo en [[../clientes/carwarriors-llc]] | 2026-09-03 |
| **Varela Law** | 🟡 Riesgo de negocio (API de MyCase): mensaje enviado a Mario 2026-08-28 explicando los 4 sistemas en producción que dependen de esa API — **esperando su respuesta**, no perseguir proactivamente. Parser de `Build ID MAP` — resultó ya estar corregido desde el 2026-08-14 (documentado recién ahora), verificado y cerrado. Columna N (Num Overdue Invoices) confirmada automatizable con datos que ya extraemos, sin construir todavía. Backlog nuevo de 6 ideas (investigación externa 2026-08-28): webhooks de MyCase, checklist al abrir caso, conflicto de interés en leads nuevos, seguimiento de clientes sin contacto reciente, y dos de bajo esfuerzo — activar la Agenda de Deadlines ya construida y ampliar el Borrador de Avisos para envío directo al cliente | 2026-08-28 |
| **Pipeline / prospección** | Ver [[../ventas/pipeline]] | 2026-08-15 |

## Bóveda / herramientas internas

- `.claude/skills/compile-wiki/` — compila sesiones de trabajo con clientes desde `raw/` hacia `wiki/` (usar al cerrar una sesión real).
- `.claude/skills/manage-vault/` — referencia general de convenciones para navegar/crear/editar en esta bóveda, creada 2026-09-02 a pedido de Jorge para que cualquier agente (no solo esta sesión) la gestione bien. Ver [[../../README|README]] y [[../../raw/interno/2026-09-02-skill-manage-vault-creada]].

## Pendientes de la agencia (no ligados a un cliente específico)

- [ ] Rotar la Location API Key de Carwarriors LLC en GHL (quedó expuesta en un chat el 2026-07-27) — Jorge indicó explícitamente no rotarla por ahora.
- [ ] Investigar `n8n.apps.carwarriorsllc.com` — instancia n8n externa, viva y mantenida (cert renovado, no es del proyecto FORJADO), posible relación con "Customers for AI" (Carlos Cisneros). Sin credenciales para ver qué corre ahí. Pendiente conseguir login o preguntarle directamente a Carlos Cisneros.
- [ ] Completar datos del panel de inicio (fundador y contacto ya cargados): web/redes y forma legal/facturación — requiere datos del usuario.

## Relacionado

- [[../clientes/carwarriors-llc|Carwarriors LLC]]
- [[../clientes/varela-law|Varela Law]]
- [[../ventas/pipeline|Pipeline (MOC)]]
- [[../index|Índice de la bóveda]]
