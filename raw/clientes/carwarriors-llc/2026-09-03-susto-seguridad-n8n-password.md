---
tags: [forjado, cliente, carwarriors, n8n, seguridad, falsa-alarma]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-03
---

# 2026-09-03 — Susto de seguridad n8n (falsa alarma, era password incorrecta)

**Contexto:** Jorge reportó no poder entrar a n8n y sospechó que le habían hackeado la contraseña. Se investigó como incidente real antes de confirmarse que fue **contraseña incorrecta del propio usuario** — no hubo compromiso.

## Investigación hecha (útil aunque fue falsa alarma)

- **Workflows y credenciales revisados vía MCP `n8n-carwarriors`** (`search_workflows`, `list_credentials`): los 15 workflows y 11 credenciales existentes son consistentes con lo documentado, sin nada nuevo ni sospechoso.
- **6 workflows con `updatedAt` de hoy entre 12:32–12:34** (`PRINCIPAL`, `PRINCIPAL - Rances Car`, `LEAD-COLLECTOR`, `RSVP`, `RSVP - Rances Car`, `KB - SEARCH`) parecían sospechosos por estar todos en una ventana de 2 minutos — se verificó vía `get_workflow_history` y correspondían al fix legítimo de timeouts de OpenRouter de esta misma sesión (ver `2026-09-03-timeouts-openrouter-lead-collector-fix.md`), autor "Jorge Calderón (via MCP)". **No es tampering.**
- **Confirmado: no hay acceso SSH configurado a la VPS (`2.24.106.87`) desde esta máquina de Claude Code** — `ssh root@2.24.106.87` devuelve `Permission denied (publickey,password)`, sin entrada en `~/.ssh/config` ni `known_hosts` previa. Cualquier acción que requiera SSH al VPS (reset de owner account de n8n vía `docker exec ... n8n user-management:reset`, revisar `authorized_keys`, etc.) la tiene que ejecutar Jorge directamente — no delegable a Claude en este entorno.
- **Confirmado el tipo de login de n8n**: pantalla propia de n8n (email + password, "user management"), no HTTP Basic Auth de Traefik. Si en el futuro sí hay que resetear por un compromiso real, el camino es `docker exec -it <contenedor_n8n_principal> n8n user-management:reset` (contenedor con el puerto 5678, no el worker ni los task runners) — esto borra el owner account e invalida sesiones activas, forzando la pantalla de "Set up owner account" de nuevo.

## Pendiente real que salió a relucir (no nuevo, ya conocido)

- [ ] Rotar el **GHL Location API Key** (Carwarriors LLC y Rances Car) — pendiente desde 2026-07-27 por haber quedado expuesto en un chat de esa sesión, sin relación con el susto de hoy. Se aprovechó la conversación para recordarlo pero sigue sin hacerse.

## Relacionado

- [[carwarriors-llc]]
- [[carwarriors-llc-infraestructura]]
- [[2026-09-03-timeouts-openrouter-lead-collector-fix]]
