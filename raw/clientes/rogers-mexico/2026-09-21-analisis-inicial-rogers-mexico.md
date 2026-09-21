---
tags: [forjado, cliente, rogers-mexico, prospeccion, insumos, analisis-web]
tipo: raw
cliente: Rogers México
fecha: 2026-09-21
---

# 2026-09-21 — Análisis inicial de insumos y levantamiento de Rogers México

## Contexto de la sesión
Se recibe el enlace de staging/producción `https://rogers.mangeldev.com?v1` como único insumo inicial de un nuevo cliente prospecto que busca contratar los servicios de FORJADO. Se realizó un rastreo y análisis completo del contenido web, estructura técnica, modelo de negocio y puntos de contacto.

## Datos de la empresa identificados

- **Nombre comercial:** Rogers México
- **URL analizada:** `https://rogers.mangeldev.com?v1`
- **Ubicación operativa:** Ciudad de México (CDMX) y Zona Metropolitana (área conurbada Edomex bajo cotización de traslado). Negocio con modelo 100% servicio a domicilio (sin local físico de atención al público).
- **Canales de contacto identificados:**
  - Teléfono directo: `+52 55 8830 1030` (`55 88 30 10 30`)
  - WhatsApp de cotizaciones: `https://wa.me/5215588301030?text=Hola%2C%20quiero%20cotizar%20una%20instalaci%C3%B3n%20a%20domicilio%20en%20CDMX.`

## Servicios ofrecidos por el cliente (Catálogo)

1. **WiFi Cobertura / Repetidores residenciales:**
   - Enfoque: Resolver problemas de alcance en recámaras, patios y segundos pisos.
   - Filosofía: "Diagnóstico en sitio antes de vender".
2. **WiFi Mesh:**
   - Red única multi-nodo para casas de 2 a 3 plantas sin micro-cortes al cambiar de piso.
3. **Antenas de TV Abierta (HD):**
   - Instalación exterior en azotea, orientación a antenas transmisoras, cableado y sintonización de canales de TV abierta sin mensualidades.
   - Garantía ofrecida al usuario final: hasta 24 meses.
4. **Cámaras de Seguridad CCTV:**
   - Instalación de cámaras tipo bala/domo, cableado estructurado estético, configuración de app móvil en celular del cliente y capacitación presencial.
5. **Redes y cableado estructurado PyME:**
   - Cableado Ethernet categoría 6, switches, APs (Access Points) para locales u oficinas pequeñas.

## Propuesta de valor y garantías al consumidor
- **Cero anticipos:** "Pagas al terminar, cuando todo esté funcionando".
- **Garantía por escrito:** 12 a 24 meses según el servicio.
- **Compatibilidad con ISPs de México:** Telmex, izzi, Totalplay, Megacable.
- **Proceso de venta actual:**
  1. Contacto inicial vía WhatsApp con código postal o zona.
  2. Diagnóstico y cotización estimada.
  3. Visita técnica a domicilio para medición e instalación.
  4. Pruebas de funcionamiento, capacitación y cobro al finalizar.

## Pila técnica detectada en la web
- Generación estática / pipeline custom con referencia interna a `construir.py` y variable de entorno `SITE_DOMAIN`.
- Analítica / Telemetría: Cloudflare Web Analytics / Insights token `118bdb32516a4e21b3b1626833a033d4`.
- Alojamiento de media: Cloudinary (`https://res.cloudinary.com/doekgaljv/video/upload/...`).
- Fuentes e iconos: Google Fonts (Lato, Roboto), FontAwesome 6.5.2 vía CDN.
- SEO & Marcado: Schema.org estructurado (`HomeAndConstructionBusiness`, `WebPage`, `FAQPage`), etiquetas OpenGraph y Twitter Cards optimizadas para WhatsApp (JPEG fallback a 1200x630).

## Diagnóstico preliminar de oportunidades para FORJADO

1. **Automatización de Leads y Cotización por WhatsApp (Servicio: Automatización e IA):**
   - El 100% de los CTAs de la web dirigen a un enlace de WhatsApp con mensajes predefinidos ("Hola, quiero WiFi en toda la casa en CDMX", "Hola, ¿llegan a mi CP?").
   - Oportunidad: Implementar un agente conversacional 24/7 en WhatsApp (vía n8n + API de WhatsApp Business + LLM) que:
     * Valide cobertura automáticamente a partir del Código Postal / Alcaldía en CDMX / Edomex.
     * Califique el tipo de problema (muros gruesos, metros cuadrados, número de plantas, número de cámaras).
     * Genere pre-cotización y agende visita técnica en calendario sincronizado.
2. **CRM y Pipeline Operativo (Servicio: Automatización / Software):**
   - Centralizar las solicitudes entrantes en GoHighLevel (GHL) o Google Sheets/CRM interno, asignando técnicos según zona y estado de instalación.
3. **Consolidación Web y Dominio Oficial (Servicio: Desarrollo de Software):**
   - El sitio actual corre en un subdominio provisional (`rogers.mangeldev.com?v1`). Se requiere migración o soporte a su dominio definitivo de producción, formularios integrados o mejoras de performance.
