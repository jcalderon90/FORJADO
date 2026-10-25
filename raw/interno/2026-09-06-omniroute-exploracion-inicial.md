---
tags: [forjado, interno, infraestructura, omniroute, vps-oracle]
tipo: raw
fecha: 2026-09-06
---

# 2026-09-06 — Exploración inicial de OmniRoute en el VPS Oracle

Jorge pidió entrar con `playwright-cli` a una instancia de **OmniRoute** que tiene instalada en su VPS Oracle (`https://forjado-omniroute-190795-129-213-108-102.sslip.io/home`), para dos cosas: (1) entender qué es y para qué sirve toda la interfaz, y (2) evaluar conectar ahí **Hermes Agent** y/o un "DeepSeek harness" (o alternativas a este).

## Qué es OmniRoute

Un gateway/proxy de LLMs auto-hospedado (v3.8.17 al momento de explorarlo, hay update a v3.8.50 disponible pero no aplicado — no es repo git, requeriría `npm install -g` o bajar el source). Cualquier cliente (n8n, un IDE, un CLI) le pega a un único endpoint OpenAI-compatible (`/v1`) y OmniRoute decide a qué proveedor real mandar cada request, con failover, cache, compresión de prompts y tracking de costos — básicamente un LiteLLM-style router pero con muchísima más superficie (agentes, MCP, A2A, etc.).

## Acceso

El login pedía password (sin usuario), y el default `CHANGEME` ya no servía — Jorge confirmó la clave real en su momento. Se usó para entrar exitosamente. **Las credenciales no se almacenan en este repositorio** (siguiendo las directrices de `wiki/interno/recursos/credenciales.md`) — se gestionan de forma segura fuera del control de versiones.

Nota operativa para quien retome esto: `playwright-cli` (viene de `@playwright/cli`, ya instalado globalmente vía nvm) es el comando correcto para navegar la página (`open`, `goto`, `snapshot`, `click`, `fill`, etc.). Ejecutarlo dentro de un `for` de bash a veces falla con "command not found" (problema de resolución de PATH en ese contexto de shell) — si pasa, correr cada comando `playwright-cli` suelto, no en loop.

## Estado encontrado

- Único proveedor conectado: **OpenRouter** (coincide con lo que ya documenta [[../../wiki/interno/operaciones/herramientas-y-stack|Herramientas y Stack]] — "OpenRouter: modelos gratuitos en uso"). Catálogo total disponible: **230 proveedores** (101 con free tier, 152 con API key, 16 OAuth, 5 sin auth).
- Auto-routing activo (banner "Auto-Routing Active" en el home), pero **0 Combos propios creados** — usa las 16 plantillas `auto/*` built-in por defecto. Hay 14 estrategias de ruteo disponibles para armar un Combo propio (failover ponderado entre proveedores).

## Hermes Agent — lo que pidió Jorge conectar

Está en el catálogo de OmniRoute: `/dashboard/cli-agents/hermes-agent` — "Hermes Agent (Nous Research) — advanced multi-role autonomous terminal AI". **OmniRoute lo detecta como "not found" (no instalado)** en este VPS.

Esto es un dato interesante que vale la pena reconciliar en una sesión futura: [[../../wiki/interno/operaciones/herramientas-y-stack|Herramientas y Stack]] ya lista "Hermes Agent" entre los "Servicios activos" del VPS Oracle (junto a n8n, Chatwoot, Redis) desde el 2026-06-17. O sea, según la wiki debería estar corriendo, pero la detección de OmniRoute dice que no lo encuentra. Puede ser que esté instalado pero no en el PATH donde corre el proceso de OmniRoute, o que la entrada de la wiki ya esté desactualizada. **No se investigó a fondo esta discrepancia en esta sesión** — solo se registra como pendiente.

La página de detalle de Hermes Agent en OmniRoute permite asignar un modelo distinto por rol (Default/main, Delegation/subagents, Vision, Compression, Web Extract, Skills Hub, Approval) — se guarda en `~/.hermes/config.yaml`. Para conectarlo de verdad:
1. Instalar (o reinstalar/verificar) el binario de Hermes Agent en el VPS — botón "Install" en esa misma página.
2. Conectar el proveedor **Nous Research** en `/dashboard/providers/nous-research` (API key desde `portal.nousresearch.com`, tiene free tier) — o simplemente apuntar los roles de Hermes Agent a OpenRouter, que ya está conectado.

## DeepSeek "harness" — lo que pidió Jorge conectar

El equivalente que existe en el catálogo es **DeepSeek TUI** (`/dashboard/cli-code/deepseek-tui`, CLI en Rust, open source, de Hunter Bown). También "not found". A diferencia de Hermes Agent, su wizard de configuración muestra **"Coming soon"** — OmniRoute lo reconoce (soporta full base URL) pero todavía no tiene la UI de conexión lista; se configuraría a mano (`OPENAI_BASE_URL` / `OPENAI_API_KEY` apuntando al endpoint de OmniRoute).

Además, **DeepSeek existe como proveedor nativo** en `/dashboard/providers/deepseek` (API key desde `platform.deepseek.com`, free tier disponible, modelos `ds/deepseek-v4-pro` y `ds/deepseek-v4-flash`). Dato relevante para Carwarriors: ese cliente ya usa `deepseek-v4-flash`, pero **vía OpenRouter**, no directo. Conectar DeepSeek nativo en OmniRoute daría una ruta alterna (probablemente más barata/directa) para el mismo modelo — útil el día que se arme un Combo de failover para los workflows de n8n de Carwarriors, que ya tuvieron varios problemas de timeout del proveedor este mismo mes (ver [[../clientes/carwarriors-llc/2026-09-06-auditoria-completa-notificaciones-slack-gmail-monitor|auditoría del mismo día]]). No se tocó nada de la config de Carwarriors en esta sesión, es solo una idea anotada para más adelante.

## Alternativas ya listadas en el catálogo (todas "not found" hoy)

- **Agentes autónomos amplios** (como Hermes): Open Claw, Goose, Open Interpreter, Warp AI, Agent Deck.
- **CLIs de código** (como DeepSeek TUI): Claude Code, Codex CLI, Aider, Cline, Continue, Roo Code, Kilo Code, OpenCode, Qwen Code, Cursor Agent CLI, Gemini CLI, GitHub Copilot, Factory Droid, ForgeCode, jcode, Smelt, Pi, o un "Custom CLI" genérico para lo que no esté listado.

## Mapa completo de la interfaz (para qué más sirve OmniRoute)

- **OmniProxy** (el core): Endpoints, API Key Manager, Providers (catálogo de 230), Embedded Services (motores locales CLIProxyAPI/9Router, accesibles solo en loopback), Combos (failover ponderado, 14 estrategias), Provider Quota + Quota Sharing, Compresión de contexto (Caveman = comprime prompts, RTK = filtra output, Engine Combos).
- **Tools**: Traffic Inspector (debug de cualquier tráfico HTTPS, no solo LLM), Agent Bridge (intercepta tráfico de agentes de IDE), ACP Agents (al revés: OmniRoute lanza CLIs como backend), Cloud Agents.
- **Integrations**: API Endpoints custom, Webhooks de eventos.
- **Analytics/Costs**: uso, salud de combos, utilización por proveedor, cache hit rate, ahorro por compresión, evals, latencia; pricing por modelo, budgets, tracking de free-tier mensual.
- **Monitoring**: Activity feed, Logs/Proxy Logs/Console Logs, Audit Log + MCP Audit + A2A Audit, Health check, Runtime resilience.
- **Dev Tools**: Playground (probar prompts en vivo), Translator (conversión de formatos), Search Tools registry.
- **Agentic Features**: Memory (memoria persistente de agentes), MCP Server, A2A Server, AgentSkills/OmniSkills (registros de skills).
- **Otros**: Batch Jobs + Files, cache de media, Leaderboard/gamificación, Settings globales (routing, resilience/retries, seguridad, feature flags).

## Qué quedó pendiente

- **No se instaló ningún agente/CLI ni se conectó ningún proveedor nuevo** — la sesión fue solo exploración + recuperación de acceso. Jorge tiene que decidir por dónde arrancar (Hermes Agent + Nous Research, DeepSeek nativo, o ambos).
- **Reconciliar la discrepancia Hermes Agent**: la wiki lo lista como servicio activo del VPS desde junio, pero OmniRoute dice que no lo detecta — sin investigar todavía.
- Idea anotada (no decidida): usar un Combo de OmniRoute (OpenRouter + DeepSeek nativo) como capa de failover para los workflows de n8n de Carwarriors, dado el historial reciente de timeouts del proveedor de IA en ese cliente.

Relacionado: [[../../wiki/interno/operaciones/herramientas-y-stack|Herramientas y Stack]], [[../../wiki/interno/estado-proyecto|Estado del Proyecto]]
