---
tags: [forjado, interno, configuracion, skills, superpowers, n8n, karpathy]
tipo: interno
creado: 2026-09-14
actualizado: 2026-11-20
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

### 5. Arquitectura y Visualización Técnica (`archify`)
- Herramienta para entregables de consultoría técnica y desarrollo de software (`tt-a1i/archify`).
- Genera diagramas interactivos en HTML autónomo (arquitectura, flujos, secuencias, ERD, ciclo de vida, waterfall, timelines y explainers ejecutivos).
- Soporta exportación a SVG/PNG/WebM, trazabilidad de componentes, dark/light themes y delta comparators (`archify compare`).
- Ubicación: `~/.gemini/config/plugins/user-global-skills/skills/archify` y `~/.gemini/config/skills/archify`. CLI ejecutable directamente con Node.js (`node <ruta>/bin/archify.mjs`).

### 6. Componentes Animados y UI Interactiva (`react-bits`)
- Biblioteca y registro abierto de más de 217 componentes, fondos WebGL/Canvas y micro-interacciones animadas para React (`reactbits.dev`).
- Filosofía shadcn: código fuente modular en TS/JS con Tailwind CSS o CSS puro (`npx shadcn@latest add @react-bits/...`).
- Compatible con el registro MCP oficial para instalación y configuración por agentes de IA.
- Ubicación: `~/.gemini/config/plugins/user-global-skills/skills/react-bits` y `~/.gemini/config/skills/react-bits`.
- Referencia interna completa: [[recursos/react-bits]].

### 7. Suite IA y Frontend (Auditoría 2026-11-19 — Instalada 2026-11-20)
Instalación curada de **18 skills globales** en `C:\Users\Jorge\.agents\skills\` vinculadas por symlink/junction tanto a **Antigravity** (`C:\Users\Jorge\.gemini\config\skills\`) como a **Claude Code** (`C:\Users\Jorge\.claude\skills\`):
- **Copywriting, Ventas y Anti-Slop (9):** `stop-slop` (`hardikpandya/stop-slop`), `product-marketing`, `copywriting`, `copy-editing`, `cold-email`, `prospecting`, `cro`, `pricing`, `ad-creative` (`coreyhaines31/marketingskills`).
- **Context Engineering (3):** `context-fundamentals`, `context-optimization`, `context-compression` (`muratcankoylan/Agent-Skills-for-Context-Engineering`).
- **Animación GSAP (5):** `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance` (`greensock/gsap-skills`).
- **Automatización Web y QA (1 + CLI global):** skill `playwright-cli` (`microsoft/playwright-cli`) + paquete global `@playwright/cli` (`0.1.25`). *(Skill interna `dev` omitida deliberadamente).*

---

## Skills Recomendadas / En Evaluación (Auditoría 2026-11-19)

Identificadas en la auditoría de `C:\Users\Jorge\Desktop\imgs\` (`Skills/` y `Tips de IA/`):

| Skill / Toolkit | Fuente / Repositorio | Qué aporta | Prioridad / Estado |
|---|---|---|---|
| **Context Engineering** | `muratcankoylan/Agent-Skills-for-Context-Engineering` | Optimiza prompts y reduce drásticamente el consumo de tokens por petición. | 🟢 Instalada (2026-11-20 — 3 skills core) |
| **Stop Slop** | `hardikpandya/stop-slop` | Humanizador de copy para eliminar estilo genérico/robótico de IA. | 🟢 Instalada (2026-11-20) |
| **Marketing Skills** | `coreyhaines31/marketingskills` (+20 skills gratis) | Pack de copy para anuncios, SEO, emails, pricing y analítica. | 🟢 Instalada (2026-11-20 — 8 skills seleccionadas) |
| **Impeccable** | `github.com/pbakaus/impeccable` | 24 comandos (`polish`, `audit`, `bolder`, `critique`) y 62 reglas anti-AI-slop (ver [[recursos/impeccable]]). | 🟡 Por proyecto (nunca global) |
| **GSAP Skills** | `github.com/greensock/gsap-skills` (`gsap.com`) | Timelines y scroll (`ScrollTrigger`); todo GSAP ya es 100% gratis. Clave para scrollytelling. | 🟢 Instalada (2026-11-20 — 5 skills) |
| **Taste Skill** | `github.com/Leonxlnx/taste-skill` | Dirección de arte real, búsqueda de imágenes y auto-revisión en navegador. | 🟡 Media-Alta (por evaluar) |
| **Playwright CLI** | `github.com/microsoft/playwright-cli` | Navegador real automatizado para recorrer páginas y capturar cada estado UI. | 🟢 Instalada (2026-11-20 — skill + `@playwright/cli`) |
| **transitions.dev** | `github.com/Jakubantalik/transitions.dev` | +43 transiciones CSS pulidas (`Modal`, dropdowns, contadores, check de éxito). | 🟡 Media (por evaluar) |
| **designlang** | `github.com/Manavarya09/design-extract` (`npx designlang`) | Extrae de una URL 17+ archivos de colores, fuentes y Tailwind. | 🟡 Media (por evaluar) |
| **UI UX Pro Max** | `nextlevelbuilder/ui-ux-pro-max-skill` | Biblioteca de estilos, paletas y tipografías para evitar diseños genéricos en webs y dashboards. | 🟡 Instalada en `~/.agents/skills/` y `~/.claude/skills/` |
| **Remotion** | `remotion.dev` (ya en uso en `contenido/engine`) | Video programático en React desde guion (Licencia Free para equipos de hasta 3 personas). | 🟢 En uso |

---

## Historial y Fuentes Raw
- [[../../raw/interno/2026-10-27-auditoria-react-bits-e-instalacion-skill|raw/interno/2026-10-27-auditoria-react-bits-e-instalacion-skill.md — Auditoría de React Bits e instalación de skill global]]
- [[../../raw/interno/2026-09-14-instalacion-suite-skills-superpowers-n8n-find-skill|raw/interno/2026-09-14-instalacion-suite-skills-superpowers-n8n-find-skill.md — Registro detallado de la instalación]]
