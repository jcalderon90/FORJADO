---
tags: [forjado, cliente, varela-law, slack, n8n, zelle, notificaciones]
tipo: raw
cliente: Varela Law
fecha: 2026-10-13
---

# Slack `#notifications`: notificaciones de Zelle (APLICADO y publicado 2026-10-13)

Continuación de [[2026-10-12-slack-canales-reportes-y-notificaciones-plan]]. Jorge autorizó el cambio el 2026-10-13 (el primer intento fue denegado por el permiso de la sesión). **Aplicado con `update_workflow` (17 nodos) y publicado**: nueva versión activa `b8832240-9c4a-4894-a331-51f8a81eac80` (antes `e76e3483`). Sin probar con un correo real todavía.

## Qué se añadió

Dos nodos `n8n-nodes-base.slack` v2.7 (`message` / `post`, `authentication: oAuth2`, credencial `Contract-Bot API` id `5bUVEWUx8gg0dMmT`, canal `#notifications` = `C0C8PAVAUMQ`, `includeLinkToWorkflow: false`, `onError: continueRegularOutput` para que un fallo de Slack no afecte el registro):

1. **`Notificar Zelle registrado`**, conectado a la salida de `Update a message` (posición [1184, -336]). Texto: `:moneybag: *Zelle registrado* — {senderName} · {amount} · {bank}`, más fecha, transacción, memo y la pestaña del Sheet (datos de `$('If').item.json.extracted` y `$('Edit Fields').item.json.sheetName`).
2. **`Notificar Zelle revision manual`**, conectado a la salida de `Send a message` (el Gmail a Jorge, posición [288, -144]). Texto: `:warning: *Zelle para revisar a mano* — {senderName} · {amount} · {bank}`, la transacción y la aclaración de que no se registró nada.

Después de aplicarlo: publicar el workflow (la versión activa es `e76e3483`; el borrador `8c90f28f` no tiene nodos distintos, solo perdió el evento fijado). Probar con la siguiente ejecución real de Zelle: no se puede ejecutar por MCP (trigger de Outlook).

## Pendiente

- [x] Cambio autorizado, aplicado y publicado. [ ] Comprobar con el próximo Zelle real que aparece en `#notifications` (o revisar la ejecución: el nodo Slack con `onError: continueRegularOutput` falla en silencio).
- [x] Contratos: **Jorge decidió dejarlo como está** (2026-10-13): `CONTRACTS FROM SLACK` sigue avisando solo a `new-contracts`.
- [ ] Texto: se conecta cuando se resuelva la caducidad de la conexión en Zapier.
