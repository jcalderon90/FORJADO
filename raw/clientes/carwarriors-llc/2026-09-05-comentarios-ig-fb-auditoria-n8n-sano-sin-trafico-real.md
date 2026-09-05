---
tags: [forjado, cliente, carwarriors, manychat, comentarios-ig-fb, n8n]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-05
---

# 2026-09-05 — Comentarios IG/FB: n8n confirmado sano, pero siguen 5 días sin ningún tráfico real

**Contexto:** continuación de [[2026-08-31-comentarios-ig-fb-manychat-flow-publicado]]. Se reconectó el MCP `n8n-carwarriors` en esta sesión (estaba caído/no conectado) para poder auditar el estado real del workflow `COMENTARIOS-MANYCHAT` (id `07BgeGy4vukFJDlu`).

## Qué se encontró

- **Historial de ejecuciones antes de esta sesión:** solo 5 en total, todas del 08-30/08-31 (3 manuales + 1 "Probar Solicitud" de cada día) — ninguna nueva entre el 2026-08-31 (publicación en LIVE) y hoy (2026-09-05). 5 días completos sin que llegue un solo comentario real de Instagram/Facebook.
- **Se confirmó que el workflow sigue activo y sin cambios** (`versionId` idéntico al del 08-31, `updatedAt: 2026-08-31T18:45:57.934Z`).
- **Prueba sintética directa al webhook de producción** (`curl` a `https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/webhook/manychat-comentario-clasificar`, simulando el payload real que manda ManyChat con un comentario de intención de compra): **200 OK**, clasificó `es_interes_real: true` e `idioma` correctamente, generó `respuesta_publica`/`respuesta_dm` bien. Quedó registrada como ejecución `4609` en n8n. **Conclusión: el lado de n8n está sano hoy, no es la causa del silencio.**

## Lo que no se pudo auditar desde esta sesión

- La configuración real del trigger en el Flow Builder de ManyChat (si sigue apuntando a "cualquier post/reel, cualquier comentario" y si la Solicitud Externa sigue con la URL correcta) — **no hay perfil de Playwright guardado para ManyChat** (a diferencia de GHL/DealerCenter, que sí tienen sesión persistida), y no hay credenciales de ManyChat documentadas en la bóveda. Auditarlo requeriría a Jorge operando la UI en vivo, como en sesiones anteriores.
- Si hubo comentarios reales (de cualquier tipo) en publicaciones de IG/FB de Carwarriors o Rances Car en estos 5 días — no se tiene el handle de las páginas ni acceso para verlo desde acá. Se le preguntó directamente a Jorge; no lo sabe, queda pendiente que lo revise.

## Diagnóstico y siguiente paso recomendado

Con el lado de n8n descartado como causa, quedan 2 hipótesis sin resolver:
1. Simplemente no hubo comentarios reales con volumen suficiente en 5 días (sin bug, solo falta de tráfico orgánico para probar).
2. El trigger de ManyChat no está capturando comentarios reales (config real distinta a la documentada, o problema de permisos/API de Meta del lado de ManyChat).

**Se le indicó a Jorge revisar 2 cosas concretas para desempatar:**
- ManyChat → Automation → Flows → abrir "Respuesta Comentarios" → pestaña de Analytics/estadísticas → ver cuántos contactos entraron (triggered) en los últimos 5-7 días. Si es 0, el trigger no está capturando nada (o no hubo comentarios) — revisar el Paso 1 del trigger. Si es >0 pero n8n sigue en 0, la Solicitud Externa está fallando silenciosamente del lado de ManyChat.
- Alternativa más simple: mirar directo las publicaciones recientes de IG/FB de ambos dealers y contar cuántas tienen comentarios.

## Pendiente real

- [ ] Esperar que Jorge revise ManyChat Analytics o los posts reales y reporte qué encontró.
- [ ] Si el conteo de ManyChat es >0 pero n8n sigue en 0: sesión conjunta (Jorge + Claude vía Playwright) para auditar la Solicitud Externa del Flow en vivo.
- [ ] Si no hubo comentarios en absoluto: no hay bug, solo queda esperando tráfico orgánico — sin acción nueva.

## Relacionado

- [[carwarriors-llc]]
- [[2026-08-31-comentarios-ig-fb-manychat-flow-publicado]]
- [[2026-08-30-manychat-external-request-confirmado]]
