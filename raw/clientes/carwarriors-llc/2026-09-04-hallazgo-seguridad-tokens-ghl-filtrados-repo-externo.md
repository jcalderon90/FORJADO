---
tags: [forjado, cliente, carwarriors, seguridad, ghl, tokens-filtrados, cloudflare]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Hallazgo de seguridad: PIT tokens de GHL filtrados en repo público de terceros + Cloudflare Workers externos no autorizados

**Contexto:** continuación de la exploración del KB nativo de GHL documentada en `[[2026-09-04-kb-nativo-ghl-explorado-hallazgo-carwarriors-kb-externo]]`. Ese hallazgo llevó a inspeccionar el repo público `gyoan-byte/carwarriors-kb` en GitHub (sitio que la KB "PRINCIPAL" de GHL usa como fuente de 21 web-crawlers). La inspección del repo (solo lectura, sin credenciales, vía GitHub API pública `git/trees` y `raw.githubusercontent.com`) reveló mucho más que documentos de KB.

## Qué se encontró

El repo `gyoan-byte/carwarriors-kb` no es solo el sitio de documentación de KB — también contiene al menos 2 proyectos de Cloudflare Workers en subcarpetas:

- **`activate-ai/wrangler.toml`**: contiene, en texto plano dentro de una variable `ACCOUNTS_CONFIG_JSON`, **PIT tokens reales de GoHighLevel para ambas locations de Carwarriors**:
  - Carwarriors LLC (location `DSe5PdPEScZL8cbZTkKI`), agent IDs `gVKgcA7UScwA2hdB3kfW` / `UFnIBDWtM64QJgjsaGJP`.
  - Rances Car (location `1j1dHo8HEbZdElQUGFoC`), agent IDs `48d7BsvfqAOr74BzF7sR` / `7d2DMiUdHfLb1uXPFO7F`.
  - **Nota:** `UFnIBDWtM64QJgjsaGJP` y `7d2DMiUdHfLb1uXPFO7F` son exactamente los 2 agent IDs que confirmamos borrados el 2026-08-27 (bot legacy que alucinó Tesla). Es decir, este worker está configurado para apuntar a agentes que ya no existen.
  - **No se copiaron los valores reales de los tokens a ningún archivo de esta bóveda** — por regla, secretos nunca van a `raw/` ni se pegan en texto plano fuera de `wiki/interno/recursos/credenciales.md`. Si hace falta el valor exacto para confirmar algo, se debe releer el repo externo directamente en el momento.
  - El mismo archivo define `crons = ["*/15 * * * *"]` y reglas de horario día/noche (`auto-pilot` de día, `off` de noche) que coinciden en patrón con el bug histórico no resuelto de julio 2026 (el bot se apagaba solo ~9AM diario, ver `raw/clientes/carwarriors-llc/2026-07-28...` y `2026-07-29...`).
  - `ghl-miami-scheduler.js` (leído parcialmente): es código real de un "GHL Multi-Account AI Agent Scheduler" que pega contra `https://services.leadconnectorhq.com` con rutas para prender/apagar/consultar estado de agentes — es decir, el diseño del worker si estuviera corriendo sí podría apagar/prender agentes de GHL usando esos tokens.
- **`dc-leads-processor/`**: un segundo Worker (Email Worker) con bucket R2 `inventario` y KV `K2`; procesa correos con asunto "CARROS LISTOS" parseando CSVs de inventario hacia R2. No se encontraron secretos filtrados en este segundo proyecto (se hizo grep de palabras clave, sin resultados).

## Qué se pudo confirmar y qué NO (importante — evitar sobre-afirmar)

- **Confirmado:** el código fuente y la configuración (incluyendo los tokens reales) están públicamente expuestos en un repo de GitHub de un tercero, sin autenticación necesaria para leerlos.
- **Confirmado (vía DNS/HTTP, solo lectura):** el dominio raíz usa nameservers de Cloudflare — pero esto por sí solo no prueba que este Worker específico esté desplegado y corriendo en esa cuenta.
- **NO confirmado:** si el Worker `activate-ai` está efectivamente desplegado y ejecutándose hoy contra la cuenta de GHL. Encontrar el código fuente en un repo prueba que existe una intención/config de despliegue, no que esté corriendo activamente. No tengo acceso a la cuenta de Cloudflare de quien sea que escribió esto para verificarlo directamente.
- **NO confirmado:** si el bug histórico de apagado diario ~9AM (julio 2026) fue efectivamente causado por este worker — es una correlación circunstancial fuerte (mismos agent IDs, mismo patrón horario) pero no una causa verificada.
- **NO confirmado:** quién es el autor real detrás del usuario de GitHub `gyoan-byte`, ni su relación actual (si la hay) con Carwarriors. Especulación razonable pero no confirmada: podría estar relacionado con "Carlos Cisneros" / `n8n.apps.carwarriorsllc.com`, mencionados como infraestructura externa sin explicar en notas de julio 2026 — no se investigó más a fondo esta sesión.

## Acciones tomadas / decididas

- Jorge (usuario de esta sesión, lado FORJADO) fue informado en vivo del hallazgo completo durante esta conversación.
- Jorge indicó que **rotará él mismo los 2 PIT tokens filtrados** (Carwarriors LLC y Rances Car) como medida de contención inmediata — **pendiente de confirmación de que ya se hizo**.
- Se confirmó explícitamente con Jorge que **no tenemos acceso de escritura al repo `gyoan-byte/carwarriors-kb`** (es de un tercero) — por lo tanto no es posible eliminar el archivo con los tokens filtrados directamente; la única remediación accionable de nuestro lado es la rotación de credenciales en GHL.
- **No se contactó todavía a nadie del equipo de Carwarriors** (Bianca, Jorge González) ni a `gyoan-byte`/Carlos Cisneros sobre este hallazgo — solo se habló internamente con Jorge Calderón (FORJADO) en esta sesión.

## Pendiente real

- [ ] Confirmar con Jorge que ya rotó los 2 PIT tokens (Carwarriors LLC y Rances Car) y documentar la fecha aquí cuando se confirme.
- [ ] Decidir si se le avisa a Bianca/Jorge González del equipo de Carwarriors sobre este hallazgo — no se ha hecho todavía, no hay mensaje redactado.
- [ ] Decidir si vale la pena intentar contactar a `gyoan-byte`/Carlos Cisneros para entender qué es este sistema y si sigue teniendo alguna relación con Carwarriors (pendiente pre-existente desde julio 2026, sin resolver).
- [ ] Si se confirma en el futuro que el worker sí está/estuvo corriendo, esto resolvería retroactivamente el bug histórico de apagado ~9AM de julio 2026 — hoy sigue como hipótesis fuerte, no como hecho confirmado.

## Cierre parcial (2026-09-04)

Jorge confirmó en esta misma sesión que **ya rotó los 2 PIT tokens filtrados** (Carwarriors LLC y Rances Car). No se verificó desde este lado (no se tenían guardados los valores viejos para probar que quedaron inválidos, por regla de no persistir secretos) — se toma como confirmado por palabra directa de Jorge, no por verificación técnica propia.

Con esto, la exposición pierde su gravedad inmediata (los tokens visibles en el repo de terceros ya no son válidos), pero **el archivo con los tokens viejos sigue público en `gyoan-byte/carwarriors-kb`** (sin acceso de escritura ahí) y **todavía no se avisó a nadie del equipo de Carwarriors** (Bianca/Jorge González) ni a `gyoan-byte`/Carlos Cisneros — ambos puntos siguen abiertos.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-04-kb-nativo-ghl-explorado-hallazgo-carwarriors-kb-externo]]
- [[2026-08-27-bot-viejo-ghl-alucino-tesla]]
