---
tags: [forjado, producto, time-control, arquitectura, b2b]
tipo: especificacion
actualizado: 2026-11-07
fuente_raw: raw/interno/2026-11-04-registro-e-integracion-time-control-forjado.md
---

# Calibre — Suite de Monitoreo de Tiempo y Productividad

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

### 1.1 Backend API (`calibre-backend`)
- **Ubicación local:** [`aplicaciones/forjado/time-control/calibre-backend`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/aplicaciones/forjado/time-control/calibre-backend)
- **Repositorio remoto:** [`FORJADO-AGENCY/calibre-backend`](https://github.com/FORJADO-AGENCY/calibre-backend)
- **Despliegue de Producción (Dokploy / Oracle VPS Ashburn):**
  - **URL Base:** `https://forjado-calibrebackend-ikw9yh-ed029b-129-213-108-102.sslip.io`
  - **Healthcheck:** `https://forjado-calibrebackend-ikw9yh-ed029b-129-213-108-102.sslip.io/api/health`
  - **Servicio Swarm:** `forjado-calibrebackend-ikw9yh` (1/1 réplicas)
- **Stack:** Node.js 22 (ES Modules), Express 4, Mongoose 8 (MongoDB Atlas), Cloudflare R2 (`@aws-sdk/client-s3`), Socket.io, JWT, Joi, ExcelJS, PDFKit.
- **Módulos implementados:**
  - `organizations`: Aislamiento estricto multi-tenant por empresa/cliente.
  - `auth` & `users`: Roles jerárquicos (SuperAdmin, Admin de Organización, Manager, Empleado).
  - `time` & `attendance`: Registro de intervalos, cálculo de tiempo productivo vs. ocioso, conciliación de discrepancias.
  - `screenshots`: Gestión de capturas periódicas aleatorias y capturas bajo demanda en tiempo real con Cloudflare R2.
  - `activity`: Registro consolidado de eventos de teclado y ratón.
  - `payroll`: Liquidación de nómina automática con tarifas diferenciadas por hora/proyecto.
  - `billing`: Integración de pasarelas de pago y planes de suscripción.
  - `alerts` & `audit`: Detección de anomalías, ausencias prolongadas e intentos de alteración horaria.

### 1.2 Frontend Web (`calibre-frontend`)
- **Ubicación local:** [`aplicaciones/forjado/time-control/calibre-frontend`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/aplicaciones/forjado/time-control/calibre-frontend)
- **Repositorio remoto:** [`FORJADO-AGENCY/calibre-frontend`](https://github.com/FORJADO-AGENCY/calibre-frontend)
- **Despliegue de Producción (Dokploy / Oracle VPS Ashburn):**
  - **URL Panel:** `https://forjado-calibrefrontend-qdevp9-774452-129-213-108-102.sslip.io`
  - **Servicio Swarm:** `forjado-calibrefrontend-qdevp9` (1/1 réplicas)
- **Stack:** React 19, Vite 8, Nginx Alpine, Tailwind CSS, Zustand, Recharts, Lucide React, Socket.io-client, Stripe JS, jsPDF, i18next.
- **Vistas clave:** Tablero analítico en tiempo real, visor de capturas de pantalla organizadas por timeline de usuario, gestión de turnos/horarios, configuración multi-tenant, exportación de reportes a PDF y Excel.

### 1.3 Cliente Desktop (`calibre-desktop`)
- **Ubicación local:** [`aplicaciones/forjado/time-control/calibre-desktop`](file:///D:/1TRABAJO/PROYECTOS/FORJADO/aplicaciones/forjado/time-control/calibre-desktop)
- **Repositorio remoto:** [`FORJADO-AGENCY/calibre-desktop`](https://github.com/FORJADO-AGENCY/calibre-desktop)
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

### Fase 2: Despliegue en Infraestructura Propia (COMPLETADO ✅ 2026-11-07)
- Contenedores Docker configurados y desplegados en el VPS Oracle Ashburn de FORJADO mediante Dokploy.
- Almacenamiento migrado a Cloudflare R2 bucket `calibre-screenshots` con credenciales configuradas y validadas.
- Base de datos aprovisionada en MongoDB Atlas (`cluster0.metm9ld.mongodb.net/calibre`).
- Certificados SSL Let's Encrypt aprovisionados y CORS/CSP bidireccional completamente enlazado.

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
- Bóveda Personal Obsidian: `[[PROYECTOS/FORJADO/time-control]]` y `[[FORJADO/Calibre/Calibre - Sistema de Monitoreo]]`


