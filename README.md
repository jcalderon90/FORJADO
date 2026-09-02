---
tags: [forjado, indice, navegacion, arquitectura]
tipo: indice
actualizado: 2026-09-02
---

# FORJADO

Bóveda de trabajo de la agencia FORJADO (automatización + IA). Reestructurada el 2026-08-25 con la **arquitectura de bóveda LLM** popularizada por Andrej Karpathy: *Obsidian es el IDE; el LLM (Claude) es el programador; `wiki/` es el codebase.*

## Cómo está organizada

| Capa | Carpeta | Regla |
|---|---|---|
| **Hechos** | [`raw/`](raw/index.md) | Fuente cruda, **append-only**. Sesiones de trabajo, transcripciones, exports de n8n. Nunca se edita, solo crece. |
| **Conocimiento** | [`wiki/`](wiki/index.md) | Compilado, sintetizado, con cross-links. Refleja **solo el estado actual** — no la historia completa. Siempre debe caber en el contexto de una sesión. |
| **Automatización** | [`.claude/skills/compile-wiki/`](.claude/skills/compile-wiki/SKILL.md) | La skill que lee lo nuevo en `raw/` y actualiza/crea páginas en `wiki/`. |
| **Convenciones** | [`.claude/skills/manage-vault/`](.claude/skills/manage-vault/SKILL.md) | La skill de referencia general: cómo navegar, dónde va cada archivo nuevo, nombres, frontmatter, links. Cualquier agente que trabaje en esta bóveda debería seguirla. |

**Por qué:** antes, cada nota de cliente mezclaba el estado actual con años de historial narrativo línea por línea (frontmatter de miles de palabras, secciones "Historial" e "Próximos pasos" duplicando lo mismo tres veces). Cada sesión nueva tenía que leer todo eso para encontrar el pendiente real de hoy. Separando hechos (`raw/`) de conocimiento compilado (`wiki/`), `wiki/index.md` cabe entero en una sola lectura y siempre refleja la verdad actual — el historial completo sigue existiendo, pero vive donde no estorba.

## Punto de entrada

1. **[`wiki/index.md`](wiki/index.md)** — diccionario global, una línea por página. Empieza siempre aquí.
2. **[`wiki/interno/estado-proyecto.md`](wiki/interno/estado-proyecto.md)** — snapshot y pendientes de la agencia, hoy.
3. Páginas de cliente: [`wiki/clientes/carwarriors-llc.md`](wiki/clientes/carwarriors-llc.md) · [`wiki/clientes/varela-law.md`](wiki/clientes/varela-law.md).

Para el detalle histórico completo de cualquier cliente (qué pasó cada día, cada bug, cada decisión), sigue el enlace `fuente_raw:` en el frontmatter de su página en `wiki/` hacia `raw/`.

## Hacia adelante

Al terminar una sesión de trabajo real con un cliente, usa la skill `compile-wiki` (`/compile-wiki` o pídele a Claude "compila esto a la wiki") — registra el hecho en `raw/` y actualiza `wiki/` sin duplicar narrativa.

Para cualquier otra interacción con la bóveda (crear una nota, decidir dónde va algo, navegar, editar una página existente), usa `manage-vault` como referencia de convenciones.
