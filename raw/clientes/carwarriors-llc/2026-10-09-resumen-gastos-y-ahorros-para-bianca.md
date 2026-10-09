---
tags: [forjado, cliente, carwarriors, costos, ahorros, bianca, contabilidad]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-10-09
---

# 2026-10-09 — Resumen de gastos contratados y ahorros (para que Bianca los registre)

**Pedido de Jorge:** listar, desde que empezó a trabajar con Carwarriors, lo que se ha tenido que pagar o contratar y en qué se ahorró, con detalle, para que Bianca lo registre. Se armó leyendo la bóveda (info hasta 2026-09-28; inicio tomado como 2026-06-18, fecha de la propuesta CW-001). **No hay facturas ni extractos en la bóveda**: casi todos los montos son tarifa de lista o estimado. Solo los $10/mes de WhatsApp y los $5 de saldo en OpenRouter tienen confirmación directa.

## Gastos contratados o pagados

| Concepto | Monto | Desde | Quién paga | Estado del dato |
|---|---|---|---|---|
| VPS Hostinger KVM 1 (n8n, Redis, Postgres vía Coolify) | ~$8/mes | contratado por el cliente; Coolify instalado 2026-07-27 | Carwarriors directo a Hostinger | tarifa de propuesta, sin factura |
| OpenRouter (IA del bot, embeddings, clasificadores; modelo `deepseek-v4-flash`, ~$0.14/$0.28 por M tokens) | $5 USD cargados el 2026-08-17; estimado ~$10–30/mes | 2026-08-17 | Jorge González paga, Bianca da acceso (nota de infraestructura) | $5 confirmado; **consumo mensual real no registrado**; segunda API key con saldo para embeddings, monto no anotado |
| GHL WhatsApp Messaging — Carwarriors LLC (`+15557757668`) | $10/mes | 2026-09-01 | Carwarriors | confirmado |
| GHL WhatsApp Messaging — Rances Car | $10/mes | 2026-09-02 | Carwarriors | confirmado; **pagado pero sin uso** (bloqueo de Meta Business Portfolio, ver [[2026-09-25-investigacion-whatsapp-rances-car-meta-business]]) |
| ManyChat Pro | $29–39/mes (fuentes web) | trial en agosto; plan PRO el 2026-09-28 | **por confirmar**: la cuenta tiene como propietario a un tercero ("booxter marketing") | monto de fuente web, no de factura |
| MongoDB Atlas M0 | $0 | 2026-07 | — | gratis |

Recurrente mensual: ~$38–58 sin ManyChat Pro; ~$67–97 con ManyChat Pro.

**Propuesto y no comprado:** número SMS en GHL (~$1.15/mes + ~$0.0079/SMS) para avisos de leads calientes a Jorge González; espera su confirmación.

**No registrado en la bóveda:** retainer de FORJADO (propuesta de $200/mes con tope $500, estado "por formalizar"), costo de Slack. El gasto en Meta Ads (~$1,000/mes por campaña) no se incluyó: es del cliente y Bianca pidió mantenerlo interno.

## Ahorros / gasto evitado

Medido:
- Costo de IA en llamadas: $0.116 para 96 llamadas (~38 min de audio), panel del 2026-06-18.
- Pre-filtro anti-spam a costo $0 (sin LLM); los leads que esperan algo gratis no llegan al agente principal (ahorro real, sin cifra).

Cualitativo, sin cifra medida:
- Se eliminó GHL Conversation AI / AI wallet (decisión 2026-08-12, en producción 2026-08-19); se descartó arreglar la tarjeta de GHL Billing el 2026-08-17.
- Make reemplazado por n8n para el sync GHL→DealerCenter (Make se pausó porque agotaba el saldo por operaciones).
- Modelo barato estandarizado (`deepseek-v4-flash` en vez de `gpt-4.1-mini`).
- Automatizaciones que eran manuales: sync diario de inventario (127 vehículos, 83 fotos), sync de leads con dedupe, notificaciones, reporte mensual a Slack. Sin horas medidas.

Estimado de la propuesta (proyección de FORJADO, no medido): alternativas no contratadas ≈ +$850–1,000/mes (Zapier +$200, chatbot IA externo +$50–100, reportes de llamadas +$100–200, consultor de datos +$500).

## Pendiente

- [ ] Facturas de Hostinger y OpenRouter (o su pantalla de uso) para confirmar montos reales.
- [ ] Confirmar con Jorge González quién paga ManyChat Pro y desde cuándo.
- [ ] Decidir qué hacer con el WhatsApp de Rances Car (opciones 1/2/3 del 2026-09-25; la opción 2 ahorraría $10/mes).
- [ ] Armar la tabla en el formato de la hoja de registro de Bianca, si Jorge indica cuál.
