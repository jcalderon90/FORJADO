---
tags: [forjado, cliente, rogers-mexico, requerimientos, audios, prospeccion, arquitectura]
tipo: raw
cliente: Rogers México
contacto: Rogers
fecha: 2026-09-21
---

# 2026-09-21 — Requerimientos de audios de Rogers y estructuración de propuesta

## Contexto de la sesión
Se recibieron 5 notas de voz donde el cliente (Rogers) describe su visión de sistematización para su negocio de instalaciones a domicilio (WiFi, cámaras CCTV, TV abierta y redes) y su proyección para comercializar la herramienta a una red de colegas instaladores.

## Levantamiento de lo planteado por Rogers en los audios

1. **Atención y procesador de ventas:**
   - Requiere un sistema que atienda clientes automáticamente en WhatsApp, Instagram, Facebook y TikTok.
   - Debe permitir ver y gestionar las conversaciones de clientes.
2. **Generación de contenido y marketing con IA:**
   - Generación de imágenes, textos y videos/Reels sobre su trabajo específico (cámaras, WiFi, antenas TV).
   - Publicación automática o semi-asistida en redes.
3. **Plataforma y arquitectura técnica deseada:**
   - Plantea un dashboard centralizado conectado directo a modelos de IA (OpenAI) para evitar intermediarios.
   - Consulta sobre sustituir herramientas como n8n para reducir costos de licencia.
4. **Modelo comercial y proyección de crecimiento:**
   - Rogers plantea una tarifa mensual baja (ej. $50–$60 USD/mes) orientada a generación directa de ventas.
   - Cuenta con una red de contactos y colegas del rubro tanto en México como en otros países interesados en un sistema idéntico si demuestra resultados en su negocio.

## Análisis de viabilidad y contrarrestando riesgos

- **Riesgo detectado:** Querer construir un SaaS multi-tenant completo con motor de render de video IA por una tarifa de $50–$60/mes resulta económicamente inviable (los consumos de APIs de video, TTS y LLMs superan ese monto rápidamente).
- **Aclaración sobre n8n:** n8n self-hosted en infraestructura propia (Docker/VPS) no cobra por ejecuciones en uso operativo de agencia, mientras que programar un dashboard/CRM desde cero requiere semanas de ingeniería innecesarias.
- **Estrategia acordada:** Dividir la solución en 3 fases secuenciales para asegurar retorno de inversión inmediato a Rogers antes de escalar.

## Estructura de fases acordada

- **Fase 1 — Embudo de ventas y agenda en WhatsApp (Prioridad inmediata):**
  - Bot IA de WhatsApp conectado a la web de Rogers.
  - Validación automática de cobertura por Código Postal y Alcaldía (CDMX / Edomex).
  - Pre-cotización guiada de servicios (WiFi, Mesh, Cámaras, TV abierta).
  - Agendamiento de visitas técnicas y notificación directa al equipo de instaladores.
- **Fase 2 — Motor de contenido y Reels con IA:**
  - Automatización de guiones y clips basados en casos reales de instalación.
- **Fase 3 — Estandarización y plataforma para red de colegas:**
  - Empaquetado como producto para comercializar a su red de contactos en otros estados o países.
