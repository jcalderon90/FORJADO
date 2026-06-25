---
tags: [forjado, varela-law, api, mycase, documentacion]
tipo: referencia-tecnica
cliente: Varela Law
creado: 2026-06-20
actualizado: 2026-06-20
---

# MyCase API — Documentación Técnica

> Referencia técnica para la integración de MyCase con los workflows de Varela Law.
> Ver credenciales y estado en [[Varela Law]].

---

## ¿Qué es MyCase?

Software de gestión legal (Legal Practice Management). Su API permite gestionar casos, clientes, documentos, facturación, tareas, eventos y más desde sistemas externos.

---

## Autenticación — OAuth 2.0 Authorization Code

Solo soporta este flujo. No hay API key directa.

### Paso 1 — Obtener authorization code

```
GET https://auth.mycase.com/login_sessions/new
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=YOUR_REDIRECT_URI
  &response_type=code
  &state=OPTIONAL_VALUE    ← protección CSRF (recomendado)
```

### Paso 2 — Exchange code por access token

> [!warning] La documentación oficial dice `/access_tokens` pero el endpoint real es `/tokens`

```
POST https://auth.mycase.com/tokens
Content-Type: application/json

{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "code": "AUTHORIZATION_CODE",
  "grant_type": "authorization_code",
  "redirect_uri": "YOUR_REDIRECT_URI"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "scope": "GRANTED_SCOPES",
  "refresh_token": "TOKEN_VALUE",
  "expires_in": 86400,
  "firm_uuid": "FIRM_UUID"
}
```

### Paso 3 — Usar el token

```
Authorization: Bearer TOKEN_VALUE
```

### Paso 4 — Renovar con refresh token

```
POST https://auth.mycase.com/tokens
Content-Type: application/json

{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "refresh_token": "TOKEN_VALUE",
  "grant_type": "refresh_token"
}
```

### Ciclo de vida del token

| Token | Duración |
|---|---|
| **Access token** | 24 horas (86400 segundos) |
| **Refresh token** | No expira (salvo revocación) |

> El `firm_uuid` en la respuesta identifica el despacho. Importante para integraciones multi-tenant.

---

## Endpoints disponibles

**Base URL:** `https://external-integrations.mycase.com`

### Calls (Llamadas)
- `GET` /calls
- `POST` /calls
- `PUT` /calls/{id}
- `DELETE` /calls/{id}

### Cases (Casos)
- `GET` /cases
- `POST` /cases
- `GET` /cases/{id}
- `PUT` /cases/{id}
- `DELETE` /cases/{id}
- `GET` /clients/{clientId}/cases
- `POST` /cases/{id}/client_relationships
- `POST` /cases/{id}/company_relationships
- `POST` /cases/{id}/staff_relationships

### Case Roles & Stages
- `GET` /case_roles
- `GET` /case_stages
- `POST` /case_stages
- `PUT` /case_stages/{id}
- `DELETE` /case_stages/{id}

### Clients / People (Clientes)
- `GET` /people
- `POST` /people
- `GET` /people/{id}
- `PUT` /people/{id}
- `DELETE` /people/{id}

### Companies (Empresas)
- `GET` /companies
- `POST` /companies
- `GET` /companies/{id}
- `PUT` /companies/{id}
- `DELETE` /companies/{id}
- `POST` /companies/{id}/client_relationships

### Custom Fields (Campos personalizados)
- `GET` /custom_fields
- `POST` /custom_fields
- `GET` /custom_fields/{id}
- `DELETE` /custom_fields/{id}
- `GET` /custom_fields/{id}/list_options
- `POST` /custom_fields/{id}/list_options
- `PUT` /custom_fields/{id}/list_options/{optionId}
- `DELETE` /custom_fields/{id}/list_options/{optionId}

### Documents & Folders (Documentos y Carpetas)
- `GET` /documents
- `POST` /documents — crear Firm Document
- `GET` /cases/{id}/documents
- `POST` /cases/{id}/documents — subir documento (`multipart/form-data`)
- `GET` /documents/{id}
- `PUT` /documents/{id}
- `DELETE` /documents/{id}
- `GET` /documents/{id}/versions
- `POST` /documents/{id}/versions
- `GET` /documents/{id}/download
- `GET` /documents/{id}/versions/{versionId}/download
- `DELETE` /documents/{id}/versions/{versionId}
- `GET` /folders
- `GET` /folders/{id}/subfolders
- `GET` /cases/{id}/documents_folder
- `POST` /cases/{id}/documents_folder/subfolders

### Events (Eventos / Calendario)
- `GET` /events
- `POST` /events
- `PUT` /events/{id}
- `DELETE` /events/{id}
- `POST` /events/{id}/staff_relationships

### Expenses & Invoices (Gastos y Facturas)
- `GET` /expenses
- `POST` /expenses
- `GET` /expenses/{id}
- `DELETE` /expenses/{id}
- `GET` /invoices
- `DELETE` /invoices/{id}
- `POST` /invoices/{id}/payments
- `GET` /invoice_payments

### Notes (Notas)
- `GET` /notes/{id}
- `PUT` /notes/{id}
- `DELETE` /notes/{id}
- `GET` /cases/{id}/notes
- `POST` /cases/{id}/notes
- `GET` /clients/{id}/notes
- `POST` /clients/{id}/notes
- `POST` /companies/{id}/notes

### Tasks (Tareas)
- `GET` /tasks
- `POST` /tasks
- `PUT` /tasks/{id}
- `DELETE` /tasks/{id}
- `POST` /tasks/{id}/staff_relationships

### Time Entries (Registro de Tiempo)
- `GET` /time_entries
- `POST` /time_entries
- `GET` /time_entries/{id}
- `DELETE` /time_entries/{id}

### Message Threads (Mensajería)
- `POST` /message_threads
- `POST` /cases/{id}/message_threads
- `GET` /clients/{id}/message_threads
- `POST` /message_threads/{id}/messages

### Firm, Staff & Locations
- `GET` /firm
- `GET` /staff
- `GET` /staff/{id}
- `GET` /staff/current
- `GET` /locations
- `POST` /locations
- `PUT` /locations/{id}
- `DELETE` /locations/{id}

### Leads, Groups & Practice Areas
- `GET` /leads
- `POST` /leads
- `GET` /leads/{id}
- `PUT` /leads/{id}
- `GET` /people_groups
- `POST` /people_groups
- `PUT` /people_groups/{id}
- `DELETE` /people_groups/{id}
- `GET` /practice_areas
- `POST` /practice_areas
- `PUT` /practice_areas/{id}
- `DELETE` /practice_areas/{id}
- `GET` /referral_sources
- `POST` /referral_sources

### Webhooks
- `GET` /webhooks
- `POST` /webhooks
- `DELETE` /webhooks/{id}

---

## Paginación

Parámetros: `page` y `per_page`. Importante al iterar sobre listas grandes en n8n.

---

## Webhooks

Usar `POST /webhooks` para suscribir el webhook de n8n a eventos de MyCase — evita hacer polling constante desde n8n.

---

## Consideraciones y limitaciones

- **OAuth obligatorio** — no hay API key simple; siempre requiere flujo de autorización inicial con login del usuario
- **Credenciales por soporte** — `client_id` / `client_secret` solo se obtienen contactando a MyCase support, no hay autoservicio
- **Endpoint incorrecto en docs** — la documentación dice `/access_tokens` pero el endpoint real es `/tokens`
- **Sin sandbox** — no hay entorno de pruebas; todas las llamadas van a producción real
- **Sin facturación avanzada** — no hay endpoints para reportes complejos o billing avanzado
- **Timestamps** — manejo específico de zonas horarias; probablemente UTC con conversión necesaria según el despacho

---

---

## Automatización en n8n — Arquitectura

> Conversación inicial: 2026-04-09. Sistema externo a conectar: por definir.

### Scope definido

Recursos de MyCase a automatizar: **Cases, Tasks, Time Entries, Events**
Firma: una sola (single-tenant, un `firm_uuid`)

### Problema central: OAuth en n8n

MyCase no tiene nodo nativo en n8n. El flujo Authorization Code Grant requiere que un usuario abra un browser, haga login y apruebe el acceso — n8n no puede hacer eso solo.

**Opciones evaluadas:**

| Opción | Descripción | Decisión |
|---|---|---|
| **A — Token estático** | OAuth manual una vez; access + refresh token guardados en n8n Credentials; workflow los refresca cada 24h | **Elegida** — suficiente para una sola firma |
| **B — Servidor OAuth intermediario** | Node.js/Express maneja el flujo OAuth completo y entrega tokens a n8n | Más robusto para multi-tenant; descartada por ahora |

### Arquitectura: 2 capas

**Capa 1 — Token Manager (1 workflow)**
- Se ejecuta cada 23h
- Llama a `POST https://auth.mycase.com/tokens` con `grant_type: refresh_token`
- Guarda el nuevo `access_token` en n8n Credentials (o variable de entorno)

**Capa 2 — Workflows funcionales**
- Un workflow por dominio (Cases, Tasks, Time Entries, Events)
- Todos usan HTTP Request nodes con el token disponible desde Capa 1
- Independientes entre sí, comparten la lógica de autenticación

### Notas técnicas para implementación en n8n

1. **Credencial OAuth2**: No hay nodo nativo de MyCase. Usar **HTTP Request** + credencial tipo **OAuth2 API**. Configurar `auth.mycase.com` en la credencial para que n8n maneje la renovación automáticamente.
2. **Webhooks vs polling**: Usar `POST /webhooks` para suscribir n8n a eventos en tiempo real. Evita polling constante.
3. **Subida de documentos**: En el nodo HTTP Request, cambiar "Body Content Type" a **Multipart Form-Data** y mapear el archivo binario. Endpoint: `POST /cases/{id}/documents`.

### Estado

- [ ] Token Manager — pendiente de construir
- [ ] Definir sistema externo a conectar con MyCase
- [ ] Workflows funcionales — pendiente (bloqueado por sistema externo)

---

## Links útiles

- [Getting Started](https://mycaseapi.stoplight.io/docs/mycase-api-documentation/k5xpc4jyhkom7-getting-started)
- [API Reference](https://mycaseapi.stoplight.io/docs/mycase-api-documentation)

---

## Relacionado

- [[Varela Law]] — credenciales y proceso de obtención de token
