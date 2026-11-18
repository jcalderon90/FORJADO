---
tags: [forjado, figcraft, mcp, vitrina, vitrina-spatial, showroom, perfumes]
tipo: sesion-raw
fecha: 2026-11-16
---

# 2026-11-16 — Instalación de FigCraft v0.18.1 (MCP) y Rediseño del Showroom de Perfumería en Vitrina Spatial

## 1. Instalación y conexión MCP de FigCraft v0.18.1
- **Origen oficial:** `storytold/figcraft` v0.18.1 (`figcraft-0.18.1-windows-x64-portable.zip`), verificado por SHA256 (`158563f240eea42b939c328569dcf0d1b55545d89cbf035bfd5d354f351b0762`).
- **Instalación local:** extraído en `C:\Users\Jorge\AppData\Local\Programs\figcraft\` (`figcraft.exe` + `figcraft-cli.exe`) y añadido al `PATH` de usuario.
- **Accesos directos:** creados en Menú Inicio (`FigCraft.lnk` y `FigCraft (Live AI 7979).lnk` con `--control 7979`).
- **Configuración MCP:** registrado servidor `"figcraft"` en `C:\Users\Jorge\.gemini\config\mcp_config.json` ejecutando `figcraft-cli.exe mcp` (verificado handshake JSON-RPC `initialize` / `tools/list`).

## 2. Rediseño del Showroom de Perfumería (`vitrina-spatial`)
- **Archivo modificado:** `D:\1TRABAJO\PROYECTOS\FORJADO\aplicaciones\forjado\vitrina\vitrina-spatial\src\components\showroom\PerfumeNicheShowroom.tsx` (pendiente de commit en repo `vitrina-spatial`).
- **Prototipo visual previo en FigCraft:** `vitrina-perfumes-redesign.figcraft` (dos pantallas exportadas: Muro de Podios LED 2×4 y Close-Up con callouts orbitales).
- **Problemas resueltos respecto a `ca46df2`:**
  1. Se reemplazó la grilla plana de 5 nichos con fotos oscuras de pared de roca (`niche_1..5.png`) que enterraban los frascos por un **Muro Escalable de Podios LED** (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`).
  2. Se implementó `SculptedPerfumeBottle` (pomos de cristal 3D con elixir degradado, reflejo especular y siluetas diferenciadas: `classic`, `round`, `crystal`, `cylinder`, `arch`) más soporte para imágenes recortadas propias de tienda, flotando sobre barras LED iluminadas con halo radial detrás.
  3. Se añadieron **filtros por familia olfativa** (`Todos`, `Ámbar & Especias`, `Florales & Frescos`, `Maderas & Oud`, `✦ Nuevos`) para escalar a N perfumes conforme crezca el catálogo en Vitrina Spatial.
  4. Se unificó toda la interfaz y copys en español, agregando dock editorial inferior y vista Close-Up con callouts orbitales (`Salida`, `Corazón`, `Fondo`), selector de volumen (`50 ML / 100 ML / 150 ML`) y pedido directo a bolsa o WhatsApp.
- **Pendiente inmediato:** vista en vivo del servidor Astro `/demo/perfumes` por parte de Jorge y commit en `vitrina-spatial` tras su visto bueno.
