---
tags: [forjado, cliente, varela-law, zapier, texto, decisiones]
tipo: raw
cliente: Varela Law
fecha: 2026-10-12
---

# Texto: conexión vencida en Zapier y pedido de Mario de no usar nombre

Continuación de [[2026-10-11-texto-respuestas-de-mario-celular-y-decisiones]]. Texto literal del mensaje de Mario en [[mensajes/respuesta-mario-2026-10-12-sin-nombre-y-prueba-ahora.txt]].

## Qué dijo Mario (2026-10-12)

- **Sin nombre en el agente:** prefiere que el SMS no use nombre propio ("Albert") porque, si el lead contesta a las 2 AM, "va a verse muy falso". Esto responde la duda abierta del 10-11 sobre si el nombre era intencional: **no lo es / no lo quiere**.
- **Prueba:** "puedes mandar la prueba ahora" — autoriza el `Test step` del Zap (un SMS a su propio celular).

## Qué se intentó y qué pasó

- El nombre "Albert" sale del **agente configurado en Texto**, no del Zap (el Zap solo manda nombre, apellido, teléfono y email). **No se puede quitar desde Zapier**; hay que cambiarlo dentro de Texto (si Mario tiene acceso a la configuración del agente) o pedírselo a soporte de Texto. Hacerlo antes de activar el Zap.
- Se abrió el editor del Zap `383180348` en el navegador (la sesión de Zapier había caducado; Jorge volvió a iniciar sesión). Zap sin cambios: borrador, apagado.
- **Paso 2 (`Create Lead`) bloqueado:** el editor muestra la conexión `Mario Varela - Mario Varela Law Firm` en rojo, *"This account connection is expired. You'll need to reconnect the account before continuing"*; `Test step` y `Publish` quedan deshabilitados. **No se envió ningún SMS.**
- Estado de la conexión según el MCP (`list_zapier_connections`): creada `2026-10-12T00:21:12Z` (~7:21 PM del 10-11 en Texas), último refresco `00:21:14Z` (nunca se renovó), `is_stale: false`. Las dos vistas no coinciden (el editor dice vencida, el MCP no). Antigüedad al momento de verla: ~19 h.
- **Causa no confirmada.** Hipótesis: (1) la autorización de Texto dura poco y Zapier no logra renovarla; (2) Mario cerró sesión, cambió la contraseña o revocó accesos en Texto; (3) fallo del editor al leer el estado. Si es la (1), un Zap activo dejaría de enviar SMS sin avisar.
- Reconectar requiere iniciar sesión en la cuenta de Texto de Mario, que Jorge no tiene. Jorge le envió a Mario el enlace de reconexión (`reconnect_url` del MCP) y le preguntó si cerró sesión o cambió algo en Texto. Pendiente su respuesta.

## Pendientes

- [ ] Mario reconecta Texto. Luego revisar en el editor si el paso 2 queda verde; si sigue rojo, `Reconnect this account` en el propio paso 2 con la sesión de Zapier de Mario.
- [ ] `Test step` del paso 2 (un SMS a `+18327158757`; avisar a Mario de la hora). Dejar el Zap apagado.
- [ ] Comprobar si la conexión sigue verde ~24 h después de reconectar; si vuelve a vencerse en menos de un día, escribir a soporte de Texto antes de activar nada.
- [ ] Quitar el nombre "Albert" de la presentación del agente en Texto (Mario o soporte). Ojo: el SMS de la prueba todavía puede salir firmado así.
- [ ] Sin cambios: publicar el workflow n8n `zyPZ9H05SA4a3V9s` al final; revisar el plan al terminar la prueba Professional (~2026-10-22).
