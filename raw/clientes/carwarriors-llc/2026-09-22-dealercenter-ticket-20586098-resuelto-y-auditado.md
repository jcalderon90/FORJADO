---
tags: [forjado, cliente, carwarriors, dealercenter, soporte, lead-assignment, resuelto]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-22
---

# 2026-09-22 — Ticket DealerCenter #TICKET-20586098 Resuelto por Soporte y Auditado en Producción

**Contexto:** DealerCenter notificó vía correo a Jorge Calderón la resolución del ticket de soporte **#20586098** ("Motor de auto-asignación asigna un representante aunque nadie tenga 'Ready for Leads' activo", abierto el 2026-08-28). Se ingresó en vivo a DealerCenter vía navegador automatizado para inspeccionar el ticket y auditar la asignación de leads recientes en producción.

## 1. Verificación del Ticket de Soporte
* **Ubicación:** `DealerCenter → Force → Support → Ticket Details`.
* **Estado:** **`Resolved`** (cambiado desde `Open`).
* **Mensajes:** El equipo de soporte de DealerCenter cerró el caso internamente en backend tras las evidencias técnicas y la lista de teléfonos enviada el 2026-08-29. No dejaron mensajes de texto adicionales en el hilo de soporte.

## 2. Auditoría en Vivo de Leads Recientes (`Detailed Customers`, 21 y 22 de Septiembre)
Se inspeccionó la grilla del reporte de clientes (`Customer Reports → Detailed Customers`) para comprobar si el motor de asignación ya respeta las reglas y roles:

1. **Resolución del problema de Capital One (Dayron Barrizonte):**
   * El reclamo inicial de Bianca indicaba que los leads de Capital One ingresaban asignando a Dayron Barrizonte como BDC Rep (cuando él es Sales Rep), obligando a reasignarlos a mano.
   * **Comprobación en vivo:**
     * Lead `TRAVIS TAYLOR` (`CAPITAL ONE - AUTO NAVIGATOR - SHOPPER`, 09/21/2026): **Sales Rep: DAYRON BARRIZONTE**, **BDC Rep: [Vacío]**.
     * Lead `LYNDSEY REYES` (`CAPITAL ONE - DEALER WEBSITE - SHOPPER`, 09/21/2026): **Sales Rep: JEAN CUE**, **BDC Rep: [Vacío]**.
   * **Resultado:** Los leads de Capital One entran directamente asignados a sus Sales Reps y con el campo BDC Rep vacío, tal como fue configurado el 2026-09-15.

2. **Cese de asignaciones fantasmas hacia Alejandra Roa:**
   * En la auditoría original del 08-29, ~40% de los leads caían indebidamente en Alejandra Roa por fallbacks del motor de auto-asignación.
   * En la auditoría actual de los leads del 21 y 22 de septiembre:
     * `CW TRADE IN` (`FREDDY N,A`) $\rightarrow$ **BDC Rep: Nallely De Leon** (regla exacta).
     * `REFERIDO JOANDRY` (`YELIAN NA`) $\rightarrow$ **BDC Rep: Scarleth Rubi** (regla exacta).
     * `TIKTOK FRAN` $\rightarrow$ **BDC Rep: Fran Rodriguez**.
     * `MAIKOL REFERIDO` $\rightarrow$ **BDC Rep: Maikel Perez**.
     * `FELIPE REFERIDO` / `DANIELA REFERIDO` $\rightarrow$ **BDC Rep: Felipe Caruz**.
   * **Resultado:** Cero desvíos no deseados ni asignaciones cruzadas detectadas.

## 3. Estado de Configuración en DealerCenter
* `Assign leads to reps`: **ON**
* `Do not auto assign leads unless status is New`: **OFF**
* `Assignment Users` (BDC Rep): **Vacío** ("No records available", como se dejó deliberadamente para evitar round-robin forzado).
* `Custom Lead Assignment`: **32 reglas activas** y funcionando con normalidad.

## Conclusión
El ticket **#20586098** queda cerrado formalmente y verificado en producción.
