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
| **Carwarriors LLC** | 🟢 **Ticket real abierto en soporte de DealerCenter (2026-08-28)** por el bug de auto-asignación de BDC Rep — Jorge Calderón escaló directo con la evidencia completa en vez de seguir esperando a Bianca; el asistente de IA del propio formulario de soporte reafirmó el diagnóstico sin ofrecer solución, se envió igual a soporte humano. **Esperando respuesta de soporte de DealerCenter.** Comentarios IG/FB: **corrección 2026-08-28** — la cuenta de ManyChat es plan FREE, no Pro; las 2 features clave (External Request hacia n8n, All posts/reels) son Pro-only ($29-39/mes), igual de limitado que el trigger nativo de GHL ya descartado. Mensaje enviado a Jorge González y Bianca con 3 opciones (upgrade ManyChat Pro — recomendado; Meta Graph API directo + App Review de semanas; o pausar), **esperando su decisión sobre el gasto**. La del handoff humano sigue **construida y publicada en producción** en ambos dealers (2026-08-27, confirmada con tráfico real en PRINCIPAL). SMS de leads calientes: instrucciones ya entregadas para que Jorge González compre número SMS en GHL, bloqueado hasta que confirme. Bot viejo de GHL inventando que venden Tesla — verificado y **borrado por completo vía API en ambos dealers** (2026-08-27). Guardrail de leads que esperan vehículo gratis — **construido y publicado en producción en ambos dealers** (2026-08-27), pendiente confirmar con tráfico real. Sync de leads GHL↔DealerCenter (2026-08-27): **ambas direcciones sanas** | 2026-08-28 |
| **Varela Law** | 🔴 Riesgo de negocio: Mario dice que dejó de pagar la API de MyCase (pensando que solo servía para el Trust) — verificado que sigue viva ahora mismo, pero si la corta de verdad se caen 4 sistemas en producción (Token Manager, Radar Billing, reporte semanal de facturas vencidas lanzado hoy, tracking Zelle). Falta que Jorge se lo aclare a Mario | 2026-08-27 |
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
