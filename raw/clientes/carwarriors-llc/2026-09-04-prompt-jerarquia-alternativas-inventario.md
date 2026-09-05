---
tags: [forjado, cliente, carwarriors, n8n, prompt, inventario]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Portada al prompt la jerarquía de alternativas de inventario (idea del framework externo `gyoan-byte/carwarriors-kb`)

**Contexto:** continuación de `[[2026-09-04-identidad-gyoan-byte-confirmada]]`. Jorge decidió portar al prompt del bot las ideas identificadas como reusables, empezando por la jerarquía de alternativas cuando no hay match de inventario.

## Lectura del prompt actual antes de tocar nada

Se leyó completo el `systemMessage` del nodo `PRINCIPAL` (agente `@n8n/n8n-nodes-langchain.agent`) en ambos workflows (`PRINCIPAL`, id `Kif9lWwDHvR7TT39`, y `PRINCIPAL - Rances Car`, id `N68IYzm4Bf6AVTXP`, ambos en la instancia n8n de Carwarriors). Esto permitió corregir una suposición: **escalamiento a humano y manejo de objeciones ya estaban bien cubiertos** (jerarquía de escalamiento de 5 niveles, triggers explícitos) — portar la librería de objeciones del framework externo hubiera sido redundante y hubiera roto el estilo deliberadamente terso del prompt (máx. 2 oraciones, sin listas). El único gap real: la sección `PRECIOS E INVENTARIO` no decía qué hacer cuando no hay match exacto de inventario.

## Cambio aplicado

Una sola línea agregada al final de la sección `PRECIOS E INVENTARIO` en ambos workflows:

> Si no hay match exacto en inventario, usa `kb_search` y ofrece alternativas en este orden: mismo modelo/año distinto → misma marca/modelo similar → mismo tipo de carrocería. Nunca respondas solo "no disponible" sin alternativa.

Aplicado vía `update_workflow` (operación `updateNodeParameters` sobre el nodo `PRINCIPAL`, merge sobre `parameters.options.systemMessage`), publicado explícitamente con `publish_workflow` en los dos workflows (gotcha ya conocido: el primer update solo toca el draft), y verificado byte a byte comparando el texto guardado contra el texto intentado.

## Hallazgo aparte, no corregido en este cambio

Al comparar el prompt de `PRINCIPAL - Rances Car` contra `PRINCIPAL` para ubicar la sección correcta, se encontró que el primero tiene **mojibake real (doble-encoding UTF-8)** en varias palabras acentuadas — pero solo dentro de sus 2 secciones propias (`URGENCIA Y CIERRE (PLAYBOOK BDC)` y `DETECCION ANTI-SPAM / BAJO INTERES`, que no existen en `PRINCIPAL`): "maÃ±ana" (mañana), "PatrÃ³n" (Patrón), "intenciÃ³n" (intención), "Â¿Te queda" (¿Te queda), etc. El resto del prompt (compartido con `PRINCIPAL`) está limpio. Se preservó el mojibake tal cual al aplicar el cambio de inventario — no se intentó corregir, es un problema aparte sin relación con esta tarea. Queda como pendiente nuevo en la wiki.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-04-identidad-gyoan-byte-confirmada]]
