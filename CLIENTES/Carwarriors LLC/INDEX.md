---
tags: [forjado, carwarriors, indice, navegacion]
tipo: indice
cliente: Carwarriors LLC
actualizado: 2026-08-14
---

# Carwarriors LLC — Índice

> Leer esto primero. No abrir los archivos de abajo salvo que el índice apunte específicamente a ellos.

**Para estado y pendientes actuales: `INTERNO/00 - INICIO/Estado del Proyecto.md`** (fuente de verdad consolidada, se actualiza cada sesión). Los docs de aquí son diseño/referencia/histórico, no el tracker de estado.

## Docs vigentes (leer primero según el tema)

| Nota | Tema | Estado |
|---|---|---|
| [[Carwarriors - Migración Bot GHL a n8n y OpenRouter (Diseño)]] | Migración del bot conversacional GHL Conversation AI → n8n + OpenRouter. Fuente de verdad técnica de la migración en curso (arquitectura, mapeo Spectrum→Carwarriors, pendientes) | en-construcción |
| [[Carwarriors - Infraestructura (Diseño)]] | Diseño técnico de infraestructura (n8n, MongoDB, Coolify) | aprobado |
| [[Carwarriors - SFTP DealerCenter (Investigación)]] | Investigación técnica ADF/XML + SFTP para importar leads a DealerCenter | en-progreso |
| [[Carwarriors - Comportamiento del Bot (Resumen)]] | Reglas de comportamiento del bot GHL, subcuenta Carwarriors LLC — vigente en paralelo mientras dura la migración a n8n | en-migración |
| [[Rances Car - Comportamiento del Bot (Resumen)]] | Igual, subcuenta hermana Rances Car | en-migración |

## Docs históricos / deprecados (solo para contexto, no como fuente vigente)

| Nota | Tema | Estado |
|---|---|---|
| [[Carwarriors - Agente IA 24-7 (Diseño)]] | Diseño original del bot GHL Conversation AI (Carwarriors LLC) | deprecado, migrando a n8n |
| [[Carwarriors - Agente IA Rances Car (Diseño)]] | Igual, subcuenta Rances Car | deprecado, migrando a n8n |
| [[Carwarriors - Inventario GHL]] | Snapshot técnico de la cuenta GHL vía API (2026-07-09) | histórico, no re-sincronizado |
| [[Carwarriors - Justificación de Infraestructura (Cliente)]] | Doc para el cliente justificando la infraestructura | borrador |
| [[Carwarriors - Propuesta Formal]] | Propuesta comercial formal (CW-001) | lista-para-presentar |

## Bitácora

| Nota | Contenido |
|---|---|
| [[Carwarriors LLC]] | Nota maestra del cliente — bitácora cronológica completa de decisiones/updates. Muy largo (600+ líneas); para el estado actual usar `Estado del Proyecto.md`, no este archivo |

## Artefactos (exports crudos, no leer como documentación)

| Archivo | Qué es |
|---|---|
| `carwarriors_lead_intake_agent_workflow.json` | Export de un workflow n8n |
| `n8n-workflows/ghl-to-dealercenter-adf.json` | Export de workflow n8n (GHL → DealerCenter ADF) |
