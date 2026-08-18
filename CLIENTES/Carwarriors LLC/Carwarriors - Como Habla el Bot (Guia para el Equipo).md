---
tags: [forjado, carwarriors, ia, agente-conversacional, guia-equipo]
tipo: guia
cliente: Carwarriors LLC
creado: 2026-08-18
actualizado: 2026-08-18
---

# Así habla el bot con tus clientes — guía para el equipo de Carwarriors

*Corte: 18 de agosto de 2026.*

## Estado actual, en una mirada

- **Instagram / Facebook / SMS:** en vivo, funcionando.
- **WhatsApp:** bloqueado — es un addon de GoHighLevel ($10/mes) que nunca se contrató. Sin él, ningún bot (ni el viejo ni el nuevo) puede mandar WhatsApp automático de verdad.
- **Bot nuevo (n8n + OpenRouter):** ya validado de punta a punta (calificación, appointment, envío de fotos), pero todavía no reemplaza al de producción.
- **Bot viejo (GHL Conversation AI):** sigue en paralelo, es el que responde en vivo hoy. Se apaga solo cuando el nuevo quede confirmado en producción.

---

## 1. Quién contesta hoy

Hay dos sistemas corriendo en paralelo a propósito, mientras se valida el reemplazo.

**Hoy en producción:** el bot de GHL Conversation AI sigue siendo el que responde en vivo en Instagram, Facebook, SMS y WhatsApp (vía link externo). Todo lo descrito en esta guía es su comportamiento real y calibrado.

**En construcción, ya validado:** se está armando un reemplazo en n8n + OpenRouter (deja de depender del bot nativo de GHL, que se apaga solo si no hay tarjeta cargada en su facturación). Ya corrió pruebas reales de punta a punta —calificación, appointment, envío de fotos— con la misma lógica de negocio de esta guía. Se apaga el bot viejo solo cuando el nuevo esté confirmado en producción, no antes.

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

Apenas el cliente confirma qué vehículo le interesa —sin esperar a tener los cinco datos completos— el bot ofrece un **appointment**, usando ventanas naturales ("mañana", "por la tarde", "como a las 6 PM").

Puede ser de tres tipos: **visita al lote** (presencial, incluye test-drive), **videollamada** con un asesor, o **llamada telefónica**.

No es una promesa vacía: el bot lee el calendario real de asesores antes de confirmar horarios, y puede cancelar o reagendar el appointment él mismo. Nunca ofrece una hora sin poder respaldarla.

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

- Falta que el equipo confirme si sube el modelo de IA del bot de GHL mientras dure la transición, o si se prioriza directamente el corte al bot nuevo.
- Falta decidir la fecha para apagar el bot viejo de GHL — se apaga solo cuando el nuevo quede confirmado en producción.
- Falta avisar a contabilidad del cambio de gasto (sale la IA nativa de GHL, entra OpenRouter).

---

*Preparado por FORJADO. Contenido basado en la especificación funcional ya validada en producción del bot de Carwarriors LLC y en el estado de la migración a n8n a corte del 18 de agosto de 2026.*
