---
tags: [forjado, interno, recursos, frontend, react, react-bits, ui, animaciones, tailwind, shadcn]
tipo: recurso
creado: 2026-10-27
actualizado: 2026-10-27
fuente_raw: raw/interno/2026-10-27-auditoria-react-bits-e-instalacion-skill.md
---

# Recurso — Catálogo y Guía de Integración React Bits (`reactbits.dev`)

> [!info] Resumen
> Catálogo exhaustivo de más de **217 componentes animados, fondos WebGL/Canvas y micro-interacciones** para React. Sigue la filosofía **shadcn** (código fuente que te pertenece, sin dependencias monolíticas) y cuenta con soporte nativo de **Model Context Protocol (MCP)** para agentes de inteligencia artificial.

---

## 1. Métodos de Instalación e Integración

### Método 1: CLI Oficial de `shadcn` (Recomendado)
React Bits provee un registro abierto compatible con la CLI de shadcn. La convención de sufijo define el lenguaje y los estilos:
- `TS` (TypeScript) o `JS` (JavaScript).
- `TW` (Tailwind CSS) o `CSS` (CSS Vanilla / Modules).

```bash
# Formato: npx shadcn@latest add @react-bits/<Componente>-<Lenguaje>-<Estilos>

# Ejemplos en TypeScript + Tailwind CSS:
npx shadcn@latest add @react-bits/SplitText-TS-TW
npx shadcn@latest add @react-bits/SpotlightCard-TS-TW
npx shadcn@latest add @react-bits/Aurora-TS-TW
npx shadcn@latest add @react-bits/MagicBento-TS-TW

# En JavaScript + Tailwind CSS:
npx shadcn@latest add @react-bits/DecryptedText-JS-TW
```

### Método 2: Integración MCP para Antigravity y Agentes
Permite pedirle al agente en lenguaje natural: *"Instala el fondo Aurora de React Bits y agrégalo al Hero"*.

1. En el archivo `components.json` del proyecto web:
```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```
2. En `.agents/mcp_config.json` o `~/.gemini/config/mcp_config.json`:
```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

### Método 3: Copia Manual Directa
1. Ingresar a [reactbits.dev](https://reactbits.dev/get-started/index).
2. Seleccionar lenguaje y framework de estilos en el encabezado.
3. Copiar el archivo del componente en `@/components/ui/` o `@/components/reactbits/`.
4. Instalar las dependencias puntuales del componente (ej. `npm i gsap`, `npm i framer-motion`, o `npm i three @react-three/fiber`).

---

## 2. Catálogo de Componentes por Categoría

### A. Text Animations (33 componentes)
Especiales para títulos de cabecera, cifras destacadas y llamadas de atención.

| Componente | Tipo de Animación | Dependencia Típica | Ideal para |
| :--- | :--- | :--- | :--- |
| `SplitText` | Separación de caracteres/palabras con reveal escalonado | `gsap` | Título H1 principal |
| `DecryptedText` | Desencriptación progresiva tipo hacker / tech | N/A (CSS/JS) | SaaS, seguridad, automatización |
| `CountUp` | Contador numérico suave al entrar en viewport | N/A | Métricas ("+150 clientes", etc.) |
| `TrueFocus` | Enfoque selectivo dinámico con blur contextual | N/A | Subtítulos de impacto |
| `ScrollFloat` | Texto que flota verticalmente al scrollear | `gsap` / `motion` | Secciones "Quiénes somos" |
| `ScrollReveal` | Revelado por palabra conforme se hace scroll | `motion` | Manifiesto y narrativa de marca |
| `ShinyText` | Reflejo metálico luminoso animado | CSS | Badges ("Nuevo", "Pro", etc.) |
| `GlitchText` / `ASCIIText` | Distorsión visual o conversión a caracteres ASCII | Canvas / CSS | Estética tecnológica / retro |
| `VariableProximity` | El peso de la tipografía reacciona a la distancia del cursor | N/A | Banners interactivos |

### B. Animations & Visual Effects (38 componentes)
Animaciones visuales sobre el viewport y elementos interactivos.

| Componente | Descripción | Caso de Uso |
| :--- | :--- | :--- |
| `GlowCursor` / `SplashCursor` | Estela de luz o física de fluidos siguiendo el puntero | Experiencias interactivas inmersivas |
| `FadeContent` / `AnimatedContent` | Entrada suave y escalonada de bloques de contenido | Envoltura estándar de secciones |
| `Magnet` | Los botones atraen físicamente el puntero del cursor | Botones Call To Action principales |
| `StarBorder` / `ElectricBorder` | Bordes interactivos con luz rotativa o arco eléctrico | Tarjetas de precios destacadas |
| `ClickSpark` | Chispas de partículas que emergen al hacer clic | Micro-recompensa táctil |
| `PixelTransition` / `HalftoneReveal` | Revelado de imágenes con transición en píxeles | Portafolio de proyectos y clientes |
| `StickerPeel` | Pegatina que se levanta y dobla al pasar el ratón | Badges de ofertas o credenciales |

### C. Components & Layouts (48 componentes)
Estructuras de navegación, galerías y contenedores complejos.

| Componente | Estructura | Caso de Uso |
| :--- | :--- | :--- |
| `MagicBento` | Cuadrícula Bento Box interactiva con bordes reactivos al mouse | Sección de servicios y features |
| `SpotlightCard` | Tarjeta moderna con resplandor radial guiado por el cursor | Tarjetas de servicios estándar |
| `HoloCard` / `ReflectiveCard` | Tarjeta holográfica 3D con reflejo especular | Tarjetas de producto y planes |
| `TiltedCard` | Efecto 3D tilt basado en la posición del ratón | Muestras de software y capturas |
| `ScrollStack` | Tarjetas que se apilan progresivamente con el scroll | Fases de trabajo (Paso 1 → Paso 3) |
| `PillNav` / `Dock` / `GooeyNav` | Barras de navegación flotantes y orgánicas | Menús flotantes en cabecera |
| `ModelViewer` / `Lanyard` | Visor de modelos 3D y tarjeta colgante con física | Identidad de marca y avatares |
| `Masonry` / `CircularGallery` | Galería en cascada o carrusel cilíndrico | Showcase de capturas de pantalla |

### D. Backgrounds WebGL & Canvas (63 componentes)
Fondos animados de alto impacto visual y bajo consumo de recursos (sustitutos de video).

| Componente | Motor / Tecnología | Estilo Visual | Recomendado para |
| :--- | :--- | :--- | :--- |
| `Aurora` / `SoftAurora` | Shaders / Gradientes | Ondas boreales suaves continuas | Fondos corporativos oscuros |
| `Particles` / `DotGrid` | Canvas 2D interactivo | Red de puntos o partículas reactivas | SaaS, dashboards técnicos |
| `Antigravity` | Canvas 2D | Partículas flotantes que escapan al cursor | Secciones hero dinámicas |
| `Dither` / `Balatro` | Shaders WebGL | Estética dither retro o hipnótica de naipes | Proyectos creativos / indie |
| `LiquidChrome` / `MoltenMetal`| WebGL / 3D | Superficie cromada líquida reflectante | Webs de alta gama / fintech |
| `Hyperspeed` | Three.js | Viaje en carretera a velocidad hiperespacial | Enfoque de alta velocidad / performance |
| `Ballpit` | Three.js + Física (Cannon) | Piscina de bolas interactivas con gravedad | Landing pages lúdicas |
| `Waves` / `Topography` | SVG / Canvas | Curvas de nivel topográficas dinámicas | Consultoría técnica y software |

### E. Micro-Interactions (35 componentes)
Controles detallados para interacción táctil:
- **Botones y Switches:** `FlyingButton`, `SlingButton`, `FuseButton`, `HoldButton`, `SquishSwitch`, `BellToggle`.
- **Inputs Modernos:** `PromptBar` (caja de prompt estilo asistente de IA), `GlideSelect`, `JellyRadio`, `CodeSlots`.
- **Notificaciones y Loaders:** `SwipeToast` (toast deslizable), `LatticeLoader`, `StatusMark`, `PulseHeart`, `SpringCheck`.

---

## 3. Matriz de Aplicación en Proyectos de FORJADO

| Proyecto | Componentes Recomendados | Objetivo |
| :--- | :--- | :--- |
| **`forjado` (Web Corporativa)** | `Aurora` (fondo Hero), `SplitText` (H1), `MagicBento` + `SpotlightCard` (Servicios), `ScrollStack` (Metodología), `StarBorder` (CTA) | Transmitir ingeniería de software de élite y automatización moderna. |
| **`call-a-car-web`** | `Hyperspeed` (Hero de transporte), `DecryptedText` (Métricas de flota), `PillNav` (Header) | Evocar velocidad, fiabilidad y modernidad en transporte. |
| **`vitrina` (PWA / Web)** | `TiltedCard` (Catálogo de productos), `SwipeRow` / `GlideSelect` (Gestión móvil), `PromptBar` (Búsqueda inteligente) | Experiencia táctil nativa, fluida y premium para comercios. |
| **Landings de Clientes (Rogers, Varela, etc.)** | `Particles` (Fondo discreto), `CountUp` (Casos ganados / instalaciones), `Magnet` (Botones de WhatsApp/Llamada) | Maximizar conversión y credibilidad inmediata. |

---

## 4. Reglas de Oro y Rendimiento

1. **Carga diferida (Lazy Loading / No SSR) para WebGL:**
   - Componentes que usen Three.js o shaders (`Ballpit`, `Hyperspeed`, `LiquidChrome`) deben importarse con `next/dynamic` (`ssr: false`) en Next.js o `React.lazy()` en Vite para proteger el First Contentful Paint (FCP).
2. **Accesibilidad (`prefers-reduced-motion`):**
   - Siempre verificar que las animaciones intensas se desactiven si el usuario tiene activada la reducción de movimiento en el sistema operativo.
3. **Control de GPU:**
   - Evitar usar más de un fondo WebGL simultáneo en la misma página; mantener los fondos en canvas 2D (`Particles`, `DotGrid`) para páginas con alto volumen de lectura.

---

## Ver también
- [[interno/configuracion-skills|Configuración de Habilidades Agenticas]]
- [[interno/operaciones/herramientas-y-stack|Herramientas y Stack Técnico]]
- [[interno/servicios/desarrollo-de-software|Servicio — Desarrollo de Software]]
