# 2026-08-27 (noche) — Investigado el frente de "comentarios IG/FB con interés real"; no construido, 2 caminos posibles documentados

**Contexto:** de los 4 frentes pedidos por Jorge hoy (`2026-08-27-requerimientos-jorge-4-frentes.md`), este era el único de los 2 restantes que no dependía de otra persona (el otro, ticket a DealerCenter, sigue en pausa esperando a Bianca). Se investigó en vivo, sin construir nada en producción.

## Hallazgo 1 — No es el mismo sistema que las conversaciones/DMs

Comentarios en posts de IG/FB en GHL es un módulo **separado por completo** del inbox de Conversaciones (que es lo que ya atiende el bot actual, `PRINCIPAL`). Vive en "Social Planner", con sus propios triggers de Workflow: *"Facebook - Comment(s) on a post"* / *"Instagram - Comment(s) on a post"*. Confirmado contra la doc oficial de HighLevel Support (ver fuentes abajo).

- El trigger entrega: texto del comentario, el post específico, e identidad del que comentó (crea/actualiza contacto automáticamente).
- Para responder, la única acción nativa es **"Reply In Comments"** dentro de un Workflow de GHL.
- **No existe endpoint público de API de GHL para responder comentarios** — confirmado contra la doc oficial de Social Planner (`marketplace.gohighlevel.com/docs/ghl/social-planner/`): hay API pública para crear/leer/borrar posts, pero no para contestar comentarios. Esto descarta construir esta parte por API/n8n directamente contra GHL.

## Hallazgo 2 — Playwright sí pudo entrar a GHL (Cloudflare ya no bloqueó)

A diferencia de sesiones anteriores, esta vez el navegador automatizado pasó el challenge de Cloudflare de `app.gohighlevel.com` sin problema (login con `carwarriors2020@gmail.com`, cuenta agencia). Se pudo navegar dentro de la sub-cuenta Carwarriors LLC (`DSe5PdPEScZL8cbZTkKI`) y llegar al Workflow Builder real.

**Importante para futuras sesiones:** la navegación por URL directa (`page.goto`) sigue disparando 403 de Cloudflare en cada carga completa de página — solo funciona navegar haciendo clic en los links del propio SPA una vez dentro de una sesión ya autenticada. No usar `browser_navigate` a URLs internas de GHL; usar clicks dentro de la app.

## Hallazgo 3 — El trigger nativo de GHL exige posts específicos, no "cualquier post futuro"

Se empezó a construir un Workflow nuevo (`Comentarios IG/FB - Bot Responde`, borrador, nunca guardado ni publicado) con el trigger "Facebook - Comment(s) on a post", filtrado a la página "Carwarriors LLC Miami". Al llegar al filtro obligatorio **"Post is"**, el campo exige elegir uno o varios posts **de una lista de posts ya publicados** (se mostraron ~30 posts reales, del 27-ago-2026 hacia atrás) — **no hay opción de "cualquier post futuro"**. Se confirmó que es obligatorio: dejarlo vacío bloquea el guardado con "One or more filter(s) is/are empty".

**Consecuencia:** este mecanismo sirve para "todos los que comenten en ESTE post reciben X", no para automatizar de forma continua los comentarios de cualquier post nuevo que Carwarriors publique de aquí en adelante. Requeriría que alguien (Bianca/equipo) entre a este Workflow y agregue manualmente cada post nuevo al filtro cada vez que publiquen.

El workflow borrador se descartó sin guardar (confirmado después por búsqueda en la lista de Workflows: "No Workflows found" para ese nombre) — no quedó nada a medias en producción.

## Hallazgo 4 — Alternativa real pero más grande: webhooks directos de Meta

Investigado (WebSearch, no construido): Meta (Facebook/Instagram) tiene su propio sistema de webhooks del Graph API — suscribirse al campo `feed` de una Página notifica en tiempo real **cualquier comentario en cualquier post**, sin atarse a posts específicos. A diferencia de GHL, la API de Meta **sí permite responder comentarios por código** (`POST /{comment_id}/comments`).

Pero esto es un proyecto aparte, no un ajuste rápido:
- Requiere una **app propia registrada en Meta for Developers / Facebook Business Manager** — no existe ninguna hoy; no hay credenciales de esto en el archivo fuente del cliente.
- Requiere **App Review de Meta** para los permisos de leer/responder comentarios de página (`pages_manage_metadata`, `pages_read_engagement`/`pages_manage_engagement`) — puede tardar días o semanas, pide verificación de negocio, política de privacidad, video de demostración.
- Correría por fuera de GHL — las conversaciones de comentarios no aparecerían automáticamente en el inbox de GHL a menos que también se escriban ahí vía API.

Fuentes consultadas: [HighLevel Support — Facebook/Instagram comment automation](https://help.gohighlevel.com/support/solutions/articles/155000002055-guide-to-facebook-instagram-comment-automation-ai), [HighLevel API — Social Media Posting API](https://marketplace.gohighlevel.com/docs/ghl/social-planner/social-media-posting-api/index.html), [Meta for Developers — Graph API Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/v2.5), [Meta for Developers — Pages API](https://developers.facebook.com/docs/pages-api/).

## Pendiente real

Jorge eligió explícitamente investigar la alternativa de Meta en vez de las otras 2 opciones (construir igual con mantenimiento manual, o abandonar). Queda pendiente que confirme si quiere invertir en el camino de Meta (dado el tiempo de aprobación fuera de nuestro control) o prefiere la vía más simple de GHL con mantenimiento manual de posts. No se ha empezado a construir ninguna de las dos.
