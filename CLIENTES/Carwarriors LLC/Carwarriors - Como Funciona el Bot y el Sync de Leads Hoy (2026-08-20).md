---
tags: [forjado, carwarriors, n8n, gohighlevel, ia, agente-conversacional]
tipo: resumen-funcional
cliente: Carwarriors LLC
estado: activo en producción (n8n + OpenRouter, ambos dealers)
creado: 2026-08-20
---

# Cómo funciona el bot de Carwarriors hoy (y cómo se mueven los leads)

Esto es una explicación en criollo de qué hace el bot que atiende a los clientes de Carwarriors LLC y Rances Car ahora mismo, y de cómo van y vienen los leads entre HighLevel (GHL) y DealerCenter. Es el estado real a día de hoy, ya migrado de GHL Conversation AI a n8n + OpenRouter (el bot viejo de GHL que describían los documentos anteriores quedó deprecado).

Hay dos bots gemelos corriendo en paralelo, uno por dealer (Carwarriors LLC y Rances Car), con la misma lógica pero cada uno con su propio calendario, su propia credencial de GHL y algunos detalles propios.

## Cómo habla el bot

El bot se presenta como parte del equipo del concesionario, nunca dice que es una IA. Habla en plural ("nosotros"), en el idioma que use el cliente, con tono de vendedor real y cercano, no de robot corporativo. Los mensajes son cortos: máximo un par de frases, una sola pregunta por mensaje, sin listas largas ni rollos. Si el cliente contesta solo "ok" o "sí" o un emoji, el bot no reinicia la conversación desde cero, sigue el hilo donde iba.

## Qué hace paso a paso con un lead nuevo

Cuando llega un mensaje, antes que nada el bot revisa si ese contacto ya está marcado como spam (de eso hablamos más abajo). Si no lo está, agrupa los mensajes que lleguen muy seguidos (para no responder a cada palabra suelta por separado, sino a la idea completa) y ahí sí arranca a pensar la respuesta.

La conversación sigue un orden natural de calificación: primero qué tipo de auto busca, después en qué zona/ciudad está, para qué lo va a usar, cuándo piensa comprar, y por último cómo piensa pagarlo. El bot no repite preguntas que ya contestó el cliente, y avanza un paso a la vez sin estancarse dando vueltas.

Apenas el cliente confirma qué vehículo le interesa, el bot ya le ofrece agendar una cita — no espera a tener los cinco datos completos. Puede ser visita al lote, videollamada o llamada telefónica. Y esto no es una promesa vacía: el bot de verdad consulta el calendario real del asesor y agenda en firme, no inventa horarios.

## Cuándo se hace a un lado y llama a un humano

El bot tiene una escala de cuándo escalar a un asesor humano:
- Si todo es normal, sigue solo calificando.
- Si el cliente solo quiere ver el catálogo en general, no escala, comparte lo que hay disponible.
- Si pide fotos de un auto específico, usa una herramienta para mandarle imágenes reales.
- Si pregunta el precio exacto o el pago mensual, ahí sí es obligatorio escalar — el bot nunca da un número exacto de precio, financiamiento o aprobación de crédito.
- Si el cliente muestra urgencia real ("voy hoy", "tengo el dinero listo", "necesito un auto urgente"), escala de inmediato.

Cuando escala, nunca ofrece WhatsApp y llamada al mismo tiempo en el mismo mensaje, y siempre deja claro que alguien lo va a contactar pronto para que el cliente no se quede esperando en el aire.

## El horario de atención

De lunes a viernes atiende de 10am a 9pm, sábados de 10am a 7pm y domingos de 10am a 4pm (hora Miami). Fuera de ese horario, el bot avisa cuándo vuelve a abrir y no ofrece llamadas, solo deja la puerta abierta por WhatsApp.

## De dónde saca la información

El bot tiene acceso a una base de conocimiento (Knowledge Base) donde vive toda la info de horarios, ubicación, promociones activas, políticas del dealer, etc. Esto es clave porque significa que si cambia una promoción o un dato del negocio, no hay que tocar el cerebro del bot ni reprogramar nada — se actualiza la base de conocimiento y ya el bot responde con lo nuevo. Al mostrar inventario, solo da datos generales (año, color, kilometraje) y siempre aclara que la disponibilidad es preliminar hasta confirmar.

## El guardrail anti-spam (recién agregado)

Desde hoy, el bot tiene un filtro que detecta cuando alguien le escribe pidiendo "que le den like", que "participe en un video", que lo siga en redes, o cualquier cosa de ese estilo que no tiene nada que ver con comprar un auto — típico de mensajes de spam/bots que llegan sobre todo de fuera del país. Cuando detecta eso, no pierde el tiempo conversando: corta ahí mismo, marca al contacto como spam bloqueado y avisa por Slack, sin gastar tiempo del equipo ni de la IA en esos mensajes.

## El detalle del teléfono (bug que se arregló hoy)

Había un problema donde, si un lead escribía por Instagram o Messenger y no tenía un número de teléfono guardado en su ficha de GHL, el bot fallaba al intentar responderle. Ya se corrigió: ahora el bot revisa de verdad si el contacto tiene teléfono antes de decidir por qué canal contestarle, y si no tiene teléfono, intenta por correo en vez de fallar en silencio.

## Cómo se mueven los leads entre GHL y DealerCenter

Acá hay dos caminos separados, cada uno en su dirección.

**De GHL hacia DealerCenter:** cuando en GHL se crea una oportunidad nueva (un lead que ya pasó de ser un contacto cualquiera a algo con intención real de compra), automáticamente se sube esa información a DealerCenter. Este camino lleva funcionando bien y sin interrupciones.

**De DealerCenter hacia GHL:** DealerCenter manda todos los días un reporte por correo con los leads que tiene registrados (de ambos dealers), y hay un proceso que revisa ese correo, lee el archivo adjunto, y sube o actualiza esos contactos en GHL — así el equipo ve en GHL tanto los leads que llegan por WhatsApp/redes como los que vienen de otras fuentes que solo pasan por DealerCenter.

Este segundo camino sí tuvo un problema real: la cuenta de correo que lee ese reporte diario perdió el acceso (la sesión venció) el 17 de agosto, así que durante tres días ese proceso no pudo ni siquiera revisar el correo — no es que DealerCenter dejara de mandar el reporte, es que nadie lo estaba leyendo del lado de n8n. Eso explica por qué durante esos días no se veían leads nuevos entrando desde esa fuente. Ya se reconectó la cuenta y se procesaron a mano los tres reportes que quedaron pendientes (18, 19 y 20 de agosto), así que ya está al día y funcionando solo otra vez, sin que haga falta tocar nada más.

## Resumen de una línea

El bot conversa como un vendedor de carne y hueso, califica al cliente paso a paso, agenda citas reales, sabe cuándo hacerse a un lado y llamar a un humano, ignora el spam sin perder tiempo, y los leads se mueven en ambas direcciones entre GHL y DealerCenter de forma automática — con el único cuidado de que, si algún día la cuenta de correo que lee el reporte diario se desconecta, hay que volver a autorizarla para que el flujo de DealerCenter hacia GHL no se quede atascado.
