---
tags: [forjado, cliente, varela-law, n8n, texto, findmyfirm, google-sheets, leads]
tipo: raw
cliente: Varela Law
fecha: 2026-10-07
---

# Texto + FindMyFirm — Parte 1 construida en n8n (en vez de Zapier)

## Contexto

Mario Varela pidió conectar el Google Sheet que FindMyFirm alimenta con cada lead nuevo del formulario web con **Texto** (https://trytexto.com/, SMS con IA que contacta al prospecto de inmediato y le ofrece evaluación gratuita para agendar cita). Su mensaje pedía hacerlo con **Zapier** (Trigger: Google Sheets → New Spreadsheet Row) y enviar a Texto solo **First Name, Last Name, Phone Number y Email** (sin Message ni Language por ahora). Pidió avisarle al terminar la parte 1; la parte 2 (conectar con Texto + prueba con su número) viene después.

- Sheet: `*a - DON'T DELETE - Lead Export - Varela` (ID `11rhw8svoVOI064scO-hbgASRuJCtO9W7sp6-HphR5w4`), pestaña única `Sheet1` (`gid=0`). Encabezados reales: `Date Created, Time Created, First Name, Last Name, Phone Number, Email, Message, Language`.

## Decisión: n8n en vez de Zapier

Ya existe n8n en el VPS del cliente, así que no se justifica Zapier (suscripción extra, otro sistema que mantener, y su plan gratis revisa cada 15 min, malo para "contactar inmediatamente"). Texto declara aceptar leads "vía webhook o Zapier" (https://trytexto.com/features/integrations/), pero **no publica la URL del webhook ni la autenticación** — hay que pedirlas a Mario/soporte de Texto. Riesgo abierto: si Texto solo tuviera app privada de Zapier y ningún webhook directo, n8n no podría enviarle datos y habría que usar Zapier solo para ese paso.

## Lo construido (parte 1)

Workflow n8n **`Texto - Leads FindMyFirm (Parte 1)`** (`zyPZ9H05SA4a3V9s`, instancia de Varela Law, proyecto personal `varelalawremote@gmail.com`), **sin publicar** (`active: false`):

1. `Nueva fila en Sheet` — `n8n-nodes-base.googleSheetsTrigger`, evento `rowAdded`, polling cada minuto, credencial `Google Sheets Trigger account` (`IuMZWPrlwG9KZeJi`, tipo `googleSheetsTriggerOAuth2Api`; creada por Jorge, la "Google Sheets account" que ya existía no sirve para triggers).
2. `Datos para Texto` — nodo Set que deja solo `First Name`, `Last Name`, `Phone Number`, `Email`.
3. Sticky note con el contexto y la parte 2 pendiente.

Respaldo del JSON: `n8n-workflows/Texto Leads/texto_leads_parte1_workflow.json`.

### Error encontrado y corregido

El trigger falló con `Sheet with ID Sheet1 not found`: en modo `list` el campo `sheetName` espera el **gid** de la pestaña (`gid=0`), no el nombre. Corregido (ver versión "Fix: pestaña Sheet1 por gid").

## Pruebas

- Ejecución 2733 (vía MCP, pin data simulado): mapeo del Set correcto, 4 campos.
- Ejecución 2734 (manual, Jorge desde el editor): el trigger leyó las 5 filas reales del Sheet y el Set devolvió los 4 campos por fila. Los Sheets Trigger no se pueden disparar por MCP y las pruebas manuales no se guardan salvo que se ejecuten desde el editor.

## Hallazgos de calidad de datos (a resolver en parte 2)

1. `Phone Number` llega como **número** sin `+` (`17865486196`) y el Set lo convierte a string sin `+`. Probablemente Texto pida formato `+1...` — confirmar con ellos.
2. Hay leads mal capturados: apellido booleano `true`, mensaje `7`, y una fila de prueba (`Test`, apellido vacío, `test@test.com`). Hay que filtrar/normalizar para que Texto no escriba a contactos inválidos.
3. Al publicar, el trigger solo reaccionará a filas **nuevas**: las 5 existentes no se enviarán a Texto. Si Mario quiere que Texto contacte a los leads de hoy, enviarlos aparte.

## Comunicación

Mensaje enviado a Mario (2026-10-07): avisa de que la parte 1 está lista, que se usó n8n en vez de Zapier (y por qué), que no envía nada a Texto todavía, y pide (1) URL del webhook de Texto + token o acceso al panel (o consultar soporte de Texto), (2) celular de prueba; menciona los dos hallazgos de datos. **Esperando su respuesta.**

## Pendiente

- [ ] Respuesta de Mario: URL/token del webhook de Texto, celular de prueba, y confirmación de que le parece bien n8n en vez de Zapier.
- [ ] Parte 2: nodo HTTP Request a Texto, normalizar teléfono a `+1...`, filtro de leads inválidos, prueba con número propio, luego publicar.
- [ ] Conectar `errorWorkflow` a `ERROR HANDLER` (`mwmapzwppW-NTV4NwOhSq`) antes de publicar, como el resto de workflows del cliente.
- [ ] Decidir si se envían a Texto los leads que ya están en el Sheet.
