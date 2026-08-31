---
tags: [forjado, cliente, carwarriors, manychat, comentarios-ig-fb, meta-api]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-08-30
---

# 2026-08-30 (noche) — Pivote: comentarios IG/FB se resuelven con Meta Graph API directa + n8n, no con ManyChat

**Contexto:** siguiendo [[2026-08-30-manychat-external-request-confirmado]], se llegó a armar y guardar en ManyChat (Flow Builder personalizado, DRAFT) la Solicitud Externa completa (URL, cuerpo `{"comentario": ..., "contact": ...}`, headers, Mapeo de Respuesta con los 3 campos `es_interes_real`/`respuesta_publica`/`respuesta_dm`) y el nodo de DM condicional ("Enviar mensaje" → "como Respuesta privada" → `{respuesta_dm}`). Todo esto sigue guardado en el Flow DRAFT (`content20260828215429_699312`), sin publicar.

## Bloqueante encontrado en ManyChat

El disparador de comentarios del **Flow Builder personalizado** (el único que soporta bloques tipo Solicitud Externa) **no tiene ninguna opción de respuesta pública automática** — se confirmó revisando el panel de configuración completo del disparador ("Cuando alguien comenta sobre" / "Y su comentario", sin un tercer paso de respuesta). El nodo "Enviar mensaje" (Instagram) solo ofrece 2 modos, ambos privados: "dentro de la ventana de 24 horas" o "como Respuesta privada" — no hay modo público.

Esa capacidad (responder públicamente en el hilo del comentario) parece exclusiva del asistente simplificado **"Growth Tool"** (el mismo tipo que la automatización vieja `Auto-DM de links desde comentarios`), que a su vez no soporta bloques personalizados (confirmado el 2026-08-28). Se evaluó un puente (que el wizard de Growth Tool invoque nuestra automatización vía "Iniciar Automatización" en su paso de DM) pero no se llegó a probar — Jorge propuso directamente saltar a la API de Meta.

## Decisión: Meta Graph API directa + n8n, sin ManyChat para este frente

Jorge propuso resolverlo nativo: mandar a n8n los datos de la publicación + el comentario, y contestar desde n8n usando la API de Meta directamente (no la de ManyChat). Se investigó (WebSearch) si esto sigue bloqueado por el mismo problema de App Review que se documentó el 2026-08-27, y **la conclusión anterior probablemente estaba equivocada o incompleta**:

- **Standard Access** (nivel por default, SIN App Review) alcanza para apps usadas solo por gente con un rol en la propia página — que es exactamente el caso de Carwarriors respondiendo en su propia página.
- **Advanced Access** (la que sí exige App Review completo — verificación de negocio, app en modo Live, video de demostración) solo es obligatoria si la app va a operar sobre cuentas de Instagram/páginas que **no son propias**.
- La API sí soporta responder comentarios directo: `POST /{ig-comment-id}/replies` (respuesta pública). Meta también tiene respuestas privadas a comentarios vía Messaging API (DM directo al que comentó) — con lo cual ni siquiera haría falta ManyChat para el DM tampoco.

Fuentes (WebSearch, 2026-08-30): [Facebook Page API Permissions App Review Guide](https://singhamandeep.com/facebook-page-api-permissions-app-review/), [Instagram API Advanced Access Approval Guide](https://singhamandeep.com/instagram-api-advanced-access-approval/), [Instagram Platform Overview — Meta Developers](https://developers.facebook.com/docs/instagram-platform/overview/).

**No es 100% seguro sin probarlo en vivo** (la documentación de Meta es ambigua entre fuentes) — la forma de confirmarlo es intentar la llamada real: si Standard Access no alcanza, la API la rechaza con error de permiso explícito, y ahí se sabe que hace falta el review. Jorge confirmó tener acceso a Meta Business de Carwarriors.

## Qué queda reusable de lo ya construido

- **El workflow de n8n `COMENTARIOS-MANYCHAT`** (id `07BgeGy4vukFJDlu`, activo) — el clasificador (Information Extractor + OpenRouter `deepseek/deepseek-v4-flash`) es reusable tal cual; solo cambia qué dispara el workflow (webhook de Meta en vez de Solicitud Externa de ManyChat) y qué hace con el resultado (llamar a la Graph API de Meta para responder, en vez de devolver JSON para el Mapeo de Respuesta).
- **El Flow de ManyChat sigue guardado en DRAFT, sin publicar** — no se descarta todavía por si el camino de Meta API se traba, pero pasa a ser plan B.
- La automatización vieja `Auto-DM de links desde comentarios` sigue LIVE, sin tocar.

## 2026-08-30 (más tarde) — Meta API bloqueada de verdad: cuenta/ubicación, no IP; se vuelve al plan ManyChat

Se intentó en vivo: Jorge Calderón no pudo entrar a `developers.facebook.com` desde su conexión (está en Cuba). Se probó con el navegador Playwright (red distinta, no debería estar geo-bloqueada) — llegó hasta un checkpoint de verificación de Facebook (captcha/2FA), que Jorge no pudo resolver porque "no estaba disponible" en su pantalla. Jorge probó entonces directo con su propia cuenta y sesión, y **sí logueó**, pero Meta devolvió `developers.facebook.com/account_status/error/` con el mensaje **"Meta for Developers no está disponible en esta ubicación"**.

**Conclusión importante:** el bloqueo no es por IP/red (como el 451 de ManyChat, que sí se resolvía con la red de Playwright) — es un bloqueo de **cuenta/ubicación** ligado a cumplimiento de sanciones (Cuba, OFAC), el mismo tipo de restricción que ManyChat menciona explícitamente en su página 451. No es algo a rodear técnicamente (se descartó explícitamente probar VPN u otras redes por ser un tema de cumplimiento legal, no un bug).

**Decisión de Jorge: abandonar el camino de Meta API por ahora, volver al plan B de ManyChat** — la automatización con el asistente simplificado (Growth Tool, que sí responde público) invocando nuestra automatización con IA en el paso del DM vía "Iniciar Automatización". No depende de Meta Developer Console para nada. Alternativa no descartada pero no explorada: que Jorge González (el dueño, no en Cuba) cree la app de Meta desde su propia cuenta si en el futuro se retoma este camino.

## Pendiente inmediato

1. Confirmar si ya existe una app de Meta for Developers para Carwarriors (Jorge tiene acceso a Meta Business, pero no estaba confirmado si ya hay una app creada) — si no existe, crearla.
2. Conectar la app a la página/cuenta de Instagram de Carwarriors, generar un Page Access Token (o token de usuario con rol) con los scopes `pages_read_engagement`, `pages_manage_engagement`, `instagram_basic`, `instagram_manage_comments`.
3. Suscribir el webhook de Meta (campo `feed` de la página, o el equivalente de comentarios de Instagram) apuntando a un nuevo endpoint en n8n — cubre automáticamente **cualquier post futuro**, a diferencia de GHL.
4. Construir/adaptar el workflow de n8n: recibir el webhook (incluye el handshake GET de verificación que exige Meta), clasificar con el mismo LLM, y responder con `POST /{comment-id}/replies` (público, siempre) + Messaging API para DM privado si hay interés real.
5. Probar contra un comentario real antes de considerar esto en producción.
