---
tags: [forjado, cliente, carwarriors, n8n, prompt, encoding, fix]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Corregido el mojibake (doble-encoding UTF-8) en el prompt de `PRINCIPAL - Rances Car`

**Contexto:** hallazgo encontrado en `[[2026-09-04-prompt-jerarquia-alternativas-inventario]]` al comparar el prompt de `PRINCIPAL - Rances Car` contra `PRINCIPAL`. Jorge pidió corregirlo en la misma sesión.

## Diagnóstico

El texto corrupto seguía un patrón consistente de doble-encoding (UTF-8 interpretado como Windows-1252 y vuelto a guardar como UTF-8) — ej. `Ã³` en vez de `ó`, `Â¿` en vez de `¿`, `â€”` en vez de `—`. Afectaba tanto a las 2 secciones propias de Rances Car (`URGENCIA Y CIERRE (PLAYBOOK BDC)`, `DETECCION ANTI-SPAM / BAJO INTERES`) como a 2 líneas de secciones compartidas con `PRINCIPAL` (`TELEFONO`, `GUARDRAIL`) — es decir, no era exclusivo del contenido nuevo, contaminaba también texto que en `PRINCIPAL` está limpio.

Dos casos no eran un simple problema de encoding sino pérdida real de un carácter en algún punto del pipeline: `"inclÃºela"` (le faltaba la "y" de "inclúyela") y `"SÃ son"` (le faltaba el segundo byte del acento de "SÍ son") — corregidos manualmente comparando contra el texto equivalente correcto en `PRINCIPAL`.

## Corrección aplicada

Reemplazo quirúrgico solo de los tokens corruptos identificados (`Ã³`→`ó`, `Ã©`→`é`, `Ã­`→`í`, `Ã±`→`ñ`, `Ãš`→`Ú`, `Ãº`→`ú`, `Ã‰`→`É`, `Ã“`→`Ó`, `Â¿`→`¿`, `â€”`→`—`, más los 2 casos de carácter perdido), sin tocar ninguna otra palabra del prompt. Verificado antes de aplicar que no quedara ningún residuo de mojibake (`grep` de los patrones corruptos → cero resultados) y que el resto del texto (compartido con `PRINCIPAL`) no se viera afectado.

Aplicado vía `update_workflow` (`updateNodeParameters` sobre el nodo `PRINCIPAL`), publicado con `publish_workflow`, y verificado byte a byte comparando el texto guardado contra el texto intentado.

## Pendiente real

- [ ] Confirmar con tráfico real que el bot de Rances Car ahora produce las palabras acentuadas correctamente en mensajes que toquen el playbook de urgencia o la detección anti-spam (antes del fix, el LLM podía copiar los caracteres corruptos directamente a su respuesta al lead).
- [ ] No se investigó el origen del mojibake (en qué paso del pipeline de creación/clonado del workflow se introdujo) — si vuelve a aparecer en una futura edición del prompt, revisar cómo se está copiando/pegando el texto hacia n8n.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-04-prompt-jerarquia-alternativas-inventario]]
