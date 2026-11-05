---
tags: [forjado, interno, time-control, arquitectura, obsidian, b2b, producto-propio]
tipo: sesion
fecha: 2026-11-04
estado: cerrado
---

# Sesión 2026-11-04: Registro e Integración de Time Control en FORJADO

## Contexto y Solicitud de Jorge

Jorge comunicó la incorporación de una nueva suite de software al ecosistema de FORJADO ubicada en `aplicaciones/forjado/`:
- El proyecto se llama **Time Control** (carpeta local `time-control`, con alias / junction de compatibilidad `time-center`), compuesto por 3 aplicaciones independientes con sus respectivos repositorios en GitHub.
- Fue desarrollado previamente para una empresa externa (`Home Las Vegas Nevada` / `LogYourTime`), pero ahora pasa a adaptarse bajo la marca **FORJADO** para ofrecerlo y comercializarlo como producto propio de la agencia a clientes que requieren control horario y auditoría de equipos.
- Requerimiento explícito: documentar y registrar todo el ecosistema y asegurar que no se rompa ningún enlace o vínculo con la bóveda de Obsidian.

## Hallazgos Técnicos de la Suite Time Control

La suite es un clon empresarial tipo *Time Doctor* con alta madurez de código (100% testeable, soporte multi-tenant e integridad de auditoría):

1. **Backend (`time-doctor-clon-backend`):**
   - Repo: `https://github.com/GLM1996/time-doctor-clon-backend.git`
   - Stack: Node.js (ESM), Express 4, Mongoose 8 (MongoDB Atlas), AWS SDK v3 S3 (URLs pre-firmadas para capturas), WebSockets (Socket.io), Joi, JWT, ExcelJS, PDFKit.
   - Módulos: `organizations` (aislamiento multi-tenant), `attendance`, `activity`, `screenshots` (periódicas y on-demand), `payroll`, `billing`, `alerts`, `desktop-crashes`.

2. **Frontend Web (`time-doctor-clon-fronted`):**
   - Repo: `https://github.com/GLM1996/time-doctor-clon-fronted.git`
   - Stack: React 19, Vite 8, Tailwind CSS, Zustand, Recharts, Lucide React, Stripe JS, jsPDF, i18next.
   - Vistas: Dashboard analítico en tiempo real, visor cronológico de capturas de pantalla, liquidación de nóminas, exportación de reportes.

3. **Cliente de Escritorio (`time-doctor-clon-desktop`):**
   - Repo: `https://github.com/GLM1996/time-doctor-clon-desktop.git`
   - Stack: Electron 43, electron-vite 3, React 18, SQLite (`better-sqlite3` para persistencia offline), `keyspy` (detección de pulsaciones y clics sin keylogging invasivo), `get-windows` (rastreo de ventanas/apps activas), `electron-builder`.
   - Release: Pipeline Windows para artefactos firmados con `latest.yml` y `.blockmap`.

## Acciones Realizadas y Protección de Enlaces

1. **Resolución de nombres y alias en disco:**
   - La carpeta creada en disco era `aplicaciones/forjado/time-center`. Se renombró a `aplicaciones/forjado/time-control` para coincidir exactamente con la denominación oficial de Jorge, y se creó un Directory Junction de Windows `time-center <<===>> time-control` garantizando compatibilidad retroactiva absoluta.
   - Se crearon `README.md` y `STATUS.md` en `aplicaciones/forjado/time-control/`.

2. **Protección y corrección de la Bóveda Personal de Obsidian (`G:\My Drive\OBSIDIAN\BOVEDA-PERSONAL\`):**
   - Se detectó que `applecell` y `vitrina` habían sido movidos a `aplicaciones/forjado/`.
   - Se actualizaron los paths de `PROYECTOS/FORJADO/applecell.md` y `PROYECTOS/FORJADO/vitrina.md` a `D:\1TRABAJO\PROYECTOS\FORJADO\aplicaciones\forjado\...` corrigiendo enlaces rotos.
   - Se creó `PROYECTOS/FORJADO/time-control.md` con metadata, repositorios y objetivo de adaptación.
   - Se creó `FORJADO/Time Control/Time Control - Sistema de Monitoreo.md` con arquitectura y detalles técnicos.
   - Se actualizaron los índices `PROYECTOS/PROYECTOS - Indice.md` y `FORJADO/FORJADO - Indice.md`.

3. **Actualización de la Bóveda Karpathy FORJADO (`desarrollo/`):**
   - `wiki/interno/mapa-forjado.md`: Mapeada la subcarpeta `forjado/` con sus 5 aplicaciones (`applecell`, `forjado-landing`, `lead-discovery`, `time-control`, `vitrina`), corrigiendo enlaces relativos de `automated-legal-contracts` y `vitrina`.
   - `wiki/interno/productos/time-control.md`: Creada la ficha técnica y arquitectónica completa.
   - `wiki/interno/proyectos-pendientes.md`: Registrado Time Control como producto activo en fase de transición/adaptación (prioridad activa junto a Vitrina).
   - `wiki/interno/estado-proyecto.md`: Añadido snapshot del 2026-11-04 y tarea pendiente para el empaquetado B2B y rebranding.
   - `wiki/index.md`: Incorporado al índice general de la bóveda.

## Próximos Pasos (Hoja de Ruta)
1. **Fase 1 (Branding):** Reemplazar logotipos y cambiar `appId` a `com.forjado.timecontrol` aplicando la paleta oficial Forja (`#E85D04` / `#111111`).
2. **Fase 2 (Infraestructura):** Despliegue en Dokploy (Oracle VPS) y almacenamiento Cloudflare R2 / MinIO.
3. **Fase 3 (Comercial):** Preparar propuesta y demo para ofrecerlo a clientes que contratan personal remoto.
