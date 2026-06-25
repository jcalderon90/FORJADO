---
tags: [forjado, carwarriors, infraestructura, diseño, n8n, mongodb]
tipo: spec
estado: aprobado
cliente: Carwarriors LLC
creado: 2026-06-18
actualizado: 2026-06-18
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
| **CRM dealer** | DealerCenter | Pendiente auditoría de API |

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

### DealerCenter → n8n → GHL *(pendiente)*
```
Si tiene API  → webhook/polling → n8n → sync con GHL
Si no tiene   → email parser en n8n → extrae datos → sync con GHL
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

- [ ] Auditar API de DealerCenter — determinar método de integración
- [ ] Definir módulo inicial de desarrollo (arrancar generando valor visible)
- [ ] Formalizar propuesta y retainer con Jorge / Bianca

---

## Relacionado

- [[Carwarriors LLC]]
- [[Automatización e IA]]
- [[Pipeline (MOC)]]
