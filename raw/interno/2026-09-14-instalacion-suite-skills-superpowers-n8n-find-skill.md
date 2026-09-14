---
tags: [forjado, interno, skills, configuracion, superpowers, n8n, karpathy]
tipo: raw
fecha: 2026-09-14
---

# Instalación e Integración Global de Suite de Skills (Superpowers, find-skill, n8n, Karpathy)

En la sesión del 2026-09-14 se realizó una auditoría completa e instalación global de la suite de habilidades agenticas para Antigravity CLI / Gemini, asegurando compatibilidad multiplataforma y acceso ubicuo desde cualquier sesión o workspace.

## Contexto y Petición
El usuario solicitó:
1. Inspeccionar la estructura de los repositorios de FORJADO (`aplicaciones/`, `contenido/`, `desarrollo/`).
2. Descargar e instalar la suite completa de habilidades **Superpowers** de Jesse Vincent (`obra/superpowers`).
3. Crear e instalar una habilidad global para descubrimiento y recomendación de skills (**`find-skill`** / **`find-skills`**), invocable con el comando `/find-skill`.
4. Buscar e instalar la habilidad especializada de automatización de flujos **`n8n`**.
5. Mapear y registrar la habilidad de arquitectura **`karpathy-vault`**, garantizando que `manage-vault` y `compile-wiki` también estén disponibles de forma global en `~/.gemini/config/skills/`.

## Acciones Realizadas

### 1. Instalación de Suite Superpowers
- Clonado el repositorio `obra/superpowers` a `/tmp/superpowers_repo`.
- Copiadas las 14 habilidades a la ruta global `~/.gemini/config/skills/`:
  - `using-superpowers` (regla maestra de enrutamiento y precedencia)
  - `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`
  - `test-driven-development`, `systematic-debugging`, `verification-before-completion`
  - `dispatching-parallel-agents`, `requesting-code-review`, `receiving-code-review`
  - `using-git-worktrees`, `finishing-a-development-branch`, `writing-skills`
- Limpiado el directorio temporal `/tmp/superpowers_repo`.

### 2. Creación e Instalación Global de `find-skill` / `find-skills`
- Creados los archivos de instrucción en:
  - `~/.gemini/config/skills/find-skill/SKILL.md`
  - `~/.gemini/config/skills/find-skills/SKILL.md`
- La habilidad analiza automáticamente la pila técnica del proyecto (`package.json`, `pyproject.toml`, `README.md`, etc.), audita las habilidades locales/globales y recomienda/instala habilidades desde repositorios remotos.

### 3. Creación e Instalación Global de `n8n`
- Creada e instalada la habilidad experta de automatización n8n en `~/.gemini/config/skills/n8n/SKILL.md`.
- Contiene reglas de sintaxis de expresiones v1.0+ (`{{ $json.field }}`, `{{ $('Node Name').item.json }}`), patrones de JavaScript/Python para nodos Code (`$input.all()`), webhooks, sub-flujos, manejo de errores (`Error Trigger`) y desarrollo de nodos comunitarios.

### 4. Creación e Instalación Global de `karpathy-vault`
- Creada la habilidad en `~/.gemini/config/skills/karpathy-vault/SKILL.md`.
- Copiadas e instaladas globalmente `manage-vault` y `compile-wiki` en `~/.gemini/config/skills/` desde la bóveda local de FORJADO.

## Estado Final y Verificación
- Verificado el directorio `~/.gemini/config/skills/` con 20 carpetas de skills instaladas.
- Todas las habilidades están disponibles en todas las sesiones y workspaces del equipo en esta máquina.
