---
tags: [forjado, cliente, varela-law, n8n, zapier, verificacion]
tipo: raw
cliente: Varela Law
fecha: 2026-10-16
---

# Verificación y cierre del día — Varela Law

Solo lectura (n8n `n8n-varela_law` y MCP de Zapier). Pedido de Jorge: "dejemos todo listo de Varela Law".

## Resultado

- **n8n:** 12 ejecuciones desde el 10-15 17:00 UTC, todas `success`; ninguna del `ERROR HANDLER`.
  - Agenda de Deadlines #2829 (10-16 7:00 Miami) y Borrador de Avisos #2831 (8:30) corrieron bien; Radar Billing F/H/J #2826 (3:00 AM) bien; Token Manager cada ~1.5 h.
  - Zelle: #2822–#2825 y #2828, todas `success` (cinco pagos desde el 10-15; no se revisó el detalle de la IA gratis, que ya fallaba por límite de uso).
- **Texto/Zapier:** la conexión `Mario Varela - Mario Varela Law Firm` sigue `is_stale: false` / `is_expired: false`, con último cambio 10-14 19:08 UTC (>40 h sin vencerse; las dos veces anteriores murió a las ~19–20 h). No se probó `Create Lead` (crea un lead real) ni el Zap `383180348` (sigue apagado).

## Lo que NO se pudo cerrar desde aquí

- Rotar el token de bot de `Contract-Bot` (Jorge, en Slack).
- Primer contrato real = prueba de fecha ISO y descarga del PDF.
- Mongo `contracts_log` de Rene Pena y dirección de Tahir Abbas (sin herramienta de escritura).
- Zelle: modelo `:free` con límite de uso; decidir con Mario si quiere la doble verificación (créditos en OpenRouter).
- `LEGAL ASSISTANT` (Victoria): probar mencionándola en Slack.
- Texto: `Test step` del Zap (SMS real, avisar a Mario), plan de Zapier (prueba Professional vence ~10-22), respuesta de soporte de Texto.
- Mario: si el mensaje sugerido del borrador de avisos lo quiere en español, inglés o ambos.
- Docketwise en Zapier sin reconectar.

## Texto: cadena activada y en espera de prueba real (tarde)

- Jorge preguntó por el lead Jairo Rodriguez (10-15 5:38 PM): sin SMS ni conversación en Texto. Causa: el trigger de n8n nunca había corrido (0 ejecuciones desde 10-10 pese a `active: true`); la hoja limpia solo tenía la fila de prueba del 10-11.
- **El Zap `383180348` ya estaba ENCENDIDO** (Zapier: "in use by Mario V. 2 days ago", ~10-14). La nota anterior "borrador apagado" estaba desactualizada; no se sabe quién lo encendió.
- Cambios (autorizados por Jorge): al workflow `zyPZ9H05SA4a3V9s` se le agregó un filtro de fecha (`Date Created` >= 10/15/2026) para no mandar SMS a leads viejos ya contactados a mano si el trigger los reprocesara; republicado, versión activa `3ad40680-c0cc-4626-9b71-81c869fb7830` (antes `c97d124c`).
- Verificación posterior: sin ejecuciones nuevas y hoja limpia sin cambios; Jairo y Margarita Diaz (10-16 10:20 AM) quedaron como base del trigger y **no recibirán SMS: contactarlos a mano**.
- `Test step` del Zap no se hizo (con el Zap encendido, cualquier fila nueva envía SMS real).
- **Prueba pendiente:** Mario llena el formulario web con su celular (`+18327158757`, nombre/apellido reales, sin `test@test.com`); mensaje enviado por Jorge. Esperado en 1-2 min: ejecución n8n + fila en la hoja limpia + SMS + conversación en Texto. Avisar a AL que es prueba.
