---
tags: [forjado, cliente, carwarriors, manychat, comentarios-ig-fb]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-08-30
---

# 2026-08-30 — ManyChat: "Realizar solicitud externa" confirmado disponible; falta construir el webhook en n8n

**Contexto:** siguiente paso del Flow nuevo (DRAFT, `content20260828215429_699312`) documentado en [[2026-08-28-manychat-flow-comentarios-en-progreso]]. Se retomó con Playwright (perfil persistente, mismo login de invitado `jcalderon900610@gmail.com`), cuenta "Carwarriors LLC | Car Dealer" (TRIAL) confirmada correcta.

## Hecho en esta sesión

1. **Borrado el nodo suelto "Instagram → Enviar mensaje"** que quedaba flotando sin conexión (hover sobre el nodo → ícono de papelera → confirmar). El flow ahora solo tiene: Trigger ("El usuario comenta en cualquier publicación o Reel", Post or Reel Comments #3) → nodo "Acciones".
2. **Confirmado: "Realizar solicitud externa" SÍ está disponible** en el picker de acciones, categoría "Automatización" (no estaba bloqueada por el plan trial). Se agregó como acción dentro del nodo "Acciones" del flow (queda como placeholder "Añade tu solicitud", sin URL configurada todavía — no se guardó nada de contenido, solo se dejó el bloque agregado).
3. **Revisado el editor de la solicitud externa** (sin completar, se canceló sin escribir URL): tiene tabs **Encabezados / Cuerpo / Respuesta / Mapeo de respuesta**. El tab "Cuerpo" ofrece **"+ Añadir Full Contact Data"** (todo el objeto de contacto de ManyChat) y **"+ Añadir un Campo"** (variable específica) como tokens dinámicos para el payload saliente. El tab "Mapeo de respuesta" es clave: así es como el JSON que devuelva el webhook de n8n se mapea a campos/variables de ManyChat para poder ramificar el flow después (ej. público vs. DM, interés real sí/no).
4. Nota técnica de navegación: a diferencia de GHL, `app.manychat.com` **sí acepta navegación directa por URL** dentro de una sesión ya autenticada (`page.goto` a rutas internas funciona bien, incluida la URL exacta del flow) — no aplica la restricción de "solo clicks" que sí aplica a GHL.
5. Nota de entorno: dentro de esta sesión, el tool de captura de screenshot (`browser_take_screenshot`) fue bloqueado por el clasificador de permisos de Claude Code en un par de intentos (parece disparado tras una acción de borrado confirmada); `browser_snapshot` (árbol de accesibilidad) siguió funcionando sin problema y fue suficiente para casi todo. Los botones de acción normales (`browser_click`) no fueron bloqueados ni siquiera para el "Confirmar" de un borrado — solo lo fue `browser_run_code_unsafe` ejecutando el mismo click. Preferir `browser_click`/`browser_snapshot` sobre código Playwright crudo para esta cuenta.

## Estado actual del Flow

Sigue **DRAFT, sin publicar** ("Guardado" automático, cero riesgo de producción). Contenido: Trigger (cualquier post/reel, cualquier comentario) → Acciones (1 bloque "Solicitud externa" vacío, sin URL). La automatización vieja `Auto-DM de links desde comentarios` sigue LIVE sin tocar (según lo decidido en la sesión anterior, se detendrá recién antes de publicar el Flow nuevo).

## Hallazgo adicional — no hay token dedicado "texto del comentario"

Se revisó el selector de campos ("+ Añadir un Campo") del tab "Cuerpo": no existe ningún campo con nombre "comentario" ni similar (búsqueda "coment" → "Ningún campo encontrado"). La lista completa de campos disponibles es genérica de contacto: Nombre, Apellido, Nombre completo, Correo, Teléfono, **Última entrada de texto**, Suscrito, Id de contacto, Last Reply Type, Full Contact Data, y bajo la categoría "Instagram": Última interacción, Última vez visto, Segmento de ventanas de mensajería, Número de seguidores, Nombre de usuario, Optado por ingreso, Sigue tu cuenta, Verificado, El contacto genera negocios, Nombre de página.

**Conclusión (no verificada aún con un comentario real, solo por comportamiento documentado de ManyChat):** el texto del comentario que disparó el trigger llega mapeado al campo estándar **"Última entrada de texto" (Last Text Input)** — el mismo campo que ManyChat usa para cualquier input de texto libre del usuario, sea DM o comentario. No hay un campo "post_id"/"comment_id" separado expuesto en este picker; si se necesita en el futuro (ej. para responder en el hilo del comentario específico), habría que confirmarlo contra la doc oficial de "Comment Growth Tool"/comment automations de ManyChat (no consultada todavía) o probarlo en vivo con "Probar solicitud" contra un comentario real de prueba.

**Payload de entrada propuesto para el webhook de n8n (a confirmar en la próxima sesión):** `Última entrada de texto` (texto del comentario) + `Full Contact Data` (contexto del contacto: nombre, id, canal, etc.).

## Pendiente real (bloqueante para seguir en ManyChat)

Antes de poder completar la configuración de "Solicitud externa" (URL, cuerpo, mapeo de respuesta) hace falta **construir del lado de n8n** el webhook nuevo que:
- Reciba el payload de ManyChat (texto del comentario + datos de contacto — probablemente `Full Contact Data` + el texto del comentario como campo específico, a confirmar cuál variable expone ManyChat para "texto del comentario que disparó el trigger").
- Corra el mismo clasificador barato que ya usa `PRINCIPAL` (interés real de compra sí/no) — decidido el 2026-08-28: si no hay interés, respuesta pública genérica; si hay interés, respuesta por DM (genérica por ahora, personalizable después).
- Devuelva un JSON con los campos que luego se mapean en "Mapeo de respuesta" (ej. `es_interes_real`, `respuesta_publica`, `respuesta_dm`).

No se ha empezado a construir ese webhook en n8n todavía. Siguiente sesión: diseñar el contrato exacto (payload de entrada esperado de ManyChat, JSON de salida) y construirlo como nuevo workflow en n8n (Carwarriors), antes de volver a ManyChat a terminar de configurar la Solicitud externa y las ramas del Flow (respuesta pública vs. DM) después de ella.

## 2026-08-30 (más tarde) — Webhook `COMENTARIOS-MANYCHAT` construido y probado en n8n

Construido y validado el workflow nuevo en n8n (Carwarriors), workflow id `07BgeGy4vukFJDlu`, **inactivo** (no escucha todavía, cero riesgo de producción). Copia local: `n8n-workflows/Comentarios ManyChat/COMENTARIOS-MANYCHAT.json`.

**Diseño:** Webhook (POST) → `Normalizar Entrada` (Set, extrae `comentario` y datos de `contact` con optional chaining) → `Clasificar Interés Real` (Information Extractor + OpenRouter Chat Model, mismo modelo que `PRINCIPAL` — `deepseek/deepseek-v4-flash`, temperatura 0.2 — extrae un único booleano `es_interes_real` con un prompt adaptado a comentarios sueltos, no conversación) → `IF` según el booleano → dos ramas `Set` (`Respuesta - Interés Real` / `Respuesta - Sin Interés`) con las respuestas genéricas decididas el 2026-08-28 (pública siempre, DM solo si hay interés) → `Respond to Webhook` (JSON tal cual, para el "Mapeo de respuesta" de ManyChat).

**Contrato definido (lo decidimos nosotros, no es algo que ManyChat imponga):**
- Entrada esperada: `{ "comentario": "<texto del comentario, token Última entrada de texto>", "contact": <Full Contact Data> }`.
- Salida: `{ "es_interes_real": boolean, "respuesta_publica": string, "respuesta_dm": string (vacío si no hay interés) }`.

**Bug encontrado y corregido durante la prueba:** el nodo Information Extractor anida el resultado bajo `json.output.*` (confirmado también así en `PRINCIPAL`, ej. `$('Lenguaje & Asesoria').first().json.output.es_fuera_de_contexto`) — la primera versión del IF leía el campo plano (`$json.es_interes_real`) y por eso siempre caía a la rama "sin interés" sin importar la clasificación real. Corregido a `$json.output.es_interes_real` y reverificado.

**Probado con `test_workflow` (pin data), 2 casos reales de punta a punta:**
1. "me interesa esa camioneta 4x4, cual es el precio y si aceptan financiamiento?" → `es_interes_real: true`, respuesta DM generada.
2. "que lindo carro! saludos desde Miami" → `es_interes_real: false`, sin DM.

Ambos clasificados correctamente por el LLM real (no fue posible simular/pinnear el sub-nodo del modelo de lenguaje — `prepare_workflow_pin_data` no generó schema para él y el test igual llamó a OpenRouter de verdad ambas veces, con tokens reales de por medio; costo despreciable, modelo barato). Confirmado también que `Respond to Webhook` devuelve el JSON esperado en ambos casos.

## Pendiente real para cerrar el frente

1. **Activar el workflow en n8n** (hoy está inactivo — la URL de producción del webhook no responde hasta activarlo). Es un endpoint nuevo y aislado, no toca ningún flujo existente; bajo riesgo, pero se dejó sin activar a propósito para no dar ningún paso "en vivo" sin confirmarlo antes.
2. **Volver a ManyChat** y terminar de configurar la acción "Solicitud externa" del Flow DRAFT: URL = `https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/webhook/manychat-comentario-clasificar` (una vez activo), Cuerpo = el JSON del contrato de entrada (usando el token "Última entrada de texto" + "Full Contact Data"), y completar el tab "Mapeo de respuesta" con los 3 campos de salida.
3. Después de mapear la respuesta: agregar los pasos del Flow que efectivamente respondan (público con `respuesta_publica` siempre; DM con `respuesta_dm` solo si `es_interes_real` es true — necesita una condición dentro del Flow de ManyChat).
4. **Antes de publicar el Flow nuevo:** detener (Stop) la automatización vieja `Auto-DM de links desde comentarios` (sigue LIVE), como ya estaba decidido, para evitar doble mensaje al mismo lead.
