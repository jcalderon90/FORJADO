---
tags: [forjado, indice, mapa, arquitectura]
tipo: indice
actualizado: 2026-09-15
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
| [call-a-car-web](../../../aplicaciones/call-a-car-web/README.md) |  | CallaCar Transportation Pty Ltd — ver [[../clientes/callacar]] | Por definir (HTML/CSS/JS base analizado) | 🟡 En análisis de alcance y definición de stack |
| [dealer-center-scraper](../../../aplicaciones/carwarriors/dealer-center-scraper/STATUS.md) | `carwarriors/dealer-center-scraper` | Carwarriors LLC — ver [[../clientes/carwarriors-llc]] | Node.js + Playwright (scraper) · Express (API) · React + Vite + Tailwind (dashboard) · MongoDB Atlas | ✅ Completado y dinámico (STATUS.md, 2026-06-29). Pendiente: sync GHL ↔ DealerCenter (ver su propio STATUS.md) |
| [automated-legal-contracts](../../../aplicaciones/varela-law/automated-legal-contracts/PROJECT_STATUS.md) | `varela-law/automated-legal-contracts` | Varela Law LLC — ver [[../clientes/varela-law]] | React 19 + TypeScript + Vite 8, diseño glassmorphism dorado | ✅ Producción — generador de 4 tipos de contrato legal (NDA, Services, Advisory, Employment Offer), PDFs reales en `/contracts` |
| [lead-discovery](../../../aplicaciones/forjado/lead-discovery/README.md) | `forjado/lead-discovery` | Producto propio FORJADO | Next.js 16 (App Router) + TypeScript + Tailwind 4 + Framer Motion + Zustand | Funcional — "AI Discovery Studio": funnel de 12 pasos con lead scoring (3 tiers) → webhook n8n. Pendiente: URL real de Calendly por tier |
| [portfolio-dev](../../../aplicaciones/forjado/portfolio-dev/README.md) | `forjado/portfolio-dev` | Producto propio FORJADO | Next.js + React + TypeScript + Vite (scaffold) | 🟡 Sin personalizar todavía — README genérico de `create-next-app`, sin contenido propio documentado |

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
