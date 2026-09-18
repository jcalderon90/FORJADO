---
fecha: 2026-09-18
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, blindaje-global, errorworkflow, bsonerror, resiliencia, produccion]
---

# 2026-09-18 — Auditoría y Blindaje Global de la Instancia n8n

## Resumen Ejecutivo

A raíz del incidente de `BSONError` en los workflows principales, se ejecutó una auditoría exhaustiva sobre los 18 workflows de la instancia de n8n para prevenir fallos futuros similares, identificar condiciones frágiles y eliminar puntos ciegos de observabilidad.

---

## Hallazgos y Correcciones Aplicadas en Producción

### 1. Blindaje de `_id` y Buffers BSON en Flujos de Calendario (`RSVP` y `RSVP - Rances Car`)
* **Diagnóstico:** Los nodos `Mongo Cancelar Cita`, `Mongo Guardar GHL Event ID` y `Mongo Revertir Confirmacion` actualizan por `_id`. En `Decidir Accion Calendario` y `Preparar Cancelacion Mongo`, si `Insert Appointment` generaba un objeto con buffer (`{ buffer: ... }`), `.toString()` producía `"[object Object]"`, lo que provocaba un fallo idéntico de `BSONError`.
* **Solución:** Se implementó una función pura `extractHex(val)` capaz de resolver de forma segura:
  - Strings hexadecimales puros y entrecomillados.
  - Buffers de bytes de MongoDB (`{ buffer: { ... } }`) mapeados a 24 caracteres hex.
  - Instancias de `ObjectId` con `.toHexString()`.
  - Objetos inválidos (`[object Object]`) $\rightarrow$ retorna `null` para evitar exceptions en el driver BSON.

### 2. Blindaje de Tipos Booleanos Estrictos (`COMENTARIOS-MANYCHAT`, `LEAD - COLLECTOR`, `SEND - MEDIA`)
* **Diagnóstico:** n8n v2 en modo `typeValidation: "strict"` aborta la ejecución si una condición booleana recibe un valor `undefined` o `""` con el error: `Wrong type: '' is a string but was expecting a boolean`.
* **Solución:** Se forzó el casteo explícito con doble negación (`!!`):
  - `COMENTARIOS-MANYCHAT`: `Interés Real?` $\rightarrow$ `={{ !!$json.output?.es_interes_real }}`.
  - `LEAD - COLLECTOR`: `Nuevo Match Multi-Dealer?` $\rightarrow$ `={{ !!$json.nuevoMatchCrossDealer }}`.
  - `SEND - MEDIA`: `IF Media Disponible` $\rightarrow$ `={{ !!$json.media_disponible }}`.

### 3. Activación Universal de Observabilidad (`errorWorkflow: "ypd1lxqlsa5KXsoy"`)
* **Diagnóstico:** Solo 2 workflows tenían configurado el manejador centralizado de errores. Los otros 15 fallaban silenciosamente sin notificar al canal `#notificaciones` de Slack.
* **Solución:** Se vinculó y publicó `errorWorkflow: "ypd1lxqlsa5KXsoy"` en todos los workflows productivos activos:
  1. `COMENTARIOS-MANYCHAT` (`07BgeGy4vukFJDlu`)
  2. `SEGUIMIENTO SALIENTE - Cadencia 24h` (`Fh4fB5Cgk1hchvxe`)
  3. `RSVP` (`2trw9S1LM8ttZlFb`)
  4. `RSVP - Rances Car` (`lFiO37FkvMmGUsdi`)
  5. `LEAD - COLLECTOR` (`4r00JFnCyoUpZgXU`)
  6. `KB - SEARCH` (`oB2bc9YTIpXqt5zH`)
  7. `SEND - MEDIA` (`Gq8DaJm0kr7L4DSu`)
  8. `DealerCenter -> Mongo -> GHL (Lead Sync)` (`EIF9ufLxqoFWZtQ0`)
  9. `Subir a DealerCenter` (`ZxcF7cmf3V8FZabx`)
  10. `SLACK - INBOUND` (`xRRGjidR0rckn3R7`)

---

## Estado Final
* 10 workflows actualizados y publicados en producción vía MCP.
* 10 archivos locales sincronizados y validados.
* Cobertura de alertas de error en Slack al 100% de los workflows activos.
