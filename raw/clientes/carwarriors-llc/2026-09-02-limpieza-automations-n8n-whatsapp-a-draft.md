---
tags: [forjado, cliente, carwarriors, ghl, automation, whatsapp, legacy, limpieza]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — Limpieza: `N8N` y `Whatsapp` pasadas a Draft en la carpeta "Agente AI"

**Contexto:** siguiendo el hallazgo documentado en [[2026-09-02-automations-legacy-whatsapp-investigadas]] (ambas automations confirmadas inofensivas pero con ejecuciones fallidas silenciosas/ruido), Jorge pidió avanzar con la limpieza opcional pendiente.

## Acción realizada

Vía Playwright + CDP (login persistido con `jcalderon900610@gmail.com`, sin necesidad de 2FA — sesión ya activa), en Carwarriors LLC → Automation → Workflows → carpeta "Agente AI":

- **`N8N`** (Published → **Draft**): disparaba en Messenger/IG hacia un webhook de n8n ya desactivado desde el 08-20 (404 silencioso). Pasada a Draft — deja de dispararse, sin borrar nada (reversible desde la misma UI si hiciera falta).
- **`Whatsapp`** (Published → **Draft**): su única acción reactivaba un bot nativo de GHL que ya fue borrado por completo el 08-27 — acción que fallaría contra un recurso inexistente si llegara a correr. Pasada a Draft.

Ambas confirmadas visualmente en la lista tras el cambio (columna Status = Draft, Last updated actualizado a Sep 02 2026).

## No tocado (a propósito)

- **`Red Social`**: sigue Published — su rama activa ("None") ya termina en END sin ninguna acción, cero riesgo real, no ameritaba el cambio.
- **`Whatsapp-Domingos` / `Whatsapp-Normal`**: ya estaban en Draft de antes.
- **`Resolver Token WhatsApp – AutosMiami`** (fuera de la carpeta): sin tocar — pendiente confirmar con Jorge González si hay alguna razón de negocio antes de tocarla, según lo ya documentado.

## Nota técnica de la sesión

El micro-frontend de Workflows de GHL (`client-app-automation-workflows.leadconnectorhq.com`) devolvió 404 en varios intentos de carga consecutivos antes de renderizar — no fue un problema de login ni de permisos, simplemente tardó en cargar (varios reintentos de ~10-15s cada uno). Si se repite en el futuro, esperar y reintentar la navegación antes de asumir que algo está roto del lado de la cuenta.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-02-automations-legacy-whatsapp-investigadas]]
