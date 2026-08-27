# 2026-08-27 (noche) — Construido y publicado: guardrail para leads que esperan un vehículo gratis (donación/sorteo)

**Contexto:** Jorge pidió no gastar tokens/tiempo en leads que entran al DM sin ninguna intención de compra — el ejemplo concreto fue Máximo Ferrufino, un lead que respondió a un post viral tipo "Elige un número del 1 al 5" y a partir de ahí pasó ~8 horas y 18 mensajes pidiendo que le donen/regalen un vehículo por voluntad divina, sin ninguna intención de pagar.

## Investigación real antes de construir

Se revisó la conversación completa en GHL (`GET /conversations/{id}/messages`) y las ejecuciones reales en n8n de ese contacto (`o4SupNEJJR0zO9PsadyI`). Hallazgos:

1. **Origen real del lead:** su primer mensaje fue "Minumero preferido es 7" — respuesta a un post de "Elige un número del 1 al 5", no una pregunta real sobre autos. Este tipo de posts virales/engagement-bait atrae gente que no busca comprar.
2. **El bot ya tiene un clasificador barato** (`Lenguaje & Asesoria`, nodo `informationExtractor` de LangChain) que corre en cada mensaje ANTES del agente principal, con campos como `es_fuera_de_contexto` y `es_spam_engagement`. Pero **ninguno de esos campos cubre bien este caso**: el prompt de `es_fuera_de_contexto` está diseñado a propósito para devolver `false` en mensajes cortos o que mencionen vehículos de cualquier forma (para no cortar groseramente a un comprador real) — y casi todos los mensajes de Ferrufino mencionaban "vehículo"/"carro"/"donación", así que ese campo casi nunca se activaba.
3. **El verdadero problema no era la clasificación, era el wiring:** el agente principal (`PRINCIPAL`, el caro, con herramientas y razonamiento largo) corría en paralelo con la única rama que sí filtraba (`IF FUERA DE CONTEXTO`), sin que esa rama pudiera nunca evitar la llamada cara — y esa rama en sí estaba **muerta**: su nodo de respuesta (`OFF TOPIC - Respond`) estaba `disabled: true` y era literal copy-paste de otro cliente (SPECTRUM VIVIENDA, un proyecto de vivienda, no de autos) usando la API de ManyChat en vez de GHL. Nunca hacía nada.
4. Comparado con `IF SPAM ENGAGEMENT` (el único guardrail que sí corta antes del agente principal, para spam de "dale like/sígueme") — ese si es un gate real: si es `true`, el flujo nunca llega a `PRINCIPAL`, solo bloquea silenciosamente y avisa por Slack.

## Decisión de diseño

En vez de inventar un contador de turnos o depender del campo `es_fuera_de_contexto` (mal ajustado para este caso), se agregó **un campo nuevo dedicado** al mismo clasificador barato que ya corre cada mensaje: `es_expectativa_gratuita` — true SOLO si el usuario espera un vehículo gratis (donación, regalo, sorteo, premio, milagro/bendición) sin ninguna intención de pagar; explícitamente nunca `true` si menciona financiamiento/pago/cuotas. Esto reutiliza la misma llamada LLM que ya se hacía (no agrega costo nuevo), y es más confiable que un regex porque el lenguaje real es mensajería informal con errores ortográficos ("donasion", "en presa" por "empresa").

Jorge pidió explícitamente que sí se responda algo tipo "gracias por participar" (no silencio total como el guardrail de spam-engagement) — así que a diferencia de `IF SPAM ENGAGEMENT`, este nuevo guardrail **sí manda una respuesta** (corta, fija, sin LLM) en vez de bloquear en silencio.

## Construido y publicado en ambos dealers (`PRINCIPAL` `Kif9lWwDHvR7TT39` y `PRINCIPAL - Rances Car` `N68IYzm4Bf6AVTXP`, estructura idéntica, 14 operaciones aplicadas a cada uno sin errores):

1. **Nuevo atributo `es_expectativa_gratuita`** agregado al nodo `Lenguaje & Asesoria` (mismo LLM call de siempre, un campo más) y propagado en `CONTEXT 1`.
2. **`IF EXPECTATIVA GRATUITA`** (nuevo IF) — insertado entre `IF SPAM ENGAGEMENT` (rama "no es spam") y `PRINCIPAL`, reemplazando la conexión directa que existía antes. Si `es_expectativa_gratuita === true`, el mensaje **nunca llega a `PRINCIPAL`** (ahorro real del agente caro); si es `false`, sigue el flujo normal sin ningún cambio de comportamiento.
3. Rama verdadera → **`GRATIS - Respuesta`** (Set, mensaje fijo: *"¡Gracias por escribirnos! 😊 No manejamos regalos, donaciones ni sorteos de vehículos — si en algún momento buscas comprar uno, aquí estamos para ayudarte."*, mismo mapeo de canal IG/FB/SMS/WhatsApp que usa el flujo normal) → **`GRATIS - Send GHL`** (HTTP POST a `/conversations/messages`, mismo patrón que `SEND GHL MESSAGE`, `retryOnFail` + `continueErrorOutput`) → **`GRATIS - Build Last Message`** + **`GRATIS - Save Last Bot Message`** (guardan `last_bot_message` en Mongo con el mismo patrón del fix de handoff-humano, para que ese mecanismo siga funcionando bien en el siguiente turno).

**Verificado:** re-lectura completa de ambos workflows después de la edición — nodos y conexiones exactamente como se diseñó, sin warnings nuevos de `update_workflow` (Carwarriors LLC tuvo 1 warning pre-existente no relacionado, de un nodo Slack). Publicado en ambos con `publish_workflow`.

**Pendiente real:** falta confirmar con tráfico real que el guardrail se activa correctamente ante un caso similar a Ferrufino (no se puede probar con datos falsos sin escribir en Mongo de producción — se prefirió verificar estructura + esperar próxima ocurrencia real, mismo criterio que se usó para el fix de handoff-humano). Revisar próximas ejecuciones de ambos dealers buscando el nodo `GRATIS - Respuesta` para confirmar en vivo.
