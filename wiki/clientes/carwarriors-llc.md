---
tags: [forjado, cliente, carwarriors, gohighlevel, automatizacion, automotive]
tipo: cliente
estado: activo
servicio: automatizacion
estado_comercial: migracion-arquitectura-en-curso
contacto: Jorge González (dueño) / Bianca Cangialosi (marketing)
creado: 2026-06-18
actualizado: 2026-08-26
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
3. **Lead Sync GHL ↔ DealerCenter** en producción en ambas subcuentas (SFTP + ADF/XML).
4. **DealerCenter**: fuente del inventario/fotos/políticas (vía Excel diario a Gmail) y de la auto-asignación de BDC Rep por Lead Source (Custom Lead Assignment, 31 reglas cargadas 2026-08-25).

Documentos de referencia relacionados: [[carwarriors-llc-infraestructura]] · [[carwarriors-llc-inventario-ghl]] · [[carwarriors-llc-sftp-dealercenter]] · [[carwarriors-llc-como-funciona-bot-sync]] · [[carwarriors-llc-como-habla-el-bot]] · [[carwarriors-llc-comportamiento-bot]] · [[carwarriors-llc-comportamiento-bot-rances]] · [[carwarriors-llc-guardrail-anti-spam]] · [[carwarriors-llc-propuesta-formal]] · [[carwarriors-llc-justificacion-infraestructura]] · [[carwarriors-llc-agente-ia-24-7]] (legacy, bots viejos de GHL) · [[carwarriors-llc-agente-ia-rances-car]] (legacy).

## Pendientes abiertos (al 2026-08-26)

- [ ] **Esperando a Bianca** — mensaje enviado 2026-08-26 con el diagnóstico completo del reporte de leads mal asignados: no son las 30 reglas de Custom Lead Assignment (verificadas, coinciden con su mapeo), es un bug de DealerCenter — el motor de round-robin auto-asigna un BDC rep igual aunque su propio log diga "There was no BDC rep ready for leads during automatic assignment". Recomendado escalarlo a soporte de DealerCenter con esa evidencia; mitigación disponible (toggle "Do not auto assign leads unless status is New", hoy apagado) sin aplicar todavía. **No avanzar más en esto hasta que responda.** Detalle: [[../../raw/clientes/carwarriors-llc/carwarriors-llc-source-2026-08-25|raw]] y memoria `project_carwarriors-dealercenter-ready-for-leads-bug-2026-08-26`.
- [ ] **Esperando a Bianca** — confirmar si su queja de "Team Inbox vacío con 500 sin leer" (2026-08-24) quedó resuelta limpiando el filtro de su sesión (diagnóstico: no era un bug del sistema).
- [ ] **Esperando a Jorge González** — decidir si quiere un reporte guardado en DealerCenter (Customer List: BDC Rep vacío + Status New) para no filtrar a mano cada mañana. No construir hasta que confirme.
- [ ] Explorar si el Knowledge Base del bot nativo de GHL (Conversation AI) sirve como fuente reusable para el KB real del bot n8n — idea de Jorge, sin explorar (requeriría Playwright+CDP contra Bot Training).
- [ ] Automatizar la cadencia de re-contacto saliente del playbook BDC (llamar 0-2 min, insistir 5-8 veces/48h) — no cubierta por nada hoy, identificado como gap, no bloqueante.
- [ ] Decisión de Jorge de cuándo apagar del todo los bots viejos de GHL Conversation AI (siguen en paralelo, ya sin tráfico real desde la migración).
- [ ] Avisar a contabilidad del cambio de gasto (sale GHL Conversation AI, entra OpenRouter).
- [ ] WhatsApp Messaging sigue sin contratar en GHL ($10/mes) — Jorge dijo explícitamente que no es prioridad. No bloquea IG/FB/SMS.
- [ ] Formalizar contrato una vez validadas las pruebas (sin fecha).

## Resueltos recientes (contexto, no acción)

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
