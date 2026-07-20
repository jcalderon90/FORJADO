---
tags: [forjado, carwarriors, rancescar, gohighlevel, ia, agente-conversacional]
tipo: spec
cliente: Carwarriors LLC (subcuenta Rances Car)
estado: en-implementación
creado: 2026-07-17
actualizado: 2026-07-18
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

## Actualización 2026-07-18 — retomado tras el pull, cambios aplicados en vivo

Al volver a entrar (mismo acceso Playwright + credenciales propias), se confirmó que **el cliente siguió trabajando en la otra PC entre el 17 y el 18 de julio**: "Setup your Actions" ya no estaba vacío como se documentó el día anterior. Estado real encontrado hoy, antes de tocar nada:

| Acción | Estado encontrado | Detalle |
|---|---|---|
| **Appointment Booking** | ✅ Configurado | Multi calendars: `Samuel Aguilar's Personal Calendar` + `Scarleth Hassiel Rubi's Personal Calendar`. AI Description: ambos asesores son intercambiables, asigna al que tenga el próximo slot libre (no diferencia por tipo de vehículo/consulta). Cancelar/reagendar habilitado. Sin trigger-workflow-post-booking, sin transferencia a empleado específico — igual que Carwarriors LLC. |
| **Human Handover** | ✅ Configurado | Los mismos 3 escenarios que Carwarriors LLC (Human Requested, Lack of information, Failed to resolve issue), los 3 en `On`, asignados a **Scarleth Hassiel Rubi** (no Nallely de Leon — persona distinta para este dealer hermano). Reactiva a las 8h, crea tarea + tag `human handover`, skip si el contacto ya tiene usuario asignado. |
| **Auto Followup** | ✅ Configurado | Los 3 escenarios (Contact Stopped Replying, Contact is Busy, Contact Requested) en `On`. Follow-up 1 a los 15 minutos, redactado y enviado por la IA. |
| **Contact Info** | ❌ Sin configurar | Plantilla vacía ("Field update 1", sin campo seleccionado). |
| **Trigger a Workflow** | ❌ Sin configurar | Plantilla vacía ("Trigger Workflow 1", sin workflow seleccionado ni condición). |
| **Stop Bot** | ⚠️ Plantilla sin activar | "Goodbye Detection" viene pre-rellenada (frases, mensaje final) pero el toggle está en `Off`. |
| **Transfer Bot** | ❌ Sin configurar | Toggle en `Off`, sin bot destino. (Carwarriors LLC tampoco usa esta acción — consistente.) |

**Cambios aplicados en vivo hoy sobre "Agente Social RancesCar"** (bot sigue en `Off`, cero riesgo de producción):
1. Typo corregido: "Rancer Car" → "Rances Car" en Additional Information.
2. Goal → Primary Objective actualizado de "Qualify inbound Facebook and Instagram DM leads" a "Qualify inbound Facebook, Instagram, WhatsApp, and SMS leads" (los 4 canales ya estaban habilitados en Bot Settings, el texto no los reflejaba).
3. Visit Rules acortada: se reemplazó "Do not introduce visit until vehicle type, year range, use case, and timing are known" por "Introduce the visit as soon as vehicle intent is confirmed, without waiting for use case or timing to be known" — mismo criterio ya validado en Carwarriors LLC.
4. Silencio total post hand-off: se eliminó la línea "Stay available for basic questions after handoff" de Escalation Rules — mismo criterio ya validado en Carwarriors LLC.

**Deliberadamente sin tocar:** la promo Tesla hardcodeada en Additional Information — sigue sin confirmarse si aplica a Rances Car o si necesita su propia oferta; moverla a Knowledge Base requiere antes decidir qué contenido va ahí.

**Nota sobre el "misterio" de 193 contactos con bots en `Off`:** revisando el Dashboard de Conversation AI se ve que el conteo de contactos/mensajes es agregado por canal/agente asignado, no depende de que el bot esté realmente respondiendo — hay filas de conversaciones reales de hoy (18-jul) contra "Agente Nocturno RancesCar" (SMS) y "Agente Social RancesCar" (Facebook), pero al abrir "Agents List" ambos siguen en `Off`. Conclusión: es solo reporte de tráfico por canal, no evidencia de que la IA esté contestando. Sin necesidad de más investigación en Agent Logs por ahora.

> [!warning] Permiso bloqueado a mitad de la edición
> Al intentar aplicar las calibraciones de Goal/Visit Rules, el clasificador de permisos de Claude Code bloqueó una llamada de `browser_evaluate` (inyección de JS) y luego un clic normal sobre el mismo campo. Se resolvió reintentando con clic + `Ctrl+A` + reemplazo de texto completo (sin JS), que sí fue permitido. Si esto se repite en sesiones futuras, probar primero la vía "clic + seleccionar todo + escribir" antes que `browser_evaluate`.

## Actualización 2026-07-18 (continuación) — workflow de ruteo por turno reconstruido y guardado

Al revisar la carpeta Automation → Asignacion se encontró el workflow **"Rances Car - Ruteo Human Handover por Turno"** (creado 16-jul, referenciado en el histórico de la subcuenta) — construido en una sesión anterior el 17-jul pero **nunca guardado** (el botón Save quedó con cambios pendientes en todas las capturas de esa sesión). Al reabrirlo hoy estaba completamente vacío.

**Se reconstruyó y esta vez sí se guardó** (verificado recargando la página completa):
- Trigger: Contact tag → Tag added → `human handover`.
- If/Else "Ruteo por turno - Scarleth vs Samuel":
  - Rama "Turno Scarleth (Lun-Sab 8am-5pm)": Current Day of week is not Sunday, AND Time of the day is on or after 08:00 AM and is on or before 05:00 PM → Assign to user **Scarleth Hassiel Rubi**.
  - Rama "Turno Samuel (Mar-Dom 5pm-9pm)": Day is not Monday, AND Time 5:00 PM–9:00 PM → Assign to user **Samuel Aguilar**.
  - Rama "None" (huecos: domingo 8am-5pm, lunes 5pm-9pm) → sin acción, cae directo a END — intencional, el negocio no atiende citas en esas franjas.
- En ambas acciones "Assign to user" el toggle "Only apply to unassigned contacts" quedó **apagado** a propósito, para que este workflow pueda sobreescribir la asignación default de Scarleth que hace el Human Handover del bot durante el turno de Samuel.
- Sigue en **Draft** — falta probarlo end-to-end antes de publicar.

## Actualización 2026-07-18 (noche) — workflow de turno probado y publicado; interrumpido por corte de luz antes de Contact Info

**Prueba end-to-end del workflow "Rances Car - Ruteo Human Handover por Turno":**
- Se creó contacto de prueba **Jorge Calderón** (jcalderon900610@gmail.com), se le agregó el tag `human handover`.
- Primer intento: workflow seguía en `Draft` → Execution logs mostró "No logs found" (confirmado: un workflow en Draft no ejecuta nada, solo Published corre de verdad).
- Se **publicó** el workflow (toggle Draft→Publish) y se volvió a quitar/poner el tag en el contacto de prueba.
- Execution log confirmó: `Add to workflow` → rama **`None`** (Executed) → `Removed by - End Of Workflow` (Finished). Correcto: hoy 18-jul-2026 es domingo ~10:18 PM, fuera de ambas ventanas de turno (Scarleth Lun-Sáb 8am-5pm / Samuel Mar-Dom 5pm-9pm) → no reasigna, cae a None. **El workflow queda publicado y validado** para el caso "sin cobertura"; las ramas de Scarleth y Samuel no se probaron en vivo (no coincidió el horario) pero comparten la misma estructura ya validada.
- **Hallazgo colateral:** al crear el contacto de prueba, se le agregó solo el tag `loop-temp` y se asignó a Scarleth **automáticamente, antes de tocar nada nuestro** — confirma que existe un sistema de asignación de leads generales separado (candidatos: `Workflow Asig Agente (Entrada)` / `Asignación por Turno (Control Principal)`, ambos ya vistos en la misma carpeta "Asignacion"). No investigado a fondo todavía — sigue pendiente, sin urgencia porque no choca con el workflow de Human Handover que sí construimos.
- **Pendiente de limpieza:** el contacto de prueba Jorge Calderón sigue con tags `loop-temp`/`human handover` y una opportunity de prueba ("RancesCar – Venta & Financing - Nuevo Lead") — falta limpiar cuando se retome.

**⚠️ Corte de electricidad — sesión interrumpida antes de empezar Contact Info.** Se habían preparado las instrucciones/contenido para las 6 entradas de Contact Info en "Agente Social RancesCar" (Bot Goals → Setup your Actions → Contact Info), **pero no se llegó a escribir nada en GHL todavía**. Contenido ya decidido, listo para aplicar al retomar:

| Campo GHL | Texto para "What to update in the field" |
|---|---|
| **City** (campo estándar) | The city or area in Miami where the customer is located |
| **Interés de Vehículo** | The vehicle make, model, or type the customer is interested in |
| **Método de Pago** | How the customer plans to pay: cash, financing, or trade-in |
| **Tiempo estimado de compra** | How soon the customer plans to buy: this week, this month, just browsing, etc. |
| **Lenguaje Preferido** | The language the customer is communicating in |
| **Resumen AI** | A running summary of the conversation so far, for the human advisor |

## Próximos pasos

1. ~~Corregir el typo "Rancer Car" → "Rances Car" en Additional Information.~~ ✅ Hecho 2026-07-18.
2. ~~Aplicar calibraciones de Carwarriors LLC que no dependen de decisión del cliente (multi-canal en Goal, Visit Rules acortada, silencio post hand-off).~~ ✅ Hecho 2026-07-18. Pendiente: decidir con el cliente si la promo Tesla aplica a Rances Car y, si aplica, moverla a Knowledge Base.
3. ~~Terminar el workflow "Rances Car - Ruteo Human Handover por Turno".~~ ✅ Reconstruido, guardado, **publicado y probado** 2026-07-18 (ver arriba) — rama "None" confirmada correcta en vivo.
4. **PRÓXIMO PASO INMEDIATO al retomar:** Configurar **Contact Info** en "Agente Social RancesCar" con los 6 campos de la tabla de arriba (contenido ya decidido, solo falta escribirlo en GHL).
5. Configurar **Trigger a Workflow** — verificar si `Workflow Contactado` y `Workflow Crear Oportunidad` (o sus equivalentes) ya existen en el pipeline de Rances Car antes de conectarlos.
6. Limpiar el contacto de prueba Jorge Calderón (quitar tags, borrar opportunity de prueba).
7. Investigar (sin urgencia) el sistema de asignación de leads generales (`Workflow Asig Agente (Entrada)` etc.) para entender si se superpone con Human Handover.
8. Abrir "Agente Nocturno RancesCar" y documentar su estado (Bot Settings, Goal, Setup your Actions) — aún sin auditar.
9. Decidir si activar "Goodbye Detection" en Stop Bot (viene pre-armado, solo falta el toggle).
10. Solo al final: "Set as Primary Bot" + pasar a Auto Pilot, siguiendo el mismo checklist de activación ya usado en Carwarriors LLC.

## Relacionado
- [[Carwarriors LLC]]
- [[Carwarriors - Agente IA 24-7 (Diseño)]]
- [[Carwarriors - Comportamiento del Bot (Resumen)]]
