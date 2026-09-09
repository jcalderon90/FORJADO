---
fecha: 2026-09-09
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, n8n, mongo, gmail, dealercenter, ghl, leads, bug-critico]
---

# 2026-09-09 — 4 hallazgos/fixes en una sola sesión: BSONError en `PRINCIPAL`, correos de inventario sin marcar leídos, pipeline de inventario construido para Rances Car, y deduplicación de leads entre dealers

Jorge abrió con 2 reportes: una ejecución con error de `PRINCIPAL` del 08-sep ~7:27, y correos de inventario sin procesar acumulándose en Gmail. De ahí se derivaron 4 hallazgos/fixes reales.

## 1. BSONError en `PRINCIPAL` (Marcar Alerta Enviada) — corregido

Causa raíz: el nodo `Preparar Marca Alerta` asignaba `_id` como string vía `={{ $('Insert Error Log').first().json._id }}` — n8n's Set-node string coercion llama `JSON.stringify()` sobre el objeto `ObjectId` de Mongo (que tiene `toJSON()` devolviendo el hex string), produciendo un string con comillas literales embebidas (26 caracteres en vez de 24 hex válidos). El downstream `Marcar Alerta Enviada` (mongoDb update por `_id`) fallaba con `BSONError`.

**Fix:** cambiado a `={{ $('Insert Error Log').first().json._id.toString() }}` (llamada explícita a `.toString()` antes de que corra la coerción de n8n). Publicado (`activeVersionId: e3272b60-a324-4078-aa23-302b558c4d5c`). **No verificado todavía con un caso real** — pendiente confirmar la próxima vez que esa rama de alerta se dispare de verdad.

## 2. Correos de inventario ("FORJADO Inventory Sync") acumulándose sin leer — corregido

`FORJADO Inventory Sync Email` (Gmail Trigger de `VECTORIZAR - KB`) filtra `readStatus: unread`, pero ningún nodo posterior marcaba el mensaje como leído tras procesarlo — footgun clásico de Gmail Trigger. Contados 5 correos pendientes con un workflow temporal de solo lectura (`TEMP - Count Unread Inventory Emails`, archivado después).

**Fix:** nodo nuevo `Marcar Email Leido (Inventario)` (Gmail, `markAsRead`, `messageId` del propio email del trigger), conectado en paralelo desde `Reinyectar Chunks`. Publicado (`activeVersionId: e660d7fb-27ab-491e-8274-7ee622077420`). El backlog de 5 correos ya existentes en la bandeja se dejó para que Jorge los marque manualmente (no se automatizó un backfill de eso).

## 3. Rances Car nunca tuvo sync de inventario propio — pipeline construido y backfill real ejecutado

Al revisar "¿Rances Car tiene el mismo bug?" se encontró que Rances Car simplemente **nunca tuvo ningún pipeline de inventario** — el reporte diario de DealerCenter y `VECTORIZAR - KB` son 100% específicos de Carwarriors LLC (dealer `CW`). Jorge aclaró: **Rances Car no tiene cuenta de DealerCenter propia — debe nutrirse del mismo reporte que ya llega para Carwarriors** (inventario físico compartido entre ambos dealers).

**Ambigüedad de datos encontrada y resuelta antes de tocar nada:** la data table `GHL Locations` tenía 3 filas con distinto `dealer` para el mismo `locationId` de Rances Car (`Rances Car`, `RC`, `RANCES`). En vez de asumir, se le preguntó a Jorge cómo decidir — eligió "verificar cuál usa producción ahora". Se confirmó contra Mongo real (`TEMP - Distinct Dealers in Mongo`, aggregate por `dealer`): `RANCES` con 10 documentos reales vs `CW` con 137 — `RANCES` es el código real en uso.

**Construido en `VECTORIZAR - KB` (`47Lbdo6oI4fUYEzN`):** rama paralela que reusa el mismo Excel de DealerCenter ya parseado (`Parsear Inventario a Chunks`), remapea cada chunk a `dealer: 'RANCES'` con id `inv_RANCES_*` (nodo `Generar Chunks RANCES`), borra el inventario viejo de Rances en Mongo (`Borrar Inventario Anterior (RANCES)`, filtro `{dealer: "RANCES", categoria: "inventario"}`) y reinyecta los chunks (`Reinyectar Chunks (RANCES)`) hacia el mismo `Split Out`/vector store compartido. Publicado (`activeVersionId: a250e7e4-0226-4a99-b459-f3eef38a2eda`).

**Backfill real inmediato** (no se esperó al próximo correo): workflow temporal `TEMP - Backfill Inventario RANCES` ejecutó el pipeline completo real (Gmail → Excel → parse → remap dealer → delete → reinject → split → vector insert). Verificado con conteo real en Mongo (`TEMP - Count Inventario por Dealer`): **CW: 133, RANCES: 133** — paridad exacta confirmada. Todos los workflows temporales usados (5 en total: conteo de correos, listado de locations, distinct dealers, test del remap, backfill, conteo final) fueron archivados inmediatamente después de usarse.

**Limpieza de datos:** a pedido explícito de Jorge ("limpia las filas duplicadas de GHL Locations"), se borraron las 2 filas obsoletas/incorrectas de la data table `GHL Locations` (`id=3` dealer `Rances Car`, `id=4` dealer `RC`), dejando solo `id=1` (`CW`) e `id=2` (`RANCES`) — las 2 en uso real. Hecho con dry-run primero (`options.dryRun: true`), confirmado que solo afectaría esas 2 filas, y luego la eliminación real. Workflow temporal (`TEMP - Delete Duplicate GHL Locations Rows`) archivado después.

## 4. Deduplicación de leads entre dealers (Tesla CW / Tesla Rances) — construido y publicado

**Reporte de Bianca (vía Jorge):** cuando un lead entra por "Tesla Carwarriors" se registra bien, pero si el mismo lead real entra también por "Tesla Rances" se duplica — se pidió que exista un solo lead, con constancia clara de por cuáles dealers entró.

**Causa raíz confirmada:** los contactos de GHL viven en sub-cuentas (locations) separadas por dealer — el mismo teléfono real genera un `contactId` distinto en cada location. `LEAD - COLLECTOR` (workflow único, compartido por `PRINCIPAL` y `PRINCIPAL - Rances Car`) guarda la colección `leads` en Mongo keyed por `contactId` — sin ningún vínculo entre los 2 documentos que puede generar la misma persona real. **Verificado con datos reales, no solo teoría:** se encontró el mismo teléfono (`+17862981911`) en 2 `contactId` distintos dentro de `leads` (workflow temporal de inspección `TEMP - Inspect Leads Schema`, archivado después) — el caso exacto que describió Bianca, ya ocurriendo en producción. De paso se confirmó que la colección `leads` **no guarda un campo `dealer` por documento**, lo que descarta un backfill retroactivo confiable (no hay forma de reconstruir con certeza por cuál dealer entró cada lead histórico).

**Fix aplicado en `LEAD - COLLECTOR` (`4r00JFnCyoUpZgXU`):** rama nueva en paralelo a la existente (no la reemplaza), que corre cuando hay teléfono:
- `Tiene Telefono (Master)?` (IF) → `Buscar Lead Master` (Mongo find en colección nueva `leads_master` por teléfono) → `Merge Lead Master` (Code: mergea un array `fuentes` con `{dealer, locationId, contactId, canal, primeraEntrada, ultimaEntrada}`, dedupeando por `dealer`+`contactId`) → `Upsert Lead Master` (Mongo update/upsert por `telefono`).
- En paralelo, `Nuevo Match Multi-Dealer?` (IF: `nuevoMatchCrossDealer === true`, calculado cuando se agrega una fuente nueva Y ya hay más de un dealer distinto) → `Avisar Lead Multi-Dealer` (Slack `#notificaciones`, credencial `Slack FORJADO`), para que la primera vez que un teléfono aparece en más de un dealer quede visible, no solo enterrado en Mongo.

6 nodos nuevos, todos validados con `validate_node_config` antes de aplicarse (`valid: true`), aplicados atómicamente vía `update_workflow` (12 operaciones, 0 `validationWarnings`), wiring verificado con `get_workflow_details` post-cambio, publicado (`activeVersionId: 859099a1-689c-492c-9d69-80d9834da148`). Como es el mismo workflow compartido por ambos dealers, el fix cubre `PRINCIPAL` y `PRINCIPAL - Rances Car` sin necesidad de replicarlo por separado.

## Pendiente real

- Confirmar con tráfico real la próxima vez que la rama de `Marcar Alerta Enviada` de `PRINCIPAL` se dispare (fix BSONError sin verificar en vivo todavía). **Verificado 09-09 ~15:30:** cero ejecuciones con `status: error` en `PRINCIPAL` desde el fix — no es que esté confirmado, es que esa rama simplemente no se ha vuelto a disparar todavía.
- Confirmar con el próximo correo real de "FORJADO Inventory Sync" que la corrida automática (no manual) sigue funcionando con el fix de `markAsRead` y con la nueva rama de Rances Car juntas. **Verificado 09-09 ~15:30:** la única ejecución automática (`mode: trigger`) del día fue a las 05:30 UTC, **antes** de publicar ambos fixes (`markAsRead` publicado 13:23, rama RANCES también). Sigue sin correr ni una vez con el código nuevo — el próximo disparo real es el correo de mañana ~1:30 AM hora Miami.
- Confirmar con tráfico real que `leads_master` se puebla correctamente y que la alerta de Slack de "lead multi-dealer" sale una sola vez por match (no duplicada). **Verificado 09-09 ~15:30, parcialmente confirmado:** revisadas todas las ejecuciones reales de `LEAD - COLLECTOR` desde el publish (13:48). Solo hubo 1 (`id 5456`, 15:15) — la rama nueva `Tiene Telefono (Master)?` sí se ejecutó y evaluó correctamente (telefono vacío → rama `false`, no llegó a tocar Mongo, comportamiento esperado). Confirma que el wiring funciona con tráfico real, pero todavía no hubo ningún caso real con teléfono presente post-publish, así que `leads_master` sigue sin ningún documento real y la alerta multi-dealer sigue sin probarse. (La ejecución con el teléfono real `+13055888624` de las 12:44 fue *antes* del publish de las 13:48, así que no pasó por la rama nueva — no es un bug, solo mal timing.)
- Sin backfill histórico de `leads_master` — el gap de datos (`leads` sin campo `dealer`) impide reconstruir con certeza el historial; el fix aplica solo hacia adelante desde el 09-09.

## Continuación (misma tarde, ~15:30-17:40): segunda pasada de verificación con datos reales + intento de auditoría de ManyChat

A pedido de Jorge ("continuemos con los pendientes" → "todo lo que tenemos pendiente en carwarriors"), se hizo una auditoría más profunda con ejecuciones reales de n8n, cruzando timestamps de publish contra timestamps de ejecución (no solo "¿hay error?").

**Confirmado con tráfico real que la rama nueva de `leads_master` funciona correctamente post-publish.** Revisadas todas las ejecuciones de `LEAD - COLLECTOR` desde el publish (13:48): la ejecución de las 12:44 con un teléfono real (`+13055888624`, Rances Car) fue *antes* del publish (no pasó por la rama nueva — no es un bug, solo timing). Las 3 ejecuciones reales *después* del publish (15:15, 15:27 x2, dos leads nuevos distintos) sí pasaron por `Tiene Telefono (Master)?` y evaluaron correctamente `false` (teléfono todavía vacío en ambos casos) sin tocar Mongo de más — wiring confirmado sano en producción. Sigue sin haber un caso real con teléfono ya capturado post-publish, así que `leads_master` sigue vacío y la alerta multi-dealer sigue sin probarse con un match real.

**Sync de inventario (Rances Car + `markAsRead`):** confirmado que la única corrida automática del día (05:30 UTC) fue *antes* de publicar ambos fixes (13:23) — no hay ninguna corrida automática todavía con el código nuevo. Próximo disparo real: correo de mañana ~1:30 AM hora Miami.

**BSONError en `PRINCIPAL`:** cero ejecuciones con error desde el fix — sigue sin dispararse esa rama, no hay nada que confirmar todavía.

**Chequeo adicional no pedido explícitamente pero relacionado — fix de `ghl_event_id` en RSVP (09-05):** revisadas las 8 ejecuciones reales de `RSVP` + 2 de `RSVP - Rances Car` desde ese fix. Ninguna fue una cancelación/reagendamiento real (`cancelar_cita` siempre `false`, todas citas nuevas) — sigue sin haber un caso real que ponga a prueba el fix del `_id`/`ghl_event_id`.

**Chequeo adicional — comentarios IG/FB (`COMENTARIOS-MANYCHAT`):** confirmado de nuevo que sigue en cero tráfico real — la única ejecución nueva desde el 08-31 sigue siendo la misma prueba sintética por `curl` del 09-05. Van 9 días completos sin un comentario real de Instagram/Facebook.

**Intento de auditar el lado de ManyChat directamente con Playwright — sin completar, varios bloqueos reales encontrados en el camino:**
1. Se intentó levantar una instancia de Playwright propia (headed, perfil separado `manychat-carwarriors`) para loguearse — la página de ManyChat devolvió `451 Unavailable For Legal Reasons` (bloqueo por sanciones OFAC/BIS), aparentemente por la IP de salida de este entorno resolviendo a una jurisdicción sancionada.
2. En un segundo intento (perfil nuevo `manychat-carwarriors2`) ya no salió el 451, pero apareció un check anti-bot ("Confirme que es humano") — no se intentó sortear (evadir detección anti-bot no corresponde), y de todos modos no había credenciales reales de ManyChat de Carwarriors disponibles en la bóveda para completar el login aunque se pasara el check.
3. Jorge aclaró que el problema real era que **no podía ver la ventana de Playwright** (este entorno no tiene una pantalla visible para el usuario, aunque el proceso de Chrome corre de verdad en su Mac). Se pivotó a conectar por **CDP** al Chrome real de Jorge: `open -a "Google Chrome" --args --remote-debugging-port=9222` — primer intento sin efecto (Chrome moderno ignora `--remote-debugging-port` en el perfil default por seguridad si ya hay una instancia corriendo). Segundo intento con perfil nuevo y `-na` (`--user-data-dir="$HOME/chrome-manychat-debug"`) sí funcionó: `playwright-cli attach --cdp=http://127.0.0.1:9222` conectó exitosamente al Chrome real de Jorge.
4. **Pendiente real, sin completar:** Jorge todavía no terminó de loguearse en ManyChat en esa ventana (se confirmó con `window.location.href` que seguía en `/signin`) cuando decidió dejarlo pendiente por hoy. La sesión de Playwright se desconectó (`detach`, sin cerrar el Chrome real de Jorge). **La próxima vez que se retome:** el Chrome con `--remote-debugging-port=9222 --user-data-dir="$HOME/chrome-manychat-debug"` ya probó que funciona — solo falta relanzarlo (o reusar la ventana si sigue abierta), que Jorge complete el login manual (usuario/contraseña + el check anti-bot, ambos pasos que solo puede hacer él), avisar, y recién ahí `playwright-cli attach --cdp=http://127.0.0.1:9222` de nuevo para leer Automation → Flows → "Respuesta Comentarios" → Analytics.

## Continuación 2 (misma tarde, ~18:00): login de Jorge completado, auditoría de ManyChat cerrada con datos reales

Jorge relanzó Chrome con el mismo comando (`open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir="$HOME/chrome-manychat-debug"`), completó el login manual (usuario/contraseña + check anti-bot) y avisó "ya estas dentro" / "listo".

**Reconexión por CDP exitosa** (`playwright-cli attach --cdp=http://127.0.0.1:9222`) — confirmado en `app.manychat.com/fb4391897/dashboard`, logueado como Jorge.

**Hallazgo técnico durante la sesión:** un `page.goto()` (navegación con recarga completa) hacia `/automation/flows` dejaba el `react-root` de ManyChat vacío (230 caracteres, solo el cookie-consent widget) — página en blanco tanto en screenshot como en snapshot, aunque `document.readyState` marcaba `complete` y no había errores JS de la app (solo ruido de extensiones del navegador tipo MetaMask/TronLink). Se descartó que fuera bloqueo anti-bot: al re-atachar sin navegar, el dashboard que Jorge ya tenía cargado sí mostraba contenido completo (39,966 caracteres). **Causa real:** el `goto()` (recarga dura) rompe algo en el SPA de ManyChat bajo CDP; navegar haciendo `click()` en el menú (como un usuario real) sí funciona normalmente. Con eso se navegó de Inicio → Automatización (`/cms`) sin problema, contenido completo (79,665 caracteres).

**Primer intento de búsqueda (impreciso):** al listar los flujos en la raíz de "Automatización" no aparecía nada llamado "Respuesta Comentarios" — solo "Auto-DM de links desde comentarios" (LIVE, 0 ejecuciones) y "Autoenviar enlaces desde comentarios, historias o DMs" (STOPPED, 0). Con eso se concluyó (**incorrectamente**, ver corrección abajo) que el nombre documentado no correspondía a un flujo real y que la causa era simple falta de tráfico orgánico.

## Corrección (misma sesión, minutos después): el flujo "Respuesta Comentarios" sí existe — estaba en la carpeta `FORJADO`, y está STOPPED con el disparador deshabilitado

A pedido explícito de Jorge de revisar todo lo que hay en ManyChat para documentarlo bien, se volvió a entrar (mismo Chrome, misma sesión CDP) y esta vez se encontró la carpeta **`FORJADO`** dentro de "Mis automatizaciones" (no estaba expandida en el primer pase). Adentro: **un solo flujo, llamado literalmente "Respuesta Comentarios"** (creado 2026-08-28, slug `content20260828215429_699312`), modificado **"hace 1 semana"** (≈ 2026-09-02).

**Estado real, confirmado visualmente en el editor (screenshot del canvas):**
- Badge de estado del flujo completo: **STOPPED**.
- El nodo disparador ("Cuando... El usuario comenta tu publicación o Reel", condición "Post or Reel Comments #3") tiene la etiqueta **"Deshabilitado"** superpuesta.
- El resto del cableado es correcto y coincide con lo ya conocido del lado n8n: `Cuando (comenta)` → `Acciones: Solicitud externa` (webhook hacia n8n, dominio visible parcialmente `n8n-...banybim...`, consistente con `COMENTARIOS-MANYCHAT`) → `Condición: es_interes_real es verdadero` → `Instagram: Enviar mensaje (respuesta_dm)`.
- Métricas clave del flujo (todos los disparadores): Envíos 0 veces, Contactos únicos 0, Correos electrónicos 0, Teléfonos 0.

**Causa raíz real (corrige la conclusión anterior de esta misma sesión):** no es falta de tráfico orgánico — **el flujo está apagado y su disparador deshabilitado en ManyChat**, desde aproximadamente el 09-02 (fecha de última modificación). Esto explica exactamente los "9 días en cero" que veíamos desde el lado n8n: aunque llegaran comentarios reales a los posts, ManyChat no los está capturando porque el disparador está desactivado. El cableado construido (llamada a n8n, evaluación de interés real, DM de respuesta) sigue siendo correcto — el problema es que quedó detenido después de publicarse, no un bug de diseño ni de n8n.

**No se tocó nada** (no se reactivó el disparador ni se cambió el estado STOPPED — decisión de reactivarlo o no le corresponde a Jorge/Bianca, no a este chequeo). Sesión de Playwright desconectada limpiamente (`detach`), Chrome real de Jorge intacto.

**Pendiente real, nuevo:** decidir con Jorge/Bianca si el flujo "Respuesta Comentarios" se reactiva (disparador + estado del flujo) — probablemente lo detuvieron a propósito durante alguna prueba o revisión y quedó sin reactivar. Sin eso, seguirá en cero sin importar cuánto tráfico real llegue a los posts.

## Continuación 3 (misma tarde, ~18:30-18:45): auditoría completa de ManyChat, a pedido de Jorge ("revisa todo todo de ManyChat")

Con la misma conexión CDP al Chrome de Jorge, se recorrió sistemáticamente toda la cuenta de ManyChat (no solo el flujo de comentarios) para dejar registrado qué hay implementado y configurado. Resultado completo en la página nueva [[../../wiki/clientes/carwarriors-llc-manychat-configuracion|wiki/carwarriors-llc-manychat-configuracion]] — resumen de lo más relevante:

- **Cuenta:** plan TRIAL, propietario real "booxter marketing" (no Jorge), Jorge es Administrador. Sin Clave de API generada — la integración con n8n es unidireccional (ManyChat llama a n8n vía Solicitud externa, no al revés).
- **Canales:** solo **Instagram** (`@carwarriorsllc`) conectado. WhatsApp, Messenger, SMS, TikTok, Telegram, Correo — todos sin conectar en ManyChat (confirma que son legacy/no usados ahí, el negocio real corre por GHL).
- **Automatizaciones básicas de Instagram:** "Saluda a nuevos seguidores" en vivo, "Respuesta predeterminada" pausada, resto (Menú principal, Introductores de conversación, Respuesta a mención de historia) sin configurar.
- **Manychat AI nativa:** 0 de 2 pasos completados, no activada — confirma la decisión ya tomada de clasificar vía n8n en vez de la IA nativa de comentarios.
- **Secuencias:** ninguna configurada.
- **6 flujos en la raíz** (fuera de carpetas): 2 LIVE con tráfico real (`Turn story replies into leads` 4 ejecuciones/75% CTR, `Saludá a tus nuevos seguidores` 371 ejecuciones/25.7% CTR), 1 LIVE sin tráfico (`Auto-DM de links desde comentarios`, 0), 1 DRAFT, 2 STOPPED.
- **Carpeta FORJADO:** solo el flujo `Respuesta Comentarios` (ya documentado arriba, STOPPED).
- **Campos de usuario:** solo 3, todos usados por `Respuesta Comentarios` (`es_interes_real` Boolean, `respuesta_dm` Text, `respuesta_publica` Text) — sin campos huérfanos de pruebas viejas.
- **Etiquetas:** 4, todas auto-generadas por flujos existentes.
- **Integraciones del marketplace:** ninguna conectada (ActiveCampaign/MailChimp/HubSpot/Kit todas en "Paso 1").

Sesión de Playwright desconectada limpiamente al final (`detach`), Chrome real de Jorge intacto.

## Continuación 4 (misma tarde, ~19:15): flujo "Respuesta Comentarios" reactivado, a pedido de Jorge

Jorge dejó abiertas las pestañas de ManyChat y GHL en su Chrome real y pidió avanzar. Se reconectó por CDP (`playwright-cli attach --cdp=http://127.0.0.1:9222`, puerto ya vivo) y, con confirmación explícita de Jorge, se reactivó el flujo:

1. Navegado por clicks reales (no `goto`, para no romper el SPA — ver hallazgo técnico de la Continuación 1) hasta `Automatización → FORJADO → Respuesta Comentarios → Editar Automatización`.
2. El canvas del editor de flujo **no es DOM real** (confirmado de nuevo esta vez: `document.querySelectorAll` no encuentra nada del contenido del canvas, y el único `<iframe>` de la página es el widget de cookies de Usercentrics, no el builder) — se interactuó vía coordenadas de mouse reales (`mousemove`/`mousedown`/`mouseup`) sobre capturas de pantalla, igual que un usuario humano.
3. Click en el nodo disparador (`Cuando... El usuario comenta tu publicación o Reel`) → abrió el panel de configuración del trigger "Post or Reel Comments #3", con el toggle de habilitación apagado en la parte inferior.
4. Click en ese toggle → **se activó al instante** (azul) y el badge de estado del flujo, en la cabecera, cambió de **STOPPED** a **LIVE** automáticamente — no hizo falta ningún paso adicional de "publicar" o "activar flujo" por separado, habilitar el disparador fue suficiente. Cambio guardado automáticamente (indicador "Guardado" en la cabecera).
5. Confirmado visualmente en captura final: badge LIVE, toggle del trigger "Post or Reel Comments #3" en azul/activado, cableado intacto (`Cuando comenta` → `Acciones: Solicitud externa` → `Condición: es_interes_real` → `Instagram: Enviar mensaje respuesta_dm`).

**Estado a partir de ahora:** el flujo está LIVE con el disparador activo. Comentarios nuevos en posts/reels de Instagram de `@carwarriorsllc` deberían empezar a disparar el webhook hacia n8n (`COMENTARIOS-MANYCHAT`) de inmediato. Pendiente verificar en los próximos días si empieza a entrar tráfico real (0 ejecuciones al momento de la reactivación, como se esperaba de un flujo recién prendido).

Sesión de Playwright desconectada limpiamente (`detach`) al final, Chrome real de Jorge intacto — no se tocó la pestaña de GHL.

## Continuación 5 (misma tarde, ~20:20-20:50): revisión de solapes con otros flujos activos, y detenido un flujo viejo por precaución

Jorge preguntó si el flujo recién reactivado estorbaba con el resto de automatizaciones activas en ManyChat. Reconectado por CDP de nuevo, se auditaron los triggers de los demás flujos LIVE/STOPPED de la raíz:

- **`Saludá a tus nuevos seguidores`** (LIVE): trigger de nuevo seguidor — sin relación con comentarios, sin solape.
- **`Turn story replies into leads`** (LIVE): trigger de respuesta a una Historia específica + palabra "REGALO" — es un tipo de trigger distinto (reply a Historia, no comentario en post/reel), sin solape.
- **`Auto-DM de links desde comentarios`** (LIVE, `content20241004134441_182585`): trigger = comentario en **un post/reel específico** (cualquiera de su contenido) + cualquier palabra. Esto SÍ se solapa en teoría con "Respuesta Comentarios" (trigger: cualquier post/reel + cualquier comentario) — un comentario nuevo en ese post puntual dispararía ambos triggers. El flujo lleva **0 ejecuciones desde su creación hace 6 meses** (campaña "club de regalos" old), evidencia de que el post ya no recibe comentarios reales.
- Los otros 2 flujos de la raíz (`Envía links automáticos por DM` DRAFT, `Autoenviar enlaces desde comentarios...` STOPPED, `Instagram Default Reply` STOPPED) no están en vivo, sin riesgo.

No se encontró en la UI de ManyChat ninguna advertencia explícita de conflicto de triggers al activar "Respuesta Comentarios" (ni un aviso de "esto se solapa con X automatizaciones"), y no se pudo confirmar con certeza técnica qué pasaría si un comentario real coincidiera con ambos triggers a la vez (¿dispara solo uno por prioridad, o ambos?) — no se siguió investigando ese mecanismo interno de ManyChat porque el flujo solapado ya estaba efectivamente muerto.

**Decisión de Jorge:** detener `Auto-DM de links desde comentarios` en vez de dejarlo correr o investigar más a fondo el mecanismo de conflicto — elimina cualquier riesgo de doble respuesta sin costo real (0 tráfico en 6 meses). Acción hecha: click en "Detener" desde la vista de Insights del flujo → badge pasó de LIVE a **STOPPED** al instante, sin diálogo de confirmación. No se tocó ningún otro paso de ese flujo (mensajes, DM de apertura, etc. — siguen intactos por si se quiere reactivar más adelante).

**Estado final de comentarios en Instagram tras esta sesión:** solo `Respuesta Comentarios` (carpeta FORJADO) queda LIVE con trigger de comentarios, sin ningún otro flujo compitiendo por el mismo evento.

Sesión de Playwright desconectada limpiamente (`detach`) al final.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-08-fix-critico-sync-inventario-vacio]]
- [[2026-09-05-auditoria-sync-leads-ghl-dealercenter-bidireccional]]
- [[2026-09-05-comentarios-ig-fb-auditoria-n8n-sano-sin-trafico-real]]
- [[../../wiki/clientes/carwarriors-llc-inventario-ghl]]
- [[../../wiki/clientes/carwarriors-llc-manychat-configuracion]]
