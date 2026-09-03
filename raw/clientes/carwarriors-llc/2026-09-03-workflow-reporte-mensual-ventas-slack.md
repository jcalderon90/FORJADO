---
tags: [forjado, cliente, carwarriors, dealercenter, reporte-ventas, slack, n8n]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-03
---

# 2026-09-03 — Reporte mensual de ventas retail: canal/timing confirmados con Jorge González, workflow skeleton creado en n8n

**Contexto:** continuación de [[2026-09-01-pedido-reporte-mensual-ventas-retail-por-modelo]]. Jorge Calderón habló con Jorge González, quien confirmó dos cosas que faltaban del pedido original: (1) el reporte debe llegar **el día 1 de cada mes**, y (2) el canal de entrega será **Slack** (mismo canal `notificaciones` que ya usan para alertas de leads).

## Workflow creado en n8n (inactivo)

Se construyó el esqueleto del workflow **`DealerCenter -> Slack (Reporte Mensual Ventas Retail)`** (id `31dHApU2tl76cG4B`, proyecto personal de Jorge Calderón) vía MCP `create_workflow_from_code`, siguiendo el mismo patrón que `DealerCenter -> Mongo -> GHL (Lead Sync)` (Gmail Trigger con adjunto Excel de DealerCenter):

1. **`FORJADO Sales Report Email`** (Gmail Trigger, credencial `jcalderon900610@gmail.com`) — poll cada 30 min, descarga adjuntos. El filtro de asunto (`filters.q`) quedó como **placeholder explícito** (no como texto real) porque el scheduled report de DealerCenter con las ventas todavía no existe — Bianca/DealerCenter no lo han configurado.
2. **`Extraer Excel Ventas`** (Extract From File, xlsx) — igual que Lead Sync.
3. **`Agregar Ventas por Marca-Modelo`** (Code, JS) — busca una fila de encabezados por columnas ancla (`Deal Number`/`Customer Unique ID`/`Stock Number`, supuestas), filtra `Sale Type === 'RETAIL'` (campo confirmado que existe en DealerCenter por el diagnóstico de ROI del 09-02, aunque ahí solo se vio en el contexto de inventario, no de ventas cerradas), parsea la columna `Sold Vehicle` (string "Año Marca Modelo") separando por espacios para sacar marca+modelo, cuenta unidades por marca-modelo y arma el texto final de Slack. Si no encuentra la fila de encabezados, lanza error explícito en vez de fallar en silencio (mismo estilo defensivo que Lead Sync).
4. **`Enviar Reporte a Slack`** — canal `notificaciones` (id `C0BPV2Z2S3C`), credencial `Slack FORJADO`, mismo canal y credencial que usa `NOTIFICATIONS` para las alertas de leads.
5. **`Marcar Email como Leido`** — mismo patrón de Lead Sync (`executeOnce`, referencia al id del trigger).
6. Sticky note documentando explícitamente los 3 supuestos sin confirmar: asunto del email, nombres de columnas (`Sale Type`, `Sold Vehicle`), y que unidades-vs-$ sigue sin definir con Jorge González (por ahora el workflow solo cuenta unidades, no montos).

Validado con `validate_workflow` antes de crear (`valid: true, nodeCount: 6`). **Workflow queda inactivo/sin publicar a propósito** — no tiene sentido activarlo hasta que Bianca/DealerCenter entreguen el reporte real y se pueda confirmar el asunto exacto del email y los nombres reales de columnas contra un archivo de muestra.

## Pendiente real (sigue igual que el 09-01, ahora con más detalle)

- [ ] **Bloqueante principal sin cambios**: pedirle a Bianca/DealerCenter el reporte real de ventas/deals cerrados. Sin un archivo de muestra real no se puede confirmar si `Sale Type`/`Sold Vehicle` son los nombres de columna correctos, ni el asunto del email.
- [ ] Una vez llegue el primer envío real: ajustar `ANCHOR_HEADERS`, `SALE_TYPE_FIELD`, `VEHICLE_FIELD` y el filtro `q` del Gmail Trigger en el workflow `31dHApU2tl76cG4B`, probar con `test_workflow` o una ejecución manual, y recién ahí activarlo.
- [ ] Decidir con Jorge González si además de unidades por marca-modelo quiere montos en dólares (pendiente de definir, no bloqueante para la primera versión).

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-01-pedido-reporte-mensual-ventas-retail-por-modelo]]
- [[2026-09-02-dealercenter-roi-diagnostico-completo]]
