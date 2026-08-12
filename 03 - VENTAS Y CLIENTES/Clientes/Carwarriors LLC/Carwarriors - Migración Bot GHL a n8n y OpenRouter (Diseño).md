---
tags: [forjado, carwarriors, n8n, openrouter, ia, agente-conversacional, migracion, spectrum]
tipo: spec
cliente: Carwarriors LLC
creado: 2026-08-12
actualizado: 2026-08-12
estado: en-diseño
---

# Migración del bot conversacional: GHL Conversation AI → n8n + OpenRouter (copia adaptada de Spectrum)

> Decisión tomada en reunión 2026-08-12 con Jorge González (CARWARRIORS LLC). Los bots de GHL Conversation AI documentados en [[Carwarriors - Agente IA 24-7 (Diseño)]] y [[Carwarriors - Agente IA Rances Car (Diseño)]] quedan **deprecados**. La lógica conversacional se reconstruye en n8n copiando y adaptando el sistema de agentes ya construido para el cliente **Spectrum** (proyecto real estate, repo `Garoo/Agent-Spectrum`), usando **OpenRouter** como proveedor de modelos. GoHighLevel se conserva como **CRM y para ciertas automatizaciones** — no se elimina, solo se le quita la capa de IA conversacional nativa (Conversation AI).

## Estado actual (resumen ejecutivo — 2026-08-12)

**Fase: diseño / arranque de migración — nada construido todavía en n8n para este bot.** La decisión y el alcance quedaron cerrados en la reunión; lo que sigue es puramente ejecución. Bloqueadores reales antes de poder escribir el primer workflow: (1) acceso a OpenRouter (depende de Bianca/Jorge González), (2) contenido de la base de conocimiento (depende de Bianca), (3) horarios de asesores por día (depende de Jorge González). Sin esos tres insumos, Jorge Calderón puede avanzar en paralelo con la copia/adaptación estructural del repo Agent-Spectrum (nodos, parametrización por `locationId`, webhook GHL en vez de ManyChat), pero no puede probar el flujo completo end-to-end. **Los bots de GHL Conversation AI siguen activos en producción sin cambios** — no se toca nada de lo ya calibrado en [[Carwarriors - Agente IA 24-7 (Diseño)]] / [[Carwarriors - Agente IA Rances Car (Diseño)]] hasta tener el reemplazo probado. Objetivo de fecha puesto por el cliente: **lunes o martes siguiente (2026-08-17/18)** — ambicioso dado que ninguno de los 3 bloqueadores está resuelto todavía a la fecha de este documento.

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
| `RSVP` | Agenda citas, persistencia progresiva en colección `appointments` | Agenda citas (llamada / virtual / presencial) validando contra los horarios de asesores por día cargados en DealerCenter. Reutiliza el patrón de persistencia progresiva |
| `Send Media` | Envía brochures/renders vía API de ManyChat | Envía PDF/imágenes/video/enlaces vía API de conversaciones de GHL |
| `Sync_CRM` | Scheduled (~15 min), POST a Dynamics 365 SOAP | Aquí el "CRM externo" **es GHL mismo** — este workflow probablemente se simplifica o se fusiona con `Lead Collector`, ya que no hay un segundo CRM SOAP que sincronizar. Revisar si sigue teniendo sentido como workflow separado o si su única función real (mantener GHL actualizado) ya la cubre el resto |
| `Notifications Master` | Emails HTML por evento (nuevo lead, precios, cita, escalación) | Mismo patrón — nuevo lead / escalación / cita, con destinatarios de Carwarriors (Nallely de Leon / Scarleth Hassiel Rubi según subcuenta, ver [[Carwarriors - Comportamiento del Bot (Resumen)]] sección 11 y [[Rances Car - Comportamiento del Bot (Resumen)]] sección 12) |
| `Analytics Centralizado` | Scheduled diario, métricas por usuario vía LLM → Mongo | Reutilizable tal cual, útil para reemplazar el panel roto "Metricas Deeler Center" (ver [[Carwarriors LLC]], sección Integración DealerCenter) |
| `Health Check Conversaciones` | Alerta por email si no hubo conversaciones en 6h | Reutilizable tal cual — cubre el mismo tipo de apagón silencioso que ya afectó a los bots de GHL varias veces |

> [!important] No es un bot nuevo desde cero
> El comportamiento de negocio ya está resuelto y calibrado — ver [[Carwarriors - Comportamiento del Bot (Resumen)]] (secciones 1-13) y su equivalente [[Rances Car - Comportamiento del Bot (Resumen)]]. Esos documentos son la **especificación funcional** que el agente n8n debe igualar o mejorar (calificación de vehículo/ubicación/uso/timing/pago, reglas de escalamiento por 5 niveles, seguimientos automáticos, silencio post hand-off, etc.). El trabajo real es portar esa lógica de negocio dentro de la estructura de `AGENT PRINCIPAL` + sub-workflows de Spectrum, no re-diseñarla.

## Pendientes

**Bloqueadores — insumos externos, sin ellos no se puede probar end-to-end:**
- [ ] Contratar/dar acceso a OpenRouter — *CARWARRIORS LLC (Jorge González) + Bianca*: Jorge González paga la cuenta; Bianca agrega a Jorge Calderón como colaborador
- [ ] Entregar base de conocimiento — *Bianca*: inventario (vehículos, millas, años), políticas, promos; hoy vive en Knowledge Base de GHL, hay que exportarlo/documentarlo para vectorizarlo (mismo patrón que `KBs/*.json` de Spectrum)
- [ ] Horarios de trabajo de los asesores por día — *CARWARRIORS LLC (Jorge González) → Jorge Calderón*: hoy no existen en ningún sistema; Jorge González se los pasa, Jorge Calderón los carga en DealerCenter (por asesor, por día) para que el workflow tipo `RSVP` los lea de ahí

**Trabajo técnico — puede avanzar en paralelo sin esperar los bloqueadores:**
- [ ] Copiar y adaptar el repo Agent-Spectrum al vertical automotriz y a las 2 subcuentas GHL — *Jorge Calderón*: ver tabla de mapeo arriba
- [ ] Elegir modelo(s) en OpenRouter — *Jorge Calderón*: Spectrum ya usa `gpt-5-mini` en su orquestador, punto de partida razonable; ajustar por costo/calidad según volumen de Carwarriors
- [ ] Definir cómo se sincroniza el inventario de DealerCenter hacia el RAG — *Jorge Calderón*: ¿lectura directa por API/SFTP o exportación periódica? No definido en la reunión

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

- ¿El mismo despliegue n8n cubre las 2 subcuentas (Carwarriors LLC + Rances Car) parametrizado por `locationId`, o son 2 despliegues/flujos separados? Ambas ya tienen reglas de negocio parcialmente distintas (asesor de Human Handover, calendarios, promos) — ver sus respectivos [[Carwarriors - Comportamiento del Bot (Resumen)|resúmenes]].
- ¿Car Express Servicess (la 3ra subcuenta del ecosistema) entra en este alcance? No se mencionó en la reunión — no tiene bot construido todavía (ver [[Carwarriors LLC]]).
- Formato exacto en que Bianca va a entregar la base de conocimiento (documento, hoja de cálculo, acceso directo a un sistema).
- Qué pasa con `Sync_CRM` en la adaptación — ¿se simplifica/fusiona con `Lead Collector` dado que GHL ya es el único CRM, sin un segundo sistema SOAP que sincronizar?
- Qué automatizaciones específicas de GHL se mantienen ("ciertas automatizaciones", palabras del cliente) vs. cuáles migran también a n8n — no se detalló una lista.

## Relacionado
- [[Carwarriors LLC]]
- [[Carwarriors - Infraestructura (Diseño)]]
- [[Carwarriors - Agente IA 24-7 (Diseño)]]
- [[Carwarriors - Agente IA Rances Car (Diseño)]]
- [[Carwarriors - Comportamiento del Bot (Resumen)]]
- [[Rances Car - Comportamiento del Bot (Resumen)]]
