---
tags: [forjado, cliente, carwarriors, dealercenter, lead-assignment, biancanote]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-14
---

# 2026-09-14 — Indicación de Bianca para Lead Assignment (OfferUp y Capital One) + Onboarding de Antigravity CLI

## Resumen de la sesión
Sesión de integración de **Antigravity CLI** al repositorio `FORJADO`, revisión de la arquitectura Karpathy (`raw/` + `wiki/`, `sources/` + `wiki/`), verificación de MCPs (`mongodb-mcp-server` probado y funcionando en Atlas, `n8n-carwarriors` y `n8n-varelalaw` configurados en `~/.gemini/config/mcp_config.json`), y recepción de indicaciones de asignación de leads para Carwarriors LLC de parte de Bianca.

## Indicación de Bianca (Audio de WhatsApp)
Bianca envió nota de voz con las siguientes correcciones sobre la asignación de leads por campaña/Lead Source en DealerCenter:
- **OfferUp** $\rightarrow$ **Carlos Martínez** (BDC / Sales Rep). Bianca reportó que los leads de OfferUp no se estaban asignando a nadie (quedaban huérfanos).
- **Capital One** $\rightarrow$ **Dayron Barrizonte** (Dyron). Corrije el esquema anterior (que estaba en rotación aleatoria entre 4 asesores) para que vaya específicamente a Dayron.

## Diagnóstico y estado
- En DealerCenter (`Dealer Settings → Customer → Lead Assignment → Custom Lead Assignment`), las 31 reglas cargadas previamente el 2026-08-25 no contemplaban regla específica activa para OfferUp, y Capital One estaba mapeado de forma rotativa.
- **Pendiente abierto:** Aplicar y guardar las reglas en la UI de DealerCenter (`https://app.dealercenter.net`) en la siguiente sesión con navegador autenticado/puerto CDP.
