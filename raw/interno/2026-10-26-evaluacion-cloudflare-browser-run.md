---
tags: [forjado, interno, cloudflare, scraping, rag, n8n, lead-discovery, arquitectura]
tipo: sesion
fecha: 2026-10-26
estado: cerrado
---

# Sesión 2026-10-26 — Evaluación Técnica de Cloudflare Browser Run (/markdown)

## Contexto y Objetivo
En la auditoría de pendientes de la agencia (2026-10-24), se planteó evaluar **Cloudflare Browser Rendering (Browser Run)** para la extracción de contenido web dinámico y pipelines de RAG en n8n y `lead-discovery`.

### El problema en la infraestructura actual
- El servidor principal de FORJADO es un **VPS Oracle Cloud Free Tier** (ARM Ampere, 24 GB RAM) donde corren Dokploy, n8n, Chatwoot, Redis y OmniRoute.
- Levantar instancias locales de Playwright, Puppeteer o Chromium headless para scraping dinámico consume CPU y memoria RAM críticas del VPS, exponiendo a caídas de otros contenedores en producción.

---

## Hallazgos Técnicos y Arquitectura de la Solución

1. **Endpoint REST Quick Action (`/markdown`):**
   - Cloudflare actualizó el path oficial a `browser-run`:
     ```http
     POST https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/browser-run/markdown
     ```
   - **Headers:**
     - `Authorization: Bearer <CLOUDFLARE_API_TOKEN>` (token con permiso de cuenta: `Browser Run - Edit`).
     - `Content-Type: application/json`
   - **Payload:**
     ```json
     {
       "url": "https://sitio-objetivo.com"
     }
     ```

2. **Ventajas clave para FORJADO:**
   - **RAM cero en el VPS:** Toda la ejecución de JavaScript dinámico y renderizado de Single Page Applications (SPAs) ocurre en los centros de datos de Cloudflare.
   - **Output optimizado para LLMs:** El endpoint devuelve directamente Markdown estructurado y limpio, eliminando boilerplate HTML, scripts y estilos sin requerir librerías de parsing pesadas.
   - **Compatibilidad directa con n8n:** Puede invocarse desde un nodo nativo `HTTP Request` de n8n, recibiendo el markdown para alimentar nodos de embeddings o agentes LLM (DeepSeek / OpenRouter).
   - **Soporte nativo en Cloudflare Workers:** Para integraciones serverless directas, existe el binding nativo:
     ```typescript
     const response = await env.BROWSER.quickAction("markdown", { url: "https://ejemplo.com" });
     ```

---

## Conclusión y Próximos Pasos de Implementación
- **Veredicto:** Aprobado técnicamente como el estándar oficial de scraping dinámico para `lead-discovery` y flujos de IA en n8n.
- **Requisito para activar:** Generar un API Token en el panel de Cloudflare con el alcance `Browser Run - Edit` y registrarlo en las credenciales seguras del entorno.
