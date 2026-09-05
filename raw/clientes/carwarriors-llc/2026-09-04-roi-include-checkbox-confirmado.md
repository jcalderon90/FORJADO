---
tags: [forjado, cliente, carwarriors, dealercenter, roi, verificacion]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Confirmado en vivo: "Include in ROI" excluye la fila del reporte sin borrar la fuente

**Contexto:** continuación de `[[2026-09-02-dealercenter-roi-diagnostico-completo]]`. Jorge preguntó si las categorías legacy sin uso se pueden excluir del reporte ROI sin eliminarlas — no estaba confirmado si el checkbox "Include in ROI" oculta la fila o solo la excluye del cálculo de %.

## Prueba realizada

Login manual asistido (MFA por email, código pasado por Jorge, sin usar "Resend" — sesión marcada como "Trust this browser" para no repetir MFA). En Settings → Customer → Lead Management → Lead Sources and Costs se desmarcó el checkbox **"Include in ROI"** de una categoría de prueba obviamente sin uso (`CW trade intes`) y se guardó con el botón Save.

Se verificó el reporte ROI (`Reports → ROI`, `reportId=-1013`, 243 filas totales) navegando las 5 páginas completas (50 filas c/u) buscando la categoría — **no aparece en ninguna página**. Confirmado también contra la respuesta cruda de la API del reporte (`CRMCustomReport/GetROIReport`) capturada vía DevTools del navegador — la categoría no está en los datos devueltos por el servidor, no es un artefacto de renderizado.

## Conclusión

**Desmarcar "Include in ROI" excluye la fila completa del reporte** (no solo la deja en $0). La fuente en sí no se borra — sigue existiendo en el sistema, solo deja de aparecer/contarse en este reporte específico. Es una acción reversible (checkbox).

## Búsqueda de acción masiva — sin encontrar nada

Se revisó la pantalla de Lead Sources and Costs buscando un checkbox "seleccionar todo" en el encabezado de la tabla o alguna acción de bulk junto a los botones "Add"/"Save" — **no existe**. Cada fila tiene su propio checkbox "Include in ROI" independiente, sin selección múltiple visible. (Un ícono sin etiqueta en el encabezado de esa columna quedó sin explorar — el clasificador de permisos bloqueó el clic exploratorio por ambigüedad; no se insistió.)

## Pendiente real

- [ ] Decidir con Bianca/Jorge González si vale la pena desmarcar "Include in ROI" en las ~230 categorías legacy sin uso para que el reporte quede legible de entrada (identificado como mejora de presentación desde el diagnóstico del 09-02, ahora con el mecanismo confirmado).
- [ ] **No hay acción masiva/bulk disponible en la UI** — hacerlo implica desmarcar ~230 checkboxes uno por uno. Vale la pena confirmar con Jorge si de verdad quieren emprenderlo dado el esfuerzo manual, o si conviene contactar a soporte de DealerCenter para preguntar si existe una vía masiva (API, import, etc.) antes de descartarlo.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-02-dealercenter-roi-diagnostico-completo]]
- [[2026-09-02-bianca-pregunta-conectar-roi-dealercenter]]
