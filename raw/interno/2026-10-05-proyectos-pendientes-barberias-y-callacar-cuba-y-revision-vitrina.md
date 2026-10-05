---
tags: [forjado, interno, producto-propio, vitrina, pendientes, barberias, callacar-cuba]
tipo: raw
cliente: FORJADO (producto propio)
fecha: 2026-10-05
---

# 2026-10-05 — Dos aplicaciones nuevas por desarrollar + revisión del estado de Vitrina

## Petición de Jorge (textual)

> "quiero que veas bien la aplicacion vitrina que pertenece a nosotros de FORJADO, pero ademas que documentes que vamos a construir dentro de poco una aplicacion exclusiva para barberias, peluquerias y barberos y peluqueros a domicilio, y otra aplicacion similar a call a car pero para cuba, deja todo eso como pendientes a desarrollar, la de vitrina que ya esta en fase de desarrollo aun no la completamos"

## Lo que se registra como pendiente de desarrollar

Solo existe la idea y el nombre provisional; **no hay diseño, plan, repo ni fecha**. Jorge dijo "dentro de poco".

1. **App para el sector de la barbería y la peluquería.** Exclusiva para barberías, peluquerías, y barberos/peluqueros que trabajan **a domicilio**. Hoy no se ha dicho el país/mercado, el modelo de negocio, ni si es web, móvil o ambas.
2. **App "similar a Call a Car pero para Cuba".** Call a Car (CALLACAR Transportation Pty Ltd, Australia) es un marketplace de transporte y fletes peer-to-peer; ver `wiki/clientes/callacar.md`. Interpretación de trabajo: una plataforma de transporte/fletes entre particulares adaptada a Cuba. **Esta interpretación no la confirmó Jorge**; hay que validarla (¿fletes de carga, taxi de pasajeros o ambos?). Debe heredar las restricciones de diseño para Cuba ya documentadas en Vitrina (conectividad escasa y cara, pagos sin Stripe, servicios de EE. UU. con restricciones, ver secciones 5 y 7.1 de `aplicaciones/vitrina/vitrina-backend/docs/PLAN_DESARROLLO.md`).

Ambas quedan como **pendientes a desarrollar**, en cola detrás de Vitrina.

## Revisión de Vitrina (estado verificado el 2026-10-05)

Ubicación real: `aplicaciones/vitrina/` con dos repos independientes (`vitrina-backend`, `vitrina-frontend`, ambos en rama `main`, remoto `jcalderon90/...`). **El plan de desarrollo está en `vitrina-backend/docs/PLAN_DESARROLLO.md`** (no en la raíz de `vitrina/`, como decía la memoria y el mapa de la bóveda; ambos se corrigieron).

**Estado:** sigue en desarrollo, MVP sin completar. Plan v0.5 (Fase 1, bloque de MVP web). Hecho y desplegado: autenticación, negocio, catálogo con fotos, vitrina pública, admin y moderación, estadísticas, PWA, CSP, directorio `/negocios` (cerrado con `DIRECTORY_OPEN` hasta ~30 negocios), términos y privacidad, recuperación de contraseña, árbol de categorías administrable. Dominio con HTTPS provisional: `vitrinaf.duckdns.org`.

**Trabajo sin confirmar en git (sin commit ni despliegue):** el multi-negocio por cuenta (sección 20.2 del plan, decisiones del 2026-10-05): hasta 3 negocios por cuenta, `/panel` como lista, rutas por slug, `role` `user|admin`, migración al arrancar. Backend: 23 archivos modificados; frontend: 10 entre modificados y nuevos.

**Verificaciones ejecutadas hoy:**

| Comprobación | Backend | Frontend |
|---|---|---|
| Typecheck | ✅ sin errores | ✅ 0 errores, 4 hints (importaciones sin uso, código inalcanzable en `panel/[slug]/editar.astro`) |
| Lint | ✅ limpio | ❌ 26 errores en `public/sw.js`, `public/offline.js`, `src/env.d.ts`, `admin.astro`, `negocio.astro`, `negocios.astro` (variables sin usar como `CATEGORY_GROUPS`, `AdminCategoryItem`; referencia triple-slash) |
| Tests | ✅ 220 pasan (12 archivos) | no tiene suite de tests |
| Build | no ejecutado | ❌ **falla** (ver abajo) |

**Hallazgo importante, frontend:** `package.json` y `package-lock.json` tienen un cambio sin commitear que **baja `astro` de `^7.3.5` a `^2.10.9` y `@astrojs/node` de `^11.1.6` a `^5.3.4`**; `node_modules` tiene instalado Astro 2.10.9. Con eso `astro build` falla y el diff del lockfile es de ~9.900 líneas añadidas. Parece accidental (no coincide con ninguna decisión del plan, que fija Astro). Producción no se ve afectada mientras no se haga commit ni push de esos archivos, porque Dokploy construye desde `main` con Astro 7. No se tocó nada; queda pendiente que Jorge decida revertir (`git checkout package.json package-lock.json` y `npm ci`).

**Pendientes de Vitrina que siguen abiertos** (detalle en el plan, secciones 11 y 16): primera copia de seguridad real y ensayo de restauración (destino sin decidir); dominio definitivo; pruebas con móvil real y ETECSA; revisión legal local; SMTP opcional; Fase 0 de negocio sin empezar (entrevistas, análisis de BizneCubano/Revolico); definir feed, gestores con comisión (20.3) y ofertas de trabajo (20.4).

## Qué se cambió en la bóveda en esta sesión

- Nueva página `wiki/interno/proyectos-pendientes.md` (las dos apps nuevas, en cola).
- `wiki/index.md`, `wiki/interno/estado-proyecto.md` y `wiki/interno/mapa-forjado.md` actualizados; en el mapa se corrigió la ruta del plan de Vitrina y su estado.
- No se modificó código de Vitrina.

## Cierre (2026-10-05): correcciones aplicadas al frontend de Vitrina

Jorge respondió "haz lo que sea más recomendable" a la propuesta de revertir las dependencias y limpiar el lint. Se hizo en `aplicaciones/vitrina/vitrina-frontend`, **sin commit**:

- `git checkout -- package.json package-lock.json` (volvió Astro `^7.3.5` y `@astrojs/node` `^11.1.6`) y `npm ci`. Astro instalado: 7.3.5.
- Lint: se quitaron las importaciones sin usar (`CATEGORY_GROUPS` en `negocio.astro` y `negocios.astro`, `AdminCategoryItem` en `admin.astro`), `catch (error)` pasó a `catch` en `admin.astro`, y en `eslint.config.js` se añadió un bloque de variables globales del navegador para `public/**/*.js` (`sw.js`, `offline.js`).
- Resultado verificado: `eslint .` sin errores, `astro check` con 0 errores, 0 advertencias y 0 sugerencias (48 archivos), `astro build` completo. El backend no se tocó (sigue con 220 tests pasando).

Sigue pendiente de decisión de Jorge: revisar y commitear el multi-negocio por cuenta, que continúa sin commit en ambos repos.
