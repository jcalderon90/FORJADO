---
tags: [forjado, cliente, carwarriors, manychat, comentarios-ig-fb, n8n, meta-api]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-28
---

# 2026-09-28 — Comentarios IG/FB: Facebook nunca estuvo conectado, e Instagram clasifica al azar porque ManyChat no manda el texto del comentario. Pivote a Meta API vía Bianca

**Contexto:** Jorge González reportó (captura de la bandeja "Comentarios" de Meta Business Suite) que no se están contestando los comentarios de las publicaciones. De los 7 comentarios visibles, 5 eran de Facebook (Chuy Vazquez "5 el", Nadir Rodríguez "Alfa romeo", Heriberto Segarra "Mustang GT", Cristina Gonzalez "El blanco", Eduardo Gonzalez "Son de uso") y 2 de Instagram (`l.i.dominguezz`, `diegodiaz2159`). Sesión con Playwright (Jorge Calderón logueado en ManyChat) y MCP `n8n-carwarriors` (reconectado en esta sesión vía OAuth en navegador, `/mcp` → Authenticate — no usa token).

## Hallazgo 1 — Facebook: la página está en OTRA cuenta de ManyChat (de booxter)

- En la cuenta ManyChat "Carwarriors LLC | Car Dealer" (`fb4391897`, ahora plan **PRO**, antes TRIAL), Configuración → Messenger sigue **sin conectar** (botón "Conectar").
- Al intentar conectar, ManyChat encontró la página **"Carwarriors LLC Miami"** y mostró **"Solicitud Enviada — pendiente de la aprobación de booxter marketing"**: la página de Facebook ya está conectada a **otra cuenta de ManyChat administrada por booxter marketing**. Una página solo puede estar en una cuenta de ManyChat a la vez.
- Conclusión: **ningún comentario de Facebook llegó nunca a nuestro flujo**. El registro del 09-26 que decía "Instagram y Facebook" era incorrecto — solo había tráfico de Instagram.

## Hallazgo 2 — Instagram: el flujo corre, pero n8n nunca recibe el texto del comentario

- Flujo "Respuesta Comentarios" (carpeta FORJADO): LIVE, trigger "comenta en cualquier publicación o reel" habilitado, **20 ejecuciones / 18 contactos únicos**, solo **2 DMs enviados** en toda su vida.
- En la Solicitud Externa, el cuerpo es `{"comentario": {Última entrada de texto}, "contact": {Full Contact Data}}`. **"Última entrada de texto" (`last_input_text`) es el último texto que el contacto escribió por DM, no el comentario.**
- Evidencia en n8n (`COMENTARIOS-MANYCHAT`, `07BgeGy4vukFJDlu`):
  - Ejecuciones reales `9506` (09-26), `9713` (09-27), `9879` (diegodiaz2159), `9885` (l.i.dominguezz): `comentario` llega como el literal **`{{last_input_text}}`** (el contacto nunca escribió por DM → la variable queda sin resolver; en el payload `contact.last_input_text: null`).
  - Ejecuciones `6939` (09-15) y `8064` (09-20), contacto "alex": `comentario: "??"` — un DM viejo de ese contacto, no su comentario.
  - Las ejecuciones `9692`–`9694` (09-26) eran las pruebas directas al webhook con texto escrito a mano.
- **El LLM clasificaba el placeholder, no el comentario → resultado al azar.** diegodiaz2159 ("Una Silverado") recibió DM en inglés por azar (`idioma: en` sobre el placeholder); l.i.dominguezz ("No saben una mierda") quedó sin DM también por azar. El "problema de idioma" que se vio primero era un síntoma de esto.
- **Por qué no se detectó antes:** todas las validaciones usaron texto fijo — 08-31 con "Probar Solicitud" y comentario hardcodeado, 09-26 con llamadas directas al webhook. **El cierre del 09-26 ("verificado 100% en producción") fue incorrecto:** se contaron ejecuciones exitosas (status `success`) sin revisar qué texto recibían.
- Revisado el selector de campos de la Solicitud Externa (Campos del sistema + sección Instagram): **ManyChat no expone ninguna variable con el texto del comentario.** No hay forma de pasarlo a n8n desde ManyChat.

## Alternativas evaluadas dentro de ManyChat (descartadas)

1. **Filtro por palabras clave en el trigger** (paso 2 "Palabras clave específicas"): funciona (ManyChat sí ve el comentario internamente), pero **máximo 10 palabras** en "incluyen", y el botón Guardar del trigger quedó deshabilitado vía Playwright (no se pudo guardar; se verificó con recarga que producción quedó intacto). **Jorge lo descartó: quiere que cada comentario se analice con IA, no con palabras clave.**
2. **AI Step (Flow Builder):** es un agente conversacional (objetivo + tareas + contexto en texto libre, una sola salida "Siguiente paso"). No devuelve una clasificación utilizable en una Condición ni una acción real de etiqueta/campo. Se agregó suelto al borrador para inspeccionarlo y se quitó con Deshacer — nada publicado (queda el indicador naranja de borrador, contenido idéntico al publicado).
3. **Manychat AI → "Respuestas de IA"** (nuevo, responde DMs y comentarios con el conocimiento cargado) + **Behavior** (nuevo; ya tiene rol "Especialista en Autos" y un tono configurado por terceros, probablemente booxter). Ambas habilidades **apagadas**. Probado en el AI Playground (simula DMs): respondió a los 4 textos de prueba ("Una Silverado", "cuanto de down por la Silverado 2021?", "Que bonito carro 🔥", "No saben una mierda") con preguntas genéricas, sin filtrar por interés y sin Playbook BDC (Knowledge vacío). No sirve como clasificador controlable.
4. **Conectar OpenRouter a la IA de ManyChat:** no es posible (modelo propio; la integración nativa es solo OpenAI), y aunque lo fuera, el bloqueo es el mismo — no hay variable con el texto del comentario.

## Decisión — Meta Graph API + n8n, con la app creada por Bianca

- Único origen que entrega el texto del comentario: **webhooks de Meta** (Instagram `comments` + Page `feed`). n8n recibe cada comentario, lo clasifica con el mismo LLM de OpenRouter y responde por API (`POST /{comment-id}/replies` público + respuesta privada si hay interés). **Resuelve también Facebook sin depender de booxter/ManyChat.**
- Jorge Calderón intentó crear la app en developers.facebook.com con otra cuenta de Facebook ("Jorge Aus"): llegó hasta el paso Business con "No businesses available". Se le recomendó **cancelar esa app**: el bloqueo del 08-30 ("Meta for Developers no está disponible en esta ubicación") es una restricción de cumplimiento ligada a la persona/ubicación, no a la cuenta — no rodearla con cuentas alternas. La app debe quedar a nombre de Carwarriors.
- **Jorge pidió que la cree Bianca Cangialosi.** Se redactó la guía (lista para enviar): crear app "Carwarriors Comentarios" tipo Business, casos de uso *Manage messaging & content on Instagram* + *Manage everything on your Page* + *Engage with customers on Messenger from Meta*, token de página de larga duración con `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`, `pages_manage_engagement`, `pages_manage_metadata`, `pages_messaging`, `instagram_basic`, `instagram_manage_comments`, `instagram_manage_messages`; entregar token + App ID + App Secret por canal seguro (link de un solo uso). Parte 3 (webhook + modo Live + política de privacidad) queda para cuando exista el workflow nuevo — Meta valida la URL al guardar.

## Estado al cierre de la sesión

- Nada modificado en producción: flujo ManyChat, trigger y workflow n8n siguen exactamente como estaban.
- `COMENTARIOS-MANYCHAT` sigue activo recibiendo placeholders; el DM sigue saliendo al azar.

## Pendiente real

1. **Enviar la guía a Bianca** y esperar token + App ID + App Secret.
2. **Construir el workflow n8n nuevo** (webhook Meta con handshake GET de verificación → clasificar con el Information Extractor/OpenRouter existente → responder por Graph API), reusando el clasificador de `COMENTARIOS-MANYCHAT`.
3. Parte 3 con Bianca: suscribir webhooks, pasar la app a Live (preparar URL de política de privacidad).
4. **Decidir qué hacer mientras tanto con el flujo ManyChat** — recomendado: quitar la Solicitud Externa/Condición/DM y dejar solo la respuesta pública genérica (hoy clasifica al azar). Sin respuesta de Jorge todavía.
5. Solicitud de unión a la cuenta ManyChat de booxter (donde está la página de Facebook) quedó enviada — decidir si se sigue ese camino o se abandona en favor de Meta API.
6. Al migrar: apagar "Respuesta Comentarios" en ManyChat para evitar dobles respuestas en Instagram.
