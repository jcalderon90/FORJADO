---
tags: [forjado, carwarriors, infraestructura, diseño, n8n, mongodb]
tipo: spec
estado: aprobado
cliente: Carwarriors LLC
creado: 2026-06-18
actualizado: 2026-07-08
---

# Diseño de Infraestructura — Carwarriors LLC

## Stack

| Capa | Servicio | Detalle |
|---|---|---|
| **Servidor** | Hostinger KVM 1 · ~$8/mes | n8n + Traefik + Redis. MongoDB es externo, el VPS no carga DB |
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

---

## Relacionado

- [[Carwarriors LLC]]
- [[Carwarriors - SFTP DealerCenter (Investigación)]]
- [[Automatización e IA]]
- [[Pipeline (MOC)]]
