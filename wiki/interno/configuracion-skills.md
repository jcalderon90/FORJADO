---
tags: [forjado, interno, configuracion, skills, superpowers, n8n, karpathy]
tipo: interno
creado: 2026-09-14
actualizado: 2026-09-14
fuente_raw: raw/interno/2026-09-14-instalacion-suite-skills-superpowers-n8n-find-skill.md
---

# Configuración de Habilidades Agenticas (Skills Globales)

> [!info] Estado Actual
> Configuración consolidada de habilidades agenticas globales en `~/.gemini/config/skills/`. Disponible en todas las sesiones y repositorios de FORJADO.

## Habilidades Instaladas

### 1. Metodología Superpowers (14 skills)
Framework completo de ingeniería de software de Jesse Vincent (`obra/superpowers`):
- **Enrutamiento y Proceso:** `using-superpowers`, `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`
- **Calidad y Verificación:** `test-driven-development`, `systematic-debugging`, `verification-before-completion`
- **Escala y Git:** `dispatching-parallel-agents`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch`, `writing-skills`

### 2. Descubrimiento y Recomendación (`find-skill` / `find-skills`)
- Invocar con `/find-skill` o `/find-skills`.
- Escanea la pila técnica del proyecto e identifica/instala las skills más relevantes.

### 3. Automatización de Flujos (`n8n`)
- Guía de sintaxis de expresiones v1.0+, nodos de código (JS/Python), webhooks, sub-flujos y manejo de errores con `Error Trigger`.

### 4. Arquitectura Karpathy Vault
- **`karpathy-vault`**: Principios generales de la bóveda (`raw/` hechos + `wiki/` estado compilado).
- **`manage-vault`**: Manual de convenciones, frontmatter, nombrado y navegación (`[[...]]`).
- **`compile-wiki`**: Flujo de compilación al término de una sesión de trabajo (`/compile-wiki`).

---

## Historial y Fuentes Raw
- [[../../raw/interno/2026-09-14-instalacion-suite-skills-superpowers-n8n-find-skill|raw/interno/2026-09-14-instalacion-suite-skills-superpowers-n8n-find-skill.md — Registro detallado de la instalación]]
