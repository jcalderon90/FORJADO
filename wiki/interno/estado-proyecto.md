---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-09-02
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | Bianca reportó frustración por el volumen de bugs seguidos (2026-09-02) — respondida reconociendo el patrón y reencuadrando la fase de pruebas activas como la razón de ser de tanto ajuste; **ítem cerrado del lado nuestro** (mensaje enviado, no se sigue esperando respuesta como pendiente). Sesión 09-01/09-02 fue intensa: WhatsApp ya contratado y activo en Carwarriors LLC, bot corregido para atenderlo (gate de teléfono bloqueante + trigger de WhatsApp agregado al automation de GHL), filtro explícito de teléfono antes de subir a DealerCenter, y auditoría de un bug de parsing de `deepseek-v4-flash` corregido en 4 nodos (ambos dealers). El mismo 09-01 Bianca reportó, con captura real, que el bot **inventó una dirección física** a un lead que quería visitar en persona (dio "1234 NW 12th Street" en vez de la real, 3620 NW 27th Ave) — diagnosticado (el KB en Mongo ya tenía el dato correcto, faltaba el guardrail que obligara a consultarlo) y corregido en ambos dealers, verificado en la versión activa. El 09-02, más temprano, se había confirmado que Rances Car no tenía WhatsApp contratado y se le agregó igual el trigger al automation, preventivo. **Ese mismo día, a pedido de Jorge González, se activó la suscripción de WhatsApp ($10/mes) para Rances Car** — pero el wizard de conexión de GHL se frenó en el paso "Connect with Facebook": no está confirmado si la cuenta de Facebook de Carwarriors LLC sirve para Rances Car o si necesita una página/Meta Business propia, así que no se completó la vinculación del número. El 09-02 también se arrancó el backlog nuevo del brief de Bianca: **DealerCenter tasks viejos pausado** (choca con el mismo Auth0/anti-bot que ya bloqueó la automatización de fotos) y en su lugar se construyó y publicó **recorridos diferenciados del bot** (etapa del lead NUEVO/SEGUIMIENTO/FRIO según días desde el último contacto, ajustando el tono de apertura) en ambos dealers — falta confirmar con tráfico real. 🟡 Varios fixes de la semana **sin confirmar todavía con tráfico real** (gate de teléfono, WhatsApp, guardrail de dirección, rama GRATIS, etapa del lead). 🟡 Conexión de WhatsApp en Rances Car a medio camino, esperando definir cuenta de Facebook/Meta Business a usar. 🟡 Bug de auto-asignación de BDC Rep en DealerCenter sigue sin resolver, ticket `#TICKET-20586098` Open sin respuesta de soporte. 🟡 Comentarios IG/FB vía ManyChat en LIVE desde 08-31, falta confirmar con tráfico real. 🟡 Nuevo pedido de reporte mensual de ventas retail por marca/modelo, bloqueado en que Bianca/DealerCenter entreguen el reporte correcto. Ver detalle completo en [[../clientes/carwarriors-llc]] | 2026-09-02 |
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
