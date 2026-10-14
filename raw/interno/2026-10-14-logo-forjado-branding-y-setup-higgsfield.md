---
tags: [forjado, interno, marca, logo, branding, higgsfield, identidad-visual]
tipo: raw
cliente: FORJADO (interno)
fecha: 2026-10-14
---

# Logo nuevo de FORJADO, piezas de marca y setup de Higgsfield

Continuación de [[2026-10-14-idea-app-venta-medicamentos]] (misma fecha, otra sesión de trabajo). Compilado en [[../../wiki/interno/marca/identidad-visual|wiki/interno/marca/identidad-visual]].

## 1. Higgsfield (generación de imagen/video) instalado

- **CLI** `@higgsfield/cli` 1.1.26 instalado global con npm (npm avisó que no corrió su `postinstall`; el CLI funciona igual).
- **Login:** el primer `higgsfield auth login` caducó a los 5 min sin aprobación en el navegador; Jorge lo repitió con `! higgsfield auth login` y funcionó. Cuenta `jcalderon900610@gmail.com`, plan **free**, único workspace `Private` (hubo que seleccionarlo con `higgsfield workspace set`).
- **Skills** (`npx skills add higgsfield-ai/skills`): 8 instaladas **en este repo** (`.agents/skills/` y `.claude/skills/`, más `skills-lock.json`): brandkit, generate, marketplace-cards, product-photoshoot, soul-id, video-explainer, websites, youtube-thumbnail. El instalador marcó "High Risk" (evaluación de Gen) a marketplace-cards, product-photoshoot, video-explainer y youtube-thumbnail; las skills corren con permisos completos del agente.
- **Créditos:** 10 al empezar. Una imagen `nano_banana_2` cuesta 2; una generación vectorial `recraft_v4_1` cuesta 10. Se gastaron 8 (1 imagen de prueba + 3 conceptos de logo); **quedan 2**.
- **Limitación:** el flujo completo de `higgsfield-brandkit` no era viable: pide 3 candidatos con Recraft (30 créditos) y usa `python3`, que no está instalado en esta máquina (solo el alias de la Microsoft Store). Se hizo el trabajo vectorial con Node (opentype.js + sharp), sin gastar créditos.

## 2. Logo

- **Antecedentes:** en `wiki/interno/marca/logos/` ya había dos candidatos del 2026-09-16 (`PosibleLogo1/2.png`, ilustración de un herrero con martillo y yunque); `PosibleLogo2` es el que usaba `aplicaciones/call-a-car-web/public/forjado-logo.*`. La guía de identidad visual decía "logo pendiente de crear" y no los mencionaba.
- **Proceso:** 3 conceptos con `nano_banana_2` → se rehízo el concepto con yunque y chispa como SVG (tres siluetas distintas del yunque; ninguna convenció a Jorge) → Jorge señaló dos de los conceptos generados como la "onda" que quería (wordmark pesado y ancho; monograma F angular; "O" naranja con chispa) → dos direcciones vectoriales → **elegida la 2: monograma "F" de tres astillas con chaflán + wordmark pesado.**
- **Resultado:** monograma F en naranja `#E85D04` + wordmark **Archivo Black** ensanchado 112 % (tracking 0.012em), texto convertido a trazos. 10 SVG (vertical / horizontal / símbolo × color, mono blanco, invertido) + avatar circular 800×800 + variante sobre fondo claro (F naranja + wordmark carbón). Archivos en `wiki/interno/marca/logo/`.
- **Tipografía:** el wordmark **no** es Space Grotesk (la guía decía Space Grotesk para todo); Jorge prefirió este estilo. Space Grotesk sigue para texto/interfaz. De paso: Space Grotesk solo llega a peso 700, no a 800 como decía la guía.
- Reemplazado el logo del herrero en `aplicaciones/call-a-car-web/public/forjado-logo.{svg,png}` por el avatar circular nuevo (con visto bueno de Jorge). Ningún archivo fuente de esa web lo referencia; se añadió el 25-sep junto al widget de soporte (hoy oculto), probablemente solo lo usa el avatar de Chatwoot. **Cambio sin commitear en el repo `call-a-car-web`.**

## 3. Decisión de alcance (Jorge, 2026-10-14)

El logo y el branding aplican **solo a los productos propios de FORJADO** (`lead-discovery`, `portfolio-dev`, `vitrina`), no a proyectos de clientes (CallaCar, Carwarriors, Varela Law), que conservan su marca. Ljörk y NERINE (`contenido/`) tienen identidad propia. Registrado en la wiki y en la memoria de Claude (`project-branding-forjado`). Abierto: si `vitrina` lleva marca FORJADO o una propia; y no se ha revisado cuánto de la paleta/tipografía usan ya los tres productos propios.

## 4. Piezas de marca generadas (todas en `wiki/interno/marca/`)

- `favicon/`: `favicon.svg`/`.ico` y PNG 16/32/48/180/192/512. A 16 px la F normal se empastaba; 16–48 px usan una variante **mini** (astillas más gruesas, huecos más anchos).
- `firma-correo/`: `firma.html` + `firma-logo.png`. Requiere alojar el PNG en una URL pública; correo/teléfono/web van como `[campos]` (no hay datos de contacto de FORJADO en la bóveda); nombre "Jorge Calderón · Fundador" es propuesta.
- `banners/`: LinkedIn 1584×396 y portada web 1920×1080.
- `plantillas-redes/`: post 1080×1080, story 1080×1920, og 1200×630 (texto de ejemplo).
- `_generador/`: `final.mjs` y `piezas.mjs` para regenerar (deps: opentype.js, sharp, `@fontsource/archivo-black`, `@fontsource/space-grotesk`).
- **Bug a evitar:** `toPathData()` de opentype.js emite `NaN` con algunos valores (x grandes y también glifos sueltos); `piezas.mjs` serializa los trazos a mano.
- Páginas de vista previa: `logo/vista-previa.html` y `vista-previa-piezas.html`.

## 4b. Borradores de texto añadidos (por validar por Jorge)

Propuestas marcadas `> [!tip] Propuesta (2026-10-14)` bajo cada pendiente de `identidad-de-marca` (visión a 2030, segmentos prioritarios, frase de posicionamiento), `posicionamiento-y-mensaje` (casos reales sin cifras y sin nombrar al cliente: bufete de Miami y concesionario; Rogers aún no es caso entregado) y `manifiesto` (estructura con lo verificable; **el motivo personal solo lo puede aportar Jorge**). Las tres notas siguen en estado `borrador`.

## Pendientes

- [ ] Jorge: validar o corregir los borradores de texto (visión, segmentos, caso, historia) y darme su motivo personal para el manifiesto.
- [ ] Completar los datos de contacto de la firma (correo, teléfono, web) y alojar `firma-logo.png` en una URL pública. Ver el pendiente existente de web/redes en [[../../wiki/interno/estado-proyecto]].
- [ ] Plantilla de propuesta con marca y plantilla de pitch deck (siguen sin hacerse).
- [ ] Decidir si `vitrina` usa marca FORJADO o propia; revisar los tres productos propios contra la paleta/tipografía.
- [ ] Verificar que el avatar nuevo se vea en Chatwoot tras desplegar `call-a-car-web`; si no cambia, subirlo a mano en el panel de Chatwoot.
- [ ] **Commit pendiente (repo `desarrollo`):** carpeta `wiki/interno/marca/` (logo, favicon, firma, banners, redes, generador), 4 notas de marca modificadas, esta nota y el estado, y las skills de Higgsfield (`.agents/`, `.claude/skills/`, `skills-lock.json`; Jorge decide si van en el mismo commit). **Commit pendiente (repo `call-a-car-web`):** los 2 archivos del logo.
- Quedan 2 créditos de Higgsfield (plan free).
