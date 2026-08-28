---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-08-28
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | 🟢 **Bianca entregó brief de roadmap completo (2026-08-28 noche)** junto con el acceso a ManyChat — chatbot con recorridos por etapa, DealerCenter (reasignación de tasks viejos +48/72h, marcado MUY IMPORTANTE), contabilidad/ROI, marketing y IA de ventas (scoring de leads). Nada construido todavía salvo lo que ya coincide con el pipeline actual; queda como backlog a priorizar con Jorge González/Bianca. **Ticket real abierto en soporte de DealerCenter (2026-08-28)** por el bug de auto-asignación de BDC Rep — Jorge Calderón escaló directo con la evidencia completa en vez de seguir esperando a Bianca; el asistente de IA del propio formulario de soporte reafirmó el diagnóstico sin ofrecer solución, se envió igual a soporte humano. **Esperando respuesta de soporte de DealerCenter.** Comentarios IG/FB: **actualización 2026-08-28 (noche)** — Jorge Calderón entró con acceso real a ManyChat (invitado) y confirmó que la cuenta está en **TRIAL de Pro** (no Pro pagado, no Free): tiene las features clave activas ahora (probablemente External Request hacia n8n y All posts/reels) pero por tiempo limitado, sin fecha de vencimiento localizada aún. Próximo paso: ubicar cuándo vence el trial y, si alcanza, avanzar ya con el cambio técnico (reemplazar el mensaje estático del flujo "Comentario en post/reel" por External Request a n8n) sin esperar aprobación de gasto — avisando que van a tener que decidir sobre el pago cuando expire. La del handoff humano sigue **construida y publicada en producción** en ambos dealers (2026-08-27, confirmada con tráfico real en PRINCIPAL). SMS de leads calientes: instrucciones ya entregadas para que Jorge González compre número SMS en GHL, bloqueado hasta que confirme. Bot viejo de GHL inventando que venden Tesla — verificado y **borrado por completo vía API en ambos dealers** (2026-08-27). Guardrail de leads que esperan vehículo gratis — **construido y publicado en producción en ambos dealers** (2026-08-27), pendiente confirmar con tráfico real. Sync de leads GHL↔DealerCenter (2026-08-27): **ambas direcciones sanas** | 2026-08-28 |
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
