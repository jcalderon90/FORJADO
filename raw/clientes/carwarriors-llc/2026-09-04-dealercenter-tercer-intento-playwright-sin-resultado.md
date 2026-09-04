---
tags: [forjado, cliente, carwarriors, dealercenter, acceso, playwright, reporte-ventas]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Tercer intento de login por Playwright a DealerCenter: cortado por problemas de red, sin nuevo dato sobre el loop de MFA

**Contexto:** continuación directa de [[2026-09-03-dealercenter-cuenta-bloqueada]] (bloqueante del reporte mensual de ventas, [[2026-09-03-workflow-reporte-mensual-ventas-slack]]). Con 2 fallas ya documentadas el 09-03 (loop de Auth0 al ingresar el código de email, y otra vez al pedir "Resend"), Jorge pidió explícitamente intentarlo una tercera vez de todos modos ("entra tu con playwright").

## Qué se hizo distinto esta vez

Para no repetir el mismo camino que ya falló 2 veces, el plan era quedarse en el método **SMS** (el que aparece por defecto) en vez de cambiar a Email, y pedirle a Jorge el código de ahí directo — sin tocar "Try another method" ni "Resend", que son justo las dos acciones que dispararon el loop antes.

## Qué pasó

- Primer perfil persistente (`dc2`) abierto: `app.dealercenter.net` tardó en cargar de forma intermitente (mismo patrón de red inestable ya visto el 09-03: `ChunkLoadError`, `ERR_HTTP2_PING_FAILED` en cargas anteriores) — varios timeouts de navegación de 60s seguidos sin llegar a la pantalla de login.
- La sesión quedó interrumpida por el usuario antes de resolverse (se perdió el browser `dc2` entre turnos) y se abrió un tercer perfil (`dc3`) para reintentar desde cero.
- En paralelo, el MCP `n8n-carwarriors` (que había estado caído) volvió a conectar — se iba a evaluar usar su credencial Gmail ya conectada (`jcalderon900610@gmail.com`) para leer el código de verificación por API en vez de depender de Jorge, pero el usuario interrumpió el intento (`goto` rechazado) antes de que se pudiera intentar, para pivotar a actualizar el estado del proyecto (`/actualizar-estado`).
- **No se llegó a la pantalla de login ni a MFA en este tercer intento** — no hay ningún dato nuevo sobre si el método SMS (sin tocar "Try another method"/"Resend") evita o no el loop de Auth0. Sigue sin probarse.

## Estado real (sin cambios de fondo)

El bloqueo de fondo sigue igual que el 09-03: login automatizado a DealerCenter no es confiable para nada que dependa de completar el MFA. Este tercer intento no aportó evidencia a favor ni en contra de que el camino SMS-directo (sin resend) sea más confiable — quedó cortado por problemas de red antes de poder probarlo.

**Idea sin probar, para una próxima sesión si se retoma:** usar la credencial Gmail ya conectada en el MCP `n8n-carwarriors` (la que usan los triggers de Lead Sync / Inventory Sync) para leer el código de verificación por email vía un workflow temporal de solo lectura (mismo patrón ya usado antes para consultar Mongo directamente, ver [[2026-09-01-bot-invento-direccion-fisica-fix-guardrail]]) — evitaría depender de que Jorge esté disponible para pasar el código a tiempo. No intentado todavía.

## Pendiente real (sin cambios)

- [ ] Login por Playwright a DealerCenter sigue sin resolverse — 3 intentos, ninguno completó un login con MFA exitoso.
- [ ] Sigue pendiente que Jorge revise manualmente **Reports → Schedules** en DealerCenter para confirmar si existe un tipo de reporte de ventas/deals cerrados programable ahí (evitaría depender de que Bianca mande una muestra para el reporte mensual de ventas).
- [ ] Si se retoma la automatización del login en el futuro: probar la vía Gmail-por-n8n-MCP para leer el código en vez de pedírselo a Jorge, antes de descartar Playwright por completo.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-03-dealercenter-cuenta-bloqueada]]
- [[2026-09-03-workflow-reporte-mensual-ventas-slack]]
