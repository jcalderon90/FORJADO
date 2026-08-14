---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-08-14
---

# Estado del Proyecto — FORJADO

> Estado consolidado de la agencia al **2026-08-14**. Fuente de verdad: notas de cliente individuales — este resumen se actualiza a mano.

---

## Resumen

| Área | Estado | Última actividad |
|---|---|---|
| Carwarriors LLC | 🟡 PRINCIPAL + RSVP + SEND-MEDIA + VECTORIZAR-KB adaptados y probados con modelo gratuito | 2026-08-14 (los 4 workflows reescritos de Spectrum a Carwarriors y probados; falta cargar saldo real de OpenRouter, fotos/inventario y KB real de Bianca) |
| Varela Law | 🟢 En producción, sin bloqueos | 2026-08-14 (corrida automática confirmada limpia, parser de `Build ID MAP` corregido y probado) |
| Pipeline / prospección | Esperando validación para formalizar contratos | — |

---

## Carwarriors LLC (automatización + IA, Miami)

**Estado comercial:** fase de pruebas activas, contrato se formaliza si las pruebas salen bien.

### Frentes activos

1. **Migración del bot conversacional: GHL Conversation AI → n8n + OpenRouter** (decidido 2026-08-12). Copia adaptada del sistema Agent-Spectrum. GHL queda como CRM. Los bots nativos de GHL siguen en producción hasta validar el reemplazo. Detalle: [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].
2. **Notificaciones → Slack** (nuevo canal de alertas, 2026-08-13). NOTIFICATIONS y ERROR HANDLER recableados a credencial Access Token, canal real `notificaciones`. Receptor de DM/menciones `SLACK - INBOUND` **validado end-to-end en producción** (2026-08-13 noche): Request URL corregida (Jorge había pegado la del OAuth callback, no la del trigger), Socket Mode desactivado, y se encontraron y corrigieron 2 bugs reales de loop de auto-respuesta (el bot se contestaba a sí mismo al no filtrar sus propios mensajes/ediciones/borrados — ver [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]]). Confirmado con una respuesta limpia, una sola vez, sin loop.
3. **Lead Sync GHL ↔ DealerCenter** — en producción en ambas subcuentas (workflow `DealerCenter Sync - Opportunity Created`, SFTP + ADF/XML validado end-to-end).

### Pendientes críticos

- [x] ~~Renovar token GHL~~ — **resuelto 2026-08-13.** Tokens nuevos generados y verificados en ambas subcuentas; corregidos en los 2 workflows que lo tenían hardcodeado (`Subir a DealerCenter`, `DealerCenter -> Mongo -> GHL Lead Sync`) y en la credencial `Header Auth GHL`. Detalle en [[Carwarriors LLC]].
- [x] ~~Slack — prueba real end-to-end~~ — **resuelto 2026-08-13.** DM y mención probados en vivo; en el camino se corrigieron 2 bugs de loop de auto-respuesta en `Filtrar DM o Mencion`. Detalle en [[Carwarriors LLC]].
- [ ] **Cargar crédito real en OpenRouter** — **hallazgo crítico 2026-08-14**: la credencial existe y funciona, pero la cuenta nunca se cargó con saldo (`402 Insufficient credits`, confirmado probando `PRINCIPAL` real). Bloquea toda llamada de IA en Carwarriors ahora mismo (PRINCIPAL, LEAD-COLLECTOR, KB-SEARCH) — https://openrouter.ai/settings/credits
- [ ] **Credencial OpenAI** para embeddings en n8n — no depende de terceros. **Hallazgo 2026-08-14:** los nodos `Embeddings OpenAI` de `KB - SEARCH` y `VECTORIZAR - KB` no tienen NINGUNA credencial asignada (no es que falte una "separada" de OpenRouter, hoy no hay ninguna) — sin esto el RAG no puede indexar ni buscar, aunque el resto ya esté adaptado.
- [ ] **Insumos externos para terminar workflows**: KB real (Bianca — `VECTORIZAR - KB` ya tiene la estructura y el campo `dealer` listos, solo faltan los chunks reales), fotos/videos reales de inventario (`SEND - MEDIA` ya tiene el transporte GHL listo, la "base de datos" de medios quedó vacía a propósito con un comentario `PENDIENTE` marcando dónde pegarlos). **Hallazgo 2026-08-14: `RSVP` no necesitaba `calendarId`'s de GHL** — nunca usó la API de Calendar de GHL, solo guarda la preferencia de fecha/hora en Mongo y notifica a un asesor humano por Slack para que confirme manualmente; por eso se pudo adaptar completo hoy sin ese insumo.
- [x] ~~Adaptar `PRINCIPAL`~~ — **resuelto 2026-08-14.** Reescrito de Spectrum a GHL en 3 fases (identidad/infra, referencias de sub-workflows, prompt de negocio); Data Table `GHL Locations` para dealer/token por `locationId` en vez de hardcodear; eliminada lógica de proyecto inmobiliario y Leads Fase 2 (sin equivalente en Carwarriors); corregidos 7 IDs de sub-workflow rotos que apuntaban a Spectrum. **Probado de punta a punta con un modelo gratuito de OpenRouter** (ejecución `841`, éxito): el bot respondió en tono/idioma correcto y avanzó el eje de calificación correcto (vehículo→ubicación) ante un mensaje simulado real. Sigue **inactivo** — no reemplaza a los bots de GHL todavía. Detalle completo en [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].
- [x] ~~Elegir modelo(s) en OpenRouter~~ — **resuelto 2026-08-14** (decisión). Orquestador/`PRINCIPAL`: `deepseek/deepseek-v4-flash` (más barato que `deepseek/deepseek-v4-pro` — ~$0.07/$0.17 vs ~$0.41/$0.83 por millón de tokens in/out, confirmado en OpenRouter). Resto de sub-workflows: `openai/gpt-4.1-mini`. **Falta aplicar** — los nodos de modelo en PRINCIPAL/LEAD-COLLECTOR/KB-SEARCH/RSVP siguen temporalmente con el modelo gratuito de prueba (`nvidia/nemotron-3.5-lightning:free`), pendiente de revertir a la decisión real una vez haya crédito.
- [x] ~~Adaptar `RSVP`, `SEND - MEDIA` y `VECTORIZAR - KB`~~ — **resuelto 2026-08-14.** `RSVP`: identidad reclavada a `contactId`/`dealer`, prompt reescrito para autos (visita al lote/test-drive/videollamada/llamada); hallazgo del día: nunca dependió de `calendarId`'s de GHL (solo guarda preferencia en Mongo y notifica a un asesor); se encontró y corrigió un bug real de timezone (offset fijo de Guatemala `-06:00` → Luxon con `America/New_York`, correcto con DST); probado 2 veces de punta a punta con `test_workflow`. `SEND - MEDIA`: transporte cambiado de ManyChat a la API de GHL; base de datos de medios vaciada a propósito con placeholder documentado, lista para fotos reales. `VECTORIZAR - KB`: agregado el campo `dealer` que faltaba (KB-SEARCH ya lo esperaba y nunca lo iba a encontrar); chunks de ejemplo listos para el contenido real de Bianca. De paso se corrigió un bug en `NOTIFICATIONS` (`IF Test User` comprobaba un campo que ya no existe, nunca saltaba el envío real de Slack en pruebas) y se re-acopló `PRINCIPAL` a los nuevos contratos de estas 3 tools. Detalle completo en [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].
- [ ] **Apagar bots de GHL Conversation AI** solo tras validar el reemplazo en producción; informar a contabilidad del cambio de gastos.
- [ ] Confirmar `"CW - TRADE IN"` como Lead Source real con el primer lead de Trade-In.
- [ ] Limpieza pendiente: marcar `Deleted` el lead de prueba en DealerCenter (requiere 2FA de Jorge).
- [ ] Formalizar contrato una vez validadas las pruebas.

**Objetivo del cliente:** listo para 2026-08-17/18. Los 4 workflows (PRINCIPAL, RSVP, SEND-MEDIA, VECTORIZAR-KB) están adaptados y probados de punta a punta con el modelo gratuito — el bloqueador real que queda para ir a producción es el saldo de OpenRouter (arriba) más los insumos externos puramente de contenido: KB real de Bianca y fotos/videos de inventario (ver detalle arriba). Detalle técnico completo de la adaptación de hoy en [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].

---

## Varela Law (automatización n8n, Miami)

**Estado comercial:** activo ($80/mes).

### En producción

- **MyCase auth + integración base** — 100% operativo (Token Manager refresca end-to-end vía Mongo, Schedule Trigger verificado).
- **Radar Billing Automation** — corre solo todos los días 5:00 AM hacia la pestaña `07-05-26` (F/H/J automatizables; Trust Balance manual por límite de API). `ID MAP` reconstruido 2026-08-14 con el parser corregido: 81/87 automático, 6 casos para revisión manual (ambigüedad real en MyCase, no bug). Detalle: [[Varela Law - Radar Billing Automation]].
- **Alerta de errores nativa** — `errorWorkflow` de Radar Billing enlazado al ERROR HANDLER (email automático a cualquier fallo) desde 2026-08-12.

### Pendientes

- [x] ~~Confirmar corrida automática 2026-08-13~~ — **resuelto 2026-08-14.** Ejecución `2242` a las 03:00:41 UTC, status `success`, sin errores. El fix `retryOnFail` del 2026-08-12 funcionó.
- [ ] **Enviar a Mario el mensaje redactado** sobre Radar Billing + confirmar los 4 clientes pendientes de ID MAP (Joj Santos, Medina Manuel, Marquez Dimas, Rojas Tovar Manuel) — [[mensaje-mario-2026-07-25-radar-billing-completo.txt]].
- [ ] **Esperando respuesta de Mario** sobre cuál de las 5 oportunidades del análisis del API (2026-07-28) priorizar — no preguntar proactivamente.
- [x] ~~Corregir el parser de `Build ID MAP`~~ — **resuelto 2026-08-14.** El parser viejo asumía que los nombres de MyCase seguían el formato "Apellido, Nombre" del sheet; en realidad son texto libre, así que partía por la última palabra y agarraba cosas como "Divorce" como apellido. Reescrito a matching por conjunto de palabras (apellido + nombre presentes como tokens, sin importar orden) con fallback por apellido único para variantes ortográficas. Probado con pin data contra los 27 casos corregidos a mano: 26 automáticos, 1 por apellido único. **Corrida real en producción 2026-08-14** (ejecución `2255`, éxito): de 87 filas en `ID MAP`, 81 resolvieron automático (`word_match`), 5 quedaron `AMBIGUOUS - needs manual review` (Castaño Juan x2, Correa Jose, Flores Juan, Medina Manuel) y 1 `NO MATCH` (Rojas Tovar Manuel). Estos 6 casos coinciden en gran parte con los 4 clientes que ya estaban pendientes de confirmar con Mario — no son regresión del fix, son casos genuinamente ambiguos en MyCase (múltiples casos con el mismo nombre).
- [ ] Hablar con Adalberto sobre el sistema automático de contratos.

---

## Otros pendientes de la agencia

- [x] ~~Reorganizar la bóveda y hacerla más LLM-friendly~~ — **resuelto 2026-08-14.** Estructura movida a `CLIENTES/` (Carwarriors LLC, Varela Law) + `INTERNO/` (marca/servicios/ventas/operaciones/finanzas/recursos/plantillas), 49 archivos vía `git mv` sin romper wikilinks. Además: `README.md` raíz (estaba vacío) ahora es el mapa de entrada; se crearon `INDEX.md` por cliente (Carwarriors LLC, Varela Law) que separan docs vigentes / históricos-deprecados / bitácora / artefactos JSON crudos, para no tener que abrir todos los archivos de la carpeta; `CLIENTES/_Léeme.md` e `INTERNO/INDICE.md` corregidos (tenían instrucciones/enlaces desactualizados de antes de la reorg). Se detectó (no resuelto, fuera de alcance aditivo) un archivo suelto `swagger-ui-init.js` (~250KB) en `Varela Law/` que parece residuo, no contenido real — marcado en su `INDEX.md`, pendiente de decidir si se borra.
- [ ] Rotar Location API Key de Carwarriors LLC en GHL (expuesto en chat del 27-jul; usuario indicó no rotarlo por ahora — abierto).
- [ ] Investigar `n8n.apps.carwarriorsllc.com` — **avanzado 2026-08-14 (nivel red, sin login):** instancia está viva ahora mismo (`/healthz` 200, IP `187.124.250.216`, bloque LACNIC, distinta del VPS Hostinger `2.24.106.87`), corriendo `n8n@2.10.4` en `environment: development`, con certificado Let's Encrypt renovado el 5-ago-2026 (alguien la sigue manteniendo). Sin credenciales no se puede ver qué workflows corre ni quién la administra — posible relación con "Customers for AI" (Carlos Cisneros, hallazgo 2026-07-29). **Pendiente real:** conseguir login o preguntarle a Carlos Cisneros.
- [ ] Completar datos del panel de inicio (fundador, web/redes, forma legal) — [[🏠 FORJADO — Panel (MOC)]].
- [ ] Actualizar tablero manual del [[Pipeline (MOC)]] con estados reales.

## Relacionado
- [[🏠 FORJADO — Panel (MOC)]]
- [[INDICE]]
- [[Carwarriors LLC]]
- [[Varela Law]]
