---
tags: [forjado, cliente, carwarriors, seguridad, ghl, tokens-filtrados]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-05
---

# 2026-09-05 — Aviso enviado a Bianca/Jorge González y a Yoan sobre el hallazgo de tokens filtrados

**Contexto:** continuación de `[[2026-09-04-hallazgo-seguridad-tokens-ghl-filtrados-repo-externo]]` e `[[2026-09-04-identidad-gyoan-byte-confirmada]]`. Los 2 mensajes que quedaron pendientes de enviar ese día ya se enviaron.

## Qué se envió

- **A Bianca/Jorge González** (equipo Carwarriors, lenguaje no técnico): se les informó que los tokens de acceso a GoHighLevel quedaron expuestos públicamente en un repositorio de GitHub de Yoan (`gyoan@carwarriorsllc.com`, quien construyó los bots legacy antes de la migración a n8n), y que ya se rotaron de inmediato — sin riesgo activo hoy.
- **A Yoan** (`gyoan@carwarriorsllc.com`, técnico): se le avisó del hallazgo específico (`activate-ai/wrangler.toml` en `gyoan-byte/carwarriors-kb`), se le pidió que quite los tokens del repo o lo pase a privado, y se le preguntó si sigue teniendo alguna relación activa con Carwarriors hoy (para además avanzar el misterio pendiente de si es la misma persona que "Carlos Cisneros" / `n8n.apps.carwarriorsllc.com`).

Confirmado por Jorge Calderón (FORJADO) en esta sesión que ambos mensajes ya salieron. Queda esperando respuesta de cualquiera de los 3 (Bianca, Jorge González, Yoan) — no hay acción propia adicional hasta entonces.

## Pendiente real

- [ ] Esperar respuesta de Yoan — si limpia el repo, y si confirma o descarta relación con "Carlos Cisneros"/`n8n.apps.carwarriorsllc.com`.
- [ ] Esperar confirmación de Bianca/Jorge González de que recibieron el aviso (sin acción esperada de su parte más allá de estar informados).

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-04-hallazgo-seguridad-tokens-ghl-filtrados-repo-externo]]
- [[2026-09-04-identidad-gyoan-byte-confirmada]]
