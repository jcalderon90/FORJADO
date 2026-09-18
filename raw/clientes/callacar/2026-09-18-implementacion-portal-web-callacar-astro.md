---
tags: [forjado, cliente, callacar, desarrollo-web, frontend, astro, legal]
tipo: raw
cliente: CallaCar Transportation Pty Ltd
fecha: 2026-09-18
---

# 2026-09-18 — Implementación completa del portal web corporativo y legal de CALLACAR en Astro 5

## Contexto de la sesión
Concreción de la presencia web oficial para **CallaCar Transportation Pty Ltd** (ABN 45 680 814 779) en el repositorio local e independiente `aplicaciones/call-a-car-web`. Se transformó el paquete conceptual del diseñador y los documentos legales contractuales en una plataforma estática de alto rendimiento, accesible y optimizada para conversión en el mercado australiano.

## Arquitectura y Stack Tecnológico Implementado
- **Framework base:** Astro 5 (Static Site Generation - SSG).
- **Lenguaje & Tipado:** TypeScript + Vanilla CSS moderno modular.
- **Tokens de Diseño:** Variables CSS nativas con paleta institucional Navy (`#020b1f`), Azul CALLACAR (`#0876bd`), Cyan (`#27d7eb`) y neutros accesibles.
- **Optimización de Assets:** Motor Sharp integrado en Astro Assets para compresión automática y generación responsiva en formato WebP.
- **SEO & Datos Estructurados:** Schema.org (`Organization`, `WebSite`), meta tags OpenGraph, Twitter Cards, `@astrojs/sitemap` y `robots.txt`.
- **Accesibilidad:** Estándar WCAG AA aplicado a contrastes tipográficos, navegación por teclado y formularios con ARIA semántico.

## Páginas y Componentes Construidos (`src/pages/`)
1. **Página Principal (`index.astro`):**
   - Hero con propuesta de valor clara de transporte bajo demanda en Adelaide y Australia.
   - Enlaces directos a las aplicaciones móviles en App Store y Google Play.
   - Dos flujos de conversión visual: solicitud de flete para clientes y captación de choferes bajo la premisa de 0% de comisión.
   - Bloques modulares de servicios, tipos de carga, testimonios y acordeón interactivo de preguntas frecuentes (FAQ) con animación SVG accesible.
2. **Términos y Condiciones (`terms.astro`):**
   - Transcripción y estructuración exhaustiva del documento contractual `Callacar_Terms_v5_FULLY_INTEGRATED.docx`.
   - Tabla de contenidos (TOC) interactiva con navegación lateral flotante en desktop y anclas fluidas.
   - Saneamiento de marcadores de Word y formato legal riguroso.
3. **Política de Privacidad Oficial (`privacy.astro`):**
   - Redacción legal completa acorde a los *Australian Privacy Principles* (APPs / Privacy Act 1988).
   - Cláusulas detalladas sobre geolocalización en tiempo real, validación de antecedentes de conductores y procesamiento de pagos seguros mediante Stripe.
   - Tabla de contenidos interactiva responsive.
4. **Portal de Contacto y Soporte (`contact.astro`):**
   - Canales corporativos segmentados: `support@callacar.au`, `drivers@callacar.au`, `partners@callacar.au` y `privacy@callacar.au`.
   - Formulario de contacto accesible con validación frontend y atributos `aria-describedby` / `aria-required`.
   - Datos oficiales de la entidad legal australiana.
5. **Página de Error 404 (`404.astro`):**
   - Interfaz personalizada orientada a recuperación rápida de navegación.

## Auditoría de Compilación
- Compilación estática ejecutada con éxito: 5 páginas generadas limpiamente en `dist/` en ~1.8s sin advertencias de linter ni TypeScript.

## Pendientes Operativos para Lanzamiento
1. **Backend del Formulario de Contacto:** Conectar el submit de `contact.astro` a un endpoint serverless (webhook de n8n, Cloudflare Worker o Resend).
2. **Configuración de CI/CD y Despliegue:** Configurar pipeline en Cloudflare Pages / Vercel para el dominio oficial `callacar.au`.
3. **Deep Links Finales:** Conectar los botones de acción principales a los deep links de registro de la app cuando la infraestructura móvil esté habilitada.
