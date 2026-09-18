---
fecha: 2026-09-18
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, mongo, bsonerror, contactid, bug-critico, produccion]
---

# 2026-09-18 — Solución Definitiva BSONError: Desacoplamiento a `contactId` y limpieza en `Prepare Update`

## Contexto y Nuevos Hallazgos de Errores

Tras corregir `.toJsonString()` en `DATA to UPDATE`, se detectaron errores residuales adicionales en leads nuevos con datos calificados (ejecución `7573` - Juan M Llanca y ejecución `7583` - Jorge Duva):

```text
⚠️ Error en workflow: PRINCIPAL - Detalle: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
```

### Causa Raíz de la Segunda Falla
1. **Comportamiento de `Insert User` en MongoDB Node:**
   Al registrar un nuevo lead, el nodo `Insert User` de MongoDB inserta el registro y devuelve en `$json._id` un objeto con buffer binario (`{ buffer: { "0": 106, ... } }`) en vez de una cadena hexadecimal.
2. **Transformación en `Prepare Update`:**
   El nodo `Prepare Update` hacía `_id.toString()`. En JavaScript, aplicar `.toString()` a un objeto plano `{ buffer: ... }` resulta en la cadena literal `"[object Object]"`.
3. **Falla en `Update User Lead`:**
   El nodo `Update User Lead` tenía configurado `updateKey: "_id"`. Al recibir `"[object Object]"`, el driver BSON intentaba ejecutar `new ObjectId("[object Object]")`, arrojando un `BSONError` idéntico.

---

## Solución de Ingeniería Aplicada

Para erradicar de raíz la fragilidad de `_id` y `ObjectId` en el ecosistema de n8n:

### 1. Desacoplamiento a `contactId` en Nodos de Actualización MongoDB
En MongoDB (`users`), todos los registros cuentan con un `contactId` único provisto por GoHighLevel (utilizado de forma confiable en `Find User`, `SET SPAM FIELD` y `Save Last Bot Message`).

- **`Update User`:**
  - `updateKey`: cambiado de `"_id"` a `"contactId"`.
  - `fields`: `={{ Object.keys($json).filter(k => k !== '_id' && k !== 'contactId').join(',') }}`.
- **`Update User Lead`:**
  - `updateKey`: cambiado de `"_id"` a `"contactId"`.
  - `fields`: `={{ Object.keys($json).filter(k => k !== '_id' && k !== 'contactId' && $json[k] !== null && $json[k] !== undefined).join(',') }}`.

### 2. Saneamiento de `Prepare Update`
- Se eliminó la asignación conflictiva de `_id`.
- Se añadió explícitamente el campo `contactId`:
  ```javascript
  contactId: "={{ $('PARSE BODY').first().json.current_body.contactId }}"
  ```
- Ningún nodo downstream depende de `_id`. MongoDB actualiza directamente por `{ contactId: contactId }` y modifica únicamente los campos de calificación (`city`, `interes_vehiculo`, `metodo_pago`, `timing_compra`, `datos_completos`, etc.).

---

## Verificación en Producción

Ambos workflows fueron actualizados y publicados en vivo vía API n8n MCP:
- **`PRINCIPAL` (`Kif9lWwDHvR7TT39`):**
  - Versión activa: `a5c47e2f-f98d-4dc0-ab61-c11e5dceef67`.
  - Ejecución de prueba `7588` (Juan M Llanca): **100% SUCCESS** (20s).
  - Ejecución posterior `7594`: **100% SUCCESS** (32s).
- **`PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`):**
  - Versión activa: `f50942d0-6726-4c6b-8591-369adfcce1a5`.
  - Ejecución de prueba `7595` (Jorge Duva - interés Tesla): **100% SUCCESS** (38s).

Cero errores registrados en el handler de errores desde la publicación.

---

## Archivos Sincronizados
- [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL.json`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL.json)
- [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL - Rances Car.json`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL%20-%20Rances%20Car.json)
