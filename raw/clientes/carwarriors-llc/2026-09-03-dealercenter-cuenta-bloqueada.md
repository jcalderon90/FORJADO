---
tags: [forjado, cliente, carwarriors, dealercenter, acceso, bloqueo, pendiente]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-03
---

# 2026-09-03 — Cuenta de DealerCenter (jcalderon90) bloqueada

**Contexto:** durante la sesión de hoy, un intento de login fresco a DealerCenter (sin sesión persistida) devolvió "Incorrect username or password" con las credenciales conocidas (`jcalderon90` / `Dealermiami100@`, ver `carwarriors-llc-source-2026-08-25.md`). Jorge confirmó: **la cuenta está bloqueada**, hay que esperar a que se desbloquee — no es un cambio de contraseña ni error de tipeo.

## Efecto

Cualquier trabajo que requiera login vivo a DealerCenter queda **pausado** hasta el desbloqueo: seguimiento del diagnóstico de ROI (`2026-09-02-dealercenter-roi-diagnostico-completo`), ticket de BDC Rep (`2026-08-29-dealercenter-bdc-rep-auto-asignacion-bug`), reporte mensual de ventas retail, exploración de tasks viejos, y cualquier chequeo manual del Customer List. El sync automático GHL↔DealerCenter (SFTP/ADF, no depende de este login de UI) no debería verse afectado — confirmar si vuelve a fallar mientras la cuenta esté bloqueada.

## Pendiente real

- [ ] Esperar a que Jorge (o DealerCenter) desbloquee la cuenta `jcalderon90` antes de retomar cualquier tarea que necesite la UI de DealerCenter.
- [ ] Una vez desbloqueada, confirmar si sigue pidiendo MFA por SMS (visto el 2026-09-02) o si vuelve al comportamiento anterior (sesión recordada, sin 2FA).

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-02-dealercenter-roi-diagnostico-completo]]

## Actualización (misma sesión, más tarde 2026-09-03) — cuenta desbloqueada, password cambiada

Jorge avisó que ya recuperó acceso ("ya tengo acceso de nuevo a DC"). La password cambió a `Carwarriors100@` (la anterior `Dealermiami100@` ya no sirve; actualizado en la memoria de referencia del asistente).

**Se intentó loguear vía Playwright (skill `playwright-cli`) para revisar el ticket `#TICKET-20586098`:**
- Primer intento: `auth.dealercenter.net` devolvió 403 "Access denied" (WAF), igual con Chromium que con Chrome real — bloqueo por IP de la máquina, no de la cuenta. En un intento posterior el 403 ya no apareció (parece haber sido transitorio).
- Login con usuario+password pasó bien, pero el MFA fue problemático: pide SMS por defecto (numero al que el asistente no tiene acceso), cambiar a "Email" funciona, pero **dos veces seguidas el flujo regresó a la pantalla de login completa en vez de aceptar el código o mostrar "código inválido"** — no fue un tema de código vencido, parece detección de automatización de Auth0 reseteando la sesión. Se decidió no seguir insistiendo (mismo patrón de reintentos que causó el bloqueo de cuenta original) y pedirle a Jorge que entrara él mismo.
- **Jorge confirmó manualmente que el ticket #TICKET-20586098 sigue Open, sin respuesta de soporte** (mismo estado que el 2026-08-29, sin cambios).

Detalle técnico completo (para no repetir el intento fallido en el futuro) guardado en la memoria de referencia del asistente (`reference-dealercenter-login-credentials`).

## Pendiente real (actualizado)

- [x] Cuenta desbloqueada (2026-09-03) — password actualizada a `Carwarriors100@`.
- [ ] Ticket `#TICKET-20586098` sigue Open sin respuesta de soporte — seguir esperando, sin acción nueva posible de este lado.
- [ ] Login por Playwright a DealerCenter no es confiable por el loop de MFA/Auth0 — si se necesita automatizar en el futuro, probablemente convenga que Jorge inicie sesión manualmente primero (con "Remember this device" activo) y reutilizar ese mismo perfil persistente de Playwright, en vez de un login limpio.

## Segundo intento, misma sesión más tarde — mismo loop confirmado, no es un incidente aislado

Motivo: retomar el reporte mensual de ventas ([[2026-09-03-workflow-reporte-mensual-ventas-slack]]) chequeando si DealerCenter tiene, en **Reports → Schedules**, un tipo de reporte de ventas/deals cerrados que se pudiera programar directamente (mismo mecanismo ya usado para `FORJADO Lead Sync` e inventario) — evitaría depender de que Bianca/DealerCenter manden una muestra. Jorge pidió explícitamente intentar por Playwright pese al riesgo ya documentado.

- Perfil persistente nuevo (`dc`), login limpio: esta vez **sin 403 de WAF** (confirma que el 403 de la vez anterior fue transitorio/por IP, no del lado de la cuenta). Usuario+password (`jcalderon90` / `Carwarriors100@`) aceptados sin problema.
- Pantalla MFA por defecto: SMS. Cambiado a "Email" igual que la vez anterior.
- No hay forma de leer el código de 6 dígitos del correo `jcalderon900610@gmail.com` desde este entorno (no hay credencial de Gmail propia en Playwright; el MCP `n8n-carwarriors` — que sí tiene una credencial Gmail OAuth ya conectada a ese buzón y podría haberse usado para leerlo — estaba caído en este momento). Se le pidió el código a Jorge.
- Jorge indicó que el primer código ya había expirado y pidió reenviar uno nuevo. Al hacer clic en **"Resend"**, el flujo **no reenvió nada — saltó directo a la pantalla completa de login** (mismo patrón exacto del intento anterior, esta vez disparado por "Resend" en vez de por el código). **Confirma que no es un caso aislado ni un tema de timing: es un comportamiento reproducible del MFA por email de DealerCenter/Auth0 contra Playwright.**
- Se detuvo la sesión ahí (browser cerrado) sin reintentar de nuevo, para no repetir el patrón que causó el bloqueo de cuenta original.

**Conclusión reforzada:** login por Playwright a DealerCenter no es viable hoy para nada que pase por el MFA por email — ni para el primer código ni para un reenvío. La única vía confiable sigue siendo que Jorge entre manualmente. Para el chequeo puntual de Reports → Schedules (¿existe un reporte de ventas/deals programable ahí?), pendiente que Jorge lo revise él mismo cuando pueda — 2 minutos, evita el riesgo de un tercer bloqueo de cuenta.
