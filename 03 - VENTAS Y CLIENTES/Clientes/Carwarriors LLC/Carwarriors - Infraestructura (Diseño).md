---
tags: [forjado, carwarriors, infraestructura, diseño, n8n, mongodb]
tipo: spec
estado: aprobado
cliente: Carwarriors LLC
creado: 2026-06-18
actualizado: 2026-06-26
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
| **CRM dealer** | DealerCenter | Integración vía Cloudflare Worker + SFTP + ADF/XML |
| **Lead Sync GHL → DC** | Cloudflare Worker | Webhook de GHL → genera ADF/XML → sube por SFTP a DealerCenter |

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

### Zonitel → n8n → IA → GHL
```
Evento de llamada (Zonitel)
  → n8n recibe datos
    → transcripción + análisis vía OpenRouter
      → guarda resumen + embedding en MongoDB
        → añade nota al contacto en GHL
        → alerta si la llamada indica intención de compra
```

### GHL → DealerCenter (Cloudflare Worker + SFTP)
```
Lead nuevo en GHL
  → webhook HTTP POST → Cloudflare Worker
    → Worker transforma lead a formato ADF/XML
      → Worker sube archivo .xml por SFTP al servidor de DealerCenter
        → DealerCenter importa el lead automáticamente
```

> **Por qué Cloudflare Worker y no n8n/Make para este tramo:** El Worker no tiene costo variable por ejecución, no consume operaciones de Make ni recursos del VPS. Es un paso stateless, ideal para una edge function. El n8n sigue siendo el orquestador general del ecosistema — el Worker es un conector especializado para este pipeline específico.

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

- [x] Auditar API de DealerCenter — ~~determinar método de integración~~ -> **Resuelto**: no hay API directa. Se usa CF Worker + SFTP + ADF/XML.
- [ ] Desarrollar Cloudflare Worker: webhook → ADF/XML → SFTP
- [ ] Obtener credenciales SFTP de DealerCenter
- [ ] Definir módulo inicial de desarrollo (arrancar generando valor visible)
- [ ] Formalizar propuesta y retainer con Jorge / Bianca

---

## Relacionado

- [[Carwarriors LLC]]
- [[Automatización e IA]]
- [[Pipeline (MOC)]]
