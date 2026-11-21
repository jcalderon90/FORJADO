---
tags: [forjado, operaciones, herramientas]
tipo: proceso
estado: activo
creado: 2026-06-17
actualizado: 2026-11-20
---

# Herramientas y Stack — FORJADO

## Automatización

| Herramienta | Uso |
|---|---|
| **n8n** | Herramienta principal para automatizaciones con y sin IA. Primera opción siempre. |
| **Make** | Alternativa a n8n cuando el cliente ya lo usa o el caso lo justifica. |

## IA y Agentes

| Herramienta | Uso |
|---|---|
| **n8n** | Agentes de IA y chatbots cuando se necesita algo rápido y funcional. |
| **Python / JavaScript** | Migración a código cuando se requiere más control, escala o personalización (librerías de agentes). |
| **Claude / Claude Code** | Desarrollo asistido, generación de contenido, agentes. |
| **Recall.ai** | Bots y streaming de audio/video en videollamadas (Meet, Zoom, Teams) — arquitectura transversal en Obsidian (`HERRAMIENTAS/Video, voz e imagen/Arquitectura Voz IA - Recall.ai, Baseten y Kokoro TTS.md`). |
| **Baseten** | Inferencia de modelos ML/LLMs en GPUs dedicadas y serverless con Truss — arquitectura transversal en Obsidian (`HERRAMIENTAS/Video, voz e imagen/Arquitectura Voz IA - Recall.ai, Baseten y Kokoro TTS.md`). |

## Frontend

| Herramienta | Uso |
|---|---|
| **React + Vite** | SPA y apps interactivas |
| **Next.js** | Apps con SSR, SEO o rutas de servidor |
| **TypeScript / JavaScript** | Lenguajes base |
| **TailwindCSS** | Estilos utility-first (preferido) |
| **Bootstrap** | Alternativa cuando el proyecto lo pide |
| **shadcn/ui** | Componentes accesibles sobre Tailwind |
| **Astro** | Sitios de contenido, marketing o alta performance (evaluado por caso) |

## Backend

| Herramienta | Uso |
|---|---|
| **Node.js + Express** | Backend principal |
| **Python** | En aprendizaje activo para backends alternativos |
| **Supabase** | BaaS: auth, base de datos PostgreSQL + vectores, storage — evita construir desde cero |
| **Convex** | Alternativa a Supabase para backends reactivos sin servidor |

## Bases de datos

| Herramienta | Uso |
|---|---|
| **MongoDB** | Base de datos NoSQL principal (ver [[MongoDB Database]]) |
| **PostgreSQL (Supabase)** | Base de datos relacional + vectorización de bases de conocimiento para IA |

## CRM y comunicación

| Herramienta | Uso |
|---|---|
| **ManyChat** | Automatización de mensajería / chatbots |
| **Chatwoot** | Plataforma de atención y comunicación con clientes |
| **Monday.com** | Gestión de proyectos y CRM |
| _(flexible)_ | Se adapta a lo que usa el cliente |

## Filosofía de stack

> Si el proyecto o el cliente requiere una tecnología nueva, no es problema — me auxilio de IA para aprender y construir. El stack no es un límite, es un punto de partida.

---

## Infraestructura propia

| Recurso | Detalles |
|---|---|
| **VPS Oracle Cloud (free tier)** | ARM/Ampere, 24 GB RAM — servidor principal |
| **DNS** | Dominio DuckDNS (gratuito) |
| **Dokploy** | Panel de despliegue corriendo en el VPS |
| **Servicios activos** | n8n · Chatwoot · Redis · Hermes Agent · WireGuard VPN |
| **WireGuard (wg-easy)** | VPN privada cifrada (puerto UDP 51820, Web UI en Dokploy con SSL) para acceso seguro a la infraestructura — ver [[WireGuard VPN]]. |
| **OmniRoute** | Gateway/proxy propio de LLMs (multi-proveedor, failover, cache, compresión de prompts) — instalado en el mismo VPS. **09-06:** explorado por primera vez; solo tiene OpenRouter conectado hoy, de un catálogo de 230 proveedores soportados. Pensado para conectar ahí Hermes Agent, DeepSeek u otros agentes/CLIs — nada conectado todavía, ver [[../../../raw/interno/2026-09-06-omniroute-exploracion-inicial|raw]]. |
| **OpenRouter** | API de modelos de IA (modelos gratuitos en uso) |
| **Ollama (MacPro Australia)** | LLMs locales, 64 GB RAM, acceso remoto disponible |

> Esta infraestructura permite ofrecer soluciones hospedadas a clientes sin depender de terceros ni incurrir en costos adicionales de inmediato.

> [!note] Por reconciliar (09-06)
> Esta tabla lista "Hermes Agent" como servicio activo desde el 2026-06-17, pero al explorar OmniRoute el 09-06 este lo detectó como "not found" (no instalado) en el VPS. Puede que esté instalado fuera del PATH que usa OmniRoute, o que este dato ya esté desactualizado — sin confirmar todavía.

## Diseño, Motion, 3D y QA Pre-Deploy (Biblioteca 2026-11)

Estándar de herramientas y referentes incorporados tras la auditoría de `C:\Users\Jorge\Desktop\imgs\` (biblioteca completa en Obsidian `HERRAMIENTAS/Biblioteca de Referencias Modernas - Auditoria imgs.md` y [[../configuracion-skills]]):

| Área | Herramienta / Estándar | Uso principal en FORJADO |
|---|---|---|
| **Skeletons `CLS = 0`** | **Boneyard** | Extracción pixel-perfect de skeleton loaders sin saltos de diseño en cargas móviles (Vitrina 3G/4G, Calibre, apps Next/React). |
| **Motion & Scrollytelling** | **GSAP + ScrollTrigger** *(100% gratis)* | Timelines, pinned scroll, scrub de secuencias en `<canvas>` y Motion Graphics programáticos a 60 fps (`gsap.timeline()`). |
| **Recorridos 3D ligeros** | **Three.js single-file** (`recorrido.html`) | Maquetas caminables en un solo HTML sin assets externos (Pack Inmobiliario Nivel 1 y Perla Inmobiliaria). |
| **Micro-interacciones & Tokens** | **transitions.dev** · **designlang** | +43 transiciones CSS pulidas y extracción rápida de tokens/paleta/Tailwind desde URLs de referencia (`npx designlang`). |
| **Skills de Diseño y Copy** *(en evaluación)* | `Context Engineering`, `Stop Slop`, `Marketing Skills`, `Impeccable`, `Taste Skill`, `Playwright CLI`, `UI UX Pro Max` | Ahorro de tokens, copy humano sin clichés IA, auditoría visual/a11y determinista (62 reglas) y verificación real en navegador. |
| **QA Pre-Deploy** | **Checklist de 40 Reglas** | 20 reglas de seguridad (API/DB/Auth/Uploads/Headers) + 20 pre-lanzamiento (legal, SEO/OG, WCAG, 404, anti-spam, GA4). |
| **⚠️ Alerta de seguridad API** | **APInex (`apinex.bond`)** | Gateway promocionado como gratuito: **prohibido con repositorios o datos de clientes** (Varela Law, Carwarriors, Garoo); solo uso sandbox/desechable. |

## Accesos
Las credenciales de estas herramientas se centralizan en [[Credenciales]] (con cuidado de seguridad).

## Relacionado
- [[Automatización e IA]]
- [[Desarrollo de Software]]
- [[Credenciales]]
- [[WireGuard VPN]]
