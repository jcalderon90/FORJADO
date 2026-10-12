---
tags: [forjado, cliente, varela-law, zapier, texto, decisiones]
tipo: raw
cliente: Varela Law
fecha: 2026-10-11
---

# Texto: respuestas de Mario (celular de prueba y decisiones)

Continuación de [[2026-10-11-texto-conectado-en-zapier]]. Responde al mensaje [[mensajes/mensaje-mario-2026-10-10-texto-zapier-pasos-y-decisiones.txt]]. Texto literal de Mario en [[mensajes/respuesta-mario-2026-10-11-texto-celular-y-decisiones.txt]].

## Qué respondió Mario (2026-10-11)

| Punto | Respuesta de Mario | Cómo se interpreta |
|---|---|---|
| Celular de prueba | `832-715-8757` (el suyo) | Formato para Texto: `+18327158757`. Es el número a usar en la prueba de `Create Lead`. |
| (a) Reemplazar o sumar al contacto manual | No responde directo; dice que no le preocupa que reciban 2 mensajes | **Se suma** al contacto del equipo (doble mensaje aceptado). Es una interpretación de lo que escribió, no una elección explícita. |
| Pregunta nueva: ¿Texto puede escribir en el Google Sheet que ya se envió el mensaje? | Pregunta si es posible; aclara que no es crítico | **Sin respuesta técnica todavía.** Texto no tiene API ni webhook de leads según su soporte, y el Zap de 2 pasos del plan Free es de un solo sentido (Sheet → Texto). No se sabe si la app de Zapier de Texto ofrece un disparador "mensaje enviado"; habría que mirarlo en pantalla o preguntar a soporte. |
| (b) Envío fuera de horario | "A cualquier hora está bien"; ha llenado formularios a medianoche y recibió un texto en 1-2 minutos, buena impresión | **Enviar a cualquier hora**, sin ventana horaria. El consentimiento para SMS sigue siendo decisión de Mario. |
| (c) Lead de la fila 9 (2026-10-10, 2:58 AM) | "Albert puede llamar al lead de la fila 9" | **Lo contacta el equipo a mano (Albert); no se envía a Texto.** Coincide con el valor por defecto: solo se envían leads posteriores a la activación. |

## Estado de los pendientes

- [x] Celular de prueba — recibido (`+18327158757`, de Mario).
- [x] Decisiones (a), (b), (c) — respondidas (ver tabla).
- [ ] Probar `Create Lead` con ese celular (no se ha ejecutado nada de Texto todavía).
- [ ] Armar en zapier.com el Zap de 2 pasos (`New Spreadsheet Row` de `Texto - Leads limpios para Zapier (FindMyFirm)` → Texto `Create Lead`) sin activarlo; verificar en pantalla que el plan Free guarda Texto (Beta).
- [ ] Revisar si Texto ofrece algún disparador o forma de devolver "mensaje enviado" a la hoja (pregunta de Mario); si no, avisarle que no es posible por ahora.
- [ ] Publicar el workflow n8n `zyPZ9H05SA4a3V9s` al final; su primera ejecución real valida la escritura en la hoja limpia.
- [ ] Opcional: reconectar Docketwise (no bloquea Texto).

## Verificación posterior (2026-10-11): ¿la app de Texto en Zapier tiene algo para devolver "enviado" a la hoja?

- `discover_zapier_actions` (búsqueda "Texto") muestra la app `Texto` (`App229472CLIAPI`) con **1 acción de lectura y 1 de escritura, 0 de búsqueda**. La de escritura es `Create Lead`; la de lectura no se identificó (el MCP solo tiene habilitada `Create Lead`, y no se habilitó nada más).
- Por tanto, **no está confirmado** que exista un disparador útil (por ejemplo "mensaje enviado") ni qué devuelve. Con un Zap de 2 pasos de plan Free tampoco cabría un tercer paso que escriba en la hoja. Para responderle a Mario hay que mirar el catálogo de disparadores de Texto en el editor de Zapier o preguntar a soporte. No se ejecutó ninguna acción.

## Prueba de `Create Lead` por MCP (2026-10-11)

- Jorge aprobó la prueba tras recomendarle avisar antes a Mario (se le redactó el aviso; no consta en esta sesión que lo haya enviado, solo que dio la orden de ejecutar).
- Primer intento sin `connection_id`: error "No default connection is set for Texto" (la conexión existe pero no es la predeterminada del MCP). No se cambió la configuración predeterminada.
- Segundo intento con `connection_id` `02bce20a-b517-831f-9463-70e35f39d36c`, `texto_create_lead`, parámetros `phoneNumber` `+18327158757`, `firstName` `Mario`, `lastName` `Prueba`: respuesta `{"results":[{"success":true,"isSampleData":false}]}`. Texto no devolvió id de lead ni datos del mensaje.
- **Pendiente de confirmar:** que a Mario le llegó el SMS, cuánto tardó y qué decía. Hasta que lo confirme, "éxito" solo significa que Zapier/Texto aceptaron la creación del lead.
