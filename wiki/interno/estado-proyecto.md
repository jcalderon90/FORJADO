---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-08-25 (noche)
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | 🔴 Bug crítico activo: token de GHL vencido en `RSVP`, 1 cita real confirmada al cliente que nunca se creó en el calendario — además esperando confirmación de Bianca sobre auto-asignación de leads | 2026-08-25 (noche) |
| **Varela Law** | 🟢 En producción — encontrado y documentado un sistema en producción no registrado antes (tracking de pagos Zelle), con un riesgo menor de modelo gratis inestable | 2026-08-25 |
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
