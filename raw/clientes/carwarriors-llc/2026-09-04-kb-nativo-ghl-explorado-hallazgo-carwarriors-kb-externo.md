---
tags: [forjado, cliente, carwarriors, ghl, knowledge-base, conversation-ai, hallazgo]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Explorado el Knowledge Base nativo de GHL: agentes siguen borrados, pero se encontró un framework externo completo (`gyoan-byte.github.io/carwarriors-kb`)

**Contexto:** pendiente de la wiki ("Explorar si el Knowledge Base del bot nativo de GHL (Conversation AI) sirve como fuente reusable para el KB real del bot n8n — idea de Jorge, sin explorar"). Requería Playwright+CDP contra GHL (patrón ya documentado en memoria de sesión). Login con `jcalderon900610@gmail.com` / `Carwarriors100@` (cuenta de nivel agencia, aterriza en `/agency_dashboard`; hay que pasar por Sub-Accounts → Switch to Sub-Account para entrar a la location de Carwarriors LLC, `DSe5PdPEScZL8cbZTkKI` — el goto directo a URLs de location da 404, confirma el quirk de ruteo ya documentado en la memoria `feedback-ghl-playwright-persistent-cdp`). 2FA por email al mismo buzón, código pasado por Jorge.

## Hallazgo 1 — los agentes nativos siguen borrados, en las 4 superficies de "AI Agents"

Confirmado en vivo, no solo por API como el 08-27: **ningún agente vivo existe hoy** en ninguna de las 4 secciones de "AI Agents" de GHL para Carwarriors LLC:
- **Conversation AI**: pantalla vacía ("Welcome to Conversation AI! ... Create Bot").
- **Agent Studio → Managed Agents**: "0 Managed Agents".
- **Agent Studio → Flow Agents**: sección en transición ("Agent Studio is Evolving"), sin agentes tampoco.
- **Voice AI**: "No Agent is Live".
- (Aparte, "Agent Personalities" en el sidebar es una feature no relacionada — un custom object con 1 registro, "bianca", de abril 2026, sin conexión a ningún KB.)

Esto confirma que el borrado del 08-27 (`DELETE /conversation-ai/agents/:agentId`, `totalCount: 0`) sigue vigente y nadie recreó un bot nativo desde entonces.

## Hallazgo 2 — el Knowledge Base sí sobrevivió al borrado del agente (son objetos independientes en GHL)

Bajo AI Agents → Knowledge Base hay **2 bases** (cuota: 2 de 15 usadas):

| KB | Creada | Última actualización | Gaps | Contenido |
|---|---|---|---|---|
| **CarWarriors** | 2 Jun 2025 | 9 Jul 2026 | 0 | Sin explorar en detalle — parece la más vieja/original, ligada probablemente al agente legacy borrado |
| **PRINCIPAL** | 30 Jul 2025 | **3 Sep 2026** (ayer) | 25 | 21 fuentes de web crawler, 48 FAQs, 1 rich text, 0 tablas, 0 archivos |

El nombre "PRINCIPAL" coincide con el nodo del agente de n8n, pero **no hay relación real** — es un objeto de GHL completamente aparte, sin ningún agente nativo conectado hoy (confirmado en el Hallazgo 1). Que se haya actualizado el 3 de septiembre sin que exista ningún agente vivo que lo use es en sí mismo llamativo — alguien (persona o proceso) sigue tocando este KB de forma manual/directa vía la UI, sin que sirva para nada en producción ahora mismo. No se identificó quién ni por qué.

## Hallazgo 3 — el KB "PRINCIPAL" apunta a un framework externo completo y bien diseñado (`gyoan-byte.github.io/carwarriors-kb`)

Los 21 links de "Web crawler" de la KB "PRINCIPAL" no son de redes sociales ni del sitio de Carwarriors — son 21 páginas de un sitio GitHub Pages público: `https://gyoan-byte.github.io/carwarriors-kb/`. Es un framework de diseño de agente conversacional completo, "20 módulos especializados optimizados para web scraping por agentes de IA y acceso humano", organizado en 2 carpetas:

- **`knowledge_base/`** (11 módulos): Business Identity & Context, Inventory Policy, Financing Policy, Purchase Process, Trade-In Policy, Safety & Compliance, Conditional Logic, Automotive Basics, Vehicle Knowledge System, README, Sitemap/LLMs.txt.
- **`agent_engine/`** (9 módulos, algunos solapados con la carpeta anterior): Objection Handling, Tone & Behavior, Functional Limits & Boundaries, Transitions, Difficult Conversations, Trust & Authority, Commercial Psychology, Behavioral Guidelines, Conversation Flow Map, Conversational Variation System.

**Contenido revisado (2 documentos leídos completos vía WebFetch, público, sin login):**

- **`02_Inventory_Policy.md`**: política de disponibilidad basada en una lista llamada "Carros Listos" — "el sistema nunca debe asumir disponibilidad fuera de Carros Listos". No menciona Tesla ni ninguna marca específica (usa Toyota/Honda solo como ejemplos ilustrativos). Regla explícita: toda confirmación de disponibilidad es preliminar y no vinculante; si el vehículo pedido no está en la lista, hay que ofrecer alternativas en vez de simplemente decir que no hay.
- **`18_Vehicle_Knowledge_System.md`**: separa explícitamente "conocimiento del vehículo" de "disponibilidad real" — cita textual: *"Vehicle knowledge does NOT imply inventory availability. All availability must be verified only through Carros Listos."* Describe una base estática de 88 modelos/25 marcas (specs OEM, EPA, NHTSA) que nunca se usa para confirmar stock — siempre escala a un asesor humano para confirmar unidad/precio/financiamiento exactos. No integra ninguna API externa, es 100% estático + escalamiento humano.

**Relevancia directa:** esto es justo el tipo de guardrail que ya causó un incidente real en Carwarriors (el bot legacy de GHL inventó que vendían Tesla, 08-27) y que después motivó agregar un guardrail duro de precio y, más tarde (09-01), un guardrail de dirección física al bot de n8n tras otro caso de invención. El documento leído no menciona Tesla y su diseño (nunca afirmar disponibilidad sin consultar la fuente viva) es sólido — sugiere que la causa raíz de esos incidentes fue el LLM saltándose la instrucción, no un vacío de diseño en el prompt. Este framework externo, si es de calidad pareja en sus otros 18 documentos, podría aportar ideas concretas de redacción (Objection Handling, Trust & Authority, Commercial Psychology, Conditional Logic) para reforzar el prompt actual de `PRINCIPAL`/`PRINCIPAL - Rances Car` — pero **no se leyeron los otros 18 documentos todavía**, solo 2 como muestra.

## Hallazgo 4 — Knowledge Gaps: preguntas reales de leads que el KB (y probablemente el bot real) no puede responder bien

La pestaña "Knowledge gaps" de la KB "PRINCIPAL" agrupa preguntas reales no resueltas, deduplicadas con conteo de frecuencia. Ejemplos vistos (de 25 totales, solo se revisó la primera página):

- "What are the available models, configurations (including seating and sunroof options), colors, pricing, and dealership availability for specific vehicle makes and years?" — **preguntada 18 veces de 18 formas distintas**.
- Preguntas variantes agrupadas bajo ese gap: sobre "kamionetas" (camionetas), **Lamborghini**, años disponibles del **Model Y**, y el **Mustang 2027 Coupe** (disponibilidad, specs, precio, test drive).

Esto es señal real de negocio (qué preguntan los leads que ni este KB legacy ni, probablemente, el bot de n8n actual responden bien) — independiente de si se reusa o no el contenido del framework externo, esta lista de gaps vale la pena cruzarla contra el KB real (Mongo) del bot de n8n para ver si tiene respuesta para Lamborghini/Model Y/Mustang 2027 o si también se queda corto ahí.

## Pendiente real (nuevo, sin acción tomada todavía)

- [ ] **Decidir con Jorge si vale la pena revisar los 18 documentos restantes de `gyoan-byte.github.io/carwarriors-kb`** (público, se puede leer con WebFetch sin ninguna credencial) para extraer ideas de redacción reusables en el prompt de `PRINCIPAL`/`PRINCIPAL - Rances Car` — no se hizo todavía, es trabajo de curación manual, no algo automatizable de un tirón.
- [ ] **Identificar el origen de `gyoan-byte.github.io/carwarriors-kb`** — el nombre de usuario de GitHub no coincide con nadie conocido del equipo; podría estar relacionado con "Carlos Cisneros"/`n8n.apps.carwarriorsllc.com`/"Customers for AI" (mismo patrón de infraestructura externa sin explicar documentado desde 2026-07-28/07-29) — no confirmado, solo especulación razonable por la coincidencia de dominio y de estar todo relacionado con Carwarriors. Recomendado preguntarle directamente a Jorge/Carlos antes de asumir nada.
- [ ] **Cruzar la lista completa de 25 Knowledge Gaps de la KB "PRINCIPAL"** (Lamborghini, Model Y, Mustang 2027, camionetas, etc.) contra el KB real de Mongo que usa el bot de n8n, para confirmar si el bot real ya responde bien a esas preguntas o comparte el mismo vacío.
- [ ] No se tocó ni editó nada en GHL en esta sesión (solo lectura/exploración) — la KB "CarWarriors" (la más vieja) no se llegó a abrir en detalle, queda pendiente si hace falta.

## Relacionado

- [[carwarriors-llc]]
- [[2026-08-27-bot-viejo-ghl-alucino-tesla]]
- [[2026-09-01-bot-invento-direccion-fisica-fix-guardrail]]
