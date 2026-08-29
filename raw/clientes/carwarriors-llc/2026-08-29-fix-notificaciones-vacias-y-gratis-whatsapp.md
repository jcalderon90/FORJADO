# 2026-08-29 — Fix: notificaciones de Slack con datos de lead vacíos + 422 en rama GRATIS + parsing roto en KB-SEARCH

**Contexto:** Jorge compartió capturas de Slack con 3 errores llegando al canal `notificaciones`: (1) `KB - SEARCH` error de tipo en el nodo `RESPONSE`, (2) `PRINCIPAL` error 422 "Missing phone number" en `GRATIS - Send GHL`, (3) `SEND GHL MESSAGE` fallando con `CONTACT_NOT_FOUND` para un lead (Douglas Egan). Además, varios "🔥 Nuevo lead registrado" con Nombre/Teléfono/Correo en "No registrado" y Canal "unknown". Pidió arreglarlo todo y dejarlo funcionando, no solo diagnosticar.

## 1. `KB - SEARCH` → nodo `RESPONSE` (type conversion error)

`GENERAL AGENT` (agente LangChain sin output parser conectado) a veces antepone texto de razonamiento del modelo antes del JSON pedido (`"length max 500 chars. This is fine... Let's produce.{...}"`), rompiendo el `JSON.parse` implícito del Set node tipo `object`. Fix: la expresión de `RESPONSE` ahora extrae el bloque `{...}` del texto crudo con regex (`/\{[\s\S]*\}/`) y lo parsea, con fallback seguro (`response` = texto crudo truncado a 500 chars, `escalate: false`) si no hay JSON válido. Publicado (`oB2bc9YTIpXqt5zH`).

## 2. `GRATIS - Send GHL` → 422 `CONVERSATIONS_MSG_NO_PHONE`

El nodo `GRATIS - Respuesta` (construido el 2026-08-27, ver `2026-08-27-guardrail-expectativa-gratuita.md`) decía replicar el mapeo de canal del flujo normal pero en realidad solo cubría instagram/messenger/sms y **caía a `WhatsApp` hardcodeado** en cualquier otro caso (incluyendo `channel: "unknown"`, el caso real de un lead de Facebook sin teléfono). Fix: mismo fallback robusto que usa `Parameter Type` — si no matchea canal conocido, consulta `Check GHL Last Message` (ya ejecutado antes en el flujo) y mapea `lastMessageType` real de GHL a FB/IG/SMS/Email/WhatsApp, con `Live_Chat` como default seguro (nunca WhatsApp a ciegas). Aplicado y publicado en **ambos dealers** (`PRINCIPAL` `Kif9lWwDHvR7TT39` y `PRINCIPAL - Rances Car` `N68IYzm4Bf6AVTXP`).

## 3. Notificaciones con Nombre/Teléfono/Correo siempre "No registrado" — bug real, no comportamiento esperado

Causa raíz confirmada leyendo código: los 3 nodos `'Notifications Master' Nuevos Leads / Escalation / Interés Precios` leían `$('Parse response').first().json.lead_nombre` / `.lead_telefono` / `.lead_correo` — **campos que nunca existen**. El agente `PRINCIPAL` nunca fue diseñado para devolver esos campos (su `estado_lead` solo tiene city/interes_vehiculo/metodo_pago/timing_compra/idioma_preferido/resumen_ai) y `Parse response` nunca los mapea. Por diseño, esos `|| 'No registrado'` se disparaban siempre, sin importar qué tan identificado estuviera el lead.

**Fix:** se agregó un nodo nuevo `Get Contact Info` (`GET /contacts/{contactId}` de GHL, mismo patrón de auth por header que `Check GHL Last Message`, conectado en paralelo desde `Find User`) que trae el contacto real de GHL. Los 3 nodos de notificación ahora arman:
- `nombre_lead`: `contact.name` → `contact.firstName` → `contactName` del webhook entrante → `'No registrado'`
- `telefono_lead` / `correo_lead`: `contact.phone` / `contact.email` → `'No registrado'` (legítimo si el canal es FB/IG y GHL no tiene esos datos)
- `canal`: mismo fallback real vía `Check GHL Last Message` (no el `input_channel` crudo, que a veces llega literal `"unknown"` porque el webhook de origen no manda el campo — el "channel/locationId payload gap" ya documentado en la migración n8n).

Aplicado y publicado en **ambos dealers**.

## Bug propio encontrado al aplicar el fix (corregido antes de dar por bueno)

La primera vez que se agregó `Get Contact Info` en `PRINCIPAL`, los campos `onError`/`retryOnFail` no se guardaron (no son parte del schema de la operación `addNode` del MCP de n8n, se descartaron en silencio). Sin esto, un contacto no encontrado en GHL (caso real, ya visto con Douglas Egan) habría hecho fallar **toda la ejecución** de `PRINCIPAL` en vez de solo devolver `'No registrado'`. Se corrigió con una operación `setNodeSettings` separada y se volvió a publicar. En Rances Car se aplicó correctamente desde el primer intento (mismo batch, con `setNodeSettings` incluido).

## Verificación con tráfico real (contactId sintético `test_verify_fix_*`, no reservado en GHL)

- **CW (`PRINCIPAL`):** ejecución completa "success"; `Get Contact Info` y `Check GHL Last Message` fallaron con gracia (contacto no existe) sin tumbar el flujo.
- **Rances Car (`PRINCIPAL - Rances Car`):** primer intento con mensaje "Hola, busco un carro" terminó en `status: error` — pero el error fue **"Max iterations (10) reached"** en el nodo `PRINCIPAL` (el agente conversacional principal, no tocado por este fix), no relacionado a los nodos modificados. Segundo intento con mensaje simple ("Hola, busco un Mustang", igual al que funcionó en CW) completó "success" de punta a punta, con `Get Contact Info`/`Check GHL Last Message` fallando con gracia igual que en CW.

**Pendiente / a vigilar:** el "Max iterations" en Rances Car parece un artefacto de probar con contactId falso (todas las llamadas a GHL fallan y el agente reintenta herramientas), pero no se descarta del todo que sea un problema real de ese clon — revisar si vuelve a aparecer con tráfico real.

**Pendiente sin tocar:** `Douglas Egan` / contactId `miIgUJmHaO5aJ7kF5FKA` con `CONTACT_NOT_FOUND` en GHL — no es bug de workflow, requiere buscar manualmente en GHL/DealerCenter y decidir si recrear el contacto o vincular el ID correcto.

**Housekeeping:** las copias locales del repo en `n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL.json`, `KB-SEARCH.json` y `NOTIFICATIONS.json` (esta última aún no tocada hoy, pero ya estaba stale desde antes) quedaron desactualizadas por estos cambios — re-exportar antes de la próxima edición, mismo patrón que ya se veía con RSVP.json.
