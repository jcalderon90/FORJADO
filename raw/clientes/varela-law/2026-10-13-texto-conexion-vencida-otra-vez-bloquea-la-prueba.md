---
tags: [forjado, cliente, varela-law, zapier, texto, bloqueo]
tipo: raw
cliente: Varela Law
fecha: 2026-10-13
---

# Texto: la conexión en Zapier se venció otra vez (~19-20 h); la prueba del Zap no se envió

Continuación de [[2026-10-13-texto-mario-deja-el-nombre-del-agente]] y [[2026-10-12-texto-conexion-reconectada-y-zelle-reproceso]].

## Qué se hizo

- Se abrió el editor del Zap `383180348` en el navegador automatizado (esta vez sí cargó) y se abrió el paso 2 (`Create Lead`).
- **El editor marca la conexión `Mario Varela - Mario Varela Law Firm` como vencida** ("This account connection is expired"); `Test step`, `Test run` y `Publish` deshabilitados.
- `list_zapier_connections` (Texto, `App229472CLIAPI`): `last_refreshed_at` = 2026-10-12 19:49:47 UTC (2:49 PM CT), **sin ningún refresco posterior**; `is_stale: false` (el MCP no ve el vencimiento, igual que el 10-12).
- **No se envió ningún SMS** ni se cambió nada en el Zap (borrador, apagado).

## Hallazgo

Dos vencimientos seguidos con el mismo patrón: creada 10-11 7:21 PM CT → vencida a las ~19 h; reconectada 10-12 2:49 PM CT → vencida a las ≤20 h (vista 10-13 ~10:40 AM CT). Zapier nunca refrescó el token. Descarta la hipótesis (3) del 10-12 (fallo del editor) y la (2) (Mario cerrando sesión) como causa principal: la autorización de Texto parece durar menos de un día y no se renueva sola. **Un Zap activo dejaría de mandar SMS sin avisar.** No activar el Zap mientras no se resuelva.

## Qué sigue

- Reconectar requiere la sesión de Texto de Mario (Jorge no la tiene). Para la prueba basta una reconexión, pero para producción hay que arreglar la causa.
- Soporte de Texto debe responder cómo mantener viva la conexión (refresh token, otra vía de entrada de leads sin Zapier: webhook/API/correo). Texto del mensaje (de Mario): [[mensajes/consulta-soporte-texto-2026-10-13]]. Mensaje a Mario: [[mensajes/mensaje-mario-2026-10-13-nombre-conexion-texto-y-soporte]] (borrador, **no enviado**; falta pegar el `reconnect_url` vigente).
- Si soporte no da solución: alternativa a evaluar, que el workflow n8n entregue los leads a Texto por otra vía (webhook/API) en vez de Zapier, o aceptar una reconexión diaria (no viable en producción).

## Pendientes

- [ ] Enviar a Mario el mensaje (reconexión + soporte).
- [ ] Mario reconecta -> `Test step` en el paso 2 (un SMS a `+18327158757`).
- [ ] Respuesta de soporte de Texto sobre la caducidad; decidir Zapier vs otra vía.
- [ ] No activar el Zap ni publicar el workflow n8n `zyPZ9H05SA4a3V9s` hasta resolver la caducidad.
