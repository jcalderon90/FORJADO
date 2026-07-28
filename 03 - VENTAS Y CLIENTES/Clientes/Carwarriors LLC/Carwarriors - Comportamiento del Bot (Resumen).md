---
tags: [forjado, carwarriors, gohighlevel, ia, agente-conversacional]
tipo: resumen
cliente: Carwarriors LLC
estado: vigente
creado: 2026-07-14
actualizado: 2026-07-24
---

# Comportamiento completo del bot — Asistente Social CarWarriors (24/7)

> Resumen operativo de cómo se comporta el bot en vivo (Primary + Auto-Pilot en WhatsApp/Instagram/Facebook/SMS desde 2026-07-14). Detalle completo del proceso de construcción en [[Carwarriors - Agente IA 24-7 (Diseño)]].

## 1. Personalidad y forma de hablar
- Habla en plural ("we"), tono cálido/directo tipo vendedor real de Miami — nunca corporativo ni robótico, nunca dice que es IA.
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
- Se ofrece la visita **apenas se confirma el vehículo de interés** (no espera a tener los 4 datos completos — se acortó a pedido del cliente).
- Ventanas naturales: mañana, tarde, "alrededor de las 6 PM".
- Nunca promete cita confirmada sin verificarla — y sí puede verificarla porque **Appointment Booking agenda en firme de verdad** (calendarios `Showroom — Advisors` + `Calendario BDC‑B — Day`), leyendo el calendario real.
- El bot **puede cancelar/reagendar** la cita él mismo (activado).

## 4. Regla de intención fuerte → escalamiento inmediato
Solo frases explícitas: "voy hoy", "tengo el dinero listo", "quiero cerrar ya", "ya estoy aprobado", "necesito un auto urgente". Down payment, credit score o cambios de estructura de pago **no** disparan esto solos.

Confirmado en la prueba real (sandbox, 2026-07-14): al detectar esta intención, el bot ofreció horarios reales del día leídos del calendario `Showroom — Advisors` y confirmó la reserva.

## 5. Jerarquía de escalamiento a humano (5 niveles)
1. Conversación normal / calificación exploratoria
2. Catálogo (link de WhatsApp) para browsing general
3. Catálogo + escalar a asesor si piden fotos exactas
4. Escalamiento obligatorio si piden precio exacto / cash price / total
5. Escalamiento inmediato por alta urgencia

Compradores internacionales/export → siempre escalamiento orientado a WhatsApp, nunca precio exacto en chat.

Reglas: nunca escala sin trigger, ofrece WhatsApp **o** llamada (nunca ambas juntas en el mismo mensaje), siempre pone expectativa de respuesta después de escalar.

## 6. Horario de negocio (hora Miami)
- Lun-Vie: 10:00 AM – 9:00 PM
- Sáb: 10:00 AM – 7:00 PM
- Dom: 10:00 AM – 4:00 PM

Si está cerrado: informa próxima apertura. Fuera de horario no ofrece llamadas, solo WhatsApp.

## 7. Precios / inventario / campañas
- Nunca da precio exacto ni APR, nunca garantiza aprobación de crédito.
- Al mostrar inventario, máximo 3 datos (año, color exterior, kilometraje), disponibilidad "preliminar hasta confirmar".
- Promo activa (Tesla: $1,000 down / $399 por mes) vive en **Knowledge Base**, no hardcodeada en el prompt — se puede actualizar sin tocar la lógica del bot.

## 8. Qué guarda en el CRM (Contact Info — 6 campos, solo si están vacíos)
`vehicle_interest`, `City`, `payment_method`, `tiempo_estimado_de_compra`, `language_preference`, `resumen_ai` (resumen continuo de la conversación, para que el asesor humano no tenga que releer todo el chat).

> [!warning] Limitación
> Solo llena campos vacíos — si un contacto viejo ya tiene algo cargado, no lo actualiza aunque el cliente diga algo distinto en una conversación nueva.

## 9. Conexión al pipeline (Trigger a Workflow)
- Primer mensaje real del cliente → dispara `Workflow Contactado`.
- Vehículo + método de pago capturados → dispara `Workflow Crear Oportunidad` (lead calificado, entra al pipeline `Nuevo Lead → Contactado → Seguimiento → Pre Cita → Agendado Cita`).

## 10. Seguimientos automáticos (Auto Followup) — los 3 activos desde 2026-07-14
| Escenario | Cadencia |
|---|---|
| **Contact Stopped Replying** | 1 follow-up a 1 hora, la IA lo redacta y envía sola |
| **Contact is Busy** | activado 2026-07-14, misma cadencia moderada |
| **Contact Requested** | activado 2026-07-14, mismo criterio |

Reglas del prompt: nunca "just checking in" genérico; no más de 1 escalamiento en ventana de 3 mensajes; si el cliente deja de responder tras escalar, manda solo **un** follow-up de valor (no insistencia sin techo).

> [!important] Decisión de producto (2026-07-09)
> La filosofía del cliente pedía insistencia fuerte tipo BDC (llamadas múltiples, presión de escasez, "no soltar al cliente"). Se decidió **no** trasladar eso al bot de IA — la insistencia agresiva queda reservada al BDC humano por teléfono. El bot usa urgencia moderada y solo menciona escasez si es un dato verificable desde el CRM (nunca como recurso retórico genérico).

## 11. Human Handover — los 3 escenarios activados 2026-07-14, todos van a Nallely de Leon
| Escenario | Trigger |
|---|---|
| **Human Requested** | Cliente pide explícitamente hablar con una persona/asesor |
| **Lack of information** | El bot no tiene el dato para resolver |
| **Failed to resolve issue** | El bot no logra resolver el problema |

Al escalar: mensaje final de aviso, se crea una tarea en el contacto, tag `human handover`, y el bot se reactiva solo tras 8 horas.

## 12. Comportamiento después del hand-off humano
**Silencio total** — una vez que un humano entra a la conversación, el bot no vuelve a responder hasta el próximo horario sin cobertura humana (fuera del horario de atención). Por eso se quitó del prompt la línea "Stay available for basic questions after handoff".

> Pendiente: el sleep de 4h fijo en Bot Settings quedó igual por ahora (no bloqueaba el lanzamiento) — falta ajustarlo para que coincida con el cierre real en vez de un timer fijo.

## 13. Después de agendar la cita
No hay transferencia a un asesor específico — la cita cae directo en DealerCenter y la atiende el primer vendedor disponible. La IA queda registrada como el "BDC" que originó el lead.

## 14. Pendientes / no cerrado todavía
- **Hallazgo nuevo (2026-07-24, verificado en vivo):** el bot está en **`Off`** ahora mismo (actualizado hoy 9:00 AM) y sigue llamándose `Asistente Social CarWarriors` — nunca se renombró a `Asistente CarWarriors 24/7`. Contradice la sección 0 de este documento (bot "vigente" desde 2026-07-14). La conversación con Alfredo Blanco que trajo el cliente (jueves 2026-07-23, 10:35pm) confirma que sí respondió ese día — se apagó después, causa sin confirmar todavía.
- **Pendiente de aplicar (2026-07-24):** regla nueva "Credit Objection Rule" — cuando el cliente objeta crédito ("no tengo credito"), en vez del mensaje genérico de "te conecté con un asesor", el bot debe pedir el teléfono para que un humano llame ese mismo día. Texto exacto redactado y entregado al cliente para pegar en Bot Goals → Additional Information; falta confirmar que se guardó, y falta agregar un campo de teléfono en la acción `Contact Info` para que quede registrado en el CRM. Detalle completo en [[Carwarriors - Agente IA 24-7 (Diseño)]].
- **Bloqueado ahora mismo:** se perdió el acceso a la cuenta de GHL a mitad de verificar si la reserva de prueba (14 jul 2026, 12:20 PM) creó un evento/contacto real en Showroom — Advisors — sin confirmar.
- Tarea de confirmación de cita 24h antes (BDC humano o IA) — requiere workflow nuevo, no existe todavía (Fase 2).
- `BDC‑A` (turno madrugada/noche, lo cubre la IA sola) sigue sin poder usarse en booking por `teamMembers` vacío.
- Sin resolver: si `BDC Callback` y el calendario personal de Maria Eleonor Zurita entran o no al alcance de la IA (mensaje a Jorge González enviado, sin respuesta aún).
- 3 anomalías técnicas de GHL sin reportar a soporte (74M inscritos en 2 workflows, "Needs review", workflow "N8N" con 6 inscritos en draft).
- Knowledge Base: falta explicarle al cliente el concepto y definir cómo sincronizarlo con el inventario que se renueva a diario.

## Relacionado
- [[Carwarriors - Agente IA 24-7 (Diseño)]]
- [[Carwarriors LLC]]
- [[Carwarriors - Inventario GHL]]
