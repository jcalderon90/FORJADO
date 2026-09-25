---
tags: [forjado, cliente, callacar, n8n, agente-ia, chatwoot, openrouter, deepseek, langchain]
tipo: raw
cliente: CallaCar Transportation Pty Ltd
fecha: 2026-09-25
---

# 2026-09-25 — Despliegue en producción del Agente de IA Cally (n8n + Chatwoot + OpenRouter + Window Buffer Memory)

## Contexto de la sesión
Puesta en marcha y publicación del agente de inteligencia artificial **Cally** para **CALLACAR Transportation Pty Ltd** en la instancia de automatización `n8n-forjado`. El agente opera como asistente de primer nivel para los visitantes del portal web oficial (`call-a-car-web`), respondiendo dudas operativas, cotizaciones, tarifas, reclutamiento de conductores con 0% comisión y captando prospectos.

## Hitos Técnicos Implementados

### 1. Diagnóstico y Corrección de Payload de Chatwoot
- Se analizó el histórico de ejecuciones fallidas en el workflow heredado (`RRaZXi4hC98Rk8Ke`), encontrando bloqueos por campos incompatibles de Telegram (`social_telegram_user_id`, `$json.body.messages[0]`) y eventos de sistema como `input_email`.
- Se implementó un nodo `Extract Context` resiliente que soporta tanto `automation_event.message_created` como `message_created`, extrayendo `conversationId`, `accountId`, `inboxId`, `contactName` y el texto limpio del mensaje.
- Se configuró el filtro para descartar eventos salientes (`outgoing`) y eventos de sistema (`input_email`), previniendo loops infinitos y ejecuciones espurias.

### 2. Creación y Publicación del Workflow Oficial en n8n
- **Workflow ID:** `Bpiy2rUJ2Z8aitOy` (**CALLACAR - Cally Agent**).
- **Webhook de Producción:** `https://forjado-n8n.duckdns.org/webhook/callacar-agent`.
- **Motor LLM:** LangChain Agent conectado a OpenRouter (`deepseek/deepseek-v4.1-flash`) con credencial oficial `OpenRouter CALLACAR` (`KNEcvGOGnJM5hUjH`).
- **Memoria Conversacional:** Window Buffer Memory con aislamiento por `conversationId` (`contextWindowLength: 10`), garantizando persistencia contextual sin dependencia de bases de datos externas con riesgo de auth.
- **Entrega a Chatwoot:** HTTP Request POST hacia `/api/v1/accounts/{accountId}/conversations/{conversationId}/messages` con credencial `Header Auth CHATWOOT` (`FgDXsLpdLGoNIXwI`).

### 3. Pruebas y Validación End-to-End
- **Ejecución 85 (Inglés):** Consulta sobre opciones de vehículos para mover sofás. Respuesta precisa con utes, vans y camiones; cotizaciones <10 min y costo $0 por publicar.
- **Ejecución 86 (Memoria / Contexto):** Pregunta de seguimiento sobre tarifas desde IKEA a domicilio en Adelaide. Retuvo el contexto previo, calculó ejemplo con 20% fee + $2 SA levy + GST, respondiendo en 3.6s.
- **Ejecución 88 (Español / Choferes):** Consulta sobre registro y comisiones. Cally detectó automáticamente el idioma español, explicó la política de 0% comisión para choferes, listó requisitos (ABN, licencia, antecedentes, Stripe, app) y solicitó cordialmente nombre y email para onboarding.

## Estado de Git e Infraestructura
- Workflow activo en producción y respaldado localmente en `raw/clientes/callacar/n8n-workflows/CALLACAR-CALLY-AGENT.json`.
- Portal web Astro verificado y sincronizado en Vercel.
- Documentación de cliente actualizada en `wiki/clientes/callacar.md`.
