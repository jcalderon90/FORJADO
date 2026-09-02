---
name: manage-vault
description: Guía de referencia para leer, navegar, crear y editar archivos en esta bóveda (arquitectura Karpathy raw/wiki de FORJADO) — úsala antes de crear una nota nueva, decidir dónde va algo, buscar información, o editar cualquier archivo bajo raw/ o wiki/. Úsala también al arrancar una sesión nueva en este repo para orientarte, y como referencia de convenciones (frontmatter, nombres de archivo, links) al mismo tiempo que compile-wiki (que cubre específicamente el paso de compilar raw → wiki al final de una sesión de trabajo).
---

# manage-vault

Esta bóveda usa la **arquitectura de bóveda LLM** popularizada por Andrej Karpathy: *Obsidian es el IDE, el LLM (vos) es el programador, `wiki/` es el codebase.* Esta skill es la referencia de convenciones para operar en ella correctamente — cualquier agente que toque `raw/` o `wiki/` debería seguir esto, no inventar su propia estructura.

Para el flujo específico de "terminé una sesión, sintetizo lo nuevo hacia la wiki", usá `.claude/skills/compile-wiki/SKILL.md` — esta skill es el manual general (dónde va cada cosa, cómo se nombra, cómo se navega, qué no hacer).

## La regla de oro

| Capa | Carpeta | Regla |
|---|---|---|
| **Hechos** | `raw/` | Fuente cruda, **append-only**. Nunca se edita contenido ya guardado, solo se agrega. |
| **Conocimiento** | `wiki/` | Compilado, sintetizado, con cross-links. Refleja **solo el estado actual**, nunca la historia completa. Debe caber siempre en el contexto de una sesión. |

Si no tenés claro en cuál de las dos capas escribir algo, preguntate: *"¿esto es un hecho que pasó (evento, bug, decisión, mensaje) o es el estado actual de algo (verdad vigente hoy)?"* — lo primero va a `raw/`, lo segundo a `wiki/`.

## Cómo navegar (nunca explorar el filesystem a ciegas)

1. Empezá siempre por **`wiki/index.md`** — diccionario global, una línea por página. Ahí está el mapa completo de qué existe y dónde.
2. Para el estado consolidado de la agencia hoy: **`wiki/interno/estado-proyecto.md`**.
3. Para un cliente puntual: `wiki/clientes/<cliente>.md` — su frontmatter tiene `fuente_raw:` apuntando a la carpeta `raw/clientes/<cliente>/` con el historial día a día completo.
4. Si necesitás el detalle histórico de algo que la página de wiki solo resume, seguí el link `[[...]]` a la entrada específica de `raw/` (no asumas que está todo en la wiki — a propósito no lo está).
5. `raw/index.md` explica la estructura de `raw/` si necesitás orientarte ahí directamente.

## Convenciones al escribir en `raw/`

- **Ubicación:** `raw/clientes/<cliente>/YYYY-MM-DD-<slug-corto-descriptivo>.md` (cliente en kebab-case, ej. `carwarriors-llc`). Para hechos de agencia sin cliente específico: `raw/interno/`.
- **Un archivo por cliente+día+tema**, no por mensaje. Si ya existe un archivo de ese cliente con la fecha de hoy y el tema es continuación de lo mismo, **agregá una sección nueva al final** (ej. `## Cierre (YYYY-MM-DD)`) en vez de crear otro archivo. Si es un tema distinto el mismo día, sí creá un archivo nuevo con su propio slug.
- **Nunca reescribas ni borres contenido ya guardado en un archivo de `raw/`** — ni para "corregir" algo que se documentó mal; si algo cambió, agregá una nota nueva explicando la corrección, no edites la entrada original.
- **Fechas siempre absolutas** (`YYYY-MM-DD`), nunca "hoy", "ayer" o "la semana pasada" — quien lea esto en el futuro no tiene el "hoy" de cuando se escribió.
- **Frontmatter mínimo:**
  ```yaml
  ---
  tags: [forjado, cliente, <cliente>, <tema-libre>]
  tipo: raw
  cliente: <Nombre Cliente>
  fecha: YYYY-MM-DD
  ---
  ```
- **Contenido:** narrativa completa sin resumir — qué se investigó, qué se encontró, qué se cambió, qué quedó pendiente y por qué. Mejor exceso de detalle que faltante; esto es la fuente de verdad histórica.
- **Nunca inventes ni completes con suposición** contenido de lo que pasó en la sesión — solo lo verificado.

## Convenciones al escribir/editar en `wiki/`

- **Páginas de cliente:** `wiki/clientes/<cliente>.md` (estado actual + pendientes + accesos). Páginas de diseño/referencia técnica de un cliente van aparte: `wiki/clientes/<cliente>-<tema>.md` (ej. `carwarriors-llc-arquitectura-migracion.md`) y se listan en `wiki/index.md`.
- **Frontmatter de página de cliente:**
  ```yaml
  ---
  tags: [forjado, cliente, <cliente>, ...]
  tipo: cliente
  estado: activo   # o prospecto | contactado | propuesta | cerrado | ganado | perdido
  servicio: automatizacion
  contacto: Nombre (rol)
  creado: YYYY-MM-DD
  actualizado: YYYY-MM-DD
  fuente_raw: raw/clientes/<cliente>/
  ---
  ```
  Actualizá siempre `actualizado:` a la fecha de la edición.
- **Editá en el lugar**, no dupliques narrativa. Un pendiente que se cierra se mueve a una línea corta en "Resueltos recientes" (o se borra si ya no aporta) — el detalle completo de cómo se resolvió vive en el archivo de `raw/` correspondiente, enlazado con `[[...]]`.
- **Si una página de wiki empieza a crecer demasiado** (no cabe cómoda en una lectura), es señal de que hay narrativa que debería estar solo en `raw/` — recortala y dejá el link.
- **Nueva página de wiki:** agregala siempre a `wiki/index.md` con una línea de descripción — si no está en el índice, no existe para el resto de los agentes.
- **`wiki/interno/estado-proyecto.md`** es el punto de entrada diario — si el cambio afecta el resumen por cliente o los pendientes de agencia, actualizalo ahí también.
- **Información sensible** (credenciales, tokens) va únicamente en `wiki/interno/recursos/credenciales.md` o la sección de accesos del cliente — nunca la dupliques en `raw/` sin necesidad real.

## Links (estilo Obsidian)

- `[[ruta/relativa/al/archivo|texto a mostrar]]` sin extensión `.md`, relativo a la ubicación del archivo actual (ej. desde `wiki/clientes/carwarriors-llc.md` hacia `raw/` es `../../raw/clientes/carwarriors-llc/2026-09-02-algo`).
- Cross-linkeá liberalmente: si una página de wiki menciona algo que otra página documenta en detalle, enlazala en vez de repetir el contenido.

## Reglas duras (resumen)

1. `raw/` nunca se edita retroactivamente — solo crece.
2. `wiki/` nunca duplica narrativa larga — solo estado actual + links.
3. Toda página nueva de `wiki/` se registra en `wiki/index.md`.
4. Fechas siempre absolutas.
5. No compiles hacia `wiki/` de forma especulativa o automática sin que haya un hecho real que lo justifique (ver `compile-wiki` para ese flujo).
6. No inventes contenido no verificado en ninguna de las dos capas.
