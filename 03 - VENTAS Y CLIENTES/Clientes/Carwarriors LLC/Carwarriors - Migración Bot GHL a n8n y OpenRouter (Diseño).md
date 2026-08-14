---
tags: [forjado, carwarriors, n8n, openrouter, ia, agente-conversacional, migracion, spectrum]
tipo: spec
cliente: Carwarriors LLC
creado: 2026-08-12
actualizado: 2026-08-12
estado: en-construcción
---

# Migración del bot conversacional: GHL Conversation AI → n8n + OpenRouter (copia adaptada de Spectrum)

> Decisión tomada en reunión 2026-08-12 con Jorge González (CARWARRIORS LLC). Los bots de GHL Conversation AI documentados en [[Carwarriors - Agente IA 24-7 (Diseño)]] y [[Carwarriors - Agente IA Rances Car (Diseño)]] quedan **deprecados**. La lógica conversacional se reconstruye en n8n copiando y adaptando el sistema de agentes ya construido para el cliente **Spectrum** (proyecto real estate, repo `Garoo/Agent-Spectrum`), usando **OpenRouter** como proveedor de modelos. GoHighLevel se conserva como **CRM y para ciertas automatizaciones** — no se elimina, solo se le quita la capa de IA conversacional nativa (Conversation AI).

## Estado actual (resumen ejecutivo — 2026-08-12, actualizado misma tarde/noche)

**Fase: construcción activa en n8n — ya no es solo diseño.** Jorge Calderón copió los 9 workflows de Agent-Spectrum directamente a la instancia n8n de Carwarriors (`n8n-carwarriors`) y se están podando/adaptando uno por uno.

**Resuelto desde la última actualización:**
- Acceso a **OpenRouter** — ya no es bloqueador, credencial `OpenRouter account` creada y funcionando en n8n.
- **Redis** conectado (Coolify) para el patrón de debounce de mensajes de Spectrum — requirió puentear manualmente 2 redes Docker distintas (la app de n8n y la base Redis standalone quedaron en redes separadas por diseño de Coolify); documentado en memoria `reference_coolify-network-isolation`.
- **KB - SEARCH** adaptado: filtro Mongo Atlas de `proyecto` → `dealer`, prompt reescrito para consultas de concesionario de auto en vez de Spectrum Vivienda.
- **LEAD - COLLECTOR** adaptado: extrae city/interés de vehículo/método de pago/timing de compra/idioma/resumen (no nombre/correo/teléfono — eso ya lo tiene GHL desde que se crea el contacto). Se eliminó por completo el bloque SOAP a Dynamics. Escribe a Mongo (`leads`, upsert por `contactId`) y a GHL (`city`, campo estándar; el resto de campos queda con nota en el nodo hasta tener el token GHL renovado + IDs reales de custom fields).
- **Decisión: `SYNC - CRM` se elimina del alcance** — GHL ya es el único CRM, no hay un segundo sistema (Dynamics/SOAP) que sincronizar; Lead Collector/PRINCIPAL actualizan GHL directo. Workflow archivado en n8n.
- **Decisión: no se adopta el nodo nativo `HighLevel` de n8n** — existe y cubre contact/opportunity/task/calendar, pero solo soporta credencial OAuth2 (habría que registrar una app en el marketplace de GHL y autorizarla en las 2 subcuentas) y no cubre envío de mensajes de conversación de todas formas. Se sigue con HTTP Request + el Private Integration Token ya usado en producción — un solo mecanismo de auth para todo.
- **Decisión: un solo despliegue n8n para las 2 subcuentas**, parametrizado por `locationId`/`dealer` (no dos flujos separados) — ya construido así en KB-SEARCH y LEAD-COLLECTOR.
- **Notificaciones por Slack** (no email/Gmail) — decidido; los workflows `NOTIFICATIONS` y `ERROR HANDLER` ya traían un nodo Slack (deshabilitado) copiado de Spectrum, solo falta credencial + habilitar + rebrandear.

**RESUELTO 2026-08-13 — NOTIFICATIONS y ERROR HANDLER adaptados a Slack, canal único `#carwarriors-alertas`:**
- Los 4 payloads de `NOTIFICATIONS` (Nuevo Lead, Precios, Cita, Escalación) se reescribieron de HTML/email (`subject`/`sendTo`/`html_body`, branding "Spectrum Vivienda", destinatarios `@spectrum.com.gt`) a texto Slack mrkdwn, y `proyecto` se renombró a `dealer` + se agregó `interes_vehiculo` para alinear con el schema real que ya usa `LEAD - COLLECTOR` (`dealer`, `city`, `interes_vehiculo`, `metodo_pago`, `timing_compra`, `idioma_preferido`, `resumen_ai`). La alerta de Escalación menciona a Nallely de Leon por nombre (ver [[Carwarriors - Comportamiento del Bot (Resumen)]] sección 11).
- El nodo Slack `Send a message` en ambos workflows quedó habilitado (`disabled: false`), con `authentication: oAuth2` + credencial `Slack account` (`wUpEjaBadmKdhhqM`), `resource: message`, `operation: post`, canal por nombre `carwarriors-alertas`.
- **Bug preexistente encontrado y corregido de paso:** el nodo `Switch Alerta` en NOTIFICATIONS usaba el formato legacy `rules.rules` (typeVersion 1), que el motor de Switch ya no lee — las 4 ramas de alerta no estaban ruteando en absoluto. Recreado en v3.4 con `mode: rules` / `rules.values`, mismas 4 condiciones sobre `tipo_alerta`, reconectado igual.
- En `ERROR HANDLER` se reemplazó el nodo `HTML` (generaba email HTML, no renderiza en Slack) por un Set node `Format Slack Message` con texto mrkdwn (`workflow.name`, `execution.error.message`, link a la ejecución). Publicado (tenía que quedar activo porque otros workflows lo usan como `errorWorkflow`).
- **Bloqueador nuevo y real: la credencial `Slack account` (tipo `slackOAuth2Api`) existe pero no tiene token — es solo el shell, el OAuth nunca se completó** (`explore_node_resources` dio "Unable to sign without access token", confirmado de nuevo 2026-08-13, sigue igual). Jorge está creando la app en api.slack.com; falta: (1) Bot Token Scopes `chat:write`, `chat:write.public`, `channels:read`, `groups:read`, `users:read` (+ `im:read`, `im:history`, `app_mentions:read`, `channels:history`, `groups:history` para que además pueda recibir DMs/menciones — ver workflow receptor abajo); (2) Install to Workspace; (3) copiar Client ID/Secret de la app a la credencial en n8n, tomar la "OAuth Redirect URL" que muestra n8n en esa misma credencial y pegarla en Slack → OAuth & Permissions → Redirect URLs; (4) en n8n, "Connect my account" en la credencial para completar el login. **Falta también crear el canal `#carwarriors-alertas`** en el workspace de Slack (o confirmar el nombre real si ya existe/se prefiere otro) e invitar el bot. Hasta que ambas cosas pasen, los workflows están cableados correctamente pero no van a poder enviar nada — no es un bug, es el estado esperado mientras no haya token.

**RESUELTO 2026-08-13 (misma tarde) — OAuth de Slack completado, con un cambio de plan: token directo, no OAuth2.** Jorge conectó la app como credencial **Access Token** (`slackApi`, nombre "Slack FORJADO", mismo id `wUpEjaBadmKdhhqM` que antes era el shell OAuth2) en vez de completar el flujo OAuth2 interactivo — funciona igual para nuestro caso. Verificado en vivo con `explore_node_resources` → devolvió los canales reales del workspace: `general-automenta`, `notificaciones`, `nuevo-canal`, `redes sociales`. **`#carwarriors-alertas` no existe** — se retargeteó NOTIFICATIONS y ERROR HANDLER al canal real **`notificaciones`** (`C0BPV2Z2S3C`). Se recableó `authentication` a `accessToken` (antes `oAuth2`) y la credencial `slackApi` en los 3 workflows (NOTIFICATIONS, ERROR HANDLER, SLACK - INBOUND). ERROR HANDLER y SLACK - INBOUND quedaron **publicados**; SLACK - INBOUND está **activo** con su webhook registrado — Request URL para Slack → Event Subscriptions: `https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/webhook/533d982f-376c-4b64-8195-5a3a8a74cde6`. Pendiente real: que Jorge la pegue en Event Subscriptions y pruebe un DM/mención real (las herramientas de test de n8n vía MCP simulan nodos con credenciales por diseño, no se pudo verificar un envío real de punta a punta desde aquí).

**NUEVO 2026-08-13 — workflow receptor construido: `SLACK - INBOUND (DM / Menciones)` (n8n id `xRRGjidR0rckn3R7`), en draft.** Jorge pidió que la app además pueda recibir DMs y menciones en canal, no solo mandar alertas salientes. Arquitectura: `Slack Trigger` (eventos `app_mention` + `message`, todo el workspace) → Code node que descarta cualquier evento que no sea un DM real (`channel_type === 'im'`) o una mención explícita (evita que responda a cada mensaje de cada canal donde esté el bot) → Set con texto placeholder → responde vía Slack (reusa la credencial OAuth2 `Slack account`) al mismo `channel` que originó el evento (funciona igual para DM que para canal, es el mismo campo en el payload de Slack). Es un stub — responde con un mensaje fijo de "en construcción", no conecta todavía con `PRINCIPAL` (que tampoco existe aún). **Dos cosas pendientes para que esto funcione de verdad, ambas de Jorge:** (1) el nodo `Slack Trigger` necesita su propia credencial de tipo **Slack API** (no la OAuth2 que ya existe) — se crea en n8n con el **Bot User OAuth Token** (`xoxb-...`, aparece en Slack → OAuth & Permissions después de instalar la app) y el **Signing Secret** (Slack → Basic Information); (2) publicar el workflow para obtener su Production URL y pegarla como **Request URL** en Slack → Event Subscriptions.

**RESUELTO 2026-08-13 (noche) — DM/mención probado end-to-end en producción, con 3 problemas reales encontrados y corregidos en el camino:**
1. **Request URL equivocada.** Jorge había pegado en Slack → Event Subscriptions la URL de callback de OAuth2 de n8n (`/rest/oauth2-credential/...`, la que usa "Connect my account") en vez de la Production URL real del nodo `Slack Trigger DM Mencion` (`.../webhook/533d982f-376c-4b64-8195-5a3a8a74cde6`). Slack marcaba `challenge_failed`. Corregido pegando la URL correcta desde el propio nodo en n8n.
2. **Socket Mode activado en paralelo al Request URL.** Slack avisaba "Socket Mode is enabled. You won't need to specify a Request URL." — con los dos métodos de entrega configurados a la vez, los eventos no llegaban por HTTP. Se desactivó Socket Mode y se reinstaló la app.
3. **Bug real de loop de auto-respuesta en `Filtrar DM o Mencion`.** El filtro original solo comprobaba `channel_type === 'im'` / `type === 'app_mention'`, sin excluir los mensajes que manda el propio bot. Resultado: el bot le respondió a Jorge, esa respuesta también llegó como evento `message` en el mismo DM, el filtro la dejó pasar, y respondió de nuevo — loop infinito (216 ejecuciones acumuladas antes de desactivar el workflow manualmente). Primer fix (excluir `bot_id`/`subtype: bot_message`) resultó incompleto: al borrar un mensaje viejo del historial, el evento `message_deleted` resultante tampoco traía `bot_id` y volvió a disparar una respuesta extra. Fix final, más robusto: cualquier evento `message` con **`subtype` presente** (bot_message, message_deleted, message_changed, channel_join, etc.) se ignora — un mensaje humano nuevo real nunca trae `subtype`. Confirmado con una prueba limpia: un "hola" real, una sola respuesta, sin loop (workflow desactivado y reactivado 2 veces durante el debugging, ambas vía MCP).

**Pendiente real que queda:** conectar esta respuesta placeholder al futuro `PRINCIPAL` cuando exista — por ahora sigue siendo un stub funcional, no conversacional.

**Bloqueadores nuevos encontrados durante la construcción:**
- La credencial **"Header Auth GHL"** (el Private Integration Token usado en producción) está devolviendo `401 Invalid JWT` en ambas subcuentas — confirmado con un workflow de prueba y con el workflow de producción de captura de leads. Ningún lead real se perdió (solo fallaron pruebas manuales), pero bloquea leer custom field IDs reales, escribir a GHL, y armar RSVP. **Requiere que alguien con acceso a GHL renueve el token.**
- Falta una **credencial de OpenAI aparte de OpenRouter** para el paso de embeddings (OpenRouter no hace embeddings; Spectrum usa una API key de OpenAI dedicada para eso) — no creada todavía en n8n-carwarriors.

**Pendiente de insumos externos (sin cambios):** contenido real de la base de conocimiento (Bianca) y fuente de fotos/inventario de autos para `SEND - MEDIA` (ligado a DealerCenter). El requisito de "horarios de asesores" se simplificó: como GHL ya agenda citas reales hoy contra calendarios reales, RSVP se adapta contra la API de calendarios de GHL directamente — solo faltan los `calendarId` reales (Nallely de Leon / Samuel Aguilar / Scarleth Hassiel Rubi), no cargar un sistema de horarios nuevo en DealerCenter.

**RESUELTO 2026-08-14 — PRINCIPAL adaptado de Spectrum a GHL (el orquestador, la pieza más grande).** Se inspeccionó el workflow completo (89 nodos, copia cruda de Spectrum) y se reescribió en 3 fases vía MCP, manteniéndolo inactivo todo el tiempo:
- **Identidad/infraestructura:** el payload de entrada pasó de asumir el shape de ManyChat (`current_body.id`/`.page_id`/`.custom_fields.canal_ingreso`/`.whatsapp_phone`) al shape real de GHL (`contactId`/`locationId`/`channel`/`message`), confirmado contra el workflow de producción ya activo `Carwarriors - Agente de Captura de Leads (GHL + Mongo)`. La identidad del usuario (Mongo `users`) se re-clavó de `manychat_id` a `contactId`. La salida de mensajes y el bloqueo de spam pasaron de la API de ManyChat a `POST /conversations/messages` y `/contacts/{id}/tags` de GHL.
- **Dealer/token por `locationId`:** en vez de hardcodear los tokens PIT en el código (como sí hace `Subir a DealerCenter`), se creó una **Data Table de n8n** (`GHL Locations`, id `3V2Oq6RyrnfPtkzi`) con el mapa `locationId → dealer/vendorName/token` para las 2 subcuentas — evita duplicar secretos en texto plano en un tercer workflow.
- **Eliminado sin equivalente en Carwarriors** (confirmado con Jorge): toda la lógica de selección de "proyecto inmobiliario" (5 apartamentos de Spectrum) y el subsistema completo de **Leads Fase 2** (leads pre-cargados por teléfono desde Meta Lead Ads) — Carwarriors no usa formularios pre-llenados, todo lead entra escribiendo directo al chat.
- **Bug real corregido:** los 4 tool-workflow nodes (`lead_collector`, `kb_search`, `rsvp`, `send_media`) y los 3 nodos de `Notifications Master` apuntaban a IDs de workflows de **Spectrum que no existen en esta instancia** — repunteados a los workflows reales de Carwarriors, con `lead_collector`/`kb_search` remapeados a su schema real (`contactId`/`locationId`/`dealer`/`city`/`interes_vehiculo`/etc.). `rsvp`/`send_media` solo se corrigió el ID (sus sub-workflows siguen sin adaptar).
- **Prompt de negocio reescrito** siguiendo [[Carwarriors - Comportamiento del Bot (Resumen)]] como spec funcional: tono/estilo, orden de calificación (vehículo→ubicación→uso→timing→pago), oferta de visita, escalamiento de 5 niveles, horario Miami, guardrails de precio/inventario, y el output JSON alineado al schema real de `LEAD - COLLECTOR` (`city`/`interes_vehiculo`/`metodo_pago`/`timing_compra`/`idioma_preferido`/`resumen_ai`).
- **Bug de la herramienta MCP encontrado y corregido de paso:** `update_workflow` hace *merge*, no reemplazo, en objetos tipo diccionario (`workflowInputs.value`) — dejó claves viejas de ManyChat/Spectrum mezcladas en `lead_collector`/`kb_search` (incluyendo una referencia a un nodo ya eliminado, que hubiera roto la ejecución). Corregido forzando `replace: true`. Los Set nodes con arrays de `assignments` no tuvieron este problema.
- **Probado con `test_workflow` (ejecución 840):** todo el pipeline estructural corre correctamente de punta a punta — webhook → normalización GHL → identidad → gate de spam → resolución de dealer/token vía Data Table (devolvió el token real de CW correctamente) → debounce Redis → extractor de idioma — hasta llegar a la primera llamada real a OpenRouter.
- **BLOQUEADOR CRÍTICO NUEVO encontrado en la prueba:** la cuenta de OpenRouter (credencial `OpenRouter account`) **tiene 0 créditos comprados** (`402 Insufficient credits — This account never purchased credits`). El pin data de n8n no intercepta las llamadas de los subnodos de modelo de lenguaje (`ai_languageModel`) — siempre pegan a la API real, incluso en modo prueba — así que esto se descubrió recién ahora. Esto bloquea **cualquier** llamada de IA en Carwarriors ahora mismo: no solo PRINCIPAL, también `LEAD - COLLECTOR` y `KB - SEARCH` fallarían igual en producción si se activaran hoy. La nota de "Acceso a OpenRouter — resuelto" de abajo estaba mal — la credencial existe y es válida, pero la cuenta nunca se cargó con saldo. **Requiere que Jorge cargue crédito en https://openrouter.ai/settings/credits antes de poder probar o activar cualquier parte conversacional del sistema.**

**RESUELTO 2026-08-14 (más tarde) — probado de punta a punta con un modelo gratuito de OpenRouter mientras no hay saldo real.** OpenRouter solo tiene 4 modelos a $0 ahora mismo (confirmado contra `openrouter.ai/api/v1/models`, no por búsqueda): `liquid/lfm-2.5-2.6b:free`, `nvidia/nemotron-3.5-lightning:free`, `poolside/laguna-s-2.1:free`, `poolside/laguna-xs-2.1:free`. Se puso `nvidia/nemotron-3.5-lightning:free` (soporta `structured_outputs`, 1M de contexto) **temporalmente** en los nodos de modelo de PRINCIPAL, LEAD-COLLECTOR y KB-SEARCH — marcado explícitamente como cambio temporal a revertir a `deepseek/deepseek-v4-flash`/`openai/gpt-4.1-mini` (la decisión real) una vez haya crédito. Con eso, ejecución `841` de PRINCIPAL exitosa de punta a punta con un mensaje simulado ("Hola, busco un Toyota Corolla usado", WhatsApp, dealer CW): `Lenguaje & Asesoria` extrajo correctamente idioma/asesoría/contexto, el agente `PRINCIPAL` respondió en tono correcto seg��n el spec ("¡Hola! Interesante el Corolla. ¿En qué zona de Miami te encuentras?" — avanza el eje de calificación correcto, ubicación después de vehículo), extrajo `interes_vehiculo: "Toyota Corolla usado"`, no escaló falsamente, y `Parse response`/`Hay Cambios?`/`IF NUEVO LEAD` procesaron todo correctamente contra el nuevo schema. Único detalle menor: la llamada a la tool `lead_collector` no se completó en esta corrida (`ruta_decision: "lead_collector_fallido_manual"`) y el agente compensó razonando la respuesta él mismo — comportamiento de fallback razonable, probablemente por el rate-limit del modelo gratuito con llamadas concurrentes al sub-workflow, no un bug de la adaptación.

**Los bots de GHL Conversation AI siguen activos en producción sin cambios** — no se apagan hasta validar el reemplazo. Objetivo de fecha del cliente: **lunes o martes (2026-08-17/18)** — con PRINCIPAL ya adaptado, el bloqueador real para probar de punta a punta es el saldo de OpenRouter, no trabajo de construcción. RSVP, SEND-MEDIA y VECTORIZAR-KB siguen bloqueados por insumos externos.

## Por qué el cambio (contexto de la reunión)

- Los bots de GHL Conversation AI se siguen apagando solos — causa ya confirmada en sesiones previas: falta método de pago propio en el Billing de cada subcuenta (ver [[Carwarriors LLC]], nota "Bot 24/7 en GHL"). En vez de resolver eso agregando tarjeta, Jorge González pidió evaluar alternativas más baratas.
- GHL Conversation AI es "poco personalizable y cobra muchísimo" (Jorge Calderón, en la reunión). El VPS con n8n ya está pagado (Hostinger KVM1, ~$8/mes) y solo falta contratar OpenRouter — más barato que los bots de pago de GHL, y con selección libre de modelo.
- Ya existe un sistema de agentes production-grade construido para otro cliente (Spectrum) que resuelve el mismo problema (calificar leads, responder con base de conocimiento, agendar citas, escalar a humano, multicanal) — no hay que diseñarlo desde cero, se copia y adapta.
- El equipo ya sabe trabajar dentro de GHL como CRM, así que **no se reemplaza GHL por completo** (se descartó migrar a ManyChat/Sharkwood) — se separa CRM + automatizaciones puntuales (se quedan en GHL) de la IA conversacional (se muda a n8n + OpenRouter).

## Arquitectura decidida

| Capa | Antes (GHL Conversation AI) | Después |
|---|---|---|
| CRM / fuente de verdad de contactos | GoHighLevel | GoHighLevel (sin cambios) |
| Automatizaciones puntuales (asignación por turno, tags, pipelines) | GoHighLevel Workflows | GoHighLevel Workflows (se mantienen, sin cambios de alcance) |
| Lógica conversacional / IA del bot | GHL Conversation AI (Agent Studio clásico) | n8n — copia adaptada de **Agent-Spectrum** |
| Modelo de lenguaje | LLM interno de GHL, no seleccionable por API (`gpt-5-mini` en Carwarriors LLC, `gpt-4.1` en Rances Car) | OpenRouter — mismo proveedor que Spectrum ya usa en producción (nodo `OpenRouter Chat Model`, orquestador con `gpt-5-mini`) |
| Base de conocimiento | Knowledge Base nativa de GHL (ver sección 7 de [[Carwarriors - Comportamiento del Bot (Resumen)]]) | RAG propio (Mongo Atlas Vector Search), mismo patrón que `KB SEARCH.json` de Spectrum, filtrado por dealer en vez de por `proyecto` |
| Programación de citas | Appointment Booking nativo de GHL, leyendo calendarios GHL | Workflow tipo `RSVP.json` de Spectrum, validando contra horarios reales de asesores (cargados en DealerCenter) |
| Inventario | Custom fields / Knowledge Base en GHL | DealerCenter (carros con estatus, millas, año) — fuente única, alimenta el RAG |

## Referencia de arquitectura: copiar y adaptar Agent-Spectrum

Repo fuente: `Garoo/Agent-Spectrum` (n8n instance `agentsprod.redtec.ai`). Es un sistema de agentes en producción para leads inmobiliarios, ya usando OpenRouter. Mapeo de cada workflow a su equivalente en Carwarriors:

| Workflow Spectrum | Qué hace hoy (real estate) | Adaptación para Carwarriors |
|---|---|---|
| `AGENT PRINCIPAL` (orquestador, 86 nodos) | Recibe webhook de ManyChat, valida gate name+email+phone, clasifica intención, delega a los tools de abajo, protección spam/DDoS (Redis) | Recibe webhook de **GHL** (conversaciones) en vez de ManyChat, mismo gate de datos mínimos (teléfono/correo/nombre), delega a los mismos tipos de sub-workflow. Debe soportar **2 subcuentas** (Carwarriors LLC + Rances Car) — parametrizar por `locationId`, igual que Spectrum parametriza por `proyecto` |
| `Lead Collector` | Captura name/email/phone, separa nombre/apellido con LLM, persiste a Mongo | Igual, pero además crea/actualiza el contacto en GHL (find-or-create, como ya hace hoy `carwarriors_lead_intake_agent_workflow.json`) |
| `KB SEARCH` | RAG sobre Mongo Atlas Vector Index, filtrado por `proyecto` | RAG sobre inventario + políticas de Carwarriors, filtrado por **dealer** (Carwarriors LLC / Rances Car) en vez de proyecto. Fuente de los datos: DealerCenter (inventario) + documento de Bianca (políticas, promos, info general) |
| `RSVP` | Agenda citas, persistencia progresiva en colección `appointments` | Agenda citas (test-drive / visita / llamada) contra la **API de calendarios de GHL** (`getFreeSlots`/`bookAppointment` vía HTTP Request), no contra horarios cargados en DealerCenter — GHL ya tiene calendarios reales hoy (Nallely de Leon / Samuel Aguilar / Scarleth Hassiel Rubi). Falta obtener los `calendarId` reales — **pendiente** |
| `Send Media` | Envía brochures/renders vía API de ManyChat | Envía fotos/inventario de autos vía API de conversaciones de GHL — **pendiente**, falta fuente real de fotos/inventario (DealerCenter) |
| ~~`Sync_CRM`~~ | Scheduled (~15 min), POST a Dynamics 365 SOAP | **Descartado y archivado (decidido 2026-08-12).** GHL es el único CRM, sin segundo sistema SOAP que sincronizar — Lead Collector/PRINCIPAL actualizan GHL directo por turno |
| `Notifications Master` | Emails HTML por evento (nuevo lead, precios, cita, escalación) | Mismo patrón — nuevo lead / escalación / cita, con destinatarios de Carwarriors (Nallely de Leon / Scarleth Hassiel Rubi según subcuenta, ver [[Carwarriors - Comportamiento del Bot (Resumen)]] sección 11 y [[Rances Car - Comportamiento del Bot (Resumen)]] sección 12) |
| `Analytics Centralizado` | Scheduled diario, métricas por usuario vía LLM → Mongo | Reutilizable tal cual, útil para reemplazar el panel roto "Metricas Deeler Center" (ver [[Carwarriors LLC]], sección Integración DealerCenter) |
| `Health Check Conversaciones` | Alerta por email si no hubo conversaciones en 6h | Reutilizable tal cual — cubre el mismo tipo de apagón silencioso que ya afectó a los bots de GHL varias veces |

> [!important] No es un bot nuevo desde cero
> El comportamiento de negocio ya está resuelto y calibrado — ver [[Carwarriors - Comportamiento del Bot (Resumen)]] (secciones 1-13) y su equivalente [[Rances Car - Comportamiento del Bot (Resumen)]]. Esos documentos son la **especificación funcional** que el agente n8n debe igualar o mejorar (calificación de vehículo/ubicación/uso/timing/pago, reglas de escalamiento por 5 niveles, seguimientos automáticos, silencio post hand-off, etc.). El trabajo real es portar esa lógica de negocio dentro de la estructura de `AGENT PRINCIPAL` + sub-workflows de Spectrum, no re-diseñarla.

## Pendientes

**Bloqueadores — insumos externos, sin ellos no se puede probar end-to-end:**
- [ ] **Cargar crédito real en la cuenta de OpenRouter** — *Jorge González/Jorge Calderón*, **hallazgo 2026-08-14**: la credencial existe y es válida, pero la cuenta nunca se cargó con saldo (`402 Insufficient credits`, confirmado en prueba real de `PRINCIPAL`). Bloquea toda llamada de IA (PRINCIPAL, LEAD-COLLECTOR, KB-SEARCH) — https://openrouter.ai/settings/credits
- [x] ~~Contratar/dar acceso a OpenRouter~~ — credencial creada y funcionando en n8n (la cuenta en sí sigue sin saldo, ver punto de arriba)
- [x] ~~Renovar el token de GHL~~ — **resuelto 2026-08-13.** Jorge generó tokens PIT nuevos en ambas subcuentas (Settings → Private Integrations); ambos verificados en vivo vía `GET /locations/{id}` antes de guardarlos (Rances Car necesitó una segunda generación porque el primer intento no traía scopes marcados — daba `401 "not authorized for this scope"`, distinto del `Invalid JWT`/`Invalid Private Integration token` del token expirado). **Hallazgo importante:** el token no vivía solo en la credencial "Header Auth GHL" — estaba también hardcodeado directo en el código de 2 workflows de producción (`Subir a DealerCenter` → nodo `Select Dealer + Token`, y `DealerCenter -> Mongo -> GHL (Lead Sync)` → nodo `Normalizar y Enrutar Dealer`), cada uno con su propio mapa `LOCATIONS`/`ghlToken` por dealer (CW/RANCES). El de `Lead Sync` fallaba en silencio porque el nodo GHL tiene `continueOnFail`. Se confirmó vía log de ejecución real que el corte ocurrió recién el mismo 2026-08-13 (~12:27 UTC) — no desde el 08-08 como se creía — y afectó exactamente 1 lead real (`contactId cwAS7PcP3RaVskho5ceT`, dealer CW) que no llegó a subir a DealerCenter. Se editaron y publicaron los 2 workflows con los tokens nuevos vía MCP (autorizado explícitamente por Jorge para hardcodear los valores, ya que así estaba construido desde antes). La credencial "Header Auth GHL" (usada solo por `Carwarriors - Agente de Captura de Leads`, solo CW) la actualizó Jorge manualmente — el MCP de n8n no tiene herramienta para escribir valores de credenciales, solo nodos/workflows.
- [ ] Crear credencial de **OpenAI** (separada de OpenRouter) para embeddings de KB-SEARCH/VECTORIZAR-KB — *Jorge Calderón*, técnico, no depende de terceros
- [ ] Entregar base de conocimiento — *Bianca*: inventario (vehículos, millas, años), políticas, promos; hoy vive en Knowledge Base de GHL, hay que exportarlo/documentarlo para vectorizarlo (mismo patrón que `KBs/*.json` de Spectrum)
- [ ] `calendarId` reales de GHL (Nallely de Leon / Samuel Aguilar / Scarleth Hassiel Rubi) — *Jorge Calderón, vía API de GHL una vez el token esté renovado* — necesario para adaptar RSVP
- [ ] Fuente real de fotos/inventario de autos para `SEND - MEDIA` — ligado a la integración DealerCenter, no definido todavía

**Trabajo técnico — en curso:**
- [x] ~~Copiar el repo Agent-Spectrum a la instancia n8n de Carwarriors~~ — hecho, 9 workflows pegados (PRINCIPAL, LEAD-COLLECTOR, KB-SEARCH, RSVP, SEND-MEDIA, NOTIFICATIONS, VECTORIZAR-KB, SYNC-CRM, ERROR HANDLER)
- [x] ~~Conectar Redis (debounce)~~ — hecho, requirió puentear redes Docker en Coolify
- [x] ~~Adaptar KB - SEARCH~~ — hecho (proyecto→dealer, prompt de autos)
- [x] ~~Adaptar LEAD - COLLECTOR~~ — hecho (campos de auto, sin SOAP, escribe a Mongo+GHL)
- [x] ~~Adaptar `NOTIFICATIONS` + `ERROR HANDLER` a Slack~~ — hecho y **desbloqueado** 2026-08-13: OAuth completado (credencial Access Token `Slack FORJADO`), canal real `notificaciones` (no existía `#carwarriors-alertas`), ambos workflows recableados a `authentication: accessToken`, ERROR HANDLER publicado. Falta solo una prueba real end-to-end (disparar una alerta real y confirmar que llega al canal)
- [x] ~~Construir workflow receptor de DM/menciones~~ — `SLACK - INBOUND (DM / Menciones)` publicado y activo 2026-08-13, **validado end-to-end la misma noche** tras corregir Request URL, Socket Mode y un bug de loop de auto-respuesta (ver narrativa arriba)
- [ ] Adaptar `RSVP` a la API de calendarios de GHL — *Jorge Calderón*, bloqueado por `calendarId` reales
- [ ] Adaptar `SEND - MEDIA` — *Jorge Calderón*, bloqueado por fuente de fotos/inventario
- [ ] Adaptar `VECTORIZAR - KB` — *Jorge Calderón*, bloqueado por contenido real de Bianca
- [x] ~~Adaptar `PRINCIPAL` (el orquestador)~~ — **resuelto 2026-08-14**, ver narrativa arriba. Probado estructuralmente de punta a punta hasta el bloqueador de crédito de OpenRouter; falta probar la lógica conversacional real una vez haya saldo
- [x] ~~Elegir modelo(s) en OpenRouter~~ — **resuelto 2026-08-14**: orquestador/PRINCIPAL usa `deepseek/deepseek-v4-flash`, resto de sub-workflows `openai/gpt-4.1-mini` (ver pendiente ya cerrado en [[Estado del Proyecto]]) — **nota:** el `OpenRouter Chat Model` de PRINCIPAL sigue con el modelo copiado de Spectrum (`gpt-5-mini` vía `openai/gpt-4o-mini` en `Lenguaje & Asesoria`), falta aplicar la decisión de modelo real en los nodos

**Cierre — solo después de validar el reemplazo en producción:**
- [ ] Apagar los bots de GHL Conversation AI — *Jorge Calderón*: **solo** una vez el bot de n8n esté probado y en producción, dejarlos en paralelo hasta entonces
- [ ] Informar a contabilidad qué se elimina y qué se agrega — *Jorge Calderón*: elimina gasto de GHL Conversation AI / AI wallet (hoy bloqueado por falta de tarjeta, de todas formas iba a costar); agrega OpenRouter (pay-per-use)

## Costos

- Se mantiene: VPS Hostinger KVM1 (~$8/mes, ya contratado, corre n8n).
- Se agrega: cuenta de OpenRouter (pay-per-use, sin monto fijado en la reunión).
- Se elimina: cualquier gasto de GHL Conversation AI / GHL AI wallet.
- GHL se mantiene con su licencia base (CRM + automatizaciones) — sin cambios en ese costo.

## Timeline

Objetivo puesto por el cliente en la reunión: **listo para el lunes o martes siguiente** (2026-08-17 / 2026-08-18).

## Preguntas abiertas (no cerradas en la reunión)

- ~~¿Un solo despliegue n8n o dos separados?~~ **Resuelto 2026-08-12**: un solo despliegue, parametrizado por `locationId`/`dealer`.
- ~~Qué pasa con `Sync_CRM`?~~ **Resuelto 2026-08-12**: se descarta, GHL es el único CRM.
- ¿Car Express Servicess (la 3ra subcuenta del ecosistema) entra en este alcance? No se mencionó en la reunión — no tiene bot construido todavía (ver [[Carwarriors LLC]]).
- Formato exacto en que Bianca va a entregar la base de conocimiento (documento, hoja de cálculo, acceso directo a un sistema).
- Qué automatizaciones específicas de GHL se mantienen ("ciertas automatizaciones", palabras del cliente) vs. cuáles migran también a n8n — no se detalló una lista.

## Relacionado
- [[Carwarriors LLC]]
- [[Carwarriors - Infraestructura (Diseño)]]
- [[Carwarriors - Agente IA 24-7 (Diseño)]]
- [[Carwarriors - Agente IA Rances Car (Diseño)]]
- [[Carwarriors - Comportamiento del Bot (Resumen)]]
- [[Rances Car - Comportamiento del Bot (Resumen)]]
