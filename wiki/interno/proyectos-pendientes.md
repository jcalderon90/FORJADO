---
tags: [forjado, interno, producto-propio, pendientes, roadmap]
tipo: proyecto
estado: activo
servicio: desarrollo-de-software
creado: 2026-10-05
actualizado: 2026-10-05
fuente_raw: raw/interno/2026-10-05-proyectos-pendientes-barberias-y-callacar-cuba-y-revision-vitrina
---

# Productos propios FORJADO — en desarrollo y por desarrollar

> [!info] Cómo leer esta página
> Cola de productos propios. Solo el estado actual; el detalle de cómo se llegó a esto está en [[../../raw/interno/2026-10-05-proyectos-pendientes-barberias-y-callacar-cuba-y-revision-vitrina|raw (2026-10-05)]].

| # | Producto | Estado | Dónde |
|---|---|---|---|
| 1 | **Vitrina** | 🟡 En desarrollo, MVP sin completar | `aplicaciones/vitrina/` |
| 2 | **App para barberías y peluquerías** | ⬜ Por desarrollar (solo idea) | sin repo |
| 3 | **App tipo Call a Car para Cuba** | ⬜ Por desarrollar (solo idea) | sin repo |

Prioridad: Vitrina primero; los otros dos entran "dentro de poco" según Jorge (2026-10-05), sin fecha.

## 1. Vitrina (en desarrollo)

Vitrina digital + directorio + contacto directo para mypimes y particulares de Cienfuegos (Cuba). Dos repos (`vitrina-backend`, `vitrina-frontend`). Fuente de verdad: `aplicaciones/vitrina/vitrina-backend/docs/PLAN_DESARROLLO.md` (secciones 11 y 16 = estado y próximos pasos). Ficha en [[mapa-forjado]].

Verificado el 2026-10-05: backend con typecheck y lint limpios y 220 tests pasando; frontend con lint, typecheck y build limpios tras revertir un cambio accidental que bajaba Astro de 7 a 2.10.9 y limpiar 25 errores de lint (cambios sin commit; detalle en [[../../raw/interno/2026-10-05-proyectos-pendientes-barberias-y-callacar-cuba-y-revision-vitrina|raw]]).

- [x] ~~Revertir el cambio accidental de dependencias del frontend y limpiar el lint~~ — hecho 2026-10-05, sin commit.
- [ ] Revisar, commitear y desplegar el multi-negocio por cuenta (hasta 3 negocios, rutas por slug), hoy solo en el árbol de trabajo.
- [ ] Primera copia de seguridad real y ensayo de restauración (destino sin decidir).
- [ ] Dominio definitivo, pruebas con móvil real y datos de ETECSA, revisión legal local.
- [ ] Fase 0 de negocio: entrevistas con 8–10 negocios de Cienfuegos y análisis de competidores.
- [ ] Definir antes de construir: feed, gestores con comisión, ofertas de trabajo (secciones 20.1–20.4 del plan).

## 2. App para barberías y peluquerías (por desarrollar)

**Qué dijo Jorge:** aplicación **exclusiva** para barberías, peluquerías, y barberos y peluqueros **a domicilio**.

Sin definir: país/mercado, si es web, móvil o ambas, modelo de negocio, funciones (agenda/citas, catálogo de servicios, reservas a domicilio, pagos), y cuánto se parece o se separa de Vitrina.

- [ ] Definir alcance y mercado con Jorge.
- [ ] Crear plan de desarrollo propio (con el formato del de Vitrina) antes de escribir código.

## 3. App tipo Call a Car para Cuba (por desarrollar)

**Qué dijo Jorge:** aplicación similar a Call a Car pero para Cuba. Call a Car es el marketplace de transporte y fletes peer-to-peer de CALLACAR Transportation Pty Ltd (Australia); ver [[../clientes/callacar]].

> [!warning] Por confirmar
> Interpretación de trabajo, no confirmada: plataforma de transporte/fletes entre particulares adaptada a Cuba. Falta saber si es carga, pasajeros o ambos.

Debe heredar las restricciones de diseño para Cuba que ya documenta Vitrina (conectividad escasa y cara, pagos sin Stripe/PayPal, servicios de EE. UU. con restricciones, hosting portable): ver secciones 5 y 7.1 del plan de Vitrina.

- [ ] Confirmar el alcance exacto con Jorge.
- [ ] Definir cómo se paga y se verifica a conductores en Cuba, y la parte legal local.
- [ ] Crear plan de desarrollo propio antes de escribir código.

## Relacionado

- [[mapa-forjado]]
- [[estado-proyecto]]
- [[../clientes/callacar]]
