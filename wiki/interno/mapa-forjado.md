---
tags: [forjado, indice, mapa, arquitectura]
tipo: indice
actualizado: 2026-11-20
---

# Mapa de FORJADO — más allá de esta bóveda

> Esta bóveda (`desarrollo/`) es la carpeta **principal de indexado y mapeo de todo FORJADO**, no solo de su propio contenido. Esta página es el mapa hacia las carpetas hermanas que viven fuera de `desarrollo/` pero dentro de `FORJADO/`. Cada una mantiene su propia fuente de verdad — acá solo se referencia, no se duplica el detalle.

```
FORJADO/
├── aplicaciones/     → Apps de clientes y forjado/ (productos y plataformas de la agencia)
├── contenido/        → bóveda propia (Ljörk / NERINE), arquitectura Karpathy independiente
└── desarrollo/       → esta bóveda (estás acá)
```

**Regla de corte:** una carpeta va en `aplicaciones/` si tiene remoto propio en GitHub (es un producto desplegado); si no, vive dentro de la bóveda/sistema al que sirve (ver `raw/interno/2026-09-07-reestructuracion-carpeta-raiz-forjado.md` para el criterio completo).

## `aplicaciones/`

Ver [`aplicaciones/README.md`](../../../aplicaciones/README.md) y [`aplicaciones/forjado/README.md`](../../../aplicaciones/forjado/README.md) para el índice global.

| App | Carpeta | Cliente/dueño | Stack | Estado |
|---|---|---|---|---|
| [call-a-car-web](../../../aplicaciones/call-a-car-web/README.md) | `call-a-car-web` | CallaCar Transportation Pty Ltd — ver [[../clientes/callacar]] | Astro 5 + TypeScript + Hono API + MongoDB + Vanilla CSS accesible (WCAG AA) | 🟢 Pre-Cierre (`522e563`) — Portal + Reviews/Cotizador + hardening `40 Reglas` (`130` tests API, `17/17` tests sitio, `10` páginas). Pendiente `PUBLIC_TURNSTILE_SITE_KEY` en Vercel y revisión legal 2.4 |
| `dealer-center-scraper` *(archivado / sin carpeta local)* | `carwarriors/dealer-center-scraper` | Carwarriors LLC — ver [[../clientes/carwarriors-llc]] | Node.js + Playwright · Express · React + Vite + Tailwind · MongoDB Atlas | ✅ Completado (`2026-06-29`); sin carpeta activa en disco. Cuenta Carwarriors en pausa desde 2026-11-09 |
| [automated-legal-contracts](../../../aplicaciones/automated-legal-contracts/PROJECT_STATUS.md) | `automated-legal-contracts` | Varela Law LLC — ver [[../clientes/varela-law]] | React 19 + TypeScript + Vite 8, diseño glassmorphism dorado | ✅ Producción (`9629f06`) — generador de 4 tipos de contrato legal (NDA, Services, Advisory, Employment Offer), PDFs reales en `/contracts` |
| [applecell](../../../aplicaciones/applecell/STATUS.md) | `applecell` | Taller técnico Apple / Cliente | Next.js 16 (App Router) + TypeScript + MongoDB Atlas + Vercel | 🟢 Operativo (`9408f00`) — Catálogo interactivo con cotizador y panel administrativo |
| [lead-discovery](../../../aplicaciones/forjado/lead-discovery/README.md) | `forjado/lead-discovery` | Producto propio FORJADO | Next.js 16 (App Router) + TypeScript + Tailwind 4 + Framer Motion + Zustand | 🟢 Funcional (`6fe6ffb`) — "AI Discovery Studio": funnel de 12 pasos con lead scoring (3 tiers) → webhook n8n. Pendiente: URL real de Calendly por tier |
| [forjado-landing](../../../aplicaciones/forjado/forjado-landing/README.md) | `forjado/forjado-landing` | Producto propio FORJADO (Landing Page Oficial) | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + Framer Motion + Space Grotesk | 🟢 En Producción Verificada (`82f2bca` / `05411c8`: `forjadoland.netlify.app`, fix `#418` + `40 Reglas` + `/privacidad` + `/terminos` + `404` certificados en vivo sin errores en Edge headless). Pendiente conectar dominio `forjado.tech` |
| [prospeccion](../../../aplicaciones/forjado/prospeccion/README.md) | `forjado/prospeccion` | Interno FORJADO (Ventas Hispanoamérica) | Workspace Claude Code + `recorrido.html` (Three.js `0.170.0`) + `perfil-oferta.md` + `data/prospectos.csv` | 🟢 Lote #1 Listo (`4a067c8` local en `main`, `data/` ignorado) — 5 comandos activos (`/prospectar`, `/calificar`, `/micro-demo`, `/proponer`, `/seguimiento`), 12 prospectos inmobiliarios calificados, micro-demo 3D y 3 aperturas listas; falta remoto privado en GitHub (ver [[ventas/prospeccion-hispanoamerica]]) |
| [calibre](../../../aplicaciones/forjado/calibre/STATUS.md) | `forjado/calibre` *(antes `time-control`; 3 repos: `calibre-backend`, `calibre-frontend`, `calibre-desktop`)* | Producto propio FORJADO / Piloto #1 All Print | Node.js + Express + Mongo + Cloudflare R2 · React 19 + Tailwind + Zustand + Stripe · Electron + SQLite + keyspy + get-windows | 🟢 En Producción (`882b8c5` / `9fb0737` / `822af3c`) — Dokploy + Cloudflare R2 activos, **510/510** tests backend, fix CSP Nginx, `Calibre-Setup-1.2.9.exe` compilado en `release/`. Pendiente pulsar **Redeploy** manual en Dokploy, E2E desktop e IP fija Oracle (ver [[productos/time-control\|ficha técnica]] y [[../clientes/all-print]]) |
| [vitrina](../../../aplicaciones/forjado/vitrina/vitrina-backend/docs/PLAN_DESARROLLO.md) | `forjado/vitrina` (3 repos: `vitrina-frontend`, `vitrina-backend`, `vitrina-spatial`) | Producto propio FORJADO — vitrina digital + directorio para mypimes y particulares en Cienfuegos (Cuba); foco alimentos y artículos del hogar | Astro 5 + React (islas) · Fastify 5 + Zod · MongoDB Atlas · auth propia (Argon2id + JWT) · Dokploy en VPS Oracle · `vitrina-spatial` (showrooms 3D/interactivos) | 🟢 Hardening & Features OK (`5a4a9c6` / `febe105` / `493833f`) — `BoneyardSkeleton` (`CLS = 0`), Probador Paper-Doll `1080×1350` + Combo `-10%`, `.HEIC` y hardening **40 Reglas** backend (`368/368` tests, `0` vulns `npm audit`). Pendiente secrets APK Android, rotación/backups Atlas y dominio HTTPS definitivo |

> [!info] Marca (decidido 2026-10-14)
> El logo y la identidad visual de FORJADO ([[marca/identidad-visual]]) aplican a los productos propios (`lead-discovery`, `forjado-landing`, `vitrina`, `time-control` en proceso de adaptación); los proyectos de clientes conservan su propia marca.

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
- En **Obsidian (`BOVEDA-PERSONAL`)**: mapa de proyectos Garoo/RedTec (`PROYECTOS/Garoo/`) y catálogo maestro de herramientas y referencias multimedia (`HERRAMIENTAS/Biblioteca de Referencias Modernas - Auditoria imgs.md`).
