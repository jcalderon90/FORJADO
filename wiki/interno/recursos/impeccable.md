---
tags: [forjado, interno, recursos, frontend, diseño, impeccable, qa, accesibilidad, skills]
tipo: recurso
creado: 2026-11-04
actualizado: 2026-11-04
estado: evaluado-no-instalado
fuente_raw: raw/interno/2026-11-04-evaluacion-impeccable.md
---

# Recurso: Impeccable (`pbakaus/impeccable`), QA de diseño para agentes

> [!info] Resumen
> Skill de diseño para agentes de código, con unos 23 subcomandos, y un **detector determinista de 62 reglas** (sin LLM ni API key) que marca problemas de accesibilidad y la "estética de plantilla de IA". Licencia Apache-2.0, gratis, versión `4.8.0` (2026-10-26). **Estado: evaluado y no instalado.** La adopción la decide Jorge proyecto por proyecto.

## 1. Para qué lo usaría FORJADO
- **Compuerta de QA antes de entregar una web**: `npx impeccable detect <url de staging>` + `/impeccable audit` (informe P0–P3) + `/impeccable polish`. El informe sirve de anexo de QA en la entrega y de argumento de venta del servicio [[../servicios/desarrollo-de-software|Desarrollo de software]].
- **Sitio propio**: auditar `forjado-landing` cada vez que cambie, en vez de repetir a mano las auditorías UI/CSS del 10-26 y el 10-27.
- **Productos propios**: en Vitrina, `adapt`, `optimize`, `harden` y `onboard` para Android de gama baja y estados vacíos.
- Se combina con [[react-bits]]: React Bits añade movimiento e Impeccable vigila que el resultado no parezca plantilla.

## 2. Uso rápido

```bash
# Probar sin instalar nada
npx impeccable detect src/
npx impeccable detect https://sitio.com        # contraste y texto pequeño solo con URL renderizada
npx impeccable detect src/ --github            # anotaciones en GitHub Actions (exit 2 = hallazgos)
npx impeccable ignores add-value overused-font Inter --reason "Fuente de marca"

# Instalar en un proyecto (no global)
npx impeccable install --providers=claude --scope=project
# luego, en el agente:
/impeccable init       # escribe PRODUCT.md
/impeccable audit
/impeccable polish
```

## 3. Comandos principales
| Grupo | Comandos |
|---|---|
| Revisar | `critique` (UX con puntuación), `audit` (accesibilidad, rendimiento, theming, responsive; P0–P3) |
| Terminar | `polish`, `harden`, `clarify`, `adapt`, `optimize`, `onboard` |
| Orientar | `bolder`, `quieter`, `distill`, `colorize`, `typeset`, `layout`, `animate`, `delight`, `overdrive` |
| En vivo | `live` (variantes sobre el dev server), `generate` |
| Planificar | `shape`, `init` (`PRODUCT.md`), `document` (`DESIGN.md`), `extract` |

## 4. Reglas de uso en la agencia
- **Instalar por proyecto**, nunca global: se solapa con `frontend-design`, `ui-ux-pro-max` y `web-design-guidelines`.
- **Telemetría apagada**: `DO_NOT_TRACK=1` o `npx impeccable telemetry off`. El catálogo de direcciones visuales se consulta igual al empezar un diseño nuevo. Según el autor no se envían código ni archivos (no verificado).
- **Hook**: descarga un binario a `~/.impeccable/bin/` y se ejecuta aunque se nieguen comandos al modelo. Algunos archivos no están probados en Windows. Revisarlo antes de trabajo desatendido.
- **Modo `live`**: solo en local, con `IMPECCABLE_LIVE_COPY_AGENT=chat`. Si no, *Apply* lanza `claude`/`codex` sin aprobaciones ni sandbox. Nunca en producción ni aflojando la CSP.
- **No sobrescribir un `DESIGN.md` existente** con `/impeccable document` (caso `forjado-landing`).
- Los falsos positivos por identidad de marca (fuente, paleta Industrial Forge, turquesa/crema de Vitrina) se silencian con `ignores`, sin cambiar el diseño.

## 5. Pendientes abiertos por proyecto
- Agencia: [[../estado-proyecto|estado-proyecto]] (QA de diseño como paso estándar de entrega).
- `forjado-landing`, `applecell` y `call-a-car-web`: en su `STATUS.md` (el de `call-a-car-web` es solo local).
- Vitrina: `vitrina-backend/docs/PLAN_DESARROLLO.md`, sección 16.

## Relacionado
- [[react-bits]] · [[../configuracion-skills|Configuración de skills]] · [[../servicios/desarrollo-de-software|Desarrollo de software]]
- Fuente: [[../../../raw/interno/2026-11-04-evaluacion-impeccable|raw/interno/2026-11-04-evaluacion-impeccable]]
- Bóveda de Obsidian: `HERRAMIENTAS/Diseño e interfaces/Impeccable.md`
