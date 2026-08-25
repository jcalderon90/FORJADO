---
tags: [forjado, operaciones, herramientas]
tipo: proceso
estado: activo
creado: 2026-06-17
actualizado: 2026-06-17
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
| **Servicios activos** | n8n · Chatwoot · Redis · Hermes Agent |
| **OpenRouter** | API de modelos de IA (modelos gratuitos en uso) |
| **Ollama (MacPro Australia)** | LLMs locales, 64 GB RAM, acceso remoto disponible |

> Esta infraestructura permite ofrecer soluciones hospedadas a clientes sin depender de terceros ni incurrir en costos adicionales de inmediato.

## Accesos
Las credenciales de estas herramientas se centralizan en [[Credenciales]] (con cuidado de seguridad).

## Relacionado
- [[Automatización e IA]]
- [[Desarrollo de Software]]
- [[Credenciales]]
