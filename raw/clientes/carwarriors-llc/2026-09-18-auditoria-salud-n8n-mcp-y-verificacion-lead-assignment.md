---
tags: [forjado, cliente, carwarriors, n8n, mcp, dealercenter, lead-assignment, chequeo-salud]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-18
---

# 2026-09-18 — Conexión MCP n8n, chequeo de salud general de 18 workflows y verificación de Lead Assignment en DealerCenter

## 1. Conexión y Setup de MCP n8n
- Configurado el servidor MCP de **n8n** vía HTTP con autenticación OAuth en Antigravity (`mcp_config.json`).
- Se diagnosticó y resolvió el error de rate limit (429) en el endpoint `/mcp-oauth/register` de n8n al eliminar la entrada duplicada `n8n-carwarriors`.
- Verificada la conexión en vivo con 18 workflows expuestos y operando con herramientas nativas de MCP (`search_workflows`, `search_workflow_executions`, etc.).

## 2. Chequeo de Salud General de los Sistemas Carwarriors
Auditoría completa de ejecuciones en la instancia de n8n:
- **0 errores en toda la instancia en los últimos 8 días** (último fallo registrado el 2026-09-10 19:35 UTC, ya resuelto).
- **Más de 1.700 ejecuciones exitosas consecutivas**.
- Verificación de workflows clave hoy (2026-09-18):
  - `PRINCIPAL` (Chatbot Carwarriors): Múltiples ejecuciones exitosas (09:42, 09:44, 09:47, 09:48, 09:50 UTC).
  - `PRINCIPAL - Rances Car`: Ejecutado a las 11:14 UTC con éxito.
  - `SEGUIMIENTO SALIENTE - Intento 1 (CW)`: Ejecutándose puntualmente cada 15 minutos sin fallos.
  - `COMENTARIOS-MANYCHAT`: Ejecutado exitosamente a las 13:52 UTC.
  - `DealerCenter -> Mongo -> GHL (Lead Sync)`: Ejecución diaria a las 12:30 UTC exitosa (260 registros procesados).
  - `Subir a DealerCenter`: Lote de sincronización de inventario ejecutado con éxito a las 12:31 UTC.
  - `VECTORIZAR - KB`: Ejecutado hoy a las 05:30 UTC con éxito.

## 3. Verificación de Lead Assignment (Indicación de Bianca)
Se analizaron los datos reales del reporte exportado de DealerCenter (`FORJADO Lead Sync` en ejecuciones #7108 del 16-Sep y #7421 del 18-Sep):
1. **Capital One $\rightarrow$ Dayron Barrizonte (`Barrizonte1996`):**
   - Confirmado: Ninguno de los 4 asesores anteriores (`Alejandra Roa`, `Scarleth Rubi`, `Nallely De Leon`, `Carlos Samuel Aguilar`) recibe leads de Capital One.
   - Leads de Capital One ingresan directamente asignados a Dayron Barrizonte (ej. ID `4F1CD3CA`, `A0DAE314`, `70DBAB8B`).
   - Dayron acumula 16 leads activos asignados en DealerCenter.
2. **OfferUp $\rightarrow$ Carlos Martínez (`Carlos4125`):**
   - Confirmado: En el reporte posterior a la creación de la Regla 32 (ejecución #7108), se verificaron 12 leads de OfferUp asignados a Carlos Martínez (`33EF3A8E`, `37F96218`, `52DAF697`, etc.).
   - En el reporte de hoy, Carlos Martínez tiene 7 leads activos asignados.
   - Nota técnica sobre leads `NEW`: Los leads recién ingresados en estado `NEW` mantienen el campo de vendedor en blanco hasta que el BDC o el sistema realiza el primer contacto y transición de estado.

## 4. Estado General
Todos los sistemas documentados y reglas de asignación se encuentran operando correctamente y en estado estable.
