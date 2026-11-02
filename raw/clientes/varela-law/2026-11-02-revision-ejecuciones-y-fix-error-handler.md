---
tags: [forjado, cliente, varela-law, n8n, error-handler, zelle]
tipo: raw
cliente: Varela Law
fecha: 2026-11-02
---

# Revisión de ejecuciones 10-26 → 11-02 y fix del correo del ERROR HANDLER

Continuación de [[2026-11-02-texto-zap-loom-zain-y-traspaso-a-cuenta-varela]].

## Revisión (solo lectura)
- 109 ejecuciones n8n del 2026-10-26 al 2026-11-02, **todas `success`**. Agenda, borrador de avisos, facturas vencidas semanal (10-26 y 11-02), Token Manager, Zelle, contratos (10-26, 10-27 y dos el 10-29) y `zyPZ9H05SA4a3V9s` (Texto) corrieron con normalidad.
- El `ERROR HANDLER` (`mwmapzwppW-NTV4NwOhSq`) se disparó 3 veces, siempre por el **disparador de Outlook** de `TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK` (`BruqJ1jdEV9xl5zG`):
  - #2981, 10-27 06:53 UTC: `getaddrinfo EAI_AGAIN graph.microsoft.com` (DNS).
  - #2995, 10-28 09:18 UTC: 502 Bad gateway de Microsoft Graph.
  - #3019, 10-29 23:48 UTC: 502 Bad gateway de Microsoft Graph.
- Fueron errores pasajeros del lado de Microsoft o de la red, y el siguiente sondeo del trigger funcionó. Como el trigger de Outlook lee correos sin leer, **no se pierde ningún pago**. No hay que hacer nada.

## Bug encontrado y corregido
- El correo de alerta llegaba con "Mensaje de error: **undefined**" y un link a `undefined`. Cuando falla el trigger, n8n entrega el error en `$json.trigger.error` y no manda `$json.execution`, y el nodo `HTML` solo leía `$json.execution.error.message` / `$json.execution.url`.
- Fix: ahora usa `execution` y, si no existe, `trigger` (mensaje + descripción). Si no hay ejecución, enlaza al workflow (`https://n8n.srv957125.hstgr.cloud/workflow/<id>`) y dice que falló el disparador.
- Publicado: versión activa `1c25943f` (la anterior era `4d5b0444`). No se puede probar por MCP porque el Error Trigger no se ejecuta directo. Se verá con la próxima alerta real.

## Pendientes
- [ ] Ver que el próximo correo del ERROR HANDLER traiga el mensaje y el link correctos.
- [ ] (Opcional) Si los 502 de Graph siguen apareciendo, considerar no alertar errores transitorios del trigger de Outlook, porque hoy cada uno genera un correo.
