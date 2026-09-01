---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-09-01
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | 🟢 **"WhatsApp desconectado" + "leads no llegan a DealerCenter" diagnosticados como la misma causa raíz (2026-09-01)**: WhatsApp Messaging nunca se contrató en GHL, y sin él los leads llegan sin teléfono, por lo que el sync a DealerCenter nunca disparaba. Bot rediseñado (teléfono bloqueante, 3 intentos) y auditoría de un bug de parsing de `deepseek-v4-flash` corregida en 4 nodos, ambos dealers. Pendiente: confirmar con tráfico real limpio y decisión de Carwarriors sobre WhatsApp ($10/mes). Nuevo pedido: reporte mensual de ventas retail por marca/modelo para DealerCenter. 🟡 Bug de auto-asignación de BDC Rep en DealerCenter sigue sin resolver, ticket `#TICKET-20586098` Open sin respuesta de soporte. 🟡 Comentarios IG/FB vía ManyChat publicado en LIVE (08-31), falta confirmar con tráfico real. Ver detalle completo en [[../clientes/carwarriors-llc]] | 2026-09-01 |
| **Varela Law** | 🟡 Riesgo de negocio (API de MyCase): mensaje enviado a Mario 2026-08-28 explicando los 4 sistemas en producción que dependen de esa API — **esperando su respuesta**, no perseguir proactivamente. Parser de `Build ID MAP` — resultó ya estar corregido desde el 2026-08-14 (documentado recién ahora), verificado y cerrado. Columna N (Num Overdue Invoices) confirmada automatizable con datos que ya extraemos, sin construir todavía. Backlog nuevo de 6 ideas (investigación externa 2026-08-28): webhooks de MyCase, checklist al abrir caso, conflicto de interés en leads nuevos, seguimiento de clientes sin contacto reciente, y dos de bajo esfuerzo — activar la Agenda de Deadlines ya construida y ampliar el Borrador de Avisos para envío directo al cliente | 2026-08-28 |
| **Pipeline / prospección** | Ver [[../ventas/pipeline]] | 2026-08-15 |

## Pendientes de la agencia (no ligados a un cliente específico)

- [ ] Rotar la Location API Key de Carwarriors LLC en GHL (quedó expuesta en un chat el 2026-07-27) — Jorge indicó explícitamente no rotarla por ahora.
- [ ] Investigar `n8n.apps.carwarriorsllc.com` — instancia n8n externa, viva y mantenida (cert renovado, no es del proyecto FORJADO), posible relación con "Customers for AI" (Carlos Cisneros). Sin credenciales para ver qué corre ahí. Pendiente conseguir login o preguntarle directamente a Carlos Cisneros.
- [ ] Completar datos del panel de inicio (fundador y contacto ya cargados): web/redes y forma legal/facturación — requiere datos del usuario.

## Relacionado

- [[../clientes/carwarriors-llc|Carwarriors LLC]]
- [[../clientes/varela-law|Varela Law]]
- [[../ventas/pipeline|Pipeline (MOC)]]
- [[../index|Índice de la bóveda]]
