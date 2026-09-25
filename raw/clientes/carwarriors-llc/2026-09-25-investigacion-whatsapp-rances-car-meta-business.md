---
tags: [forjado, cliente, carwarriors, rancescar, whatsapp, ghl, meta, investigacion, pendiente]
tipo: raw
cliente: Carwarriors LLC (subcuenta Rances Car)
fecha: 2026-09-25
---

# 2026-09-25 — Investigación y Estrategia: Conexión de WhatsApp para Rances Car en GHL vs Meta Business

## Contexto y Solicitud del Cliente
Jorge González / Jorge señalaron que no es viable conectar el WhatsApp de Rances Car en GoHighLevel (GHL) utilizando el Meta Business Portfolio de Carwarriors LLC, dado que el WhatsApp de Carwarriors ya se encuentra enlazado a dicho portfolio. Se solicitó investigar alternativas técnicas para permitir que el agente de IA de Rances Car atienda a los leads de WhatsApp de Rances Car. El usuario solicitó dejar este ítem como **pendiente a decidir**.

## Diagnóstico Técnico
1. **Limitación de Meta Embedded Signup / LeadConnector:**
   - GoHighLevel utiliza el flujo de Embedded Signup de Meta a través del proveedor LeadConnector.
   - LeadConnector vincula una cuenta de WhatsApp Business (WABA) y su perfil de facturación directamente a un único Location ID de GHL.
   - Al intentar vincular una segunda subcuenta (Rances Car `1j1dHo8HEbZdElQUGFoC`) al mismo portfolio/WABA de Carwarriors, el flujo bloquea por conflicto de activos (*"WABA already connected to another location"* o conflicto de métodos de pago).
   - Mezclar entidades bajo el mismo portfolio comercial acarrea rechazos de Display Name por parte de Meta, arriesgando bloqueos en la línea principal de Carwarriors.
2. **Estado Actual de la Infraestructura (100% Preparada):**
   - **GHL Rances Car:** Suscripción de WhatsApp Messaging ($10/mes) ya activa desde el 2026-09-02.
   - **Automatización GHL:** Workflow `Lead Agent - n8n` en Rances Car ya tiene activo el trigger `Customer replied → Reply channel is WhatsApp`.
   - **Agente IA en n8n:** `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`) ya soporta el canal `WhatsApp` en `Parameter Type` y `SEND GHL MESSAGE`, además de estar integrado con MongoDB, `kb_search`, `rsvp` y sync a DealerCenter.

## Opciones Planteadas para Decisión
- **Opción 1 (Recomendada / Estándar): Meta Business Portfolio Dedicado para Rances Car:**
  - Crear un portfolio comercial exclusivo para Rances Car en `business.facebook.com`.
  - Asociar su página de Facebook y número de teléfono.
  - Ejecutar el wizard de GHL Settings → WhatsApp en Rances Car seleccionando su portfolio propio.
  - *Ventaja:* 100% nativo, soporte de bandeja de entrada para Scarleth/Samuel en GHL, 0 cambios de código.
- **Opción 2: WhatsApp Cloud API Directa a n8n:**
  - Configurar Meta Cloud API en una Meta App y apuntar el webhook directo a n8n.
  - El agente responde vía Graph API y sincroniza los datos a GHL vía REST API.
  - *Ventaja:* Ahorro de los $10/mes de GHL.
  - *Desventaja:* No permite chat manual nativo en la pestaña Conversations de GHL sin adaptadores adicionales.
- **Opción 3: Gateway QR / Evolution API:**
  - Conectar mediante escaneo QR si Rances Car utiliza un teléfono físico con WhatsApp Business instalado y no desean migrarlo a la API en la nube.

## Estado
- **Pendiente a decidir:** Esperando que Jorge González / equipo definan la vía a seguir (Opción 1 vs Opción 2 vs Opción 3).
