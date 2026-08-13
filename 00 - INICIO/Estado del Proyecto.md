---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-08-13
---

# Estado del Proyecto — FORJADO

> Estado consolidado de la agencia al **2026-08-13**. Fuente de verdad: notas de cliente individuales — este resumen se actualiza a mano.

---

## Resumen

| Área | Estado | Última actividad |
|---|---|---|
| Carwarriors LLC | 🟡 Migración de arquitectura en curso | 2026-08-13 (Slack conectado, token GHL 401) |
| Varela Law | 🟢 En producción, sin bloqueos | 2026-08-12 (error handler conectado) |
| Pipeline / prospección | Esperando validación para formalizar contratos | — |

---

## Carwarriors LLC (automatización + IA, Miami)

**Estado comercial:** fase de pruebas activas, contrato se formaliza si las pruebas salen bien.

### Frentes activos

1. **Migración del bot conversacional: GHL Conversation AI → n8n + OpenRouter** (decidido 2026-08-12). Copia adaptada del sistema Agent-Spectrum. GHL queda como CRM. Los bots nativos de GHL siguen en producción hasta validar el reemplazo. Detalle: [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].
2. **Notificaciones → Slack** (nuevo canal de alertas, 2026-08-13). NOTIFICATIONS y ERROR HANDLER recableados a credencial Access Token, canal real `notificaciones`. Receptor de DM/menciones `SLACK - INBOUND` publicado y activo.
3. **Lead Sync GHL ↔ DealerCenter** — en producción en ambas subcuentas (workflow `DealerCenter Sync - Opportunity Created`, SFTP + ADF/XML validado end-to-end).

### Pendientes críticos

- [ ] **Renovar token GHL** — credencial `Header Auth GHL` devuelve `401 Invalid JWT` en ambas subcuentas (reconfirmado en vivo 2026-08-13). Bloquea escribir a GHL, leer custom fields y armar RSVP. Jorge: Settings → Private Integrations → generar nuevo token y actualizarlo en n8n.
- [ ] **Slack — prueba real end-to-end**: que Jorge pegue la Request URL en Slack → Event Subscriptions y pruebe un DM/mención real del workflow receptor.
- [ ] **Credencial Slack API** (Bot Token `xoxb-` + Signing Secret) en n8n para el nodo `Slack Trigger` del workflow receptor.
- [ ] **Credencial OpenAI** separada (embeddings) en n8n — no depende de terceros.
- [ ] **Insumos externos para terminar workflows**: KB real (Bianca), `calendarId` reales de GHL (Nallely/Scarleth/Samuel), fuente de fotos/inventario (DealerCenter).
- [ ] **Adaptar `PRINCIPAL`** (el orquestador, la pieza más grande) — se hace al final, cuando los sub-workflows estén listos.
- [ ] **Elegir modelo(s) en OpenRouter** (punto de partida: `gpt-5-mini`).
- [ ] **Apagar bots de GHL Conversation AI** solo tras validar el reemplazo en producción; informar a contabilidad del cambio de gastos.
- [ ] Confirmar `"CW - TRADE IN"` como Lead Source real con el primer lead de Trade-In.
- [ ] Limpieza pendiente: marcar `Deleted` el lead de prueba en DealerCenter (requiere 2FA de Jorge).
- [ ] Formalizar contrato una vez validadas las pruebas.

**Objetivo del cliente:** listo para 2026-08-17/18 (ambicioso — PRINCIPAL sin tocar y 3 workflows bloqueados por insumos).

---

## Varela Law (automatización n8n, Miami)

**Estado comercial:** activo ($80/mes).

### En producción

- **MyCase auth + integración base** — 100% operativo (Token Manager refresca end-to-end vía Mongo, Schedule Trigger verificado).
- **Radar Billing Automation** — corre solo todos los días 5:00 AM hacia la pestaña `07-05-26` (F/H/J automatizables; Trust Balance manual por límite de API). ID MAP al 96% (95/99). Detalle: [[Varela Law - Radar Billing Automation]].
- **Alerta de errores nativa** — `errorWorkflow` de Radar Billing enlazado al ERROR HANDLER (email automático a cualquier fallo) desde 2026-08-12.

### Pendientes

- [ ] **Confirmar corrida automática 2026-08-13** (~03:00 UTC) sin el error `Could not find column for key "Client Name"` tras el fix `retryOnFail` del 2026-08-12 — si no llega email, pasó limpia.
- [ ] **Enviar a Mario el mensaje redactado** sobre Radar Billing + confirmar los 4 clientes pendientes de ID MAP (Joj Santos, Medina Manuel, Marquez Dimas, Rojas Tovar Manuel) — [[mensaje-mario-2026-07-25-radar-billing-completo.txt]].
- [ ] **Esperando respuesta de Mario** sobre cuál de las 5 oportunidades del análisis del API (2026-07-28) priorizar — no preguntar proactivamente.
- [ ] Corregir el parser de `Build ID MAP` antes de la próxima corrida completa (si no, regenera las 24 filas ya resueltas como NO MATCH).
- [ ] Hablar con Adalberto sobre el sistema automático de contratos.

---

## Otros pendientes de la agencia

- [ ] Rotar Location API Key de Carwarriors LLC en GHL (expuesto en chat del 27-jul; usuario indicó no rotarlo por ahora — abierto).
- [ ] Investigar `n8n.apps.carwarriorsllc.com` (instancia n8n legacy distinta al VPS Hostinger).
- [ ] Completar datos del panel de inicio (fundador, web/redes, forma legal) — [[🏠 FORJADO — Panel (MOC)]].
- [ ] Actualizar tablero manual del [[Pipeline (MOC)]] con estados reales.

## Relacionado
- [[🏠 FORJADO — Panel (MOC)]]
- [[INDICE]]
- [[Carwarriors LLC]]
- [[Varela Law]]
