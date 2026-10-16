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

## Reporte de Mario: lead de las 10:20 AM sin registrar (re-verificación, tarde)

- Mario avisó (captura del Sheet) que Margarita Diaz (10-16 10:20 AM, English, `18328731761`, sin mensaje) no aparecía en Texto. Re-verificado con n8n (historial y ejecuciones) y lectura de ambas hojas por el MCP de Zapier (Sheets, hoja `0`):
  - Hoja origen: Jairo Rodriguez (fila 13) y Margarita Diaz (fila 14) presentes, **sin nota de seguimiento ni fecha en `Contacted`**.
  - Hoja limpia `Texto - Leads limpios para Zapier (FindMyFirm)`: solo la fila de prueba de Mario (10-11).
  - Workflow `zyPZ9H05SA4a3V9s`: una sola versión (`3ad40680`, 10-16 15:31 UTC = 11:31 AM Miami) y 0 ejecuciones automáticas; ambos leads entraron antes de la activación y el trigger de filas nuevas no los ve.
- **Recomendación a Jorge (acordada):** que AL o Mario llamen a los dos a mano, primero Jairo (más de 16 h sin contacto; pide cita por manutención); **no** insertar sus filas en la hoja limpia (enviaría SMS real sin una prueba exitosa del flujo, y duplicaría el contacto manual de AL). El flujo automático queda para los leads nuevos. Mensaje para Mario redactado en la conversación (causa + pedir llamada ya + pedir confirmar que el Zap está encendido).
- No se escribió nada en hojas ni en n8n en esta revisión (solo lectura).
- **Pendiente:** confirmar que Mario/AL contactaron a Jairo y Margarita; revisar el próximo lead real (o la prueba de Mario) en n8n → hoja limpia → SMS → Texto.

## Prueba de Mario sin teléfono: causa encontrada (noche)

- **Síntoma:** Mario llenó el formulario web dos veces (filas 15 y 16 del Sheet origen, 1:13 y 1:20 PM; una tercera en inglés, fila 17, 1:22 PM) con `mvarela@varela.law` y **Phone Number vacío** en la hoja. n8n la descartó correctamente (#2835 y #2836, `success`, salida de "Descartar datos invalidos"). Mario aseguró haber puesto el teléfono (campo obligatorio).
- **Zap `383180348` verificado (navegador, sesión de Mario V. ya abierta):** encendido; sin ejecuciones en 30 días hasta la prueba. Prueba controlada: se agregó a la hoja limpia la fila "Mario Prueba 2" (`+18327158757`, vía MCP Zapier Sheets, autorizado por Jorge) → el Zap corrió a las 2:25 PM, **Successful** (paso 1 Sheets "Found 1 new row", paso 2 Texto "Sent 1 new Lead to Texto"). El SMS en el celular de Mario **no se confirmó**.
- **Formulario:** `https://go.varela.law/` (= `/home`), landing de la firma, Nombre Completo / Teléfono / Correo / Mensaje, redirige a `/gracias`. **Solo acepta el teléfono como `+1XXXXXXXXXX`**: rechazó `(832) 715-8757`, `8327158757` y `18327158757` con "Invalid phone number" (riesgo de perder leads reales).
- **Causa (confirmada con dos pruebas de Jorge/Claude, nombre "Test Claude", enviadas con autorización de Jorge):** la plataforma que exporta a la hoja **reutiliza el contacto existente por correo y conserva su teléfono viejo/vacío**.
  - Prueba 1, `test@test.com` (ya usado el 5-oct con `12042222222`), teléfono `+18327158757` → fila 18 salió con `12042222222`.
  - Prueba 2, correo nuevo `prueba.claude.2@example.com`, mismo teléfono → fila 19 salió con `18327158757`.
  - Mario usó siempre `mvarela@varela.law`, que ya existía sin teléfono.
- **Mensaje enviado por Jorge a Mario:** usar un correo distinto y el teléfono como `+1` + 10 dígitos, sin espacios ni guiones.
- **Efectos colaterales:** filas 18 y 19 del Sheet origen son pruebas ("Test Claude"); n8n las descarta (First Name `Test`, correo de prueba), no se envió SMS. Conviene avisar a AL que las ignore o borrarlas a mano.
- **Pendiente:** que Mario reenvíe con correo nuevo y `+1…`; confirmar fila en hoja limpia → Zap → SMS recibido y conversación en Texto. Decidir si se pide a quien administra la landing que el campo acepte otros formatos de teléfono y si la deduplicación por correo (sin actualizar el teléfono) es esperada.
