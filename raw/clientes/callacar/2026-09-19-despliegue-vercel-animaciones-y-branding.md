---
tags: [forjado, cliente, callacar, desarrollo-web, vercel, animaciones, branding, lenis, motion]
tipo: raw
cliente: CallaCar Transportation Pty Ltd
fecha: 2026-09-19
---

# 2026-09-19 — Despliegue en Vercel, normalización de branding a CALLACAR e integración de suite de animaciones (Lenis + Motion)

## Contexto de la sesión
Consolidación del despliegue en producción para el portal web de **CALLACAR Transportation Pty Ltd** (`aplicaciones/call-a-car-web`). Se evaluó la infraestructura previa en Dokploy (VPS Oracle), se migró el hosting a Vercel para garantizar entrega global con SSL/HTTPS automático sin sobrecarga de servidor, se estandarizó la marca en mayúsculas en todas las páginas y se elevó el diseño a nivel premium mediante interacciones fluidas aceleradas por hardware.

## Hitos Técnicos Implementados

### 1. Auditoría de Infraestructura y Migración a Vercel
- **Diagnóstico en Dokploy (VPS):** Se inspeccionó el despliegue del contenedor Docker (`australia-callacar-w8kpy8`) corriendo Nginx en puerto 3000. Aunque servía HTTP 200 OK, los navegadores modernos forzaban HTTPS en el dominio provisional `sslip.io`, generando 404 en Traefik por falta de entrypoint `websecure`.
- **Despliegue en Vercel:** Se conectó el repositorio `jcalderon90/call-a-car-web` a Vercel.
- **Resolución de Bloqueo de Git Author:** Vercel bloqueó inicialmente el build debido a discordancia entre el correo del commit (`jorge.calderon@garooinc.com`) y la cuenta de GitHub vinculada. Se reconfiguró la autoría local con `Jorge Calderón <jcalderon900610@gmail.com>`, se reescribió el commit y se sincronizó forzadamente con `origin/main` (commit `b4943bc`), habilitando el pipeline de CI/CD continuo.

### 2. Normalización de Nombres de Marca (100% CALLACAR)
- Se auditó todo el código fuente para eliminar variantes en CamelCase o minúsculas residuales:
  - `src/components/Footer.astro`: Actualizados bloque de entidad y aviso de copyright a `CALLACAR Transportation Pty Ltd`.
  - `src/pages/contact.astro`: Actualizada ficha de información de la compañía a `CALLACAR Transportation Pty Ltd`.
  - `src/pages/privacy.astro`: Actualizada cláusula legal introductoria a `CALLACAR Transportation Pty Ltd`.
  - `src/layouts/Layout.astro`: Saneados metadatos estructurados Schema.org (`Organization`).

### 3. Suite de Animaciones e Interacciones Modernas
- **Scroll Suave Inercial (Lenis):** Integración de `lenis` para scroll fluido inercial en desktop, respetando el desplazamiento táctil nativo en móviles y la directiva de accesibilidad `prefers-reduced-motion`. Intercepción suave de enlaces de ancla internos (`#how`, `#drivers`, `#faq`).
- **Scroll Reveals por GPU (Motion / Web Animations API):** Entradas escalonadas (*stagger*) para titulares y CTAs del Hero, tarjetas de pasos de *How it works* y cuadrícula de casos de uso de fletes.
- **Efecto Spotlight Glow (Estilo Linear/Stripe):** Resplandor dinámico en gradiente radial Cyan (`#27d7eb`) reactivo a las coordenadas del ratón en tarjetas oscuras y claras (`.spotlight-card`), implementado con variables CSS y `requestAnimationFrame` sin penalizar el hilo principal.
- **Botones Magnéticos:** Atracción física sutil hacia el cursor en los CTAs primarios (`.magnetic-btn`).
- **Pulso de Comisión en Choferes:** Efecto de neón eléctrico en el `0%` de comisión para captación de conductores.

## Auditoría de Compilación y Estado de Git
- **Build Astro:** 5 de 5 páginas compiladas limpiamente en `dist/` en 3.81s sin errores de TypeScript ni linter.
- **Commit en `call-a-car-web`:** `5f0cb2d` (*feat(ui): add Lenis smooth scroll, Motion scroll reveals, spotlight glow and magnetic buttons*) sincronizado con GitHub `origin/main`.

## Próximos Pasos Prioritarios
1. **Asignación de Dominio Oficial en Vercel:** Apuntar los registros DNS de `callacar.au` / `www.callacar.au` a la red de Vercel.
2. **Validación de Leads:** Probar el formulario de contacto en la URL de producción.
3. **Deep Links Nativos:** Enlazar botones con esquemas `callacar://` cuando la app móvil esté disponible en tiendas.
