---
tags: [forjado, cliente, carwarriors, gohighlevel, automatizacion, automotive]
tipo: cliente
estado: activo
servicio: automatizacion
contacto: Jorge (Dueño)
proximo_paso: "Bot IA 24/7 de Carwarriors LLC vuelve a responder (2026-07-28) tras haber estado apagado desde el 24-jul — sin confirmar cuándo/quién lo reactivó. Detectado por una captura de Bianca: el bot respondió fuera de flujo a un DM de spam de Instagram (proveedor falso ofreciendo mercadería); se redactó una 'Vendor/Spam Outreach Rule' para Bot Goals → Additional Information, todavía sin aplicar en GHL (intento por Playwright interrumpido antes del login). Infraestructura propia resuelta (2026-07-27): VPS Hostinger + Coolify + n8n desplegados; workflow 'Agente de Captura de Leads (GHL+Mongo)' activo y con el lado de GHL conectado (2026-07-28). Lead Sync GHL→DealerCenter (envío ADF/XML) sigue sin construirse; solo falta la tabla de Lead Source por campaña/dealer."
estado_comercial: pruebas-en-curso
creado: 2026-06-18
actualizado: 2026-07-28
---

# Cliente — Carwarriors LLC

## Datos Generales

| Campo | Valor |
|---|---|
| **Empresa / Ecosistema** | Carwarriors LLC (3 subcuentas en GHL) |
| **Sector** | Automotriz — Compraventa de autos (Car Dealer) |
| **Ubicación** | Miami, Florida 33142, EE.UU. |
| **Decisor principal** | Jorge González |
| **Contacto de marketing** | Bianca Cangialosi |
| **Servicio FORJADO** | Automatización (n8n + GHL + ManyChat + DealerCenter) |
| **Fecha de primer contacto** | 2026-06-18 |
| **Reunión inicial** | 2026-06-18 12:00 PM (hora Miami) con Bianca |

---

## Stakeholders

| Nombre | Rol | Contacto |
|---|---|---|
| **Jorge González** | Dueño / Decisor principal | +1 (786) 502-5614 |
| **Karel Suarez** | Admin subcuenta Carwarriors LLC | karelfsuarez@gmail.com |
| **Bianca Cangialosi** | Estrategia y marketing | Bianca Cangialosi.marketing |

> [!note] Nota de contexto
> Jorge mencionó buscar un comprador remoto con dominio de inglés para otro negocio aparte. Oportunidad de referir y fortalecer la relación. El alcance actual está cerrado a **automatización del negocio de autos únicamente**.

---

## Accesos Centrales

> [!warning] Información sensible — no compartir

| Servicio | Acceso |
|---|---|
| **GHL Agencia (email)** | carwarriors2020@gmail.com |
| **GHL Agencia (contraseña)** | Cuba2025@ |
| **2FA** | Código SMS al +1 786-502-5614 (Jorge) |
| **Teléfono de verificación EE.UU.** | 786-739-9691 |
| **GHL MCP Endpoint** | https://services.leadconnectorhq.com/mcp/ |
| **DealerCenter (usuario)** | jcalderon90 |
| **DealerCenter (contraseña)** | Dealermiami100@ |
| **DealerCenter 2FA** | Código por email a jcalderon900610@gmail.com (no SMS) |
| **DealerCenter — dealer vinculado a este login** | Solo **CARWARRIORS LLC** (no hay selector multi-rooftop en esta cuenta — sin evidencia de que Rances Car / Car Express tengan cuenta propia, confirmar con Jorge) |

---

## DealerCenter — Credenciales SFTP para envío de leads (generadas 2026-07-22)

> [!warning] Información sensible — no compartir

Generadas desde Dealer Settings → Customer → Lead Management → SFTP to Lead (Secure File Transfer) → "Generate SFTP Credentials to Provide Lead Sources". Confirmado con Jorge antes de generarlas (no había credenciales previas).

| Campo | Valor |
|---|---|
| **DC Company ID (DCID)** | 14031841 *(confirmado en Dealership → General → "DC Company ID", coincide con el prefijo del username/email de abajo)* |
| **Host** | dccrmleadsprod.blob.core.windows.net |
| **Port** | 22 |
| **Username** | dccrmleadsprod.14031841 |
| **Password** | KZ5gBkFeXt3l/0U/RNmitUiymhEn+bs2 |
| **Directory** | /Leads/ |

> [!info] Hallazgo técnico
> El host es un endpoint de **Azure Blob Storage con soporte SFTP** (`*.blob.core.windows.net`), no un servidor SFTP tradicional — Azure Blob Storage tiene una feature nativa de SFTP que DealerCenter usa como backend. Relevante para la decisión n8n vs Cloudflare Worker: cualquier cliente SFTP estándar debería funcionar contra Azure Blob SFTP sin configuración especial.

> [!info] Posible vía alternativa a explorar: email
> En la misma pantalla de Lead Management aparece **"Email to provide Lead Sources": `14031841@leadsprod.dealercenter.net`**. No confirmado todavía si esto acepta un ADF/XML adjunto por email como vía de ingesta alternativa al SFTP (sería mucho más simple de implementar en un Cloudflare Worker que SFTP) o si es solo para registrar nombres de lead source. No se probó — se priorizó SFTP por ser la vía oficial y documentada (el email fue deprecado por GLBA según la investigación original).

> [!success] VALIDADO END-TO-END 2026-07-22 — el mecanismo SFTP + ADF/XML funciona de verdad
> Se armó un XML de prueba mínimo (basado en el ejemplo de la investigación, DCID 14031841, cliente "FORJADO TEST LEAD BORRAR") y se subió por SFTP con `curl` (soporta SFTP vía libssh2) a `/Leads/` usando las credenciales de arriba. El archivo desapareció del directorio poco después de subirlo (confirma que DealerCenter lo consume activamente, no es una carpeta pasiva). El contador "My New Prospects" en el Home de DealerCenter subió de 3 a 4, y buscando "FORJADO" en Customer → Reports → My New Prospects apareció el lead completo: nombre, email, teléfono, **Source = "CARWARRIORS LLC - GHL - FORJADO TEST - WHAT..."** (coincide exactamente con el campo `<provider><name>` del XML), Status NEW, Type INTERNET.
>
> **Detalle técnico:** el host SFTP es un endpoint de Azure Blob Storage con soporte SFTP nativo (confirmado por el banner `AzureSSH_1.0.0` al hacer `ssh-keyscan`) — cualquier cliente SFTP estándar conecta sin configuración especial (se verificó con `curl` vía libssh2, pinneando el host key con `--hostpubsha256` en vez de usar known_hosts).
>
> **Hallazgo curioso sin explicar:** antes de subir el XML de prueba, el directorio `/Leads/` ya contenía 2 archivos con nombres aleatorios (`3muMegFrf2x2z22XaOrh.xml`, `xQNvxsxTD5BIy8n0HE8s.xml`) que no se pudieron leer (permiso denegado — es una cuenta de solo escritura/drop-box). Podrían ser residuos de un intento previo (¿el mismo origen del Cloudflare Worker "gyoan"?) o archivos en cola sin procesar. Preguntar a Jorge/Karel si tienen contexto.
>
> **✅ Limpieza hecha 2026-07-22:** el lead de prueba "FORJADO TEST LEAD BORRAR" se marcó como `Deleted` (Customer detail → botón "⋮" → "Mark as Deleted", confirmado por Jorge). Status queda en "Deleted by Jorge Calderon - jcalderon90 on 07/22/2026".
>
> **Con esto, la arquitectura n8n vs Cloudflare Worker deja de ser una duda teórica**: SFTP real contra este host ya se probó y funciona; n8n sigue siendo la opción más simple de construir (nodo FTP/SFTP nativo) pero un Cloudflare Worker con una librería SFTP para JS también sería viable ahora que se confirmó el mecanismo end-to-end.

---

## Subcuentas (Locations) en GoHighLevel

### Carwarriors LLC *(subcuenta principal)*

| Campo | Valor |
|---|---|
| **Dirección** | 3620 NW 27 Ave, Miami, FL 33142 |
| **Teléfono** | +17866749176 |
| **Contacto admin** | Karel Suarez — karelfsuarez@gmail.com |
| **Location ID** | DSe5PdPEScZL8cbZTkKI |
| **API Access Token** | pit-20fb00b2-9c40-4e3e-a3cb-4d38736bcbb3 |
| **Creada** | 2 Jun 2025 |
| **Último login** | 28 Nov 2025 |
| **WordPress** | ❌ Desconectado |
| **Workflow connectors** | ❌ Desconectado |

---

### Car Express Servicess

| Campo | Valor |
|---|---|
| **Dirección** | Miami, FL 33142 |
| **Teléfono** | (786) 502-5614 |
| **Contacto admin** | admin@webtechways.com *(posible agencia externa)* |
| **Creada** | 17 Jul 2025 |
| **Último login** | Nunca |
| **WordPress** | ❌ Desconectado |
| **Workflow connectors** | ❌ Desconectado |

> [!info] Observación
> El correo `admin@webtechways.com` apunta a un dominio de agencia externa. Notificaciones de esta subcuenta podrían estar llegando a un tercero.

---

### Rances Car

| Campo | Valor |
|---|---|
| **Dirección** | 3620 NW 27 Ave, Miami, FL 33142 |
| **Teléfono** | +1 (786) 339-1714 |
| **Location ID** | 1j1dHo8HEbZdElQUGFoC |
| **Company ID (agencia)** | PeypDgSbyaeyqkVNGsXs |
| **API Access Token** | pit-c30b22ca-d09c-45a4-967e-8b75e574a783 |
| **Snapshot aplicado** | SAmtzYoYrD3VOV5kOPXT |
| **Creada** | 17 Jul 2025 |
| **Último login** | 3 Mar 2026 *(más activa del ecosistema)* |
| **WordPress** | ❌ Desconectado |
| **Workflow connectors** | ❌ Desconectado |

> [!tip] Observación geográfica
> Carwarriors LLC y Rances Car comparten la misma dirección física (3620 NW 27 Ave). Probablemente negocios hermanos en el mismo lote de dealer.

---

## Infraestructura y Plataformas

| Plataforma | Uso |
|---|---|
| **GoHighLevel** | CRM, funnels, automatizaciones, dashboards |
| **ManyChat** | Chatbot multicanal — Instagram, WhatsApp, Messenger |
| **DealerCenter** | CRM de concesionaria — gestión de leads y ventas |
| **Zonitel** | Sistema de telefonía integrado con el Panel de Llamadas |
| **Canales de leads** | WhatsApp · Instagram · Messenger · Campañas Meta Ads (extensible) |
| **Desarrollo adicional** | Páginas web · Dashboards · APIs · Aplicaciones web — cotización separada |

---

## Snapshot GHL

| Campo | Valor |
|---|---|
| **Nombre** | Carwarrior Base |
| **Subcuenta origen** | Carwarriors LLC |
| **Versión** | v0 |
| **Creado** | 17 Jul 2025, 10:49 AM |

> [!tip] Estrategia de snapshot
> Cualquier campo personalizado nuevo (ej. "Año del auto", "Millas", "DealerCenter ID") debe crearse primero en Carwarriors LLC, actualizar el snapshot a v1 y hacer *push* a Car Express Servicess y Rances Car para mantener estructura uniforme.

---

## Márgenes de Reventa (SaaS Reselling)

| Producto | Costo GHL | Precio al Cliente | Margen |
|---|---|---|---|
| Workflow Pro — Starter | $10/mes | $15/mes | $5/mes |
| Workflow Pro — Growth | $25/mes | $38/mes | $13/mes |
| Workflow Pro — Scale | $50/mes | $75/mes | $25/mes |
| Branded Client Portal App | $49/mes | $79/mes | $30/mes |
| WhatsApp Reselling | $10/mes | $29.99/mes | $19.99/mes |
| WordPress Reselling | $10/mes | $14.99/mes | $4.99/mes |
| AI Employee | — | $127 | — |

---

## Panel de Llamadas IA (Panel 2.0 PRO — Carwarriors LLC)

*Datos del corte: 18 de junio de 2026*

| Métrica | Valor |
|---|---|
| Total llamadas (día) | 96 |
| Llamadas FULL (>20s, análisis IA completo) | 27 |
| Llamadas LIGHT (<20s, procesamiento rápido) | 69 |
| Contactos creados en CRM | 28 |
| Tasa de contacto efectiva | 26.2% |
| Hora pico | 11:00 AM (27 llamadas) |
| Costo IA del día | $0.1160 |
| Audio transcrito | 37.7 min |
| Tokens IA consumidos | 13,059 |
| Llamadas omitidas (skipped_short) | 72% ⚠️ |
| Distribución principal | T0 (0-9s) — mayoría muy cortas |

> [!warning] Alerta de calidad
> El 72% de llamadas son omitidas por duración corta. Indica que muchas caen antes de interacción real. Punto a auditar.

---

## Integración DealerCenter

### Panel de Métricas (GHL)

> [!bug] Error activo
> El panel "Metricas Deeler Center" en GHL muestra: *"Error: No metrics found for date"* (verificado 17/06/2026 y de nuevo 2026-07-21). Posible desconexión del token de API o fallo en el webhook de sincronización diaria.

> [!info] Hallazgo 2026-07-21: identificado el backend real de este panel
> El custom menu link "Metricas Deeler Center" en GHL (`custom-menu-link/71282143-641c-4a9d-a2be-f7fc5d1907fe`) embebe un **Cloudflare Worker ya existente**: `https://dc-metrics-dashboard.gyoan.workers.dev/` (título "📊 BDC Metrics Dashboard PRO"). No estaba documentado antes en el vault — es infraestructura de un desarrollador/agencia previa (subdominio de cuenta Cloudflare "gyoan"), no algo que FORJADO haya construido.
> - El frontend llama a `GET /api/metrics/daily?date=YYYY-MM-DD`, que responde `{"ok": false, "error": "No metrics found for date", "key": "dc:metrics_daily:YYYY-MM-DD"}` — confirma que lee de un **Cloudflare KV namespace** con keys tipo `dc:metrics_daily:<fecha>`, y que ese KV está vacío (probado con la fecha actual y con 2025-09-06, ambas 404).
> - El tooltip del dashboard dice "los datos se actualizan automáticamente cada 5 minutos" — implica que debería existir un cron/webhook separado escribiendo a ese KV, pero no se encontró evidencia de que esté corriendo.
> - Es un dashboard de **solo lectura de métricas BDC/Sales** (productividad, top performers, distribución de llamadas) — **no** es la vía de sincronización de leads GHL→DealerCenter que se investiga por separado (ver [[Carwarriors - SFTP DealerCenter (Investigación)]]). Son dos integraciones distintas con DealerCenter: esta reporta *desde* DealerCenter (rota), la otra inyectaría leads *hacia* DealerCenter (no construida).
> - Pendiente: preguntarle a Jorge/Karel si conocen el origen de este Worker (¿un desarrollador anterior? ¿tienen acceso a la cuenta de Cloudflare "gyoan"?) — podría ser reutilizable o dar pistas de una integración a medio construir.

**Módulos que debería mostrar (cuando funcione):**
- Resumen ejecutivo del día
- Productividad BDC
- Top Performers BDC
- Gráfica de distribución de llamadas

### Lead Sync — GHL → DealerCenter (LEGACY)

> [!warning] Reemplazado
> Este flujo se conectó originalmente vía **Make**, pero se pausó porque consumía demasiadas operaciones y agotaba el saldo rápidamente.

**Alternativa evaluada (n8n):** Técnicamente viable — recibir lead de GHL, convertirlo a formato ADF/XML y subirlo por SFTP para que DealerCenter lo importe. Quedó en diseño, no se implementó.

**Alternativa evaluada (Playwright + fetch interno):** Se intentó usar Playwright con fetch nativo a endpoints REST internos de DealerCenter usando sesión persistente. Se descartó por falta de API directa.

### Cómo se distribuyen los leads dentro de DealerCenter (explicado por Bianca, 2026-07-22)

> [!info] Audio de Bianca Cangialosi — 2026-07-22
> Bianca explicó que en DealerCenter **se juntan las cuentas de Rances Car y Carwarriors LLC** (una sola cuenta DealerCenter, un solo DCID) — no hay separación por cuenta, la separación es por convención de datos dentro de los leads. Usan dos campos nativos de DealerCenter para eso:
>
> **Lead Type** (de dónde vino el contacto):
> - **Internet** — el que más se usa. Se pone siempre que el lead viene de cualquier red social o campaña (WhatsApp, Instagram, Messenger, Meta Ads, etc.)
> - **Phone** — cuando el cliente llama directamente por teléfono. Poco frecuente.
> - **Chat** — casi no lo usan.
> - **Walk-in** — cliente que llega físicamente al lote.
>
> **Lead Source** (de qué campaña/canal específico y de qué dealer — esto es lo que distingue Rances de Carwarriors LLC dentro de la misma cuenta DealerCenter). Es una lista de categorías ya armada por ellos, con sufijo de dealer:
> - `Trade-In CW` (campaña Trade-In de Carwarriors) vs `Rances Trade-In` (misma campaña, pero Rances)
> - `Tesla CW` vs `Tesla Rances`
> - `previous customer` — cuando el lead es un cliente anterior
> - (mismo patrón para el resto de campañas: sufijo `CW` o el nombre del dealer indica el origen)
>
> A fin de mes hacen un análisis de leads apoyado en estos dos campos (de dónde entraron, de qué tipo).
>
> [!important] Implicación para el workflow n8n
> Esto **resuelve** la pregunta pendiente de si Rances Car/Car Express necesitan su propio DCID: **no**, comparten el de Carwarriors LLC (14031841) — mensaje a Jorge González sobre esto queda sin necesidad de respuesta. Lo que sí queda pendiente es **cómo mapear estos dos campos (Lead Type / Lead Source) en el XML ADF**: no se ha confirmado todavía qué tag exacto del ADF los puebla (candidatos: `<vendor><vendorname>`, `<provider><name>`, o un tag específico no estándar que DealerCenter interprete) — el XML de prueba usó `<provider><name>` con un valor libre ("CARWARRIORS LLC - GHL - FORJADO TEST"), no uno de los valores reales de Lead Source (`Trade-In CW`, `Tesla Rances`, etc.). Falta probarlo con un valor real y confirmar que aparece en el campo Lead Source de DealerCenter, y definir la regla de negocio (¿qué campaña de GHL/Meta Ads corresponde a qué valor de Lead Source, por subcuenta?).

### Lead Sync — GHL → DealerCenter (EN RE-EVALUACIÓN)

> [!warning] Decisión de arquitectura en revisión (2026-07-08)
> Se investigó a fondo el mecanismo real de DealerCenter (ver [[Carwarriors - SFTP DealerCenter (Investigación)]]): **sí existe** un método oficial de importación de leads por SFTP con formato ADF/XML (reemplazó al email por cumplimiento GLBA). El hallazgo clave: **SFTP es un protocolo con sesión persistente (sockets TCP), difícil de implementar sobre el runtime de Cloudflare Workers** (no es solo un `fetch`). n8n, en cambio, trae un nodo FTP con soporte SFTP nativo listo para usar, y ya centraliza el resto del pipeline (webhook GHL → agente IA → Mongo).
>
> **Estado:** Pendiente decisión final del usuario entre construirlo en n8n (recomendado por los hallazgos técnicos) o insistir con el Cloudflare Worker. No implementado todavía en ninguna de las dos rutas — bloqueado por falta de credenciales SFTP reales de DealerCenter (ver investigación).

---

## Automatizaciones ManyChat Vigentes

| Trigger | Copy actual | CTA |
|---|---|---|
| Story + palabra clave | *"Holaa! Soy Bianca, te ganaste $500 OFF para tu downpayment..."* | Botón → WhatsApp |
| Nuevo seguidor | *"Hola! Gracias por seguirnos... ¿Quieres ver nuestro inventario?"* | Botón → [carwarriorsllc.com/inventory/](https://www.carwarriorsllc.com/inventory/) + Canal IG |
| Comentario en post/reel | *"Unite a nuestro club, donde vas a recibir regalos para acceder a tu proximo auto..."* | Botón → Canal IG |

> [!todo] Mejora inmediata
> Los flujos actuales solo redirigen tráfico — no guardan datos. Primer paso: meter **webhook de ManyChat → n8n/GHL** para crear contacto en GHL con cada interacción.

---

## Roadmap de Automatización

### Módulo A — Captura de Leads (Todos los canales)
- WhatsApp, Instagram, Messenger, campañas de Meta Ads y cualquier canal que use el cliente
- Centralización de todos los leads en GHL con fuente, canal y mensaje original
- Tag automático por canal/campaña de origen
- Notificación al vendedor en tiempo real
- Se pueden agregar canales nuevos según necesidad

### Módulo B — DealerCenter *(prioridad crítica)*
- Detección de tareas +48/72h sin gestionar → reasignación automática
- Creación automática de tareas al ingresar lead o vencer tiempo de contacto
- Limpieza de duplicados y actualización de estados por comportamiento

### Módulo C — Automatización Financiera
- Clasificación automática de gastos
- Alertas de anomalías
- Dashboard KPIs: CPL, CPA, ROI por campaña

### Módulo D — Marketing Omnicanal
- Secuencias Bienvenida → Seguimiento → Cierre
- Respuestas automáticas en Instagram y WhatsApp
- Segmentación para evitar envío indiscriminado

### Módulo E — IA Aplicada a Ventas
- Lead Scoring predictivo
- Copiloto de ventas (sugerencias de próximo paso)
- Análisis de conversaciones cerradas sin éxito
- Generación de mensajes personalizados con IA

### Módulo F — Soporte BDC
- Auditoría de rendimiento por agente
- Alertas de SLA sobre leads
- Estandarización de procesos internos

---

## Historial

- 2026-06-18 — Primer contacto. Reunión con Bianca. Levantamiento técnico del ecosistema GHL, ManyChat y DealerCenter.
- 2026-06-18 — Registro inicial en bóveda FORJADO.
- 2026-06-20 — Confirmado: cliente en fase de pruebas activas. Contrato se formaliza si las pruebas salen bien.
- 2026-06-20 — Integración DC→GHL: Pasos 1-3 completados. Autenticación resuelta, endpoint confirmado, diseño n8n listo. Bloqueado en Paso 4: falta GHL credentials y decisiones de subcuenta/upsert del cliente.
- 2026-06-26 — Cambio de arquitectura en integración DealerCenter. Se descartan Make (costo de ops), n8n y Playwright. **Solución adoptada:** Cloudflare Worker recibe webhook de GHL → genera ADF/XML → sube por SFTP. Pendiente credenciales SFTP y estructura exacta del XML.
- 2026-07-08 — Investigación técnica de SFTP/ADF-XML de DealerCenter completada (ver [[Carwarriors - SFTP DealerCenter (Investigación)]]): confirmado que DealerCenter soporta importación oficial por SFTP, pero SFTP es difícil de implementar en Cloudflare Workers — reabre la decisión entre n8n y CF Worker para este tramo. En paralelo, se construyó el primer workflow de n8n: **Agente de Captura de Leads** (`carwarriors_lead_intake_agent_workflow.json`), que recibe leads de GHL, pide el teléfono conversacionalmente a los leads de Instagram/Messenger que no lo traen, y guarda todo en MongoDB Atlas (colección `leads`). Aún no probado en el n8n real del cliente — falta importarlo, conectar credenciales y validar el payload real del webhook de GHL.
- 2026-07-09 — Levantamiento vía API de GHL (Location API Key de Carwarriors LLC) de todo lo ya construido: 1 pipeline, 5 calendarios, 32 custom fields, 23 workflows de automatización (enrutamiento BDC por turnos, clasificador de campañas Meta, flujos WhatsApp). Ver detalle en [[Carwarriors - Inventario GHL]]. Pendiente completar el detalle interno de cada workflow (no accesible por API) y repetir para las otras 2 subcuentas.
- 2026-07-09 — Hallazgo: ya existen 2 agentes de Conversation AI nativos de GHL (Asistente Social IG/FB, Asistente Nocturno SMS/WhatsApp), ambos apagados. Decisión de arquitectura: construir en GHL nativo (no n8n) el nuevo agente 24/7, reservando n8n solo para lo que GHL no puede hacer. Cliente pidió arrancar un agente desde cero para WhatsApp + Instagram + Facebook que reemplace a ambos. Diseño y prompt inicial en [[Carwarriors - Agente IA 24-7 (Diseño)]].
- 2026-07-09 — El "Asistente Social" ya tiene un prompt de producción sólido (Personality + Bot Goals + Additional Info: control de tono, momentum, jerarquía de escalamiento de 5 niveles, gating por horario Miami, reglas de campaña). Decisión: reutilizar y extender este bot (no reescribir), agregando SMS y conectándolo al CRM. Cliente entregó su filosofía comercial de BDC (urgencia/insistencia) y el doc original "AUTOMATIZACION" — se calibró: urgencia moderada en el bot de IA sin tocar límites de re-contacto/opt-out (la insistencia fuerte queda para el BDC humano), y escasez solo cuando sea verificable. Detalle completo en [[Carwarriors - Agente IA 24-7 (Diseño)]].
- 2026-07-09 — Configuración aplicada en vivo sobre "Asistente Social" (rumbo a `Asistente CarWarriors 24/7`): renombrado, SMS agregado, Bot Goals editado, promo Tesla movida a Knowledge Base, **Appointment Booking** armado (Multi calendars: Showroom — Advisors + BDC‑B Day; BDC‑A quedó fuera por falta de asesor asignado — bug a resolver), **Trigger a Workflow** conectado a `Workflow Contactado` y `Workflow Crear Oportunidad` (conecta el bot al pipeline), **Contact Info** (6 campos) y **Auto Followup** (1 de 3 escenarios) confirmados, **Human Handover** revisado (pre-armado pero apagado, sin usuario asignado — falta elegir entre Carlos Cisneros/Nallely de Leon). Bot sigue en `Off` hasta resolver 14 preguntas pendientes con el equipo (lista completa en [[Carwarriors - Agente IA 24-7 (Diseño)]]).
- 2026-07-10 — Cliente respondió 8 de las 14 preguntas pendientes del Agente IA 24/7 (detalle en [[Carwarriors - Agente IA 24-7 (Diseño)]]): **Human Handover** → asignar a **Nallely de Leon** en los 3 escenarios (Carlos Cisneros ya no trabaja ahí, sacarlo de GHL); tras agendar cita **no hay transferencia a empleado específico** — la cita cae directo en DealerCenter y la atiende el primer vendedor disponible, quedando la IA como el BDC que originó el lead; **BDC‑A (turno madrugada/noche) lo cubre la IA sola**, sin asesor humano asignado (pendiente técnico: GHL exige `teamMembers` no vacío para usarlo en booking, hay que ver cómo destrabarlo); promo Tesla **sigue vigente**; el cliente no sabía qué es "Knowledge Base" pero confirmó que el **inventario se renueva a diario** — falta explicarle el concepto y definir cómo mantenerlo sincronizado. 2 preguntas no se entendieron y quedaron para reformular en términos más simples: si el bot debe agendar la cita en firme o solo proponer horario, y si los calendarios BDC Callback / Maria Eleonor Zurita quedan fuera del alcance de la IA o no.
- 2026-07-10 — Se reenvió al cliente un mensaje en lenguaje simple con las 6 preguntas restantes: las 2 reformuladas (agendar en firme vs. proponer horario; alcance de BDC Callback y calendario de Maria Eleonor), comportamiento del bot tras hand-off manual, activar "Contact is Busy"/"Contact Requested" en Auto Followup, permitir cancelar/reagendar citas, y los 3 hallazgos técnicos de GHL (workflows con 74M de inscritos, pestaña "Needs review", workflow "N8N" con 6 inscritos activos). A la espera de respuesta antes de poder encender el bot en Auto Pilot.
- 2026-07-10 — Cliente respondió 5 de las 6 preguntas reenviadas (detalle en [[Carwarriors - Agente IA 24-7 (Diseño)]]): **booking en Showroom en firme e inmediato** (con requisito nuevo: tarea de confirmación de cita el día anterior, a cargo de un BDC humano o de la IA); tras un hand-off humano el bot **queda en silencio total** hasta el próximo horario sin cobertura humana (obliga a quitar del prompt la línea "stay available for basic questions after handoff" y a ajustar el sleep fijo de 4h); **Auto Followup** "Contact is Busy"/"Contact Requested" se activan; el bot **sí puede cancelar/reagendar** citas. Sigue sin resolver el alcance de `BDC Callback`/calendario de Maria Eleonor Zurita — la persona que respondió no entendió esa pregunta y pidió consultarla directamente con Jorge González. Aún faltan las 3 preguntas técnicas sobre workflows raros de GHL (74M inscritos, "Needs review", workflow "N8N").
- 2026-07-10 — Se redactó el plan técnico de 6 puntos para aplicar en GHL las respuestas del día (ver [[Carwarriors - Agente IA 24-7 (Diseño)]]: Appointment Booking en firme + cancelar/reagendar, workflow nuevo de tarea de confirmación día -1, Auto Followup, ajuste del prompt/sleep post hand-off) y los 2 mensajes pendientes de envío (a Jorge González sobre calendarios; a soporte GHL sobre las 3 anomalías técnicas). **No se aplicó nada en vivo todavía**: este entorno no tiene herramienta MCP/browser conectada a GoHighLevel (el token de API documentado cubre datos de CRM, no la configuración de Agent Studio, que es solo UI) — los cambios quedan como instrucciones para aplicar manualmente. Los 2 mensajes se dejan pendientes de envío, a decidir cuándo mandarlos.
- 2026-07-14 — Bot "Asistente Social CarWarriors" (subcuenta principal) activado en vivo: `Primary` + `Auto-Pilot` en WhatsApp/IG/FB/SMS, con Appointment Booking, Trigger a Workflow, Auto Followup y Human Handover (Nallely de Leon) configurados. Prueba en sandbox salió muy bien (agendó una cita real leyendo el calendario). **Bloqueo activo:** se perdió el acceso a la cuenta de GHL justo antes de confirmar si esa cita de prueba (12:20 PM) creó un evento/contacto real — sigue sin confirmarse. Detalle completo en [[Carwarriors - Agente IA 24-7 (Diseño)]] y [[Carwarriors - Comportamiento del Bot (Resumen)]].
- 2026-07-17 — Cliente entregó un token API nuevo (`pit-c30b22ca-d09c-45a4-967e-8b75e574a783`), confirmado por prueba directa contra la API como perteneciente a la subcuenta **Rances Car** (antes sin Location ID documentado). Se instaló Playwright en este entorno y, con credenciales propias del usuario (2FA por correo, no por SMS), se logró entrar por primera vez a la interfaz de GHL vía navegador — esto resuelve la limitación de "solo API, sin acceso a Agent Studio/Conversation AI" que bloqueaba avances desde el 2026-07-10. Al entrar a Rances Car se descubrió que el cliente **ya estaba construyendo ahí el equivalente del Agente Social**, replicando el prompt de Carwarriors LLC, pero la sesión (en otra PC) se cortó por un apagón a medio trabajo. Se documentó el estado exacto en el que quedó — ver [[Carwarriors - Agente IA Rances Car (Diseño)]]. Pendiente: seguir aplicando ahí las mismas calibraciones ya validadas en Carwarriors LLC, y por separado seguir el bloqueo de acceso de la subcuenta principal (sin novedades desde el 14 de julio).
- 2026-07-18 — Se retomó Rances Car (mismo acceso Playwright). Hallazgo: el cliente siguió avanzando por su cuenta entre el 17 y el 18 — "Setup your Actions" del "Agente Social RancesCar" ya no estaba vacío: **Appointment Booking** (multi calendars Samuel Aguilar + Scarleth Hassiel Rubi, cancelar/reagendar habilitado), **Human Handover** (3 escenarios On, asignado a Scarleth Hassiel Rubi, reactiva en 8h) y **Auto Followup** (3 escenarios On, 15 min) quedaron configurados igual que en Carwarriors LLC. Faltan **Contact Info** y **Trigger a Workflow** (plantillas vacías). Se aplicaron en vivo 3 de las calibraciones ya validadas en Carwarriors LLC (bot sigue en `Off`, sin riesgo): typo "Rancer Car"→"Rances Car", Goal actualizado a los 4 canales, Visit Rules acortada, y silencio total post hand-off. Se dejó sin tocar la promo Tesla (pendiente confirmar con el cliente si aplica a este dealer). Se resolvió también la duda de los "193 contactos con bot en Off": es solo reporte de tráfico agregado por canal, no evidencia de que la IA esté respondiendo. Además se encontró que el workflow **"Rances Car - Ruteo Human Handover por Turno"** (Automation → Asignacion), construido en una sesión anterior el 17-jul, **nunca se había guardado** (quedó vacío) — se reconstruyó de cero: If/Else por día/hora (Scarleth Lun-Sáb 8am-5pm / Samuel Mar-Dom 5pm-9pm / None sin acción en los huecos), se guardó, **se publicó y se probó en vivo** con un contacto de prueba (Jorge Calderón) — el Execution log confirmó que tomó la rama "None" correctamente (domingo noche, fuera de ambos turnos). **Sesión interrumpida por corte de electricidad** justo antes de empezar a configurar Contact Info (contenido de los 6 campos ya decidido, sin escribir aún) — detalle completo y próximo paso exacto en [[Carwarriors - Agente IA Rances Car (Diseño)]].
- 2026-07-20 — **"Agente Social RancesCar" activado en producción** (modo guiado por captura de pantalla, cliente operando su propio navegador). Se completó todo lo que quedó pendiente el 18-jul: **Contact Info** (6 campos, con 2 "Output Example" cada custom field — requisito no documentado antes); **Trigger a Workflow** (se descartó construir un "Workflow Crear Oportunidad" nuevo al confirmar que "Workflow Contactado" ya hace find-or-create de oportunidad internamente — se reusa ese mismo workflow para los 2 triggers del bot); **promo Tesla movida a Knowledge Base** (artículo "Campañas activas", prompt actualizado con regla genérica de check a KB); contacto de prueba Jorge Calderón eliminado; **"Goodbye Detection" (Stop Bot) decidido dejar en `Off`** (las frases pre-cargadas eran despedidas casuales sin ventana de reactivación — activarlo habría abandonado leads tibios para siempre, contra la filosofía de no dejar enfriar al cliente); investigado el sistema de asignación general `Workflow Asig Agente (Entrada)` — confirmado complementario al Human Handover (no conflictivo), con un desalineamiento menor de horario de Scarleth (6:45pm vs 5pm) que queda como mejora futura; y confirmado que "Asignación por Turno"/"Reintento" en Rances Car también tiene el bug de loop ya visto en la subcuenta principal (56.4M inscritos vs 74M en Carwarriors LLC). **Cierre: "Set as Primary Bot" + Auto Pilot aplicado — bot en vivo** en Facebook/Instagram/WhatsApp/SMS. Decisión del cliente: "Agente Nocturno RancesCar" se va a borrar directamente, no se audita.
- 2026-07-21 — Cerrados los 3 pendientes que quedaban de Rances Car: bot "Agente Nocturno RancesCar" borrado en GHL (confirmado por Jorge antes de ejecutar, acción irreversible); horario de Scarleth alineado a las 5pm en `Workflow Asig Agente (Entrada)` (antes 6:45pm, desalineado contra el workflow de ruteo por turno); promo Tesla/horario de negocio/jerarquía de escalamiento de 5 niveles confirmados por Jorge como iguales a Carwarriors LLC (no necesitan versión propia). Se descartó (decisión de Jorge) reportar a soporte GHL el bug de loop de 56.4M inscritos — mismo patrón no reportado tampoco en Carwarriors LLC. Rances Car queda sin pendientes conocidos.
- 2026-07-22 — **Prueba técnica en curso (interrumpida, retomar): mapeo de Lead Type/Lead Source en el XML ADF.** Se subió por SFTP un segundo XML de prueba (cliente "FORJADO TEST LEADSOURCE BORRAR", mismo mecanismo ya validado) con **"Trade-In CW"** puesto en `<provider><name>`, para confirmar si ese tag es el que puebla el campo Lead Source de DealerCenter. La subida mostró un mensaje `close remote: Failure` (a diferencia de la prueba anterior, que fue limpia) — no confirmado todavía si el lead se creó de verdad. Se entró a DealerCenter vía Playwright con sesión persistente (CDP puerto 9222, scripts en el scratchpad de esta sesión bajo `pw/`; la sesión ya estaba recordada, no pidió 2FA). Se encontró un reporte muy útil para esta investigación: **Customer → Customer List** (`.../reports/custom/customerreport/detailedcustomers?reportId=-1089`), que tiene filtros nativos separados de **Lead Source** y **Lead Type**, y muestra en cada fila "Source:" y "Type:" por separado (ejemplos reales vistos: `Source: OUR WEBSITE` / `Type: INTERNET`, `Source: TIKTOK ALEJANDRA` / `Type: INTERNET`) — confirma visualmente que son dos campos distintos, tal como describió Bianca.
> [!success] RESUELTO 2026-07-23 — mapeo Lead Type/Lead Source confirmado
> Retomada la sesión (misma conexión Playwright/CDP). Con el filtro de estado quitado (Reset), buscar "FORJADO" en Customer Name confirmó que el lead de la prueba anterior ("...BORRAR", con `<provider><name>`="Trade-In CW" + `<service>` poblado) **nunca se creó** — el `close remote: Failure` del upload sí fue una falla real, no solo un mensaje cosmético.
>
> Se repitió la prueba con 2 XML nuevos subidos por SFTP (mismo mecanismo `curl`, credenciales de la tabla de arriba):
> - **Prueba "BORRAR 2"** (`<provider><name>`="Trade-In CW", `<service>`="WhatsApp / Instagram / Messenger") → subida limpia, lead creado. Resultado: **Source = "TRADE-IN CW - WHATSAPP / INSTAGRAM / MESSENGER"** (concatenación de `name` + `service`, en mayúsculas). **Type = INTERNET**.
> - **Prueba "BORRAR 3"** (`<provider><name>`="Trade-In CW", sin `<service>`) → lead creado. Resultado: **Source = "Trade-In CW" exacto**, coincidiendo con el valor real del dropdown de Lead Source (no quedó como texto libre, sino como el mismo combobox value que usa el equipo). **Type = Internet** (igual que la prueba anterior).
>
> **Conclusión (resuelve el bloqueador #8):**
> - `<provider><name>` es el tag que puebla **Lead Source** — pero **no debe incluirse `<service>`** en el mismo `<provider>`, porque DealerCenter lo concatena al Source ("NAME - SERVICE") en vez de dejarlo como el valor limpio del dropdown. Para que el workflow n8n arme el Source correcto, el XML debe llevar solo `<name part="full">VALOR_EXACTO_DE_LEAD_SOURCE</name>` dentro de `<provider>`, sin `<service>`.
> - **Lead Type no lo controla ningún tag ADF probado** — quedó fijo en "Internet" en ambas pruebas sin que se le pasara nada específico. Consistente con lo que explicó Bianca: Internet es el default para cualquier lead de red social/campaña, que es el 100% de los leads que va a mandar este workflow (WhatsApp/IG/Messenger vía GHL). Conclusión práctica: el workflow n8n no necesita mapear Lead Type — puede omitirlo, DealerCenter lo deja en Internet automáticamente.
> - Ambos leads de prueba ("BORRAR 2" y "BORRAR 3") se marcaron como `Deleted` en DealerCenter (Customer detail → botón "⋮" → "Mark as Deleted" → Ok), igual que la prueba anterior.
>
> **Pendiente real que queda:** levantar con Jorge/Bianca la tabla completa de valores exactos de Lead Source por campaña/dealer (para que el workflow n8n sepa qué string exacto poner en `<provider><name>` según de qué subcuenta/campaña GHL vino el lead) — sin esto, un valor que no coincida exactamente con el dropdown existente podría crear una opción nueva en vez de usar la categoría correcta (no probado, a confirmar).

- 2026-07-23 — **Retomada y RESUELTA la verificación de mapeo Lead Type/Lead Source en el XML ADF** (sesión interrumpida el 22 por falta de conectividad al dominio de DealerCenter desde un entorno distinto; se retomó reconectando a la misma sesión de Playwright con CDP 9222 que seguía viva). Se confirmó que el lead de la prueba anterior nunca se creó (el `close remote: Failure` fue real). Se subieron 2 XML nuevos por SFTP: uno con `<provider><name>`="Trade-In CW" + `<service>` poblado → Source quedó concatenado como "TRADE-IN CW - WHATSAPP / INSTAGRAM / MESSENGER"; otro con solo `<name>`, sin `<service>` → Source quedó exactamente "Trade-In CW", igual al valor real del dropdown. En ambos casos Type quedó en "Internet" sin que se le pasara nada. **Conclusión: `<provider><name>` sin `<service>` = Lead Source correcto; Lead Type no requiere mapeo, DealerCenter lo deja en Internet automáticamente.** Ambos leads de prueba se marcaron como `Deleted`. Detalle completo en la sección "Cómo se distribuyen los leads dentro de DealerCenter" más abajo.
- 2026-07-22 — **Bianca explicó por audio cómo Carwarriors distribuye leads dentro de DealerCenter.** Rances Car y Carwarriors LLC comparten una sola cuenta/DCID en DealerCenter (no hay cuenta separada) — la distinción entre dealers se hace con el campo **Lead Source** (convención de nombre con sufijo por dealer, ej. `Trade-In CW` vs `Rances Trade-In`, `Tesla CW` vs `Tesla Rances`, `previous customer`), y el **Lead Type** (`Internet` por defecto para cualquier red social/campaña, `Phone` poco usado, `Chat` casi nunca, `Walk-in` presencial). Esto resuelve la pregunta pendiente sobre si Rances/Car Express necesitan DCID propio (respuesta: no) y abre una nueva: cómo mapear Lead Type/Lead Source en el XML ADF del workflow n8n — no confirmado todavía qué tag exacto los puebla. Detalle completo en la sección "Cómo se distribuyen los leads dentro de DealerCenter" más abajo.
- 2026-07-23 — **Simplificado el único pedido pendiente a Bianca (tabla de Lead Source por campaña/dealer).** El pedido original (mapear cada campaña/canal de GHL a su valor exacto de Lead Source en DealerCenter) se explicaba en términos técnicos y Bianca no entendía qué se le pedía. Se redujo a algo mecánico: pedirle un screenshot del dropdown de filtro "Lead Source" en DealerCenter (Customer → Customer List), sin necesidad de que entienda la automatización. Además se confirmó que **Jorge puede obtener esa lista él mismo** entrando a DealerCenter y abriendo ese mismo filtro — no depende de Bianca. Queda pendiente que Jorge decida si la saca él mismo (manual o con ayuda de Playwright) o espera la respuesta de Bianca; no se ejecutó la automatización en esta sesión (no había sesión de navegador viva, requeriría login + 2FA nuevos).
- 2026-07-22 — **Lead Sync GHL→DealerCenter: mecanismo validado end-to-end por primera vez.** Jorge confirmó tener acceso a DealerCenter (usuario jcalderon90) y se logueó en vivo (2FA por email) en la misma sesión de Playwright ya usada para GHL. Se generaron las credenciales SFTP reales (Dealer Settings → Customer → Lead Management → SFTP to Lead) y se confirmó el DCID de Carwarriors LLC (**14031841**, en Dealership → General → "DC Company ID"). Se armó un XML de prueba en formato ADF, se subió por SFTP con `curl` (soporta SFTP vía libssh2, pinneando el host key con `--hostpubsha256`) a `/Leads/`, y apareció como lead real en DealerCenter (Customer → Reports → My New Prospects) con todos los datos coincidiendo — confirmando que el mecanismo oficial de DealerCenter funciona de verdad, no solo en documentación. El lead de prueba se marcó como `Deleted` para no confundir al equipo de ventas. Hallazgo técnico: el host SFTP es Azure Blob Storage con soporte SFTP nativo (banner `AzureSSH_1.0.0`). Hallazgo sin explicar: el directorio `/Leads/` ya tenía 2 archivos con nombres aleatorios no legibles (permiso denegado, cuenta de solo escritura) antes de la prueba — posible residuo de un intento anterior, sin confirmar con Jorge/Karel. **Arquitectura decidida: n8n** (no Cloudflare Worker) para construir el workflow de producción que arme el XML y lo suba por SFTP automáticamente ante cada lead nuevo de GHL. Se le explicó todo esto a Jorge Calderón en lenguaje simple (analogía de "buzón" y "carta") para que se lo reenviara a Jorge González, incluyendo la pregunta pendiente de si Rances Car/Car Express comparten el DCID 14031841 o necesitan cuenta propia en DealerCenter — mensaje ya enviado, a la espera de respuesta. Detalle técnico completo (credenciales, ejemplo de XML, hallazgos) en la sección "DealerCenter" más abajo en esta misma nota.
- 2026-07-26 — **Confirmado: sigue sin resolverse el acceso a una instancia n8n de Carwarriors.** Jorge indicó explícitamente "aun no tengo la instancia de n8n de Carwarriors". Con la investigación técnica ya cerrada desde el 23-jul, este es ahora el único bloqueador real para empezar a construir el workflow de producción (el otro pendiente, la tabla de Lead Source por campaña/dealer, sigue en manos de Jorge/Bianca). Se le ofreció diseñar el workflow en JSON de antemano (para importar en cuanto haya acceso) o ayudar a destrabar el acceso — eligió esperar a tener la instancia antes de avanzar en cualquier construcción. Sin cambios técnicos en esta sesión.
- 2026-07-24 — **Hallazgo: el bot "Asistente Social CarWarriors" (subcuenta principal) está apagado (`Off`)**, verificado en vivo por Playwright/CDP contra GHL — contradice el estado "en vivo" reportado desde el 14-jul. "Last Updated" marcaba ese mismo día 9:00 AM; una conversación real con un lead (Alfredo Blanco, 23-jul 10:35pm) confirma que sí respondió el día anterior — se apagó en algún momento entre esa conversación y la mañana siguiente. **Causa sin confirmar todavía** (no se investigó por qué ni quién lo apagó). En paralelo, a partir de esa misma conversación, el cliente pidió una regla nueva: cuando un lead dice que no tiene crédito, el bot debe pedir el teléfono para que un humano llame ese mismo día, en vez del mensaje genérico de "te conecté con un asesor". Se redactó el bloque `Credit Objection Rule` y se le entregó al cliente para pegarlo manualmente en Bot Goals → Additional Information (sin API/browser propio para Conversation AI en esa sesión) — **sin confirmar todavía que lo guardó**. Detalle completo en [[Carwarriors - Agente IA 24-7 (Diseño)]].
- 2026-07-27 — **Infraestructura propia de n8n desplegada.** Cliente contrató VPS Hostinger KVM1 (`2.24.106.87`); se instaló Coolify v4.1.2 y se desplegó el stack oficial de n8n (n8n + worker + Postgres + Redis) — tuvo el error típico de "secure cookie" al primer acceso, resuelto por el propio Jorge. Sobre esa instancia ya desplegada se construyó y activó el workflow **"Carwarriors - Agente de Captura de Leads (GHL + Mongo)"** (ID `6QGLivaPilh09R21`, 15 nodos) a partir del diseño `carwarriors_lead_intake_agent_workflow.json` — se corrigieron 2 bugs reales de la implementación original al probarlo (nodo Mongo que cortaba la cadena sin registro previo; lógica de "Has Pending Record?" rota por el fix anterior). Webhook de producción listo: `.../webhook/d7cd6008-dc30-4ec4-827d-58e009a39a09/carwarriors-lead-intake`. Quedó pendiente el lado de GHL (nada disparaba ese webhook todavía) y rotar el Location API Key que quedó expuesto en el chat de esa sesión. Detalle completo en [[Carwarriors - Infraestructura (Diseño)]].
- 2026-07-28 — **Analizada una captura de Bianca: DM de spam de Instagram respondido fuera de flujo por el bot, y confirmado que el bot volvió a responder (ya no está `Off`).** La captura mostraba un mensaje de "Ida Laurie" (en realidad un bot de spam de un supuesto proveedor de China ofreciendo ropa/zapatos/bolsos/relojes, probable mercadería replicada, con redirección a WhatsApp), al que el "Asistente Social CarWarriors" respondió con "Are you offering B2B wholesale to CarWarriors or seeking retail buyers?" — una pregunta razonable pero que no existe en ningún flujo documentado (la calificación siempre es vehículo → ubicación → uso → timing → pago). Esto confirma además que el bot **ya no está apagado** (contradice el hallazgo del 24-jul), sin que se sepa cuándo o quién lo reactivó. Se investigó por API si el remitente ya generó un contacto/oportunidad en el CRM: no aparece en Carwarriors LLC ni en Rances Car (búsqueda por nombre y por `source: instagram`); los últimos 50 contactos de Carwarriors LLC son todos de WhatsApp — inconcluso, podría estar en Car Express Servicess (sin token API) o guardado con otro nombre. Se redactó una **`Vendor/Spam Outreach Rule`** (mismo formato que la `Credit Objection Rule` del 24-jul) para pegar en Bot Goals → Additional Information — pide que el bot no corra el flujo de calificación con proveedores/spam, pregunte una vez si es una consulta de negocio ajena a compra de auto, y cierre la conversación sin escalar ni ofrecer visita. **No se aplicó todavía**: se intentó instalar Playwright para aplicarla en vivo (sin Chromium propio disponible en este Mac, se usó `channel: 'chrome'` sobre el Chrome del sistema con un perfil dedicado para no tocar la sesión personal del usuario), el navegador con CDP llegó a abrir GHL pero la sesión se interrumpió mientras el SPA todavía cargaba, antes de intentar login/2FA — la regla queda documentada pero no pegada en GHL. Caveat aparte: aunque se aplique, `Workflow Contactado` se dispara con el primer mensaje real sin filtrar contenido, así que este spam probablemente ya entró al pipeline de todas formas — pendiente revisar esa condición del trigger. Detalle completo en [[Carwarriors - Agente IA 24-7 (Diseño)]] y [[Carwarriors - Comportamiento del Bot (Resumen)]].
- 2026-07-28 — **Conectado el lado de GHL al webhook de n8n — publicado y en vivo.** En vez de crear una automatización nueva, se encontró que ya existía un workflow llamado **"N8N"** en Automation → Workflows → carpeta "Agente AI" (subcuenta Carwarriors LLC) — resolviendo una pregunta pendiente desde hace semanas ("¿para qué se usa el workflow N8N en Draft?"). Ya tenía armado el trigger correcto (Customer Replied en Facebook Messenger o Instagram DM) → acción Custom Webhook. Se descubrió que esa URL apuntaba a `n8n.apps.carwarriorsllc.com`, un dominio **real y activo** (IP distinta a la del VPS de Hostinger) que Jorge reconoce como suyo/del cliente pero queda pendiente de investigar a fondo. Se actualizó la URL al nuevo webhook, se eliminó un paso final ("Enviar mensaje en Messenger") que estaba completamente sin configurar, y se publicó el workflow — confirmado tras recarga completa y en la lista de Workflows (Status = Published). Con acceso MCP a la instancia de n8n (`n8n-carwarriors`, conectado esta misma sesión), se confirmó que el cableado es correcto pero aún no ha llegado tráfico real, y se corrigió el nodo "Normalize Payload" para leer `message_body` (el campo real que manda GHL) en vez de solo `message`/`lastMessage`/`body` — publicado como nueva versión activa. Queda pendiente, a propósito: `channel` y `locationId` no vienen en el payload de GHL (el código cae a `'unknown'` sin romperse); rotar el Location API Key expuesto el 27-jul; confirmar URL final/dominio propio de n8n; investigar `n8n.apps.carwarriorsllc.com`.

## Auditoría Técnica Pendiente

> Preguntas abiertas que hay que responder antes de comprometer ciertos módulos.

### DealerCenter — Integración (Módulo B)
- [x] ¿Tiene DealerCenter API REST documentada o acceso de desarrollador? -> Confirmado que **no** se dispone de API oficial de desarrollador (sí existe una API *no oficial* de un tercero, Supergood, documentada como plan B en la investigación).
- [x] Evaluar opciones -> Intentos previos: (1) Make → descartado por costo de operaciones. (2) Playwright + fetch interno → descartado por inestabilidad. (3) n8n + SFTP + ADF/XML → viable, pendiente de decisión.
- [x] Investigación SFTP/ADF-XML completada (2026-07-08) -> Ver [[Carwarriors - SFTP DealerCenter (Investigación)]]. DealerCenter sí soporta SFTP oficial. Hallazgo: SFTP es difícil de implementar en el runtime de Cloudflare Workers (sockets TCP con sesión, no HTTP simple) — n8n trae nodo FTP/SFTP nativo. Reabre la decisión Worker vs n8n.
- [x] **Decisión de arquitectura tomada 2026-07-22: n8n** (no Cloudflare Worker) para construir el tramo GHL → DealerCenter.
- [x] Credenciales SFTP generadas 2026-07-22 desde DealerCenter (Dealer Settings → Customer → Lead Management → SFTP to Lead) — ver sección "DealerCenter" más abajo para host/usuario/password/directorio.
- [x] DCID de Carwarriors LLC confirmado: **14031841** (Dealership → General → "DC Company ID"). -> Confirmado por Bianca (audio, 2026-07-22): Rances Car y Car Express **comparten este mismo DCID**, no necesitan cuenta propia — se distinguen por el campo Lead Source, no por DCID.
- [x] Probado con un lead de prueba real 2026-07-22 → **llegó a DealerCenter correctamente** (ver historial). El bloque `<vehicle>` se probó poblado (año/marca/modelo) y funcionó; no se probó sin poblar, no es bloqueante.
- [ ] Implementar el workflow real en n8n: recibir lead nuevo desde GHL (webhook o trigger), armar el XML ADF con los datos reales, subir por SFTP a DealerCenter automáticamente.
- [ ] Definir convención de nombre de archivo (no confirmado si DealerCenter la exige; se usó un nombre descriptivo en la prueba sin problema).
- [x] ~~Confirmar qué tag del XML ADF puebla Lead Type/Lead Source~~ → **RESUELTO 2026-07-23**: `<provider><name>` (SIN `<service>`) puebla exactamente **Lead Source** con el valor real del dropdown (probado con "Trade-In CW"). **Lead Type** no lo controla ningún tag — queda fijo en "Internet" para todo lead ingerido por SFTP/ADF (no hace falta mapearlo). Detalle completo en la sección "Cómo se distribuyen los leads..." más abajo.
- [ ] Levantar con Jorge/Bianca la tabla completa de valores de Lead Source por campaña y por dealer (Trade-In CW/Rances Trade-In, Tesla CW/Tesla Rances, previous customer, etc.) y cómo mapear cada campaña/canal de GHL a su valor correspondiente — necesario para que el workflow n8n arme el XML correctamente según de qué subcuenta/campaña GHL vino el lead. También confirmar qué pasa si el valor enviado no coincide exactamente con un Lead Source existente en el dropdown (¿crea uno nuevo? ¿lo rechaza?) — no probado. **2026-07-23:** pedido simplificado para Bianca (screenshot del dropdown de Lead Source en Customer → Customer List) y confirmado que Jorge puede sacarla él mismo sin depender de ella — pendiente que decida el camino.

### Agente de Captura de Leads en n8n (nuevo, 2026-07-08)
- [x] Workflow diseñado y exportado: `carwarriors_lead_intake_agent_workflow.json` (webhook GHL → clasifica canal → pide teléfono si falta [IG/Messenger] → guarda en MongoDB Atlas colección `leads`)
- [x] Importar el workflow en el n8n real del cliente y conectar credenciales → **hecho 2026-07-27**: workflow recreado vía MCP (`Carwarriors - Agente de Captura de Leads`, ID `6QGLivaPilh09R21`), credenciales `MongoDB Carwarriors` y `Header Auth GHL` conectadas, **activo**.
- [x] Crear la automatización del lado de GHL que dispare el webhook `carwarriors-lead-intake` en n8n → **hecho 2026-07-28**: se reusó y publicó el workflow existente "N8N" (Automation → Agente AI, Carwarriors LLC) apuntando a la nueva URL.
- [x] Capturar un payload real y ajustar "Normalize Payload" → **parcial, 2026-07-28**: se confirmó el payload real de GHL (`id`, `name`, `phone`, `message_body`, sin `channel`/`locationId`) y se corrigió el nodo para leer `message_body`. `channel`/`locationId` siguen sin llegar — código cae a `'unknown'` sin romperse, pendiente decidir si se resuelve editando el JSON de GHL o partiendo el webhook por canal.
- [ ] Probar los 2 caminos con tráfico real: lead de WhatsApp (debe guardarse directo) y lead de Instagram/Messenger sin teléfono (el agente debe preguntar y, al responder con un número, actualizar el contacto en GHL y guardar en Mongo) — a la espera de la primera ejecución real desde que se publicó el webhook (2026-07-28), las únicas ejecuciones hasta ahora son pruebas manuales.

### WhatsApp en GHL — Estado de integración (Módulo A)
- [ ] El cliente usa `https://applevel-dashboard.ilumosdigital.com/user/apps` como puente WhatsApp → GHL (servicio de Ilumos Digital)
- [ ] Verificar: ¿está activo y funcionando ese puente?
- [ ] Verificar: ¿los mensajes de WhatsApp llegan a GHL como contactos con datos estructurados, o solo como conversaciones sin registro?
- [ ] Si ya funciona: el Módulo A se simplifica — solo asegurarse de que los leads se creen correctamente

### Canales adicionales
- [ ] ¿Qué otros canales quiere conectar el cliente además de WhatsApp, Instagram y Messenger?
- [ ] ¿Qué campañas de Meta Ads están activas? ¿Usan formularios de Meta o landing pages propias?
- [ ] ¿Hay formularios web actuales que deban capturarse también?

---

## Próximos pasos

> [!important] Estado comercial
> En fase de **pruebas activas**. El contrato se firma si las pruebas salen bien — es tan prioritario como Varela Law.

### Agente IA 24/7 — subcuenta principal Carwarriors LLC (ver detalle en [[Carwarriors - Agente IA 24-7 (Diseño)]] y [[Carwarriors - Comportamiento del Bot (Resumen)]])

- [x] Bot en vivo desde 2026-07-14: `Primary` + `Auto-Pilot`, Appointment Booking, Trigger a Workflow, Auto Followup y Human Handover (Nallely de Leon) configurados.
- [x] Acceso a GHL recuperado 2026-07-15 (el bloqueo de "me expulsaron" del 14-jul no volvió a mencionarse desde entonces; el trabajo en Rances Car y DealerCenter continuó con normalidad en la misma cuenta de agencia).
- [x] ~~Workflow "N8N" con 6 inscritos, ¿para qué se usa?~~ → **RESUELTO 2026-07-28**: era un workflow a medio construir (trigger Customer Replied FB/IG → Custom Webhook) apuntando a un n8n legacy (`n8n.apps.carwarriorsllc.com`) — reutilizado, apuntado al nuevo n8n de Hostinger y publicado. Ver sección "Agente de Captura de Leads en n8n" e historial del 2026-07-28.
- [ ] **⚠️ Hallazgo 2026-07-24: el bot está apagado (`Off`) ahora mismo** — se activó el 14-jul pero se apagó en algún momento entre el 23-jul 10:35pm y el 24-jul 9am, causa sin confirmar. **Actualización 2026-07-28: el bot vuelve a responder** (confirmado por una captura de Bianca) — sigue sin confirmarse cuándo/quién lo reactivó ni por qué se había apagado.
- [ ] **Nuevo 2026-07-28:** el bot respondió fuera del flujo estándar a un DM de spam de Instagram (proveedor falso ofreciendo ropa/zapatos/bolsos). No hay regla hoy para "mensaje que no es de un comprador de auto" — se redactó `Vendor/Spam Outreach Rule` (texto completo en [[Carwarriors - Agente IA 24-7 (Diseño)]]) para Bot Goals → Additional Information, **todavía no aplicada** (intento por Playwright/Chrome CDP interrumpido antes del login). Tampoco se confirmó si ese DM creó un contacto/oportunidad en el CRM — no aparece por API en Carwarriors LLC ni Rances Car, falta revisar Car Express Servicess. Caveat: `Workflow Contactado` se dispara con el primer mensaje sin filtrar contenido, así que la regla no evita por sí sola que este tipo de spam entre al pipeline.
- [ ] Confirmar que el cliente pegó y guardó la regla nueva "Credit Objection Rule" (pedir teléfono ante objeción de crédito) en Bot Goals → Additional Information — entregada 2026-07-24, sin confirmar.
- [ ] Crear el campo de teléfono en la acción `Contact Info` del bot (hoy no existe uno mapeado a `Phone`) — necesario para que el flujo de "pedir número por objeción de crédito" quede registrado en el CRM.
- [ ] Sigue sin confirmarse si la cita de prueba (14 jul, 12:20 PM) creó un evento/contacto real en GHL — no se retomó esta verificación específica, no bloquea nada más.
- [ ] (Mensaje pendiente de enviar) Preguntar a Jorge González directo sobre `BDC Callback`/calendario de Maria Eleonor
- [ ] (Mensaje pendiente de enviar) 2 preguntas técnicas a soporte GHL: 74M inscritos en 2 workflows, pestaña "Needs review" (la 3ra, sobre el workflow "N8N", ya no aplica — resuelta arriba)
- [ ] Fase 2: tarea de confirmación de cita día -1, explicar Knowledge Base al cliente + sync de inventario diario, destrabar calendario BDC-A

### Agente IA — subcuenta Rances Car — ✅ EN PRODUCCIÓN desde 2026-07-20 (ver detalle en [[Carwarriors - Agente IA Rances Car (Diseño)]])

- [x] Acceso resuelto 2026-07-17: token API propio + acceso de navegador vía Playwright (2FA por correo, más rápido que el de la cuenta de agencia).
- [x] Confirmado: "Agente Social RancesCar" ya tenía el prompt portado de Carwarriors LLC y los 4 canales configurados (Facebook, Instagram, WhatsApp, SMS) antes del corte de luz.
- [x] Corregir typo "Rancer Car" → "Rances Car" en el prompt — hecho 2026-07-18.
- [x] Aplicar calibraciones de Carwarriors LLC (multi-canal en Goal, Visit Rules acortada, silencio post hand-off) — hecho 2026-07-18.
- [x] Promo Tesla → Knowledge Base — hecho 2026-07-20: reemplazada en el prompt por regla genérica de check a Knowledge Base; artículo "Campañas activas" creado con el detalle ($1,000 down / $399/mes).
- [x] Appointment Booking, Human Handover y Auto Followup — confirmado 2026-07-18 que el cliente ya los configuró en la otra PC (multi calendars, 3 escenarios cada uno, asignado a Scarleth Hassiel Rubi).
- [x] Workflow "Rances Car - Ruteo Human Handover por Turno" — reconstruido, guardado, publicado y probado en vivo 2026-07-18 (rama "None" confirmada correcta).
- [x] Contact Info configurado (6 campos, con ejemplos de output) — hecho 2026-07-20.
- [x] Trigger a Workflow configurado — hecho 2026-07-20: no existe "Workflow Crear Oportunidad" separado en Rances Car, se reusa "Workflow Contactado" (ya hace find-or-create de oportunidad) para los 2 triggers del bot.
- [x] Limpiar contacto de prueba Jorge Calderón — hecho 2026-07-20 (contacto eliminado).
- [x] Decidido: "Goodbye Detection" en Stop Bot queda en `Off` — hecho 2026-07-20 (frases pre-cargadas eran despedidas casuales, no opt-out real; activar hubiera contradicho la filosofía de no dejar enfriar leads).
- [x] Investigado el sistema de asignación general (`Workflow Asig Agente (Entrada)`) — hecho 2026-07-20: complementario al Human Handover, no conflictivo; desalineamiento menor de horario (6:45pm vs 5pm) queda como mejora futura.
- [x] Aclarado 2026-07-18: los 193 contactos/2.21h ahorradas con ambos bots en `Off` son solo reporte de tráfico agregado por canal.
- [x] **Set as Primary Bot + Auto Pilot — hecho 2026-07-20. Bot en vivo: `Primary` + `Auto-Pilot`, Facebook/Instagram/WhatsApp/SMS.**

**Pendientes de Rances Car — todos cerrados 2026-07-21:**
- [x] Borrado "Agente Nocturno RancesCar" (confirmado por Jorge antes de ejecutar, irreversible).
- [x] Horario de Scarleth alineado a las 5pm en "Workflow Asig Agente (Entrada)" (antes 6:45pm).
- [x] Promo Tesla / horario de negocio / jerarquía de escalamiento confirmados por Jorge como iguales a Carwarriors LLC.
- Descartado por decisión de Jorge: reportar a soporte GHL el bug de loop (56.4M inscritos) — mismo patrón tampoco reportado en Carwarriors LLC. Rances Car sin pendientes conocidos.

### Lead Sync — GHL → DealerCenter — arquitectura decidida: n8n (2026-07-22)

> [!success] Mecanismo validado end-to-end 2026-07-22
> Se generaron credenciales SFTP reales, se confirmó el DCID de Carwarriors LLC (14031841), y se subió un XML de prueba que se convirtió en un lead real dentro de DealerCenter — confirmando que el camino SFTP + ADF/XML funciona de verdad. Detalle técnico completo (credenciales, hallazgos) en la sección "DealerCenter" y en el historial del 2026-07-22, más arriba en esta misma nota.

**Próximas acciones:**
- [x] ~~Decidir: n8n o Cloudflare Worker~~ → **n8n**.
- [x] ~~Obtener credenciales SFTP de DealerCenter~~ → hecho 2026-07-22.
- [x] ~~Confirmar DCID~~ → 14031841 (Carwarriors LLC).
- [x] ~~Probar con lead real~~ → hecho 2026-07-22, confirmado que llega y se crea correctamente.
- [x] ~~Confirmar con Jorge González si Rances Car/Car Express comparten este DCID o necesitan cuenta propia~~ → Confirmado por Bianca (audio, 2026-07-22): **comparten el mismo DCID**, se distinguen por el campo Lead Source (no por cuenta separada).
- [x] ~~Confirmar qué tag del XML ADF mapea a Lead Type / Lead Source~~ → **RESUELTO 2026-07-23**: `<provider><name>` sin `<service>` = Lead Source exacto; Lead Type no se mapea, queda fijo en "Internet".
- [x] ~~Bloqueador: conseguir acceso a una instancia n8n propia de Carwarriors~~ → **RESUELTO 2026-07-27**: VPS Hostinger + Coolify + n8n desplegados y accesibles. MCP `n8n-carwarriors` conectado 2026-07-28 para gestionarlo directo.
- [ ] Levantar con Jorge/Bianca la tabla completa de valores de Lead Source por campaña/dealer para poder mapearlos en el workflow — **único pendiente real que queda para este módulo**.
- [ ] Construir el workflow real en n8n: trigger de lead nuevo en GHL → armar XML ADF con datos reales (`<provider><name>` = valor exacto de Lead Source, sin `<service>`) → subir por SFTP a DealerCenter. **Nota:** el workflow de captura de leads (GHL+Mongo) ya construido es un módulo distinto — este envío ADF hacia DealerCenter en sí todavía no se ha construido.
- [ ] Monitorear primeras 24h de operación una vez esté en producción.

### Infraestructura n8n propia — VPS Hostinger + Coolify (nuevo, 2026-07-27)

> [!success] Stack desplegado y accesible
> VPS Hostinger KVM1 (`2.24.106.87`) + Coolify v4.1.2 + stack oficial de n8n (n8n + worker + Postgres + Redis). Detalle completo en [[Carwarriors - Infraestructura (Diseño)]].

**Próximas acciones:**
- [ ] Rotar el Location API Key de Carwarriors LLC en GHL (quedó expuesto en el chat de la sesión del 27-jul al crear la credencial `Header Auth GHL`) y actualizar la credencial en n8n con el nuevo valor.
- [ ] Confirmar la URL final de acceso a n8n (dominio sslip.io) y evaluar si conviene mapear un dominio propio.
- [ ] Revisar el firewall del panel de Hostinger (puertos 80/443 entrantes) para que la renovación automática de Let's Encrypt no falle a futuro.
- [ ] Investigar qué es `n8n.apps.carwarriorsllc.com` — instancia n8n real y activa, distinta a la de Hostinger, encontrada 2026-07-28 al revisar el workflow "N8N" de GHL. Jorge confirmó que es suya/del cliente pero no se investigó a fondo qué hace ni quién la administra.

### Agente de Captura de Leads en n8n

> [!success] Construido y activo en producción (2026-07-27), lado de GHL conectado (2026-07-28)
> `Carwarriors - Agente de Captura de Leads (GHL + Mongo)` (ID `6QGLivaPilh09R21`) — recibe leads de GHL, guarda directo los que ya traen teléfono (WhatsApp) y pide el teléfono conversacionalmente a los que no lo traen (Instagram/Messenger), guardando todo en MongoDB Atlas. El webhook de GHL que lo dispara (workflow "N8N" reutilizado, Automation → Agente AI) quedó publicado el 2026-07-28.

**Próximas acciones:**
- [x] ~~Importar el workflow en el n8n del cliente y conectar credenciales~~ → hecho 2026-07-27.
- [x] ~~Crear la automatización en GHL que dispare el webhook hacia n8n~~ → hecho 2026-07-28.
- [x] ~~Validar el payload real de GHL y ajustar el nodo de normalización~~ → parcial 2026-07-28: `message_body` corregido; `channel`/`locationId` siguen sin llegar (aceptado, no bloquea).
- [ ] Probar los dos caminos (WhatsApp directo / Instagram-Messenger con pregunta de teléfono) con **tráfico real** — a la espera de la primera ejecución real desde que se publicó el webhook.

### Otros pendientes
- [ ] Verificar puente WhatsApp → GHL (Ilumos Digital) — ¿activo?
- [ ] Confirmar con el cliente si hoy en día IG/Messenger corren por GHL o por ManyChat (el usuario no está seguro) — de esto depende si el webhook de entrada debe ser de GHL o de ManyChat
- [x] ~~Cliente contrata VPS Hostinger KVM 1~~ → hecho 2026-07-27, ver sección de Infraestructura arriba.
- [ ] Formalizar contrato una vez validadas las pruebas

## Relacionado

- [[Carwarriors - Infraestructura (Diseño)]]
- [[Carwarriors - SFTP DealerCenter (Investigación)]]
- [[Pipeline (MOC)]]
- [[Automatización e IA]]
- [[Carwarriors - Inventario GHL]]
- [[Carwarriors - Agente IA 24-7 (Diseño)]]
- [[Carwarriors - Comportamiento del Bot (Resumen)]]
- [[Carwarriors - Agente IA Rances Car (Diseño)]]
