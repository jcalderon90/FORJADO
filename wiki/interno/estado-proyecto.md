---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-08-31
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | 🟢 **Comentarios IG/FB: Flow de ManyChat PUBLICADO en LIVE (2026-08-31)** — Trigger (cualquier post/reel) → Solicitud Externa a n8n → Condición `es_interes_real` → DM. El workflow n8n `COMENTARIOS-MANYCHAT` ahora también detecta idioma (es/en) y responde en consecuencia. Se descartaron 2 alternativas nativas de ManyChat (puente Growth Tool, IA nativa de comentarios) por no ofrecer branching estructurado. Automatización vieja `Auto-DM de links desde comentarios` detenida (confirmado que solo hacía 2 DMs, nada más oculto) — pendiente confirmar con Bianca si esos DMs de "club de regalos" eran importantes. Falta probar con tráfico real (ManyChat no permite simular el trigger de comentarios en su panel de pruebas). 🟡 **Bug de auto-asignación de BDC Rep en DealerCenter — investigado a fondo (2026-08-29), sigue sin resolver, ticket `#TICKET-20586098` sigue Open sin respuesta de soporte.** Se confirmó que las 31 reglas de Custom Lead Assignment sí funcionan bien para las categorías oficiales de Bianca, pero se auditaron los 112 leads de Alejandra Roa y ~40% no le corresponden (incluye un caso donde se violó una regla real: un lead de Tesla Rances terminó en Alejandra). Se sumó esta evidencia al ticket y se evaluaron 2 mitigaciones propias (apagar el switch de BDC Rep, quitar las reglas) — ambas descartadas por empeorar la situación. Bianca fue informada. **Esperando respuesta de soporte de DealerCenter**, mitigación mientras tanto: auditoría manual periódica, no automatizable. **Bianca entregó brief de roadmap completo (2026-08-28 noche)** — chatbot con recorridos por etapa, DealerCenter (reasignación de tasks viejos +48/72h, marcado MUY IMPORTANTE), contabilidad/ROI, marketing y IA de ventas (scoring de leads). Nada construido todavía salvo lo que ya coincide con el pipeline actual; queda como backlog a priorizar con Jorge González/Bianca. 4 bugs de producción del bot n8n corregidos y verificados (2026-08-29): parsing de `KB - SEARCH`, `GRATIS - Respuesta` forzando WhatsApp sin teléfono, notificaciones de Slack vacías, `LEAD - COLLECTOR` sin manejo de errores — los 4 publicados en ambos dealers. Handoff humano y guardrail de vehículo gratis siguen construidos y en producción en ambos dealers. Sync de leads GHL↔DealerCenter: ambas direcciones sanas. SMS de leads calientes: bloqueado hasta que Jorge González compre número SMS en GHL | 2026-08-31 |
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
