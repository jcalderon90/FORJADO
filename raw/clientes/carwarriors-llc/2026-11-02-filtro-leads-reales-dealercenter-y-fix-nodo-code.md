---
tags: [carwarriors, n8n, dealercenter, bugfix, leads]
tipo: bitacora-raw
fecha: 2026-11-02
cliente: Carwarriors LLC
workflow: Subir a DealerCenter (ZxcF7cmf3V8FZabx)
---

# Auditoría & Fix n8n — Filtro Lead Real en `Subir a DealerCenter` (2026-11-02)

## Incidente Reportado
- **Workflow:** `Subir a DealerCenter` (`ZxcF7cmf3V8FZabx`)
- **Ejecución con error:** `#16627` (11:05:30 AM / 15:05:30 UTC)
- **Error mostrado:** `Problem in node 'Filtro Lead Real': A 'json' property isn't an object [item 0]`

## Causa Raíz
1. Se incorporó una nueva compuerta de validación (`Filtro Lead Real` + `Get Mensajes (GHL)`) para evitar que contactos importados masivamente por coexistencia de WhatsApp (sin mensajes entrantes reales en las últimas 24h o con tags `wa-import` / `no-lead`) se sincronicen como leads activos hacia DealerCenter.
2. El nodo Code `Filtro Lead Real` estaba configurado en modo `runOnceForEachItem`.
3. En la versión inicial de la ejecución `#16627`, el código retornaba un arreglo: `return [{ json: { ... } }];`. Al estar en modo `runOnceForEachItem`, n8n exige retornar el objeto directamente (`return { json: { ... } };`). La presencia del array envolvente causó la excepción de validación interna `A 'json' property isn't an object [item 0]`.

## Estado y Resolución
- **Corrección aplicada en n8n:** El retorno se ajustó a `{ json: { ... } }` y se encadenó el nodo HTTP `Get Mensajes (GHL)` para evaluar `dateAdded` y `direction: inbound`.
- **Verificación en producción:**
  - Ejecución `#16629` (11:06:21 AM): `status: success`.
  - Ejecución `#16630` (11:07:44 AM): `status: success`. Procesó al mismo contacto de la ejecución fallida (`o8WfAh2YaXurmdnr1Fpo`, "ALE"), evaluándolo con precisión (`esLeadReal: false`, motivo `whatsapp: sin mensaje entrante (contacto importado)`) y desviándolo a `No es Lead Real - No Enviado` sin enviar a DealerCenter ni disparar errores.
- **Resultado:** No hay leads huérfanos ni errores activos en producción.
