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
| **API base URL** | `https://app.mycase.com/api/v1/` |
| **Docs** | https://mycaseapi.stoplight.io/docs/mycase-api-documentation/k5xpc4jyhkom7-getting-started |

> [!note] El endpoint correcto es `/tokens`, **no** `/access_tokens` (la documentación antigua era incorrecta).

### Redirect URIs registrados

| Contexto | Redirect URI |
|---|---|
| Postman (pruebas manuales) | `https://oauth.pstmn.io/v1/callback` |
| n8n (producción) | `https://n8n.srv957125.hstgr.cloud/rest/oauth2-credential/callback` |

> [!important] Cada redirect_uri debe estar registrado con MyCase soporte. Si se usa una URI no registrada, el exchange falla con `invalid_client`.

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

- [ ] Hablar con **Adalberto** sobre el sistema automático de contratos
- [ ] **Radar Billing Automation** — automatizar llenado de pestaña Billing & Payments en Google Sheet (ver [[Varela Law - Radar Billing Automation]])
- [ ] Token Manager en n8n — automatizar renovación del access token
- [ ] Construir workflows funcionales (Cases, Tasks, Time Entries, Events)

---

## Historial
- 2026-06-17 — Registro inicial del cliente
- 2026-06-20 — Mario intentó conectar MyCase API con Postman; llegó hasta el login y autorizó el acceso pero no obtuvo el token (timeout). Se resolvió vía script `read` en SSH; OAuth completado exitosamente; proceso documentado.
- 2026-06-20 — Definidas prioridades de datos MyCase para automatización. Pendiente: hablar con Adalberto sobre sistema de contratos automáticos.
- 2026-06-20 — Identificado proyecto Radar Billing Automation: Mario gasta 2-3h llenando manualmente Google Sheet "Radar - Civil Cases" con datos de MyCase. Documentado flujo y estructura completa para automatizar con n8n.

## Relacionado
- [[Pipeline (MOC)]]
- [[Automatización e IA]]
- [[Varela Law - MyCase API]]
