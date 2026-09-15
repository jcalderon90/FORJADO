---
tags: [forjado, cliente, carwarriors, manychat, instagram, seguimiento]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-15
---

# 2026-09-15 — Automatización de Nuevos Seguidores en ManyChat: Análisis de audios de Bianca y actualización en vivo del flujo con Smart Delay de 2h

A pedido de Jorge ("ahora veamos algo que Bianca me está hablando"), se procesaron dos audios de WhatsApp recibidos de Bianca (`WhatsApp Ptt 2026-09-15 at 10.34.28 AM.ogg` y `10.34.51 AM.ogg`).

## 1. Audios de Bianca — Requerimiento
Bianca solicitó:
- Verificar si la automatización de bienvenida a **nuevos seguidores de Instagram** en ManyChat seguía activa.
- Añadir un **seguimiento condicional inteligente** según la interacción del usuario con el enlace del inventario:
  - **Si no hacen clic / no abren el inventario:** Enviar un DM de re-engagement recordando promociones (ej. opciones de $0 Down, Teslas, financiamiento).
  - **Si sí hacen clic:** Preguntarles qué auto les llamó la atención o les gustó, dejando el canal abierto para que el bot de IA de n8n tome la conversación y agende la cita.

## 2. Auditoría en vivo en ManyChat (vía CDP a Chrome)
Se conectó vía CDP al Chrome real de Jorge (`http://127.0.0.1:9222`) en la cuenta de ManyChat de **Carwarriors LLC | Car Dealer**:
- **Flujo identificado:** `Saludá a tus nuevos seguidores` (`https://app.manychat.com/fb4391897/cms/easy-builder/content20251013163007_213765`).
- **Estado previo:** 🟢 **LIVE** (380 ejecuciones, 96 envíos de inventario, 80 clics / 83% CTR).
- **Trigger:** Cuando alguien nuevo sigue la cuenta + delay inicial de 5 minutos.
- **Deficiencia encontrada:** El flujo finalizaba inmediatamente tras entregar el botón `INVENTARY`, sin ningún seguimiento si el usuario ignoraba el enlace.

## 3. Actualización y Publicación en Vivo
Se activó la funcionalidad nativa de **DM de seguimiento condicional si no hacen clic en el enlace** con los siguientes parámetros aprobados por Jorge:
- **Smart Delay de seguimiento:** **2 horas** (`Después de 2 horas`).
- **Mensaje de seguimiento (si NO hicieron clic en 2h):**
  > *"¡Hola! ⚡ Noté que no pudiste revisar el inventario. Solo por ser nuevo seguidor de Carwarriors esta semana, tenemos opciones con $0 de inicial / 0 Down en modelos seleccionados (incluyendo nuestros Teslas) y pre-aprobación de crédito rápida.*
  > 
  > *¿Te envío la lista de los carros en oferta antes de que los reserven?"*

- **Publicación:** Se ejecutó click en `Actualizar`, guardando y publicando los cambios atómicamente.
- **Estado final:** 🟢 **LIVE** con el condicional de 2 horas activo.

## 4. Integración con n8n
Cualquier respuesta del usuario al mensaje de seguimiento o al mensaje de apertura (ej. indicando qué auto le gustó o solicitando financiamiento) ingresa automáticamente al pipeline de IA en n8n (`LEAD - COLLECTOR` + `PRINCIPAL`), que realiza la atención conversacional 24/7 y la propuesta de cita/test drive.

## Relacionado
- [[wiki/clientes/carwarriors-llc|Carwarriors LLC]]
- [[wiki/clientes/carwarriors-llc-manychat-configuracion|ManyChat Configuración]]
