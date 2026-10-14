---
tags: [forjado, interno, producto-propio, pendientes, roadmap]
tipo: proyecto
estado: activo
servicio: desarrollo-de-software
creado: 2026-10-05
actualizado: 2026-10-14
fuente_raw: raw/interno/2026-10-05-proyectos-pendientes-barberias-y-callacar-cuba-y-revision-vitrina
---

# Productos propios FORJADO — en desarrollo y por desarrollar

> [!info] Cómo leer esta página
> Cola de productos propios. Solo el estado actual; el detalle de cómo se llegó a esto está en [[../../raw/interno/2026-10-05-proyectos-pendientes-barberias-y-callacar-cuba-y-revision-vitrina|raw (2026-10-05)]] y notas raw individuales.

| # | Producto | Estado | Dónde |
|---|---|---|---|
| 1 | **Vitrina** | 🟡 En desarrollo, MVP sin completar | `aplicaciones/vitrina/` |
| 2 | **App para barberías y peluquerías** | ⬜ Por desarrollar (solo idea) | sin repo |
| 3 | **App de transporte en triciclos eléctricos para Cuba** | ⬜ Por desarrollar (solo idea) | sin repo |
| 4 | **App para gestores de ventas de casas en Cuba** | ⬜ Por desarrollar (solo idea) | sin repo |
| 5 | **App para venta de medicamentos** | ⬜ Por desarrollar (solo idea) | sin repo |

Prioridad: Vitrina primero; los otros entran más adelante según Jorge, sin fecha.

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

## 3. App de transporte en triciclos eléctricos para Cuba (por desarrollar)

Antes anotada como "tipo Call a Car para Cuba" ([[../clientes/callacar]] fue solo la referencia original). El 2026-10-13 Jorge la aclaró: **app para clientes y choferes para pedir taxis**, pensada para los **triciclos eléctricos ("motorcitos")** de alquiler o pasaje que hay hoy en Cuba. Detalle en [[../../raw/interno/2026-10-13-idea-app-transporte-triciclos-electricos-cuba|raw (2026-10-13)]].

Ideas planteadas (sin desarrollar, Jorge las ampliará luego):

- Clientes ven la posición/distancia del motorcito más cercano y piden el transporte.
- Choferes comparten su posición para ser vistos y solicitados.
- Mapa con las **piqueras** de motorcitos.
- Precio del pasaje; en los de alquiler, precio de cada chofer.

Debe heredar las restricciones de diseño para Cuba que ya documenta Vitrina (conectividad escasa y cara, pagos sin Stripe/PayPal, servicios de EE. UU. con restricciones, hosting portable): ver secciones 5 y 7.1 del plan de Vitrina.

- [ ] Desarrollar la idea con Jorge (ciudades iniciales, web o móvil, modelo de negocio).
- [ ] Definir cómo se paga y se verifica a choferes, y la parte legal local.
- [ ] Crear plan de desarrollo propio antes de escribir código.

## 4. App para gestores de ventas de casas en Cuba (por desarrollar)

Anotada el 2026-10-14 por indicación de Jorge: **aplicación dirigida a gestores de ventas de casas** (compraventa de viviendas e intermediación inmobiliaria en Cuba). Detalle en [[../../raw/interno/2026-10-14-idea-app-gestores-ventas-casas-cuba|raw (2026-10-14)]].

Contexto e ideas iniciales:
- En Cuba el mercado de compraventa de inmuebles opera fuertemente a través de gestores independientes con carteras de propiedades.
- Herramienta para gestión de inmuebles, fichas técnicas, filtrado de propiedades por zona y contacto entre gestores, propietarios y compradores.
- Debe contemplar las mismas restricciones de conectividad y entorno Cuba que Vitrina (optimización de datos móviles, arquitectura ligera, métodos de pago o cobro viables en la isla).

- [ ] Definir alcance, módulos y modelo de negocio con Jorge.
- [ ] Definir si será Web/PWA offline-first o aplicación móvil.
- [ ] Crear plan de desarrollo antes de comenzar implementación.

## 5. App para venta de medicamentos (por desarrollar)

Anotada el 2026-10-14 por indicación de Jorge: **aplicación para la venta de medicamentos** (catálogo, disponibilidad y búsqueda de medicamentos e insumos médicos). Detalle en [[../../raw/interno/2026-10-14-idea-app-venta-medicamentos|raw (2026-10-14)]].

Contexto e ideas iniciales:
- Gran demanda y necesidad de localización rápida de medicamentos escasos o distribuidos de forma dispersa.
- Puede operar como directorio de disponibilidad, catálogo de farmacias/vendedores particulares y canal de contacto directo.
- Requiere revisión de regulaciones locales sobre medicamentos y recetas, además de diseño optimizado para conexiones inestables o de bajo ancho de banda.

- [ ] Definir mercado inicial (Cuba u otro), alcance y modelo operativo con Jorge.
- [ ] Analizar consideraciones regulatorias y legales de intermediación de fármacos.
- [ ] Crear plan de desarrollo propio antes de escribir código.

## Relacionado

- [[mapa-forjado]]
- [[estado-proyecto]]
- [[../clientes/callacar]]

