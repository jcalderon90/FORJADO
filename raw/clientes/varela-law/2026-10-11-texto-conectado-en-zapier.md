---
tags: [forjado, cliente, varela-law, zapier, texto, conexion]
tipo: raw
cliente: Varela Law
fecha: 2026-10-11
---

# Texto conectado en Zapier (cuenta de Mario)

Continuación de [[2026-10-10-zapier-cuenta-gratis-acceso-y-limite-colaboradores]] (sección "Respuesta de Mario sobre la conexión de Texto").

## Qué pasó

- **2026-10-11:** Mario reintentó la conexión de Texto (la nota anterior dejaba hipótesis de que el navegador del celular no devolvía la autorización a Zapier) y le pasó a Jorge una captura de la página **Connections** de Zapier. Se ve la conexión **`Mario Varela - Mario Varela Law Firm`**, app **Texto 1.1.2**, estado **Connected**, "Last modified: 7 seconds ago", **0 Zaps**.
- La misma lista muestra las otras conexiones de la cuenta: Google Sheets (`varelalawremote@gmail.com`, 1 día atrás), NiceJob "Law Office of Mario Varela, PLLC" (2025-05-22) y Docketwise (2022-10-02), todas "Connected", con 0 Zaps. Docketwise y NiceJob muestran el botón "Test connection".

## Verificación (MCP de Zapier)

- `list_zapier_connections` para Texto (`App229472CLIAPI`, incluidas las compartidas) devuelve **1 conexión**: `02bce20a-b517-831f-9463-70e35f39d36c`, título `Mario Varela - Mario Varela Law Firm`, `is_stale: false`, creada **2026-10-12 00:21:12 UTC** (equivale a la tarde-noche del 2026-10-11 en EE. UU.), no compartida. Coincide con la captura. Antes de esto Texto tenía 0 conexiones.
- No se ejecutó ninguna acción de Texto ni se creó ningún Zap. Aún no se probó que `Create Lead` funcione con esta conexión.

## Estado de los pendientes

- [x] Conectar Texto (OAuth, cuenta de Mario) — hecho.
- [ ] Celular de prueba de Mario (no activar el Zap sin él).
- [ ] Decisiones de Mario: (a) Texto reemplaza o se suma al contacto manual del personal (riesgo de doble mensaje); (b) envío fuera de horario; (c) qué hacer con el lead de la fila 9 (2026-10-10, 2:58 AM, sin seguimiento). Sin respuesta registrada todavía.
- [ ] Armar en zapier.com el Zap de 2 pasos (`New Spreadsheet Row` de `Texto - Leads limpios para Zapier (FindMyFirm)` → Texto `Create Lead`) **sin activarlo**; verificar en pantalla que el plan Free guarda Texto (Beta).
- [ ] Publicar el workflow n8n `zyPZ9H05SA4a3V9s` solo cuando lo anterior esté listo (su escritura en la hoja limpia sigue sin verificarse con una ejecución real).
- [ ] Opcional: reconectar Docketwise (conexión de 2022, devuelve "Not Found"); no bloquea Texto.
