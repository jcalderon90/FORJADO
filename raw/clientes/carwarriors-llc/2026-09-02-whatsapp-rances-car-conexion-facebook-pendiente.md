---
tags: [forjado, cliente, carwarriors, whatsapp, ghl, facebook, meta, pendiente]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — WhatsApp Messaging para Rances Car: suscripción activada, conexión de Facebook/Meta bloqueada

**Contexto:** Jorge (el consultor) reportó que Jorge González (dueño) le pidió conectar WhatsApp para Rances Car — mismo servicio que ya tiene Carwarriors LLC desde el 09-01 (ver [[2026-09-01-whatsapp-activado-fix-trigger-lead-agent]]). El automation `Lead Agent - n8n` de Rances Car ya tenía el trigger de WhatsApp agregado preventivamente el 09-02 (ver [[2026-09-02-whatsapp-trigger-preventivo-rances-car]]), así que del lado de n8n/GHL automations no falta nada.

## Lo que sí se completó

Navegado a **Settings → WhatsApp** en la subcuenta Rances Car (`1j1dHo8HEbZdElQUGFoC`) — a diferencia de la tarjeta "Integrate WhatsApp" del Launchpad (donde solo se había visto el estado "Connect" el día anterior), esta ruta directa de Settings muestra la pantalla real de suscripción: **"Subscribe to WhatsApp Messaging", $10/mes, 1 mes de compromiso, cargado a la wallet de la agencia** (mismo modelo que Carwarriors LLC — "Additional WhatsApp Messages will not be charged to the client's Sub Account... billed to the agency wallet"). Se confirmó el modal "Enable WhatsApp for Rances Car without any extra charge?" y se aceptó ("Enable Now") — **la suscripción de $10/mes quedó activada.**

## Dónde se frenó

El siguiente paso ("Step 2 of 8") de GHL pide elegir cómo conectar el número: **Connect your WhatsApp** (número ya usado en la app de WhatsApp de un teléfono real), **Create a new WhatsApp business account** (número nuevo dedicado solo a la API — la opción elegida, mismo patrón que Carwarriors LLC), o **Migrating from an existing BSP**. Elegida la segunda opción, el flujo avanzó a un paso que **requiere click en "Connect with Facebook"** — el texto de GHL explica: *"After clicking 'Connect with Facebook', you will be redirected to Facebook to select the account you want to connect."*

**Acá Jorge (consultor) interrumpió la sesión**: no tiene claro si la cuenta de Facebook a la que tiene acceso (la de Carwarriors LLC) sirve para autorizar esto en Rances Car, dado que son marcas/entidades distintas dentro del mismo ecosistema (aunque comparten el mismo lote físico). **No se clickeó "Connect with Facebook"** — se detuvo la sesión de Playwright ahí mismo para no arriesgar conectar la cuenta de Facebook equivocada a un activo de WhatsApp Business que, una vez creado, no es trivial de deshacer/mover.

## Pendiente real

- **Confirmar con Jorge González (dueño) o Bianca**: ¿Rances Car tiene su propia página de Facebook / Meta Business Manager, o hay que usar la de Carwarriors LLC? Si es una página de Facebook distinta, se necesita el acceso (login o admin agregado) a esa cuenta antes de continuar.
- Una vez resuelto ese dato, retomar exactamente donde quedó: Settings → WhatsApp → Rances Car, ya con la suscripción de $10/mes activa, solo falta el paso de "Connect with Facebook" en adelante (quedan pasos 2 al 8 del wizard).
- No se tocó nada más de la configuración de Rances Car en GHL en esta sesión más allá de activar la suscripción.
