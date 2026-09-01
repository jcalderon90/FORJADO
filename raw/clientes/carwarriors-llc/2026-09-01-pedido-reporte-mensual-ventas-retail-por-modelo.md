---
tags: [forjado, cliente, carwarriors, pedido, dealercenter, reportes, automatizacion]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-01
---

# 2026-09-01 — Pedido de Jorge (cliente): reporte mensual automático de ventas retail por marca/modelo

**Contexto:** Bianca transmite un pedido de Jorge (el cliente, dueño del dealer — no confundir con Jorge Calderón el consultor) recibido por llamada. Pide una automatización que corra el día 1 de cada mes y arme un análisis de ventas del mes anterior, desglosado por marca y modelo, usando datos de DealerCenter.

## Transcripción del pedido (vía audio de Bianca)

> «Jorge, ¿sabes qué otra cosa que justo ahora me acaba de llamar Jorge para pedirme? Que si podíamos hacer alguna automatización que todos los días primero de cada mes nos envíes, o decirle a DealerCenter como que lo arme, los autos en base a el modelo más vendido, la marca más vendida... y todo lo que está en lo de retail, nada de lo de wholesale o lo de buy here pay here, todo de lo de retail.
>
> Pero eso, por ejemplo, no sé, si este mes se vendieron 21 Mercedes-Benz, bueno, de esos 21 eran no sé, 10 GLE 350, dos eran GLE 450 y tres era GLC 300, no sé, bueno, así como que haga todo el análisis y que nos las envíe todos los días primero, ¿se podrá hacer eso?»

## Requerimientos extraídos

- **Trigger:** día 1 de cada mes (reporte del mes recién cerrado).
- **Fuente de datos:** DealerCenter — inventario/ventas.
- **Filtro de canal de venta:** solo **retail**. Excluir explícitamente **wholesale** y **buy here pay here (BHPH)**.
- **Desglose pedido:** por marca (ej. Mercedes-Benz: 21 unidades) y dentro de cada marca, por modelo/trim (ej. GLE 350: 10, GLE 450: 2, GLC 300: 3).
- **Entrega:** envío automático mensual (no especificó canal — WhatsApp, email, o algo dentro del propio DealerCenter). Falta confirmar con el cliente el medio de entrega y a quién(es) llega.

## Preguntas abiertas / a validar antes de construir

- ¿DealerCenter expone vía su API/reportes un campo que distinga retail vs wholesale vs BHPH al nivel de venta cerrada (deal), o hay que inferirlo de otro campo (tipo de deal, lot, etc.)?
- ¿Canal de entrega deseado? (email, WhatsApp a Bianca/Jorge, Slack, PDF adjunto, etc.)
- ¿A quién(es) exactamente debe llegar el reporte?
- ¿Solo conteo de unidades por marca/modelo, o también quieren métricas de $ (revenue, gross profit) en el mismo reporte? El pedido tal como está transcrito es solo conteo de unidades, pero vale confirmarlo dado que el punto 3 del brief de Bianca ([[2026-08-28-brief-automatizacion-bianca]]) ya pedía "reportes mensuales automáticos" y "dashboard con costo por lead, costo por venta, rentabilidad por campaña" — este pedido de Jorge podría ser el punto de entrada a esa pieza más grande del roadmap.

## Relación con brief existente

Este pedido es un caso concreto y accionable dentro del punto 3 ("Automatización en contabilidad / números" → "Reportes mensuales automáticos") del brief PDF de Bianca ([[2026-08-28-brief-automatizacion-bianca]]), que hasta ahora estaba sin construir ("Nada construido — no hay ningún workflow tocando gastos, ROI de Meta, ni dashboard financiero"). Es la primera pieza concreta de esa sección con alcance bien definido por el cliente (a diferencia del resto del brief, que es más genérico).

**Estado:** pedido recibido y documentado, sin ejecutar. Pendiente validar con Jorge (consultor) prioridad frente al resto del backlog, y resolver las preguntas abiertas (acceso a datos DealerCenter retail vs wholesale/BHPH, canal de entrega) antes de diseñar el workflow.
