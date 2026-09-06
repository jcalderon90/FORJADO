---
tags: [forjado, cliente, carwarriors, slack, notificaciones, bug]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-06
---

# 2026-09-06 — Fix: notificaciones de Slack (lead nuevo/precios/escalación) mostraban siempre "No registrado"; notificación de cita creada casi nunca dispara

**Contexto:** Jorge reportó que las notificaciones de "lead registrado" están entrando a Slack sin nombre y sin datos ("acaba de entrar una"), y pidió además que se envíen notificaciones cuando se crea un appointment.

## 1. Bug real confirmado y corregido: nombre/teléfono/correo siempre "No registrado" en Slack

**Causa raíz:** en `PRINCIPAL` y `PRINCIPAL - Rances Car`, los 3 nodos que invocan `NOTIFICATIONS` (`'Notifications Master' Nuevos Leads`, `Interés Precios`, `Escalation`) armaban el payload así:

```js
"nombre_lead": $('Parse response').first().json.lead_nombre || 'No registrado',
"telefono_lead": $('Parse response').first().json.lead_telefono || 'No registrado',
"correo_lead": $('Parse response').first().json.lead_correo || 'No registrado',
```

Pero el code node `Parse response` (que parsea la salida JSON del agente PRINCIPAL) **nunca genera los campos `lead_nombre`/`lead_telefono`/`lead_correo`** — se leyó su código completo: devuelve `respuesta, accion_tipo, proyecto, city, interes_vehiculo, metodo_pago, timing_compra, idioma_preferido, resumen_ai, datos_completos, intencion, idioma, confianza, herramientas_usadas, ruta_decision, advertencias, raw, consulta_pendiente_*` — ninguno de esos tres. El `||` cae siempre al fallback.

**Confirmado empíricamente, no solo por lectura de código:** se revisaron 32 ejecuciones reales de `NOTIFICATIONS` (workflow `oz7EabosHGTXtTjr`) entre 2026-08-26 y 2026-09-06, cubriendo los 3 tipos de alerta y ambos dealers (CW y RANCES) — **100% mostraron "No registrado"** para nombre/teléfono/correo, incluyendo dos casos donde el dato SÍ estaba disponible: un lead que escribió literalmente "mi nombre es Ángel Lizardi" en el chat, y otro que compartió su teléfono en el mensaje — ambos casos igual mostraron "No registrado" en la alerta de Slack. Es un bug estructural (100% de las veces), no depende de tráfico ni de qué tan completo esté el lead.

**El dato real sí existe en el propio workflow:** el nodo `Get Contact Info` (GET real a `/contacts/{contactId}` de GHL) ya corre antes en el flujo y devuelve el contacto real. Más aún: **el mapeo correcto todavía estaba guardado como código huérfano** dentro de esos mismos 3 nodos — n8n a veces conserva el bloque de parámetros anterior (`parameters.parameters.workflowInputs.value.datos`) cuando un nodo se edita sin limpiarlo del todo. Se verificó que ese bloque huérfano es **idéntico byte a byte en los 6 nodos** (3 en `PRINCIPAL`, 3 en `PRINCIPAL - Rances Car`) y usa exactamente `Get Contact Info.contact?.name/.firstName`, `.phone`, `.email`, con fallback a `PARSE BODY.current_body.name`, más una lógica de detección de canal (IG/FB/SMS/WhatsApp/Email/Live_Chat) más completa que el `canal: User Data.input_channel` actual (que en la muestra real siempre devolvía `"unknown"`).

**Conclusión:** en algún momento este SÍ era el mapeo real en producción, y alguien lo reemplazó por error por uno que referencia campos que no existen — probablemente al intentar que el nombre viniera de lo que el lead dice en el chat (vía el LLM) en vez del contacto real de GHL, sin notar que `Parse response` nunca expone esos campos.

**Fix aplicado:** se restauró en los 6 nodos (ambos dealers) el mapeo que ya estaba verificado y preservado como código huérfano en el mismo nodo — mismo riesgo que restaurar una versión anterior ya probada, no código nuevo. Publicado y verificado byte a byte:

- `PRINCIPAL` (`Kif9lWwDHvR7TT39`): `versionId`/`activeVersionId` = `27644627-9522-4429-ba02-19b3de2df1dc`.
- `PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`): `versionId`/`activeVersionId` = `85d1c3bf-68a5-4c76-9b41-3b747fa4ea60`.

Confirmado en la versión activa de ambos: 0 referencias a `lead_nombre` (el campo roto), 1 referencia a `Get Contact Info` (la fuente real) en cada uno de los 6 nodos. Falta confirmar con la próxima notificación real que el nombre/teléfono/correo lleguen bien a Slack.

## 2. Hallazgo relacionado (no corregido en esta sesión): la notificación de "cita creada" casi nunca dispara

`RSVP` sí tiene el cableado correcto para notificar por Slack cuando se confirma una cita: `GHL Crear Cita → Guardar Event ID → Mongo Guardar GHL Event ID → IF CONFIRMADA → HTML → 'Notifications Master' Cita`. Es decir, no falta construirlo — ya existe. Pero de las 32 ejecuciones reales de `NOTIFICATIONS` revisadas (10 días, ambos dealers), **ninguna vino de `RSVP` o `RSVP - Rances Car`** — todas fueron `nuevo_lead`/`interes_precios`/`escalacion` desde `PRINCIPAL`.

Rastreando una conversación real completa (lead "Ulean QueenBoss", CW, 2026-09-01, ejecuciones 3987→3990→3991 de RSVP): el gate `IF CONFIRMADA` (requiere `Parse RSVP Output.cita_confirmada === true` Y `Find Appointment.confirmada !== true` en el mismo turno) casi nunca se cumple en la práctica — se vio el backend devolver `accion: "no_disponible"` turno tras turno mientras el LLM le decía al cliente "ya tienes tu cita confirmada" (el mismo patrón de "el agente ignora el resultado real de su propia tool" ya documentado el 09-05 con el caso de Jose Arcos). Esto se solapa con el bug de `_id`/`ghl_event_id` ya corregido y publicado el 2026-09-05 en `Decidir Accion Calendario` de ambos RSVP — es razonable esperar que ese fix ya mejore indirectamente esta situación, pero no hay todavía un caso real posterior al fix para confirmarlo.

**Decisión con Jorge:** no tocar más código de RSVP ahora — esperar tráfico real (una cita que se confirme de verdad) para ver si la notificación "cita" dispara sola gracias al fix de ayer, antes de decidir si `IF CONFIRMADA` necesita un cambio propio.

## Pendiente real

- [ ] Confirmar con la próxima notificación real de Slack (`nuevo_lead`/`interes_precios`/`escalacion`) que el nombre/teléfono/correo ya llegan bien, en ambos dealers.
- [ ] Observar la próxima cita confirmada real para ver si `'Notifications Master' Cita` dispara — si no, revisar si `IF CONFIRMADA` necesita ajuste propio (más allá del fix de `_id` del 09-05).
- [ ] `canal` en `interes_precios` sigue sin incluirse en el payload (ni en el código viejo ni en el nuevo) — solo aparece en `nuevo_lead` y `escalacion`. No se tocó porque el payload de Slack para "Interés Precios" no muestra canal en su plantilla actual (`Payload Precios` no lo usa) — no es un bug, solo una asimetría menor a tener en cuenta si se agrega canal a esa plantilla en el futuro.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-05-auditoria-leads-appointments-conversaciones-mongo]]
- [[2026-09-05-auditoria-sync-leads-ghl-dealercenter-bidireccional]]
