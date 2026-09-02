---
tags: [forjado, interno, herramientas, skills, boveda]
tipo: raw
fecha: 2026-09-02
---

# 2026-09-02 — Nueva skill `manage-vault` para gestionar la bóveda

**Contexto:** Jorge pidió una skill que le permita a cualquier agente (no solo a esta sesión) gestionar correctamente esta carpeta, que ya usa la arquitectura de bóveda LLM ("método Karpathy": Obsidian = IDE, LLM = programador, `wiki/` = codebase).

## Investigación

Se buscó primero en el registro público de skills (`npx skills find karpathy`) por si ya existía algo instalable — **no hubo resultados** ("No skills found for karpathy"). No se encontró tampoco nada más específico (nanoGPT, llm, etc.) porque no era eso lo que se pedía: se pedía una skill *para esta bóveda*, no una skill de Karpathy en sí.

## Qué se construyó

Ya existía `.claude/skills/compile-wiki/SKILL.md`, pero está acotada al flujo puntual de "terminé una sesión de trabajo, sintetizo lo nuevo de `raw/` hacia `wiki/`". Faltaba una referencia más general para cualquier otra interacción con la bóveda (crear una nota nueva, decidir en qué carpeta va algo, navegar, editar una página existente, convenciones de nombres/frontmatter/links).

Se creó **`.claude/skills/manage-vault/SKILL.md`**, complementaria a `compile-wiki` (la referencia, no la reemplaza):

- La regla de oro `raw/` (hechos, append-only) vs `wiki/` (conocimiento compilado, solo estado actual).
- Protocolo de navegación: siempre empezar por `wiki/index.md`, nunca explorar el filesystem a ciegas.
- Convenciones de ubicación/nombre de archivo y frontmatter mínimo para entradas de `raw/` y páginas de `wiki/` (client pages vs. páginas de diseño/referencia).
- Convención de links estilo Obsidian (`[[ruta/relativa|texto]]`).
- 6 reglas duras resumidas al final (no reescribir `raw/`, no duplicar narrativa en `wiki/`, registrar toda página nueva en el índice, fechas absolutas, no compilar especulativamente, no inventar contenido no verificado).

Se actualizó también `README.md`: se agregó una fila nueva a la tabla de arquitectura (capa "Convenciones" → `manage-vault`) y una línea en "Hacia adelante" indicando cuándo usar cada skill (`compile-wiki` al cerrar una sesión de trabajo con un cliente; `manage-vault` para cualquier otra interacción con la bóveda).

## Estado

Publicado en el repo (`.claude/skills/manage-vault/SKILL.md` + `README.md` actualizado), sin commitear todavía en esta sesión. No requiere verificación con tráfico real (es documentación de convenciones, no una automatización ejecutable) — la validación real es que las próximas sesiones/agentes efectivamente la sigan.
