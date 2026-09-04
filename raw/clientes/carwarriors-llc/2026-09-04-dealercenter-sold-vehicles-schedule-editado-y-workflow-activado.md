---
tags: [forjado, cliente, carwarriors, dealercenter, n8n, reporte-ventas, automatizacion]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Reporte mensual de ventas retail: DealerCenter "Sold Vehicles" + workflow n8n activados de punta a punta

**Contexto:** continuación directa de [[2026-09-04-dealercenter-tercer-intento-playwright-sin-resultado]]. Jorge confirmó que ya tenía acceso manual a DealerCenter (`jcalderon90` / `Carwarriors100@`) y pidió intentar el login por Playwright de nuevo reusando esa sesión, y luego pidió explícitamente automatizar todo el pendiente del reporte mensual de ventas retail sin depender de nadie más.

## Login por Playwright — esta vez funcionó

Usando el perfil persistente ya existente (`~/.claude/playwright-profiles/dealercenter`, de sesiones previas), el login con usuario+password pasó sin el 403 de WAF visto antes. En el MFA, Jorge pidió cambiar a método Email en vez de SMS (mismo camino que había fallado 2 veces el 09-03). Esta vez **sí funcionó sin el loop de Auth0** — se aceptó el código de 6 dígitos sin resetear a la pantalla de login. No hay certeza de por qué esta vez sí funcionó (¿timing?, ¿algo cambió del lado de Auth0?) — no se investigó la causa, solo se registra que el mismo camino (Email, sin Resend) esta vez no tuvo el bug. Se aceptó también el diálogo "Trust this browser?" que apareció después del login.

## Hallazgo: DealerCenter ya tenía el reporte nativo necesario

Bajo **Reports → Schedules** existe un schedule llamado **"Sold Vehicles"** (módulo Inventory, tipo System), ya activo desde el 2026-05-22, mensual el día 1 a la 1:00 AM, con **Sold Date = "Previous month"** (o sea, el envío del día 1 siempre trae los datos del mes anterior completo). Antes de este cambio, su único recipiente era `jjgccuba@gmail.com` (Jorge González), con filtro **Sale Type = ALL**.

Columnas confirmadas en vivo al correr el reporte: `Date Sold`, `Stock #`, `Vehicle` (string "Año Marca Modelo Trim"), `Vin`, `Color`, `Odometer`, `Days On Lot`, `Sale Type`, `Vehicle Cost`, `Total Cost`, `Selling Price`, `Vehicle Gross`, `Deal Gross`, `Net Profit`, `Deal Type` (valores reales vistos: `FINANCE`, `BHPH`), `Sold Status` (ej. `SOLD - CONTRACT IN TRANSIT`, `SOLD - BHPH`), `Deal Number`, `Customer Name`.

El filtro **Sale Type** en el builder del reporte tiene 4 opciones: `ALL`, `Retail`, `Wholesale`, `Both`. Probado en vivo: filtrando a `Retail` sobre los datos del mes en curso, los 9 resultados no cambiaron (las 9 ventas de septiembre hasta ahora son todas retail) — confirma que el filtro funciona sin romper nada, aunque no se pudo confirmar con certeza si un caso real de wholesale/BHPH queda excluido por este filtro específico (ver guardrail agregado abajo por las dudas).

## Cambios aplicados en DealerCenter (schedule "Sold Vehicles")

1. **Recipiente agregado**: `jcalderon900610@gmail.com` (Jorge Calderón) vía el botón "Add User" del diálogo "Schedule Info". DealerCenter avisó con un diálogo de confirmación ("This user does not have permission to view some of the fields in the report. Do you still want to include this user?") — aceptado con "Yes"; no se investigó qué columnas exactamente le faltan a ese usuario, no debería importar para el caso de uso (solo se necesitan unidades por marca/modelo, no los campos de costo). Jorge González se mantuvo como recipiente, sin quitarlo.
2. **Filtro Sale Type cambiado de ALL a Retail**. Nota técnica: el primer intento de guardar dejó "ALL" + "Retail" seleccionados juntos (el dropdown es multi-select con chips, y clickear "Retail" con "ALL" ya seleccionado los deja ambos activos en vez de reemplazar) — se detectó reabriendo el diálogo después de guardar y se corrigió deseleccionando "ALL" explícitamente, guardado de nuevo, y reverificado que quedó solo `RETAIL`. **Lección para el futuro**: al cambiar este tipo de filtro multi-select en DealerCenter, siempre reabrir y verificar el valor persistido, no asumir que el primer guardado quedó limpio.
3. Subject del email confirmado: `"Sold Vehicles"` (texto plano, sin fecha ni sufijo).

No se tocó el campo Deal Type (se dejó en ALL) — la exclusión de BHPH/Wholesale se blindó del lado del Code node de n8n en vez de depender 100% del filtro Sale Type de DealerCenter, cuya semántica exacta frente a BHPH no se pudo confirmar con un caso real (no hubo ninguna venta BHPH en el set de prueba filtrado).

## Cambios aplicados en n8n (`DealerCenter -> Slack (Reporte Mensual Ventas Retail)`, id `31dHApU2tl76cG4B`)

Workflow esqueleto ya existente desde [[2026-09-03-workflow-reporte-mensual-ventas-slack]] (inactivo, con asunto placeholder y columnas asumidas). Actualizado con datos reales:

- **Gmail Trigger** (`FORJADO Sales Report Email`): filtro cambiado de placeholder a `subject:"Sold Vehicles" has:attachment`. Usa la misma credencial Gmail (`jcalderon900610@gmail.com`) que ya usan otros triggers de FORJADO Lead Sync/Inventory Sync — mismo buzón donde ahora también llega este reporte.
- **Code node** (`Agregar Ventas por Marca-Modelo`): reescrito con las columnas reales. `ANCHOR_HEADERS` para detectar la fila de encabezados real dentro del Excel: `['Deal Number', 'Stock #', 'Vehicle']` (antes eran nombres inventados que no existen en el reporte real). `VEHICLE_FIELD` corregido a `'Vehicle'` (antes `'Sold Vehicle'`, no existe). Se agregó un guardrail explícito: excluye filas donde `Deal Type` sea `BHPH` o `WHOLESALE`, además de lo que ya filtre el schedule por Sale Type=Retail — doble seguro para cumplir "excluye wholesale/BHPH" tal como lo pidió Jorge González. La etiqueta del mes en el mensaje de Slack se ajustó a "mes anterior" (`$now.minus({months:1})`) ya que el schedule trae Sold Date = Previous month.
- **Sticky note** actualizado explicando que el bloqueante quedó resuelto y cómo.
- Descripción del workflow actualizada (ya no dice "placeholder").
- **Workflow activado** (`active: true`), verificado byte a byte en la versión activa (`activeVersionId` coincide con el código nuevo en los 3 nodos tocados).

## Pendiente real

- [ ] **Confirmar con el primer envío real (1 de octubre de 2026)** que el parseo funciona correctamente contra el Excel real que DealerCenter genera — no hay forma de simularlo antes sin esperar esa fecha (el schedule no se puede disparar manualmente desde aquí).
- [ ] Sigue sin definir con Jorge González si el reporte debe mostrar unidades, dólares, o ambos — por ahora el workflow solo cuenta unidades por marca-modelo, tal como estaba planteado el 09-01.
- [ ] No se confirmó con un caso real si el filtro `Sale Type = Retail` de DealerCenter excluye BHPH por sí solo (no hubo ninguna venta BHPH en la ventana de prueba) — el guardrail de `Deal Type` en el Code node cubre esto de todos modos, así que no es bloqueante, pero vale la pena revisarlo si algún mes aparece una venta BHPH en el reporte y ver si ya venía excluida o si el guardrail fue el que la filtró.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-04-dealercenter-tercer-intento-playwright-sin-resultado]]
- [[2026-09-03-dealercenter-cuenta-bloqueada]]
- [[2026-09-03-workflow-reporte-mensual-ventas-slack]]
- [[2026-09-01-pedido-reporte-mensual-ventas-retail-por-modelo]]
