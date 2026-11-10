---
tags: [forjado, ventas, pipeline, moc]
tipo: moc
estado: activo
creado: 2026-06-17
actualizado: 2026-11-10
---

# Pipeline de Ventas — FORJADO

> [!info] Cómo usar
> Crea una nota por cada prospecto/cliente en la carpeta `Clientes/` usando la plantilla `_templates/Plantilla — Cliente`. Cambia su campo `estado` y aparecerá en la etapa correcta (con Dataview activado).

## Etapas

| Etapa | Qué significa | Acción siguiente |
|---|---|---|
| **Prospecto** | Posible cliente identificado | Contactar |
| **Contactado** | Ya hubo primer contacto | Agendar llamada / diagnóstico |
| **Propuesta** | Propuesta enviada | Dar seguimiento |
| **Cerrado** | Aceptó, por arrancar | Onboarding (ver [[Procesos y Entrega]]) |
| **Activo** | Proyecto en curso | Ejecutar y entregar |
| **Ganado / Perdido** | Resultado final | Registrar aprendizaje |

---

## Tablero (manual por ahora)

| Cliente | Servicio | Etapa | Valor estimado | Próximo paso |
|---|---|---|---|---|
| All Print | Calibre PRO (Control Horario y Auditoría) | Activo (Piloto 60d) | $4/usuario/mes (~$40-$60/mes) | Despliegue de Calibre-Setup-1.2.9.exe y alta de organización en Cienfuegos; ver [[../../clientes/all-print]] |
| Carwarriors LLC | Automatización + IA (bot n8n + OpenRouter, Lead Sync GHL↔DealerCenter) | Perdido (pausa del cliente, 2026-11-09) | $200/mes (perdido) | Decidir si se pausan bot, sync SFTP y alertas; exportar respaldo de MongoDB; ver [[../../clientes/carwarriors-llc]] |
| Varela Law | Automatización n8n (Radar Billing MyCase → Sheets) | Activo | $80/mes | Enviar mensaje a Mario + confirmar 4 clientes pendientes de ID MAP |
| Rogers México | Automatización + IA (Bot WhatsApp calificador CP + Agenda CDMX) | Propuesta | _(por cotizar)_ | Llamada de 10 min para alinear Fase 1 y acordar fee |

---

## Tablero automático (Dataview)

> Activa el plugin **Dataview** y descomenta:

%%
```dataview
TABLE servicio AS "Servicio", estado AS "Etapa", valor AS "Valor", proximo_paso AS "Próximo paso"
FROM "FORJADO/03 - VENTAS Y CLIENTES/Clientes"
WHERE tipo = "cliente"
SORT estado ASC
```
%%

---

## Relacionado
- [[🏠 FORJADO — Panel (MOC)]]
- [[Catálogo de Servicios (MOC)]]
- [[Procesos y Entrega]]
- Plantillas: `_templates/Plantilla — Cliente`, `_templates/Plantilla — Propuesta`
