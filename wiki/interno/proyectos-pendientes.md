---
tags: [forjado, interno, producto-propio, pendientes, roadmap]
tipo: proyecto
estado: activo
servicio: desarrollo-de-software
creado: 2026-10-05
actualizado: 2026-11-20
fuente_raw: raw/interno/2026-10-05-proyectos-pendientes-barberias-y-callacar-cuba-y-revision-vitrina
---

# Productos propios FORJADO — en desarrollo y por desarrollar

> [!info] Cómo leer esta página
> Cola de productos propios. Solo el estado actual; el detalle de cómo se llegó a esto está en [[../../raw/interno/2026-10-05-proyectos-pendientes-barberias-y-callacar-cuba-y-revision-vitrina|raw (2026-10-05)]] y notas raw individuales.

| # | Producto | Estado | Dónde |
|---|---|---|---|
| 1 | **Vitrina** | 🟢 Hardening & Features OK (`368/368` tests backend `a4af21c`, `74` archivos `febe105` + `81` archivos `493833f` OK) | `aplicaciones/forjado/vitrina/` |
| 2 | **Time Control (Calibre)** | 🟢 En producción (Calibre) — Dokploy + R2 activos, `510/510` tests (`882b8c5`), `9fb0737` CSP, Piloto #1 activo (All Print) | `aplicaciones/forjado/calibre/` (3 repos) |
| 3 | **App para barberías y peluquerías** | ⬜ Por desarrollar (solo idea) | sin repo |
| 4 | **App de transporte en triciclos eléctricos para Cuba** | ⬜ Por desarrollar (solo idea) | sin repo |
| 5 | **App para gestores de ventas de casas en Cuba** | ⬜ Por desarrollar (solo idea) | sin repo |
| 6 | **App para venta de medicamentos** | ⬜ Por desarrollar (solo idea) | sin repo |

Prioridad activa: Vitrina y adaptación de Time Control; los productos 3 al 6 permanecen en conceptualización.

## 1. Vitrina (en desarrollo)

Vitrina digital + directorio + contacto directo para mypimes y particulares de Cienfuegos (Cuba). Dos repos (`vitrina-backend`, `vitrina-frontend`). Fuente de verdad: `aplicaciones/forjado/vitrina/vitrina-backend/docs/PLAN_DESARROLLO.md` (secciones 11 y 16 = estado y próximos pasos). Ficha en [[mapa-forjado]].

Verificado el 2026-11-20: backend con `lint`, `typecheck`, `build` y **368/368 tests pasando (24 suites, 0 vulnerabilidades en `npm audit`)** tras el hardening **40 Reglas** (`a4af21c`, plan en `5a4a9c6`); frontend con `astro check` (**74 archivos, 0 errores**) y `build` limpios con `BoneyardSkeleton` + `.HEIC` (`febe105`); `vitrina-spatial` con **81 archivos `astro check`**, `build` y Edge headless `0` errores con `PaperDollTryOnShowroom` + `.HEIC` (`493833f`), además de la auditoría de lógica de negocio previa (`9082008` y `930da87`; detalle en [[../../raw/interno/2026-11-14-vitrina-auditoria-logica-negocio-categorias-unidades|raw (2026-11-14)]]).

- [x] ~~Revertir el cambio accidental de dependencias del frontend y limpiar el lint~~ — hecho 2026-10-05.
- [x] ~~Módulo de gestores con comisión e inventario conectado al flujo de pedidos~~ — integrado en `orderService` (`stockQty`, `StockMovementModel`, `SaleModel`) el 2026-11-14.
- [x] ~~Hacer `commit` y `push` de las mejoras de lógica de negocio del 2026-11-14 en `vitrina-backend` y `vitrina-frontend`.~~ — pusheado a `main` (`9082008` y `930da87`).
- [x] ~~Rediseñar el Showroom de Perfumería en `vitrina-spatial` (`PerfumeNicheShowroom.tsx`) para destacar los pomos sobre el fondo y escalar a nuevos perfumes~~ — hecho 2026-11-16 (prototipado en FigCraft MCP e implementado con podios LED, pomos 3D en relieve y filtros por familia olfativa; commiteado y pusheado en `vitrina-spatial` `d5d31dc`, árbol limpio).
- [ ] Configurar secrets de firma Android en `vitrina-frontend` (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`).
- [ ] Primera copia de seguridad real de MongoDB Atlas y ensayo de restauración.
- [ ] Dominio definitivo HTTPS, pruebas con móvil real y datos de ETECSA, revisión legal local.
- [ ] Fase 0 de negocio: entrevistas con 8–10 negocios de Cienfuegos y análisis de competidores.
- [ ] Definir antes de construir: feed y ofertas de trabajo (secciones 20.1 y 20.4 del plan).
- [x] *Implementados referentes UI/UX clave (`2026-11-20`):* Skeletons geométricos `CLS = 0` (`BoneyardSkeleton.astro`) integrados en `vitrina-frontend` para 3G/4G ETECSA, **Probador Paper-Doll `1080×1350`** (`Hanzife Pro V1.1` en `$0` API runtime) + **Combo Look `-10%`** (`Try the Look`) en `vitrina-spatial` (`PaperDollTryOnShowroom.tsx` / `/demo/probador`) y soporte preventivo `.HEIC` en `src/lib/image.ts`.
- [x] *Hardening backend 40 Reglas completado (`2026-11-20`, `a4af21c`):* auditoría de seguridad, `npm audit` `0` vulnerabilidades, `@fastify/helmet`, `sanitizeFilter`, cookie simétrica, privacidad IA/pedidos, `crypto.randomInt`, escape HTML Telegram, rate limits y honeypots en `vitrina-backend`. *Restante al lanzar dominio HTTPS:* rotación de clave Atlas, backups reales, bloque B/SEO en frontend y evaluar arquetipos comerciales 1-foto (`/detail-closeup`, `/tabletop-ad`) + giro 90° `NIKE` en perchero (ver Obsidian `HERRAMIENTAS/Biblioteca de Referencias Modernas - Auditoria imgs.md`).

## 2. Time Control / Calibre (en producción — Piloto #1 activo)

Suite empresarial de control horario, monitoreo de productividad y liquidación de nóminas (ahora **Calibre**). Incorporada al catálogo de FORJADO el 2026-11-04. Tres repositorios independientes en `FORJADO-AGENCY`: Backend Node.js/Express/Mongo/R2, Frontend React 19/Tailwind/Vite, Desktop Electron/SQLite.

- **Fuente de verdad:** [`aplicaciones/forjado/calibre/STATUS.md`](../../../aplicaciones/forjado/calibre/STATUS.md). Ficha técnica en [[productos/time-control]] y cliente piloto en [[../clientes/all-print]].
- [x] ~~**Branding:** Reemplazar identidad `LogYourTime` por marca Calibre / FORJADO (`#E85D04` / `#111111`) en Web y Desktop.~~ — completado 2026-11-07.
- [x] ~~**Infraestructura:** Desplegar backend y frontend en Dokploy (Oracle VPS `129.213.108.102`) con MongoDB Atlas y Cloudflare R2 (`calibre-screenshots`).~~ — completado 2026-11-07.
- [x] ~~**Empaquetado B2B:** Estructurar pricing comercial y activar Cliente Piloto #1 (**All Print**, 60 días Plan Pro bonificados).~~ — completado 2026-11-10.
- [x] ~~**Hardening y Build (`2026-11-20`):** Corregido bug CSP en `configure-nginx-api.cjs` (`9fb0737`), cerrados whitelists anti-*mass assignment* en backend (**510/510** tests en `882b8c5`) e instalador Windows `Calibre-Setup-1.2.9.exe` compilado en `release/`.~~ — pendiente pulsar **Redeploy** manual en Dokploy, correr prueba E2E desktop, reservar IP en Oracle (`129.213.108.102`) y acompañar retención/capturas del piloto All Print.

## 3. App para barberías y peluquerías (por desarrollar)

**Qué dijo Jorge:** aplicación **exclusiva** para barberías, peluquerías, y barberos y peluqueros **a domicilio**.

Sin definir: país/mercado, si es web, móvil o ambas, modelo de negocio, funciones (agenda/citas, catálogo de servicios, reservas a domicilio, pagos), y cuánto se parece o se separa de Vitrina.

- [ ] Definir alcance y mercado con Jorge.
- [ ] Crear plan de desarrollo propio (con el formato del de Vitrina) antes de escribir código.
- [ ] *Referentes UI/UX auditados (2026-11-19):* Dirección de arte **Dark Luxury** (`Barbería` negro/oro/mármol/rim-light, secciones `PRECISION. STYLE. CONFIDENCE.`, `HAIRCUT / BEARD SCULPTING / PREMIUM STYLING`, `THE CRAFT`) combinada con el patrón **Slide-over Booking Drawer + Mini-CRM de Leads** de `Car Detailing ($1,500)` para reservar citas sin salir del flujo visual (ver Obsidian `HERRAMIENTAS/Biblioteca de Referencias Modernas - Auditoria imgs.md`).

## 4. App de transporte en triciclos eléctricos para Cuba (por desarrollar)

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

## 5. App para gestores de ventas de casas en Cuba (por desarrollar)

Anotada el 2026-10-14 por indicación de Jorge: **aplicación dirigida a gestores de ventas de casas** (compraventa de viviendas e intermediación inmobiliaria en Cuba). Detalle en [[../../raw/interno/2026-10-14-idea-app-gestores-ventas-casas-cuba|raw (2026-10-14)]].

Contexto e ideas iniciales:
- En Cuba el mercado de compraventa de inmuebles opera fuertemente a través de gestores independientes con carteras de propiedades.
- Herramienta para gestión de inmuebles, fichas técnicas, filtrado de propiedades por zona y contacto entre gestores, propietarios y compradores.
- Debe contemplar las mismas restricciones de conectividad y entorno Cuba que Vitrina (optimización de datos móviles, arquitectura ligera, métodos de pago o cobro viables en la isla).

- [ ] Definir alcance, módulos y modelo de negocio con Jorge.
- [ ] Definir si será Web/PWA offline-first o aplicación móvil.
- [ ] Crear plan de desarrollo antes de comenzar implementación.
- [ ] *Referentes auditados (2026-11-19):* Recorridos 3D ultraligeros en un solo HTML sin assets externos (`recorrido.html`, `Método 1`), ficha con semáforo en tiempo real + **`Consultar por WhatsApp`** (`Paraíso del Urubó`), foco en **compradores en el exterior / diáspora** con mapas por radios `1/3/5 KM` (`Navigo Web`), modo remodelación *Antes/Después* (`Método 2` Prompt 5/7) y patrón de recorrido por scroll + calendario (`Casa Rural Olivar`). Ver Obsidian `HERRAMIENTAS/Biblioteca de Referencias Modernas - Auditoria imgs.md`.

## 6. App para venta de medicamentos (por desarrollar)

Anotada el 2026-10-14 por indicación de Jorge: **aplicación para la venta de medicamentos** (catálogo, disponibilidad y búsqueda de medicamentos e insumos médicos). Detalle en [[../../raw/interno/2026-10-14-idea-app-venta-medicamentos|raw (2026-10-14)]].

Contexto e ideas iniciales:
- Gran demanda y necesidad de localización rápida de medicamentos escasos o distribuidos de forma dispersa.
- Puede operar como directorio de disponibilidad, catálogo de farmacias/vendedores particulares y canal de contacto directo.
- Requiere revisión de regulaciones locales sobre medicamentos y recetas, además de diseño optimizado para conexiones inestables o de bajo ancho de banda.

- [ ] Definir mercado inicial (Cuba u otro), alcance y modelo operativo con Jorge.
- [ ] Analizar consideraciones regulatorias y legales de intermediación de fármacos.
- [ ] Crear plan de desarrollo propio antes de escribir código.

> [!info] Estándar transversal de QA Pre-Deploy (Auditoría 2026-11-19)
> Para todos los productos anteriores (activos y futuros), aplicar la **Checklist de 40 Reglas** (20 de seguridad API/DB/Auth + 20 pre-lanzamiento SEO/OG/WCAG/GA4/404/Anti-Spam) y skeletons `CLS = 0` tipo `Boneyard` documentados en Obsidian (`HERRAMIENTAS/Biblioteca de Referencias Modernas - Auditoria imgs.md`).

## Relacionado

- [[mapa-forjado]]
- [[estado-proyecto]]
- [[../clientes/callacar]]

