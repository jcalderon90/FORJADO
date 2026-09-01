---
tags: [forjado, cliente, carwarriors, fix, bug, alucinacion]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-01
---

# 2026-09-01 — Bot inventó la dirección física del lote a un lead real; guardrail agregado en ambos dealers

**Reporte de Bianca:** captura de una conversación real de Instagram/Messenger con una lead ("Jessica 💗🐐 (Jbaby)") interesada en el Model Y. La lead pidió ir al lote en persona y preguntó la dirección; el bot respondió **"we're at 1234 NW 12th Street, Miami"**. Bianca marcó la ubicación enviada como sospechosa ("Mira la ubicación que le envio").

## Verificación

- **Dirección real confirmada** (repo, `carwarriors-llc-source-2026-08-25.md`): **3620 NW 27th Ave, Miami, FL 33142** — ambos dealers (Carwarriors LLC y Rances Car) comparten el mismo lote físico.
- **1234 NW 12th Street no existe en ningún lado del sistema** — no está hardcodeada en el prompt de `PRINCIPAL`, no aparece en ningún Set node ni respuesta canned. Es una alucinación pura del LLM.
- **El Knowledge Base en Mongo (colección `documents`, ambos dealers) tiene el dato CORRECTO**, verificado con una consulta directa (workflow temporal de solo lectura, ver Método abajo):
  - `dealer: "CW"` → "Carwarriors LLC esta en 3620 NW 27th Ave, Miami, FL 33142..."
  - `dealer: "RANCES"` → "Rances Car esta en 3620 NW 27th Ave, Miami, FL 33142 (mismo lote que Carwarriors LLC...)"
- **Causa raíz real:** el agente principal (`PRINCIPAL`) no tenía ningún guardrail que lo obligara a usar `kb_search` para preguntas de dirección/ubicación — a diferencia del guardrail duro que sí existe para precio ("Nunca des precio exacto ni APR..."). La descripción de la tool `kb_search` solo decía "inventario, politicas, promos o cualquier dato del dealer", sin mencionar dirección explícitamente, y nada prohibía al modelo contestar de memoria si decidía no invocar la tool. El KB nunca estuvo mal — el agente simplemente no lo estaba consultando siempre.

## Método de verificación (Mongo)

La credencial Mongo de Carwarriors (`MongoDB Carwarriors`, usada por el workflow `KB - SEARCH`) no está accesible desde el MCP de `mongodb-atlas` de esta sesión (apunta a un cluster distinto, de otro proyecto). Para inspeccionar la colección `documents` sin ese acceso, se creó un workflow temporal de solo lectura en n8n (`TEMP - Diagnostico KB Mongo`, webhook → nodo MongoDB `find` con query/limit parametrizables desde el body), ejecutado 2 veces vía `execute_workflow` (modo `manual`, sin pinning de credenciales — a diferencia de `test_workflow`, que sí pinea nodos con credenciales y hubiera devuelto datos simulados). Cero escrituras. **Archivado inmediatamente después de usarlo.**

## Fix aplicado

En el `systemMessage` de `PRINCIPAL` (ambos dealers, `Kif9lWwDHvR7TT39` y `N68IYzm4Bf6AVTXP`):
1. Nueva sección `## DIRECCION Y UBICACION ##`: prohíbe explícitamente responder la dirección/horario/teléfono del lote de memoria, obliga a usar `kb_search` siempre, incluso si el dato "parece obvio".
2. Descripción de la tool `kb_search` ampliada para mencionar explícitamente "direccion/ubicacion/como llegar/horario".

**Nota operativa — gotcha nuevo de MCP:** el primer intento se hizo con `update_workflow` operación `setNodeParameter` (path `/parameters/options/systemMessage`). La llamada devolvió éxito (`appliedOperations: 1`) y `publish_workflow` también reportó éxito con un `activeVersionId` nuevo — **pero el contenido real no cambió** (verificado re-leyendo el nodo: longitud de texto idéntica a la original, sin el guardrail). Es decir, el "éxito" fue completamente engañoso — mismo patrón de riesgo que el bug de recurrencia del [[2026-08-31-fix-gratis-whatsapp-y-kb-search-parsing-recurrencia|31 de agosto]] (un fix que aparenta aplicarse pero no toca la ruta viva) y también documentado el mismo día de hoy en [[2026-09-01-fix-gratis-respuesta-rances-car-portado|el fix de Rances Car]] (ahí `setNodeParameter` fue directamente rechazado por el validador; acá fue peor, no dio ningún error). **Reintentado con `updateNodeParameters` (reemplazando el objeto `options` completo) y esta vez sí verificado byte a byte** (longitud exacta esperada, contenido del guardrail presente) tanto en el nodo actual como en `activeVersion` después de publicar, en ambos workflows.

**Lección para el futuro:** `setNodeParameter` con un path tipo `/parameters/options/algo` no es confiable en este MCP — puede reportar éxito sin aplicar nada. Usar `updateNodeParameters` para editar campos dentro de nodos tipo Agent/Set, y **siempre re-verificar con un fetch posterior** (no confiar en el `appliedOperations`/`success` de la respuesta), tal como ya advertía la lección del 31 de agosto pero esta vez con un tool distinto (`setNodeParameter` en vez del bloque anidado huérfano de un Set node).

## Estado

- Publicado y verificado en vivo en `PRINCIPAL` (Carwarriors LLC) y `PRINCIPAL - Rances Car`.
- **Pendiente:** confirmar con tráfico real que la próxima pregunta de dirección se responde con el dato correcto (3620 NW 27th Ave). No se pudo determinar si la lead "Jessica" llegó a visitar la dirección incorrecta o si un asesor humano corrigió la conversación después.
- **No relacionado, solo re-confirmado de paso:** el nodo `OFF TOPIC - Respuesta` de `PRINCIPAL` (Carwarriors LLC) todavía tiene el texto hardcodeado de "SPECTRUM VIVIENDA" (bug ya conocido, ver [[2026-08-27-guardrail-expectativa-gratuita]]) — pero el nodo que realmente envía esa respuesta (`OFF TOPIC - Respond`) sigue `disabled: true`, así que no está impactando a clientes reales hoy. No se tocó en esta sesión.
