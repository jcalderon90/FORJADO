---
tags: [forjado, cliente, varela-law, mycase, brainstorm]
tipo: raw
cliente: Varela Law
fecha: 2026-08-28
---

# 2026-08-28 — Brainstorm de nuevas ideas para Varela Law (investigación externa)

**Contexto:** Jorge pidió buscar en internet ideas nuevas a desarrollar con lo que ya tenemos (n8n, MyCase API, MongoDB, Google Sheets). Búsqueda hecha vía WebSearch (automatización legal 2026, integraciones de la API pública de MyCase, patrones de n8n para despachos chicos). Nada de esto está construido ni acordado con Mario — es un backlog de propuestas para llevarle, priorizado por esfuerzo/impacto.

## Aprovechando scopes de MyCase que tenemos pero no usamos

1. **Webhooks de MyCase (scope `webhooks`, nunca usado)** — hoy todo corre por polling (Token Manager cada 23h, Radar Billing cada 5am). Con webhooks, un caso nuevo/factura pagada/documento subido dispararía la actualización al instante. Pendiente de investigar si el endpoint de webhooks de MyCase realmente empuja eventos en vivo antes de prometer nada — no confirmado aún, es solo una hipótesis a validar.
2. **Checklist automático de tareas al abrir un caso nuevo (scope `tasks`)** — ya identificada en el análisis del 2026-07-28, bloqueada porque Mario no ha definido su checklist real. La de mayor impacto/menor esfuerzo si responde.
3. **Chequeo de conflicto de interés al crear un lead/contacto nuevo (scopes `leads`, `contacts`)** — cruzar automáticamente contra la parte opuesta de casos existentes antes de aceptar un caso nuevo. Bloqueado por lo mismo de siempre: `/leads` sigue devolviendo 0, no hay datos reales para diseñar el shape con seguridad.
4. **Seguimiento de "cliente sin contacto reciente" (scopes `notes`, `messages`, `call_log`)** — flag automático de casos sin actividad de comunicación en X días. Patrón común en despachos chicos para evitar quejas por falta de comunicación.

## Evoluciones de lo que ya está en producción/construido

5. **Activar `Radar Billing - Agenda Deadlines y Audiencias (Diario)` (`4QsJaKlmHDhkVtBV`)** — ya construida, inactiva, solo esperando que Mario confirme si la quiere. Sin trabajo nuevo, solo activarla.
6. **Ampliar `Borrador Avisos de Facturas Nuevas (Diario)` (`lTVFM7I3wJBpW7we`) de "solo redacta para revisión de Mario" a "envía directo al cliente"** — mismo workflow ya construido, solo cambiar el destino del mensaje una vez que Mario confíe en la redacción tras ver varios borradores reales.
7. **Recordatorios de cobro directos al cliente con factura vencida** (no solo el reporte interno semanal ya en producción desde el 2026-08-27) — mismo dato (`/invoices status=overdue`), pero generando el mensaje de cobro al cliente en vez de solo reportarlo a Mario/Rosa internamente.

## Fuera de alcance por ahora
Resumen/análisis de documentos con IA o generación de contratos (patrón Spellbook/Clearbrief.ai) — requiere tocar `documents`, sigue bloqueado esperando la conversación con Adalberto. No vale la pena diseñarlo en detalle todavía.

**Recomendación dada a Jorge:** empujar primero #5 y #6 en el próximo mensaje a Mario — ya están construidas, es solo activarlas/ampliarlas, y son las de mayor valor inmediato. El resto queda como backlog, no urgente.

**Estado:** propuesta sin enviar a Mario todavía. Pendiente decidir si se incluye en el próximo mensaje o se espera a que él responda el análisis de las 5 oportunidades del 2026-07-28 primero.
