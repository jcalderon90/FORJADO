---
tags: [forjado, landing, copywriting, animaciones, raw]
tipo: raw
fecha: 2026-10-26
---

# 2026-10-26 — Evolución de Copy Comercial, Slogans y Animaciones Interactivas en `forjado-landing`

## Contexto y Objetivo
Jorge solicitó mejorar los slogans de la landing page oficial de FORJADO (`aplicaciones/forjado/forjado-landing`), eliminando por completo las menciones a frameworks o herramientas técnicas específicas (`Next.js`, `Astro`, `n8n`, `MVP`, `CRM`, `WhatsApp`, `APIs`, `handoff`, etc.) y adoptando un lenguaje general, cercano y orientado a resultados de negocio tras analizar referentes globales (**Work & Co, MetaLab, Thoughtbot, Morningside AI, Linear, Vercel, Raycast**).

Además, pidió destacar explícitamente que:
1. Creamos **agentes de IA, chatbots que atienden los negocios 24/7, asistentes de ventas y agentes de IA internos de empresa** que manejan procesos y documentación.
2. Son **sistemas ya probados por clientes reales y que están funcionando ahora mismo**.
3. Incorporar **efectos visuales y animaciones modernas con lógica funcional** dentro de la página.

## Cambios Implementados

### 1. Copywriting y Slogans sin Jerga Técnica (`app/page.tsx`, `lib/forjado-data.ts`, `app/layout.tsx`)
- **Nuevo Slogan Principal (Hero H1):** *«Tecnología forjada para que tu operación funcione sola.»*
- **Subtítulo del Hero:** *«Creamos chatbots y asistentes de ventas que atienden tu negocio 24/7, agentes de IA internos que organizan los procesos y la documentación de tu empresa, y aplicaciones hechas a tu medida. Sistemas ya probados por clientes reales y funcionando ahora mismo.»*
- **Reescritura a lenguaje amigable para dueños de negocio:**
  - `01 · Agentes de IA y Automatización`: Chatbots y asistentes de ventas 24/7, agentes internos de procesos y documentos, tareas repetitivas en piloto automático.
  - `02 · Aplicaciones y Plataformas a Medida`: Páginas web y aplicaciones móviles, sistemas internos para tu equipo, catálogos y portales para clientes.
  - `03 · Consultoría y Estrategia Digital`: Diagnóstico de tu operación, plan de mejora paso a paso, decisiones claras y rentables.
  - `04 · Marca y Creación de Contenido`: Identidad visual y diseño de marca, creación ágil de contenido con IA, materiales listos para atraer clientes.
- **Sección «Probado en Negocios Reales» (`#soluciones`):** Titular *«Menos trabajo manual. Más negocio en marcha.»* enfatizando que son sistemas ya probados por clientes reales y funcionando ahora mismo.
- **Pilar 02 (`PILLARS`):** Actualizado a *«Probado por clientes reales»*.
- **Sincronización en Bóveda (`desarrollo`):** Actualizado `wiki/interno/marca/posicionamiento-y-mensaje.md` con el nuevo tagline y subtítulo (`commit 10d0de4`).

### 2. Efectos Modernos y Animaciones con Lógica (`app/page.tsx`, `app/globals.css`)
1. **Simulador Interactivo de «Sistemas en Marcha Ahora Mismo» (Hero Columna Derecha):**
   - Tres pestañas interactivas con indicador elástico (`framer-motion` `layoutId="hero-scenario-tab"`): **Ventas 24/7** (`Respuesta en 1.2 s`), **Agente Interno** (`14 h ahorradas / sem`) y **Apps y Catálogos** (`100% a tu medida`).
   - Muestra el flujo de 3 pasos (solicitud entrante → acción del agente/plataforma → resultado automático). Alterna cada 5.2 segundos y se pausa al interactuar o pasar el cursor.
2. **Conexión Directa Tarjeta → Formulario de Cotización:**
   - Botón *«Cotizar esta solución →»* en cada tarjeta de servicio que preselecciona automáticamente el servicio en el formulario (`selectedServiceId` con indicador animado `layoutId="active-service-pill"`) y hace scroll suave hacia `#contacto`.
3. **Spotlight de Brasa al Pasar el Cursor (`forge-card-lift`):**
   - Rastreo de coordenadas `--mouse-x` y `--mouse-y` en tarjetas para proyectar un resplandor radial naranja forja (`#E85D04`) suave que ilumina la tarjeta bajo el cursor.
4. **Conector de Flujo en «Cómo Trabajamos» (`animate-ember-flow`):**
   - Línea horizontal sobre las etapas `01 → 02 → 03` con pulso luminoso continuo.
5. **Barra Superior de Progreso de Lectura (`#scroll-progress`):**
   - Implementada con CSS Scroll-Driven Animations nativo (`animation-timeline: scroll(root block)`) bajo `@supports` y `@media (prefers-reduced-motion: no-preference)`, más fallback ligero en JS (`CSS.supports`) según las guías de `modern-web-guidance`.

## Verificación y GitHub
- `npx tsc --noEmit` verificado con 0 errores.
- Commits subidos a `jcalderon90/forjado-landing` (`ce4f1a9` y `b81f3b8`) y a `jcalderon90/FORJADO` (`10d0de4`).

## 3. Segunda Pasada (2026-10-26) — Auditoría Exhaustiva de UI/CSS y Evaluación de Herramientas de Animación de la Bóveda
- **Correcciones de interfaz y estilos en `forjado-landing`**:
  1. **Visibilidad garantizada de tarjetas**: Se reemplazó `whileInView` por animación de entrada directa (`animate={{ opacity: 1, y: 0 }}`) en las grillas de `#servicios`, `#soluciones` y `#proceso`, evitando que las tarjetas quedaran con `opacity: 0` al navegar mediante enlaces de ancla o capturas de página completa.
  2. **Cierre diagonal de biseles (`.chamfer-card::after`)**: `clip-path: polygon(...)` cortaba el borde superior derecho de 16×16 px dejando la esquina abierta; se añadió un pseudo-elemento `::after` con gradiente lineal a 45° que cierra el borde industrial y cambia a naranja en `:hover`.
  3. **Cabecera del simulador en el Hero**: Se corrigió el salto de línea en las métricas (`Respuesta en 1.2 s`, `14 h ahorradas / sem`) añadiendo `whitespace-nowrap shrink-0` y ajustando el título a `SISTEMAS EN MARCHA`.
  4. **Anillos de foco y accesibilidad WCAG 2.2 AA**: Se eliminó el contorno blanco de 3 px al hacer clic en los radios del formulario (`has-[:focus-visible]:outline` + `input:not(.sr-only)`), se añadió foco interno (`inset box-shadow`) para botones con `clip-path` (`.chamfer-sm:focus-visible`) cuyo `outline` externo era recortado por el polígono, y se completó el patrón ARIA `tablist`/`tab`/`tabpanel` (`aria-controls`, `aria-labelledby`).
  5. **Cero warnings en ESLint y limpieza de API**: Migración de los logos `<img>` a `<Image unoptimized />` de `next/image` (`0 errors, 0 warnings`) y actualización de los valores por defecto en `app/api/contact/route.ts`.
- **Evaluación de herramientas de animación de la bóveda personal (`HERRAMIENTAS/Diseño e interfaces/`)**:
  - **`Thinking Orbs` (`thinking-orbs`) — Recomendación #1**: Sustituir el ícono estático `<Activity />` en el simulador en vivo del Hero por `<ThinkingOrb size={20} />` (Canvas 2D sin WebGL, ~131 KB, respeta `prefers-reduced-motion`), cambiando dinámicamente el estado según la pestaña activa (`Ventas 24/7` → `listening`/`composing`, `Agente Interno` → `searching`/`solving`, `Apps y Catálogos` → `working`).
  - **`React Bits` (`TS-TW`) — Recomendación #2**: Compatibilidad 100% directa con el stack de `forjado-landing` (Next 16 + React 19 + Tailwind 4 + Framer Motion + `components.json`). Se recomienda copiar selectivamente `DecryptedText` para el badge de métrica del simulador y `Magnet` para el CTA principal del Hero, descartando fondos WebGL pesados.
  - **`AnimateIcons` — Recomendación #3 (baja prioridad)**: Como `framer-motion` ya está en el bundle de `forjado-landing`, no tiene el sobrecosto de 38 KB que tuvo en GTL, pero solo se recomienda copiar a mano los 4 íconos de `SERVICE_ICONS` activados en hover sobre la tarjeta, sin instalar el paquete completo.
  - **`UI-SKILLS` — Recomendación #4 (auditoría de calidad/motion)**: Uso puntual de las guías `fixing-motion-performance`, `mastering-animate-presence` y `to-spring-or-not-to-spring` como checklist de revisión sin usar el CLI remoto.
