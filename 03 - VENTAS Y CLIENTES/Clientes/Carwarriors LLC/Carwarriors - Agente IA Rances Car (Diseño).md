---
tags: [forjado, carwarriors, rancescar, gohighlevel, ia, agente-conversacional]
tipo: spec
cliente: Carwarriors LLC (subcuenta Rances Car)
estado: en-implementación
creado: 2026-07-17
actualizado: 2026-07-17
---

# Agente IA — Rances Car (subcuenta hermana de Carwarriors LLC)

## Estado actual (resumen ejecutivo — 2026-07-17)

El equipo estaba construyendo el bot conversacional de **Rances Car** en otra PC, replicando el trabajo ya validado en [[Carwarriors - Agente IA 24-7 (Diseño)]], cuando **se cortó la electricidad y la sesión quedó a medias**. Este documento retoma el levantamiento desde cero, entrando vía API + navegador (Playwright) porque el Agent Studio / Conversation AI de GHL no tiene API pública.

**Acceso nuevo documentado hoy:**
- Token API de Rances Car (`pit-c30b22ca-d09c-45a4-967e-8b75e574a783`) — confirmado por prueba directa contra la API, ver [[Carwarriors LLC]] para el detalle completo (Location ID, Company ID, snapshot).
- Acceso de navegador vía Playwright con credenciales propias del usuario (`jcalderon900610@gmail.com`), no las de agencia (`carwarriors2020@gmail.com`). El 2FA de esta cuenta llega por **correo electrónico**, no por SMS a Jorge González — más rápido de resolver que el flujo documentado para la cuenta de agencia.

## Inventario de agentes IA encontrados en Rances Car

Hay **dos sistemas de bot distintos** dentro de "AI Agents", y el trabajo real está en el segundo:

1. **Agent Studio (canvas nuevo / "SuperAgents")** → 1 agente: `New Untitled Agent`, estado `Draft`, creado 20 oct 2025. Contiene únicamente un nodo "Start trigger" sin conectar a nada — parece un experimento abandonado, no el bot que se estaba construyendo hoy.
2. **Conversation AI (paradigma clásico, el mismo que usa "Asistente Social CarWarriors")** → 2 agentes, ambos actualizados **hoy 17 jul 2026, 10:00 AM** (justo antes del corte de luz):
   - **Agente Social RancesCar** — `Off`, canales Facebook/Instagram/+2 — **este es el que se estaba armando**.
   - **Agente Nocturno RancesCar** — `Off`, canal SMS — aún sin abrir/auditar en detalle.

## Confirmado: "Agente Social RancesCar" — prompt ya portado del original de Carwarriors LLC

**Bot Settings:**
- Canales ya configurados de una vez: **Facebook, Instagram, WhatsApp, SMS** (los 4 juntos — a diferencia de Carwarriors LLC, que empezó solo con 2 y se le fueron agregando).
- Advanced Settings: espera 15s antes de responder, máx. 20 mensajes por conversación, no responde a imágenes ni voice notes, se duerme con Manual Message y Workflow Message, reactiva a las **2 horas**.
- Bot Status: `Off`. No es Primary Bot todavía.

**Bot Training:** 1 Knowledge Base Trigger configurado ("Base de conocimiento", activo para todas las consultas).

**Bot Goals → Prompt (Personality + Goal + Additional Information):** ya escrito, es una copia casi literal del prompt de **producción original** de Carwarriors LLC (la versión de ANTES de las calibraciones del 2026-07-09/10), adaptado con datos propios:
- Personality: `"You are RC Miami Team, representing Rances Car..."` — igual estructura (tono, control de longitud, momentum, escalamiento por intención fuerte, validación emocional).
- Dirección: `3620 NW 27th Ave, Miami, FL 33142` (misma dirección física que Carwarriors LLC — negocios hermanos en el mismo lote).
- Teléfono/WhatsApp propios: `+1 (305) 763-7643` / `https://wa.me/13057637643`.
- Promo Tesla ($1,000 down / $399/mes) **sigue hardcodeada en Additional Info**, igual que estaba en el borrador original de Carwarriors LLC antes de moverla a Knowledge Base — sin confirmar todavía si esta promo aplica a Rances Car o si necesita su propia oferta.

> [!bug] Typo detectado
> En "Dealership Information" el nombre del negocio quedó escrito como **"Rancer Car"** en vez de "Rances Car" — corregir antes de publicar.

> [!warning] Este prompt NO tiene todavía las calibraciones ya validadas en Carwarriors LLC
> Falta aplicar los mismos ajustes que se hicieron para el bot de Carwarriors LLC tras las respuestas del cliente (ver [[Carwarriors - Comportamiento del Bot (Resumen)]]):
> - La línea de "Primary Objective" sigue diciendo `"Qualify inbound Facebook and Instagram DM leads"` — no menciona WhatsApp ni SMS, aunque esos 2 canales ya están habilitados en Bot Settings.
> - Visit Rules sigue en la versión larga (`"Do not introduce visit until vehicle type, year range, use case, and timing are known"`) — en Carwarriors se acortó a "ofrecer visita apenas se confirme el vehículo de interés".
> - `"Stay available for basic questions after handoff"` sigue presente en Escalation Rules — en Carwarriors se quitó porque el cliente confirmó que el comportamiento real es silencio total post hand-off.
> - La promo sigue en el prompt en vez de vivir en Knowledge Base.
> No está confirmado si el cliente quiere exactamente las mismas reglas de negocio para Rances Car o si hay matices propios de este dealer — asumir "igual que Carwarriors LLC" es un punto de partida razonable, no una decisión ya tomada.

## Sin revisar todavía (se cortó la luz antes de llegar aquí)

- **Setup your Actions** (Appointment Booking, Contact Info, Auto Followup, Human Handover, Trigger a Workflow, Stop Bot, Transfer Bot) — no se alcanzaron a abrir. Hace falta repetir el mismo levantamiento que se hizo para Carwarriors LLC: qué calendarios tiene Rances Car disponibles, qué custom fields están mapeados, quién debe recibir el Human Handover en este dealer (¿Nallely de Leon también, o alguien distinto asignado a Rances Car?).
- **Agente Nocturno RancesCar** — sin abrir, se desconoce su configuración.

## Hallazgo sin explicar: el dashboard de Conversation AI ya muestra actividad con el bot en `Off`

El tablero de Conversation AI (rango 2026-07-01 a 2026-07-17) reporta: **193 contactos únicos** (-26.62% vs. mes anterior), **0 acciones disparadas**, **0 citas agendadas**, **2.21 horas ahorradas** (-25.84% vs. mes anterior). Esto implica que hubo actividad de IA en algún momento reciente aunque ambos bots figuran `Off` ahora — puede ser que uno de los dos estuvo encendido parte del mes y se apagó, o que la métrica arrastra datos de un bot anterior/eliminado. **Pendiente aclarar con el cliente o revisando Agent Logs** antes de asumir que "no ha pasado nada" en este canal.

## Próximos pasos

1. Corregir el typo "Rancer Car" → "Rances Car" en Additional Information.
2. Decidir con el cliente si las calibraciones de Carwarriors LLC aplican igual a Rances Car (multi-canal en Goal, Visit Rules acortada, silencio post hand-off, promo en Knowledge Base) y aplicarlas.
3. Abrir y documentar "Setup your Actions" completo (Appointment Booking, Contact Info, Auto Followup, Human Handover) — mismo proceso que en [[Carwarriors - Agente IA 24-7 (Diseño)]].
4. Abrir "Agente Nocturno RancesCar" y documentar su estado.
5. Investigar el origen de los 193 contactos / 2.21h ahorradas con ambos bots en `Off` (revisar Agent Logs).
6. Solo al final: "Set as Primary Bot" + pasar a Auto Pilot, siguiendo el mismo checklist de activación ya usado en Carwarriors LLC.

## Relacionado
- [[Carwarriors LLC]]
- [[Carwarriors - Agente IA 24-7 (Diseño)]]
- [[Carwarriors - Comportamiento del Bot (Resumen)]]
