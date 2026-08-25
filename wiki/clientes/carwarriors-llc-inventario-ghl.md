---
tags: [forjado, carwarriors, gohighlevel, inventario, automatizacion]
tipo: inventario-tecnico
cliente: Carwarriors LLC
subcuenta: Carwarriors LLC (Location ID DSe5PdPEScZL8cbZTkKI)
creado: 2026-07-09
actualizado: 2026-07-09
fuente: API GHL v1 (Location API Key)
---

# Inventario GHL — Carwarriors LLC

> Registro de todo lo que ya está construido dentro de la subcuenta **Carwarriors LLC** (Location ID `DSe5PdPEScZL8cbZTkKI`). Obtenido vía API v1 de GoHighLevel el 2026-07-09. No incluye el detalle interno de los workflows (pasos/triggers/acciones) porque la API v1/v2 pública no expone esa información — solo metadata (nombre, estado, versión, fechas). Para el detalle paso a paso hay que revisar manualmente en GHL → Automations y complementar aquí.

## Pipelines

### CarWarriors – Venta & Financing (`zgFnnJGURQ5Fp4j1cy6V`)

| # | Etapa |
|---|---|
| 1 | Nuevo Lead |
| 2 | Contactado |
| 3 | Seguimiento |
| 4 | Pre Cita |
| 5 | Agendado Cita |
| 6 | Post Cita |
| 7 | Vendido |
| 8 | Perdido |
| 9 | Lista Negra |

---

## Calendarios (5 activos)

| Nombre | Tipo / Uso | Slot | Horario |
|---|---|---|---|
| **BDC Callback** | Callback telefónico BDC | 30 min | Lun–Sáb 7:00–23:00 |
| **Maria Eleonor Zurita's Personal Calendar** | Calendario personal de asesora | 30 min | Lun–Vie 8:00–17:00 |
| **Showroom — Advisors** | Cita presencial / test drive | 35 min | Lun–Sáb 10:00–19:00 |
| **BDC‑A — Morning & Late (Phone/WhatsApp)** | Turno BDC mañana/noche | 15 min | Dom 9-17, L-S 7-10 y 19-23 |
| **Calendario BDC‑B — Day (Phone/WhatsApp)** | Turno BDC día | 15 min | Lun–Sáb 10:00–19:00 |

Todos con `syncOption: twoway` y confirmación automática (`hasAutoConfirm: true`), notificación con teléfono/email del contacto y links de reagendar/cancelar.

---

## Custom Fields (32 campos en `contact.*`)

Agrupados por función:

**Datos de facturación (Billing Address)**: Full Name, Full Address, City, State, Zip Code, Country, Phone Number.

**Origen del lead / marketing**: `lead_source`, `source_platform`, `Source Label`, `marketplace_source`, `Tipo de Campaña`, `Canal Preferido`, `preferred_channel`.

**Interés / inventario**: `listing_code`, `listing_id`, `listing_title`, `listing_url`, `Stock Number`, `Interes de Vehiculo`, `brand`.

**Calificación del lead**: `Motivo de compra / necesidad principal`, `Tiempo estimado de compra`, `Metodo de Pago`, `Preferred Contact` (checkbox: Call / WhatsApp), `Tiempo Preferido`, `Lenguaje Preferido`.

**IA / interno**: `Resumen AI` (large text), `Notas Internas/Observaciones`, `Adicional Info` (large text), `Notes`, `Agent`, `Nombre de Referencia`.

> [!note]
> Esta estructura de campos ya está bastante madura para calificación de leads automotrices — soporta scoring, IA y atribución de canal/campaña. Antes de crear campos nuevos para los módulos de automatización planeados, revisar esta lista para no duplicar.

---

## Agentes de IA nativos de GHL (Conversation AI)

*(sección distinta de los workflows de Automation — es el módulo "AI Agents → Conversation AI" de GHL, confirmado por captura del 2026-07-09)*

| Agente | Estado | Canales soportados | Última actualización |
|---|---|---|---|
| **Asistente Social CarWarriors** | **Off** | Instagram, Facebook | 2026-07-09, 9:00 AM |
| **Asistente Nocturno CarWarriors** | **Off** | SMS, WhatsApp | 2026-07-09, 9:00 AM |

> [!important] Hallazgo mayor: ya existen 2 agentes de IA conversacional construidos, pero apagados
> GHL avisa: *"Only the primary agent will reply to inbound messages. Make sure your preferred channels are assigned to the primary agent."* — es decir, el sistema espera **un único agente primario por canal**. Aquí hay dos agentes con canales que no se solapan (Social: IG/FB · Nocturno: SMS/WhatsApp), lo cual tiene sentido como diseño, pero **ambos están en Off** — no están respondiendo nada ahora mismo.
>
> La fecha "Last Updated: 9 Jul 2026, 9:00 AM" es **hoy mismo** — alguien tocó esta configuración muy recientemente (podría ser el propio cliente probando, o un timestamp que se actualiza solo). Vale la pena preguntar directamente a Jorge/Karel/Bianca:
> - ¿Por qué están apagados? ¿Se probaron y se desactivaron, o nunca se activaron?
> - ¿Qué prompt/conocimiento tienen cargado (Agent Studio / Knowledge Base)?
> - Esto podría cubrir gran parte del **Módulo D (Marketing Omnicanal)** y **Módulo E (IA Aplicada a Ventas)** del roadmap ya diseñado — antes de construir algo nuevo en n8n, revisar si conviene simplemente activar y afinar esto.

---

## Formularios

| Nombre | ID |
|---|---|
| Markerplace Form | `1XA6GtySJ0f1vnOUWHbY` |

## Campañas / Encuestas / Funnels

- **Campaigns:** ninguna configurada (`[]`).
- **Surveys:** ninguna (`[]`).
- **Funnels:** endpoint no disponible con este token (`Not found`) — puede requerir permisos adicionales o no haber funnels creados. Pendiente de verificar manualmente en GHL → Sites → Funnels.

---

## Workflows de Automatización (23 total)

> Solo metadata vía API (nombre, estado, versión, fechas). El detalle de triggers/acciones requiere revisión manual en GHL → Automations.

### Organización en carpetas (confirmado por capturas de pantalla, 2026-07-09)

GHL → Automation → Workflows agrupa todo en 4 carpetas (creadas 21 Ago 2025, 8:21–8:31 AM, todas el mismo día — sugiere reorganización masiva puntual) + 3 workflows sueltos en raíz.

#### 📁 Agente AI
*(pese al nombre, contiene los flujos de canal WhatsApp/Redes — no un agente de IA como tal; nombre probablemente heredado o mal etiquetado)*

| Workflow | Estado | Total inscritos | Activos | Última actualización | Creado |
|---|---|---|---|---|---|
| N8N | Draft | 535 | **6** | 2026-05-21 | 2026-04-29 |
| Red Social | Published | 4,938 | 1 | 2026-03-17 | 2025-10-18 |
| Whatsapp | Published | 8,520 | 0 | 2026-03-17 | 2026-03-17 |
| Whatsapp-Domingos | Draft | 2,009 | 0 | 2026-03-17 | 2026-03-01 |
| Whatsapp-Normal | Draft | 25,480 | 0 | 2026-03-01 | 2025-10-18 |

> El workflow **"N8N"** (draft) tiene **6 inscritos activos ahora mismo** — no es un experimento abandonado, algo lo sigue alimentando. Prioridad alta para inspeccionar antes de tocar nada de esta carpeta.

#### 📁 Asignacion

| Workflow | Estado | Total inscritos | Activos | Última actualización | Creado |
|---|---|---|---|---|---|
| Asignación por Turno (Control Principal) | Published | **74,061,629** | 550 | 2025-09-17 | 2025-08-02 |
| Reintento de Asignación por Turno | Published | **74,024,916** | 121 | 2025-09-06 | 2025-08-04 |
| Workflow Asig Agente (Entrada) | Published | 15,976 | 0 | 2025-09-17 | 2025-07-22 |
| Workflow Contactado | Published | 6,198 | 0 | 2025-08-21 | 2025-08-09 |

> [!danger] Anomalía a investigar
> **74 millones** de inscritos totales en los dos workflows de asignación por turno es una cifra completamente fuera de escala para el volumen de leads de un dealer (decenas/cientos de leads reales, según el panel de llamadas: ~28 contactos/día). Hipótesis: el trigger se re-dispara en bucle por cada mensaje/evento entrante en vez de una sola vez por contacto/oportunidad (ej. trigger tipo "Customer replied" sin condición de salida, o un loop entre "Asignación" y "Reintento"). Esto puede estar **consumiendo cuota de Workflow Premium Actions y disparando costos** en GHL sin que se note directamente. Antes de construir nada nuevo sobre este flujo, hay que auditar su lógica interna y confirmar si es un bug activo.

#### 📁 Campañas

| Workflow | Estado | Total inscritos | Activos | Última actualización | Creado |
|---|---|---|---|---|---|
| Detect $999 Down Campaign | Published | 41 | 0 | 2025-08-21 | 2025-08-01 |
| Detect Camionetas Campaign | Published | 173 | 0 | 2025-08-21 | 2025-08-01 |
| Detect Cero Down Campaign | Published | 2,384 | 1 | 2025-08-21 | 2025-08-01 |
| Detect General Campaign | Published | 1,068 | 1 | 2025-08-21 | 2025-08-01 |
| Detect Infiniti Campaign | Published | 22 | 0 | 2025-08-21 | 2025-08-01 |
| Detect Trade-In Campaign | Published | 1,776 | 0 | 2025-08-22 | 2025-08-01 |
| Workflow Clasificador de Campaña | Published | 5,989 | 0 | 2025-08-21 | 2025-08-04 |
| WorkflowCampaña Tiktok *(pendiente de confirmar cifra exacta, fila cortada en captura — visto ~40k)* | Published | ~40,086 (a confirmar) | 0 (a confirmar) | 2025-08-21 | 2025-08-05 |

#### 📁 Fuente

| Workflow | Estado | Total inscritos | Activos | Última actualización | Creado |
|---|---|---|---|---|---|
| Workflow Source | Published | 15,051 | 0 | 2025-08-21 | 2025-08-03 |

#### Raíz (fuera de carpetas)

| Workflow | Estado | Total inscritos | Activos | Última actualización |
|---|---|---|---|---|
| Importar Contactos | Published | 13,936 | 0 | 2026-03-10 |
| Reportes | Published | 41,664 | 0 | 2025-09-02 |
| Resolver Token WhatsApp – AutosMiami | Published | 36,180 | 0 | 2025-10-22 |

> [!warning] Ojo con "Needs review (1)"
> La vista muestra una pestaña **"Needs review (1)"** — hay 1 workflow con alguna alerta/problema pendiente en GHL. Falta identificar cuál (posiblemente relacionado con la anomalía de 74M inscritos).

### Enrutamiento y asignación de leads (BDC)
| Workflow | Estado | Versión | Última actualización |
|---|---|---|---|
| Asignación por Turno (Control Principal) | Published | 58 | 2025-09-17 |
| Reintento de Asignación por Turno | Published | 24 | 2025-09-07 |
| Workflow Asig Agente (Entrada) | Published | 23 | 2025-09-17 |
| Workflow Contactado | Published | 9 | 2025-08-21 |
| Workflow Crear Oportunidad | Published | 6 | 2025-08-21 |

### Detección y clasificación de campañas (Meta/Marketplace)
| Workflow | Estado | Versión | Última actualización |
|---|---|---|---|
| Workflow Clasificador de Campaña | Published | 22 | 2025-08-21 |
| Workflow Source | Published | 6 | 2025-08-21 |
| Detect $999 Down Campaign | Published | 13 | 2025-08-21 |
| Detect Cero Down Campaign | Published | 11 | 2025-08-21 |
| Detect General Campaign | Published | 11 | 2025-08-21 |
| Detect Camionetas Campaign | Published | 10 | 2025-08-21 |
| Detect Infiniti Campaign | Published | 9 | 2025-08-21 |
| Detect Trade-In Campaign | Published | 9 | 2025-08-21 |
| WorkflowCampaña Tiktok | Published | 4 | 2025-08-26 |

### Canales de mensajería (WhatsApp / Redes sociales)
| Workflow | Estado | Versión | Última actualización |
|---|---|---|---|
| Whatsapp | Published | 7 | 2026-03-18 |
| Whatsapp-Normal | **Draft** | 12 | 2026-03-01 |
| Whatsapp-Domingos | **Draft** | 4 | 2026-03-17 |
| Resolver Token WhatsApp – AutosMiami | Published | 12 | 2025-10-22 |
| Red Social | Published | 18 | 2026-03-17 |

### Datos y reportes
| Workflow | Estado | Versión | Última actualización |
|---|---|---|---|
| Importar Contactos | Published | 31 | 2026-03-10 |
| Reportes | Published | 6 | 2025-09-03 |
| N8N | **Draft** | 17 | 2026-05-22 |

> [!important] Hallazgo clave
> Ya existe un **sistema de enrutamiento de leads por turnos (BDC)** con reintentos, un **clasificador automático de campañas de Meta/Marketplace** (por tipo de auto, promoción, plataforma) y **flujos de WhatsApp** — construido entre jul 2025 y mar 2026. Esto contradice/matiza la nota en [[Carwarriors LLC]] de que "los flujos de ManyChat solo redirigen tráfico sin guardar datos": a nivel GHL sí hay lógica de clasificación y asignación robusta. Falta confirmar si ManyChat ya dispara estos workflows de GHL (vía webhook nativo o integración) o si hay un salto sin registrar.
>
> El workflow **"N8N"** está en **Draft** — sugiere que ya hubo un intento previo de conectar n8n a este ecosistema GHL que quedó incompleto. Vale la pena inspeccionarlo antes de diseñar la integración n8n desde cero (podría haber mapeos o decisiones ya tomadas).

---

## Pendiente de completar manualmente

- [ ] Preguntar a Jorge/Karel/Bianca por qué "Asistente Social CarWarriors" y "Asistente Nocturno CarWarriors" (AI Agents → Conversation AI) están en **Off** — y revisar su configuración (Agent Studio, Knowledge Base, prompts) antes de diseñar algo nuevo para Módulos D/E del roadmap.
- [ ] **Prioridad alta:** abrir "Asignación por Turno (Control Principal)" y "Reintento de Asignación por Turno" y documentar el trigger de entrada — hay que explicar los 74M de inscritos antes de tocar este flujo.
- [ ] Identificar qué workflow aparece en la pestaña "Needs review (1)".
- [ ] Abrir "N8N" (draft, carpeta Agente AI) para ver qué lo mantiene con 6 inscritos activos — parece un puente vivo hacia n8n, no un experimento muerto.
- [ ] Confirmar cifra exacta de "WorkflowCampaña Tiktok" (fila cortada en la captura de la carpeta Campañas).
- [ ] Detalle paso a paso de cada workflow (triggers, condiciones, acciones) — no accesible por API, requiere abrir cada uno en GHL → Automations y documentar (capturas o descripción).
- [ ] Confirmar existencia/estado de Funnels (Sites) — endpoint API no respondió.
- [ ] Confirmar si ManyChat dispara alguno de estos workflows de GHL directamente.
- [ ] Repetir este inventario para las otras 2 subcuentas del ecosistema (**Car Express Servicess**, **Rances Car**) si se requiere paridad total — actualmente solo se consultó Carwarriors LLC.

## Relacionado

- [[Carwarriors LLC]]
- [[Carwarriors - Infraestructura (Diseño)]]
