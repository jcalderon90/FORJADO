---
tags: [forjado, producto, time-control, arquitectura, b2b]
tipo: especificacion
actualizado: 2026-11-04
fuente_raw: raw/interno/2026-11-04-registro-e-integracion-time-control-forjado.md
---

# Time Control — Suite de Monitoreo de Tiempo y Productividad

> **Sistema empresarial de auditoría horaria y gestión de productividad de equipos remotos.**  
> Desarrollado originalmente para un cliente corporativo (`Home Las Vegas Nevada` / `LogYourTime`) e incorporado el 2026-11-04 como producto de software propio de **FORJADO** para ser adaptado comercialmente y ofrecido a nuevos clientes B2B.

---

## 1. Arquitectura y Componentes (3 Repositorios)

El sistema opera bajo una arquitectura desacoplada en 3 niveles, permitiendo alta resiliencia y aislamiento operativo:

```
┌─────────────────────────────────────────────────────────────┐
│                 FORJADO TIME CONTROL ECOSYSTEM              │
└─────────────────────────────────────────────────────────────┘
          ▲                                       ▲
          │ WebSocket / REST                      │ REST API / S3 URLs
          │                                       │
┌─────────────────────────┐             ┌─────────────────────────┐
│   Desktop Client App    │             │   Web Dashboard Panel   │
│ (Electron 43 + React 18)│             │    (React 19 + Vite 8)  │
│  - Captura periódica    │             │ - Reportes analíticos   │
│  - Hooks teclado/ratón  │             │ - Aprobación de horas   │
│  - Títulos de ventanas  │             │ - Módulo de nómina      │
│  - SQLite local (caché) │             │ - Facturación Stripe    │
└─────────────────────────┘             └─────────────────────────┘
          │                                       │
          └───────────────────┬───────────────────┘
                              ▼
                ┌───────────────────────────┐
                │      Backend Core API     │
                │    (Node.js + Express)    │
                │ - Módulos: orgs, audit,   │
                │   payroll, alerts, time   │
                │ - Base de datos MongoDB   │
                │ - Almacenamiento AWS S3   │
                └───────────────────────────┘
```

### 1.1 Backend API (`time-doctor-clon-backend`)
- **Ubicación local:** [`aplicaciones/forjado/time-control/time-doctor-clon-backend`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/aplicaciones/forjado/time-control/time-doctor-clon-backend)
- **Repositorio remoto:** [`GLM1996/time-doctor-clon-backend`](https://github.com/GLM1996/time-doctor-clon-backend)
- **Stack:** Node.js (ES Modules), Express 4, Mongoose 8 (MongoDB Atlas), AWS SDK v3 (`@aws-sdk/client-s3`, presigned URLs), Socket.io, JWT, Joi, ExcelJS, PDFKit.
- **Módulos implementados:**
  - `organizations`: Aislamiento estricto multi-tenant por empresa/cliente.
  - `auth` & `users`: Roles jerárquicos (SuperAdmin, Admin de Organización, Manager, Empleado).
  - `time` & `attendance`: Registro de intervalos, cálculo de tiempo productivo vs. ocioso, conciliación de discrepancias.
  - `screenshots`: Gestión de capturas periódicas aleatorias y capturas bajo demanda en tiempo real.
  - `activity`: Registro consolidado de eventos de teclado y ratón.
  - `payroll`: Liquidación de nómina automática con tarifas diferenciadas por hora/proyecto.
  - `billing`: Integración de pasarelas de pago y planes de suscripción.
  - `alerts` & `audit`: Detección de anomalías, ausencias prolongadas e intentos de alteración horaria.

### 1.2 Frontend Web (`time-doctor-clon-fronted`)
- **Ubicación local:** [`aplicaciones/forjado/time-control/time-doctor-clon-fronted`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/aplicaciones/forjado/time-control/time-doctor-clon-fronted)
- **Repositorio remoto:** [`GLM1996/time-doctor-clon-fronted`](https://github.com/GLM1996/time-doctor-clon-fronted)
- **Stack:** React 19, Vite 8, Tailwind CSS, Zustand, Recharts, Lucide React, Socket.io-client, Stripe JS, jsPDF, i18next.
- **Vistas clave:** Tablero analítico en tiempo real, visor de capturas de pantalla organizadas por timeline de usuario, gestión de turnos/horarios, configuración multi-tenant, exportación de reportes a PDF y Excel.

### 1.3 Cliente Desktop (`time-doctor-clon-desktop`)
- **Ubicación local:** [`aplicaciones/forjado/time-control/time-doctor-clon-desktop`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/aplicaciones/forjado/time-control/time-doctor-clon-desktop)
- **Repositorio remoto:** [`GLM1996/time-doctor-clon-desktop`](https://github.com/GLM1996/time-doctor-clon-desktop)
- **Stack:** Electron 43, electron-vite 3, React 18, `better-sqlite3` (almacenamiento local offline), `keyspy` (auditoría de eventos de periféricos sin registrar pulsaciones de teclas confidenciales), `get-windows` (rastreo de ventanas y apps activas), `electron-builder`.
- **Características operativas:**
  - Funcionamiento offline resiliente con SQLite local: si se cae la red, sigue grabando y sincroniza al reconectar sin perder datos.
  - Pipeline de publicación para Windows configurado en GitHub Actions con verificación de firma de código, artefactos `.blockmap` y autoupdater seguro.

---

## 2. Hoja de Ruta para Adaptación a FORJADO

### Fase 1: Identidad Visual y Marca
- Sustituir branding de `LogYourTime` / `Home Las Vegas Nevada` por la identidad corporativa de **FORJADO** ([[../marca/identidad-visual]]).
- Aplicar colores oficiales: Naranja Forja (`#E85D04`), Carbón oscuro (`#111111`), Blanco brasa (`#F8F9FA`).
- Cambiar identificador de aplicación (`appId`) en Electron a `com.forjado.timecontrol`.

### Fase 2: Despliegue en Infraestructura Propia
- Configurar contenedor Docker para el backend y desplegarlo en el VPS Oracle de FORJADO mediante Dokploy.
- Sustituir almacenamiento S3 tradicional por Cloudflare R2 o MinIO para eliminar costes de transferencia en la descarga masiva de screenshots.
- Crear base de datos aislada en MongoDB Atlas para el servicio.

### Fase 3: Modelo de Negocio y Presentación Comercial B2B
- Empaquetar como solución de auditoría de productividad para clientes de servicios de desarrollo y consultoría de FORJADO.
- Dos modalidades de oferta:
  1. **SaaS Gestionado:** Alojado en la nube de FORJADO con soporte y mantenimiento mensual por usuario activo.
  2. **Despliegue Privado (On-Premise / Dedicated VPS):** Instalación dedicada para empresas que requieren soberanía absoluta sobre sus datos de monitoreo y capturas.

---

## 3. Enlaces Relacionados

- [[../mapa-forjado|Mapa de aplicaciones de FORJADO]]
- [[../proyectos-pendientes|Proyectos propios pendientes]]
- [[../estado-proyecto|Estado consolidado del proyecto]]
- Bóveda Personal Obsidian: `[[PROYECTOS/FORJADO/time-control]]` y `[[FORJADO/Time Control/Time Control - Sistema de Monitoreo]]`
