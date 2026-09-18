---
tags: [forjado, cliente, carwarriors, rances-car, bdc, chatbot, n8n, prompt, appointments]
tipo: raw
cliente: Carwarriors LLC & Rances Car
fecha: 2026-09-18
---

# 2026-09-18 — Implementación del Playbook BDC: Captura de Teléfono por Intercambio de Valor (Value Exchange), Cierre de Citas Presenciales y Respuestas Coherentes

**Contexto:** Jorge Calderón solicitó optimizar integralmente el comportamiento de los chatbots de Carwarriors LLC (`PRINCIPAL` - `Kif9lWwDHvR7TT39`) y Rances Car (`PRINCIPAL - Rances Car` - `N68IYzm4Bf6AVTXP`), orientándolos a:
1. Intentar capturar el teléfono del lead para enviarle información o llamarlo por WhatsApp/teléfono.
2. Hacer lo posible para cerrar un appointment presencial en el dealership.
3. Responder correctamente y de forma coherente a las preguntas de los leads, eliminando respuestas inconexas o evasivas.

## 1. Causa Raíz Diagnosticada de Incoherencias Previas
- **Stonewalling por regla de teléfono:** El prompt anterior forzaba a que, si faltaba el teléfono, el bot llamara a `lead_collector` y respondiera *únicamente* con su texto sin responder a la pregunta original del usuario.
- **Límite artificial de 22 palabras:** Mutilaba las explicaciones de financiamiento, enganche o inventario. Se amplió a 30-45 palabras (2 a 3 oraciones cortas).
- **Tool description engañosa en `lead_collector`:** Indicaba que devolvía la respuesta a enviar al usuario, causando que el agente principal delegara ciegamente su voz a la sub-herramienta.
- **Manejo tosco de negativas:** Si el usuario no quería dar el número, caía en el fallback *"Sin problema, seguimos igual 😊 ¿en qué te ayudo?"*.

## 2. Nuevo Comportamiento BDC Implementado
- **Marco "Acknowledge, Answer, Advance" (AAA):** Valida la consulta del cliente y responde primero con datos verídicos y claros (dirección física oficial en 3620 NW 27th Ave, opciones desde $0 down, financiamiento garantizado con pasaporte/ITIN/mal crédito, recepción de trade-ins).
- **Intercambio de Valor (Value Exchange):** Ofrece fotos, video walkaround, corrida de pagos mensuales o apartado de la unidad a cambio del número de WhatsApp.
- **Cierre de Dos Opciones (Two-Option Close):** Propone siempre dos horarios concretos para la visita al lote (*"¿Te queda mejor pasar hoy a las 4:00 PM o a las 6:30 PM?"*).
- **Empatía ante negativas:** Si el lead se niega a dar el teléfono, se valida sin confrontar, se contesta la duda al 100% por chat y se le invita directamente al lote.

## 3. Estado de Despliegue en n8n
- **Carwarriors LLC (`Kif9lWwDHvR7TT39`):** Versión activa `448c5eeb-581d-48e2-bc19-5c8c34d58f6b`.
- **Rances Car (`N68IYzm4Bf6AVTXP`):** Versión activa `0acacdd3-ef33-4df3-8c71-f55eef494632`.
- **Repositorio local:** `raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL.json` actualizado y sincronizado con producción.
