# 2026-08-27 — Jorge (dueño) pide 4 mejoras nuevas: comentarios de IG/FB con interés real, handoff humano silencia al bot, ticket a soporte DealerCenter, bot 24/7 con notificaciones SMS de leads calientes

**Contexto:** Jorge relayó estos pendientes directamente, sin caso puntual investigado todavía — quedan registrados aquí para escoger prioridad, no se ha tocado nada.

## 1. Atender leads en comentarios de publicaciones (no solo DM)
Pide que el bot/equipo también dé seguimiento a comentarios en publicaciones de IG/FB, no solo mensajes directos — pero **solo a los que muestren interés real marcado** (ej. preguntan precio/disponibilidad/quieren agendar), filtrando fuera comentarios irrelevantes (emojis, spam, comentarios genéricos sin intención de compra) para no gastar tiempo del equipo en ellos.

**Sin explorar todavía:** si GHL trae comentarios de IG/FB como conversación (como ya hace con DM) o si requiere un canal/trigger nuevo (Meta Graph API directo, o el conector nativo de comentarios de GHL si existe). Necesita investigación técnica antes de poder dar alcance/esfuerzo.

## 2. Bot debe callarse cuando un humano toma el control de la conversación
Nallely reportó que cuando ella toma control manual de una conversación (le escribe directo al lead desde GHL), **el bot sigue respondiendo en paralelo** — pierde credibilidad frente al cliente y genera respuestas contradictorias/duplicadas. Se necesita que el bot detecte que un agente humano está atendiendo ese hilo y deje de disparar respuestas automáticas a ese contactId hasta que se libere el control.

**Sin explorar todavía:** cómo se marca en GHL que una conversación pasó a manejo humano (¿hay un campo/estado de asignación, tag manual, o hay que inferirlo por "el último mensaje saliente lo mandó un usuario humano, no el bot, en los últimos X minutos"?). Los workflows relevantes son `PRINCIPAL` y `PRINCIPAL - Rances Car` (el orquestador que decide si responde).

## 3. Abrir ticket a soporte de DealerCenter
Pendiente ya documentado desde 2026-08-26 (ver wiki `carwarriors-llc.md`, pendiente "Esperando a Bianca"): el motor de round-robin de DealerCenter auto-asigna un BDC rep aunque su propio log diga "There was no BDC rep ready for leads during automatic assignment" — evidencia ya reunida, recomendado escalar a soporte con esa evidencia. Jorge ahora lo confirma como acción a tomar. **Falta:** decidir si se abre el ticket ya (sin esperar más a Bianca) o se sigue esperando su respuesta primero.

## 4. Bot 24/7 completo + notificaciones de leads por SMS con score de "qué tan caliente" está
Dos partes:
- **(a) Bot fuera de horario humano, haciendo todo el proceso solo** — el bot `PRINCIPAL`/`RSVP` ya corre 24/7 en producción y ya crea/reagenda/cancela citas reales en el calendario de GHL (ver `carwarriors-llc-arquitectura-migracion`, desde 2026-08-18/19). Falta confirmar con Jorge si esto ya cubre lo que pide o si se refiere a algo adicional (ej. asegurar que fuera de horario el bot no intente escalar a un humano que no está disponible, o que cierre el loop completo sin depender de que alguien confirme nada a mano).
- **(b) Notificaciones de leads entrantes por SMS**, indicando si es un lead "caliente" (con score/estado) para que Jorge pueda actuar rápido. Hoy las notificaciones van por Slack (`#notificaciones`) + email de respaldo (agregado 2026-08-25) — **no hay canal SMS todavía**. Necesita: (1) definir el criterio de "lead caliente" (¿el mismo playbook BDC de urgencia ya documentado en el prompt de `PRINCIPAL`, o algo nuevo?), (2) un proveedor de SMS saliente conectado a n8n (GHL ya tiene SMS de contactos pero para notificar *a Jorge*, no al lead, haría falta Twilio u otro proveedor con un número propio, o usar la misma cuenta GHL para mandarse un SMS a sí mismo — evaluar cuál es más simple).

**No construido nada de esto todavía — pendiente de scoping/priorización con Jorge.**
