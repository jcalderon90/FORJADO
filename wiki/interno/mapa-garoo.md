---
tags: [garoo, redtec, mapa, arquitectura, proyectos, agentes]
tipo: indice
creado: 2026-11-07
actualizado: 2026-11-07
---

# Mapa del Ecosistema Garoo / Redtec

> Esta página conecta la bóveda de Obsidian con el ecosistema de proyectos, agentes de IA y portales de **Garoo / Redtec** ubicados en el directorio hermano [`D:\1TRABAJO\PROYECTOS\Garoo`](../../../../Garoo). Para el perfil estratégico y stack de voz/GPU, ver [[../clientes/garoo-redtec|Ficha Garoo / Redtec]].

```
D:\1TRABAJO\PROYECTOS\
├── FORJADO/                  → Ecosistema FORJADO (Apps, Contenido y esta Bóveda)
└── Garoo/                    → Ecosistema Garoo / Redtec (Agentes IA, Portales y Telefonía)
    ├── Agent-Spectrum/       → Bot conversacional inmobiliario (referencia para Carwarriors)
    ├── Agent-Belize/         → Concierge IA para resorts (Itzana y Ka'ana)
    ├── Widget-Belize-Chatbot/→ Widget web embebible de chat para resorts
    ├── TELNYX-Voice-Agent/   → Agente de voz y telefonía VoIP con Telnyx
    ├── RedtecPortal/         → Portal administrativo y backend/frontend de Redtec
    ├── Agent-ADS/            → Agente para gestión publicitaria
    ├── Agent-AXIS/           → Agente de corretaje / asistencia
    ├── Agent-CAP/            → Agente de captación comercial
    ├── Agent-Convento/       → Agente de atención para hotel El Convento
    ├── AGENT-INJERTO/        → Agente especializado para clínicas capilares
    ├── Agent-Support/        → Agente de atención a clientes y soporte técnico
    ├── Agent-Windham/        → Agente para cadena hotelera Windham
    ├── GTL/                  → Sistema de gestión logística / transporte
    ├── RLP-System/           → Plataforma operativa RLP
    ├── Sandbox-Redtec/       → Laboratorio de experimentación y pruebas de prompts
    └── spectrum-showroom/    → Showroom interactivo para clientes de Spectrum
```

---

## 1. Agentes Especializados de IA (`Garoo/`)

| Proyecto / Carpeta | Descripción | Enlace Local |
| :--- | :--- | :--- |
| **`Agent-Spectrum`** | Agente de IA para Spectrum Vivienda (calificación de prospectos, agendamiento y sync de leads). Modelo arquitectónico base adaptado en Carwarriors. | [Carpeta local](../../../../Garoo/Agent-Spectrum) · [README](../../../../Garoo/Agent-Spectrum/README.md) |
| **`Agent-Belize`** | Sistema multi-agente concierge (Isabella) para hoteles de lujo Itzana y Ka'ana en Belize, con base de conocimiento vectorial e integración WhatsApp. | [Carpeta local](../../../../Garoo/Agent-Belize) · [Wiki](../../../../Garoo/Agent-Belize/wiki/architecture.md) |
| **`Widget-Belize-Chatbot`** | Componente de interfaz web y widget flotante para interacción directa con el agente de Belize. | [Carpeta local](../../../../Garoo/Widget-Belize-Chatbot) · [README](../../../../Garoo/Widget-Belize-Chatbot/README.md) |
| **`TELNYX-Voice-Agent`** | Agente de voz bidireccional y telefonía automatizada integrado con API de Telnyx para llamadas en tiempo real. | [Carpeta local](../../../../Garoo/TELNYX-Voice-Agent) · [README](../../../../Garoo/TELNYX-Voice-Agent/README.md) |
| **`Agent-Convento`** | Agente conversacional para reservas y atención de huéspedes en hotel boutique El Convento. | [Carpeta local](../../../../Garoo/Agent-Convento) · [README](../../../../Garoo/Agent-Convento/README.md) |
| **`AGENT-INJERTO`** | Asistente de calificación y orientación estética para clínicas capilares y procedimientos médicos. | [Carpeta local](../../../../Garoo/AGENT-INJERTO) · [README](../../../../Garoo/AGENT-INJERTO/README.md) |
| **`Agent-Windham`** | Agente conversacional diseñado para la operación hotelera de Windham. | [Carpeta local](../../../../Garoo/Agent-Windham) · [README](../../../../Garoo/Agent-Windham/README.md) |
| **`Agent-ADS`** | Agente de optimización y seguimiento publicitario. | [Carpeta local](../../../../Garoo/Agent-ADS) · [README](../../../../Garoo/Agent-ADS/README.md) |
| **`Agent-AXIS`** | Agente de asistencia operativa y corretaje. | [Carpeta local](../../../../Garoo/Agent-AXIS) · [README](../../../../Garoo/Agent-AXIS/README.md) |
| **`Agent-CAP`** | Agente de captación y prospección B2B. | [Carpeta local](../../../../Garoo/Agent-CAP) · [README](../../../../Garoo/Agent-CAP/README.md) |
| **`Agent-Support`** | Agente de mesa de ayuda y soporte técnico para usuarios de plataformas Garoo. | [Carpeta local](../../../../Garoo/Agent-Support) |

---

## 2. Portales, Sistemas y Entornos de Prueba

| Proyecto / Carpeta | Descripción | Enlace Local |
| :--- | :--- | :--- |
| **`RedtecPortal`** | Plataforma central de administración (`redtec-portal-backend` Express/Node y `redtec-portal-frontend` Vite/React). | [Backend](../../../../Garoo/RedtecPortal/redtec-portal-backend/README.md) · [Frontend](../../../../Garoo/RedtecPortal/redtec-portal-frontend/README.md) |
| **`spectrum-showroom`** | Showroom web para exhibición de proyectos inmobiliarios integrados con Spectrum. | [Carpeta local](../../../../Garoo/spectrum-showroom) · [README](../../../../Garoo/spectrum-showroom/README.md) |
| **`Sandbox-Redtec`** | Entorno de experimentación para probar flujos, tool-calling y benchmarks de modelos. | [Carpeta local](../../../../Garoo/Sandbox-Redtec) · [README](../../../../Garoo/Sandbox-Redtec/README.md) |
| **`GTL`** | Módulo de gestión y seguimiento logístico. | [Carpeta local](../../../../Garoo/GTL) |
| **`RLP-System`** | Sistema operativo y de gestión para plataforma RLP. | [Carpeta local](../../../../Garoo/RLP-System) · [README](../../../../Garoo/RLP-System/README.md) |

---

## Conexiones Clave con FORJADO

1. **Reutilización de Arquitectura:** El flujo de agentes n8n + OpenRouter desarrollado en `Garoo/Agent-Spectrum` sirvió de base directa para la arquitectura del bot de WhatsApp de Carwarriors (`desarrollo/wiki/clientes/carwarriors-llc-arquitectura-migracion.md`).
2. **Servicios Compartidos:** Ambos ecosistemas comparten proveedores de inferencia (OpenRouter, Baseten) e infraestructura de bases vectoriales en MongoDB Atlas.

---

## Ver también
- [[mapa-forjado|Mapa del Ecosistema FORJADO]]
- [[../clientes/garoo-redtec|Ficha Corporativa Garoo / Redtec]]
- [[../index|Índice de la Wiki]]
