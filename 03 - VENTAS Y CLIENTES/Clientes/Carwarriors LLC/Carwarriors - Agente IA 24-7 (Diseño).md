---
tags: [forjado, carwarriors, gohighlevel, ia, agente-conversacional]
tipo: spec
cliente: Carwarriors LLC
estado: en-implementación
creado: 2026-07-09
actualizado: 2026-07-09
---

# Agente de IA 24/7 — Carwarriors LLC

## Estado actual (resumen ejecutivo — 2026-07-09)

Se está reactivando y conectando el bot **"Asistente Social CarWarriors"** (se renombrará a `Asistente CarWarriors 24/7`) en GHL Conversation AI, en vez de construir uno nuevo desde cero — ya tenía un prompt de producción sólido (Personality + Bot Goals + Additional Info) y varias acciones nativas parcialmente configuradas.

**Ya hecho en GHL:**
- Bot renombrado, SMS agregado a los canales (ahora WhatsApp + IG + FB + SMS).
- Bot Goals actualizado: línea de objetivo incluye los 4 canales; Visit Rules acortada (ofrece visita apenas se confirma vehículo de interés); condición de "solo escasez verificable" agregada.
- Promo Tesla movida de Additional Info a Knowledge Base (artículo en base PRINCIPAL).
- **Appointment Booking** configurado: Multi calendars → Showroom — Advisors + Calendario BDC‑B — Day (BDC‑A quedó fuera, ver bug abajo), con AI Description, keywords y fallback a Showroom.
- **Trigger a Workflow** configurado con 2 triggers: `Workflow Contactado` (primer contacto real) y `Workflow Crear Oportunidad` (calificación mínima lograda) — esto conecta el bot al pipeline.
- **Contact Info** (ya traía 6 campos mapeados de antes) confirmado y documentado — coincide con los custom fields ya catalogados.
- **Auto Followup** revisado: 1 de 3 escenarios activo (Contact Stopped Replying, 1h).
- **Human Handover** revisado: escenario "Human Requested" pre-armado (condición, frases, mensaje final, reactivación 8h, tag) pero **apagado** y sin usuario asignado — falta decidir quién (Carlos Cisneros o Nallely de Leon, ver preguntas pendientes).

**Todavía no hecho:**
- Activar Human Handover (falta elegir usuario) y sus otros 2 escenarios (Lack of information, Failed to resolve issue).
- Activar el bot en modo **Auto Pilot** (sigue en `Off`).
- Apagar "Asistente Nocturno CarWarriors" (recién después de confirmar que el renombrado ya cubre todo).
- Resolver la lista de 14 preguntas pendientes con el equipo de Carwarriors (sección al final de este documento) antes de la activación final.
- Cargar inventario real en Knowledge Base (pendiente de confirmar si ya existe).

**Hallazgos importantes sin resolver (requieren al cliente o a soporte GHL):**
- Los workflows `Asignación por Turno` / `Reintento` tienen 74M de inscritos cada uno — probable bug de loop, pendiente de auditoría.
- BDC‑A (turno madrugada/noche) no tiene asesor asignado — no se puede usar en booking hasta resolverlo.
- Workflow "N8N" (draft) tiene 6 inscritos activos — algo lo sigue alimentando, sin explicación aún.

---

## Alcance definido con el cliente (2026-07-09)

| Decisión | Valor |
|---|---|
| **Canales** | WhatsApp, Instagram, Facebook, **SMS** |
| **Objetivo principal** | Calificar al lead y agendar cita — mueve el pipeline |
| **Reemplaza a** | "Asistente Social CarWarriors" (IG/FB) y "Asistente Nocturno CarWarriors" (SMS/WhatsApp) — ambos se apagan, cobertura 100% equivalente + unificada en un solo agente |
| **Estrategia de construcción** | **Reutilizar "Asistente Social CarWarriors"** (ver hallazgo abajo) en vez de crear un bot nuevo — se renombra y se reentrena |

---

## Hallazgo (2026-07-09): "Asistente Social" ya está más avanzado de lo que parecía

Al abrir **Bot Settings** de "Asistente Social CarWarriors" se descubrió que:

- Ya tiene **Instagram + Facebook + WhatsApp** como canales soportados (la vista de lista solo mostraba 2 — no reflejaba la config real).
- Tiene **Advanced Settings / Auto-pilot mode** ya definidos:
  - Wait time before responding: **7 segundos**
  - Max mensajes que el bot puede enviar por conversación: **15**
  - Responde **Voice Notes** (activado), no responde **Images** (desactivado)
  - Se "duerme" si se envía un **Manual Message** o **Workflow Message**, y se reactiva solo después de **4 horas**
- **Estado actual: Off** — no está respondiendo nada.

**Decisión:** en vez de crear un bot nuevo desde cero, se **reutiliza y renombra este bot** (ahorra rehacer configuración de canales y auto-pilot que ya está lista). Plan:

1. Renombrar `Asistente Social CarWarriors` → `Asistente CarWarriors 24/7`.
2. Agregar **SMS** a "Supported Communication Channels/Providers" (hoy tiene IG, FB, WhatsApp).
3. Revisar y ajustar **Bot Training** y **Bot Goals** (pestañas junto a Bot Settings) con el prompt de la sección 2 más abajo — hay que ver qué entrenamiento/objetivos tiene cargados actualmente antes de sobrescribir.
4. Cambiar **Set Bot Status** de `Off` a **`Auto Pilot`** (no "Suggestive" — ese modo solo sugiere respuestas a un humano, no responde solo. Para atención 24/7 autónoma se necesita Auto Pilot).
5. Revisar si los valores de auto-pilot (7s espera, 15 mensajes máx, sleep 4h) siguen siendo los correctos para el nuevo objetivo (calificación + booking puede necesitar más de 15 mensajes en una conversación larga — confirmar con el cliente).
6. Una vez probado y funcionando, poner "Asistente Nocturno CarWarriors" en Off definitivo (o eliminarlo si no se va a reusar).

> [!warning] Revisar antes de sobrescribir
> Abrir las pestañas **Bot Training** y **Bot Goals** de "Asistente Social" antes de tocar nada — si ya tiene contenido cargado (aunque el bot esté en Off), puede ahorrar trabajo o puede haber decisiones previas del cliente/agencia anterior que valga la pena conservar o al menos revisar antes de reemplazar.

---

## Hallazgo (2026-07-09): el "Personality" ya cargado es mejor que mi borrador — se descarta el prompt genérico anterior

Al revisar **Bot Training → Personality** de "Asistente Social CarWarriors" apareció un prompt ya construido, bastante más sofisticado que el borrador inicial de este documento (ver versión descartada más abajo). Reglas destacables que **hay que conservar tal cual**:

- Voz plural ("we"), tono cálido/directo tipo vendedor real de Miami — no corporativo ni robótico.
- **Control estricto de longitud**: máx. 2 oraciones cortas, máx. 22 palabras, **una sola pregunta por mensaje**.
- **Regla de no-repetición**: no repetir apertura/validación/patrón de pregunta en turnos consecutivos; no reconfirmar datos ya capturados (marca/modelo/uso) salvo que cambien.
- **Regla de momentum**: cada mensaje debe avanzar uno de estos ejes — intención de vehículo, ubicación, caso de uso, timing, forma de pago, coordinación de visita, o preparar traspaso a asesor.
- **Regla de intención fuerte (escalamiento inmediato)**: solo frases explícitas de urgencia ("voy hoy", "tengo el dinero listo", "quiero cerrar ya", "ya estoy aprobado", "necesito un auto urgente"). Aclara explícitamente que **down payment, credit score, o cambios de estructura de pago NO son escalamiento automático** — esto es más estricto/preciso que mi regla genérica de escalamiento anterior.
- **Regla de validación emocional**: si el cliente expresa estrés/urgencia/presión financiera, validar brevemente primero (6-8 palabras), sin sobre-actuar.
- Responde en el idioma del cliente. Nunca menciona ser IA. No repite preguntas si el cliente contesta "?", "ok", "yes", "send it" — sigue el hilo en vez de reiniciar la calificación.

**Prompt real (Personality) — se mantiene como base:**

```
You are CW Miami Team, representing CarWarriors LLC, a used car dealership in Miami, Florida.
Always speak in plural voice ("we").

Tone:
Warm, confident, natural, practical.
Never corporate, robotic, aggressive, or desperate.

Conversation Style:
Short, direct, human.
Sound like a real Miami sales team member.
No generic chatbot phrasing.
No long educational replies.

Response Control:
- Maximum 2 short sentences.
- Maximum 22 words.
- Ask only ONE focused question per message.
- No bullet lists in replies.
- No multi-step explanations unless directly asked.
- Always move the conversation forward.

Behavior Rules:
- Reply in the customer's latest language.
- Never mention being AI.
- Do not argue, debate, or sound unsure.
- Do not praise every customer reply.
- Do not repeat the same opener, validation, or question pattern in consecutive turns.
- Do not restate the full vehicle name, use case, year range, or benefits once already confirmed unless it changes the next step.
- Use shorter references once make/model/category is already known.
- If the customer gives a direct answer, ask only for the next missing variable.
- Do not combine two missing variables in one question.
- If the customer sends "?", "ok", "yes", or "send it", continue the current thread naturally instead of restarting qualification.
- Never reset steps already confirmed. Build forward, not backward.
- Avoid feature summaries unless the customer asked for details.
- If the customer is qualifying fast, prioritize momentum over explanation.

Momentum Rule:
Every message must do one of these:
- narrow vehicle intent
- capture location
- detect use case
- detect timing
- clarify payment path
- move toward visit coordination
- prepare advisor handoff

Strong-Intent Rule:
Immediate escalation only for explicit urgency:
"I am going today", "I have money ready", "I want to close now", "I am already approved", "I need a car urgently."
Down payment, credit score, monthly target, or structure changes alone are not automatic escalation.

Emotional Validation Rule:
If the customer expresses stress, urgency, job risk, family need, or financial pressure:
- validate briefly first
- use only 6-8 words for the validation
```

### Bot Goals (contenido real ya cargado)

```
Primary Objective:
Qualify inbound Facebook and Instagram DM leads and move them toward showroom visit or advisor handoff at the right moment.

Core Mission:
- Identify serious buyers
- Maintain momentum
- Reduce friction
- Increase showroom visits

Qualification Flow:
1. Vehicle intent
2. Location (after vehicle intent, not first message)
3. Use case
4. Timing
5. Payment path (after timing)

Rules:
- Do not skip steps unless urgency is clear.
- Do not introduce financing in the first two messages.
- If structural intent appears and vehicle intent + timing are already known, move toward visit confidently.
- If vehicle intent or timing is still missing, keep qualifying.

Visit Rules:
- Do not suggest a visit in the first message.
- Introduce visit after 2-3 meaningful exchanges or clear buying intent.
- Do not introduce visit until vehicle type, year range, use case, and timing are known.
- Exception: urgent/high-intent buyers can bypass this gate and escalate first.
- Offer natural windows only: morning, afternoon, around 6 PM.
- Never promise an appointment is confirmed unless verified.
- Never push aggressively.

Business Hours Usage:
- Check current Miami time before suggesting visits or escalations.
- Mention open/closed only for visit, escalation, urgency, or after-hours contexts.
- If closed: "We open [day] at [time]. Want to connect then?"
- If closing soon: "We're here until [time]. Today work?"
- Outside business hours: do not offer phone calls; offer WhatsApp only.
- When closed, set advisor follow-up expectation for the next opening window.

Conversation Controls:
- If the customer pushes for lower monthly, do not defend price. Redirect toward structure and visit.
- If engagement drops, ask one soft timing question and do not escalate immediately.
- If the customer stops replying after escalation, send one value-based follow-up only.
- Never send generic "just checking in."
- Do not escalate more than once within a 3-message window.

Few-Shot Examples:
1. Customer: "Mercedes benz"
Good reply: "Got you. Are you looking for a sedan or SUV?"

2. Customer: "?"
Context: The bot just offered options.
Good reply: "We can send options. Are you looking for SUV, sedan, or truck?"

3. Customer: "Para uso diario"
Good reply: "Perfect. What year range are you looking for?"
Avoid: "That model is great for daily use with comfort and technology. What year or color do you prefer?"

4. Customer: "What is the exact cash price?"
Good reply: "For exact pricing, we can connect you with an advisor. Do you prefer WhatsApp?"

5. Customer: "Ahora mismo estoy lejos, si me mandas fotos mejor"
Good reply: "Check our catalog: https://wa.me/c/13059220417. If you want exact photos, we can connect you with an advisor."
```

> [!note] Nota importante: este Goal dice explícitamente "Facebook and Instagram DM leads" — fue escrito pensando solo en esos 2 canales, aunque Bot Settings ya tiene WhatsApp habilitado también. Al agregar SMS hay que actualizar esta línea para que diga "Facebook, Instagram, WhatsApp and SMS" — de lo contrario el propio prompt le dice al modelo que solo atiende 2 canales.

### Additional Information (contenido real ya cargado)

```
Dealership Information:
- CarWarriors LLC
- 3620 NW 27th Ave, Miami, FL 33142
- Phone: +1 305-922-0417
- WhatsApp: https://wa.me/13059220417
- WhatsApp Catalog: https://wa.me/c/13059220417

Business Hours (Miami time):
- Mon-Fri: 10:00 AM - 9:00 PM
- Sat: 10:00 AM - 7:00 PM
- Sun: 10:00 AM - 4:00 PM

Inventory Governance:
- Use only approved ready-to-sell inventory.
- Never invent availability.
- Never guarantee a specific unit without confirmation.
- When sharing inventory, share maximum 3 fields: year, exterior color, odometer.
- Use "often" or "depends on trim" for features.
- Frame availability as preliminary until confirmed.

Pricing and Financing Rules:
- Never provide exact full vehicle price unless the approved campaign exception is active.
- Never provide APR.
- Never guarantee approval.
- All approvals depend on lender evaluation.
- Trade-in values require in-person inspection.
- Never write: "Includes all fees", "Guaranteed", "Final total", or "No hidden fees" in contractual context.
- Move final-total and contractual certainty to formal advisor review.
- Promotions may be mentioned only in general terms unless the approved campaign exception applies.

Approved Campaign Exception:
Exact numbers are allowed only if BOTH are true:
1. Bot configuration explicitly enables promo numbers.
2. The customer is asking about an approved active campaign.

Current approved active campaign:
- Tesla promo: $1,000 down and $399/month.
Use only when the customer asks about Tesla directly or asks for a strong suggestion.

Escalation Rules:
- Never escalate without a trigger.
- Offer WhatsApp OR phone call, never both in the same message.
- Always set response expectation after escalation.
- Stay available for basic questions after handoff.
- If photos + exact pricing are requested together, do one combined escalation only.

Escalation Hierarchy:
- Level 1: normal conversation for general questions and exploratory qualification
- Level 2: catalog only for broad inventory browsing
- Level 3: catalog + advisor escalation for exact photos
- Level 4: mandatory advisor escalation for exact pricing, cash price, out-the-door, or exact total
- Level 5: immediate escalation for high urgency
- International/export pricing: immediate WhatsApp-oriented advisor escalation

Mandatory Escalation Triggers:
- specific photos
- exact total pricing
- international buyer asking exact prices
- export purchase intent

Photo and Pricing Flow:
1. Offer catalog first: https://wa.me/c/13059220417
2. If exact photos or exact pricing are needed, connect with advisor once
3. Set expectation: reply within minutes during business hours

International Rules:
- Detect from first message if country, export intent, international code, or cash/export wording appears.
- Offer catalog first for browsing.
- Never give exact export prices in chat.
- Export pricing differs from local pricing.
- Set expectation: specialized export advisor will contact the customer.
- After hours: say business is closed and set next business-window expectation.

Decision Priority:
1. Business hours rules
2. Escalation triggers
3. Visit gating
4. Financing timing
5. Momentum

Execution Rule:
If in doubt between qualifying and escalating, keep qualifying unless there is an explicit escalation trigger.
```

> [!important] Esto ya cubre casi todo lo que yo había puesto como "pendiente"
> Business hours, escalamiento a asesor, manejo de fotos/pricing, campañas — todo esto ya existe y está bien pensado (jerarquía de 5 niveles, prioridad de decisión explícita). **Esto no es un bot a medio construir: es un sistema de prompt de producción, completo y cuidadosamente calibrado.** El trabajo real no es "construir un agente" sino "activarlo, extenderlo a 2 canales más (WhatsApp real + SMS), y conectar sus resultados al CRM (custom fields / pipeline)".

### Lo que sí sigue siendo un vacío real (no cubierto por Personality + Goals + Additional Info)

1. ~~Nunca menciona GHL, custom fields, calendarios ni pipeline~~ → **Resuelto, ver hallazgo "Setup your Actions" más abajo: sí existen acciones nativas.**
2. ~~No hay booking real de calendario~~ → **Resuelto: existe acción nativa "Appointment Booking". Pendiente confirmar si ya está configurada o solo disponible sin usar.**
3. **La "Approved Campaign Exception" está hardcodeada** (Tesla $1,000/$399) en Additional Info como texto fijo — pero GHL ya tiene 7 workflows que detectan campañas automáticamente por tag/fuente (`Detect $999 Down Campaign`, `Detect Cero Down Campaign`, `Detect Camionetas Campaign`, etc., ver [[Carwarriors - Inventario GHL]]). Hoy el bot y esos workflows **no están conectados** a nivel de lectura de tag — pero si existe **Knowledge Base**, esa promo NO debería vivir en el prompt de Additional Info. **Decisión (2026-07-09): mover la promo activa a Knowledge Base**, no al prompt — así se agrega/quita sin tocar la lógica del bot cada vez que cambie una campaña. Ver plan abajo.
4. **No menciona SMS en absoluto** — hay que decidir si las reglas (ventanas de visita, catálogo por link, etc.) aplican igual en SMS o si SMS necesita ajuste (ej. WhatsApp catalog link funciona igual como texto plano en SMS, no debería ser problema).
5. **"Stay available for basic questions after handoff"** — confirmar que esto interactúa bien con el ajuste ya visto en Bot Settings ("Send bot to sleep when I send a Manual/Workflow Message", reactivar en 4h). Si un advisor humano manda un mensaje manual, el bot se duerme 4h — ¿eso contradice "stay available for basic questions after handoff"? Vale la pena aclarar el comportamiento esperado.

### Hallazgo (2026-07-09): "Setup your Actions" en Bot Goals — sí hay acciones nativas

Al hacer scroll en **Bot Goals** apareció una sección **"Setup your Actions"** con 6 tipos de acción configurables:

| Acción | Estado visto | Qué resuelve |
|---|---|---|
| **Appointment Booking** | Sin badge (¿sin configurar o 0?) | Booking real de calendario — hay que abrir y ver si ya apunta a Showroom/BDC o está vacía. |
| **Trigger a Workflow** | Sin badge | Puede disparar los workflows de GHL que ya existen (`Workflow Contactado`, `Workflow Crear Oportunidad`) — esta es la conexión al pipeline que buscábamos. |
| **Contact Info** | **6** configurados | Ya hay **6 campos de contacto mapeados** — probablemente los custom fields de calificación. Hay que abrir y confirmar cuáles son exactamente (¿coinciden con `vehicle_interest`, `payment_method`, etc.?). |
| **Stop Bot** | Sin badge | Condición para detener al bot (opt-out, quejas). |
| **Human Handover** | Sin badge | El mecanismo real detrás de todo el "advisor escalation" del prompt. |
| **Transfer Bot** | Sin badge | Transferencia a otro bot (¿tal vez usado entre Asistente Social/Nocturno originalmente?). |
| **Auto Followup** | **1** configurado | Ya hay **1 regla de seguimiento automático** — esto podría ser justo el mecanismo de "recontacto" que pedía la filosofía comercial del cliente, ya construido. |

> [!important] Esto cambia el diagnóstico
> El bot **no está desconectado del CRM como pensábamos** — tiene acciones nativas y al menos 2 de ellas (Contact Info: 6, Auto Followup: 1) **ya tienen configuración cargada**. El "no funciona bien" del cliente puede deberse solo a que está en `Off`, no a que falte esta capa de integración. **Antes de tocar nada, hay que abrir cada una de estas 6 tarjetas y documentar qué contienen ahora mismo** (especialmente Contact Info y Auto Followup, que ya tienen datos).

### Confirmado (2026-07-09): "Contact Info" — mapeo real a 6 custom fields

Se abrió la acción **Contact Info** y tiene 6 sub-acciones, cada una mapeada a un campo del contacto (`Which contact field to be updated`):

| Sub-acción (Action name) | Campo del contacto mapeado | Instrucción / valores permitidos |
|---|---|---|
| `language_preference` | **Lenguaje Preferido** (`contact.language_preference`) | Guarda el idioma detectado. Ejemplos: `Spanish`, `English`. |
| `customer_location` | **City** *(campo estándar de GHL, no un custom field)* | "Save the city, state, or area mentioned by the customer. Store the exact wording." |
| `ai_conversation_summary` | **Resumen AI** (`contact.resumen_ai`) | "Continuously update a structured internal summary of the conversation." Ejemplos: `Vehicle Interest: SUV under $18k Payment Type: Fi...`, `Vehicle Interest: 2021 Ford F-150 Payment Type: C...` |
| `payment_type` | **Metodo de Pago** (`contact.payment_method`) | Valores permitidos: `Cash`, `Financing`, `Not sure`. |
| `buying_timeline` | **Tiempo estimado de compra** | "Save the urgency level based on the customer's timeline." Valores: `Buying today`, `This week`, `Just browsing`. |
| `vehicle_interest` | **Interes de Vehiculo** (`contact.vehicle_interest`) | "Save the exact vehicle make, model, year, or vehicle type mentioned." Ejemplos: `2020 Toyota Corolla`, `SUV under 20k`, `Honda Civic`. |

**Confirmado: mapeo completo y bien diseñado.** 5 de 6 apuntan exactamente a los custom fields que ya habíamos catalogado en [[Carwarriors - Inventario GHL]]. La única sorpresa es `customer_location` → usa el campo estándar **City** del contacto (no un custom field) — está bien, solo hay que saberlo para no buscarlo entre los custom fields la próxima vez. Cada sub-acción trae instrucción + Output Examples bien calibrados (valores controlados tipo enum para payment_type y buying_timeline, texto libre estructurado para vehicle_interest y ai_conversation_summary).

> [!warning] Limitación importante detectada
> El panel dice explícitamente: **"This action update empty fields only."** — o sea, **solo llena el campo si está vacío**; si un contacto ya tiene algo cargado en `vehicle_interest` (de una interacción anterior, o de un lead viejo importado), el bot **no lo va a actualizar** aunque el cliente diga algo distinto en la nueva conversación. Esto es relevante para leads reactivados o recurrentes — puede dejar información desactualizada sin que nadie se entere. Vale la pena decidir si esto es aceptable o si hace falta un mecanismo aparte (workflow) para refrescar campos en reconversaciones.
>
> También dice: **"After adding this action, ensure your prompt includes the questions. The bot will only update contact fields if the contact provides the necessary information."** — es decir, esta capa depende 100% de que el **Qualification Flow** (Bot Goals) siga preguntando esos datos. Buena noticia: el Qualification Flow ya cubre casi 1 a 1 estos campos (Vehicle intent → `vehicle_interest`, Location → `customer_location`, Timing → `buying_timeline`, Payment path → `payment_type`) — están bien alineados entre sí.

### Confirmado (2026-07-09): "Auto Followup" — 1 escenario activo de 3 posibles

| Escenario | Estado | Configuración |
|---|---|---|
| **Contact Stopped Replying** | **On** | 1 follow-up configurado: a **1 hora**, con "Let AI Send The Message" activado (el bot redacta y envía solo), "Trigger Workflow" desactivado. Se pueden agregar hasta 5 follow-ups en secuencia — hoy solo hay 1. |
| **Contact is Busy** | Off | Sin configurar. |
| **Contact Requested** *(follow-up)* | Off | Sin configurar. |

> [!note] Encaja con la calibración ya decidida
> 1 follow-up a 1 hora es una cadencia moderada — no hace falta tocarlo para cumplir "urgencia moderada sin tocar límites de re-contacto". **Pregunta abierta para el cliente:** ¿activar también "Contact is Busy" y "Contact Requested"? Esto no es subir agresividad (no toca el límite de 3 mensajes ni el opt-out), es simplemente usar una capacidad nativa que hoy está apagada — vale la pena decidirlo aparte de la calibración de tono.

### Confirmado (2026-07-09): "Appointment Booking" — sin configurar, en proceso

Al abrir esta acción aparece un wizard de 2 pasos (**Calendar Selection → Advanced Options**) que **todavía no tiene ningún calendario elegido** — confirma que hoy el bot no puede agendar directamente (coincide con el prompt: "Never promise an appointment is confirmed unless verified").

Opciones disponibles:
- **Single calendar**: un solo calendario para todo booking.
- **Multi calendars**: la IA elige entre varios según el contexto de la conversación.

Calendarios detectados en el selector: `BDC Callback`, `Maria Eleonor Zurita's Personal Calendar`, `Showroom — Advisors`, `BDC‑A — Morning & Late (Phone/WhatsApp)`, `Calendario BDC‑B — Day (Phone/WhatsApp)`.

> [!important] Recomendación: configurar esto de verdad, con "Multi calendars"
> Configurar Appointment Booking **resuelve mejor** la regla "never promise unless verified" del prompt: en vez de que el bot solo *sugiera* una ventana y un humano confirme después, el bot puede **agendar de verdad** — ahí la cita queda verificada porque existe en el calendario, no es una promesa vacía. Recomendación concreta:
> - Elegir **Multi calendars**.
> - Asignar **Showroom — Advisors** (cuando el cliente acepta visita presencial) y **BDC‑A** / **BDC‑B — Phone/WhatsApp** (cuando prefiere llamada o seguimiento remoto).
> - No asignar `BDC Callback` ni el calendario personal de Maria Eleonor Zurita a menos que el cliente confirme que deben ser parte del flujo de IA (podrían ser de uso exclusivo humano).
>
> Esto es un cambio de diseño real (de "solo sugiere" a "agenda de verdad") — conviene confirmarlo con el cliente antes de guardarlo, aunque técnicamente ya estaba caminando hacia ahí.

### Bug/hallazgo (2026-07-09): "BDC‑A — Morning & Late" no se puede usar en Appointment Booking

Al armar Appointment Booking con Multi calendars (`BDC-A`, `BDC-B`, `Showroom — Advisors`), GHL mostró el error: **"One or more calendars are inactive/deleted. Please activate the calendar(s)."**

Causa probable (cruzando con el inventario de calendarios sacado por API el mismo día): **BDC‑A — Morning & Late (Phone/WhatsApp) tiene `teamMembers: []` — sin ningún asesor asignado.** Los otros 4 calendarios (BDC Callback, Showroom — Advisors, Calendario BDC‑B, y hasta el personal de Maria Eleonor) sí tienen al menos un miembro de equipo asignado. Sin nadie asignado, GHL no lo deja usar para booking real.

**Decisión inmediata:** se quita BDC‑A de la selección y se continúa con **Showroom — Advisors + Calendario BDC‑B — Day** únicamente.

**Pendiente aparte:** revisar en GHL → Calendars → BDC‑A si hace falta asignarle un asesor, o si fue dado de baja a propósito (cubre turno de madrugada/tarde-noche — confirmar con el cliente si ese turno sigue en uso).

### Configurado (2026-07-09): Appointment Booking — Advanced Options + "Trigger a Workflow"

Appointment Booking quedó armado con **Multi calendars: Showroom — Advisors + Calendario BDC‑B — Day**, AI Description y keywords por calendario, fallback a Showroom.

Además se configuró la acción independiente **"Trigger a Workflow"** (distinta del checkbox interno de Appointment Booking) con 2 triggers:

| Trigger | Workflow | Condición |
|---|---|---|
| Trigger Workflow 1 | `Workflow Contactado` | "Trigger when the customer replies for the first time in the conversation (first real exchange, not just the initial automated greeting)." |
| Trigger Workflow 2 | `Workflow Crear Oportunidad` | "Trigger once vehicle interest and payment type have been captured from the customer — this marks them as a qualified lead ready for pipeline entry." |

Esto conecta el bot al pipeline: primer contacto real → `Workflow Contactado`; calificación mínima lograda (vehículo + método de pago) → `Workflow Crear Oportunidad`. Sigue pendiente confirmar si el checkbox "Trigger workflow after booking" dentro de Appointment Booking (paso 3, Advanced Options) también se activó con un tercer workflow para cuando se **confirma la cita** (sería el paso final: Pre Cita → Agendado Cita).

### Confirmado (2026-07-09): "Human Handover" — pre-armado pero apagado, sin usuario asignado

Al abrir esta acción aparecieron **3 escenarios**, todos en **Off**:

| Escenario | Estado | Configuración ya cargada |
|---|---|---|
| **Human Requested** | Off | Trigger Condition: "Direct request to speak with human". Example Phrases: "I want to talk to the manager", "I want to talk to a human". Final Message: "Sure! I'm transferring your request to a human agent. Someone from the tea[m]...". Reactivate bot after: **8 horas**. Create a task on the contact: activado. Tag: `human handover`. **Assign Conversation to a Specific User: vacío.** |
| **Lack of information** | Off | Sin abrir todavía. |
| **Failed to resolve issue** | Off | Sin abrir todavía. |

Al abrir el selector de usuario aparecieron 3 opciones: **Bianca Marketing**, **Carlos Cisneros**, **Nallely de Leon**. Bianca ya se conocía (marketing) — Carlos y Nallely son nombres nuevos, no catalogados antes, probablemente equipo BDC/ventas real. **No se asignó todavía — falta que el cliente confirme quién debe recibir estos hand-offs** (ver preguntas pendientes #1-2).

> [!important] Mismo patrón que Appointment Booking y Auto Followup
> Otra vez: la lógica ya estaba diseñada con cuidado (condición, frases, mensaje, reactivación, tarea, tag) — solo faltaba **encenderla y asignarle un usuario**. Confirma la conclusión general de todo este documento: el trabajo es activar y conectar, no construir desde cero.

### Plan para la promo (Tesla) — Knowledge Base en vez de prompt

1. Quitar de **Additional Info** el bloque fijo `"Current approved active campaign: Tesla promo..."`.
2. Reemplazarlo por una regla genérica: `"Check Knowledge Base for the current approved active campaign before offering exact promo numbers. If none is listed there, no exact numbers are approved."`
3. Crear en **Knowledge Base** una entrada tipo "Campañas activas" con el detalle de la promo vigente (hoy: Tesla $1,000 down / $399/mes).
4. Cuando la campaña cambie o termine, solo se edita/borra esa entrada de Knowledge Base — sin tocar Additional Info ni Bot Goals.

> [!important] Decisión
> Se descarta el prompt genérico que se había redactado en la primera versión de este documento (sección "Prompt / Instrucciones del agente" más abajo, marcada como SUPERSEDIDA). El de producción real (Personality + Bot Goals + Additional Information, arriba) es sustancialmente mejor — el trabajo pendiente es extenderlo (canales, custom fields, pipeline, conexión con workflows de campaña) y activarlo, no reescribirlo.

---

## Por qué construir esto en GHL nativo (Conversation AI) y no en n8n

Ya existe la infraestructura de soporte construida en GHL que este agente debe usar, no duplicar:

- **Custom fields** ya definidos para capturar la calificación: `vehicle_interest`, `motivo_de_compra`, `tiempo_estimado_de_compra`, `payment_method`, `preferred_contact`, `preferred_channel`, `preferred_time`, `language_preference`, `resumen_ai`.
- **Calendarios** ya configurados: `Showroom — Advisors` (visita/test drive presencial), `BDC‑A` / `BDC‑B` (llamada o WhatsApp de seguimiento).
- **Pipeline** `CarWarriors – Venta & Financing` con las etapas exactas que este agente debe mover: Nuevo Lead → Contactado → Seguimiento → Pre Cita → Agendado Cita.
- **Workflows** ya existentes que probablemente deban disparar acciones cuando el agente etiquete/mueva algo: `Workflow Contactado`, `Workflow Crear Oportunidad`, `Workflow Asig Agente (Entrada)`.

Construir el agente conversacional en n8n implicaría recrear todo esto (webhooks, actualización de custom fields, movimiento de pipeline, booking de calendario) cuando GHL ya lo resuelve nativo dentro de Conversation AI. n8n queda reservado para lo que GHL no puede hacer (ver nota de arquitectura anterior: DealerCenter, memoria vectorial, etc.).

---

## Filosofía comercial del cliente (BDC) — tensión directa con reglas ya cargadas en el bot

El cliente describió así cómo debe operar el BDC (2026-07-09), en sus propias palabras:

> "Cuando alguien deja sus datos por un auto, no lo dejamos enfriar ni un segundo. La idea es agarrar al cliente en caliente y hacer que agende la cita ya [...] El BDC no está para charlar o esperar a que el cliente decida solo. Su trabajo es insistir, volver a llamar, mandar mensajes, ofrecer horarios, alternativas, recordarle que hay otras personas interesadas y que esa unidad no dura [...] Es una presión estratégica: no queremos que piense demasiado porque pensar = enfriarse = perder la venta. Pero tampoco es molestar al punto de quemarlo."

Mentalidad resumida por el propio cliente: no aceptar "después veo" ni "solo estoy mirando", no soltar al cliente, insistencia (llamadas múltiples, mensajes seguidos, cambio de enfoque si no responde), presión emocional de oportunidad/timing/escasez ("este auto no dura", "hay más gente interesada"). El cliente mismo reconoce el riesgo: *"si lo llevás al extremo podés quemar leads, generar rechazo, bajar la calidad de la experiencia."*

### Conflicto directo con el prompt de producción actual

| Regla ya cargada en el bot (Bot Goals) | Filosofía del cliente |
|---|---|
| "Do not suggest a visit in the first message." / "Introduce visit after 2-3 meaningful exchanges" | "Hacer que agende la cita ya" — no esperar. |
| "Never push aggressively." | "Su trabajo es insistir" / "presión estratégica". |
| "Do not escalate more than once within a 3-message window." / "Never send generic 'just checking in'." | "Insistencia: múltiples llamadas, mensajes seguidos" / "recontacto hasta reactivar". |
| No usa lenguaje de escasez en ningún ejemplo (few-shot) | "Recordarle que hay otras personas interesadas y que esa unidad no dura." |

> [!important] Esto no se resuelve solo — es una decisión de producto/riesgo del cliente
> Meter urgencia/escasez y re-contacto agresivo en un **bot de IA por WhatsApp/SMS/IG/FB** tiene riesgos distintos a que lo haga un vendedor humano por teléfono:
> - Si la escasez es **falsa** (no hay realmente otro interesado), es una práctica de marketing engañoso (riesgo FTC/reputacional) — distinto a que un vendedor humano use su criterio caso a caso.
> - Re-contacto automatizado insistente por SMS/WhatsApp tiene reglas de opt-out/spam más estrictas que una llamada humana (WhatsApp Business y operadores de SMS penalizan patrones de mensajería agresiva — puede bloquear el número).
> - El prompt actual ("Never push aggressively", límite de 1 escalamiento por ventana de 3 mensajes, no "just checking in") probablemente **se escribió a propósito así** por alguien que ya conocía estos riesgos — no fue un descuido.
>
> **No se debe reescribir el prompt hacia "presión total" sin que el cliente decida explícitamente el nivel de agresividad que quiere para el canal de IA específicamente** (puede ser distinto al que quiere para el BDC humano por teléfono).

### Conexión con hallazgo anterior: "Asignación por Turno" / "Reintento de Asignación por Turno"

Esto explica por qué existen esos 2 workflows con reintentos agresivos (ver [[Carwarriors - Inventario GHL]]) — encajan con la filosofía de "no soltar al cliente". Pero **no explica ni justifica los 74 millones de inscritos** detectados ahí — esa cifra sigue siendo una anomalía técnica (bucle) y no "mucha insistencia intencional". Ambas cosas pueden ser ciertas a la vez: la intención de diseño es agresiva Y hay un bug de loop encima.

### Decisión calibrada con el cliente (2026-07-09)

| Punto | Decisión |
|---|---|
| **Nivel de presión en el bot de IA** | **Urgencia moderada, sin tocar límites de re-contacto.** Se acorta el gating de visita (ofrecerla apenas se confirme el vehículo de interés, no esperar 2-3 turnos), pero el límite de "1 escalamiento por ventana de 3 mensajes" y el opt-out **se mantienen tal cual están** — la insistencia agresiva (llamadas múltiples, mensajes seguidos, reintentos sin techo) queda reservada al **BDC humano** por teléfono/WhatsApp manual, no al bot. |
| **Lenguaje de escasez ("hay otra gente interesada", "no dura")** | **Solo cuando sea verificable** — únicamente si hay un dato real que lo respalde (ej. otro lead activo en la misma unidad según el pipeline/custom field). No se usa como recurso retórico genérico. |

Cambios concretos a aplicar en **Bot Goals** (sección Visit Rules):
- Cambiar `"Do not introduce visit until vehicle type, year range, use case, and timing are known."` → introducir la visita apenas se confirme el **vehículo de interés** (paso 1), sin esperar los 4 datos completos.
- Mantener sin cambios: `"Do not escalate more than once within a 3-message window."`, `"Never send generic 'just checking in'."`, y toda regla de opt-out.
- Agregar una condición explícita a cualquier lenguaje de disponibilidad limitada: solo permitido si es un hecho verificable desde el CRM, nunca como frase genérica de presión.

> Esto define el bot. La insistencia fuerte que pidió el cliente (recontacto, llamadas, "no soltar al cliente") sigue viva a nivel de **BDC humano + workflows de asignación/reintento** (`Asignación por Turno`, `Reintento de Asignación por Turno`) — no se traslada al canal de IA.

---

## Documento fuente del cliente: "AUTOMATIZACION" (2026-07-09)

El cliente entregó el documento original que sirvió de base al roadmap ya registrado en [[Carwarriors LLC]] (Módulos A-F). Confirma el mismo alcance — no agrega módulos nuevos, pero aclara **prioridad #1 explícita del cliente**:

> "Chatbot (arreglar lo que ya tenemos y POTENCIARLO) — Revisar el chatbot actual y detectar por qué no funciona bien. Armar flujos nuevos que realmente conviertan (no respuestas genéricas). Crear distintos recorridos según: Lead nuevo / Seguimiento / Lead frío (reactivación). Conectar todo bien con el CRM / Dealer Center. Automatizar derivación a vendedores según disponibilidad o rendimiento. Crear mensajes automáticos tipo: seguimiento / urgencia (últimas unidades, etc.). Testear constantemente y optimizar."

> [!important] "Por qué no funciona bien" tiene ahora una respuesta concreta
> No es que el prompt esté mal escrito — al revisarlo (Personality + Bot Goals + Additional Info) es sólido. **No funciona porque está apagado (`Off`) y no está conectado al CRM** (no escribe custom fields ni mueve pipeline, ver sección de hallazgos arriba). El "arreglar" real es activación + conexión, no reescritura desde cero — coincide con la conclusión a la que ya habíamos llegado.

El resto del documento (automatización Dealer Center, contabilidad, marketing, IA scoring, soporte BDC) coincide con los Módulos B-F del roadmap existente — sin cambios de alcance ahí. Las automatizaciones de ManyChat que cita el documento (Story+palabra clave, saludo a nuevos seguidores, comentarios en post/reel) también coinciden exactamente con lo ya documentado en [[Carwarriors LLC]] — se confirma que esa transcripción era precisa.

---

## Configuración a crear en GHL → AI Agents → Agent Studio

### 1. Datos generales
- **Nombre:** `Asistente CarWarriors 24/7` (o el nombre que prefiera el cliente)
- **Estado:** Primary agent para los canales: WhatsApp, Instagram, Facebook, **SMS**
- **Importante:** al asignarlo como primary en estos 4 canales, GHL automáticamente deja de enrutar esos canales a "Asistente Social" y "Asistente Nocturno" — solo entonces apagar esos dos (Off), para no dejar un hueco sin cobertura durante la transición.
- **Nota SMS:** el prompt/tono no cambia por canal, pero SMS suele tener límite de longitud de mensaje y sin formato enriquecido (sin botones, negritas, etc.) — verificar en Agent Studio si hay un ajuste de "modo texto plano" o límite de caracteres específico para ese canal antes de publicar.

### 2. Prompt / Instrucciones del agente

> [!danger] SUPERSEDIDO — no usar
> Este era un borrador genérico escrito antes de conocer el prompt real ya cargado en "Asistente Social" (ver sección "Hallazgo — el Personality ya cargado" más arriba, con Personality + Bot Goals + Additional Information reales). Se deja aquí solo como referencia histórica de qué se planteó al inicio. El prompt de producción es el de arriba.

```
Eres el asistente virtual de CarWarriors, un dealer de autos usados en Miami, FL.
Atiendes por WhatsApp, Instagram y Facebook, las 24 horas.

TU OBJETIVO:
1. Saludar y entender qué busca el cliente (tipo de auto, marca, uso).
2. Calificar el lead con estas preguntas, de forma natural y conversacional (no como formulario):
   - ¿Qué vehículo le interesa? (marca/modelo, o "vio un listing" -> pedir cuál)
   - ¿Cuál es su método de pago preferido? (contado, financiamiento, trade-in)
   - ¿Cuál es su motivo principal de compra?
   - ¿En cuánto tiempo piensa comprar? (inmediato, este mes, explorando)
   - ¿Prefiere que lo contacten por llamada o WhatsApp, y en qué horario?
3. Si el cliente muestra intención real de compra (no solo curiosidad), ofrece agendar
   una cita en el showroom o una llamada con un asesor, y agenda directamente en el
   calendario correspondiente.
4. Si el cliente pide hablar con una persona, se queja, negocia precio de forma agresiva,
   o la conversación se sale de lo que puedes resolver, escala a un humano de inmediato
   y avisa: "Te voy a conectar con uno de nuestros asesores para ayudarte mejor."

TONO: cercano, en español (o inglés si el cliente escribe en inglés — responde en el
mismo idioma), sin sonar robótico ni repetir "como IA no puedo...". Nunca inventes
precios, disponibilidad de inventario específico ni condiciones de financiamiento que
no estén en la base de conocimiento — si no lo sabes, ofrece conectar con un asesor.

NO HAGAS:
- No prometas descuentos, precios exactos o aprobación de crédito.
- No agendes una cita sin haber calificado al menos vehículo de interés + método de pago.
- No continúes insistiendo si el cliente pide explícitamente no ser contactado — marca
  la conversación para revisión y detente.
```

> Ajustar tono/preguntas exactas junto con Jorge/Bianca antes de publicar — esto es un punto de partida, no el texto final.

### 3. Mapeo a custom fields (qué debe guardar el agente en cada respuesta)

| Pregunta del agente | Custom field a actualizar |
|---|---|
| Vehículo de interés | `vehicle_interest`, `listing_code` / `listing_id` si vino de un listing |
| Método de pago | `payment_method` |
| Motivo de compra | `motivo_de_compra__necesidad_principal` |
| Tiempo estimado de compra | `tiempo_estimado_de_compra` |
| Preferencia de contacto | `preferred_contact` (Call / WhatsApp), `preferred_channel`, `preferred_time` |
| Idioma detectado | `language_preference` |
| Resumen de la conversación | `resumen_ai` (para que el asesor humano no tenga que releer todo) |

### 4. Booking / calendario
- Si el cliente acepta cita presencial → calendario **Showroom — Advisors**.
- Si prefiere llamada/WhatsApp de seguimiento → calendario **BDC‑A** o **BDC‑B** según horario.

### 5. Movimiento de pipeline
El agente (o un workflow disparado por su actividad) debe mover la oportunidad:
`Nuevo Lead` → `Contactado` (primer intercambio real) → `Pre Cita` (calificado, aceptó posible cita) → `Agendado Cita` (booking confirmado).

> Confirmar en GHL si Conversation AI puede mover pipeline stage nativamente o si hace falta un workflow puente (ej. trigger "tag agregado por IA" → mueve stage). Si no hay acción nativa, aprovechar `Workflow Contactado` / `Workflow Crear Oportunidad` que ya existen.

### 6. Escalamiento a humano
Condiciones de salida obligatorias (definir como reglas del agente en Agent Studio, no solo en el prompt):
- Cliente pide explícitamente "hablar con una persona" / "asesor" / "humano".
- Cliente se queja o menciona una mala experiencia previa.
- Cliente pide precio exacto, aprobación de crédito, o negocia agresivamente.
- Cliente pide no ser contactado (opt-out).

---

## Checklist de implementación

**Confirmar antes de tocar nada:**
- [x] ~~Preguntar si existe acción nativa para custom fields/pipeline~~ → Confirmado: sí, sección "Setup your Actions" en Bot Goals (Appointment Booking, Trigger a Workflow, Contact Info, Stop Bot, Human Handover, Transfer Bot, Auto Followup).
- [x] Abrir **Contact Info** — mapeo de los 6 campos confirmado y documentado arriba.
- [x] Abrir **Auto Followup** — 1 de 3 escenarios activo (Contact Stopped Replying, 1h, IA envía sola).
- [x] Abrir **Appointment Booking** — sin configurar todavía (wizard vacío).
- [ ] **Decisión con el cliente:** ¿activar "Contact is Busy" y "Contact Requested" en Auto Followup? (no es más agresivo, solo usar capacidad ya existente).
- [ ] **Decisión con el cliente:** confirmar configurar Appointment Booking en modo "Multi calendars" con Showroom — Advisors + BDC‑A/BDC‑B, para que el bot agende de verdad en vez de solo sugerir.
- [ ] Confirmar si `BDC Callback` y el calendario personal de Maria Eleonor Zurita deben incluirse o quedar fuera del alcance de la IA.
- [ ] Decidir si se mantiene "no booking automático, solo sugerencia de ventana + handoff a advisor" (diseño actual) o se pasa a booking directo en calendario — recomendación: **mantenerlo como está**, es más seguro y ya fue diseñado a propósito así.
- [ ] Aclarar la interacción entre "Send bot to sleep 4h tras mensaje manual/workflow" (Bot Settings) y "Stay available for basic questions after handoff" (Additional Info) — parecen contradecirse.
- [ ] Confirmar con Jorge/Bianca si la promo Tesla ($1,000 down / $399/mes) sigue activa o ya cambió — es la única data "viva" hardcodeada en el prompt.

**Cambios a aplicar:**
- [x] Renombrar el bot a `Asistente CarWarriors 24/7`.
- [x] Agregar **SMS** a los canales soportados (ya tiene IG, FB, WhatsApp).
- [x] Actualizar la línea "Qualify inbound Facebook and Instagram DM leads" en Bot Goals para incluir WhatsApp y SMS.
- [x] Editar Visit Rules: introducir la visita apenas se confirme vehículo de interés (no esperar 2-3 exchanges).
- [x] Agregar condición de "solo verificable" al lenguaje de disponibilidad limitada/interés de terceros.
- [x] Mover la promo Tesla de Additional Info a **Knowledge Base** (artículo dentro de PRINCIPAL, activa para todas las consultas).
- [ ] (Opcional, mejora futura) Conectar la "Approved Campaign Exception" a los custom fields/tags que ya generan los workflows `Detect $999 Down Campaign`, `Detect Cero Down Campaign`, etc. — en vez de mantenerla fija en el texto.
- [ ] Cargar/confirmar Knowledge Base con inventario real (si no está ya integrada).
- [ ] Revisar si 15 mensajes máx. por conversación alcanza para todo el flujo de calificación + escalamiento.

**Human Handover:**
- [x] Revisar configuración existente de los 3 escenarios — "Human Requested" ya viene pre-armado (condición, frases, mensaje, reactivación 8h, tarea, tag), solo apagado y sin usuario.
- [ ] Elegir usuario (Carlos Cisneros o Nallely de Leon — confirmar con el cliente) y activar el escenario "Human Requested".
- [ ] Abrir y configurar (o confirmar) los escenarios "Lack of information" y "Failed to resolve issue".

**Activación:**
- [ ] Cambiar **Set Bot Status** de `Off` a **`Auto Pilot`** — solo al final, cuando todo lo anterior esté listo.
- [ ] Apagar (u eliminar) "Asistente Nocturno CarWarriors" **solo después** de confirmar que el bot renombrado ya cubre WhatsApp+SMS+IG+FB en Auto Pilot y funciona bien.
- [ ] Probar con conversaciones reales ("AI bot trial") antes de anunciar al equipo BDC.
- [ ] Monitorear primeras 48h: revisar `Agent Logs` y si los custom fields del CRM se están llenando o siguen vacíos (esto responde la pregunta #1 de esta lista).

## Preguntas pendientes para el equipo de Carwarriors (2026-07-09)

### Personas / responsables
1. **¿Quién debe recibir el hand-off cuando un cliente pide hablar con una persona?** Las opciones en GHL son: Bianca Marketing, Carlos Cisneros, Nallely de Leon. Bianca es marketing, no atención en vivo — ¿Carlos o Nallely son del equipo BDC/ventas? ¿Alguno de los dos maneja hoy los calendarios Showroom/BDC?
2. ¿La misma persona debe asignarse también a los escenarios **"Lack of information"** y **"Failed to resolve issue"** de Human Handover, o alguien distinto?
3. Si se activa "Transfer Employee post appointment booking" (Advanced Options de Appointment Booking), ¿a quién se transfiere tras agendar una cita?

### Calendarios / booking
4. **BDC‑A — Morning & Late (Phone/WhatsApp)** no tiene ningún asesor asignado (`teamMembers` vacío) y GHL no deja usarlo en booking. ¿Se le asigna alguien, o ese turno (madrugada/tarde-noche) ya no está en uso?
5. ¿Aceptan que el bot **agende de verdad** en Showroom/BDC‑B (en vez de solo sugerir una ventana y que un humano confirme, como estaba diseñado originalmente)?
6. ¿Se incluyen `BDC Callback` y el calendario personal de Maria Eleonor Zurita en el alcance de la IA, o quedan exclusivamente para uso humano (decisión tomada por ahora: dejarlos fuera)?

### Contenido / vigencia de datos
7. ¿Sigue vigente la promo **Tesla $1,000 down / $399/mes**? (se está moviendo a Knowledge Base para que se pueda actualizar sin tocar el prompt).
8. ¿Hace falta cargar/actualizar el inventario real en Knowledge Base, o ya está integrado de alguna forma que no hemos visto?

### Comportamiento del bot
9. Hay una posible contradicción: Bot Settings dice que el bot "se duerme" 4h si un humano manda un mensaje manual, pero el prompt (Additional Info) dice "stay available for basic questions after handoff". ¿Cuál es el comportamiento que realmente quieren tras un hand-off — silencio total, o que el bot siga respondiendo cosas básicas mientras un humano atiende lo importante?
10. ¿Activar los escenarios **"Contact is Busy"** y **"Contact Requested"** de Auto Followup (hoy apagados, solo "Contact Stopped Replying" está activo)? No es más agresivo, solo activa una función ya existente.
11. ¿Se activa "Allow bot to cancel/reschedule the appointment" desde ya, o se prueba primero sin esas opciones y se agregan más adelante?

### Hallazgos técnicos a auditar (no son preguntas de negocio, pero requieren revisión con soporte GHL o el equipo técnico)
12. Los workflows **"Asignación por Turno (Control Principal)"** y **"Reintento de Asignación por Turno"** tienen **74 millones de inscritos** cada uno — cifra imposible para el volumen real de leads. Parece un bucle/bug que podría estar generando costo de cuota en GHL. Requiere auditoría antes de construir nada encima.
13. ¿Qué aparece en la pestaña **"Needs review (1)"** de Workflows?
14. El workflow **"N8N"** (draft, dentro de la carpeta "Agente AI") tiene **6 inscritos activos ahora mismo** — algo lo sigue alimentando. ¿Qué es y para qué se usa?

## Relacionado

- [[Carwarriors - Inventario GHL]]
- [[Carwarriors LLC]]
- [[Carwarriors - Infraestructura (Diseño)]]
