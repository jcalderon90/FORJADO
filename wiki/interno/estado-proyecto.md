---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-09-08
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | **🔴→✅ 09-08: 2 bugs críticos encontrados y corregidos el mismo día porque Jorge insistió en verificar en vez de aceptar la primera respuesta.** (1) `KB - SEARCH` tenía un cableado roto que vaciaba el contexto del LLM en *cada* consulta (precios, horarios, dirección, financiamiento) en ambos dealers — probablemente la causa de fondo de varias "alucinaciones" ya vistas; corregido y probado end-to-end. (2) El sync diario de inventario (`VECTORIZAR - KB`) llevaba desde el 09-04 borrando el inventario del bot sin repoblarlo — corregido, publicado, y **repoblado manualmente el mismo día** (135 vehículos reales confirmados en Mongo, no se esperó a la corrida automática). De paso: rate-limit de 30 min/contacto aplicado a las alertas de `no_json` en Slack (con 2 hotfixes propios corregidos tras pruebas en vivo antes de publicar), y paridad CW↔Rances Car cerrada en 2 gaps de una auditoría previa (timeout de `RSVP`, manejo de errores de `kb_search`). Sync Tesla/Trade-In confirmado con un caso real. Sigue sin tráfico real: WhatsApp Carwarriors LLC (solo contactos de prueba), comentarios IG/FB (8 días en cero). Pendientes sin resolver, esperando al cliente: PIT tokens/Yoan, DealerCenter ROI (Jorge debe cargarlo a mano), ticket BDC Rep abierto, WhatsApp Rances Car (permisos Meta), SMS lead caliente, cadencia de re-contacto (esperando revisión de Jorge). Detalle completo en [[../clientes/carwarriors-llc]] | 2026-09-08 |
| **Varela Law** | ✅ 09-08: acceso directo vía MCP `n8n-varela_law` conectado por primera vez. `CONTRACTS FROM SLACK` (procesa contratos firmados reenviados por Slack) — en producción desde 2025-08-23 pero nunca documentado en la bóveda hasta hoy — migrado de Airtable+Sheets a MongoDB (Airtable llegó a su límite de registros), más un fix real del AI Agent que perdía teléfono/tipo de caso ya presentes en el PDF. `TRACKING INCOMING ZELLE PAYMENTS` — bug de zona horaria corregido (heredaba UTC+2 del servidor, corría la fecha un día atrás en hora de Houston) + `dateFields` de Mongo mal configurado. Ambos publicados y verificados con datos reales. 🟡 Sigue pendiente, sin cambios: riesgo de negocio API de MyCase (mensaje a Mario 2026-08-28, esperando respuesta, no perseguir proactivamente) y el backlog de 6 ideas del 2026-08-28 | 2026-09-08 |
| **Pipeline / prospección** | Ver [[../ventas/pipeline]] | 2026-08-15 |

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
