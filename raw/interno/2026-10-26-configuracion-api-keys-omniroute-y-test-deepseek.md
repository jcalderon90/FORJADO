---
tags: [forjado, omniroute, openrouter, deepseek, llm, api-keys, infraestructura]
tipo: sesion
fecha: 2026-10-26
estado: cerrado
---

# Sesión 2026-10-26 — Configuración de API Keys en OmniRoute y Test End-to-End con DeepSeek vía OpenRouter

## 1. Contexto y Objetivos
Para permitir el aislamiento de consumos, la medición exacta de costos por cliente y la resiliencia en los flujos de IA (Carwarriors, Callacar y desarrollo interno), se accedió a la instancia viva de **OmniRoute** en el VPS Oracle (`https://forjado-omniroute-190795-129-213-108-102.sslip.io`) mediante Chrome DevTools MCP.

---

## 2. Diagnóstico de la Instancia
- **Versión en producción:** `v3.8.52` (actualizada y operativa).
- **Proveedores conectados:**
  - `openrouter`: 1 conexión activa (proveedor principal de modelos DeepSeek).
  - `groq`: 1 conexión activa.
  - `agy` (Antigravity CLI): 1 conexión activa.
- **Catálogo de modelos:** 1,709 modelos disponibles.

---

## 3. Claves de API Generadas por Cliente (`/dashboard/api-manager`)

Se generaron las claves dedicadas con permisos restringidos (sin acceso administrativo a la configuración, con visibilidad de costos propios):

| Entorno / Cliente | Identificador (Key ID) | Estado | Propósito |
|---|---|:---:|---|
| **Carwarriors** | `1e5ef0fd-40aa-4bbe-a84b-8df4fca38662` | Activa | Agente de comentarios IG/FB en n8n |
| **Callacar** | `05bf5670-7088-45f4-9888-dd6840d1d6af` | Activa | Agente Cally en n8n |
| **FORJADO Interno** | `0a69327b-454b-4c4e-9131-f76f1467fbe7` | Activa | Pruebas de desarrollo y benchmarking |

*(Las cadenas secretas completas fueron entregadas de forma segura en la sesión al operador y enmascaradas en el repositorio según `wiki/interno/recursos/credenciales.md`).*

---

## 4. Verificación End-to-End en Vivo
Se ejecutó una prueba real contra el endpoint OpenAI-compatible:
- **Endpoint:** `POST https://forjado-omniroute-190795-129-213-108-102.sslip.io/v1/chat/completions`
- **Modelo invocado:** `openrouter/deepseek/deepseek-chat`
- **Autenticación:** Bearer token con la clave de `forjado-dev`.
- **Resultado:** **HTTP 200 OK**.
  - Tokens procesados: 49 tokens (19 prompt / 30 completion).
  - Costo reportado y contabilizado en el dashboard: `$0.00003278 USD`.
  - Latencia y respuesta fluida sin errores.
