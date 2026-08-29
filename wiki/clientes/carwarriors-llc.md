---
tags: [forjado, cliente, carwarriors, gohighlevel, automatizacion, automotive]
tipo: cliente
estado: activo
servicio: automatizacion
estado_comercial: migracion-arquitectura-en-curso
contacto: Jorge González (dueño) / Bianca Cangialosi (marketing)
creado: 2026-06-18
actualizado: 2026-08-28
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

## Pendientes abiertos (al 2026-08-28)

- [ ] **Brief de roadmap entregado por Bianca (2026-08-28 noche, PDF "AUTOMATIZACION")** — junto con el acceso a ManyChat, Bianca compartió el alcance completo que el negocio quiere: (1) chatbot con recorridos diferenciados por lead nuevo/seguimiento/frío + derivación a vendedores por disponibilidad/rendimiento, (2) DealerCenter — reasignación automática de tasks viejos (+48/72h) y reactivación de leads abandonados, marcado **MUY IMPORTANTE** por el cliente, (3) contabilidad/números (dashboard costo por lead/venta, ROI de campañas Meta), (4) marketing (secuencias proactivas, segmentación, campañas por comportamiento), (5) IA aplicada a ventas (scoring de leads, sugerencias a vendedores, análisis de conversaciones). Nada de esto está construido salvo lo que ya coincide con el pipeline actual (respuestas IG/WhatsApp por DM, dedupe de leads al sync). El frente ya en curso (comentarios IG/FB vía ManyChat) queda confirmado como parte de este mismo pedido, no como iniciativa aparte. Pendiente decidir con Jorge el orden de ataque antes de comprometer fechas con Bianca. Detalle completo con tabla de contraste "pedido vs. ya existe": [[../../raw/clientes/carwarriors-llc/2026-08-28-brief-automatizacion-bianca|raw/2026-08-28 (brief Bianca)]].
- [ ] **Comentarios de IG/FB con interés real — cuenta en TRIAL de Pro; Jorge González confirmó que pagarán Pro cuando venza (2026-08-28 noche).** La cuenta "Carwarriors LLC | Car Dealer" tiene features Pro activas ahora vía trial (probablemente External Request y All posts/reels), pero Jorge González ya decidió que van a pagar la suscripción Pro cuando el trial expire — no hace falta bloquear el desarrollo esperando confirmar la fecha exacta de vencimiento. Revisión directa de "Mis Automatizaciones" (2026-08-28, Jorge Calderón ya dentro con acceso de invitado) mostró 6 flujos existentes en la carpeta "AUTOMATIZACION CW": `Turn story replies into leads` (LIVE), `Saludá a tus nuevos seguidores` (LIVE), `Auto-DM de links desde comentarios` (LIVE, dispara con "comenta en Publicación o Reel específicos" — probablemente el mismo flujo ya documentado como "Comentario en post/reel"), `Envía links automáticos por DM` (DRAFT), `Autoenviar enlaces desde comentarios, historias o DMs` (STOPPED), `Instagram Default Reply` (STOPPED). **Próximo paso:** confirmar cuál de estos es el flujo real a modificar y reemplazar su acción final (mensaje estático) por un nodo External Request hacia un webhook nuevo en n8n. GHL nativo y Meta directo siguen descartados. Detalle: [[../../raw/clientes/carwarriors-llc/2026-08-27-comentarios-ig-fb-investigacion|raw/2026-08-27 (comentarios IG/FB)]].
- [ ] **Ticket abierto en soporte de DealerCenter (2026-08-28)** por el bug de auto-asignación de BDC Rep — Jorge Calderón decidió escalarlo directamente (ya no esperar a Bianca) con la evidencia completa (Rosalio Leiva Fernandez + lead de prueba, ambos con nota de sistema "no BDC rep ready" pero igual asignados a Alejandra Roa). El bot de IA de soporte de DealerCenter reafirmó el diagnóstico antes de dejar enviar el ticket (sin solución propia). **Esperando respuesta de soporte de DealerCenter.**
- [ ] **Bot 24/7 completo + notificaciones de leads por SMS con score de "qué tan caliente"** — la parte de citas 24/7 ya está en producción (RSVP crea/reagenda/cancela en GHL real). El canal SMS de notificación a **Jorge González** (no a Jorge Calderón) no existe hoy (solo Slack + email); confirmado que GHL usa Twilio por debajo (`saasSettings.twilioRebilling`), mismo costo que Twilio directo pero reutilizando la credencial GHL ya conectada en n8n — recomendado usar SMS nativo de GHL en vez de una cuenta Twilio aparte. Instrucciones ya entregadas a Jorge para pedirle a Jorge González que compre un número con capacidad SMS en GHL (Settings → Phone Numbers, ~$1.15/mes + ~$0.0079/SMS). **Bloqueado hasta que confirme la compra del número** — después falta conectar el envío de SMS en el flujo del bot y construir la clasificación de "lead caliente" (reusando el LLM ya existente en el pipeline).
- [ ] Mitigación identificada (toggle "Do not auto assign leads unless status is New", hoy apagado) sigue sin aplicar — es cambio de comportamiento en producción, requiere confirmación de Jorge González/Bianca antes de activarlo. No aplicar hasta que respondan soporte de DealerCenter o el negocio lo pida. Detalle: [[../../raw/clientes/carwarriors-llc/carwarriors-llc-source-2026-08-25|raw]] y memoria `project_carwarriors-dealercenter-ready-for-leads-bug-2026-08-26`.
- [ ] **Esperando a Bianca** — confirmar si su queja de "Team Inbox vacío con 500 sin leer" (2026-08-24) quedó resuelta limpiando el filtro de su sesión (diagnóstico: no era un bug del sistema).
- [ ] **Esperando a Jorge González** — decidir si quiere un reporte guardado en DealerCenter (Customer List: BDC Rep vacío + Status New) para no filtrar a mano cada mañana. No construir hasta que confirme.
- [ ] Explorar si el Knowledge Base del bot nativo de GHL (Conversation AI) sirve como fuente reusable para el KB real del bot n8n — idea de Jorge, sin explorar (requeriría Playwright+CDP contra Bot Training).
- [ ] Automatizar la cadencia de re-contacto saliente del playbook BDC (llamar 0-2 min, insistir 5-8 veces/48h) — no cubierta por nada hoy, identificado como gap, no bloqueante.
- [ ] Avisar a contabilidad del cambio de gasto (sale GHL Conversation AI, entra OpenRouter).
- [ ] WhatsApp Messaging sigue sin contratar en GHL ($10/mes) — Jorge dijo explícitamente que no es prioridad. No bloquea IG/FB/SMS.
- [ ] Formalizar contrato una vez validadas las pruebas (sin fecha).

## Resueltos recientes (contexto, no acción)

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
