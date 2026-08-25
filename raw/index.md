---
tags: [forjado, indice, raw]
tipo: indice
actualizado: 2026-08-25
---

# raw/ — Capa de hechos (append-only)

> Todo lo que hay aquí es **fuente cruda e inmutable**. Nunca se edita, solo se agrega. Cuando algo nuevo pasa (una sesión de trabajo, un mensaje de cliente, un export de workflow), la entrada se agrega aquí primero — recién después la skill `compile-wiki` (ver `.claude/skills/compile-wiki/SKILL.md`) sintetiza lo relevante hacia `wiki/`.

## Estructura

| Carpeta | Contenido |
|---|---|
| `clientes/carwarriors-llc/carwarriors-llc-source-2026-08-25.md` | Snapshot íntegro del documento de cliente antes de la reestructuración (2026-08-25) — historial día a día completo hasta esa fecha |
| `clientes/carwarriors-llc/n8n-workflows/` | Exports JSON de los workflows de n8n de Carwarriors LLC |
| `clientes/varela-law/varela-law-source-2026-08-25.md` | Snapshot íntegro del documento de cliente antes de la reestructuración (2026-08-25) |
| `clientes/varela-law/n8n-workflows/` | Exports JSON de los workflows de n8n de Varela Law |
| `clientes/varela-law/mensajes/` | Transcripciones de mensajes reales enviados a Mario Varela |
| `interno/estado-proyecto-source-2026-08-25.md` | Snapshot íntegro del Estado del Proyecto antes de la reestructuración (2026-08-25) |
| `navegacion-legacy/` | Archivos de navegación (MOC, índices) de la estructura anterior a esta reorganización — conservados por si hace falta referencia histórica, ya no son la navegación activa (usar [[../wiki/index]]) |
| `misc/nodes_out.json` | Artefacto suelto de una sesión de trabajo con el MCP de n8n |

## Convención hacia adelante

A partir de 2026-08-25, las entradas nuevas de historial (por cliente, por fecha) deben agregarse como archivos nuevos dentro de `clientes/<cliente>/` (ej. `clientes/carwarriors-llc/2026-09-01-sesion.md`), no reescribiendo los snapshots de arriba. Ver la skill `compile-wiki` para el flujo completo.

## Ver también

- [[../wiki/index|wiki/ — capa compilada]]
- [[../README|README — arquitectura de la bóveda]]
