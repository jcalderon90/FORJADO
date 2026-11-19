---
tags: [forjado, ventas, oferta, inmobiliarias, retainer]
tipo: oferta
estado: borrador
servicio: automatizacion-e-ia
creado: 2026-11-10
actualizado: 2026-11-19
---

# Oferta — Pack Inmobiliario (FORJADO)

> [!info] Contexto
> Nace de la pausa de Carwarriors LLC (2026-11-09, −$200/mes). Es una oferta **plantilla** para inmobiliarias y desarrolladoras **nuevas** de habla hispana (Norte, Centro y Sudamérica), apoyada en la experiencia de FORJADO y de Jorge en RedTec/Garoo. Los clientes actuales de RedTec **no** son prospectos de FORJADO. Precios base: [[../finanzas/modelo-de-precios]]. Pipeline: [[pipeline]]. Plan de prospección: [[prospeccion-hispanoamerica]].

## Qué es

Un retainer mensual que cubre lo que una inmobiliaria suele tener sin resolver alrededor de su captación de leads: medición, seguimiento y presencia propia.

## Qué incluye ($250/mes)

| # | Módulo | Qué resuelve | Cómo se entrega |
|---|---|---|---|
| 1 | **Agente de WhatsApp** (calificar, agendar, derivar al asesor) | Leads sin respuesta fuera de horario | n8n + modelo de IA, mismo patrón probado en producción |
| 2 | **Reporte semanal automático** | El dueño no ve leads, citas y conversión de un vistazo | n8n → resumen por correo/WhatsApp cada lunes |
| 3 | **Vigilancia de leads** | Leads que se pierden entre el CRM y el sistema de ventas | Auditoría periódica + alerta al equipo si hay discrepancia |
| 4 | **Una pieza mensual** | Falta presencia propia por proyecto | Landing/micrositio de proyecto o set de contenido |

Extras bajo cotización: showroom interactivo por proyecto, campañas de captación, control horario del equipo de ventas ([[../productos/time-control]]).

## Precio

| Concepto | Valor |
|---|---|
| Retainer | **$250/mes** (retainer mínimo vigente) |
| Cobro | Por adelantado cada mes |
| Arranque | Primer módulo funcionando y visto por el cliente antes del primer cobro (criterio de la propuesta CW-001) |
| Alta inicial | A definir por módulo 1 (agente), ver [[../servicios/automatizacion-e-ia]] |

Con 1 cliente se recupera lo de Carwarriors; con 2 se supera.

## Regla sobre RedTec/Garoo

- Los clientes de RedTec no se contactan desde FORJADO. No se copian sus datos ni documentación a esta bóveda.
- Lo que FORJADO usa de la experiencia en RedTec es el **método** (arquitectura de agentes, flujos), no los datos ni la marca de esas cuentas.
- Antes de usar cualquier caso de RedTec como referencia pública, confirmar con Garoo.

## Pendientes

- [ ] Decidir el alta inicial del agente de WhatsApp.
- [ ] Preparar demo: un reporte semanal con datos ficticios.
- [ ] Pedir a Carwarriors permiso para usarlos como caso de éxito.

## Extras y Upsells Visuales 3D / IA (Auditoría 2026-11-19)

Basado en los referentes auditados en `C:\Users\Jorge\Desktop\imgs\` (ver [[../recursos/catalogo-referencias-multimedia]]), podemos ofrecer una escalera clara de extras de alto margen sobre el retainer base ($250/mes):

| Nivel | Qué entregamos | Stack / Referente | Rango / Posicionamiento |
|---|---|---|---|
| **Nivel 1 — Maqueta 3D Caminable** | `recorrido.html` en un solo link por propiedad (minimapa, joystick móvil, ficha + WhatsApp, opcional modo *Antes/Después* remodelación o *Tour guiado 90s*) | Claude + Three.js single-file (`Método 1` y `Método 2`) | Extra puntual accesible frente a renders de estudio (`Estudio Lat`: ~$175/vista 360° o ~$1,665 pack) |
| **Nivel 2 — Renders 3D Cutaway y Clips IA** | Planta 3D fotorrealista amoblada/habitada desde plano 2D + reel de construcción desde terreno vacío / plano | `VizMaker` + `AI-Houses.com` (`Seedream 5.0 Pro`, generar sin texto alucinado) + `Gemini Omni Flash` | Pieza mensual premium o paquete de lanzamiento de proyecto |
| **Nivel 3 — Walkthrough Fotorrealista** | Video recorrido interior sin alucinaciones espaciales desde plano 2D | `Claude + Blender 5.1.1` (greybox + cámara 1.5m) + `Seedance 2.5` (`higgsfield-generate`, driving video + locked stills) | Spot principal de preventa |
| **Nivel 4 — Showroom Web Interactivo** | Exterior 3D/renders (`Day/Golden/Night`), planta con semáforo de disponibilidad en vivo, ficha + WhatsApp, mapa radios `1/3/5 KM` (ideal compradores en el exterior), tour 360° con vista real de dron | `Paraíso del Urubó` + `Navigo Web` + `ALTURA Miami` + `StreamSpatial` (3DGS desde dron `0:37`) | Proyectos high-ticket **$1,500 – $3,500+ USD** |

- **Táctica de prospección en frío (Prompt 7/7):** Construir primero **1 recorrido/showroom demo gratis** a partir de un plano público de la constructora/inmobiliaria y abrir el mensaje con ese link directo antes de ofrecer el catálogo completo.

## Relacionado
- [[pipeline]]
- [[prospeccion-hispanoamerica]]
- [[../servicios/automatizacion-e-ia]]
- [[../recursos/catalogo-referencias-multimedia]]
