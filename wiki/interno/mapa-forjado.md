---
tags: [forjado, indice, mapa, arquitectura]
tipo: indice
actualizado: 2026-10-14
---

# Mapa de FORJADO — más allá de esta bóveda

> Esta bóveda (`desarrollo/`) es la carpeta **principal de indexado y mapeo de todo FORJADO**, no solo de su propio contenido. Esta página es el mapa hacia las dos carpetas hermanas que viven fuera de `desarrollo/` pero dentro de `FORJADO/`. Cada una mantiene su propia fuente de verdad — acá solo se referencia, no se duplica el detalle.

```
FORJADO/
├── aplicaciones/     → 5 apps, cada una con su propio repo de GitHub
├── contenido/        → bóveda propia (Ljörk / NERINE), arquitectura Karpathy independiente
└── desarrollo/       → esta bóveda (estás acá)
```

**Regla de corte:** una carpeta va en `aplicaciones/` si tiene remoto propio en GitHub (es un producto desplegado); si no, vive dentro de la bóveda/sistema al que sirve (ver `raw/interno/2026-09-07-reestructuracion-carpeta-raiz-forjado.md` para el criterio completo).

## `aplicaciones/`

| App | Carpeta | Cliente/dueño | Stack | Estado |
|---|---|---|---|---|
| [call-a-car-web](../../../aplicaciones/call-a-car-web/README.md) | `call-a-car-web` | CallaCar Transportation Pty Ltd — ver [[../clientes/callacar]] | Astro 5 + TypeScript + Vanilla CSS accesible (WCAG AA) + Sharp + SEO Schema.org | ✅ Build Listo — Portal web corporativo, legal y de soporte completo (5 rutas compiladas). Pendiente backend de contacto y CI/CD en callacar.au |
| [dealer-center-scraper](../../../aplicaciones/carwarriors/dealer-center-scraper/STATUS.md) | `carwarriors/dealer-center-scraper` | Carwarriors LLC — ver [[../clientes/carwarriors-llc]] | Node.js + Playwright (scraper) · Express (API) · React + Vite + Tailwind (dashboard) · MongoDB Atlas | ✅ Completado y dinámico (STATUS.md, 2026-06-29). Pendiente: sync GHL ↔ DealerCenter (ver su propio STATUS.md) |
| [automated-legal-contracts](../../../aplicaciones/varela-law/automated-legal-contracts/PROJECT_STATUS.md) | `varela-law/automated-legal-contracts` | Varela Law LLC — ver [[../clientes/varela-law]] | React 19 + TypeScript + Vite 8, diseño glassmorphism dorado | ✅ Producción — generador de 4 tipos de contrato legal (NDA, Services, Advisory, Employment Offer), PDFs reales en `/contracts` |
| [lead-discovery](../../../aplicaciones/forjado/lead-discovery/README.md) | `forjado/lead-discovery` | Producto propio FORJADO | Next.js 16 (App Router) + TypeScript + Tailwind 4 + Framer Motion + Zustand | Funcional — "AI Discovery Studio": funnel de 12 pasos con lead scoring (3 tiers) → webhook n8n. Pendiente: URL real de Calendly por tier |
| [forjado-landing](../../../aplicaciones/forjado/forjado-landing/README.md) | `forjado/forjado-landing` | Producto propio FORJADO (Landing Page Oficial) | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + Space Grotesk | 🟢 Funcional — Landing Page oficial de FORJADO (`jcalderon90/forjado-landing`, antes `portfolio-dev`) con identidad visual Forja (`#E85D04`, `#111111`), copy ejecutivo (*«Ingeniería de software, automatización e IA.»*), 4 disciplinas, 3 escenarios prácticos, sección *«Cómo trabajamos»* (3 etapas + 3 pilares), SEO técnico (`Schema.org`, `sitemap.xml`, `robots.txt`), WCAG 2.2 AA y formulario de contacto (`/api/contact` → webhook n8n). Pendiente despliegue en producción / dominio oficial |
| [vitrina](../../../aplicaciones/vitrina/vitrina-backend/docs/PLAN_DESARROLLO.md) | `vitrina` (2 repos: `vitrina-frontend`, `vitrina-backend`) | Producto propio FORJADO — vitrina digital + directorio para mypimes y particulares en Cienfuegos (Cuba); foco alimentos y artículos del hogar | Astro + React (islas) · Fastify + Zod · MongoDB Atlas · auth propia (Argon2id + JWT) · Dokploy en VPS Oracle | 🟡 En desarrollo, MVP sin completar (plan v0.5, revisado 2026-10-05): auth, negocio, catálogo, vitrina pública, admin, PWA y directorio desplegados con HTTPS provisional (`vitrinaf.duckdns.org`); multi-negocio por cuenta sin commitear. Detalle y pendientes en su `PLAN_DESARROLLO.md` (secciones 11 y 16) y en [[proyectos-pendientes]] |

> [!info] Marca (decidido 2026-10-14)
> El logo y la identidad visual de FORJADO ([[marca/identidad-visual]]) aplican solo a los productos propios (`lead-discovery`, `forjado-landing`, `vitrina`); los proyectos de clientes conservan su propia marca.

## `contenido/`

Bóveda propia e independiente para el sistema de generación de contenido de las marcas **Ljörk** y **NERINE** (repo GitHub `social-media-content-`). Usa su propia arquitectura Karpathy (`sources/` + `wiki/` + skills `capture/sync/lint/digest/campaign-*`) — no está unificada con la de `desarrollo/`, son dos bóvedas separadas.

| Qué | Dónde |
|---|---|
| Estado y pendientes | [`contenido/STATUS.md`](../../../contenido/STATUS.md) |
| Esquema y convenciones propias | [`contenido/AGENTS.md`](../../../contenido/AGENTS.md) |
| Su propio índice de conocimiento | [`contenido/wiki/index.md`](../../../contenido/wiki/index.md) |
| Motor de generación de imagen/video (Python/Poetry/FFmpeg) | `contenido/engine/` |

**Estado al 2026-09-07:** 🔴 producción en pausa desde 2026-08-23 (ver `contenido/STATUS.md`) — no se está creando contenido nuevo ni gestionando campañas. Pendiente de mayor peso: construir `brand/nerine/` (Ljörk ya completo) y cerrar Campaña 1 antes de poder planificar Campaña 2.

## Ver también

- [[../index|wiki/index.md — índice de esta bóveda]]
- [[../interno/estado-proyecto|Estado del proyecto]]
- [[../../raw/interno/2026-09-07-reestructuracion-carpeta-raiz-forjado|raw — historia completa de la reestructuración de la carpeta raíz FORJADO]]
