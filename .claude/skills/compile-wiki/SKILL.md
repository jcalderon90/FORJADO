---
name: compile-wiki
description: Compila entradas nuevas de raw/ hacia las páginas sintetizadas de wiki/, siguiendo la arquitectura de bóveda de FORJADO (raw = hechos append-only, wiki = conocimiento compilado). Úsala después de una sesión de trabajo con un cliente, o cuando el usuario pida "actualizar el estado" / "compilar la bóveda" / "pasar esto a la wiki".
---

# compile-wiki

Esta skill implementa el flujo de "arquitectura Karpathy" de esta bóveda: **Obsidian es el IDE, el LLM es el programador, `wiki/` es el codebase.** `raw/` es el log de commits — nunca se reescribe, solo crece.

## Cuándo usarla

- Al final de una sesión de trabajo real con un cliente (bug encontrado, decisión tomada, pendiente cerrado).
- Cuando el usuario pide explícitamente "actualiza el estado", "compila esto a la wiki", "pasa esto al historial".
- Nunca de forma automática/silenciosa sin que el usuario lo pida o sin que acabe de terminar una sesión de trabajo real — no compilar especulativamente.

## Paso 1 — Registrar el hecho crudo en `raw/`

1. Identifica el cliente (o `interno/` si es de agencia) y la carpeta `raw/clientes/<cliente>/` correspondiente.
2. Crea un archivo nuevo con fecha: `raw/clientes/<cliente>/YYYY-MM-DD-<slug-corto>.md`. **Nunca edites un archivo de `raw/` ya existente** — si la sesión es el mismo día que uno ya creado, agrega una sección nueva al final de ese archivo, no reescribas lo de arriba.
3. Contenido: narrativa completa, sin resumir — qué se investigó, qué se encontró, qué se cambió, qué quedó pendiente, y por qué. Esto es la fuente de verdad histórica; mejor exceso de detalle aquí que faltante.

## Paso 2 — Revisar el índice de `wiki/`

1. Lee `wiki/index.md` completo (es corto a propósito — una línea por página, cabe siempre en contexto).
2. Decide si el hecho nuevo:
   - **Actualiza el estado actual** de una página existente (ej. un pendiente se cerró, un bug se corrigió, un dato cambió) → editar esa página de `wiki/`.
   - **Es un pendiente nuevo** → agregarlo a la sección "Pendientes abiertos" de la página del cliente y/o de `wiki/interno/estado-proyecto.md`.
   - **Documenta algo que no existía** (una arquitectura nueva, una guía nueva) → crear una página nueva en `wiki/clientes/` o `wiki/interno/`, y agregarla a `wiki/index.md` con una línea de descripción.

## Paso 3 — Compilar, no copiar

- Las páginas de `wiki/` reflejan **solo la verdad actual**. No pegues la narrativa completa del raw ahí — al final de la sección relevante, deja un enlace al archivo raw nuevo para quien quiera el detalle completo.
- Si una página de `wiki/` empieza a acumular pendientes resueltos o narrativa histórica larga, muévela a una línea corta en "Resueltos recientes" (o bórrala si ya no aporta) y confía en que el detalle vive en `raw/`.
- Nunca dupliques la misma narrativa larga en dos páginas de `wiki/` — un solo lugar por hecho, con enlaces cruzados (`[[nombre]]`) desde donde haga falta referenciarlo.

## Paso 4 — Actualizar `wiki/interno/estado-proyecto.md`

Si el cambio afecta el estado consolidado (tabla de resumen por cliente) o los pendientes de agencia, actualízalo ahí también — es el punto de entrada diario.

## Reglas duras

- `raw/` es append-only: crear archivos nuevos, no editar los existentes salvo para agregar (nunca borrar ni reescribir contenido ya guardado).
- `wiki/` siempre debe caber cómodamente en el contexto de una sesión — si una página crece demasiado, es señal de que hay narrativa que debería estar en `raw/`, no en `wiki/`.
- Nunca inventes contenido de `raw/` que no se haya verificado en la sesión real — esta skill compila hechos ya confirmados, no genera contenido nuevo.
- Información sensible (credenciales, tokens) va solo en las páginas designadas para eso (ver `wiki/interno/recursos/credenciales.md` y la sección de accesos de cada cliente) — nunca la dupliques en `raw/` sin necesidad.
