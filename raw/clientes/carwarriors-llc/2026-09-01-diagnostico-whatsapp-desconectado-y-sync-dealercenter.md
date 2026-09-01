---
tags: [forjado, cliente, carwarriors, whatsapp, dealercenter, ghl, bug, fix]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-01
---

# 2026-09-01 — Diagnóstico: "WhatsApp no conectado" + "números no cargan a DealerCenter" son el mismo problema

**Contexto:** Bianca reportó dos problemas urgentes de parte de Jorge (cliente): (1) WhatsApp no está conectado a GHL y no entran mensajes, (2) los números que entran a GHL no se cargan a DealerCenter.

## Investigación

**Problema 1 — confirmado con screenshot del cliente:** en Settings → WhatsApp de la subcuenta Carwarriors LLC aparece la pantalla "Subscribe to WhatsApp Messaging" ($10/mes), nunca contratada. No es una desconexión — nunca estuvo conectado. Coincide con el pendiente ya registrado en la wiki desde antes ("Jorge dijo explícitamente que no es prioridad") — ahora cambió de prioridad para el cliente. Jorge (consultor) ya les informó del costo/decisión, pendiente de que Carwarriors decida activarlo.

**Problema 2 — investigado con datos de n8n, más específico de lo reportado:**

- El workflow `Subir a DealerCenter` (`ZxcF7cmf3V8FZabx`) funciona técnicamente bien — confirmado con un caso real del 08-31 (lead "Jab Yank") que subió sin error por SFTP.
- Las ejecuciones de hoy (09-01) de ese workflow eran 100% eco del sync diario `DealerCenter -> Mongo -> GHL` (burst de ~20 ejecuciones a las 12:30-12:31, todas correctamente descartadas como duplicado vía Mongo) — cero ejecuciones orgánicas de leads nuevos en todo el día.
- Pero el bot (`PRINCIPAL`) sí tuvo 24 conversaciones activas hoy, incluyendo un contacto nuevo creado a las 11:56am vía Instagram (Carlos Méndez) — sin campo `phone` en su contacto de GHL.
- Se revisó en vivo (screenshot del cliente) la automatización de GHL que dispara el push a DealerCenter: triggers `Contact Changed: Phone has changed`, `Contact Changed: Email has changed`, `Opportunity Created` → condición (excluye tag ZONITEL) → webhook `#1 N8N Webhook - DealerCenter` → tag `DealerCenter Synced`.
- **Causa raíz encontrada:** el trigger depende de que el teléfono (o email) del contacto cambie. Se auditó `LEAD - COLLECTOR` (el sub-workflow que extrae datos del lead durante la conversación) y **nunca captura ni guarda el teléfono** — solo ciudad, vehículo, método de pago, timing e idioma. Sin WhatsApp real conectado, los leads llegan por Instagram DM puro (sin teléfono adjunto, a diferencia de un lead por "Click-to-WhatsApp" que sí trae número desde el inicio, como el caso Jab Yank). Sin teléfono, el trigger de GHL nunca se dispara → nunca llega al webhook → nunca se sube a DealerCenter.

**Conclusión:** el problema 2 es consecuencia directa del problema 1, no un bug independiente. Sin WhatsApp conectado, los leads no traen teléfono, y sin teléfono la automatización de sync a DealerCenter no se activa.

## Fix aplicado (independiente de si activan WhatsApp o no)

Se modificó el bot para que pida y guarde el teléfono explícitamente, publicado en ambos dealers:

- **`LEAD - COLLECTOR`** (`4r00JFnCyoUpZgXU`): nuevo input `telefono_actual`, el extractor LLM ahora captura `telefono` cuando el usuario lo comparte (nunca lo inventa, nunca lo pide él mismo — eso lo hace el agente principal), se guarda en Mongo (colección `leads`), y se envía a GHL vía `PUT /contacts/{id}` con `phone` (normalizado a E.164: 10 dígitos → `+1XXXXXXXXXX`, 11 dígitos con `1` inicial → `+1...`, ya con `+` se respeta, cualquier otro formato se descarta para no mandar basura a GHL).
- **`PRINCIPAL`** (`Kif9lWwDHvR7TT39`) y **`PRINCIPAL - Rances Car`** (`N68IYzm4Bf6AVTXP`): nuevo paso 6 en el FLUJO DE CALIFICACION — pedir el teléfono apenas el lead muestre intención real (vehículo + un eje más confirmado), nunca en el primer mensaje. Campo `telefono` agregado a `estado_lead`, al bloque CONTEXTO DEL LEAD y al JSON de salida obligatorio. El tool `lead_collector` ahora pasa `telefono_actual` (leído de `User Data`) al sub-workflow.
- Los 3 workflows fueron publicados explícitamente (`publish_workflow`) y se verificó que `activeVersionId` coincide con la versión corregida antes de dar por cerrado — lección aprendida de la recurrencia del 08-31 ([[2026-08-31-fix-gratis-whatsapp-y-kb-search-parsing-recurrencia]]).

## Pendiente

- **Confirmar con tráfico real:** que el bot efectivamente pida el teléfono en una conversación real, lo guarde en GHL, y que eso dispare la automatización de sync a DealerCenter de punta a punta. No se forzó una ejecución de prueba en esta sesión.
- **Decisión de Carwarriors:** si activan WhatsApp Messaging ($10/mes) — resolvería el problema de raíz para los leads que entren por ese canal (traen teléfono desde el inicio), pero el fix de hoy cubre igual a los que sigan entrando por Instagram/Messenger puro.
- No se tocó el `Update GHL Contact` original en cuanto a `city` — se mantiene el mismo patrón, solo se le agregó `phone` de forma condicional (solo si `telefono` no está vacío, para no pisar con `''` un teléfono ya bueno).
