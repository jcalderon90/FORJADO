---
tags: [forjado, cliente, varela-law, n8n, agenda, reporte]
tipo: raw
cliente: Varela Law
fecha: 2026-11-14
---

# Agenda: columna Date/Time primero y sin columna Type

Continuación de [[2026-11-05-publicacion-agenda-hora-central]]. Pedido de Mario con captura del correo "Agenda for the next 5 days - Deadlines and hearings": poner **Date/Time en la primera columna** y **quitar la columna Type** ("no es necesaria").

## Cambio aplicado
- Workflow `Radar Billing - Agenda Deadlines y Audiencias (Diario)` (`4QsJaKlmHDhkVtBV`), nodo `Build Report HTML`: encabezado y filas pasaron de `Type | Name | Case | Date/Time | Assigned staff` a **`Date/Time | Name | Case | Assigned staff`**.
- `Filter Upcoming (next 5 days)` sigue emitiendo `type` (ya no se usa en el reporte); no se tocó.
- `Formato Slack` (`#reports`) arma sus líneas desde las celdas de la tabla HTML, así que hereda el nuevo orden sin cambios: `fecha · nombre · caso · staff`.
- Hecho vía MCP `n8n-varela_law` (agregado de nuevo a la config local de esta carpeta; requirió `/mcp` → Authenticate y reiniciar para que aparecieran las herramientas).

## Publicación
- Versión "Agenda: Date/Time primera columna, sin Type" **publicada** con `publish_workflow`. Nueva versión activa: `f1a67506-4add-47cf-a72f-314c4a37466f` (`versionId == activeVersionId`). Lección de [[2026-11-05-publicacion-agenda-hora-central]]: editar deja borrador, hay que publicar.
- Sin ejecución de prueba (enviaría un correo real a Mario).

## Pendientes
- [ ] Primera comprobación real: agenda del lunes 2026-11-16 a las 7:00 AM Chicago (correo y `#reports` con el nuevo orden de columnas). Hoy es sábado, el disparo diario igual corre mañana.
- [x] Mensaje a Mario redactado por Claude y **enviado por Jorge en español el 2026-11-14**.
