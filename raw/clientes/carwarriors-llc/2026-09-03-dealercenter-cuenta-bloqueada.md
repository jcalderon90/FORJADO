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
