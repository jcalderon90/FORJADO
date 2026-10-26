---
tags: [forjado, interno, skills, arquitectura, archify, diagramas, consultoria]
tipo: sesion
fecha: 2026-10-26
estado: cerrado
---

# Sesión 2026-10-26 — Evaluación e Instalación Global de Archify

## Contexto y Objetivo
En el plan de pendientes de la agencia (registrado el 2026-10-24 a partir de notas de arquitectura y herramientas), se evaluó incorporar **Archify (`tt-a1i/archify`)** como herramienta de visualización técnica para los servicios de:
- **Consultoría Técnica y Diagnóstico** ($120 sesión, $400 diagnóstico + hoja de ruta).
- **Desarrollo de Software y Automatizaciones** ($2,500 MVP, $4,500 app a medida, pipelines n8n).

El objetivo: generar diagramas interactivos, ejecutivos y verificables en HTML autónomo sin dependencias externas ni costos de suscripción SaaS (Figma/Lucidchart/Eraser), con trazabilidad visual de dependencias, boundaries de seguridad y comparadores de diferencias (*architecture delta*).

---

## Verificación Técnica

1. **Prueba de ejecución y dependencias:**
   - La suite corre sobre Node.js nativo sin requerir compilación pesada (`node bin/archify.mjs`).
   - Verificado con `node .../bin/archify.mjs doctor` sobre Node.js v24.21.0 en Windows:
     - 26 módulos validados con estado `[ok]` (renderers de architecture, workflow, sequence, dataflow, lifecycle, erd, tree, class, timeline, waterfall, explainer y runtime de preview).
   - Generación de demo probada: `archify demo` generó un HTML autónomo de 846 KB con animaciones de flujo, temas claro/oscuro e interactividad de nodos.

2. **Tipos de diagramas soportados:**
   - `architecture`: componentes, límites de confianza (*trust boundaries*), APIs y bases de datos.
   - `workflow`: procesos paso a paso y branching condicional.
   - `sequence`: llamadas sincrónicas/asincrónicas entre servicios y webhooks.
   - `dataflow`: transformaciones y pipelines de datos.
   - `lifecycle`: máquinas de estados y transiciones.
   - `erd`: diagramas entidad-relación con tablas, columnas tipadas, claves primarias/foráneas y relaciones.
   - `class`, `tree`, `timeline`, `waterfall`: estructuras de datos, cronogramas y cascadas de carga.
   - `explainer`: resúmenes ejecutivos tipo *one-pager* con conclusiones, paneles estructurados y gráficos embebidos.

---

## Despliegue e Instalación

Instalado en las ubicaciones globales del sistema:
- `C:\Users\Jorge\.gemini\config\plugins\user-global-skills\skills\archify` (descubierto y cargado automáticamente por Antigravity / Gemini CLI).
- `C:\Users\Jorge\.gemini\config\skills\archify` (disponible para herramientas y agentes compatibles con el directorio estándar de skills).

Para invocar el generador desde cualquier proyecto:
```bash
node C:\Users\Jorge\.gemini\config\skills\archify\bin\archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
```

---

## Estado
- Pendiente en [[../../wiki/interno/estado-proyecto|wiki/interno/estado-proyecto.md]] marcado como completado.
- Documentación de skills actualizada en [[../../wiki/interno/configuracion-skills|wiki/interno/configuracion-skills.md]].
