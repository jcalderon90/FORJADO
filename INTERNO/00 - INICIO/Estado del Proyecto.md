---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-08-15
---

# Estado del Proyecto — FORJADO

> Estado consolidado de la agencia al **2026-08-15**. Fuente de verdad: notas de cliente individuales — este resumen se actualiza a mano.

---

## Resumen

| Área | Estado | Última actividad |
|---|---|---|
| Carwarriors LLC | 🟡 Embeddings RAG funcionando de punta a punta (índice Mongo + OpenRouter), PRINCIPAL con modelo más potente disponible; bloqueador real: KB real/fotos de Bianca + reunión 2026-08-17 (DealerCenter scope + guardrail anti-spam) | 2026-08-15 (noche) — índice vectorial creado en MongoDB Atlas, embeddings vía OpenRouter confirmados con crédito real (temporal, key personal), KB-SEARCH y VECTORIZAR-KB cableados; PRINCIPAL subido a `nvidia/nemotron-3-ultra-550b-a55b:free` |
| Varela Law | 🟢 En producción, sin bloqueos | 2026-08-15 (3ª corrida automática limpia consecutiva `2263`; pendiente: mensaje a Mario + 4 clientes ID MAP) |
| Pipeline / prospección | Tablero manual poblado: Carwarriors (Propuesta, por formalizar) + Varela Law (Activo) | 2026-08-15 (tablero actualizado con estados reales) |

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
- [ ] **Cargar crédito real en OpenRouter (cuenta propia de Carwarriors)** — **hallazgo crítico 2026-08-14, sigue abierto**: la credencial `OpenRouter account` (la que usan los 4 agentes de chat: PRINCIPAL, LEAD-COLLECTOR, KB-SEARCH, RSVP) sigue sin saldo (`402 Insufficient credits`). No bloquea la operación actual porque los 4 agentes corren en modelos `:free` — https://openrouter.ai/settings/credits
- [x] ~~Credencial para embeddings en n8n~~ — **resuelto 2026-08-15.** Se descubrió que OpenRouter expone un endpoint de embeddings compatible con OpenAI (`POST https://openrouter.ai/api/v1/embeddings`), así que no hace falta una credencial OpenAI separada: el nodo `Embeddings OpenAI` (n8n) se apuntó a `baseURL: https://openrouter.ai/api/v1` con `model: openai/text-embedding-3-small`. Probado con una API key de OpenAI real primero (`NSG API`, sin confirmar crédito), luego con una credencial de OpenRouter (`OpenRouter - DataAgent - Garoo`) que **sí tiene crédito real — pero es la key personal de Jorge Calderón (Garoo), no la cuenta de Carwarriors** (confirmado explícitamente, ver [[Carwarriors LLC]]). Ejecución real completa de `VECTORIZAR - KB` exitosa (ID#930). **Pendiente:** volver a apuntar estos 2 nodos a la cuenta propia de Carwarriors en cuanto tenga saldo, para no seguir facturando a la key personal.
- [ ] **Limpiar 3 chunks placeholder insertados en Mongo real** — la prueba end-to-end de `VECTORIZAR - KB` (2026-08-15, ID#930) fue una ejecución completa, no solo un test de nodo: insertó los 3 chunks de ejemplo (`[PLANTILLA — reemplazar...]`) en la colección `documents` real. Hay que borrarlos (filtro por `id` que empieza con `ejemplo_`) antes de que el bot los use como respuestas reales, o sobrescribirlos al cargar el contenido real de Bianca.
- [x] ~~Crear índice vectorial en MongoDB Atlas~~ — **resuelto 2026-08-15.** Índice `spectrum_vector_index` sobre `Carwarriors.documents`: campo vector `spectrum_embedding` (1536 dims, cosine) + filtro `dealer`, coincide con lo que esperan `KB - SEARCH` y `VECTORIZAR - KB`.
- [ ] **Insumos externos para terminar workflows**: KB real (Bianca — `VECTORIZAR - KB` ya tiene la estructura y el campo `dealer` listos, solo faltan los chunks reales), fotos/videos reales de inventario (`SEND - MEDIA` ya tiene el transporte GHL listo, la "base de datos" de medios quedó vacía a propósito con un comentario `PENDIENTE` marcando dónde pegarlos). **Hallazgo 2026-08-14: `RSVP` no necesitaba `calendarId`'s de GHL** — nunca usó la API de Calendar de GHL, solo guarda la preferencia de fecha/hora en Mongo y notifica a un asesor humano por Slack para que confirme manualmente; por eso se pudo adaptar completo hoy sin ese insumo.
- [x] ~~Adaptar `PRINCIPAL`~~ — **resuelto 2026-08-14.** Reescrito de Spectrum a GHL en 3 fases (identidad/infra, referencias de sub-workflows, prompt de negocio); Data Table `GHL Locations` para dealer/token por `locationId` en vez de hardcodear; eliminada lógica de proyecto inmobiliario y Leads Fase 2 (sin equivalente en Carwarriors); corregidos 7 IDs de sub-workflow rotos que apuntaban a Spectrum. **Probado de punta a punta con un modelo gratuito de OpenRouter** (ejecución `841`, éxito): el bot respondió en tono/idioma correcto y avanzó el eje de calificación correcto (vehículo→ubicación) ante un mensaje simulado real. Sigue **inactivo** — no reemplaza a los bots de GHL todavía. Detalle completo en [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].
- [x] ~~Elegir modelo(s) en OpenRouter~~ — **resuelto 2026-08-14** (decisión). Orquestador/`PRINCIPAL`: `deepseek/deepseek-v4-flash` (más barato que `deepseek/deepseek-v4-pro` — ~$0.07/$0.17 vs ~$0.41/$0.83 por millón de tokens in/out, confirmado en OpenRouter). Resto de sub-workflows: `openai/gpt-4.1-mini`. **Falta aplicar** — los nodos de modelo en PRINCIPAL/LEAD-COLLECTOR/KB-SEARCH/RSVP siguen temporalmente con el modelo gratuito de prueba (`nvidia/nemotron-3.5-lightning:free`), pendiente de revertir a la decisión real una vez haya crédito. **Corrección 2026-08-14 (más tarde):** un hallazgo previo de "solo 4 modelos gratis en OpenRouter" era incorrecto (Jorge lo detectó) — re-verificado contra `openrouter.ai/api/v1/models`, en realidad hay 18. Se evaluaron `openai/gpt-oss-20b:free` y `nvidia/nemotron-3-super-120b-a12b:free` como alternativas con mejor tool-calling/tamaño; Jorge decidió mantener `nvidia/nemotron-3.5-lightning:free` porque ya estaba probado con éxito (ejecución `841`) y no vale la pena re-probar por un modelo temporal. Sin cambios en n8n, solo documentación corregida. **Actualización 2026-08-15:** Jorge pasó la lista completa de modelos gratuitos disponibles en la cuenta OpenRouter y pidió que el agente orquestador `PRINCIPAL` use el más potente (el resto a criterio de la agencia). Cambiado el nodo `OpenRouter Chat Model` de `PRINCIPAL` (el que alimenta al agente orquestador, no el sub-agente `Lenguaje & Asesoria`) a `nvidia/nemotron-3-ultra-550b-a55b:free` (550B parámetros, el más grande de la lista). El resto (`Lenguaje & Asesoria`, LEAD-COLLECTOR, KB-SEARCH, RSVP) se dejó en `nvidia/nemotron-3.5-lightning:free` por ya estar probado y ser tareas más acotadas. Sigue pendiente la decisión original de revertir a modelos pagos (`deepseek-v4-flash`/`gpt-4.1-mini`) una vez la cuenta propia de Carwarriors tenga saldo.
- [x] ~~Adaptar `RSVP`, `SEND - MEDIA` y `VECTORIZAR - KB`~~ — **resuelto 2026-08-14.** `RSVP`: identidad reclavada a `contactId`/`dealer`, prompt reescrito para autos (visita al lote/test-drive/videollamada/llamada); hallazgo del día: nunca dependió de `calendarId`'s de GHL (solo guarda preferencia en Mongo y notifica a un asesor); se encontró y corrigió un bug real de timezone (offset fijo de Guatemala `-06:00` → Luxon con `America/New_York`, correcto con DST); probado 2 veces de punta a punta con `test_workflow`. `SEND - MEDIA`: transporte cambiado de ManyChat a la API de GHL; base de datos de medios vaciada a propósito con placeholder documentado, lista para fotos reales. `VECTORIZAR - KB`: agregado el campo `dealer` que faltaba (KB-SEARCH ya lo esperaba y nunca lo iba a encontrar); chunks de ejemplo listos para el contenido real de Bianca. De paso se corrigió un bug en `NOTIFICATIONS` (`IF Test User` comprobaba un campo que ya no existe, nunca saltaba el envío real de Slack en pruebas) y se re-acopló `PRINCIPAL` a los nuevos contratos de estas 3 tools. Detalle completo en [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].
- [ ] **Reunión con Jorge (cliente) el 2026-08-17 (lunes)** — pendientes que salieron de la llamada del 2026-08-15:
  - **Confirmar alcance del sync GHL → DealerCenter.** Jorge preguntó por el "traslado de HighLevel a DealerCenter" — ya existe y está en producción (`Subir a DealerCenter`, webhook `ghl-dealercenter-adf`, dispara con dedupe contra Mongo). Falta confirmar con él si el trigger actual (evento **"Opportunity Created"** en GHL) es lo que espera, o si quiere que **todo contacto nuevo** (no solo los que llegan a Opportunity) se registre en DealerCenter sin esperar esa etapa del pipeline.
  - **Guardrail anti-spam / bajo interés (requerimiento nuevo, no construido).** Jorge reporta que gente escribiendo desde Cuba pidiendo "interacción/participación" en videos (spam de engagement de redes, no clientes reales) hace que el bot converse horas sin propósito comercial. Se le prometió una capa de clasificación temprana en `PRINCIPAL` que detecte spam/sin intención de compra y bloquee/deje de responder o marque el lead para eliminación — falta diseñar la lógica exacta (qué pasa cuando se detecta: silencio, archivar en Mongo/GHL, límite de turnos) y construirla.
- [ ] **Apagar bots de GHL Conversation AI** solo tras validar el reemplazo en producción; informar a contabilidad del cambio de gastos.
- [ ] Confirmar `"CW - TRADE IN"` como Lead Source real con el primer lead de Trade-In.
- [ ] Limpieza pendiente: marcar `Deleted` el lead de prueba en DealerCenter (requiere 2FA de Jorge).
- [ ] Formalizar contrato una vez validadas las pruebas.

**Objetivo del cliente:** listo para 2026-08-17/18. Los 4 workflows (PRINCIPAL, RSVP, SEND-MEDIA, VECTORIZAR-KB) están adaptados y probados; el RAG (embeddings + índice vectorial) ya funciona de punta a punta. El bloqueador real que queda para ir a producción es puramente de insumos externos de contenido: KB real de Bianca y fotos/videos de inventario (ver detalle arriba) — más resolver en la reunión del 2026-08-17 el alcance del sync a DealerCenter y el guardrail anti-spam (ver pendientes arriba). Detalle técnico completo de la adaptación en [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]].

---

## Varela Law (automatización n8n, Miami)

**Estado comercial:** activo ($80/mes).

### En producción

- **MyCase auth + integración base** — 100% operativo (Token Manager refresca end-to-end vía Mongo, Schedule Trigger verificado).
- **Radar Billing Automation** — corre solo todos los días 5:00 AM hacia la pestaña `07-05-26` (F/H/J automatizables; Trust Balance manual por límite de API). `ID MAP` reconstruido 2026-08-14 con el parser corregido: 81/87 automático, 6 casos para revisión manual (ambigüedad real en MyCase, no bug). Detalle: [[Varela Law - Radar Billing Automation]].
- **Alerta de errores nativa** — `errorWorkflow` de Radar Billing enlazado al ERROR HANDLER (email automático a cualquier fallo) desde 2026-08-12.

### Pendientes

- [x] ~~Confirmar corrida automática~~ — **resuelto y reconfirmado.** 3 noches limpias seguidas verificadas en vivo: ejecución `2242` (08-13, 03:00:41 UTC), `2247` (08-14, 03:00:41 UTC) y `2263` (08-15, 03:00:41 UTC), las 3 `success` sin errores. El fix `retryOnFail` del 2026-08-12 sigue sosteniendo — este pendiente se puede dar por cerrado de forma estable, no solo puntual.
- [ ] **Enviar a Mario el mensaje redactado** sobre Radar Billing + confirmar los 4 clientes pendientes de ID MAP (Joj Santos, Medina Manuel, Marquez Dimas, Rojas Tovar Manuel) — [[mensaje-mario-2026-07-25-radar-billing-completo.txt]].
- [ ] **Esperando respuesta de Mario** sobre cuál de las 5 oportunidades del análisis del API (2026-07-28) priorizar — no preguntar proactivamente.
- [x] ~~Corregir el parser de `Build ID MAP`~~ — **resuelto 2026-08-14.** El parser viejo asumía que los nombres de MyCase seguían el formato "Apellido, Nombre" del sheet; en realidad son texto libre, así que partía por la última palabra y agarraba cosas como "Divorce" como apellido. Reescrito a matching por conjunto de palabras (apellido + nombre presentes como tokens, sin importar orden) con fallback por apellido único para variantes ortográficas. Probado con pin data contra los 27 casos corregidos a mano: 26 automáticos, 1 por apellido único. **Corrida real en producción 2026-08-14** (ejecución `2255`, éxito): de 87 filas en `ID MAP`, 81 resolvieron automático (`word_match`), 5 quedaron `AMBIGUOUS - needs manual review` (Castaño Juan x2, Correa Jose, Flores Juan, Medina Manuel) y 1 `NO MATCH` (Rojas Tovar Manuel). Estos 6 casos coinciden en gran parte con los 4 clientes que ya estaban pendientes de confirmar con Mario — no son regresión del fix, son casos genuinamente ambiguos en MyCase (múltiples casos con el mismo nombre).
- [ ] Hablar con Adalberto sobre el sistema automático de contratos.

---

## Otros pendientes de la agencia

- [x] ~~Reorganizar la bóveda y hacerla más LLM-friendly~~ — **resuelto 2026-08-14.** Estructura movida a `CLIENTES/` (Carwarriors LLC, Varela Law) + `INTERNO/` (marca/servicios/ventas/operaciones/finanzas/recursos/plantillas), 49 archivos vía `git mv` sin romper wikilinks. Además: `README.md` raíz (estaba vacío) ahora es el mapa de entrada; se crearon `INDEX.md` por cliente (Carwarriors LLC, Varela Law) que separan docs vigentes / históricos-deprecados / bitácora / artefactos JSON crudos, para no tener que abrir todos los archivos de la carpeta; `CLIENTES/_Léeme.md` e `INTERNO/INDICE.md` corregidos (tenían instrucciones/enlaces desactualizados de antes de la reorg). Se detectó (no resuelto, fuera de alcance aditivo) un archivo suelto `swagger-ui-init.js` (~250KB) en `Varela Law/` que parece residuo, no contenido real — marcado en su `INDEX.md`, pendiente de decidir si se borra. **Residuo `swagger-ui-init.js` eliminado 2026-08-15** — confirmado que era el bootstrap estándar de Swagger UI (captura, 7785 líneas, 0 contenido del vault), borrado vía `git rm` y entrada eliminada del `INDEX.md` de Varela Law.
- [x] ~~Exportar y organizar los workflows de n8n como archivos locales~~ — **resuelto 2026-08-14** para Carwarriors LLC (12 workflows) y Varela Law (2). En ambos, `n8n-workflows/` quedó agrupado en subcarpetas por proyecto en vez de un solo directorio plano: Carwarriors → `Sincronizacion GHL-DealerCenter/` y `Lead Agent (n8n + OpenRouter)/`; Varela Law → `MyCase Token Manager/` y `Radar Billing Automation/`. `ghl-to-dealercenter-adf.json` de Carwarriors estaba desactualizado (tokens PIT viejos, sin la lógica de dedupe agregada después) y se reescribió contra el estado real en n8n. `INDEX.md` de ambos clientes actualizado con las rutas nuevas. Objetivo: menos consultas a n8n en vivo para revisar la estructura de un flujo.
- [ ] Rotar Location API Key de Carwarriors LLC en GHL (expuesto en chat del 27-jul; usuario indicó no rotarlo por ahora — abierto).
- [ ] Investigar `n8n.apps.carwarriorsllc.com` — **avanzado 2026-08-14 (nivel red, sin login):** instancia está viva ahora mismo (`/healthz` 200, IP `187.124.250.216`, bloque LACNIC, distinta del VPS Hostinger `2.24.106.87`), corriendo `n8n@2.10.4` en `environment: development`, con certificado Let's Encrypt renovado el 5-ago-2026 (alguien la sigue manteniendo). Sin credenciales no se puede ver qué workflows corre ni quién la administra — posible relación con "Customers for AI" (Carlos Cisneros, hallazgo 2026-07-29). **Pendiente real:** conseguir login o preguntarle a Carlos Cisneros.
- [ ] Completar datos del panel de inicio — [[🏠 FORJADO — Panel (MOC)]]. **Avanzado 2026-08-15:** fundador (Jorge Calderón) y contacto (jcalderon900610@gmail.com) completados; correo corregido también en `INTERNO/99 - RECURSOS/Credenciales.md` (el `jorge.calderon@garooinc.com` era incorrecto). Quedan pendientes web/redes y forma legal/facturación — requiere datos del usuario.
- [x] ~~Actualizar tablero manual del [[Pipeline (MOC)]] con estados reales~~ — **resuelto 2026-08-15.** Tablero poblado con los 2 clientes reales: Carwarriors LLC (etapa Propuesta, contrato por formalizar; próximo paso: cargar saldo OpenRouter + KB real/fotos) y Varela Law (Activo, $80/mes; próximo paso: mensaje a Mario + 4 clientes ID MAP).

## Relacionado
- [[🏠 FORJADO — Panel (MOC)]]
- [[INDICE]]
- [[Carwarriors LLC]]
- [[Varela Law]]
