---
tags: [garoo, redtec, omnivoice, kokoro-tts, voicestudio, tts, voz, baseten, hostinger, ia]
fecha: 2026-10-30
tipo: evaluacion-tecnica
---

# 2026-10-30 — Evaluación Técnica de Motores de Voz: OmniVoice y Kokoro TTS en Redtec

## Contexto y Objetivo

Se analiza la viabilidad y arquitectura para dotar a los agentes de IA de **Garoo / Redtec** (`agentsprod.redtec.ai`, integración con **Recall.ai** y backends de agentes) de capacidades de síntesis de voz (Text-to-Speech) y clonación hiperrealista de voz, evaluando dos tecnologías open source clave:

1. **OmniVoice / VoiceStudio (`k2-fsa/OmniVoice`, `debpalash/VoiceStudio`)**: Motor de difusión multilingüe (+640 idiomas), clonación *zero-shot* (3 a 25 s de audio de referencia) y diseño de voces mediante prompts descriptivos.
2. **Kokoro TTS**: Modelo compacto de 82 millones de parámetros optimizado para inferencia ultra rápida, alta calidad natural y consumo mínimo de recursos tanto en CPU como en GPU.

Se evalúa su despliegue considerando las limitaciones de infraestructura actuales: el **VPS de Hostinger de Redtec (solo CPU)** frente al entorno de inferencia serverless en **Baseten (GPU A10G)**.

---

## 1. Comparativa Técnica de Motores

| Parámetro | Kokoro TTS | OmniVoice (`k2-fsa/OmniVoice`) |
|---|---|---|
| **Arquitectura** | Compacta / StyleTTS2 + ISTFTNet (~82M parámetros) | Modelo de Lenguaje de Difusión (~600M - 800M parámetros) |
| **Requisitos Hardware** | Mínimo: 1-2 vCPU, < 1 GB RAM (corre sin GPU) | Mínimo: GPU con 6 GB VRAM (FP16). En CPU requiere 4+ cores y alta latencia |
| **Rendimiento en CPU (Hostinger)** | **Excelente**: RTF < 0.5 (genera 5s de audio en 1-2s). Apto para tiempo real | **Inviable en tiempo real**: 20-60s por frase. CPU al 100% |
| **Rendimiento en GPU (Baseten)** | Latencia sub-100 ms (TTFA ultra bajo) | Latencia 300 - 800 ms (alta fidelidad y clonación) |
| **Clonación de Voz** | Voces predefinidas de alta calidad (packs en ES, EN, etc.) | **Zero-shot cloning** instantáneo con 5-20s de muestra limpia |
| **Diseño de Voz (Prompting)** | No nativo (selección de perfiles/blends) | **Sí**: Creación de voces sintéticas mediante descripción de texto |
| **Idiomas** | Español, Inglés, Francés, Japonés, Chino, etc. | +640 idiomas |
| **Caso de Uso Principal en Redtec** | **Agentes conversacionales en tiempo real** en VPS Hostinger o Baseten | **Clonación de identidades específicas de clientes**, estudio local y Baseten |

---

## 2. Análisis de Infraestructura: VPS Hostinger vs. Baseten

### A. VPS Hostinger de Redtec (Entorno Solo CPU)
* **Realidad del servidor:** Los VPS estándar KVM de Hostinger no cuentan con aceleradores GPU ni soporte CUDA.
* **Kokoro TTS:** Es la **solución idónea para este servidor**. Puede desplegarse mediante un contenedor Docker ligero (`ghcr.io/resemble-ai/kokoro` o wrapper FastAPI) exponiendo un endpoint `/v1/audio/speech` compatible con el estándar de OpenAI. Permite a `agentsprod.redtec.ai` generar audios en tiempo real sin salir del VPS y sin coste por token de audio.
* **OmniVoice:** Solo apto en Hostinger para colas asíncronas por lotes (ej. generación nocturna de resúmenes). Inviable para bots interactivos o llamadas de Recall.ai por la latencia en CPU.

### B. Baseten (Entorno GPU Serverless)
* **Realidad del entorno:** GPU dedicada (NVIDIA A10G / A100) con autoscaling y modo *Scale-to-zero* ($0 en reposo).
* **OmniVoice en Baseten:** Se empaqueta con el framework **Truss** (`truss push`). Permite a Redtec contar con su propia API privada de clonación de voz a demanda, recibiendo `{ "text": "...", "ref_audio_url": "..." }` y respondiendo en streaming con latencia aceptable para videollamadas.
* **Kokoro en Baseten:** Ofrece latencias extremas (inferiores a 100 ms), ideal para turnos conversacionales rápidos (*turn-taking*) en llamadas asistidas por Recall.ai.

### C. VoiceStudio Desktop (Uso Local / PC)
* La aplicación de escritorio `VoiceStudio` (`.exe` en Windows / macOS) sirve como la **suite de laboratorio** de Redtec:
  - Permite a los consultores o desarrolladores probar y clonar muestras de audio de directivos o agentes de clientes.
  - Exportar las muestras de referencia (`ref.wav`) y transcripciones validadas para cargarlas en los pipelines automáticos.

---

## 3. Arquitectura de Implementación Propuesta

```text
┌────────────────────────────────────────────────────────┐
│                   FASE DE DISEÑO                       │
│  Operador Redtec / PC Local (VoiceStudio Desktop)      │
│  - Graba o recibe muestra limpia de 10s               │
│  - Valida clonación y exporta: ref.wav + ref.txt       │
└──────────────────────────┬─────────────────────────────┘
                           │ Muestra aprobada
                           ▼
┌────────────────────────────────────────────────────────┐
│                   PRODUCCIÓN REDTEC                    │
│                                                        │
│  [Opción 1: Latencia Máxima / In-Hostinger]            │
│   VPS Hostinger (CPU) ──► Docker Kokoro TTS API        │
│   - Coste: $0 marginal                                 │
│   - Latencia: < 1.5s                                   │
│                                                        │
│  [Opción 2: Clonación Fiel / GPU Serverless]           │
│   VPS Hostinger (n8n) ──► Baseten (Truss OmniVoice)    │
│   - Coste: Pago por segundo activo                     │
│   - Inyección directa a Recall.ai (Videollamadas)      │
└────────────────────────────────────────────────────────┘
```

---

## 4. Próximas Acciones

1. [ ] Desplegar contenedor piloto de **Kokoro TTS** en el VPS de Hostinger para habilitar TTS rápido local en workflows de n8n.
2. [ ] Instalar la suite local **VoiceStudio** en la estación de trabajo para banco de pruebas y clonación de perfiles de clientes.
3. [ ] Preparar repositorio Truss para `k2-fsa/OmniVoice` en Baseten para pruebas de streaming hacia Recall.ai.

---

## Enlaces y Referencias

* Wiki Redtec: `[[../../wiki/clientes/garoo-redtec|Garoo / Redtec]]`
* Repositorio OmniVoice: `https://github.com/k2-fsa/OmniVoice`
* Repositorio VoiceStudio: `https://github.com/debpalash/VoiceStudio`
* Repositorio Kokoro: `https://github.com/hexgrad/kokoro`
* Adopción Baseten & Recall.ai: `[[2026-10-29-adopcion-recall-ai-y-baseten]]`
