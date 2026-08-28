---
tags: [forjado, cliente, varela-law, brainstorm, outlook, sheets]
tipo: raw
cliente: Varela Law
fecha: 2026-08-28
---

# 2026-08-28 (noche) — Brainstorm de ideas para Varela Law que NO dependen de la API de MyCase

**Contexto:** después del backlog de ideas basadas en scopes de MyCase ([[2026-08-28-brainstorm-nuevas-ideas-mycase-api]]), Jorge pidió explícitamente buscar ideas que **no dependan de la API de MyCase** — más relevante todavía dado el riesgo de que Mario la cancele (ver [[2026-08-27-mario-posible-cancelacion-api-mycase]]). Búsqueda hecha vía WebSearch (automatización de despachos legales con n8n/Outlook/Sheets, intake y onboarding automatizado). Nada de esto está construido ni acordado con Mario — es backlog de propuestas.

## A. Explotar el inbox de Outlook de Mario (mismo patrón que ya funciona con Zelle: leer correo → extraer con regex+LLM → escribir a Sheet/Airtable → alertar si hay duda)

1. **Notificaciones de e-filing / CM-ECF y avisos de corte** — si Mario reenvía o recibe directo confirmaciones de filing y notificaciones del tribunal, un workflow puede detectar estos correos, extraer caso/fecha límite/tipo de aviso y registrarlo en un Sheet de deadlines, con alerta si hay fecha próxima. **No depende de MyCase en absoluto.** Ataca el mismo dolor que la Agenda de Deadlines (`4QsJaKlmHDhkVtBV`, construida pero inactiva, esperando a Mario porque depende de la API) — podría ser respaldo o incluso mejor fuente, porque el tribunal es la fuente primaria real de deadlines, no MyCase. La de mayor impacto de esta lista, y más urgente ahora que Mario está reconsiderando la API.
2. **Detección de firma de retainer/fee agreement** (si usan DocuSign/HelloSign, llega correo de "documento completado") — dispara automáticamente el checklist de apertura de caso. El *disparador* deja de depender de que `/leads` tenga datos (sigue en 0 en MyCase); el contenido del checklist en sí sigue sin definir por Mario.
3. **Correspondencia de la contraparte / abogado contrario** — flag de correos de opposing counsel que necesitan respuesta, con contador de días sin respuesta. Patrón común en despachos chicos para no perder plazos de cortesía procesal.

## B. Reaprovechar lo que YA está en el Sheet/Airtable (cero llamadas nuevas a MyCase)

4. **Digest semanal de salud de cartera** desde los datos que Radar Billing ya escribe (F/H/J en la pestaña `07-05-26`) — alerta si el Uninvoiced Balance de un cliente cruza un umbral, leyendo solo el Sheet, sin tocar la API otra vez.
5. **Chequeo de conflicto de interés sin esperar a `/leads`** — en vez de depender de que MyCase tenga leads (sigue devolviendo 0), un Google Form de intake propio que Mario/Rosa llenen al recibir un cliente potencial, cruzado contra los nombres ya en la pestaña CIVIL CASES. **Desbloquea** la idea de conflicto de interés que en el backlog de MyCase (idea #3, ver [[2026-08-28-brainstorm-nuevas-ideas-mycase-api]]) estaba parada por falta de datos.

## C. Notificaciones internas de equipo (Slack/WhatsApp), no ligadas a un caso puntual

6. **Recordatorios administrativos genéricos** (vencimiento de pólizas, renovaciones, pagos recurrentes del despacho) vía n8n + email/WhatsApp — no toca casos ni MyCase, es operación interna del despacho.

## Recomendación dada a Jorge

Priorizar la **#1** (deadlines desde el correo del propio tribunal) — mismo valor que la Agenda de Deadlines pendiente, pero sin depender de que Mario mantenga o no la API de MyCase. Segunda prioridad la **#5**, porque desatasca algo bloqueado sin necesitar nada nuevo de MyCase. El resto queda como backlog, no urgente.

**Pendiente antes de proponerle nada a Mario:** confirmar con él si realmente reciben notificaciones de e-filing/corte por correo (para no diseñar la #1 sobre un flujo que no aplica a su despacho) y si usan DocuSign/HelloSign para retainers (para la #2).

**Estado:** propuesta sin enviar a Mario todavía.
