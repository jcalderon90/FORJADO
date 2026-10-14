---
tags: [forjado, marca, visual]
tipo: marca
estado: activo
creado: 2026-06-17
actualizado: 2026-10-14
---

# Identidad Visual — FORJADO

> [!info] Guía de identidad visual
> Decisiones tomadas el 2026-06-17. Úsala como brief para diseñadores o como referencia directa en cualquier pieza.

---

## Alcance (decidido 2026-10-14)

Esta identidad (logo, paleta, tipografía y estilo) aplica **solo a los productos propios de FORJADO** y a la marca de la agencia: `lead-discovery`, `portfolio-dev` y `vitrina` (ver [[mapa-forjado]]). **No** se impone a los proyectos de clientes (CallaCar, Carwarriors, Varela Law): cada cliente conserva su marca. Ljörk y NERINE (`contenido/`) tienen identidad propia.

> [!todo] Por decidir: si `vitrina` (para mypimes de Cienfuegos) lleva la marca "FORJADO" o una marca propia. Aún no se ha revisado cuánto de la paleta/tipografía usan ya los tres productos propios.

## Concepto visual

**Herrería y metal forjado**: fondos carbón profundo, acento en naranja de brasa. Sensación de algo sólido, premium y hecho a mano. Sin decoración innecesaria — cada elemento tiene una razón de ser.

---

## Paleta de color

| Rol | Nombre | HEX | Uso |
|---|---|---|---|
| **Base principal** | Carbón profundo | `#111111` | Fondo principal |
| **Base secundaria** | Carbón medio | `#0F0F0F` | Fondo de secciones, cards |
| **Base terciaria** | Carbón claro | `#222222` | Bordes, divisores, superficies |
| **Acento principal** | Naranja forja | `#E85D04` | Botones, enlaces, CTAs, logotipo |
| **Texto principal** | Blanco suave | `#F5F5F5` | Texto sobre fondos oscuros |
| **Texto secundario** | Gris claro | `#999999` | Subtítulos, captions, metadatos |

**Regla de uso del acento:** el naranja va en elementos de acción y el logotipo. No como fondo de bloques de texto.

---

## Tipografía

| Uso | Fuente | Pesos | Fuente |
|---|---|---|---|
| **Todo** | Space Grotesk | 400 · 700 · 800 | Google Fonts |

Una sola familia tipográfica. Headings en 800, subtítulos en 700, cuerpo en 400.

**Letter-spacing:** 0.08–0.12em en el logotipo y labels en mayúsculas. Cero tracking en cuerpo de texto.

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;800&display=swap');
font-family: 'Space Grotesk', sans-serif;
```

---

## Logo

> [!success] Creado el 2026-10-14, aprobado por Jorge. Archivos en [`logo/`](logo/) (SVG vectoriales; PNG solo de referencia). Vista rápida: abrir `logo/vista-previa.html`.

**Concepto:** monograma **"F" de tres astillas** con chaflán (barra superior, tronco y brazo medio, como metal cortado en la forja) en naranja, sobre el wordmark **FORJADO** en blanco, pesado y ensanchado. Salió del concepto 1 de tres propuestas generadas con Higgsfield (`nano_banana_2`); se redibujó a mano en SVG con fuentes reales. El texto está convertido a trazos, así que no hace falta tener la fuente instalada.

> [!note] Tipografía del wordmark (distinta del resto de la marca)
> El wordmark usa **Archivo Black** (Google Fonts, licencia abierta) ensanchado 112 % en horizontal, con tracking 0.012em. **No es Space Grotesk**: Jorge descartó la versión con Space Grotesk y prefirió este estilo más pesado y ancho. Space Grotesk sigue siendo la tipografía de la interfaz y el texto (la tabla de arriba). Nota aparte: Space Grotesk solo llega a peso 700, no a 800.

**Descartados:** primera propuesta con yunque + chispa (tres variantes de silueta, ninguna convenció) y la dirección "wordmark Montserrat con la O naranja y chispas" (viable, pero se prefirió el monograma F).

Versiones producidas (`wiki/interno/marca/logo/`):
- [x] Logo principal vertical, color (F naranja + wordmark blanco): `forjado-logo-vertical-color.svg` (sobre carbón `#111111`)
- [x] Monocromo blanco: `forjado-logo-vertical-mono.svg` (para fondos oscuros o fotos)
- [x] Invertido (todo carbón `#111111`): `forjado-logo-vertical-invertido.svg` (para documentos sobre fondo blanco)
- [x] Horizontal y solo símbolo (la F), en las tres variantes: `forjado-logo-horizontal-*.svg`, `forjado-logo-simbolo-*.svg`
- [x] Avatar circular 800×800: `forjado-avatar-circular.svg` / `.png` (F naranja sobre círculo carbón)

Los SVG de color, mono e invertido son de fondo transparente; solo el avatar lleva fondo propio. Los PNG (`*-vertical-*`, `*-horizontal-color`, avatar) son de referencia para ver rápido, no para producción.

**Variante para fondo claro** (añadida 2026-10-14): `forjado-logo-vertical-color-claro.svg` y `forjado-logo-horizontal-color-claro.svg` (F naranja + wordmark carbón). Sirve para documentos, correo y cualquier fondo blanco donde se quiera conservar el naranja; el "invertido" sigue siendo todo carbón.

**Antecedentes:** en `marca/logos/` quedan los dos candidatos del 2026-09-16 (`PosibleLogo1.png` y `PosibleLogo2.png`: ilustración de un herrero con martillo y yunque). Se conservan como historial; el logo vigente es el monograma F.

Pendiente del logo:
- [x] Favicon / versión mínima: probada la F a 16 y 32 px. A 32 px aguanta la versión normal; a 16 px las astillas se fundían, así que el favicon (16–48 px) usa una variante **mini** (barras más gruesas y huecos más anchos). Ver sección "Piezas de marca".
- [x] 2026-10-14: reemplazado el logo ilustrado del herrero en `aplicaciones/call-a-car-web/public/forjado-logo.{svg,png}` por el avatar circular nuevo (mismo nombre de archivo). Ningún archivo fuente de esa web lo referencia; se añadió el 25-sep con el widget de soporte (hoy oculto), así que probablemente solo lo usa el avatar de Chatwoot configurado desde su panel. Cambio **sin commitear** en el repo de `call-a-car-web`.
- [x] "Usos correctos/incorrectos": anotada la excepción del wordmark (ver abajo).

---

## Piezas de marca (generadas 2026-10-14)

Todas en la paleta de la guía y con el texto convertido a trazos (no requieren fuentes instaladas). Se regeneran con `_generador/` (ver su `LEEME.md`).

| Pieza | Carpeta | Archivos | Notas |
|---|---|---|---|
| Favicon e íconos | `favicon/` | `favicon.svg`, `favicon.ico` (16/32/48), `favicon-16/32/48.png`, `apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png` | 16–48 px usan la variante **mini** de la F; los íconos grandes usan la F normal. Esquinas redondeadas, salvo el apple-touch (iOS las aplica). |
| Firma de correo | `firma-correo/` | `firma.html`, `firma-logo.png` | Logo horizontal naranja/carbón sobre fondo blanco. **Hay que alojar `firma-logo.png` en una URL pública** y cambiar el `src`: Gmail/Outlook no muestran imágenes locales. Nombre y cargo ("Fundador") son propuesta; correo, teléfono y web van como `[campos]` por completar (no hay datos de contacto de FORJADO en la bóveda). |
| Banner LinkedIn | `banners/` | `linkedin-1584x396.svg/.png` | La foto de perfil tapa la esquina inferior izquierda: el contenido arranca en x=560. |
| Portada web | `banners/` | `portada-web-1920x1080.svg/.png` | Titular con el tagline; la F gigante en gris superficie (`#222222`) sangra por la derecha. |
| Redes | `plantillas-redes/` | `post-1080x1080`, `story-1080x1920` (zonas seguras 250 px arriba / 340 abajo), `og-1200x630` (imagen para compartir enlaces), cada una `.svg` + `.png` | Texto de ejemplo ("Forjado a tu medida.", "Calidad de oficio. Trato directo."). Para otro texto hay que regenerar con el script. |

> [!note] Excepción tipográfica del logo
> El wordmark FORJADO usa Archivo Black; la regla "no mezclar otras tipografías" aplica al resto de piezas (titulares y texto en Space Grotesk), no al logo.

---

## Estilo visual general

- **Fondos:** siempre oscuros. El blanco solo como texto, nunca como fondo de página.
- **Espaciado:** generoso. El espacio vacío es parte del estilo, no un desperdicio.
- **Bordes:** sin sombras suaves — si hay bordes, son sutiles (`#222`). Nada de `border-radius` excesivo.
- **Iconos:** línea fina, sin relleno (outline style). Peso consistente.
- **Fotografía:** alto contraste, B&W o con overlay oscuro. Sin stock genérico.

---

## Usos correctos / incorrectos

✅ Sí: carbón + naranja con moderación · Space Grotesk en todos los pesos · espacio de respeto alrededor del logo.
❌ No: deformar el logo · fondo naranja con texto encima · mezclar otras tipografías · más de 2 acentos en una pieza.

---

## Checklist de assets de marca

- [x] Logo (todas las versiones, más variante sobre fondo claro y favicon)
- [ ] Plantilla de propuesta con marca
- [ ] Plantilla de pitch deck
- [x] Plantillas para redes (post, story, og) — ver "Piezas de marca"
- [x] Firma de correo — falta completar contacto y alojar el logo
- [x] Banner LinkedIn / portada web

---

## Relacionado
- [[Identidad de Marca]]
- [[Posicionamiento y Mensaje]]
