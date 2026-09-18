---
fecha: 2026-09-18
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, rances-car, n8n, invalid-syntax, prepare-update, data-to-update, diagnostico, produccion]
---

# 2026-09-18 — Diagnóstico de Alerta "invalid syntax Nodo: Pre..." y Saneamiento Residual en `DATA to UPDATE`

## 1. Contexto de la Alerta
El usuario reportó mediante captura de pantalla dos correos de alerta de error recibidos en `jcalderon900610@gmail.com` a las **17:45** y **17:49** EDT:

```text
⚠️ Error en workflow: PRINCIPAL - Rances Car - Workflow: PRINCIPAL - Rances Car Detalle: invalid syntax Nodo: Pre...
```

## 2. Diagnóstico Técnico de Causa Raíz
1. **Origen:**
   A las 17:10 EDT (commit `0a6b2e23`), un intento previo de mitigar el `BSONError` en MongoDB introdujo en el nodo `Prepare Update` de `PRINCIPAL - Rances Car`:
   ```javascript
   _id: "={{ $('User Data').first().json._id.toString().replace(/^\"(.*)\"$/, '$1') }}"
   ```
2. **Falla de sintaxis:**
   El motor de expresiones de n8n no soporta adecuadamente esa combinación de escapado de comillas y expresiones regulares dentro de llaves `{{ }}`, arrojando `invalid syntax` al evaluar el nodo `Prepare Update` (abreviado por la interfaz de Gmail como `Nodo: Pre...`).
3. **Resolución previa (17:56 EDT - Commit `733d8508`):**
   A las 17:56 EDT (7 minutos después de la alerta de las 17:49), se saneó de raíz el flujo:
   - Se desacopló la actualización de MongoDB a `contactId` en `Update User` y `Update User Lead`.
   - Se removió la asignación de `_id` en `Prepare Update`.
   - Se publicó la versión activa `f50942d0-6726-4c6b-8591-369adfcce1a5` en `PRINCIPAL - Rances Car`, confirmando ejecuciones posteriores 100% exitosas (`7588`, `7594`, `7595`).

## 3. Saneamiento Residual Aplicado
Durante la auditoría se detectó que el nodo previo `DATA to UPDATE` aún conservaba la asignación huérfana:
```json
{
  "name": "_id",
  "value": "={{ $('Find User').first().json._id.toString().replace(/^\\\"(.*)\\\"$/, '$1') }}"
}
```
Dado que `Update User` actualiza por `contactId` y filtra activamente `_id`, dicha propiedad era redundante y un riesgo latente.

**Cambios realizados:**
- Se eliminó el campo `_id` de `DATA to UPDATE` en `PRINCIPAL - Rances Car.json`.
- Se eliminó el campo `_id` de `DATA to UPDATE` en `PRINCIPAL.json`.
- Validada la integridad sintáctica y JSON de ambos flujos (0 errores).

## 4. Archivos Sincronizados
- [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL - Rances Car.json`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL%20-%20Rances%20Car.json)
- [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL.json`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL.json)
