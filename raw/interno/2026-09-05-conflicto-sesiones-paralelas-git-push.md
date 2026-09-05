---
tags: [forjado, interno, git, leccion-operativa]
tipo: raw
fecha: 2026-09-05
---

# 2026-09-05 — Lección: dos sesiones paralelas en el mismo cliente causaron un conflicto de git con hechos contradictorios

**Contexto:** el mismo día (2026-09-05), dos sesiones distintas de Claude Code trabajaron en paralelo sobre Carwarriors LLC sin que una supiera de la otra. Una (13:05 -0400) trabajó el aviso de seguridad de tokens filtrados y, según su registro raw, confirmó con Jorge que ya se había enviado mensaje también a Yoan (`gyoan@carwarriorsllc.com`). La otra (esta sesión, más tarde, sin haber hecho `fetch` antes de empezar) trabajó el mismo pendiente de forma independiente y decidió explícitamente NO contactar a Yoan todavía.

Al hacer `git push` esta sesión, el push fue rechazado (`! [rejected] main -> main (fetch first)`) porque el remoto ya tenía el commit de la otra sesión. Al fusionar, se encontró que ambas ramas habían editado las mismas líneas de `wiki/clientes/carwarriors-llc.md` y `wiki/interno/estado-proyecto.md` con contenido no solo distinto sino **contradictorio** (¿se contactó a Yoan o no?).

## Resolución

Se le preguntó directamente a Jorge cuál versión era la real (confirmó: Yoan NO fue contactado). Se resolvió el merge manualmente conservando el hecho correcto, y se agregó una entrada de corrección (`raw/clientes/carwarriors-llc/2026-09-05-correccion-yoan-no-fue-contactado.md`) sin editar retroactivamente la entrada original de la otra sesión (regla de la bóveda: `raw/` es append-only).

## Lección operativa

- Los conflictos de contenido (no solo de líneas de texto) son posibles cuando dos sesiones trabajan el mismo cliente en paralelo el mismo día, especialmente en temas con "decisión pendiente" (ej. contactar o no a un tercero) donde cada sesión puede llegar a una conclusión distinta si el usuario responde distinto en cada una.
- Cuando un `git push` es rechazado por trabajo remoto no visto, **no asumir cuál versión es la correcta por antigüedad o por "la mía es la que tengo en pantalla"** — si el conflicto toca un hecho verificable (algo que pasó o no en el mundo real, no solo redacción), preguntarle al usuario directamente cuál es la realidad antes de fusionar.
- Sería más seguro que cada sesión nueva haga `git fetch`/`pull` al arrancar si va a tocar un cliente que podría estar "caliente" (trabajado recientemente por otra sesión el mismo día) — no se hizo esta vez y fue la causa raíz del conflicto.

## Relacionado

- [[../clientes/carwarriors-llc/2026-09-05-correccion-yoan-no-fue-contactado]]
- [[../clientes/carwarriors-llc/2026-09-05-aviso-seguridad-tokens-enviado-bianca-jorge]]
- [[../clientes/carwarriors-llc/2026-09-05-aviso-enviado-seguridad-tokens-filtrados]]
