---
tags: [forjado, cliente, carwarriors, n8n, chequeo-salud, dealercenter, ghl]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-05
---

# 2026-09-05 — Chequeo de salud: bots atendiendo bien en producción, sync GHL↔DealerCenter sano, y confirmación real del fix de timeout de OpenRouter

**Contexto:** Jorge pidió revisar (1) que los agentes de Carwarriors estén atendiendo bien a los clientes y (2) que la sincronización GHL↔DealerCenter esté funcionando. Auditoría hecha vía MCP `n8n-carwarriors` (recién reconectado esta sesión) contra ejecuciones reales.

## Bots conversacionales (PRINCIPAL, ambos dealers)

- **`PRINCIPAL` (Carwarriors LLC, `Kif9lWwDHvR7TT39`):** 74 ejecuciones desde el 2026-09-03, todas `success` salvo el caso de abajo. Tráfico real y constante (última ejecución a las 22:06 UTC de hoy).
- **`PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`):** 17 ejecuciones desde el 2026-09-03, **0 errores**.
- **`LEAD - COLLECTOR`** (subworkflow compartido, `4r00JFnCyoUpZgXU`): 56 invocaciones desde el 09-03, **1 solo error** (ver hallazgo clave abajo).
- **`RSVP`, `RSVP - Rances Car`, `KB - SEARCH`:** 0 errores desde el 2026-09-01.
- Sin ejecuciones colgadas/`waiting`/`running` en ninguno de los 2 bots principales al momento del chequeo.

## Hallazgo clave — confirmación real del fix de timeout de OpenRouter (pendiente abierto desde el 09-03)

El pendiente "confirmar en producción, ante un stall real de OpenRouter, que el timeout corto evita el bloqueo de 10 min al lead" **quedó confirmado con un caso real**, no solo con la prueba sintética del 09-03:

- **Ejecución `4339`** de `LEAD - COLLECTOR` (2026-09-03, 15:21:48 UTC) — lead real de Carwarriors LLC (mensaje "Para trabajar"), nodo `Lead Agent` → `OpenRouter Chat Model`: **`Request timed out.` a los 60005ms exactos** (el límite configurado, `timeout: 60000` visible en los parámetros reales del nodo en esa ejecución) — confirma que el fix del 09-03 estaba activo y actuó como se diseñó, cortando a los 60s en vez de colgar 10 minutos.
- **La ejecución padre (`4337`, `PRINCIPAL`) terminó en `success`**, con duración total de **2 min 28 s** (15:21:08 → 15:23:36) — el lead sí recibió respuesta, con una demora corta y acotada, no el bloqueo de 10 min que causaba el bug original.
- La alerta de error llegó correctamente a Slack y a email (vía `ERROR HANDLER`, ejecución `4340`) con el detalle real (`Request timed out.`, nodo `Lead Agent`, link a la ejecución) — el equipo se enteró en tiempo real.
- **Se confirmaron también los 4 timeouts pre-fix ya documentados** (09-02 12:38, 09-02 17:13, 09-02 20:36, 09-03 02:40 — todos exactamente ~10:00 min de duración, consistente con el bug original antes del fix) — nada nuevo ahí, solo se re-verificó que coinciden con lo ya registrado.
- **Cero errores de timeout desde el 09-03 15:22** hasta ahora (09-05) — el caso real fue aislado, no un patrón recurrente.

**Conclusión: el pendiente queda cerrado.** El fix de timeout corto no solo funciona en pruebas sintéticas — ya actuó ante un stall real de producción, acotando el impacto de 10 min a bajo 2.5 min totales.

## Sincronización GHL ↔ DealerCenter

- **`Subir a DealerCenter`** (GHL → DealerCenter, `ZxcF7cmf3V8FZabx`): 366 ejecuciones desde el 2026-09-01, **0 errores**.
- **`DealerCenter -> Mongo -> GHL (Lead Sync)`** (`EIF9ufLxqoFWZtQ0`): corrió todos los días desde el 08-29 hasta hoy (09-05) a las 12:30 UTC, **todas `success`**, sin huecos — el reporte diario "FORJADO Lead Sync" de DealerCenter sigue llegando y procesándose con normalidad.

## Conclusión general

Ambos frentes que pidió Jorge están sanos hoy: los bots atienden tráfico real sin errores nuevos (salvo el timeout ya explicado y ya resuelto), y el sync bidireccional GHL↔DealerCenter corre sin fallos en la ventana revisada (09-01 a 09-05).

## Pendiente real

- Ninguno nuevo. Se cierra el pendiente de confirmación del fix de timeout de OpenRouter (ver [[2026-09-03-timeouts-openrouter-lead-collector-fix]]).

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-03-timeouts-openrouter-lead-collector-fix]]
