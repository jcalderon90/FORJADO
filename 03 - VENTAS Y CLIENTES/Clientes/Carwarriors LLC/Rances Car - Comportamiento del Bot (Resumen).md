---
tags: [forjado, rancescar, carwarriors, gohighlevel, ia, agente-conversacional]
tipo: resumen
cliente: Rances Car (subcuenta hermana de Carwarriors LLC)
estado: en-migración (bot GHL sigue activo en paralelo — ver [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]])
creado: 2026-07-21
actualizado: 2026-07-21
---

# Comportamiento completo del bot — Agente Social RancesCar

> [!important] Pivote 2026-08-12 — este bot se está migrando a n8n
> Decisión tomada con Jorge González: el bot de GHL Conversation AI aquí descrito queda **deprecado** — la lógica conversacional se reconstruye en n8n + OpenRouter, copiando y adaptando el sistema de agentes de Spectrum, para las 2 subcuentas GHL de Carwarriors (esta incluida). Ver [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]]. **Este documento pasa a ser la especificación funcional de referencia para la migración**, no la descripción de un bot que se seguirá manteniendo en GHL. No apagar el bot de GHL hasta validar el reemplazo en producción.

> Resumen operativo de cómo se comporta el bot en vivo (Primary + Auto-Pilot en Facebook/Instagram/WhatsApp/SMS desde 2026-07-20). Detalle completo del proceso de construcción en [[Carwarriors - Agente IA Rances Car (Diseño)]]. El prompt es una copia calibrada del de [[Carwarriors - Comportamiento del Bot (Resumen)|Carwarriors LLC]] — donde no se dice lo contrario, el comportamiento es idéntico al de ese bot hermano.

## 1. Personalidad y forma de hablar
- Habla en plural ("we"), tono cálido/directo tipo vendedor real de Miami — nunca corporativo ni robótico, nunca dice que es IA. Se presenta como **"RC Miami Team", representando a Rances Car**.
- Máximo 2 oraciones cortas, máximo 22 palabras, **una sola pregunta por mensaje**, sin listas ni explicaciones largas.
- No repite apertura/validación/pregunta en turnos seguidos, no reconfirma datos ya capturados salvo que cambien.
- Responde en el idioma que use el cliente. Si el cliente escribe "?", "ok", "yes" — sigue el hilo, no reinicia la calificación.
- Si el cliente muestra estrés/urgencia financiera, valida en 6-8 palabras antes de seguir.

## 2. Flujo de calificación (orden fijo, salvo urgencia)
1. **Intención de vehículo** (marca/modelo/tipo)
2. **Ubicación** (ciudad/zona — se guarda en el campo estándar `City`)
3. **Caso de uso**
4. **Timing** de compra
5. **Método de pago** (después de timing)

Cada mensaje debe avanzar uno de estos ejes (regla de "momentum"): no se estanca ni repite.

## 3. Oferta de visita (Visit Rules)
- Se ofrece la visita **apenas se confirma el vehículo de interés** (no espera a tener los 4 datos completos) — misma calibración acortada aplicada a Carwarriors LLC, portada aquí el 2026-07-18.
- Nunca promete cita confirmada sin verificarla — y sí puede verificarla porque **Appointment Booking agenda en firme de verdad**, leyendo calendarios reales: `Samuel Aguilar's Personal Calendar` + `Scarleth Hassiel Rubi's Personal Calendar` (multi-calendar, intercambiables — asigna al asesor con el próximo slot libre, sin diferenciar por tipo de vehículo/consulta).
- El bot **puede cancelar/reagendar** la cita él mismo (activado).
- No hay trigger-workflow post-booking ni transferencia a empleado específico — igual que Carwarriors LLC.

## 4. Regla de intención fuerte → escalamiento inmediato
Solo frases explícitas: "voy hoy", "tengo el dinero listo", "quiero cerrar ya", "ya estoy aprobado", "necesito un auto urgente". Down payment, credit score o cambios de estructura de pago **no** disparan esto solos.

> Heredado del prompt original de Carwarriors LLC, no probado en vivo específicamente para Rances Car (sí lo fue para el bot hermano).

## 5. Jerarquía de escalamiento a humano (5 niveles)
1. Conversación normal / calificación exploratoria
2. Catálogo (link de WhatsApp) para browsing general
3. Catálogo + escalar a asesor si piden fotos exactas
4. Escalamiento obligatorio si piden precio exacto / cash price / total
5. Escalamiento inmediato por alta urgencia

Compradores internacionales/export → siempre escalamiento orientado a WhatsApp, nunca precio exacto en chat.

Reglas: nunca escala sin trigger, ofrece WhatsApp **o** llamada (nunca ambas juntas en el mismo mensaje), siempre pone expectativa de respuesta después de escalar.

> [!warning] No confirmado de forma independiente con este cliente
> Esta jerarquía viene tal cual del prompt de Carwarriors LLC. No se ha validado con el encargado de Rances Car si aplica igual (ej. si también tienen catálogo de WhatsApp para browsing general).

## 6. Contacto y ubicación propios
- Dirección: `3620 NW 27th Ave, Miami, FL 33142` — misma dirección física que Carwarriors LLC (negocios hermanos en el mismo lote de dealer).
- Teléfono/WhatsApp propio: `+1 (305) 763-7643` / `https://wa.me/13057637643`.

## 7. Horario de negocio (hora Miami)
> [!warning] Sin confirmar independientemente
> El prompt heredó el mismo horario que Carwarriors LLC (Lun-Vie 10am-9pm, Sáb 10am-7pm, Dom 10am-4pm), pero no se ha reconfirmado con el encargado de Rances Car si el horario real de este dealer es el mismo. Fuera de horario, el bot informa próxima apertura y no ofrece llamadas, solo WhatsApp.

## 8. Precios / inventario / campañas
- Nunca da precio exacto ni APR, nunca garantiza aprobación de crédito.
- Al mostrar inventario, máximo 3 datos (año, color exterior, kilometraje), disponibilidad "preliminar hasta confirmar".
- Promo Tesla ($1,000 down / $399/mes) vive en **Knowledge Base** (artículo "Campañas activas", migrada ahí el 2026-07-20) — el prompt solo dice "revisar Knowledge Base antes de dar números exactos de campaña; si no hay nada ahí, no hay números aprobados".

> [!warning] Sin confirmar si esta promo aplica a Rances Car
> La promo Tesla se copió del borrador original de Carwarriors LLC. Nunca se confirmó con el cliente si Rances Car vende Tesla o si necesita su propia oferta — pendiente de aclarar antes de considerarla "campaña real" de este dealer.

## 9. Qué guarda en el CRM (Contact Info — 6 campos, configurado 2026-07-20)
`City` (estándar), **Interés de Vehículo**, **Método de Pago**, **Tiempo estimado de compra**, **Lenguaje Preferido**, **Resumen AI** (resumen continuo de la conversación, para que el asesor humano no tenga que releer todo el chat).

> [!warning] Limitación (heredada del mismo diseño que Carwarriors LLC)
> Solo llena campos vacíos — si un contacto viejo ya tiene algo cargado, no lo actualiza aunque el cliente diga algo distinto en una conversación nueva.

## 10. Conexión al pipeline (Trigger a Workflow) — configurado 2026-07-20
- Primer contacto real del cliente → dispara **`Workflow Contactado`**.
- Vehículo + método de pago capturados → dispara el **mismo** `Workflow Contactado` (segunda condición).
- Diferencia con Carwarriors LLC: en Rances Car **no existe** un "Workflow Crear Oportunidad" separado — se reusa `Workflow Contactado` porque ya hace find-or-create de oportunidad internamente (2 triggers por tag `contactado`/`contacts_nuevo`, pipeline `RancesCar - ...`).

## 11. Seguimientos automáticos (Auto Followup) — los 3 activos desde 2026-07-18
| Escenario | Cadencia |
|---|---|
| **Contact Stopped Replying** | 1 follow-up a los **15 minutos**, la IA lo redacta y envía sola |
| **Contact is Busy** | activado, misma cadencia |
| **Contact Requested** | activado, mismo criterio |

Reglas del prompt: nunca "just checking in" genérico; no más de 1 escalamiento en ventana de 3 mensajes; si el cliente deja de responder tras escalar, manda solo **un** follow-up de valor.

## 12. Human Handover — los 3 escenarios, todos van a Scarleth Hassiel Rubi
| Escenario | Trigger |
|---|---|
| **Human Requested** | Cliente pide explícitamente hablar con una persona/asesor |
| **Lack of information** | El bot no tiene el dato para resolver |
| **Failed to resolve issue** | El bot no logra resolver el problema |

Al escalar: mensaje final de aviso, se crea una tarea en el contacto, tag `human handover`, y el bot se reactiva solo tras **8 horas**. A diferencia de Carwarriors LLC (donde todo va a Nallely de Leon), aquí el handover asigna a **Scarleth Hassiel Rubi** — persona distinta para este dealer hermano.

### Ruteo por turno (workflow adicional, no existe en Carwarriors LLC)
El workflow **"Rances Car - Ruteo Human Handover por Turno"** (publicado y probado en vivo 2026-07-18) reasigna el contacto según el turno real cuando se agrega el tag `human handover`:
- **Turno Scarleth**: Lunes-Sábado, 8:00 AM – 5:00 PM.
- **Turno Samuel Aguilar**: Martes-Domingo, 5:00 PM – 9:00 PM.
- **Huecos sin cobertura** (Domingo 8am-5pm, Lunes 5pm-9pm): no reasigna, el negocio no atiende citas en esas franjas.
- El toggle "Only apply to unassigned contacts" está apagado a propósito, para poder sobreescribir la asignación default de Scarleth que hace el Human Handover del bot durante el turno de Samuel.

> [!warning] Desalineamiento menor pendiente
> El sistema de asignación general (`Workflow Asig Agente (Entrada)`, dispara con todo contacto nuevo) usa el corte Lun-Sáb hasta **6:45pm** para Scarleth, mientras que este workflow de turno usa **5:00pm**. No pierde leads, pero son dos horarios distintos para la misma persona — mejora futura pendiente, no bloquea producción.

## 13. Comportamiento después del hand-off humano
**Silencio total** — igual que Carwarriors LLC, una vez que un humano entra a la conversación, el bot no vuelve a responder hasta el próximo horario sin cobertura humana. Se quitó del prompt la línea "Stay available for basic questions after handoff" (calibración portada 2026-07-18).

## 14. Stop Bot / opt-out — decidido dejar en `Off`
"Goodbye Detection" viene pre-cargado con frases ("Bye", "Goodbye", "Thank you! have a nice day") pero se decidió **no activarlo** (2026-07-20): esas frases son despedidas conversacionales normales, no opt-out real, y sin "Reactivate bot after" configurado el bot abandonaría al contacto para siempre — contradice la filosofía comercial de no dejar enfriar un lead. Si en el futuro se quiere un opt-out real, hay que reescribir el trigger con frases explícitas ("STOP", "no me contacten más") antes de activarlo.

## 15. Pendientes / no cerrado todavía
- **Borrar "Agente Nocturno RancesCar"** (bot separado en SMS, decisión ya tomada por el cliente 2026-07-20, falta ejecutarla — no se auditó su configuración).
- **Alinear el corte de horario de Scarleth** entre los 2 workflows de asignación (6:45pm en `Workflow Asig Agente (Entrada)` vs 5pm en el ruteo por turno).
- **Bug de loop**: `Asignación por Turno (Control Principal)` / `Reintento de Asignación por Turno` tienen **56.4M inscritos cada uno** — mismo bug ya reportado para Carwarriors LLC (ahí 74M), pendiente de auditoría con soporte GHL.
- **Confirmar con el cliente** si la promo Tesla, el horario de negocio, y la jerarquía de escalamiento de 5 niveles realmente aplican igual a Rances Car o necesitan su propia versión (todo esto se heredó del prompt de Carwarriors LLC sin validación independiente).

## Relacionado
- [[Carwarriors - Agente IA Rances Car (Diseño)]]
- [[Carwarriors - Comportamiento del Bot (Resumen)]]
- [[Carwarriors LLC]]
