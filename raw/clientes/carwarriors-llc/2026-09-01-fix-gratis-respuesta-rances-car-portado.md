---
tags: [forjado, cliente, carwarriors, fix, whatsapp, bug]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-01
---

# 2026-09-01 — Fix de `GRATIS - Respuesta` portado a PRINCIPAL - Rances Car

**Contexto:** al revisar el fix documentado en [[2026-08-31-fix-gratis-whatsapp-y-kb-search-parsing-recurrencia]], se auditó el pendiente que había quedado abierto ahí: si `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`, clon de PRINCIPAL) tenía el mismo bug.

## Verificación

- **`KB - SEARCH`**: sin riesgo. Rances Car llama al workflow compartido `oB2bc9YTIpXqt5zH` vía el nodo tool `kb_search`, que ya tiene el fix de parseo aplicado el 08-31. Nada que tocar.
- **`GRATIS - Respuesta`**: sí tenía el bug. A diferencia de KB-SEARCH, este nodo vive embebido en cada clon (no compartido), y Rances Car nunca recibió el fix que se aplicó a PRINCIPAL — seguía con la lógica vieja simple (instagram→IG, messenger→FB, sms→SMS, cualquier otro caso → `WhatsApp` hardcodeado), exponiendo el mismo 422 `CONVERSATIONS_MSG_NO_PHONE` para leads de FB/IG sin teléfono en GHL.

Se confirmó que la estructura de conexiones alrededor de `Check GHL Last Message` es idéntica en ambos workflows (corre temprano, justo después de `Find User`, antes de llegar a `GRATIS - Respuesta`), así que la expresión de PRINCIPAL se podía portar tal cual.

## Fix aplicado

- `GRATIS - Respuesta` en `PRINCIPAL - Rances Car`: reemplazado el campo `type` con la misma lógica completa que ya corre en PRINCIPAL (fallback vía `Check GHL Last Message` + mapeo de `lastMessageType`).
- Aplicado con `update_workflow` (operación `updateNodeParameters`, no `setNodeParameter` — el path granular `assignments.assignments` fue rechazado por el validador de paths del MCP; reemplazar el objeto `parameters.assignments` completo sí funcionó).
- **Nota operativa:** el update dejó el cambio en un draft (`versionId` distinto de `activeVersionId`) — no quedó vivo hasta correr `publish_workflow` explícitamente. Se verificó `activeVersion.nodes` antes de publicar y confirmó que aún tenía la lógica vieja; después de publicar, `activeVersionId` pasó a coincidir con la versión corregida.

**Estado:** publicado (`activeVersionId b986721d-319c-4268-a962-5576c9fd76d3`). Sin verificación aún con tráfico real de un lead FB/IG sin teléfono en Rances Car — pendiente confirmar la próxima vez que ocurra.
