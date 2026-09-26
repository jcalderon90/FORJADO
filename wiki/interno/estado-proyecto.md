---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-09-26
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Callacar** | **🟢 09-25: Agente IA Cally desplegado en n8n (`Bpiy2rUJ2Z8aitOy`) con Chatwoot, DeepSeek v4.1 Flash y memoria Buffer Window.** Portal web Astro y Cloudflare Function `/api/contact` validados en producción. Pendiente asignación de dominio `callacar.au`. Detalle completo: [[../clientes/callacar]]. | 2026-09-25 |
| **Carwarriors LLC** | **🟢 09-26: Reporte diario de leads incompletos en DealerCenter (`jc317DtnKMYEscC5`) en producción en canal `#auditoria-leads` con divisor visual.** Auditoría de 4 columnas en DealerCenter activada y remoción del footer de n8n en los 9 workflows de Slack. Pendiente decisión WhatsApp Rances Car. Detalle completo: [[../clientes/carwarriors-llc]]. | 2026-09-26 |
| **Rogers México** | **🟡 09-21: Propuesta en 3 fases estructurada a partir de notas de voz de Rogers.** Enfoque inicial en Fase 1 (bot WhatsApp calificador de CP + agenda de visitas en CDMX). Pendiente llamada de alineación de 10 min. Detalle completo: [[../clientes/rogers-mexico]]. | 2026-09-21 |
| **Pipeline / prospección** | Ver [[../ventas/pipeline]] | 2026-09-21 |

## Bóveda / herramientas internas

- **09-07: reestructuración completa de la carpeta raíz `FORJADO/`** (varias pasadas en la misma sesión, ya cerrada). Estado final:
  ```
  FORJADO/
  ├── aplicaciones/           (solo carpetas con repo GitHub propio, agrupadas por cliente)
  │   ├── carwarriors/dealer-center-scraper/
  │   ├── varela-law/automated-legal-contracts/
  │   └── forjado/{lead-discovery,portfolio-dev}/
  ├── desarrollo/              (esta bóveda — repo GitHub FORJADO)
  └── contenido/                (repo GitHub social-media-content-, incluye engine/ — el motor de generación de video, confirmado que se queda ahí por ser herramienta acoplada a esa línea de servicio, no una app desplegada a cliente)
  ```
  Verificado: ningún path absoluto roto, remotes de git intactos, `node_modules/` correctamente ignorado y sin archivos trackeados en los 6 repos. Commits pusheados a `FORJADO` y `social-media-content-` en GitHub. Detalle completo en [[../../raw/interno/2026-09-07-reestructuracion-carpeta-raiz-forjado]].
- **09-07: `desarrollo/` (esta bóveda) declarada carpeta principal de indexado de todo FORJADO** — hasta ahora `wiki/index.md` solo cubría clientes/interno de la propia bóveda, sin ninguna referencia a `aplicaciones/` ni `contenido/`. Creada [[mapa-forjado|wiki/interno/mapa-forjado.md]] (mapea las 4 apps de `aplicaciones/` — stack, estado, para qué sirve cada una — y referencia `contenido/`, que mantiene su propio `wiki/` independiente sin duplicarse acá), registrada en `wiki/index.md` y en el `README.md` de la bóveda. Detalle en [[../../raw/interno/2026-09-07-reestructuracion-carpeta-raiz-forjado|raw, sección "Quinta pasada"]].
- **09-14: instalación global de suite de skills agenticas en `~/.gemini/config/skills/`** — 20 habilidades instaladas (14 de Superpowers por Jesse Vincent, `/find-skill` / `/find-skills` para descubrimiento dinámico por stack, `n8n` para automatizaciones y flujos, `karpathy-vault` + `manage-vault` + `compile-wiki` globales). Ver [[configuracion-skills|wiki/interno/configuracion-skills.md]] y [[../../raw/interno/2026-09-14-instalacion-suite-skills-superpowers-n8n-find-skill|raw]].
- `.claude/skills/compile-wiki/` — compila sesiones de trabajo con clientes desde `raw/` hacia `wiki/` (usar al cerrar una sesión real).
- `.claude/skills/manage-vault/` — referencia general de convenciones para navegar/crear/editar en esta bóveda, creada 2026-09-02 a pedido de Jorge para que cualquier agente (no solo esta sesión) la gestione bien. Ver [[../../README|README]] y [[../../raw/interno/2026-09-02-skill-manage-vault-creada]].
- **Lección 09-05 — sesiones paralelas pueden generar hechos contradictorios en git:** dos sesiones trabajando el mismo cliente el mismo día (sin `fetch` previo) llegaron a conclusiones distintas sobre si se había contactado a un tercero, causando un conflicto de push con contenido no solo distinto sino contradictorio. Resuelto preguntándole al usuario cuál era el hecho real. Recomendación: si un cliente puede estar "caliente" (trabajado por otra sesión el mismo día), hacer `git fetch`/`pull` al arrancar. Detalle: [[../../raw/interno/2026-09-05-conflicto-sesiones-paralelas-git-push]].

## Pendientes de la agencia (no ligados a un cliente específico)

- [ ] Rotar la Location API Key de Carwarriors LLC en GHL (quedó expuesta en un chat el 2026-07-27) — Jorge indicó explícitamente no rotarla por ahora.
- [ ] Investigar `n8n.apps.carwarriorsllc.com` — instancia n8n externa, viva y mantenida (cert renovado, no es del proyecto FORJADO). **Actualizado 09-04:** probable relación con "Yoan" (`gyoan-byte`, email `gyoan@carwarriorsllc.com`, especialista GHL que construyó los bots legacy de Carwarriors en marzo 2026, identificado al investigar el repo `gyoan-byte/carwarriors-kb`) — no confirmado si es la misma persona que "Carlos Cisneros". Sin credenciales para ver qué corre ahí. Pendiente conseguir login o preguntarle directamente a Yoan/Carlos Cisneros.
- [ ] Completar datos del panel de inicio (fundador y contacto ya cargados): web/redes y forma legal/facturación — requiere datos del usuario.
- [ ] **09-06: decidir qué conectar en OmniRoute** (gateway de LLMs propio en el VPS Oracle, recién explorado) — candidatos: Hermes Agent (Nous Research) y/o DeepSeek nativo/DeepSeek TUI, o alguna de las alternativas ya listadas en su catálogo (Goose, Aider, Cline, Continue, etc.). Nada instalado ni conectado todavía, solo mapeada la interfaz. De paso, reconciliar por qué OmniRoute no detecta el "Hermes Agent" que [[operaciones/herramientas-y-stack|Herramientas y Stack]] ya listaba como activo desde junio. Detalle en [[../../raw/interno/2026-09-06-omniroute-exploracion-inicial|raw]].
- [x] ~~`contenido/` con `engine/` sin trackear en rama mal nombrada~~ — **cerrado 09-07:** rama renombrada a `chore/vault-restructure-and-engine-readd`, fusionada a `main` (fast-forward, git detectó el rename `AI-Content-Automation-Engine/ → engine/` limpio) y pusheada a `social-media-content-`.
- [x] ~~`.playwright-cli/` sin limpiar~~ — **cerrado 09-07:** nunca tuvo archivos trackeados en git; reubicados los 324 archivos (5.2M) a `~/.claude/playwright-cli-history/` (fuera de cualquier repo, centralizado junto a `~/.claude/playwright-profiles/`).
- [ ] **09-07: replicar la reestructuración de `FORJADO/` en la otra máquina** — script defensivo dejado en `raw/interno/2026-09-07-replicar-reestructuracion-forjado.sh` (commiteado y pusheado, pero hay que copiarlo a mano ahí porque el propio script todavía no existe localmente antes del primer `git pull`). Pendiente que Jorge lo corra en la otra compu y revise el diff del motor de contenido si `AI-Content-Automation-Engine/` local no coincide byte a byte con `contenido/engine/` (nunca estuvo en git, pudo haber divergido entre máquinas).

## Relacionado

- [[../clientes/carwarriors-llc|Carwarriors LLC]]
- [[../clientes/varela-law|Varela Law]]
- [[../ventas/pipeline|Pipeline (MOC)]]
- [[mapa-forjado|Mapa de FORJADO — aplicaciones/ y contenido/]]
- [[../index|Índice de la bóveda]]
