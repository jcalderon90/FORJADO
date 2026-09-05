---
tags: [forjado, cliente, carwarriors, dealercenter, auth0, mfa, hallazgo]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — "Trust this browser" de DealerCenter evita el MFA en logins posteriores (posible desbloqueo del muro de Auth0)

**Contexto:** retomando el pendiente pausado el 2026-09-02 (`[[2026-09-02-investigacion-dealercenter-tasks-viejos]]`) sobre automatizar la reasignación de tasks viejos — bloqueado en ese momento porque el JWT de sesión (Auth0) dura 10 minutos sin refresh persistido, mismo obstáculo que ya frenó 3 intentos previos de automatizar el refresh de fotos.

## Qué se probó

Durante esta misma sesión (mientras se verificaba el checkbox "Include in ROI"), se hizo login manual-asistido a DealerCenter con Playwright (perfil persistente `dc`, MFA por email con código pasado por Jorge) y se aceptó el diálogo **"Trust this browser? Would you like to trust this browser for QR Code Sign In? You won't be asked again on this browser."**

Más tarde en la misma sesión:
1. Se cerró el browser por completo (`playwright-cli close`, mata el proceso) y se reabrió con el mismo perfil persistente unos minutos después → **quedó logueado sin ningún prompt**, fue directo al dashboard.
2. Se repitió el ciclo completo (cerrar + reabrir) ~1 hora después → esta vez sí pidió login, pero **solo usuario + contraseña — sin ningún prompt de MFA**.

## Por qué importa

El obstáculo documentado en el 09-02 y en los 3 intentos previos de automatizar fotos era el **MFA** (código por SMS/email, requiere intervención humana en cada ciclo) — no el login básico en sí. Si el dispositivo/perfil queda "trusted" de forma persistente (más allá de la sesión, sobrevive a reinicios del proceso del navegador), un script podría re-loguearse con usuario+contraseña (dato que sí se puede automatizar sin humano, ya está en credenciales) cada vez que necesite un JWT fresco, sin jamás tocar el MFA de nuevo — eliminando el cuello de botella real.

## Lo que NO está confirmado todavía (importante no sobre-afirmar)

- **No se confirmó cuánto dura el "trust"** — DealerCenter menciona "30 days" en el diálogo de MFA por SMS visto antes, pero no está verificado si el trust de este diálogo específico (QR Code Sign In) tiene la misma duración, ni qué pasa pasados esos 30 días.
- **No se confirmó si esto es robusto a ejecutarse desde un entorno headless/servidor de verdad (VPS/n8n) en vez de esta máquina de Claude Code** — los 3 intentos previos de automatizar fotos fueron bloqueados específicamente por anti-bot en escenarios headless/Xvfb/VNC. El user-agent de esta sesión mostró literalmente `HeadlessChrome/152.0.0.0` y no fue bloqueado esta vez, pero es una sola prueba, no una confirmación de que el anti-bot no actúe bajo otras condiciones (IP del VPS, fingerprint distinto, volumen de requests).
- **No se confirmó si el perfil de navegador persistente (cookies/localStorage) es portable** — es decir, si se puede copiar este perfil ya "trusted" a un entorno de producción (VPS) y seguir funcionando ahí, o si el trust está atado a alguna huella de este dispositivo específico.
- No se probó si el JWT se puede extraer y reusar directamente sin pasar por el navegador cada vez (evitaría hasta el costo de un login completo), solo se confirmó que el re-login es rápido y sin MFA.

## Conclusión

Señal prometedora, no un desbloqueo confirmado. Antes de invertir tiempo construyendo la automatización real (reasignación de tasks, o retomar fotos), habría que:
1. Confirmar la duración real del trust (probar en varios días).
2. Probar si el mismo perfil persistente funciona igual desde el VPS (no solo desde esta máquina).
3. Recién ahí decidir si vale la pena construir el script/workflow.

## Actualización (2026-09-04, misma sesión) — prueba de portabilidad al VPS: inconclusa

Jorge habilitó acceso SSH al VPS (`ssh carwarriors-vps`, ver `[[carwarriors-ssh-vps-acceso]]` en memoria) específicamente para poder correr esta prueba. Se copió el perfil de navegador ya "trusted" (61MB, cookies + localStorage) al VPS vía `scp`, y se corrió un contenedor Docker con la imagen oficial `mcr.microsoft.com/playwright:v1.48.0-jammy` cargando ese perfil en modo headless (`--no-sandbox`) contra `https://app.dealercenter.net`.

**Resultado:** la sesión copiada ya no era válida — redirigió a `auth.dealercenter.net/u/login`, pidiendo login desde cero. Esto es esperable (en esta misma máquina, la sesión también expiró tras ~1h de inactividad) y **no responde la pregunta real** de si el anti-bot bloquea un login headless corriendo físicamente desde el VPS (IP de datacenter, mismo tipo de entorno que bloqueó los 3 intentos previos de automatizar fotos).

El siguiente paso lógico —intentar un login real (usuario+contraseña) desde ese mismo contenedor para ver si el anti-bot lo bloquea ahí— **no se completó**: el clasificador de permisos bloqueó el comando por incluir la contraseña en texto plano dentro de un script enviado por SSH al servidor. Se le preguntó a Jorge cómo seguir (autorizar igual, usar variable de entorno, probar visualmente vía VNC, o parar) y **decidió parar por hoy** — no se insistió más.

**Conclusión final de esta ronda:** la pregunta de fondo (¿el anti-bot bloquea en el entorno real del VPS?) **sigue sin responderse**. Lo único confirmado es que la sesión no es portable tal cual (expira igual, sin relación con el servidor). Antes de retomar, se necesitaría repetir el intento de login real desde el VPS con alguna vía que no dispare el bloqueo del clasificador (variable de entorno, o que Jorge mismo escriba la contraseña en una sesión interactiva).

Artefactos de la prueba (perfil copiado, scripts, capturas) fueron eliminados del VPS y de esta máquina al cerrar — no quedó ninguna cookie de sesión ni contraseña persistida en el servidor.

## Pendiente real

- [ ] Decidir con Jorge si vale la pena repetir la prueba de login real desde el VPS (vía env var o interactivamente) antes de invertir en construir la automatización de tasks viejos o de fotos, dado el historial de intentos fallidos y que la pregunta de fondo sigue sin respuesta.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-02-investigacion-dealercenter-tasks-viejos]]
