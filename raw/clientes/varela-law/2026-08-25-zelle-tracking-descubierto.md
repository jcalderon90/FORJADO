# 2026-08-25 — Descubierto workflow "TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK", no documentado antes en la bóveda

**Contexto:** chequeo de rutina de ejecuciones con error en `n8n-varelalaw` (sin reporte previo del cliente).

**Hallazgo:** workflow `TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK` (`BruqJ1jdEV9xl5zG`), activo, `errorWorkflow` conectado al `ERROR HANDLER` compartido. No aparecía mencionado en ningún documento existente del vault (ni en `Varela Law.md` ni en `Varela Law - MyCase API.md` ni en `Varela Law - Radar Billing Automation.md`) — es un sistema en producción que no se había registrado.

**Qué hace:** Microsoft Outlook Trigger (poll cada minuto) sobre correos no leídos de `mvarela@varela.law` con asunto `FW: You received money with Zelle` → extrae remitente/monto/fecha/número de transacción con dos métodos en paralelo (regex determinista + LLM vía OpenRouter) → si coinciden, crea el registro en Airtable ("Legal Case Tracking and Billing", tabla "Zelle Payments") y lo agrega a un Google Sheet ("Incoming Mail Payments") en la pestaña del mes correspondiente → marca el correo como leído. Si los dos métodos de extracción no coinciden en el monto, en vez de crear el registro manda un email de alerta a `jcalderon900610@gmail.com` pidiendo revisión manual.

**Errores encontrados (2026-08-24):**
- Ejecución `2330` (13:24 UTC, trigger) y `2332` (15:07 UTC, manual) fallaron en el nodo `Basic LLM Chain` — `404 This model is unavailable for free. The paid version is available now - use this slug instead: nvidia/nemotron-3-nano-30b-a3b`. El nodo `OpenRouter Chat Model` tiene configurado el slug `openrouter/free`, que OpenRouter dejó de servir gratis.
- **Se auto-resolvió sin cambios:** la ejecución manual siguiente (`2333`, 15:08 UTC) y todas las posteriores (`2334`, `2336`, `2343` — hasta 2026-08-25 20:15 UTC) corrieron exitosas con la misma configuración de nodo. No se tocó nada — probablemente OpenRouter restableció temporalmente el acceso gratis a ese slug, o fue un problema transitorio de disponibilidad del modelo gratis.

**Riesgo abierto, no corregido:** el nodo sigue apuntando a `openrouter/free`, un slug que OpenRouter ya avisó que va a dejar de sostener — puede volver a fallar en cualquier momento. Solución de fondo pendiente: cambiar el modelo a uno de pago estable (ej. el mismo `deepseek/deepseek-v4-flash` que usa el resto de la cuenta) o al slug de pago que sugiere el error (`nvidia/nemotron-3-nano-30b-a3b`).

**Pendiente:** decidir con Mario/Jorge si se documenta este sistema como parte formal del servicio (agregarlo a la página compilada del cliente, que ya se hizo) y si vale la pena estabilizar el modelo antes de que vuelva a fallar en un momento donde nadie lo note.
