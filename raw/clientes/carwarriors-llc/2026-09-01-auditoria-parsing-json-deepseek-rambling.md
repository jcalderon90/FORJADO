---
tags: [forjado, cliente, carwarriors, bug, auditoria, deepseek]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-01
---

# 2026-09-01 — Auditoría proactiva: mismo bug de parsing JSON en 4 nodos más (KB-SEARCH ya lo tenía corregido)

**Contexto:** tras encontrar el bug de parsing en `LEAD - COLLECTOR` (ver [[2026-09-01-diagnostico-whatsapp-desconectado-y-sync-dealercenter]]), Jorge pidió auditar el resto del sistema por el mismo patrón antes de que muerda una 4ta vez.

## Patrón del bug

`deepseek/deepseek-v4-flash` a veces genera un "rambling" de razonamiento largo antes de la respuesta final, repitiendo el JSON de salida varias veces. Un regex ingenuo tipo "primer `{` a último `}`" (`raw.indexOf('{')...raw.lastIndexOf('}')` o `text.match(/\{[\s\S]*\}/)`) termina abarcando varios bloques JSON mezclados con prosa, `JSON.parse` falla, y el nodo cae a su fallback — perdiendo silenciosamente el dato real que el LLM sí había producido correctamente en alguna parte del texto.

## Nodos auditados

| Workflow | Nodo | Resultado |
|---|---|---|
| `KB - SEARCH` | `RESPONSE` | Ya corregido el 2026-08-31 (regex + fallback a texto truncado) |
| `LEAD - COLLECTOR` | `Parse Response` | **Vulnerable, corregido hoy** (extracción de bloques JSON planos, toma el último con clave `telefono`) |
| `PRINCIPAL` | `Parse response` | **Vulnerable, corregido hoy** — el más crítico: parsea la respuesta del agente principal en TODO mensaje del bot, no solo teléfono |
| `PRINCIPAL - Rances Car` | `Parse response` | **Vulnerable, corregido hoy** (mismo código que PRINCIPAL) |
| `RSVP` | `Parse RSVP Output` | **Vulnerable, corregido hoy** |
| `RSVP - Rances Car` | `Parse RSVP Output` | **Vulnerable, corregido hoy** (mismo código que RSVP) |
| `COMENTARIOS-MANYCHAT` | `Clasificar Interés Real` | Usa `@n8n/n8n-nodes-langchain.informationExtractor` (parser estructurado nativo de LangChain, no regex manual) — **no vulnerable** |
| `SEND - MEDIA` | — | Sin parsing de LLM, solo lógica determinística — **no vulnerable** |

## Fix aplicado (uniforme en los 4 nodos vulnerables)

Reemplazado el regex greedy por una función que extrae **todos** los objetos JSON balanceados del texto (respetando comillas de string y llaves anidadas con un contador de profundidad), y se queda con el **último** candidato que:
1. Parsea sin error, y
2. Tiene la clave esperada del contrato de ese nodo (`telefono` en LEAD-COLLECTOR, `respuesta` en PRINCIPAL, `parameters` en RSVP).

Esto es robusto tanto a JSON limpio (caso normal) como a rambling con múltiples repeticiones (toma la versión final, presumiblemente la más confiable del modelo tras "pensarlo").

Los fallbacks existentes (mensaje genérico de error, o repetir el estado actual) se mantuvieron intactos para el caso en que ningún candidato parsee — eso sigue siendo un fallo real que hay que ver en logs, no algo que este fix intente adivinar.

## Verificación

Todos los 4 workflows publicados explícitamente (`publish_workflow`) y confirmados en la ruta viva (`versionId == activeVersionId`, código con `extraerObjetosJson` presente en `parameters.jsCode` del nodo activo) — no se usó el editor Test/Play de n8n en ningún momento, dado que `RSVP` escribe en Mongo real y no está sandboxeado (regla ya establecida el 2026-08-26).

**Pendiente:** confirmar con tráfico real que el fix de `Parse response` en `PRINCIPAL` no rompió el caso normal (no debería, la lógica de mapeo de campos es idéntica, solo cambió cómo se obtiene `parsed`) — sin verificar todavía.
