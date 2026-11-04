---
tags: [forjado, interno, skills, frontend, diseño, impeccable, qa, accesibilidad]
tipo: sesion
fecha: 2026-11-04
estado: cerrado
---

# Sesión 2026-11-04: evaluación de Impeccable (`pbakaus/impeccable`)

## Contexto y objetivo
Jorge pidió analizar https://github.com/pbakaus/impeccable para ver si sirve a FORJADO como agencia (servicios, uso interno, productos propios) y en qué proyectos se puede implementar. Solo se evaluó. **No se instaló nada** ni se ejecutó el detector.

## Fuentes revisadas
- README del repo y landing https://impeccable.style (leídos el 2026-11-04). No se leyeron `/docs`, `/docs/detector`, `/docs/hooks`, `/privacy` ni `/changelog`.
- `npm view impeccable`: versión `4.8.0`, publicada el 2026-10-26.
- Página del repo: ~102,6k estrellas, 6,1k forks, licencia Apache-2.0.
- Wiki interna: `configuracion-skills.md`, `estado-proyecto.md`, `servicios/desarrollo-de-software.md` y `proyectos-pendientes.md`. También el `package.json` y el estado git de cada app en `aplicaciones/`.

## Hallazgos
1. **Qué es:** skill de diseño para agentes. Partió del skill `frontend-design` de Anthropic y lo mantiene Paul Bakaus. Trae unos 23 subcomandos (`/impeccable audit`, `critique`, `polish`, `harden`, `adapt`, `optimize`, `onboard`, `bolder`, `quieter`, `distill`, `colorize`, `typeset`, `layout`, `animate`, `delight`, `overdrive`, `clarify`, `live`, `generate`, `shape`, `init`, `document`, `extract`). Usa como contexto los archivos `PRODUCT.md` y `DESIGN.md`.
2. **Detector:** 62 reglas deterministas, sin LLM ni API key. Corre con `npx impeccable detect <ruta|url>`, admite `--json` y `--github`, y sale con código 2 si hay hallazgos y 1 si falla. En JSX/TSX solo aplica reglas de patrón: el contraste y el texto pequeño necesitan una URL renderizada. También funciona como hook del agente y como extensión de Chrome.
3. **Compatibilidad:** Claude Code, Cursor, Codex, Copilot, Gemini CLI, Google Antigravity, Hermes Agent y unos diez más. Encaja con el entorno de la agencia (`~/.gemini/config/skills/` y Claude Code).
4. **Riesgos:**
   - El hook se ejecuta como comando aunque se le nieguen comandos al modelo, y en la primera edición descarga un binario a `~/.impeccable/bin/`. Algunos archivos del hook no están probados en Windows.
   - El paso *Apply* del modo `live` puede lanzar `claude` o `codex` con aprobaciones y sandbox apagados. Mitigación: `IMPECCABLE_LIVE_COPY_AGENT=chat`.
   - Al empezar un diseño nuevo consulta el catálogo de impeccable.style aunque la telemetría esté apagada. La telemetría se apaga con `DO_NOT_TRACK=1` o `npx impeccable telemetry off`.
   - Se solapa con `frontend-design`, `ui-ux-pro-max` y `web-design-guidelines`, ya instalados. Hay que instalarlo **por proyecto** y no global.
   - `forjado-landing` ya tiene un `DESIGN.md` (de `@google/design.md`). No correr `/impeccable document` encima.

## Decisiones
- Veredicto: **SÍ** para producción de clientes, uso interno y productos propios. Lo más valioso es el detector como compuerta de QA de diseño antes de cada entrega web. El informe `audit` (P0–P3) sirve como anexo de QA y como argumento de venta del servicio de desarrollo.
- La decisión final de adoptarlo queda en manos de Jorge, proyecto por proyecto.

## Pendientes registrados (commits)
| Proyecto | Archivo | Commit |
|---|---|---|
| Agencia (`desarrollo`) | `wiki/interno/estado-proyecto.md` | `f32061a` |
| `forjado-landing` | `STATUS.md` | `d9e1631` |
| `applecell` | `STATUS.md` | `aaa7fb2` |
| Vitrina | `vitrina-backend/docs/PLAN_DESARROLLO.md` §16 | `fffc830` |
| `call-a-car-web` | `STATUS.md` (en `.gitignore`, solo local) | — |

No se registró en Garoo: el frontend de RedtecPortal podría usarlo, pero no es de la agencia.

## Documentación generada
- Recurso compilado: [[../../wiki/interno/recursos/impeccable|wiki/interno/recursos/impeccable]]
- Bóveda de Obsidian: `HERRAMIENTAS/Diseño e interfaces/Impeccable.md`
