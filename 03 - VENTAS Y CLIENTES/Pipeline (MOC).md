---
tags: [forjado, ventas, pipeline, moc]
tipo: moc
estado: activo
creado: 2026-06-17
actualizado: 2026-06-17
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
| _(ejemplo)_ | Automatización | Prospecto | $___ | Enviar mensaje |
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
