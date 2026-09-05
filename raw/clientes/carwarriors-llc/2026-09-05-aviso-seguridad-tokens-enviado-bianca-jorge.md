---
tags: [forjado, cliente, carwarriors, seguridad, ghl, tokens-filtrados]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-05
---

# 2026-09-05 — Aviso del hallazgo de tokens filtrados enviado a Bianca/Jorge González

**Contexto:** continuación de `[[2026-09-04-hallazgo-seguridad-tokens-ghl-filtrados-repo-externo]]` y `[[2026-09-04-identidad-gyoan-byte-confirmada]]`. Quedaban 2 acciones pendientes de esa sesión: avisar al equipo de Carwarriors y decidir si contactar a `gyoan-byte`/Yoan directamente.

## Qué se hizo

Se redactó un mensaje en lenguaje no técnico para Bianca/Jorge González explicando:
- Se encontraron los tokens de acceso a su GHL publicados en un repo público de GitHub, dejados por Yoan (`gyoan@carwarriorsllc.com`, especialista que armó los bots legacy).
- Los tokens ya fueron rotados el 2026-09-04 — los publicados ya no sirven, sin riesgo activo hoy.
- El archivo viejo sigue público porque FORJADO no tiene permiso de escritura en ese repo (es de Yoan, no nuestro).
- Se les da a elegir: pedirle ellos mismos a Yoan que lo borre, o que FORJADO lo contacte directamente.

Jorge confirmó el texto del mensaje como bueno para enviar.

## Decisión sobre contactar a Yoan

Se decidió **no contactar a Yoan proactivamente todavía** — se espera a que Bianca/Jorge González decidan primero, ya que es su relación de trabajo (Yoan es/fue contratista de Carwarriors), no la nuestra. El mensaje ya les da esa opción explícita.

## Pendiente real

- [ ] Esperar respuesta de Bianca/Jorge González: ¿quieren que contactemos a Yoan, o lo hacen ellos?
- [ ] Si deciden que lo hagamos nosotros: redactar mensaje aparte a `gyoan@carwarriorsllc.com` pidiendo borrar el archivo `activate-ai/wrangler.toml` del repo `gyoan-byte/carwarriors-kb`.
- [ ] Sigue sin confirmarse si Yoan es la misma persona que "Carlos Cisneros"/`n8n.apps.carwarriorsllc.com` (misterio de julio 2026) — no se investigó esta sesión.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-04-hallazgo-seguridad-tokens-ghl-filtrados-repo-externo]]
- [[2026-09-04-identidad-gyoan-byte-confirmada]]
