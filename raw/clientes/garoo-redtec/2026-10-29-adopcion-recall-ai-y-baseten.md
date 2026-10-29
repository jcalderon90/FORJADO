---
tags: [garoo, redtec, recall-ai, baseten, ia, reuniones, inferencia, gpu]
fecha: 2026-10-29
tipo: registro-adopcion
---

# 2026-10-29 — Adopción de Recall.ai y Baseten en Garoo / Redtec

## Contexto y Hechos

El 2026-10-29 se formaliza la incorporación de dos herramientas de infraestructura avanzada de Inteligencia Artificial al stack operativo de **Garoo / Redtec**:

1. **Recall.ai** (Dashboard: `https://us-east-1.recall.ai/dashboard/` — Región US East 1).
2. **Baseten** (Dashboard: `https://app.baseten.co/overview`).

Estas herramientas complementan el ecosistema existente de agentes en producción (`agentsprod.redtec.ai`, workflows n8n, OpenRouter y MongoDB Atlas) para expandir las capacidades hacia:
- Bots de videoconferencias en tiempo real (Zoom, Google Meet, Microsoft Teams, Webex).
- Inferencia de modelos de IA propios/abiertos sobre GPUs dedicadas y serverless con ultra baja latencia.

---

## 1. Recall.ai — Registro Técnico

- **Acceso:** `https://us-east-1.recall.ai/dashboard/`
- **Función principal:** API universal para videoconferencias. Provee infraestructura headless para enviar bots a reuniones virtuales sin desarrollar conectores individuales por cada plataforma.
- **Plataformas soportadas:** Zoom, Google Meet, Microsoft Teams, Cisco Webex, Slack Huddles.

### Capacidades clave documentadas
- **Bot Dispatch & Lifecycle:** API REST (`POST /api/v1/bot`) para despachar bots con configuración de nombre, avatar, modo de grabación y URLs de webhook.
- **Audio/Video Stream bidireccional:**
  - *Input:* Captura y separación de audio por participante (mixed o raw multi-channel).
  - *Output:* Inyección de audio (Text-to-Speech) y video/avatar en vivo en la llamada.
- **Transcripción en tiempo real:** Soporte para speech-to-text en vivo con diarización y webhooks por cada bloque hablado.
- **Gestión de grabaciones:** Almacenamiento y exportación de archivos MP4/WAV a buckets S3/GCS.

---

## 2. Baseten — Registro Técnico

- **Acceso:** `https://app.baseten.co/overview`
- **Función principal:** Plataforma de despliegue e inferencia de Machine Learning en GPUs de alto rendimiento (A10G, A100, H100) con autoscaling y baja latencia.
- **Framework base:** **Truss** (open-source model serving framework de Baseten).

### Capacidades clave documentadas
- **Optimización de inferencia:** Soporte nativo para vLLM y TensorRT-LLM para maximizar throughput de tokens por segundo y minimizar tiempo hasta el primer token (TTFT).
- **Despliegue de modelos Open Source:** Capacidad de levantar Llama 3/3.1/3.3, DeepSeek, Whisper/WhisperX, Mistral, Kokoro TTS, XTTS, Flux.
- **Modelos privados y fine-tuned:** Hospedaje de modelos ajustados con datos internos sin enviar información confidencial a proveedores públicos.
- **Autoscaling y Serverless:** Scale-to-zero para optimizar costes o instancias pre-calentadas para SLAs de tiempo real.
- **APIs de Inferencia:** Endpoints REST y Server-Sent Events (SSE) para streaming continuo de texto/audio.

---

## 3. Sinergia Técnica para Garoo / Redtec

La integración de ambas herramientas permite a Garoo / Redtec implementar el **pipeline de agente conversacional de reuniones en tiempo real**:

```text
[Reunión: Meet / Zoom / Teams]
           │ (Audio de usuario en vivo)
           ▼
     [Recall.ai Bot]
           │ (WebSocket / Raw Audio Stream)
           ▼
[Orquestador / Backend Redtec]
           │
           ├──► [Baseten - WhisperX / STT] (Transcripción < 200ms)
           │
           ├──► [Baseten - LLM vLLM / Llama 3] (Streaming de respuesta)
           │
           └──► [Baseten - TTS / Kokoro / XTTS] (Generación de voz sintética)
           │
           ▼ (Audio inyectado en vivo)
     [Recall.ai Output]
           │
[Participantes escuchan al Agente IA]
```

---

## Enlaces y Referencias

- Página consolidada en Wiki: `[[../../wiki/clientes/garoo-redtec|Garoo / Redtec]]`
- Workflows vinculados: Instancia n8n `agentsprod.redtec.ai`
- Repositorio asociado: `Garoo/Agent-Spectrum`
