---
tags: [forjado, cliente, varela-law, zapier, texto, accesos]
tipo: raw
cliente: Varela Law
fecha: 2026-10-10
---

# Zapier — cuenta gratis creada por Mario, Jorge ya tiene acceso

Continuación de [[2026-10-09-texto-leads-pivote-a-zapier]].

## Qué pasó

- **2026-10-09 (tarde):** Mario Varela mandó los costos de los planes de Zapier y preguntó si crear la cuenta con `varelalawremote@gmail.com` o con `mvarela@varela.law`, y si recibiría muchos correos (ofreció reenviárselos a Jorge). Jorge respondió que, si lo agregaban como colaborador, no hacía falta que Mario recibiera correos, y que abriera una cuenta **free**.
- **2026-10-10:** Jorge dice que **ya entró a la cuenta** que Mario le pasó. No quedó registrado en esta conversación con qué correo se creó la cuenta (`varelalawremote@gmail.com` o `mvarela@varela.law`); confirmarlo antes de anotarlo como dato de acceso. Las credenciales no se guardan aquí.

## Verificación: el plan gratis no permite colaboradores

Búsqueda web (2026-10-10), según la página de precios de Zapier (`zapier.com/pricing`): asientos (seats) **Free = 1**, Professional = 1, Team = 25, Enterprise = ilimitado. Es decir, **agregar un colaborador a una cuenta gratis no es posible**; compartir cuenta requiere el plan Team (listado en ~$69/mes con facturación anual, según una comparación de terceros). Por eso la vía correcta era la que Jorge ya había previsto: entrar con el mismo correo de la cuenta, no invitarse. El plan Free también tiene ~100 tareas/mes (dato de terceros, a confirmar en pantalla).

## Pendiente (sigue de la nota anterior)

- [ ] Conectar el MCP `claude.ai Zapier` a Claude Code (OAuth: lo autoriza Jorge con `/mcp`, no se puede desde la sesión). Hacerlo con la cuenta de Varela Law, no con una personal.
- [ ] Verificar en pantalla si el plan gratis guarda la app Texto (Beta) + un Filter.
- [ ] Celular de prueba de Mario (no activar el Zap sin él).
- [ ] Decidir si se envían los leads ya existentes en el Sheet.

## Confirmación (2026-10-10)

- Jorge confirmó que la cuenta de Zapier está creada con **`mvarela@varela.law`** (no con `varelalawremote@gmail.com`). Resuelve el dato que quedaba por confirmar arriba. Al conectar el MCP de Zapier, autorizar con esta cuenta.

## MCP de Zapier conectado y primera prueba (2026-10-10)

- El MCP `claude.ai Zapier` quedó conectado a la cuenta de Varela Law y expone herramientas (discover/enable/inspect/execute, skills, conexiones).
- **Apps ya habilitadas en la cuenta:** Docketwise (4 acciones: New Contact, Update Contact como lectura; Create/Update Contact como escritura) y NiceJob "Law Office of Mario Varela, PLLC" (11 acciones). **Ni Google Sheets ni Texto están habilitados todavía** — son los que hacen falta para el Zap de leads.
- Skill de onboarding de Zapier ejecutada (`zapier:onboarding`). Prueba de solo lectura: NiceJob `Review Created or Updated` devolvió 20 reseñas de Google (feb 2024 – feb 2025; 19 de 5 estrellas y 1 de 1 estrella; promedio 4.8; 5 sin texto). Es una lectura tipo trigger, así que no necesariamente es el listado completo ni lo más reciente.
- **Docketwise falló:** `New Contact` y `Update Contact` devuelven `The app returned "Not Found"` (probable conexión/permiso o sin datos de muestra; sin diagnosticar). Los datos de clientes no se copian a la bóveda.
- No se ejecutó ninguna acción de escritura ni se creó ningún Zap.

## Google Sheets y Texto habilitados en el MCP (2026-10-10)

- **Texto** (`App229472CLIAPI`, "AI agent to handle incoming leads"; no confundir con "Texto (SMS)", app australiana distinta) habilitado: expone una sola acción de escritura, `lead` (Create Lead): `phoneNumber` obligatorio; `firstName`, `lastName`, `email` opcionales. Coincide con los 4 campos que extrae el workflow n8n.
- **Google Sheets** habilitado con las 29 acciones (lecturas, escrituras y también borrado de filas/hojas/spreadsheets y `_zap_raw_request`). Pendiente decidir si se deshabilitan las destructivas (`delete_*`) y las de escritura que no hagan falta.
- **Ambas apps requieren autenticación** (conectar la cuenta de Google del Sheet de FindMyFirm y la cuenta de Texto): lo autoriza Jorge con el enlace de conexión; aún no hecho. No se ha ejecutado ninguna acción.

## Sheets conectado y lectura del Sheet de FindMyFirm (2026-10-10)

- **Conexión de Sheets:** `varelalawremote@gmail.com` (predeterminada; ve el Sheet de FindMyFirm). Quedó además una conexión duplicada llamada "Google Sheets" que da `Insufficient Permission`: no se usa. **Texto:** la cuenta de trytexto.com es de Mario; la conexión OAuth la debe autorizar él mismo (Zapier es su cuenta, `mvarela@varela.law`). Pendiente.
- **Lectura (solo lectura, A1:Z100 de `Sheet1`):** 1 fila de encabezado + 8 filas de datos (filas 2–9), del 2026-10-05 al 2026-10-10. Datos de clientes no copiados aquí.
- **Columnas:** A Date Created (`M/D/YYYY`), B Time Created, C First Name, D Last Name, E Phone Number, F Email, G Message, H Language. **La columna I no tiene encabezado**: el personal de Varela Law anota ahí el seguimiento manual ("left VM and text offering case eval", iniciales y hora, "WRONG NUMBER"). Seis de las ocho filas ya tienen nota de seguimiento.
- **Hallazgos para el Zap:**
  - Teléfono llega solo con dígitos y el prefijo `1` (11 dígitos, ej. `1XXXXXXXXXX`), sin `+`. Normalizar a `+1XXXXXXXXXX`.
  - 1 fila de prueba (First Name `Test`, correo `test@test.com`, fila 2).
  - 1 fila con `TRUE` como apellido y mensaje de 1 carácter, marcada por el personal como número equivocado (fila 4). Confirma el patrón de leads mal capturados.
  - La fila 9 (2026-10-10, 2:58 AM) es la única sin nota de seguimiento. Los leads llegan a cualquier hora (8:30 PM, 2:58 AM), así que un SMS automático saldría fuera de horario.
  - El personal ya contacta a los leads a mano (llamada + texto). Con Texto activo, el prospecto recibiría doble mensaje, salvo que Mario decida reemplazar el contacto manual.
- No se escribió nada en el Sheet.

## Diseño del Zap dentro de los límites del plan gratis (2026-10-10)

- **Búsqueda web (fuentes de terceros, sin página oficial de Zapier que confirme la tabla actual):** el plan Free permite solo **Zaps de dos pasos (un trigger + una acción)**; Filter, Paths y Formatter y los Zaps multipaso requieren plan de pago (Professional en adelante). Otra fuente más pequeña dice cosas distintas y parece desactualizada. **Verificar en pantalla al armar el Zap.**
- **Consecuencia:** el diseño "Zapier puro" de la nota 2026-10-09 (Sheets → Filter → Texto, más normalizar el teléfono) **no cabe en Free**. Alternativas:
  - **A — Zapier de 2 pasos directo:** trigger Google Sheets `New Spreadsheet Row` → Texto `Create Lead`, sin filtrar ni normalizar. Llegarían a Texto filas de prueba, apellido `TRUE` y teléfonos sin `+` (el Sheet los trae como `1XXXXXXXXXX`). Solo viable si Texto acepta ese formato y a Mario no le importa que pasen los leads malos.
  - **B (recomendada) — n8n limpia, Zapier solo reenvía:** el workflow n8n existente (`zyPZ9H05SA4a3V9s`, ya lee el Sheet cada minuto) filtra (teléfono válido, descarta `Test`/`TRUE`/correo de prueba), normaliza el teléfono a `+1XXXXXXXXXX` y escribe la fila limpia en una hoja aparte, de preferencia un spreadsheet nuevo de Varela Law y no el archivo de FindMyFirm ("DON'T DELETE"). Zapier queda en 2 pasos: `New Spreadsheet Row` de esa hoja limpia → Texto `Create Lead`. Cuesta $0 y mantiene la lógica en n8n, pero sigue el retraso de ~15 min del plan Free (dato de terceros).
  - **C — pagar un plan de Zapier** (Filter + Formatter + revisión más frecuente): descartado por ahora; Jorge pidió no pagar hasta que sea necesario.
- **El MCP de Zapier no tiene herramienta para crear Zaps** (solo ejecutar acciones y guardar skills), así que el Zap se arma a mano en zapier.com con la sesión de `mvarela@varela.law`, sin activarlo hasta tener el celular de prueba de Mario.
- **Decisiones de Mario pendientes:** conectar Texto (OAuth, cuenta suya); celular de prueba; si Texto reemplaza el contacto manual del personal o se suma (riesgo de doble mensaje); envío fuera de horario; qué hacer con el lead de la fila 9 (sin seguimiento).

## Decisión: opción B implementada en n8n (2026-10-10)

- Jorge pidió seguir la recomendación → **opción B** (n8n limpia, Zapier solo reenvía en 2 pasos).
- **Spreadsheet nuevo creado** (vía Zapier, cuenta `varelalawremote@gmail.com`): `Texto - Leads limpios para Zapier (FindMyFirm)`, id `1s6Y7__i0VBexFB6a9xbBEa5Par0GxldjWbp23bqtSLQ`, pestaña `Sheet1` con encabezados `First Name, Last Name, Phone Number, Email, Date Created, Time Created`. Vacío.
- **Workflow n8n** `zyPZ9H05SA4a3V9s` (renombrado `Texto - Leads FindMyFirm a hoja limpia para Zapier`, **sigue sin publicar**, 5 nodos): `Nueva fila en Sheet` → `Datos para Texto` (recorta espacios; normaliza teléfono: 11 dígitos con `1` o 10 dígitos → `+1XXXXXXXXXX`, si no queda vacío; copia fecha/hora) → `Descartar datos invalidos` (Filter: teléfono no vacío, apellido ≠ `TRUE`, nombre ≠ `Test`, correo ≠ `test@test.com`, sin distinguir mayúsculas) → `Hoja limpia para Zapier` (Google Sheets append con `cellFormat: RAW` para que el `+` no se pierda). Credencial de Sheets: `Google Sheets account` (`Iut1j2vQOyWRXKrg`), cuyo proyecto de origen es `varelalawremote@gmail.com` (no verificado que escriba en el spreadsheet nuevo; se comprueba en la primera ejecución).
- **Prueba:** lógica de normalización/filtro probada localmente con 8 casos (incl. la fila de prueba y el apellido `TRUE`): correcta. **El workflow no se pudo ejecutar** desde el MCP (su trigger de Sheets no es ejecutable por MCP) y **no se escribió ninguna fila**, ni real ni de prueba.
- **Sigue pendiente:** Mario conecta Texto (OAuth); celular de prueba; decisiones de Mario (doble mensaje, horario, fila 9); armar el Zap de 2 pasos en zapier.com (`New Spreadsheet Row` de la hoja limpia → Texto `Create Lead`) **sin activarlo**; publicar el workflow n8n solo cuando todo lo anterior esté listo. Decidir además si se deshabilitan las acciones de borrado de Sheets en el MCP de Zapier.

## Prueba del workflow, recorte del MCP y mensaje a Mario (2026-10-10)

- **Prueba n8n (ejecución 2753, `test_workflow` con datos ficticios, sin datos reales):** `Datos para Texto` y `Descartar datos invalidos` se ejecutan de verdad; los nodos con credenciales (trigger y escritura en Sheets) van simulados. De 5 filas ficticias pasaron 2 (una con teléfono de 11 dígitos → `+1...`, otra con `(555) 555-0102` → `+1...`) y se descartaron 3 (nombre `Test`/correo de prueba, apellido `TRUE`, teléfono corto). **Limitación:** esta prueba no escribe en la hoja ni valida la credencial de escritura; eso solo se confirma en la primera ejecución real (con el workflow publicado). No se hizo ninguna escritura.
- **MCP de Zapier, Google Sheets recortado:** se deshabilitaron 19 acciones (borrado de filas/hojas, `_zap_raw_request`, formato, orden, copia, creación de hojas/spreadsheets, renombrar, validación, `add_row_top`, `add_row_lines`, `update_row_lines`, `add_column`, `change_sheet_properties`). Quedan solo lecturas (`find_many_rows`, `find_spreadsheet`, `find_worksheet`, `get_data_range`, `get_many_rows`, `get_row_by_id`, `get_spreadsheet_by_id`, `lookup_row`) más `add_row` y `update_row`. Se pueden volver a habilitar con `enable_zapier_action`.
- **Mensaje redactado para Mario (no enviado):** [[mensajes/mensaje-mario-2026-10-10-texto-zapier-pasos-y-decisiones.txt]] — conectar Texto, celular de prueba y las tres decisiones (doble mensaje, horario, fila 9).

## Intento de conexión de Texto y seguimiento (2026-10-10)

- Mario intentó conectar Texto desde el celular (enlace abierto desde WhatsApp): la pantalla "Connect to Zapier" de Texto se quedó en "Connecting...". Verificado con `list_zapier_connections` (incluidas las compartidas): **Texto sigue con 0 conexiones**. Hipótesis (no comprobada): el navegador interno de WhatsApp perdió la sesión de Zapier.
- Se le pidió repetirlo desde computadora o Safari/Chrome con la sesión de Zapier (`mvarela@varela.law`) iniciada; alternativa si falla otra vez: hacer el OAuth desde dentro de zapier.com al crear el Zap.
- **Mensaje enviado a Mario por Jorge (2026-10-10):** [[mensajes/mensaje-mario-2026-10-10-texto-zapier-pasos-y-decisiones.txt]]. Esperando su respuesta (conexión de Texto, celular de prueba, decisiones a/b/c).

## Docketwise: diagnóstico (2026-10-10)

- La conexión de Docketwise en esta cuenta de Zapier es **antigua**: creada 2022-04-05, última renovación 2022-10-02; Zapier no la marca como obsoleta (`is_stale: false`). Las lecturas `New Contact` y `Update Contact` devuelven `The app returned "Not Found"`. **Causa no confirmada**; la hipótesis más probable es que la autorización caducó o ya no corresponde a la cuenta actual de Docketwise.
- **Arreglo propuesto:** reconectar con el enlace de reconexión de la conexión (requiere que Mario, o quien tenga el acceso a Docketwise, inicie sesión y autorice). No bloquea el proyecto de Texto.

## Respuesta de Mario sobre la conexión de Texto (2026-10-10)

- Mario respondió que no cerró la pantalla, que **no recibió mensaje de éxito**, pero que se abrió la página "Welcome to Texto!", y que todo lo hizo **desde su celular**; volverá a intentarlo desde su PC más tarde. Revisado de nuevo con `list_zapier_connections`: **Texto sigue con 0 conexiones**. Interpretación (no confirmada): el login en Texto funcionó pero el paso final que devuelve la autorización a Zapier no se completó en el navegador del celular.
- Plan: reintento desde PC con la sesión de Zapier (`mvarela@varela.law`) ya abierta; si falla, conectar Texto desde dentro de zapier.com al crear el Zap.
