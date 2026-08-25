---
tags: [forjado, carwarriors, ia, agente-conversacional, guia-equipo]
tipo: guia
cliente: Carwarriors LLC
creado: 2026-08-18
actualizado: 2026-08-18
notas: "Actualizado la noche del 2026-08-18 tras auditar el doc contra el prompt real de GHL Conversation AI: se corrigieron 3 imprecisiones (bot de GHL en realidad apagado por billing, secciones que mezclaban bot viejo/nuevo sin aclararlo, y la promesa de calendario real que en ese momento era falsa en ambos bots). El punto del calendario real ya se resolvió de verdad en RSVP (n8n) el mismo día."
---

# Así habla el bot con tus clientes — guía para el equipo de Carwarriors

*Corte: 18 de agosto de 2026 (actualizado esa misma noche).*

## Estado actual, en una mirada

- **Instagram / Facebook / SMS / WhatsApp (bot viejo):** ⚠️ ahora mismo **nadie responde automático** — el bot de GHL está apagado por falta de tarjeta en su facturación (ver punto 1). El equipo humano cubre mientras tanto.
- **WhatsApp (dentro de GHL):** bloqueado aparte — es un addon de GoHighLevel ($10/mes) que nunca se contrató. Aunque el bot estuviera prendido, este canal específico no funcionaría sin contratarlo.
- **Bot nuevo (n8n + OpenRouter):** validado de punta a punta (calificación, appointment con calendario real, envío de fotos), pero **todavía no está activado** — no reemplaza al de producción todavía.
- **Bot viejo (GHL Conversation AI):** sigue configurado en paralelo con la lógica de esta guía, pero apagado desde el lado de GHL. Se prende el nuevo (y se apaga este del todo) cuando el equipo lo decida.

---

## 1. Quién contesta hoy

Hay dos sistemas pensados para correr en paralelo, pero ahora mismo **ninguno de los dos está respondiendo leads automáticamente**.

**Bot de GHL Conversation AI:** es el que está configurado con la lógica de esta guía (secciones 2 a 11, salvo donde se aclara "en el bot nuevo"), pero **está apagado (`mode: off`) porque la subcuenta no tiene tarjeta cargada en GHL Billing** — GHL lo apaga solo, no es un bug ni algo que se pueda forzar por API o por UI sin resolver la facturación primero. Mientras siga así, nadie recibe respuesta automática por Instagram, Facebook, SMS o el WhatsApp externo — responde el equipo humano.

**Bot nuevo (n8n + OpenRouter):** se construyó como reemplazo, sin depender del bot nativo de GHL. Ya corrió pruebas reales de punta a punta —calificación, appointment con calendario real (crear, reagendar y cancelar la cita de verdad), envío de fotos— con la misma lógica de negocio de esta guía. **Sigue sin activarse en producción** — esa decisión y la de apagar el bot viejo del todo quedan pendientes del equipo.

GoHighLevel sigue siendo el CRM en cualquiera de los dos escenarios: ahí vive el historial de cada contacto, sus datos y el pipeline de ventas.

## 2. Cómo habla

El bot suena a vendedor real de Miami, no a script corporativo — y nunca se identifica como IA.

- Habla en plural ("nosotros"), tono cálido y directo.
- Máximo dos oraciones cortas, **una sola pregunta por mensaje** — nunca listas ni párrafos largos.
- No repite la misma apertura o pregunta en turnos seguidos, ni vuelve a pedir un dato que el cliente ya dio.
- Responde en el idioma en que le escribe el cliente. Si el cliente contesta algo corto ("ok", "sí", "?"), sigue el hilo — no reinicia la conversación desde cero.
- Si detecta estrés o urgencia financiera en el cliente, primero valida en pocas palabras antes de seguir preguntando.

## 3. Qué le pregunta al cliente

Sigue un orden fijo de calificación — salvo que el cliente muestre urgencia real, cada mensaje avanza uno de estos cinco ejes, nunca se estanca repitiendo la misma pregunta:

1. Vehículo de interés
2. Ubicación / ciudad
3. Para qué lo va a usar
4. Cuándo piensa comprar
5. Cómo va a pagar

## 4. Cómo ofrece el appointment

*Esta sección describe al **bot nuevo** (n8n) — el bot viejo de GHL no distingue tipos de appointment ni toca un calendario real; solo escala a un asesor.*

Apenas el cliente confirma qué vehículo le interesa —sin esperar a tener los cinco datos completos— el bot ofrece un **appointment**, usando ventanas naturales ("mañana", "por la tarde", "como a las 6 PM").

Puede ser de tres tipos: **visita al lote** (presencial, incluye test-drive), **videollamada** con un asesor, o **llamada telefónica**.

No es una promesa vacía: desde el 18 de agosto de 2026 el bot lee el calendario real de asesores antes de confirmar horarios, y puede crear, cancelar o reagendar el appointment él mismo directo en GoHighLevel — si el horario pedido ya no está libre, propone el más cercano en vez de confirmar algo que no puede cumplir. Validado con pruebas reales, pendiente solo de activarse en producción.

## 5. Cuándo detecta urgencia real

Solo frases explícitas disparan el escalamiento inmediato: *"voy hoy"*, *"tengo el dinero listo"*, *"quiero cerrar ya"*, *"ya estoy aprobado"*, *"necesito un auto urgente"*.

**No cuenta como urgencia:** mencionar el down payment, el credit score o cambiar la forma de pago, por sí solos, no disparan el escalamiento — el bot sigue calificando con normalidad.

## 6. Cuándo llama a un humano

Cinco niveles, de exploración libre a escalamiento obligatorio — nunca escala sin un motivo concreto, y nunca ofrece WhatsApp y llamada juntos en el mismo mensaje.

| Nivel | Qué pasa |
|---|---|
| 1 | Conversación normal — calificación exploratoria, el bot sigue solo. |
| 2 | Catálogo general — comparte el link de WhatsApp de catálogo para que el cliente navegue. |
| 3 | Catálogo + asesor — si pide fotos exactas de un auto puntual, además del catálogo escala a un asesor. |
| 4 | Escalamiento obligatorio — en cuanto pide precio exacto, cash price o el total; nunca lo da él. |
| 5 | Escalamiento inmediato — ante alta urgencia (ver sección 5). |

Compradores internacionales o de exportación siempre se dirigen a WhatsApp con un asesor — nunca reciben un precio exacto en el chat.

## 7. Horario de atención

Hora de Miami. Fuera de horario, el bot avisa la próxima apertura y solo ofrece WhatsApp — nunca ofrece una llamada si el equipo no está disponible.

| Día | Horario |
|---|---|
| Lunes – Viernes | 10:00 AM – 9:00 PM |
| Sábado | 10:00 AM – 7:00 PM |
| Domingo | 10:00 AM – 4:00 PM |

## 8. Precios, inventario y fotos

- Nunca da un precio exacto ni una tasa (APR), y nunca garantiza que a alguien le van a aprobar el crédito.
- Al mostrar un auto del inventario, comparte como máximo tres datos (año, color exterior, kilometraje) y aclara que la disponibilidad es preliminar hasta confirmar.
- Las promociones activas (hoy: Tesla, $1,000 de inicial / $399 al mes) viven en la base de conocimiento del bot, no están escritas a mano en su guion — se pueden actualizar sin tocar su comportamiento.

**En el bot nuevo:** el inventario se sincroniza automáticamente todos los días desde DealerCenter (sin que nadie lo cargue a mano), y ya puede adjuntar fotos reales de los vehículos dentro del propio chat, no como un link aparte.

## 9. Qué guarda del cliente

El bot completa seis campos en la ficha del contacto — pero **solo si están vacíos**: si un contacto viejo ya tiene un dato cargado, no lo actualiza aunque el cliente diga algo distinto en una conversación nueva.

| Campo | Qué guarda |
|---|---|
| `vehicle_interest` | Marca/modelo o tipo de vehículo que busca |
| `City` | Ciudad o zona donde vive |
| `payment_method` | Cómo planea pagar |
| `tiempo_estimado` | Cuándo piensa comprar |
| `idioma` | Idioma en el que prefiere que le hablen |
| `resumen_ai` | Resumen continuo de la conversación, para que el asesor humano no tenga que releer todo el chat |

## 10. Seguimientos automáticos

El bot redacta y manda sus propios follow-ups en tres escenarios — con un techo claro, nunca insiste sin parar:

- **El cliente deja de responder** → un solo follow-up, a la hora.
- **El cliente está ocupado** → misma cadencia moderada.
- **El cliente pidió que lo contacten después** → mismo criterio.

**Decisión de producto:** el estilo de insistencia fuerte tipo BDC (llamadas repetidas, presión de escasez) se decidió **no** trasladarlo al bot — eso queda para el equipo humano por teléfono. El bot usa urgencia moderada y solo menciona escasez si es un dato real verificable, nunca como truco genérico.

## 11. Después de pasar a un humano

Los tres motivos de traspaso —el cliente pide hablar con una persona, al bot le falta un dato para resolver algo, o no logra resolver el problema— llegan hoy a **Nallely de Leon**. Al escalar, el bot manda un último mensaje de aviso, se crea una tarea en el contacto y se marca con la etiqueta *human handover*.

**Silencio total:** una vez que un humano entra a la conversación, el bot no vuelve a responder hasta el próximo horario sin cobertura humana — no interviene "por si acaso" con preguntas básicas mientras el asesor está escribiendo.

Después de agendar un appointment no hay traspaso a un asesor específico: cae directo en DealerCenter y lo atiende el primer vendedor disponible, con la IA registrada como el origen del lead.

## 12. Avisos al equipo

En el bot nuevo (n8n), cuatro eventos avisan al canal **#notificaciones** de Slack: lead nuevo, pedido de precio, appointment agendado y escalamiento a humano. Si algo del sistema falla técnicamente, también llega una alerta aparte al mismo canal, sin que nadie tenga que estar revisando manualmente.

## 13. Lo que falta cerrar

**Estado de canales:**

- 📷 Instagram / Facebook — funcionando en ambos bots.
- 💬 SMS — funcionando en ambos bots.
- 🟢 WhatsApp (bot viejo) — es un link fijo a un WhatsApp aparte, atendido a mano — nunca fue una integración real con GHL.
- 🔒 WhatsApp (dentro de GHL) — requiere un addon de $10/mes que aún no se contrata — sin él, ningún bot puede mandar WhatsApp automático de verdad.

**Pendientes reales:**

- Falta decidir cuándo activar el bot nuevo en producción — ya está construido y probado (calificación, appointment con calendario real, fotos), solo falta el visto bueno para prenderlo.
- El bot viejo de GHL ya está apagado por falta de tarjeta en su facturación; falta decidir si se recarga mientras se activa el nuevo, o si se salta ese paso y se va directo al corte.
- Falta avisar a contabilidad del cambio de gasto (sale la IA nativa de GHL, entra OpenRouter).

---

*Preparado por FORJADO. Contenido basado en la especificación funcional configurada y validada del bot de Carwarriors LLC (bot de GHL apagado por facturación, bot nuevo construido y probado pero aún no activado) y en el estado de la migración a n8n a corte del 18 de agosto de 2026 (noche).*
