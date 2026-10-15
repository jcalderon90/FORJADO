---
tags: [forjado, cliente, varela-law, n8n, revision, contratos, zelle, zapier]
tipo: raw
cliente: Varela Law
fecha: 2026-10-15
---

# Revisión general de Varela Law y arreglo de la fecha de contratos

Pedido de Jorge: "revisemos que todo lo de Varela Law marche bien". Revisión de solo lectura de las ejecuciones de n8n y de Zapier, con dos arreglos al final autorizados por Jorge.

## Acceso al MCP

- `n8n-varela_law` conectaba pero con "tools fetch failed — Request timed out" (el VPS tardaba ~3 s en `/healthz`, que normalmente responde casi al instante; `/` 200 y `/mcp-server/http` 401 sin token, como se espera). Jorge reconectó con `/mcp` y quedó funcionando. Lo mismo con el MCP de Zapier (timeout al inicio, luego reconectado).
- El clasificador de permisos bloqueó una vez las lecturas `get_workflow_version`/`get_workflow_details` justo después de publicar; Jorge volvió a autorizar y se pudo verificar.

## Qué se verificó (ejecuciones del 2026-10-14 al 10-15, 17:00 UTC)

- 21 ejecuciones, todas `success`. Desde el 10-01 el único error es la prueba manual del workflow de Texto el 10-07 (#2731, inactivo). El `ERROR HANDLER` corrió por última vez el 10-06.
- **Agenda de Deadlines (#2817, 10-15 7:00 Miami):** primera corrida con los cambios del 10-14. Correo enviado por Gmail (`SENT`) y publicado en `#reports` (`ok: true`). "Agenda for the next 5 days — 3 event(s)/deadline(s)": docket call de David Reyes (vie 10-16 10:00 AM), trial de Alba Perez (lun 10-19, todo el día) y trial de Jenny Villalobos (lun 10-19 11:00 AM). No se leyó el buzón de Mario, así que el remitente y el contenido final del correo no se vieron.
- **Borrador de Avisos (#2819, 8:30):** corrió bien; 0 facturas nuevas, no mandó nada (esperado).
- **Radar Billing F/H/J (#2814, 3:00 AM):** `success`; el nodo de escritura corrió con montos reales (primera fila: Alvarado, Irma, cobrado $6,263.30, facturado $10,531.80, sin facturar $0). No se contó cuántas filas escribió.
- **Facturas vencidas semanal:** `success` los lunes 10-05 y 10-12.
- **Token Manager de MyCase:** `success` cada ~1.5 h.
- **Zelle:** cuatro pagos reales de Chase desde el 10-14, todos registrados en Mongo, en la pestaña `Oct` del Sheet y con aviso verde en `#notifications`: #2808 Amanda Millan $500, #2809 Aziz Hlal $800, #2813 Jeronima Guzman $500, #2816 Rasheedat Abegbeyo $500. **En las cuatro ejecuciones el modelo gratis de OpenRouter dio `Rate limit reached` en los 3 intentos y el campo `response` quedó vacío**: el pago se registra solo con el regex (confianza alta, por el fix del 10-09), pero la doble verificación regex contra IA no está corriendo. Wells Fargo sigue sin ejecución real posterior al fix.
- **LAW CLERK INCOMING MAILS:** corre cada lunes (10-05 y 10-12), reacciona al correo semanal de Mario; los días sin ejecuciones son normales.
- **LEGAL ASSISTANT** (Slack `@mention` → "Victoria", OpenAI gpt-4o-mini, credencial Slack `VICTORIA`): sin ejecuciones registradas y no ejecutable por MCP. **Sin verificar si funciona.**
- **Zapier:** conectado. Conexión de Texto `Mario Varela - Mario Varela Law Firm` con `is_stale: false` pero `last_refreshed_at` sigue en 10-14 19:08 UTC (22 h sin refrescar a las 17:03 UTC del 10-15; las dos veces anteriores se venció a las ~19–20 h sin refrescarse). No se probó `Create Lead`. La conexión de Docketwise existe pero no se probó (antes devolvía `Not Found`).

## Contratos (`CONTRACTS FROM SLACK`, `jLgZaTceNMLtM9sh`)

- **#2812, Abbas Hussain (10-14 20:05 UTC):** Immigration, tarifa fija $7,000, anticipo $1,500 (los honorarios por hora en 0 son correctos). Contacto, cliente, caso, enlace entre ellos y `contracts_log` en Mongo y fila en el Sheet, con `fecha_contrato` en ISO (`2026-10-14`). Detalle menor: la dirección del contacto (Tahir Abbas) venía vacía en el PDF y la IA le puso la dirección del cliente (en Mongo, `contacts`), contra el "no inventes" del prompt.
- **#2811, Rene Pena (10-14 19:10 UTC):** Family, tarifa fija, anticipo $4,500, PDF escaneado, español. **`fecha_contrato` salió `10/14/2026` (M/D/YYYY)** en `contracts_log` y en el Sheet; el caso en Mongo sí quedó como fecha (`2026-10-14`) porque el `Create Case` la convierte.
- **Causa:** la descripción de `fecha_contrato` en el Structured Output Parser decía "Date in M/D/YYYY format", contradiciendo el prompt v1.10 (ISO). El modelo gratis (`openrouter/free`) obedece uno u otro según la corrida.
- **Hallazgo de seguridad:** el nodo `Download PDF` tenía un token de bot de Slack (`xoxb-…`) escrito a mano en el encabezado `Authorization`, además de la credencial `Contract-Bot API`.

## Qué se cambió (2026-10-15, autorizado por Jorge)

- **Workflow `jLgZaTceNMLtM9sh` publicado** (versión activa `f03c0161-8051-4a46-990a-6dc97eaed4f9`; la anterior es `cd95dd2d-e643-4315-b7f2-046f67dab874`, por si hay que volver con `restore_workflow_version`):
  1. Structured Output Parser: `fecha_contrato` ahora pide `YYYY-MM-DD` ("Never use M/D/YYYY").
  2. `Download PDF`: sin el encabezado `Authorization` escrito a mano; queda solo la credencial `Contract-Bot API` (la misma que ya usa `Get a file`).
  - Verificado después con `get_workflow_details`: versión activa igual al borrador, 36 nodos, trigger de Slack y `errorWorkflow` intactos. **No probado con un contrato real** (el trigger de Slack no se ejecuta por MCP); si falla la descarga del PDF, el `ERROR HANDLER` manda correo a Jorge.
- **Sheet "SLACK CONTRACTS", pestaña `2026`, fila 149 (Rene Pena):** `Fecha Contrato` cambiada de `10/14/2026` a `2026-10-14`, por Zapier (Google Sheets, cuenta `varelalawremote@gmail.com`). Los dos primeros intentos no cambiaron nada visible (Sheets la convertía en fecha real); funcionó al enviarla como texto con apóstrofo. Solo se tocó esa celda.

## Pendientes

- [ ] **Rotar el token de bot de Slack de la app `Contract-Bot`** (lo hace Jorge en Slack): el token viejo sigue válido y quedó además en el historial de versiones del workflow (`cd95dd2d` y anteriores).
- [ ] **Primer contrato nuevo = prueba** de la fecha en ISO y de la descarga del PDF sin el token escrito a mano.
- [ ] `contracts_log` en Mongo: el registro de Rene Pena sigue con `10/14/2026` (sin herramienta de escritura sobre Mongo desde aquí). Dirección de Tahir Abbas en `contacts` con la del cliente (dato inventado por la IA).
- [ ] **Zelle:** la IA gratis está caída por límite de uso en todas las ejecuciones recientes; cambiar a otro modelo `:free` o cargar créditos en OpenRouter si Mario quiere la doble verificación. Los workflows de contratos, LAW CLERK y el parser del Zelle usan el mismo `openrouter/free`.
- [ ] **LEGAL ASSISTANT:** probar mencionando a Victoria en Slack para saber si funciona.
- [ ] **Texto/Zapier:** revisar el 10-16 `last_refreshed_at` de la conexión; plan de Zapier (prueba Professional vence ~10-22); Docketwise sin probar.
- [ ] Wells Fargo sin ejecución real posterior al fix del 10-09.
