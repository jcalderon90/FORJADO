---
fecha: 2026-09-18
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, mongo, bsonerror, bug-critico, produccion]
---

# 2026-09-18 — Diagnóstico y corrección de BSONError en `PRINCIPAL` y `PRINCIPAL - Rances Car` (`DATA to UPDATE`)

## Incidente Reportado

Jorge reportó alertas de error recibidas en n8n por correo/Slack:
1. `16:12` — `⚠️ Error en workflow: PRINCIPAL - Detalle: input must be a 24 character hex string, 12 byte Uint...`
2. `16:14` — `⚠️ Error en workflow: PRINCIPAL - Detalle: input must be a 24 character hex string, 12 byte Uint...`
3. `16:30` — `⚠️ Error en workflow: PRINCIPAL - Rances Car - Detalle: input must be a 24 characte...`

## Causa Raíz Confirmada

El error `BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer` se disparaba cada vez que un **lead existente (retorno/segunda interacción)** enviaba un mensaje al bot.

### Flujo de Ejecución del Fallo
1. El lead envía un mensaje (2do mensaje en adelante).
2. El nodo `Find User` encuentra el documento del usuario en MongoDB (`users`).
3. El condicional `If USER NOT EXIST` evalúa `false` y desvía el flujo hacia la rama de actualización: `DATA to UPDATE` $\rightarrow$ `Update User`.
4. En el nodo `DATA to UPDATE` (tipo `n8n-nodes-base.set`), la asignación del campo `_id` estaba configurada como:
   ```javascript
   ={{ $('Find User').first().json._id.toJsonString().replace(/^"(.*)"$/, '$1') }}
   ```
5. **Causa exacta:** El campo `_id` retornado por MongoDB es una instancia de `ObjectId`. En JavaScript/BSON, `ObjectId` **no posee el método `.toJsonString()`** (solo métodos como `.toString()`, `.toHexString()` y `.toJSON()`).
6. Al evaluar `_id.toJsonString()`, se generaba un `TypeError`, provocando que la expresión en n8n resolviera a cadena vacía `""`.
7. Inmediatamente después, el nodo `Update User` (`operation: "update"`, `collection: "users"`, `updateKey: "_id"`) intentaba convertir `_id` mediante `new ObjectId("")`.
8. El driver BSON de MongoDB lanzaba `BSONError: input must be a 24 character hex string...`, abortando el workflow y disparando el `ERROR HANDLER`.

## Solución Aplicada

En ambos workflows (`PRINCIPAL` y `PRINCIPAL - Rances Car`), se corrigió la asignación de `_id` en el nodo `DATA to UPDATE`:

```javascript
// ANTES (erróneo):
={{ $('Find User').first().json._id.toJsonString().replace(/^"(.*)"$/, '$1') }}

// DESPUÉS (corregido):
={{ $('Find User').first().json._id.toString().replace(/^\"(.*)\"$/, '$1') }}
```

Este cambio homologa la expresión con el nodo downstream `Prepare Update` (que ya usaba `.toString()` correctamente).

## Estado de Repositorios
- Archivos locales actualizados:
  - [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL.json`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL.json)
  - [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL - Rances Car.json`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL%20-%20Rances%20Car.json)
- Commit: `0a6b2e2` pushed a `origin/main`.
