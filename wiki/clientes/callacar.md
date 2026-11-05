---
tags: [forjado, cliente, callacar, desarrollo-web, transporte, astro]
tipo: cliente
estado: activo
servicio: desarrollo-de-software
estado_comercial: desarrollo-web-completado
contacto: CallaCar Team
creado: 2026-09-15
actualizado: 2026-11-05
fuente_raw: raw/clientes/callacar/
---

# Cliente — CALLACAR

> [!info] Cómo leer esta página
> Página **compilada**: solo el estado actual. El historial completo día a día vive en [[../../raw/clientes/callacar/2026-09-15-analisis-inicial-insumos-y-arquitectura-web|raw/clientes/callacar/]] (ver [[../../README|arquitectura de la bóveda]]).

## Datos

| Campo | Valor |
|---|---|
| **Empresa** | CALLACAR TRANSPORTATION PTY LTD (ABN 45 680 814 779) |
| **Ubicación / Mercado** | Australia (Adelaide / Cobertura nacional) |
| **Sector** | Marketplace de transporte y fletes peer-to-peer (muebles, electrodomésticos, compras online) |
| **Servicio principal** | Desarrollo Web (Portal corporativo, legal y de conversión) |
| **Estado** | 🟢 Portal web completado en `aplicaciones/call-a-car-web` — Builds y tests 100% en verde, sincronizado en GitHub `main` (`d651222`) |

## Repositorios y aplicaciones

- **Web principal:** `aplicaciones/call-a-car-web` — repositorio Git independiente (`jcalderon90/call-a-car-web`).
- **Stack:** Astro 5 (SSG) + TypeScript + Vanilla CSS accesible (WCAG AA) + Sharp Assets + SEO Schema.org.

## Aplicaciones móviles y tiendas activas

- **iOS (App Store):** [CALLACAR - Anything, Anywhere](https://apps.apple.com/au/app/callacar-anything-anywhere/id6754860146)
- **Android (Google Play):** [CALLACAR App](https://play.google.com/store/apps/details?id=com.adna88.CaCapp)

## Identidad visual y activos

- **Paleta base:** Navy oscuro (`#020b1f`), Azul CALLACAR (`#0876bd`), Cyan (`#27d7eb`), Blanco (`#ffffff`).
- **Diseño UI/UX:** Inspirado en la app móvil con diseño responsivo, badges con iconos vectoriales SVG limpios, acordeones FAQ interactivos y formularios semánticos.

## Estructura del Portal Web Construido (`aplicaciones/call-a-car-web/src/pages/`)

1. **Homepage (`index.astro`):** Portada de alta conversión con enlaces directos a tiendas de apps, propuesta de 0% comisión para conductores y cálculo de fletes.
2. **Términos y Condiciones (`terms.astro`):** Integración legal completa basada en `Callacar_Terms_v5_FULLY_INTEGRATED.docx`, con TOC flotante interactivo y navegación por anclas.
3. **Política de Privacidad (`privacy.astro`):** Portal legal conforme a las *Australian Privacy Principles* (APPs / Privacy Act 1988) con TOC y cláusulas de geolocalización, Stripe y verificación de antecedentes.
4. **Contacto y Soporte (`contact.astro`):** Canales de correo segmentados (`support@`, `drivers@`, `partners@`, `privacy@`) y formulario interactivo con soporte de accesibilidad.
5. **Error 404 (`404.astro`):** Página de recuperación de tráfico estilizada.

## Pendientes abiertos

- [x] **🟢 Auditoría de diseño Impeccable y eliminación de anti-patrones de IA (2026-11-05):** Resuelto contraste WCAG AA en CTAs y avatares, textos de lectura elevados a 12px, pestañas laterales gruesas sustituidas por elevaciones limpias y fuente Inter preservada como marca en configuración de detector.
- [x] **🟢 Reemplazo de HUD futurista por Cotizador Realista de Tarifas en Adelaide (2026-11-05):** Eliminado el falso mapa ciberpunk y reemplazado por un cotizador interactivo de alta conversión con 4 cargas, 4 rutas locales de Adelaide, recomendación de vehículos y animación fluida con Number Ticker (commits `8016632` y `d651222`, subido a `origin/main`).
- [x] **🟢 Backend del formulario de contacto completado (2026-09-18):** Creada Cloudflare Pages Function `/functions/api/contact.ts` con validación de campos, reenvío a webhook de alertas y soporte CORS. Conectado `contact.astro` con `fetch('/api/contact')`, estados de carga, alertas accesibles y fallback directo a `support@callacar.au`.
- [x] **🟢 Despliegue en Vercel con CI/CD automatizado (2026-09-19):** Proyecto conectado al repositorio `jcalderon90/call-a-car-web` en Vercel. Desbloqueo de autoría de commit mediante unificación de correo `jcalderon900610@gmail.com`.
- [x] **🟢 Normalización de marca y mayúsculas completas (2026-09-19):** Estandarización de `CALLACAR` en todos los textos, footers, avisos legales, Schema.org y metadatos del portal.
- [x] **🟢 White-labeling oficial de Chatwoot a Forjado (2026-09-25):** Configurado e inyectado en Dokploy (Docker Compose + PostgreSQL `installation_configs` + Redis cache) las variables de marca `BRAND_NAME="Forjado"`, `INSTALLATION_NAME="Forjado"` y `WIDGET_BRAND_URL="https://forjado.agency"`. El widget web y las respuestas de soporte ahora reflejan oficialmente "Desarrollado por Forjado".
- [x] **🟢 Sustitución de identidad visual y branding en widget Chatwoot (2026-09-25):** Reemplazado el icono genérico de Chatwoot por un icono profesional de Soporte (`Headset`) en el botón flotante y colocado el emblema circular oficial de **Forjado** en el pie del widget (`forjado_logo.png` y `logo_thumbnail.svg`).
- [ ] **Asignación del dominio personalizado oficial:** Apuntar `callacar.au` / `www.callacar.au` en la configuración de dominios de Vercel con SSL automático.
- [ ] **Deep Links definitivos:** Reemplazar enlaces provisionales por esquemas de deep linking a los flujos de la app nativa cuando estén habilitados.

## Resueltos recientes

- **2026-11-05:** Sustitución total del antiguo HUD ciberpunk por el nuevo **Adelaide Fare & Route Estimator** con selector de carga, 4 rutas locales de Adelaide y Number Ticker nativo en tiempo real (commits `8016632` y `d651222`, subido a `origin/main`).
- **2026-11-05:** Auditoría completa de diseño y accesibilidad con **Impeccable**; corrección de contrastes WCAG AA en botones, avatares, tamaño de tipografía (>= 12px) y eliminación de anti-patrones visuales.
- **2026-09-25:** Identidad visual completada en Chatwoot y Astro: Botón flotante con icono de soporte al cliente e icono oficial de Forjado en el pie del widget.
- **2026-09-25:** White-labeling de Chatwoot en VPS completado (`BRAND_NAME` e `INSTALLATION_NAME` cambiados a **Forjado** con enlace a `forjado.agency`).
- **2026-09-25:** Construcción, corrección de payload de Chatwoot y despliegue exitoso del Agente de IA **Cally** en `n8n-forjado` (workflow `Bpiy2rUJ2Z8aitOy`) con memoria por sesión y respuestas multilingües validadas.
- **2026-09-19:** Despliegue exitoso en Vercel, corrección de autoría en Git, saneamiento de copy legal a `CALLACAR` mayúsculas e implementación de animaciones con Lenis, Motion, Spotlight Glow y Magnetic Buttons ([[../../raw/clientes/callacar/2026-09-19-despliegue-vercel-animaciones-y-branding|detalles en raw]]).
- **2026-09-18:** Implementación completa del sitio web y portal legal en Astro 5 en `aplicaciones/call-a-car-web`. Build estático de producción exitoso (5 rutas compiladas en ~1.8s) ([[../../raw/clientes/callacar/2026-09-18-implementacion-portal-web-callacar-astro|detalles en raw]]).
- **2026-09-15:** Análisis de entregables del diseñador y términos legales completado ([[../../raw/clientes/callacar/2026-09-15-analisis-inicial-insumos-y-arquitectura-web|detalles en raw]]).
