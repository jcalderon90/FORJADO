---
tags: [forjado, carwarriors, infraestructura, diseño, n8n, mongodb, coolify]
tipo: spec
estado: aprobado
cliente: Carwarriors LLC
creado: 2026-06-18
actualizado: 2026-07-27
---

# Diseño de Infraestructura — Carwarriors LLC

## Stack

| Capa | Servicio | Detalle |
|---|---|---|
| **Servidor** | Hostinger KVM 1 · ~$8/mes | IP `2.24.106.87`. n8n + Traefik + Redis. MongoDB es externo, el VPS no carga DB |
| **Orquestación** | Coolify v4.1.2 | Instalado sobre el VPS para gestionar el stack por UI en vez de docker-compose manual |
| **Automatización + Agentes IA** | n8n (self-hosted) | Todo el logic layer — automatizaciones y agentes IA centralizados aquí |
| **Reverse proxy** | Traefik | HTTPS automático con Let's Encrypt |
| **Caché / colas** | Redis | Workflows de alto volumen, control de duplicados |
| **Base de datos + vectores** | MongoDB Atlas M0 (free → escala) | Datos de leads, logs de llamadas, embeddings para memoria de agentes IA |
| **Modelos IA** | OpenRouter | Claude / GPT-4o según tarea — pay-per-use, sin costo en VPS |
| **CRM** | GoHighLevel | Fuente de verdad de contactos y oportunidades |
| **Canal Instagram** | ManyChat | Webhooks → n8n → GHL |
| **Telefonía** | Zonitel | Eventos de llamadas → n8n → análisis IA → notas en GHL |
| **CRM dealer** | DealerCenter | Importación de leads por SFTP + ADF/XML (oficial, confirmado en investigación del 2026-07-08) |
| **Lead Sync GHL → DC** | n8n *(en re-evaluación)* o Cloudflare Worker | Webhook de GHL → genera ADF/XML → sube por SFTP a DealerCenter. Ver [[Carwarriors - SFTP DealerCenter (Investigación)]] — SFTP es difícil de implementar en el runtime de Cloudflare Workers, n8n trae nodo FTP/SFTP nativo |
| **Captura de leads (Módulo A)** | n8n + Agente IA + MongoDB | Workflow `carwarriors_lead_intake_agent_workflow.json`: pide teléfono a leads de IG/Messenger sin dato estructurado, guarda en Mongo colección `leads` |

---

## Progreso de implementación (2026-07-27)

Cliente contrató el VPS Hostinger KVM1 (IP `2.24.106.87`). Se instaló Coolify (v4.1.2) sobre el VPS y se está desplegando n8n usando la plantilla oficial de Coolify "n8n" (service stack), que trae:

- **N8N** (`n8nio/n8n:2.10.4`) — expuesto en `http://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io:567...` (dominio sslip.io autogenerado por Coolify, URL truncada en captura — confirmar puerto/URL completa)
- **N8N Worker** (`n8nio/n8n:2.10.4`) — modo queue
- **Task Runners** (`n8nio/runners:2.10.4`)
- **Postgresql** (`postgres:16-alpine`) — reemplaza a MongoDB como DB propia de n8n (MongoDB Atlas se mantiene aparte, solo para datos de leads/embeddings, ver tabla de Stack)
- **Redis** (`redis:6-alpine`)

> [!info] Resuelto — stack levantado, acceso funcionando (2026-07-27)
> Los 5 contenedores llegaron a estar en `Exited` en algún punto del deploy inicial, y luego al acceder a n8n por primera vez apareció el error estándar *"Your n8n server is configured to use a secure cookie, however you are either visiting this via an insecure URL, or using Safari"* (n8n exige cookie segura pero el navegador no detectaba HTTPS válido — típico cuando Traefik/Let's Encrypt no ha terminado de emitir el certificado del dominio sslip.io, o se accede por IP/HTTP en vez del dominio https). **El usuario lo resolvió por su cuenta** — n8n ya es accesible. Queda pendiente confirmar la URL final de acceso y, en algún momento, revisar el firewall del panel de Hostinger (puertos 80/443 entrantes) para asegurar que la renovación automática de Let's Encrypt no falle a futuro.

Esto reemplaza el plan original de n8n + Traefik + Redis manual (fila "Servidor" de la tabla de Stack) por el stack gestionado de Coolify, que además usa Postgres en vez de SQLite para la DB interna de n8n (mejor para el modo queue con worker separado).

---

## Agente de Captura de Leads — implementado y activo en n8n (2026-07-27)

Se construyó, probó y activó el workflow `Carwarriors - Agente de Captura de Leads (GHL + Mongo)` directamente en el n8n ya desplegado (vía MCP `n8n-carwarriors`), a partir del diseño de `carwarriors_lead_intake_agent_workflow.json`.

- **Workflow ID:** `6QGLivaPilh09R21` — 15 nodos, **activo**.
- **Credenciales creadas en n8n:** `MongoDB Carwarriors` (Atlas, base de datos `Carwarriors`) y `Header Auth GHL` (Location API Key de Carwarriors LLC como `Authorization: Bearer <token>`).
- **Webhook de producción (listo para recibir tráfico):**
  `https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/webhook/d7cd6008-dc30-4ec4-827d-58e009a39a09/carwarriors-lead-intake`
- **2 bugs reales encontrados y corregidos al probar con `test_workflow` (no estaban en el diseño original):**
  1. El nodo `Check Pending State` (Mongo `find`) detenía toda la cadena cuando no había registro previo (caso normal de lead nuevo) — n8n no ejecuta nodos siguientes cuando un nodo devuelve 0 items. Se corrigió con `alwaysOutputData: true`.
  2. Eso rompía `Has Pending Record?`, que solo miraba `items.length` y ahora siempre veía `pending: true` (por el item sintético vacío que fuerza `alwaysOutputData`). Se corrigió para distinguir un item real (con campos) del item sintético `{}`.
- **Nodo nativo `HighLevel` evaluado y descartado:** no tiene recurso de conversaciones/mensajes (solo contact/opportunity/task/calendar) y requiere credencial OAuth2 (app en el marketplace de HighLevel) en vez del token simple ya configurado. Se mantiene HTTP Request + Header Auth para las 2 llamadas a GHL.

> [!warning] Pendiente — el lado de GHL no dispara este webhook todavía
> El workflow está listo y activo en n8n, pero **en GHL no existe todavía la automatización que llame a esta URL** cuando entra un mensaje nuevo de un lead. Se empezó a configurar vía Playwright + CDP persistente (mismo patrón que Agent Studio — ver memoria `feedback-ghl-playwright-persistent-cdp`): se navegó a Automation → Workflows dentro de la subcuenta Carwarriors LLC (location `DSe5PdPEScZL8cbZTkKI`) y se ubicaron las carpetas `Agente AI`, `Asignacion`, `Campañas`, `Fuente` (más el workflow publicado `Importar Contactos`, 14336 inscritos). Falta entrar a la carpeta `Agente AI` para ubicar el workflow correcto y agregar la acción de webhook. La sesión de Chrome se perdió a mitad de camino (se relanzó con perfil persistente en disco para no repetir login la próxima vez) — **queda pendiente retomar el login y completar la config**.

> [!danger] Rotar el Location API Key de Carwarriors
> El token (Location API Key legacy, no PIT) quedó pegado en el chat de esta sesión al crear la credencial `Header Auth GHL`. Por seguridad, **regenerarlo en GHL → Settings → Business Profile → API Keys** una vez confirmado que el workflow funciona con el nuevo token, y actualizar la credencial en n8n.

---

## Flujo de datos

### ManyChat → n8n → GHL
```
Usuario interactúa en Instagram (story, DM, comentario)
  → ManyChat dispara webhook
    → n8n recibe evento
      → crea o actualiza contacto en GHL
      → guarda interacción en MongoDB
```

### GHL → n8n → Agente IA → GHL
```
Nuevo lead o cambio de etapa en GHL
  → webhook → n8n
    → agente IA consulta MongoDB Atlas Vector Search (contexto del lead)
      → decide acción: asignar vendedor / enviar mensaje / mover pipeline
        → ejecuta en GHL
```

### GHL → n8n → Captura de teléfono (implementado como primer workflow, 2026-07-08)
```
Lead entra por WhatsApp / Instagram / Messenger (vía GHL)
  → webhook → n8n clasifica el canal
    → WhatsApp (ya trae teléfono) → guarda directo en MongoDB (colección leads)
    → Instagram/Messenger sin teléfono:
        → ¿ya se le preguntó antes? (MongoDB leads_pending_phone)
          → No: agente pide el teléfono por el mismo canal (API de conversaciones GHL) y marca "pendiente"
          → Sí: intenta extraer el teléfono del mensaje entrante
              → si lo encuentra: actualiza el contacto en GHL, borra el "pendiente", guarda en MongoDB
              → si no: vuelve a pedirlo
```
Workflow exportado: `carwarriors_lead_intake_agent_workflow.json` (en esta misma carpeta). Pendiente: importarlo en el n8n real, conectar credenciales, y confirmar el payload real del webhook de GHL.

### Zonitel → n8n → IA → GHL
```
Evento de llamada (Zonitel)
  → n8n recibe datos
    → transcripción + análisis vía OpenRouter
      → guarda resumen + embedding en MongoDB
        → añade nota al contacto en GHL
        → alerta si la llamada indica intención de compra
```

### GHL → DealerCenter (en re-evaluación: n8n vs Cloudflare Worker + SFTP)
```
Lead nuevo en GHL
  → webhook HTTP POST → [n8n o Cloudflare Worker — pendiente decisión]
    → transforma el lead a formato ADF/XML
      → sube el archivo .xml por SFTP al servidor de DealerCenter
        → DealerCenter importa el lead automáticamente
```

> **Actualización 2026-07-08:** La razón original para elegir Cloudflare Worker (stateless, sin costo variable) sigue siendo válida en principio, pero la investigación (ver [[Carwarriors - SFTP DealerCenter (Investigación)]]) encontró que **SFTP es un protocolo con sesión persistente (sockets TCP)**, no un simple `fetch` HTTP — el runtime de Cloudflare Workers no lo soporta de forma nativa y sencilla. n8n sí trae un nodo FTP con soporte SFTP listo para usar, y ya centraliza el resto del pipeline (webhook GHL → agente IA → Mongo), lo que simplifica logs, reintentos y mantenimiento. Queda pendiente que el usuario decida entre ambas rutas antes de implementar este tramo.

### DealerCenter → GHL *(pendiente)*
```
Sin API disponible → evaluar parser de reports exportados por SFTP/email → n8n → GHL
```

---

## Por qué KVM 1

Con MongoDB Atlas externo, el VPS solo corre n8n + Traefik + Redis. El cliente ya lo probó y el rendimiento es suficiente para el volumen inicial. El upgrade a KVM 2/4 en Hostinger no requiere migración de datos — MongoDB vive en Atlas, independiente del servidor.

---

## Costos mensuales del cliente

| Ítem | Costo estimado |
|---|---|
| VPS Hostinger KVM 1 | ~$8/mes |
| MongoDB Atlas M0 | $0 (free tier) |
| OpenRouter (modelos IA) | ~$10–30/mes según volumen |
| **Total infraestructura** | **~$18–38/mes** |
| Retainer FORJADO | por definir en propuesta |

---

## Decisiones pendientes

- [x] Auditar API de DealerCenter -> **Resuelto**: no hay API oficial directa. Existe una API no oficial de tercero (Supergood, documentada como plan B). El camino principal es SFTP + ADF/XML, confirmado como oficial.
- [ ] Decidir n8n vs Cloudflare Worker para el tramo SFTP → DealerCenter (ver hallazgos en [[Carwarriors - SFTP DealerCenter (Investigación)]])
- [ ] Obtener credenciales SFTP de DealerCenter (las genera el propio dealer desde su panel)
- [x] Definir módulo inicial de desarrollo -> Se arrancó con el Agente de Captura de Leads en n8n (`carwarriors_lead_intake_agent_workflow.json`), pendiente de importar y probar
- [ ] Formalizar propuesta y retainer con Jorge / Bianca
- [x] Diagnosticar por qué el stack de Coolify quedó en `Exited` -> **Resuelto (2026-07-27)**: n8n ya es accesible, usuario resolvió el error de secure cookie por su cuenta
- [ ] Revisar el firewall del panel de Hostinger (puertos 80/443 entrantes) para asegurar renovación automática de Let's Encrypt a futuro
- [x] Importar el workflow `carwarriors_lead_intake_agent_workflow.json` en el n8n ya desplegado y conectar credenciales -> **Resuelto (2026-07-27)**: workflow recreado vía SDK/MCP (ID `6QGLivaPilh09R21`), credenciales `MongoDB Carwarriors` y `Header Auth GHL` conectadas, probado con 2 escenarios reales (2 bugs encontrados y corregidos), **activo**. Detalle en la sección "Agente de Captura de Leads" arriba.
- [ ] Configurar en GHL (subcuenta Carwarriors LLC, Automation → Workflows → carpeta `Agente AI`) la acción que llame al webhook de n8n `.../webhook/d7cd6008-dc30-4ec4-827d-58e009a39a09/carwarriors-lead-intake` cuando entra un mensaje nuevo de un lead — en progreso, interrumpido a mitad de la navegación por Playwright (ver sección de arriba)
- [ ] Rotar el Location API Key de Carwarriors LLC en GHL (quedó expuesto en el chat de esta sesión) y actualizar la credencial `Header Auth GHL` en n8n con el nuevo valor
- [ ] Confirmar la URL final de acceso a n8n (dominio sslip.io) y revisar si conviene mapear un dominio propio antes de dar el workflow por definitivo de cara al cliente

---

## Relacionado

- [[Carwarriors LLC]]
- [[Carwarriors - SFTP DealerCenter (Investigación)]]
- [[Automatización e IA]]
- [[Pipeline (MOC)]]
