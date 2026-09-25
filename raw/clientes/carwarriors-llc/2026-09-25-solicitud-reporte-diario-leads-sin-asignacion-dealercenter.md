---
tags: [forjado, cliente, carwarriors, dealercenter, leads, asignacion, bdc, reporte, pendiente]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-25
---

# 2026-09-25 — Solicitud de Jorge: Reporte Diario de Leads en DealerCenter sin Asignación, Notas ni Tasks

## Origen y Solicitud
Jorge González (dueño de Carwarriors LLC) solicitó a Jorge Calderón contar con un **reporte diario automatizado** de los leads cargados en DealerCenter que queden incompletos o sin asignación.

## Problema Detectado
- **Carga manual incompleta en DealerCenter:** Los asesores de ventas o el equipo de BDC ingresan manualmente leads de personas a DealerCenter, pero los dejan sin completar:
  1. No les asignan vendedor (*Sales Rep*) ni representante de BDC (*BDC Rep*).
  2. No les colocan notas descriptivas de la conversación o situación del prospecto.
  3. No les programan actividades/tareas futuras (*Tasks* / *Follow-ups*).
- **Impacto operativo:** Incumple directamente la directiva oficial del SOP de Ventas y BDC de Bianca Cangialosi documentado el 2026-09-24 (*"Lead sin task = cliente perdido"*). Al quedar en el limbo sin asignación ni tarea programada, ningún asesor les da seguimiento y se pierden oportunidades comerciales y presupuesto publicitario.

## Requerimiento y Alcance de la Solución (Pendiente a Implementar)
1. **Generación del Reporte Diario:**
   - Detectar todos los leads creados en las últimas 24h (o acumulados sin cerrar) que presenten:
     - `BDC Rep` o `Sales Rep` en blanco / unassigned.
     - Sin notas registradas.
     - Sin tareas (*tasks*) futuras programadas.
2. **Canal de Entrega:**
   - Envío diario automático (Slack `#notificaciones` o canal dedicado, y/o email/digest a Jorge González).
3. **Mecanismo Técnico a Evaluar en n8n:**
   - **Opción A:** Scheduled Report configurado en DealerCenter (CSV/Excel por email automático a Gmail/n8n) filtrando por leads sin asignar o analizando el reporte diario de actividad.
   - **Opción B:** Scraper o consulta a la API interna de DealerCenter (`CRMCustomReport` / `Customers List`) para extraer la lista de leads del día y auditar estado de asignación, notas y tasks.
   - **Opción C:** Monitoreo y reconciliación cruzada desde la base de datos de MongoDB / Lead Sync.

## Estado
- **Registrado como pendiente prioritario en backlog:** Pendiente definir el mecanismo de ingesta de datos desde DealerCenter y el canal/horario de entrega del reporte diario.
