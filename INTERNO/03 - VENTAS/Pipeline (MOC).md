---
tags: [forjado, ventas, pipeline, moc]
tipo: moc
estado: activo
creado: 2026-06-17
actualizado: 2026-08-15
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
| Carwarriors LLC | Automatización + IA (bot n8n + OpenRouter, Lead Sync GHL↔DealerCenter) | Propuesta | _(por formalizar)_ | Cargar saldo en OpenRouter + entregar KB real y fotos de inventario para ir a producción |
| Varela Law | Automatización n8n (Radar Billing MyCase → Sheets) | Activo | $80/mes | Enviar mensaje a Mario + confirmar 4 clientes pendientes de ID MAP |
|  |  |  |  |  |

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
