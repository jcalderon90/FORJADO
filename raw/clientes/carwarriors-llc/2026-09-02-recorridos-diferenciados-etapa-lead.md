---
tags: [forjado, cliente, carwarriors, bot, feature, n8n]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — Recorridos diferenciados del bot: etapa del lead (nuevo/seguimiento/frío)

**Contexto:** primer ítem construido del backlog de Bianca (ver [[2026-08-28-brief-automatizacion-bianca]]) tras pausar el de DealerCenter tasks viejos por el bloqueo de Auth0 (ver [[2026-09-02-investigacion-dealercenter-tasks-viejos]]). Jorge eligió este ítem sobre el scoring de leads con IA porque no tiene bloqueador externo y es visible día a día para el equipo. Alcance acotado a solo esto (sin derivación a vendedores, ver Pendiente).

## Diagnóstico previo

Revisado el nodo `IF NUEVO LEAD` de `PRINCIPAL` — pese al nombre, no distingue "primera vez que escribe" vs "ya nos conoce": dispara cuando `datos_completos` pasa de false a true (lead recién calificado), solo para una notificación de Slack. No existía ninguna lógica que le hiciera al bot tratar distinto a un lead según cuánto hace que no habla con nosotros.

Revisados los nodos Mongo de estado por contacto (`Find User`/`Insert User`/`Update User`, colección `users`): **ya existían los campos necesarios** (`first_interaction`, `last_interaction`, ambos ISO) sin que nadie los usara para esto — no hizo falta agregar campos nuevos a la colección, solo calcular algo a partir de ellos.

## Diseño

- **NUEVO**: `Find User` no devuelve nada (primer mensaje real de este contacto).
- **SEGUIMIENTO**: contacto existente, `last_interaction` (el valor previo a este turno, leído antes de que se actualice) a 3 días o menos.
- **FRIO**: contacto existente, `last_interaction` a más de 3 días.

Umbral de 3 días elegido por consistencia con el resto del sistema (mismo orden de magnitud que el "48/72h" que Bianca usó para describir tasks estancados en DealerCenter), no es un número que haya pedido explícitamente para esto — queda abierto a ajustar si en la práctica se ve muy sensible.

## Implementación (ambos dealers, `PRINCIPAL` y `PRINCIPAL - Rances Car`)

1. **Nodo `User Data`** (Set, modo raw): antes solo mezclaba `Find User` o `Insert User` en un único objeto. Se le agregó el cálculo de `etapa_lead` en la misma expresión, sin nodos nuevos:
   ```
   $('Find User').first().json.isNotEmpty()
     ? { ...$('Find User').first().json, etapa_lead: (dias_desde_last_interaction <= 3 ? 'SEGUIMIENTO' : 'FRIO') }
     : { ...$('Insert User').first().json, etapa_lead: 'NUEVO' }
   ```
   Cálculo de días con `Date.now()`/`new Date()` nativos (no con el global `DateTime` de Luxon, para no depender de que esté expuesto en el sandbox de expresiones).
2. **`systemMessage` del agente `PRINCIPAL`**: nueva sección `## ETAPA DEL LEAD (RECORRIDO DIFERENCIADO) ##` (ubicada después de `FLUJO DE CALIFICACION`, antes de `OFERTA DE APPOINTMENT`) con instrucción de tono por etapa — NUEVO sigue el flujo normal, SEGUIMIENTO no vuelve a saludar ni repite preguntas ya contestadas, FRIO abre reconociendo el tiempo pasado antes de retomar. Además, una línea nueva `Etapa del lead: ...` agregada al bloque `CONTEXTO DEL LEAD` que ya listaba ciudad/interés/método de pago/etc.

**Nota operativa:** en Rances Car el prompt tiene 2 secciones adicionales que Carwarriors LLC no tiene (`URGENCIA Y CIERRE (PLAYBOOK BDC)` y `DETECCION ANTI-SPAM/BAJO INTERES`, activadas ahí desde el 2026-08-18) — el prompt no es idéntico entre dealers. El cambio de hoy se insertó en el mismo punto relativo (antes de `OFERTA DE APPOINTMENT`) respetando esa diferencia, sin tocar esas secciones.

Aplicado con `updateNodeParameters` (no `setNodeParameter`, ver lección de [[2026-09-01-bot-invento-direccion-fisica-fix-guardrail]]), publicado, y **verificado leyendo tanto el nodo actual como `activeVersion.nodes` después de publicar** en ambos workflows — la lección de no confiar en el "success" reportado se aplicó de entrada esta vez, no como corrección posterior.

## Estado

- Publicado y verificado en vivo en `PRINCIPAL` (Carwarriors LLC, `activeVersionId` `3e84749d-e5b1-4430-a112-593390e98490`) y `PRINCIPAL - Rances Car` (`activeVersionId` `65504132-b83c-458d-b0d1-83df8a774dc1`).
- **Pendiente: confirmar con tráfico real** que un lead SEGUIMIENTO y uno FRIO reciben efectivamente el tono distinto — no se probó con `test_workflow` (pinea nodos y no refleja el comportamiento real del LLM con datos reales) ni se forzó ninguna ejecución manual sobre un contacto real para no alterar datos de producción sin necesidad.
- **Fuera de alcance, explícitamente pausado:** derivación a vendedores por disponibilidad/rendimiento — no hay hoy ninguna señal de disponibilidad/rendimiento de vendedores en el sistema (ni en n8n/Mongo ni expuesta de forma usable en GHL/DealerCenter). Requeriría diseño propio aparte.
- Mensajes automáticos tipo seguimiento/urgencia proactivos (que el bot escriba primero sin que el lead responda) tampoco están incluidos — esto solo cambia cómo responde el bot cuando el lead sí escribe.
