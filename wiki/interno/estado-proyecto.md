---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-08-27 (tarde)
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | 🟢 Jorge pidió 4 mejoras nuevas (comentarios IG/FB con interés real, bot se calla con handoff humano, ticket a soporte DealerCenter, bot 24/7 + SMS de leads calientes) — la del handoff humano ya está **construida y publicada en producción** en ambos dealers (2026-08-27); las otras 3 siguen abiertas. Sigue esperando respuesta de Bianca sobre el bug de auto-asignación de leads en DealerCenter | 2026-08-27 |
| **Varela Law** | 🟢 En producción — activada la primera de 5 oportunidades nuevas de MyCase (reporte semanal de facturas vencidas, 54 facturas/$81,324.76 en el primer envío real); 2 más construidas y esperando confirmación de Mario | 2026-08-27 |
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
