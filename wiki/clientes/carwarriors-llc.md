---
tags: [forjado, cliente, carwarriors, gohighlevel, automatizacion, automotive]
tipo: cliente
estado: activo
servicio: automatizacion
estado_comercial: migracion-arquitectura-en-curso
contacto: Jorge González (dueño) / Bianca Cangialosi (marketing)
creado: 2026-06-18
actualizado: 2026-08-30
fuente_raw: raw/clientes/carwarriors-llc/
---

# Cliente — Carwarriors LLC

> [!info] Cómo leer esta página
> Esta es la página **compilada**: solo el estado actual y lo que sigue abierto. El historial completo, día a día, con cada bug y decisión, vive en [[../../raw/clientes/carwarriors-llc/carwarriors-llc-source-2026-08-25|raw/clientes/carwarriors-llc/]] — no se repite aquí a propósito (ver [[../../README|arquitectura de la bóveda]]).

## Datos Generales

| Campo | Valor |
|---|---|
| **Empresa / Ecosistema** | Carwarriors LLC (3 subcuentas en GHL: Carwarriors LLC, Car Express Servicess, Rances Car) |
| **Sector** | Automotriz — Compraventa de autos (Car Dealer) |
| **Ubicación** | Miami, Florida 33142, EE.UU. |
| **Decisor principal** | Jorge González |
| **Contacto de marketing** | Bianca Cangialosi |
| **Servicio FORJADO** | Automatización (n8n + GHL + ManyChat + DealerCenter) |
| **Estado comercial** | Fase de pruebas activas — contrato se formaliza si las pruebas salen bien |

## Stakeholders

| Nombre | Rol | Contacto |
|---|---|---|
| **Jorge González** | Dueño / Decisor principal | +1 (786) 502-5614 |
| **Karel Suarez** | Admin subcuenta Carwarriors LLC | karelfsuarez@gmail.com |
| **Bianca Cangialosi** | Estrategia y marketing | — |

## Accesos y credenciales

> [!warning] Información sensible — no compartir
> Los accesos completos (GHL, DealerCenter, SFTP, VPS/Coolify, tokens PIT por subcuenta) están en el snapshot raw, sección "Accesos Centrales" y "DealerCenter — Credenciales SFTP": [[../../raw/clientes/carwarriors-llc/carwarriors-llc-source-2026-08-25]].

## Arquitectura actual (resumen)

1. **Bot conversacional en n8n + OpenRouter** (deepseek-v4-flash), reemplazando el Conversation AI nativo de GHL — decidido 2026-08-12, en producción desde 2026-08-19 para ambos dealers (Carwarriors LLC y Rances Car). GHL sigue como CRM. Detalle: [[carwarriors-llc-arquitectura-migracion]].
2. **Notificaciones → Slack** (canal `notificaciones`) + email de respaldo desde 2026-08-25. `SLACK - INBOUND` para DM/menciones.
3. **Lead Sync GHL ↔ DealerCenter** en producción en ambas subcuentas (SFTP + ADF/XML). Chequeo de salud 2026-08-27: ambas direcciones sanas, confirmado con datos reales del mismo día (lead nuevo creado en GHL, dedupe evitando subir un lead repetido a DealerCenter), sin errores en la última semana.
4. **DealerCenter**: fuente del inventario/fotos/políticas (vía Excel diario a Gmail) y de la auto-asignación de BDC Rep por Lead Source (Custom Lead Assignment, 31 reglas cargadas 2026-08-25).

Documentos de referencia relacionados: [[carwarriors-llc-infraestructura]] · [[carwarriors-llc-inventario-ghl]] · [[carwarriors-llc-sftp-dealercenter]] · [[carwarriors-llc-como-funciona-bot-sync]] · [[carwarriors-llc-como-habla-el-bot]] · [[carwarriors-llc-comportamiento-bot]] · [[carwarriors-llc-comportamiento-bot-rances]] · [[carwarriors-llc-guardrail-anti-spam]] · [[carwarriors-llc-propuesta-formal]] · [[carwarriors-llc-justificacion-infraestructura]] · [[carwarriors-llc-agente-ia-24-7]] (legacy, bots viejos de GHL) · [[carwarriors-llc-agente-ia-rances-car]] (legacy).

## Pendientes abiertos (al 2026-08-30)

- [ ] **Brief de roadmap entregado por Bianca (2026-08-28 noche, PDF "AUTOMATIZACION")** — junto con el acceso a ManyChat, Bianca compartió el alcance completo que el negocio quiere: (1) chatbot con recorridos diferenciados por lead nuevo/seguimiento/frío + derivación a vendedores por disponibilidad/rendimiento, (2) DealerCenter — reasignación automática de tasks viejos (+48/72h) y reactivación de leads abandonados, marcado **MUY IMPORTANTE** por el cliente, (3) contabilidad/números (dashboard costo por lead/venta, ROI de campañas Meta), (4) marketing (secuencias proactivas, segmentación, campañas por comportamiento), (5) IA aplicada a ventas (scoring de leads, sugerencias a vendedores, análisis de conversaciones). Nada de esto está construido salvo lo que ya coincide con el pipeline actual (respuestas IG/WhatsApp por DM, dedupe de leads al sync). El frente ya en curso (comentarios IG/FB vía ManyChat) queda confirmado como parte de este mismo pedido, no como iniciativa aparte. Pendiente decidir con Jorge el orden de ataque antes de comprometer fechas con Bianca. Detalle completo con tabla de contraste "pedido vs. ya existe": [[../../raw/clientes/carwarriors-llc/2026-08-28-brief-automatizacion-bianca|raw/2026-08-28 (brief Bianca)]].
- [ ] **Comentarios de IG/FB con interés real — webhook `COMENTARIOS-MANYCHAT` construido y probado en n8n (2026-08-30, inactivo); falta activarlo y terminar de conectarlo en ManyChat.** Decidido no tocar la automatización vieja `Auto-DM de links desde comentarios` (LIVE) — Flow nuevo aparte en ManyChat (DRAFT, `content20260828215429_699312`, trigger "cualquier publicación o Reel" + "cualquier comentario") con la acción "Solicitud externa" ya agregada (sin URL todavía). Del lado de n8n: nuevo workflow `COMENTARIOS-MANYCHAT` (id `07BgeGy4vukFJDlu`) — Webhook → normaliza `comentario`+`contact` → clasifica `es_interes_real` (Information Extractor + OpenRouter `deepseek/deepseek-v4-flash`, mismo modelo que `PRINCIPAL`) → responde JSON con `es_interes_real`/`respuesta_publica`/`respuesta_dm` (genéricas por ahora) para el "Mapeo de respuesta" de ManyChat. Probado de punta a punta con 2 casos reales (con interés → DM; sin interés → solo respuesta pública), incluyendo un bug real corregido (el Information Extractor anida el resultado bajo `.output.*`, igual que en `PRINCIPAL` — el IF inicial leía el campo plano). **Sigue inactivo a propósito** (la URL de producción no responde hasta activarlo) y el Flow de ManyChat sigue sin publicar — cero riesgo de producción todavía. Pendiente real: activar el workflow, volver a ManyChat a poner la URL+cuerpo+mapeo de respuesta, agregar la rama de DM condicional dentro del Flow, y detener la automatización vieja antes de publicar. GHL nativo y Meta directo siguen descartados. Detalle: [[../../raw/clientes/carwarriors-llc/2026-08-30-manychat-external-request-confirmado|raw/2026-08-30]] · [[../../raw/clientes/carwarriors-llc/2026-08-28-manychat-flow-comentarios-en-progreso|raw/2026-08-28]] · [[../../raw/clientes/carwarriors-llc/2026-08-27-comentarios-ig-fb-investigacion|raw/2026-08-27]].
- [ ] **Ticket abierto en soporte de DealerCenter (`#TICKET-20586098`, 2026-08-28) por el bug de auto-asignación de BDC Rep — sigue Open, sin respuesta de soporte, evidencia ampliada 2026-08-29.** Verificado en vivo: la rotación plana (Sales Rep y BDC Rep) sigue vacía a propósito, el toggle "Do not auto assign leads unless status is New" sigue apagado, y las 31 reglas de Custom Lead Assignment sí funcionan bien para las 6 categorías oficiales de Bianca (auditado con leads reales, 0 cruces). El problema real es más profundo y más grave de lo que parecía: se auditaron los 112 leads asignados a Alejandra Roa y **~40% (44) no le corresponden** — 12 son de fuentes con nombre de Nallely (`Tiktok Nalle`, `Facebook Nalle (OR)`, `Facebook Mari (Nalle)`), 1 es un caso de **regla real violada** (lead con Lead Source `TESLA RANCES`, que debe ir a Scarleth/Samuel, terminó en Alejandra pese a que esa regla está bien configurada), y el resto son fuentes sin dueño claro (Carwarriors Call, referidos, Offerup, Lead Source vacío). Ambos hallazgos se sumaron al ticket con números de teléfono concretos. **2 mitigaciones propias evaluadas y descartadas** (no se tocó nada en producción): apagar el switch "Enable BDC Rep Support" — DealerCenter advierte en su propio diálogo de confirmación que esto también impide asignar el BDC Rep manualmente, sería peor; y quitar las 31 reglas — expondría el 100% de los leads al mismo bug en vez de solo el ~40% actual, sin ganar nada. Bianca fue informada de todo esto (mensaje corto redactado, pendiente que Jorge lo envíe). Mitigación práctica mientras se espera respuesta: auditoría manual periódica del Customer List filtrando por BDC Rep, no automatizable (un chequeo programado en la nube no tiene acceso a la sesión logueada de DealerCenter). Detalle completo: [[../../raw/clientes/carwarriors-llc/2026-08-29-dealercenter-bdc-rep-auto-asignacion-bug|raw/2026-08-29 (auditoría BDC Rep)]].
- [ ] **Bot 24/7 completo + notificaciones de leads por SMS con score de "qué tan caliente"** — la parte de citas 24/7 ya está en producción (RSVP crea/reagenda/cancela en GHL real). El canal SMS de notificación a **Jorge González** (no a Jorge Calderón) no existe hoy (solo Slack + email); confirmado que GHL usa Twilio por debajo (`saasSettings.twilioRebilling`), mismo costo que Twilio directo pero reutilizando la credencial GHL ya conectada en n8n — recomendado usar SMS nativo de GHL en vez de una cuenta Twilio aparte. Instrucciones ya entregadas a Jorge para pedirle a Jorge González que compre un número con capacidad SMS en GHL (Settings → Phone Numbers, ~$1.15/mes + ~$0.0079/SMS). **Bloqueado hasta que confirme la compra del número** — después falta conectar el envío de SMS en el flujo del bot y construir la clasificación de "lead caliente" (reusando el LLM ya existente en el pipeline).
- [ ] **Esperando a Bianca** — confirmar si su queja de "Team Inbox vacío con 500 sin leer" (2026-08-24) quedó resuelta limpiando el filtro de su sesión (diagnóstico: no era un bug del sistema).
- [ ] **Esperando a Jorge González** — decidir si quiere un reporte guardado en DealerCenter (Customer List: BDC Rep vacío + Status New) para no filtrar a mano cada mañana. No construir hasta que confirme.
- [ ] Explorar si el Knowledge Base del bot nativo de GHL (Conversation AI) sirve como fuente reusable para el KB real del bot n8n — idea de Jorge, sin explorar (requeriría Playwright+CDP contra Bot Training).
- [ ] Automatizar la cadencia de re-contacto saliente del playbook BDC (llamar 0-2 min, insistir 5-8 veces/48h) — no cubierta por nada hoy, identificado como gap, no bloqueante.
- [ ] Avisar a contabilidad del cambio de gasto (sale GHL Conversation AI, entra OpenRouter).
- [ ] WhatsApp Messaging sigue sin contratar en GHL ($10/mes) — Jorge dijo explícitamente que no es prioridad. No bloquea IG/FB/SMS.
- [ ] Formalizar contrato una vez validadas las pruebas (sin fecha).

## Resueltos recientes (contexto, no acción)

**4 bugs de producción en el bot n8n corregidos y verificados con tráfico real (2026-08-29):** a raíz de una pregunta sobre si leads/appointments se guardaban bien en Mongo. (1) `KB - SEARCH` (nodo `RESPONSE`) fallaba cuando el agente devolvía texto de razonamiento pegado antes del JSON — ahora extrae el bloque `{...}` con regex en vez de asumir JSON puro. (2) `GRATIS - Respuesta` (rama que responde a leads que piden un vehículo gratis) hardcodeaba `type: 'WhatsApp'` cuando el canal no era instagram/messenger/sms, causando 422 en GHL para leads de Facebook sin teléfono — corregido con la misma detección real de canal que ya usa el resto del flujo. (3) Las notificaciones de Slack "Nuevo lead registrado" mostraban Nombre/Teléfono/Correo siempre en "No registrado" — causa real: leían campos (`lead_nombre`, etc.) que nunca existieron en el agente ni en el parser; se agregó un nodo `Get Contact Info` que trae el contacto real de GHL. (4) `LEAD - COLLECTOR` (compartido por ambos dealers) tenía su nodo `Update GHL Contact` sin manejo de errores — si GHL rechazaba el update (contacto borrado, etc.) tumbaba todo el sub-workflow y el agente principal terminaba en "Max iterations reached" sin responderle al lead, aunque el dato ya se había guardado bien en Mongo. Los 4 fixes se aplicaron y publicaron en `PRINCIPAL` y `PRINCIPAL - Rances Car`, verificados con ejecuciones reales (incluyendo casos de contacto no encontrado en GHL, manejados con gracia). Se confirmó además, con datos reales de producción, que RSVP (appointments) y el guardado de leads en Mongo ya funcionaban bien. Detalle: [[../../raw/clientes/carwarriors-llc/2026-08-29-fix-notificaciones-vacias-y-gratis-whatsapp|raw/2026-08-29 (fix notificaciones)]].

**Guardrail: no gastar tokens en leads que esperan un vehículo gratis (2026-08-27):** Jorge reportó el caso de un lead (Máximo Ferrufino) que entró por un post viral tipo "Elige un número del 1 al 5" y pasó ~8h/18 mensajes pidiendo que le donen un carro por voluntad divina, sin intención de compra — el agente principal (caro, con herramientas) respondía cada mensaje igual. Diagnosticado: el bot ya tenía un clasificador barato que corre antes del agente principal, pero ningún campo existente cubría bien este patrón, y la única rama de filtro que existía (`IF FUERA DE CONTEXTO`) estaba conectada en paralelo (nunca evitaba la llamada cara) y su nodo de respuesta estaba deshabilitado y era copy-paste de otro cliente (Spectrum Vivienda). Construido y publicado en ambos dealers: nuevo campo `es_expectativa_gratuita` en el mismo clasificador barato (sin costo extra) + nuevo gate `IF EXPECTATIVA GRATUITA` que, si es true, responde un mensaje corto fijo por GHL **sin invocar el agente principal**, ahorrando el costo caro en cada uno de esos mensajes. A diferencia del guardrail de spam-engagement (que bloquea en silencio), este sí responde algo (pedido explícito de Jorge). Detalle: [[../../raw/clientes/carwarriors-llc/2026-08-27-guardrail-expectativa-gratuita|raw/2026-08-27 (guardrail gratis)]]. Pendiente: confirmar con tráfico real que se activa correctamente.

**Bot viejo de GHL inventó que venden Tesla — borrado por completo en ambos dealers (2026-08-27):** Bianca reportó una conversación real donde el bot legacy de GHL Conversation AI (no el nuevo de n8n) le dijo a un lead que sí venden Tesla con financiamiento específico — inventado, un humano tuvo que corregir en vivo. Verificado por API: contradice la suposición de que estos bots viejos ya no tenían tráfico real. Primero se reescribió `mode: "off"` explícitamente; luego Jorge pidió ir más allá y se **eliminaron por completo** los dos agentes (`DELETE /conversation-ai/agents/:agentId`), confirmado con `totalCount: 0` en ambas sub-cuentas — ya no existen y no pueden reactivarse por accidente desde la UI de GHL. Detalle: [[../../raw/clientes/carwarriors-llc/2026-08-27-bot-viejo-ghl-alucino-tesla|raw/2026-08-27 (Tesla)]].

**Bot se calla cuando un humano toma control de la conversación (2026-08-27):** construido y publicado en producción en ambos dealers (`PRINCIPAL` y `PRINCIPAL - Rances Car`). GHL no distingue mensajes de humano vs bot (mismo `userId`/`source` en ambos casos, confirmado en vivo) — el bot ahora compara el último mensaje saliente real de la conversación contra lo último que él mismo mandó (guardado en Mongo); si no coincide y fue hace menos de 2h (ventana decidida por Jorge), se calla para ese lead. Fail-safe: si la consulta a GHL falla, el bot sigue respondiendo normal. **Confirmado con tráfico real en `PRINCIPAL`** (2 ejecuciones reales post-publish, mismo día): el flujo corre de punta a punta sin errores y el bot responde normal cuando no hay handoff (caso probado). Falta solo confirmar el caso inverso (bot callándose ante un humano real) cuando ocurra naturalmente, y tráfico real nuevo en Rances Car (sin ejecuciones desde el publish todavía). Detalle: [[../../raw/clientes/carwarriors-llc/2026-08-27-fix-bot-se-calla-con-handoff-humano|raw/2026-08-27 (fix)]].

**Token GHL de `RSVP` vencido (2026-08-26):** la credencial `Header Auth GHL` (usada por `GHL Crear Cita`) fallaba con `401 Invalid JWT` — causa real: el PIT no tenía el scope `calendars/events.write`. Se creó un PIT nuevo con los scopes correctos y se corrigió el formato del header (`Bearer <token>`). Dos citas reales que el bot ya había confirmado a los leads pero nunca se crearon en GHL (Dylan Santiago y un lead de Mustang) se recuperaron con **Retry** de sus ejecuciones fallidas originales en n8n (no reprocesadas desde cero) — ambas confirmadas en GHL con `ghl_event_id` guardado en Mongo. **Efecto secundario detectado y corregido:** correr "Test workflow" en el editor de n8n sobre este workflow escribe en Mongo real (no está sandboxeado) — corrompió temporalmente la cita de Dylan Santiago, revertido a mano en Mongo. **Regla nueva:** nunca usar el botón Play/Test del editor en `RSVP`, solo Retry desde el panel de Executions.

Diagnosticado (no resuelto, es bug de DealerCenter) el bug de auto-asignación de BDC Rep reportado por Bianca — ver pendiente arriba (2026-08-26) · Rama de email del `ERROR HANDLER` validada con un error real (2026-08-25 noche) · Auto-asignación de BDC Rep cargada en DealerCenter (31 reglas, 2026-08-25) · `DAILY DIGEST` roto reemplazado por alerta de email (2026-08-25) · 4 leads de prueba limpiados de DealerCenter (2026-08-25) · auditoría completa de producción sin bugs activos (2026-08-24) · Gmail token vencido de DealerCenter reconectado (2026-08-20) · guardrail anti-spam de engagement implementado en ambos dealers (2026-08-20) · VPS caída y recuperada + 3 bugs de producción corregidos (2026-08-19) · corte a producción de ambos dealers (2026-08-19). Detalle línea por línea en el raw.

## Infraestructura y Plataformas

| Plataforma | Uso |
|---|---|
| **GoHighLevel** | CRM, funnels, automatizaciones, dashboards |
| **ManyChat** | Chatbot multicanal — Instagram, WhatsApp, Messenger (legacy, solo redirige tráfico) |
| **DealerCenter** | CRM de concesionaria — gestión de leads, ventas, auto-asignación |
| **n8n + OpenRouter (Coolify, VPS Hostinger `2.24.106.87`)** | Bot conversacional de producción, sync de leads, notificaciones |
| **MongoDB Atlas** | KB vectorial (RAG), inventario/fotos, estado de conversación |
| **Zonitel** | Telefonía integrada con el Panel de Llamadas (histórico, sin seguimiento activo reciente) |

## Subcuentas (Locations) en GoHighLevel

| Subcuenta | Location ID | Notas |
|---|---|---|
| **Carwarriors LLC** (principal) | `DSe5PdPEScZL8cbZTkKI` | Bot n8n activo en producción |
| **Car Express Servicess** | — | Sin actividad (`admin@webtechways.com`, posible agencia externa; nunca tuvo login) |
| **Rances Car** | `1j1dHo8HEbZdElQUGFoC` | Comparte dirección física con la principal; bot n8n activo en producción |

Las 3 subcuentas comparten un único DCID de DealerCenter (`14031841`) — la separación entre Rances/Carwarriors se hace por convención de datos (campo Lead Source), no por cuenta separada.

## Relacionado

- [[../interno/estado-proyecto|Estado del Proyecto — FORJADO]]
- [[../index|Índice de la bóveda]]
