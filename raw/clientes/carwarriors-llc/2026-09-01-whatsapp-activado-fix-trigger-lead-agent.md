---
tags: [forjado, cliente, carwarriors, whatsapp, ghl, automation, bug]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-01
---

# 2026-09-01 — WhatsApp activado en GHL (Carwarriors LLC) + fix del trigger faltante en "Lead Agent - n8n"

## Contexto

Jorge confirmó que ya se pagaron los $10 USD/mes de WhatsApp Messaging en GHL para Carwarriors LLC (pendiente que veníamos arrastrando desde la sesión del 08-17). Captura mostró dos números: `+15557757668` (Default, Connected, quality Green) y `(786) 525-5946` (Pending). El pedido explícito de Jorge fue: "la prioridad es atender a los leads de whatsapp con el agente" — es decir, confirmar que el bot conversacional realmente responde a mensajes que llegan por ese canal.

## Acceso a GHL vía Playwright (nueva vía de login)

El bloqueo de Cloudflare de sesiones anteriores ya no aplicó esta vez (Jorge lo resolvió de su lado, no se investigó cómo). Login exitoso con:
- Usuario: `jcalderon900610@gmail.com`
- 2FA: GHL ofrece elegir entre código por SMS (a un número `+5******293`, no accesible) o **código por correo** a `jc*************@gmail.com` (el mismo Gmail de Jorge) — se usó la opción de correo, Jorge leyó el código de su bandeja y lo pasó por chat. El primer código expiró (pasó más de un minuto entre pedirlo y escribirlo), el segundo intento funcionó. Al escribir el código en los 6 inputs individuales del OTP, usar `fill` dígito por dígito en cada casilla -- escribir el string completo con `type` en la primera casilla no lo distribuyó bien y lo marcó como inválido.

**Nota de navegación**: esta cuenta es una agencia con Sub-Accounts (Carwarriors LLC, Rances Car, Car Express Servicess). `goto()` directo a rutas `/v2/location/{id}/...` devuelve 404 -- el SPA solo enruta bien por click interno. Flujo que funciona: `goto("https://app.gohighlevel.com/")` (aterriza en `/agency_dashboard`) → click en nav "Sub-Accounts" → en la lista, botón "Switch to Sub-Account" de la fila del cliente → ya dentro, nav lateral tiene "Automation" con su propio link a `/automation/workflows`.

## Hallazgo: el bot nunca iba a recibir mensajes de WhatsApp

El automation de GHL que dispara el webhook de n8n que alimenta a `PRINCIPAL` se llama **"Lead Agent - n8n"** (dentro de la carpeta "Agente AI" en Automations de Carwarriors LLC, Published, 764 inscritos). Su webhook (`#4 Custom Webhook`) apunta a `https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/webhook/lead-agent` -- confirmado que es el mismo endpoint que recibe el nodo `Webhook` de `PRINCIPAL` en n8n.

Antes del fix, este automation tenía **solo 2 triggers**, ambos "Customer replied":
- Reply channel is "Instagram DM"
- Reply channel is "Facebook messenger"

**No existía ningún trigger para WhatsApp, SMS, ni ningún otro canal.** Esto significa que aunque WhatsApp ya estuviera conectado y funcionando a nivel de número/Meta, GHL nunca iba a disparar el webhook hacia n8n cuando un lead escribiera por WhatsApp -- el bot simplemente nunca se enteraría del mensaje.

(Nota aparte, ya documentada en sesiones anteriores: el lado de n8n -- nodo `Create Body` en `PRINCIPAL` -- ya tenía la detección de canal `whatsapp` correctamente implementada desde antes, y `Parameter Type` ya resuelve el tipo de respuesta `'WhatsApp'` vía fallback de `lastMessageType`. El problema no era el código de n8n, era que GHL nunca iba a mandarle el mensaje.)

## Fix aplicado

Se agregó un tercer trigger al automation "Lead Agent - n8n": **Customer replied → filtro Reply channel = WhatsApp**, con la misma estructura que los otros dos (alimenta al mismo nodo `#4 Custom Webhook`). Guardado con "Save" -- el workflow ya estaba en estado Published desde antes, así que el guardado quedó live de inmediato (no hay paso de "Publish" separado como en n8n). Verificado reabriendo el automation después de navegar fuera y volver: los 3 triggers persisten y el status de la fila en la lista sigue siendo "Published".

## Hallazgo adicional sin investigar (pendiente)

Dentro de la misma carpeta "Agente AI" existen otros automations sin explorar todavía: `N8N`, `Red Social`, `Whatsapp` (Published, 8520 inscritos), `Whatsapp-Domingos` (Draft), `Whatsapp-Normal` (Draft). Los nombres sugieren que pudo haber automations de WhatsApp preexistentes de antes de este proyecto (posiblemente de una integración anterior tipo broadcast/campaña, no relacionados con el bot conversacional actual) -- no se abrieron, no se sabe si están activos o si conviene limpiarlos. También existe un automation suelto "Resolver Token WhatsApp – AutosMiami" fuera de esta carpeta, nombre que no corresponde a Carwarriors/Rances (posible automation de otro cliente/location compartido en la misma agencia, revisar con cuidado antes de tocar nada).

## Pendiente inmediato

- **Verificar lo mismo en Rances Car**: por la regla de "todo cambio a los 2 agentes", falta confirmar si Rances Car también tiene WhatsApp activo en GHL y si su automation equivalente (probablemente también en una carpeta similar) tiene el trigger de WhatsApp. No se llegó a revisar -- la sesión se cortó aquí a pedido de Jorge.
- Probar con un mensaje real de WhatsApp entrante a Carwarriors LLC para confirmar end-to-end que el bot ahora sí responde (no se hizo prueba en vivo todavía, solo se confirmó la configuración).
- Decidir qué hacer con los automations legacy sin explorar (`Whatsapp`, `Whatsapp-Domingos`, `Whatsapp-Normal`, `Resolver Token WhatsApp – AutosMiami`) -- podrían estar interfiriendo o ser ruido muerto.
