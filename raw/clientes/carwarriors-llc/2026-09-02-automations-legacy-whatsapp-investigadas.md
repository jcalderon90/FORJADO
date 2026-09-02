---
tags: [forjado, cliente, carwarriors, ghl, automation, whatsapp, legacy, investigacion]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — Automations legacy de "Agente AI" (GHL) investigadas: ninguna interfiere con el bot actual

**Contexto:** pendiente abierto desde el 09-01 (ver [[2026-09-01-whatsapp-activado-fix-trigger-lead-agent]]) — la carpeta "Agente AI" en Automations de Carwarriors LLC tenía varios workflows sin explorar, sin saber si interferían con el bot n8n en producción. Se investigó cada uno vía Playwright + CDP (login con `jcalderon900610@gmail.com`, 2FA por email).

## Hallazgo: la carpeta tiene 6 automations, no 4

El pendiente original solo mencionaba `Whatsapp`, `Whatsapp-Domingos`, `Whatsapp-Normal` y el suelto `Resolver Token WhatsApp – AutosMiami`. En vivo la carpeta "Agente AI" tiene 6: esos 4 más **`Lead Agent - n8n`** (el trigger real y correcto, ya documentado) y **`N8N`** (no documentado antes, Published, con tráfico activo).

## Cada uno, en detalle

**`N8N`** (Published, 828→2266 total enrolled, **6 activos ahora mismo**) — Trigger: Customer Replied, canal "Facebook Messenger" O "Instagram DM" (los mismos 2 canales que `Lead Agent - n8n`). Acción única: Custom Webhook POST a `https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/webhook/d7cd6008-dc30-4ec4-827d-58e009a39a09/carwarriors-lead-intake`. Verificado vía MCP de n8n (`search_workflows` query "LEAD"): ese webhook pertenece a **"Carwarriors - Agente de Captura de Leads (GHL + Mongo)"** (id `6QGLivaPilh09R21`), que tiene `active: false` — desactivado en la auditoría de producción del 2026-08-20 (ver `carwarriors-auditoria-produccion-2026-08-20`). Conclusión: cada vez que un lead responde por Messenger/IG, GHL dispara esta automation vieja además de la nueva, pero el POST cae en un webhook muerto (404 del lado de n8n) — no duplica al bot, solo genera ruido/logs de error inútiles.

**`Red Social`** (Published, 7136 total, **1 activo ahora mismo**) — Mismo par de triggers (Messenger + IG DM). Condición por tag: 4 branches "Tags does not include 'social...'" + rama "None". Revisado Execution logs en vivo: **corrió hoy mismo (2 veces, 9:37-9:38am, contacto "alex")** y en ambas cayó en la rama "None" (ningún tag coincide) → termina sin ninguna acción. Confirmado con el diagrama: la rama "None" va directo a END, no tiene la acción "Update Conversation AI Bot" que sí tienen las otras 4 ramas. Cero efecto práctico.

**`Whatsapp`** (Published, 8520 total, 0 activos) — Trigger: Customer Replied, canal "SMS" (no es un canal que el bot use). Condición por tag "whatsapp" + día de la semana → 4 branches, cada una termina en "Update Conversation AI Bot and Status" (reactivar bot nativo, id `gVKgcA7UScwA2hdB3kfW`) + Add/Remove Tag. Ese bot nativo de GHL **ya fue borrado por completo el 2026-08-27** (ver `2026-08-27-bot-viejo-ghl-alucino-tesla`) — la acción, si corriera, fallaría contra un bot inexistente. Execution logs: **"No logs found" en los últimos 30 días** — no ha corrido nunca en ese período. Dormant y con acción muerta.

**`Whatsapp-Domingos`** (Draft, 2009 total) y **`Whatsapp-Normal`** (Draft, 25480 total) — GHL no ejecuta workflows en estado Draft bajo ninguna circunstancia, sin importar el trigger o las acciones configuradas. Riesgo cero mientras sigan en Draft. (El total enrolled alto en `Whatsapp-Normal` sugiere que tuvo tráfico real en algún momento antes de pasar a Draft — no se investigó cuándo ni por qué.)

**`Resolver Token WhatsApp – AutosMiami`** (Published, 36180 total, 0 activos, fuera de la carpeta) — Trigger: Customer Replied, canal "SMS". Condición: "Replied message" contiene "#" → Webhook POST a **`https://autosmiami.net/ghl/resolve`** (dominio externo confirmado, no es Carwarriors ni Rances Car — nombre real de otro negocio/cliente). Es resto de un snapshot/template clonado en algún momento, nunca limpiado. Execution logs: **"No logs found" en los últimos 30 días**. Dormant.

## Conclusión

Ninguna de las 6 automations de la carpeta "Agente AI" (ni el suelto de AutosMiami) interfiere con el bot n8n actual (`LEAD - COLLECTOR` / `PRINCIPAL` / `PRINCIPAL - Rances Car`, disparado por `Lead Agent - n8n`). Las que están Published y sí disparan en los mismos canales (`N8N`, `Red Social`) caen en callejones sin salida (webhook muerto / rama vacía) sin generar mensajes duplicados al lead ni tocar el flujo real. Las demás están dormidas (0 ejecuciones en 30 días) o en Draft (no ejecutan).

**No se tocó nada** — no se borró, desactivó ni modificó ninguna de estas automations, solo se inspeccionaron.

## Pendiente opcional (no urgente)

Limpieza de bóveda técnica: estas 6 automations siguen "Published"/con enrollment alto ocupando espacio y generando ruido de ejecuciones fallidas silenciosas (`N8N` cada vez que alguien responde por Messenger/IG). Se podría, cuando haya tiempo:
- Pasar `N8N` y `Whatsapp` a Draft o borrarlas (ya confirmado que no hacen nada útil).
- Preguntarle a Jorge González si sabe algo de "AutosMiami" antes de tocar esa — aunque está dormida, más vale confirmar antes de borrar por si hay alguna razón de negocio que no se ve desde aquí.
- No es bloqueante para nada del bot actual, es solo higiene.
