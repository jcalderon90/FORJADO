---
tags: [forjado, cliente, varela-law]
tipo: cliente
estado: activo
servicio: automatizacion
contacto: Mario Varela
creado: 2026-06-17
actualizado: 2026-06-20
---

# Cliente — Varela Law

## Datos
| Campo | Valor |
|---|---|
| **Empresa** | Varela Law |
| **Representante** | Mario Varela |
| **Sector** | Legal / Bufete de abogados |
| **Servicio principal** | Automatización (n8n) |

## Accesos

> [!warning] Información sensible — no compartir

| Servicio | Acceso |
|---|---|
| **Google** | varelalawremote@gmail.com |
| **Outlook** | automations@varela.law |
| **MyCase (Mario)** | mvarela@varela.law / MyCase.com5 |
| **VPS SSH** | `ssh root@72.60.31.74` |
| **n8n** | https://n8n.srv957125.hstgr.cloud |
| **n8n MCP** | https://n8n.srv957125.hstgr.cloud/mcp-server/http |

## Infraestructura del cliente

| Campo | Valor |
|---|---|
| **Proveedor VPS** | Hostinger |
| **Plan** | KVM 1 |
| **OS** | Ubuntu 24.04 |
| **IPv4** | 72.60.31.74 |
| **Hostname** | srv957125.hstgr.cloud |
| **Ubicación** | United States — Boston |
| **RAM** | 4 GB |
| **Disco** | 50 GB |
| **Bandwidth** | 4 TB |
| **Vigencia** | 2027-08-13 (auto-renovación activa) |
| **Backups** | Semanales, 2 snapshots |

### Servicios corriendo (Docker)
| Contenedor | Puerto | Uso |
|---|---|---|
| root-n8n-1 | 5678 | n8n — automatizaciones |
| root-traefik-1 | 80 / 443 | Reverse proxy (HTTPS) |

## Servicios contratados con FORJADO

> [!todo] Completar con los servicios específicos que se les está brindando.

---

## MyCase API — Integración

### Credenciales OAuth 2.0

> [!warning] Información sensible — no compartir

| Campo | Valor |
|---|---|
| **Client ID** | mVqwv5ZEgiTJcNsY |
| **Client Secret** | AQP5mkisered9z9Bw9iXv4zXLW9MWNt6 |
| **Firm UUID** | 64ef037e-64d7-4437-b664-98683e3ed374 |
| **Token endpoint** | `https://auth.mycase.com/tokens` |
| **API base URL** | `https://external-integrations.mycase.com/v1/` (corregido 2026-07-05 — `app.mycase.com/api/v1` y `app.mycase.com/api/v3` dan 404, no son el host correcto) |
| **Docs** | https://mycaseapi.stoplight.io/docs/mycase-api-documentation/k5xpc4jyhkom7-getting-started |

> [!note] El endpoint correcto es `/tokens`, **no** `/access_tokens` (la documentación antigua era incorrecta).

### Redirect URIs registrados

| Contexto | Redirect URI | Estado |
|---|---|---|
| Postman | `https://oauth.pstmn.io/v1/callback` | ✅ Único registrado por soporte de MyCase |
| ~~n8n (producción)~~ | ~~`https://n8n.srv957125.hstgr.cloud/rest/oauth2-credential/callback`~~ | ❌ Corregido 2026-07-01 — nunca se registró. Soporte de MyCase solo dio de alta el de Postman |

> [!important] Cada redirect_uri debe estar registrado con MyCase soporte. Si se usa una URI no registrada, el exchange falla con `invalid_client`.

> [!warning] Implicación técnica
> Como solo el redirect_uri de Postman está registrado, **no se puede usar la credencial nativa OAuth2 de n8n** (esa maneja su propio redirect_uri interno y requeriría que soporte de MyCase lo registrara). El *authorization_code* inicial siempre debe obtenerse manualmente vía el flujo SSH + browser con el redirect de Postman — ver proceso abajo. Esto confirma que la arquitectura correcta es la ya elegida: **Token estático + [[mycase_token_manager_workflow.json|Token Manager]]** que solo usa `grant_type: refresh_token` (ese grant no requiere redirect_uri). Si el refresh_token se revoca o invalida alguna vez, hay que repetir el proceso manual de abajo para obtener uno nuevo y re-sembrarlo en el Token Manager.

### Scopes disponibles

read/write para: `cases`, `contacts`, `documents`, `events`, `expenses`, `invoices`, `tasks`, `webhooks`, `staff`, `leads`, `messages`, `notes`, `call_log`

### Proceso para obtener un token (manual vía SSH)

Los tokens expiran en **24 horas**. Para renovar:

**1. En el servidor SSH, ejecutar:**
```bash
read -p "Pega el code aqui y Enter: " C && DECODED=$(python3 -c "import urllib.parse; print(urllib.parse.unquote('$C'))") && curl -s -X POST "https://auth.mycase.com/tokens" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"client_id\":\"mVqwv5ZEgiTJcNsY\",\"client_secret\":\"AQP5mkisered9z9Bw9iXv4zXLW9MWNt6\",\"code\":\"$DECODED\",\"grant_type\":\"authorization_code\",\"redirect_uri\":\"https://oauth.pstmn.io/v1/callback\"}"
```

**2. Cuando el terminal muestre el prompt, abrir en browser:**
```
https://auth.mycase.com/login_sessions/new?client_id=mVqwv5ZEgiTJcNsY&redirect_uri=https://oauth.pstmn.io/v1/callback&response_type=code
```

**3.** Login con `mvarela@varela.law`. Cuando redirija, copiar el valor entre `code=` y `&state=` de la URL, y pegarlo en el terminal SSH.

> [!tip] El code expira en ~30 segundos. El terminal debe estar esperando **antes** de hacer login en el browser. No pasar el code por el chat.

**4. Verificar que el token funciona:**
```bash
curl -s "https://app.mycase.com/api/v1/cases" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | head -c 500
```

### Estado de la integración

- [x] OAuth flow exitoso verificado — 2026-06-20
- [x] Token obtenido con scopes completos (read/write)
- [x] Endpoint correcto confirmado: `/tokens`
- [ ] Token Manager en n8n — pendiente de implementar
- [ ] Automatización de renovación de token — pendiente

---

## Datos MyCase API — Prioridades

### Alta prioridad
- **Cases** — centro de todas las automatizaciones; casi todo gira en torno a un caso
- **Time Entries** — registro de tiempo facturable; automatizar evita pérdidas de ingresos
- **Invoices** — conectar tiempo registrado → factura generada automáticamente
- **Leads** — captura y seguimiento de prospectos nuevos

### Media prioridad
- **Tasks** — asignar tareas automáticamente al abrir un caso nuevo
- **Events** — recordatorios de audiencias, fechas límite, citas con clientes
- **Documents** — envío y organización automática de contratos

### Baja prioridad para automatización
- Notes, Message Threads, Staff, Firm — útiles para consulta pero no suelen ser foco de automatizaciones

> La prioridad definitiva depende de qué procesos manuales consumen más tiempo en el día a día del despacho.

---

## Próximos pasos

> [!important] Retomar aquí — pausado 2026-07-06
> **MyCase (auth + integración base): 100% operativo y verificado.** El Token Manager (n8n id `MOpVRrvErCfgs2mn`) refresca tokens end-to-end vía MongoDB (`VarelaLaw.mycase_tokens`) y está publicado en producción. `MyCase INTEGRATION` (id `tGas6W5tfuqBPzwA`) ya usa ese patrón (Execute Workflow → Bearer token). Confirmada corrida automática real del Schedule Trigger (23h) sin disparo manual. Ya no quedan pendientes bloqueantes en este punto. Detalle en [[Varela Law - MyCase API]].
>
> **Radar Billing Automation: en curso, con un hallazgo crítico sin resolver — retomar aquí.** El diagnóstico del 2026-07-06 (comparar CIVIL CASES contra la pestaña TEST, una foto de MyCase de ese mismo día) mostró 97% de cobertura cruzando por Case No. normalizado. Pero al construir el workflow real (`Radar Billing - Join to TEST2`, id `UPrV8mk5weAKswuT`) y traer los cases **en vivo** de MyCase el 2026-07-07 (en vez de usar la foto de TEST), el resultado fue mucho peor: 0 matches por Case No., 32 por nombre, 66 sin match de 98. Causa raíz encontrada pero no resuelta: el caso de "Barbosa, Deiby - EMP" tiene Case No. `2025-89003` en el Sheet y en la foto de TEST de ayer, pero **ese `case_number` ya no existe hoy en MyCase** — el caso vigente de Barbosa tiene `case_number` `25-1291`. Hay que confirmar con la UI de MyCase si `case_number` puede cambiar con el tiempo (lo invalidaría como llave de join) o si son matters distintos del mismo cliente. **No tocar Billing & Payments ni confiar en el contenido actual de TEST2** hasta resolver esto — instrucción explícita del usuario de validar solo en TEST/TEST2 antes de producción. Ver detalle en [[Varela Law - Radar Billing Automation]].
>
> **Pendiente menor:** `N8N_BLOCK_ENV_ACCESS_IN_NODE` sigue activo en el VPS, así que el Token Manager tiene `client_id`/`client_secret` de MyCase hardcodeados en el nodo (no `$env`) — decisión pragmática ya tomada con el usuario, no bloqueante.

- [x] Completar la obtención manual de un token nuevo (flujo SSH + Postman) — 2026-07-02
- [x] Confirmar que el refresh de MyCase funciona end-to-end (probado manualmente en n8n) — 2026-07-02. **Nota:** MyCase rotó el refresh_token en esa prueba; el usado para sembrar quedó invalidado, hay un refresh_token nuevo vigente (solo en el chat/local, no en git)
- [x] Decidir arquitectura de persistencia: **MongoDB** (cluster compartido Atlas, ver [[MongoDB Database]]) en vez de n8n static data — 2026-07-02
- [x] Rediseñar `mycase_token_manager_workflow.json`: reemplazar nodos "Check Stored Token"/"Save New Token"/"Seed inicial" (static data) por nodos MongoDB Find/Update sobre `VarelaLaw.mycase_tokens` — 2026-07-05
- [x] Crear credencial MongoDB en n8n (`Varela Law`, id `UZv1zIWjbmmfIJyv`) y asignarla en los dos nodos Mongo del workflow — 2026-07-05
- [x] Importar el JSON actualizado en n8n, reemplazando la versión vieja — 2026-07-05
- [x] Sembrar el refresh_token vigente en el documento Mongo `VarelaLaw.mycase_tokens` — 2026-07-05, vía Compass
- [x] Corregir bug: el nodo Mongo de n8n castea automáticamente `_id` a `ObjectId`, rompía con nuestro `_id: "token"` (string) — se agregó un campo `key: "token"` como identificador propio para `find`/`update`, evitando `_id` — 2026-07-05
- [x] Probar el workflow completo (ejecución manual vía MCP) — verificado que lee/escribe Mongo correctamente y refresca contra MyCase — 2026-07-05 (ejecución `1915`, éxito)
- [x] Publicar la versión corregida como activa en n8n (antes solo estaba en el draft) — 2026-07-05
- [x] Migrar el workflow "MyCase INTEGRATION" (id `tGas6W5tfuqBPzwA`) al patrón Token Manager (Execute Workflow + Bearer token) — 2026-07-05, verificado con ejecución `1922`. En el camino se corrigió el API base URL real: `https://external-integrations.mycase.com/v1/` (no `app.mycase.com`)
- [x] Confirmar una corrida real del Schedule Trigger (23h) en producción, sin disparo manual — 2026-07-06, verificado vía MCP: ejecución `1972` (2026-07-06T23:00 UTC, `mode: trigger`) completó el ciclo Mongo → refresh MyCase → Mongo con éxito. Todas las corridas automáticas desde la publicación de la versión corregida (2026-07-05) han sido exitosas
- [ ] (Opcional, no bloqueante) Sacar `N8N_BLOCK_ENV_ACCESS_IN_NODE` del VPS para volver a usar env vars en vez de credenciales hardcodeadas en el nodo
- [ ] Hablar con **Adalberto** sobre el sistema automático de contratos
- [ ] **Radar Billing Automation** — revisar con Mario la pestaña TEST (993 casos volcados) y decidir cómo vincularla con "CIVIL CASES"/"Billing & Payments" (ver [[Varela Law - Radar Billing Automation]])
- [ ] **Radar Billing Automation** — Mario describió un procedimiento manual actualizado (2026-07-06) con layout de columnas distinto al ya automatizado en la pestaña TEST; confirmar con él si reemplaza o convive con el volcado de 993 filas, y aclarar la fórmula de Net Trust Balance (ver duda en [[Varela Law - Radar Billing Automation]])
- [ ] Construir workflows funcionales (Cases, Tasks, Time Entries, Events)

---

## Historial
- 2026-06-17 — Registro inicial del cliente
- 2026-06-20 — Mario intentó conectar MyCase API con Postman; llegó hasta el login y autorizó el acceso pero no obtuvo el token (timeout). Se resolvió vía script `read` en SSH; OAuth completado exitosamente; proceso documentado.
- 2026-06-20 — Definidas prioridades de datos MyCase para automatización. Pendiente: hablar con Adalberto sobre sistema de contratos automáticos.
- 2026-06-20 — Identificado proyecto Radar Billing Automation: Mario gasta 2-3h llenando manualmente Google Sheet "Radar - Civil Cases" con datos de MyCase. Documentado flujo y estructura completa para automatizar con n8n.
- 2026-07-01 — Construido workflow **Token Manager** para MyCase (sub-workflow callable, static data como almacén, refresh cada 23h). Ver detalle en [[Varela Law - MyCase API]].
- 2026-07-01 — Corregido dato erróneo: el redirect_uri de n8n **nunca estuvo registrado** con soporte de MyCase — solo el de Postman. Confirma que la arquitectura de token estático + refresh es la única viable (ver advertencia en sección de credenciales).
- 2026-07-01 — Se inició obtención manual de un token nuevo (SSH + Postman) para sembrar el Token Manager. **Pausado a mitad del flujo** — retomar antes de tocar el docker-compose del VPS.
- 2026-07-02 — Completado el flujo manual SSH + Postman: `refresh_token` obtenido y sembrado en el nodo "Seed inicial" de `mycase_token_manager_workflow.json`. Nota técnica: la primera copia desde la consola web (Hostinger) salió corrupta por wrap del terminal; se resolvió generando el token en líneas cortas (`fold -w 50`) y reconstruyéndolo. Falta: env vars en el VPS, importar el workflow en n8n y ejecutar el seed ahí.
- 2026-07-02 — Al probar en n8n, el static data no persistía entre ejecuciones manuales (limitación de n8n: solo persiste en corridas de producción reales, no en "Test step" de un nodo aislado). Se hizo una prueba puente con nodos Set/HTTP directos (sin pasar por static data) y **el refresh de MyCase funcionó correctamente** — confirma que la lógica de auth (client_id/secret + grant refresh_token) es correcta. MyCase rotó el refresh_token en esa prueba. Se decidió migrar la persistencia del Token Manager de n8n static data a **MongoDB** (cluster compartido Atlas) para evitar esta ambigüedad. Pendiente reconstruir el workflow con nodos MongoDB.
- 2026-07-05 — Reconstruido `mycase_token_manager_workflow.json` con nodos MongoDB (`Find Stored Token`, `Save New Token (Mongo)` con upsert) reemplazando los nodos de static data; versión vieja archivada como `mycase_token_manager_workflow.staticdata.bak.json`.
- 2026-07-05 — Sembrado el refresh_token vigente en `VarelaLaw.mycase_tokens` vía Compass. Conectado el MCP server de n8n de Varela Law a Claude Code (`n8n-varelalaw`), lo que permitió inspeccionar y corregir el workflow importado directamente: (1) el import había dejado los nodos Mongo sin credencial asignada y faltaba el nodo "Called by another workflow" (Execute Workflow Trigger) — corregido; (2) bug del nodo Mongo de n8n: castea `_id` a `ObjectId` automáticamente y rompía con nuestro `_id` string — resuelto agregando un campo `key: "token"` como identificador alternativo para `find`/`update`; (3) la instancia de n8n bloquea acceso a `$env` desde expresiones (`N8N_BLOCK_ENV_ACCESS_IN_NODE`) — se decidió hardcodear `client_id`/`client_secret` de MyCase directo en el nodo "Refresh Token (MyCase)" como solución pragmática. Ejecución de prueba `1915` exitosa: ciclo completo Mongo → refresh MyCase → Mongo funcionando end-to-end. Token Manager queda operativo.
- 2026-07-05 — Migrado el workflow `MyCase INTEGRATION` (antes referido como "fixed_mycase_workflow.json", nombre desactualizado) para usar el Token Manager: agregado nodo Execute Workflow al inicio y cambiado el HTTP Request de credencial OAuth2 estática a header `Authorization: Bearer {{ $json.accessToken }}`. En el proceso se descubrió que el API base URL documentado (`app.mycase.com/api/v1` y `/v3`) daba 404 — el host correcto es `https://external-integrations.mycase.com/v1/`. Verificado con ejecución `1922` exitosa. Este es el patrón a repetir para los futuros workflows funcionales (Cases, Tasks, Time Entries, Events).
- 2026-07-06 — Documentado un procedimiento manual actualizado que Mario está siguiendo para llenar la pestaña TEST (columnas A-N: datos de Civil Cases + 6 campos de MyCase Time & Billing Info + 2 fórmulas calculadas), usando la pestaña `07-05-26` como referencia. Layout distinto tanto al de "Billing & Payments" documentado antes como al de la pestaña TEST ya poblada por el workflow automático (993 filas). Quedan dos dudas pendientes de confirmar con Mario: (1) si este procedimiento reemplaza o convive con el volcado automático en TEST, y (2) la fórmula de Net Trust Balance (`G - E - H`) resta una columna de texto ("Resp"), posible desfase de letras. Ver detalle en [[Varela Law - Radar Billing Automation]].
- 2026-07-06 — Verificado vía MCP de n8n que el Schedule Trigger (23h) del Token Manager corre en producción sin disparo manual: revisadas todas las ejecuciones en `mode: trigger` desde el 2026-07-03. Ejecución más reciente `1972` (2026-07-06T23:00 UTC) inspeccionada en detalle — ciclo completo Find Stored Token (Mongo) → detecta expirado → Refresh Token (MyCase) → Save New Token (Mongo) exitoso. Todas las corridas automáticas desde la publicación de la versión corregida (2026-07-05) fueron exitosas (una falla anterior, ejecución `1892` del 2026-07-03, quedó obsoleta por ser previa al rediseño). MyCase (auth + integración base) queda sin pendientes.
- 2026-07-06 — Re-investigado el bloqueante del join de Radar Billing: se construyó un workflow de diagnóstico temporal (leyó CIVIL CASES y TEST en vivo, comparó Case No. normalizado) y se descubrió que la nota anterior ("solo 2 de 84 cruzaron") estaba mal diagnosticada por no normalizar espacios/mayúsculas. Cruzando correctamente: 84 de 99 filas exacto por Case No., +11 por nombre de cliente — 97% de cobertura real. Solo 3 casos genuinamente sin match. Detalle en [[Varela Law - Radar Billing Automation]].
- 2026-07-06/07 — Usuario indicó explícitamente: seguir usando la pestaña TEST para pruebas, y si hace falta otra, crear TEST2 (nomenclatura TEST, TEST2, etc.) — no tocar CIVIL CASES ni Billing & Payments hasta validar todo. Se creó la pestaña **TEST2** (gid `305326864`) y se construyó el workflow real de join **"Radar Billing - Join to TEST2"** (n8n id `UPrV8mk5weAKswuT`) que trae los datos de MyCase en vivo (no desde la foto de TEST) y aplica la regla de join. Al ejecutarlo (ejecución `1977`, exitosa técnicamente) el resultado de matching fue muy inferior al diagnóstico: 0 por Case No., 32 por nombre, 66 sin match de 98. Se investigó un caso concreto (Barbosa, Deiby) y se confirmó que el `case_number` "2025-89003" que aparece en CIVIL CASES y en la foto de TEST del día anterior **ya no existe en MyCase hoy** — el caso vigente de Barbosa tiene `case_number` "25-1291". Sesión interrumpida en este punto para investigar si `case_number` es estable en MyCase o si son matters distintos. **Retomar aquí.** Detalle completo en [[Varela Law - Radar Billing Automation]].

## Relacionado
- [[Pipeline (MOC)]]
- [[Automatización e IA]]
- [[Varela Law - MyCase API]]
