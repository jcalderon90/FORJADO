---
tags: [forjado, cliente, carwarriors, manychat, comentarios-ig-fb]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-08-28
---

# 2026-08-28 (noche) — ManyChat: decisión de no tocar la automatización vieja, Flow nuevo empezado (DRAFT, sin publicar)

**Contexto:** siguiente paso del frente de comentarios IG/FB con interés real (ver [[2026-08-27-comentarios-ig-fb-investigacion]]). Jorge Calderón entró a ManyChat con Playwright (perfil persistente, visible en su propia pantalla) usando el acceso de invitado ya otorgado por Bianca, y resolvió él mismo el login (captcha + Telegram) directamente en el navegador visible.

**Trial de ManyChat — ya no es bloqueante.** Jorge González confirmó que van a pagar la suscripción Pro cuando el trial actual venza — no hace falta perseguir la fecha exacta de vencimiento antes de construir.

## Inventario real de automatizaciones existentes en la carpeta "AUTOMATIZACION CW"

Revisando "Mis Automatizaciones" en vivo:
- `Turn story replies into leads` (LIVE) — historias con palabra "REGALO"
- `Saludá a tus nuevos seguidores` (LIVE)
- **`Auto-DM de links desde comentarios`** (LIVE) — el flujo real detrás de lo documentado como "Comentario en post/reel → invita al club". Trigger: comenta en "una publicación o reel específico" + "cualquier palabra". Acción: DM de apertura ("Unite a nuestro club, donde vas a recibir regalos para acceder a tu proximo auto...") con botón "ENVIAME EL LINK" → DM con enlace ("Esperamos que te guste y que nos visites pronto!").
- `Envía links automáticos por DM` (DRAFT)
- `Autoenviar enlaces desde comentarios, historias o DMs` (STOPPED)
- `Instagram Default Reply` (STOPPED)

## Decisión de diseño (Jorge Calderón)

1. **No modificar la automatización vieja `Auto-DM de links desde comentarios`.** Es una plantilla de "Comment Growth Tool" (wizard simplificado por pasos fijos: "Cuando alguien comenta sobre" / "Y este comentario tiene" / "Obtendrán" / "Y entonces, recibirán") — confirmado que **no soporta agregar un bloque personalizado tipo External Request**: el botón "ENVIAME EL LINK" es solo el texto editable de un botón fijo, sin acción configurable; el menú "Más acciones" de la automatización solo tiene "Eliminar", no "Convertir a Flow". Modificarla in situ no es técnicamente posible sin rehacerla desde cero.
2. **Construir un Flow nuevo aparte, dejando la automatización vieja tal cual está** (activa, sin tocar) — para no arriesgar algo que ya funciona y de lo que no se conoce el historial completo de resultados.
3. **Lógica del bot nuevo, decidida por Jorge:** cuando entra un comentario, se analiza con IA (reusando el clasificador ya existente del bot `PRINCIPAL`). Si no vale la pena (sin interés real de compra) → respuesta genérica en el mismo comentario (pública). Si vale la pena (interés real: precio, disponibilidad, cita) → respuesta (por ahora también genérica, personalizable después) por DM.
4. **Pendiente de decidir aún:** qué hacer con la automatización vieja mientras el Flow nuevo esté en pruebas — Jorge Calderón indicó explícitamente **detenerla (Stop)** para evitar que un mismo lead reciba dos DMs a la vez (el club-invite viejo + la respuesta del bot nuevo). **Esto todavía no se ejecutó** — la automatización vieja sigue LIVE al cierre de esta sesión.

## Construido hasta ahora (Flow nuevo, DRAFT, sin publicar — cero riesgo para producción)

Automatización nueva sin título (`content20260828215429_699312`), creada desde "Automatización → Nueva automatización → Comenzar Desde Cero → Empieza con una hoja en blanco" (el único camino que da acceso al Flow Builder completo con soporte de bloques personalizados — a diferencia de "Iniciar con un disparador → Comentarios de publicaciones o reels", que redirige al mismo wizard simplificado de Growth Tool).

- **Trigger configurado y guardado:** "Cuando alguien comenta sobre" → **Todas las publicaciones o Reels** (cubre automáticamente posts futuros, disponible por el trial/Pro) → "Y su comentario" → **Cualquier comentario** (sin filtro de palabras — la IA decide, no el trigger) → sin respuesta pública fija en el trigger (se decidió "No", para que la respuesta pública también la genere la IA más adelante en el flujo, no un texto estático).
- **Acción:** se agregó un nodo "Acciones" (Realizar acciones) conectado al trigger, todavía vacío — quedó pendiente click en "+ Acción" para ver si "External Request" aparece en ese submenú (no se llegó a confirmar antes de que la sesión se interrumpiera).
- **Nodo suelto sin usar:** el Flow Builder trae por defecto un nodo "Instagram → Enviar mensaje" que se desconectó del trigger (quedó flotando en el canvas, sin conexión) — hay que borrarlo cuando se retome, no cumple ninguna función.
- **Estado:** todo autoguardado como DRAFT ("Guardado" confirmado en la UI) — no está publicado, no afecta nada en producción, no hay riesgo de que se active accidentalmente.

## Siguiente paso cuando se retome

1. Abrir de nuevo el Flow (`content20260828215429_699312`) en ManyChat.
2. Borrar el nodo suelto "Instagram → Enviar mensaje".
3. En el nodo "Acciones", click "+ Acción" y confirmar si "External Request" está disponible ahí (o explorar la opción "AI Step" del menú "Elegir siguiente paso", que también podría ser el camino correcto en vez de "Realizar acciones").
4. Configurar el External Request apuntando a un webhook nuevo en n8n (pendiente de construir del lado de n8n: recibir texto del comentario + datos de contacto, clasificar con el mismo LLM barato del bot `PRINCIPAL`, devolver texto de respuesta pública o de DM según corresponda).
5. Antes de publicar: **detener (Stop)** la automatización vieja `Auto-DM de links desde comentarios` para evitar el doble mensaje.
