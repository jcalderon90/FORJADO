---
tags: [forjado, cliente, carwarriors, brief, manychat, dealercenter, marketing, ia-ventas]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-08-28
---

# 2026-08-28 (noche) — Brief de automatización entregado por Bianca (PDF "AUTOMATIZACION")

**Contexto:** Bianca le dio a Jorge Calderón acceso de invitado a ManyChat (ver [[2026-08-27-comentarios-ig-fb-investigacion]]) y junto con eso le compartió un PDF (`AUTOMATIZACION .pdf`, guardado en el Desktop de Jorge) con la lista completa de lo que el negocio quiere automatizar, y le dijo que ya puede empezar a ejecutar lo de ahí. Es la primera vez que el negocio entrega un brief estructurado de alcance en vez de pedidos puntuales sueltos — vale la pena tratarlo como fuente de verdad del roadmap deseado por el cliente, y contrastarlo contra lo que ya existe en producción.

## Contenido íntegro del PDF (transcrito, 3 páginas)

### 1. Chatbot (arreglar lo que ya tenemos y POTENCIARLO)
- Revisar el chatbot actual y detectar por qué no funciona bien
- Armar flujos nuevos que realmente conviertan (no respuestas genéricas)
- Crear distintos recorridos según: lead nuevo / seguimiento / lead frío (reactivación)
- Conectar todo bien con el CRM / DealerCenter
- Automatizar derivación a vendedores según disponibilidad o rendimiento
- Mensajes automáticos tipo seguimiento y urgencia ("últimas unidades", etc.)
- Testear constantemente y optimizar (no dejarlo estático)

### 2. Automatización dentro de DealerCenter (marcado MUY IMPORTANTE por el cliente)
- Detectar tasks viejos que nadie tocó (ej: +48 o +72 hs)
- Reasignarlos automáticamente a otra persona
- Actualizar la fecha para que vuelvan a ser oportunidad real
- Detectar leads abandonados y reactivarlos
- Automatizar creación de tasks según ingreso de lead / último contacto
- Ordenar el pipeline: evitar leads duplicados, actualizar estados automáticamente según comportamiento

### 3. Automatización en contabilidad / números
- Categorizar gastos automáticamente
- Reportes mensuales automáticos
- Medir ROI real de campañas (Meta, etc.)
- Detectar gastos raros o fuera de lo normal
- Dashboard con costo por lead, costo por venta, rentabilidad por campaña

### 4. Automatizaciones de marketing
- Secuencias automáticas de mensajes para leads: bienvenida / seguimiento / cierre
- Automatizar respuestas en Instagram y WhatsApp (comentarios + DMs)
- Llevar gente a canal de difusión o base de datos
- Segmentar leads automáticamente (no todos reciben lo mismo)
- Activar campañas según comportamiento del usuario

### 5. IA aplicada a ventas
- Scoring de leads (saber quién está más cerca de comprar)
- Sugerir próximos pasos a los vendedores automáticamente
- Analizar conversaciones para entender por qué no se cierran ventas
- Generar mensajes personalizados con IA para cada lead

### 6. Soporte al equipo (BDC y ventas)
- Estandarizar procesos para que todos trabajen mejor
- Detectar quién está rindiendo mejor y quién necesita mejorar
- Automatizar seguimientos para que nadie deje leads tirados

### 7. Automatizaciones ya realizadas en ManyChat (documentado por el propio cliente en el PDF)
- **Story + palabra clave** → mensaje de Bianca ofreciendo $500 OFF de downpayment con botón a WhatsApp.
- **Saludo a nuevos seguidores** → ofrece ver inventario, botones a `carwarriorsllc.com/inventory` y a un canal de difusión de IG (`ig.me/j/AbYfb1AQ4IxsGwBA/`).
- **Comentarios en post/reel** → invita a unirse al "club" con botón a un post de IG (mismo link `ig.me`).

Esta sección confirma textualmente lo que ya estaba documentado en la bóveda (tabla "Automatizaciones ManyChat Vigentes" en [[carwarriors-llc-source-2026-08-25]]) — sin datos nuevos, pero sirve como confirmación cruzada directa desde el cliente.

## Contraste contra lo que ya existe en producción (para no reconstruir lo hecho)

| Punto del PDF | Estado real hoy |
|---|---|
| Chatbot: arreglar lo que no funciona | Ya migrado de GHL Conversation AI a n8n + OpenRouter, en producción ambos dealers desde 2026-08-19, con handoff humano, guardrails (spam, expectativa gratuita), fix de idioma — ver [[../../wiki/clientes/carwarriors-llc|wiki]]. La corrección de fondo ya se hizo; falta la parte de **recorridos diferenciados** (lead nuevo/seguimiento/frío) y **derivación a vendedores por disponibilidad/rendimiento**, que NO existe todavía. |
| Mensajes de seguimiento/urgencia | No construido — el bot hoy es reactivo (responde lo que preguntan), no proactivo (no dispara mensajes de seguimiento ni de urgencia por su cuenta). |
| DealerCenter: tasks viejos +48/72h → reasignar | **No construido.** Coincide en espíritu con el bug de auto-asignación de BDC Rep ya reportado a soporte de DealerCenter (ver pendiente en wiki), pero es un problema distinto: eso es sobre leads nuevos que entran sin BDC Rep asignado; esto es sobre tasks que ya tienen dueño pero quedan estancados. Dos problemas separados, ninguno resuelto todavía. |
| Leads abandonados → reactivar | No construido — no hay ningún workflow de reactivación de leads fríos hoy. |
| Pipeline sin duplicados / estados automáticos | Parcialmente cubierto: el sync GHL↔DealerCenter ya hace dedupe al subir leads (confirmado 2026-08-27), pero no hay actualización automática de *estados* según comportamiento. |
| Contabilidad/números | Nada construido — no hay ningún workflow tocando gastos, ROI de Meta, ni dashboard financiero. |
| Marketing: secuencias bienvenida/seguimiento/cierre | No construido como secuencia proactiva — el bot responde, no empuja una secuencia predefinida. |
| Marketing: automatizar respuestas IG/WhatsApp (comentarios + DMs) | DMs de IG/WhatsApp: sí, vía el bot n8n en producción. **Comentarios de post/reel**: es exactamente el frente ya en investigación (ManyChat External Request hacia n8n, ver [[2026-08-27-comentarios-ig-fb-investigacion]]) — este PDF es la confirmación de que Bianca lo considera parte del roadmap prioritario y ya autorizó avanzar. |
| Canal de difusión / base de datos | Ya existe el link de canal de difusión en ManyChat (usado en 2 de los 3 flujos), pero no hay automatización nueva alrededor — es solo un link estático. |
| Segmentación / campañas por comportamiento | No construido. |
| IA aplicada a ventas (scoring, sugerencias, análisis, mensajes personalizados) | No construido — es la pieza más ambiciosa del brief. El scoring de "lead caliente" ya estaba parcialmente planteado en el pendiente de SMS a Jorge González (reusar el LLM del pipeline), pero sigue sin construirse. |
| Soporte al equipo / estandarización | No construido — es más proceso/gestión que automatización técnica pura; requiere definición de Bianca/Jorge González sobre qué métricas de rendimiento importan. |

## Lectura y siguiente paso

Bianca dio luz verde explícita ("ya podía hacer esto de aquí") con el acceso a ManyChat como entrada — el frente más inmediato y ya en curso es el de **comentarios en post/reel vía External Request hacia n8n**, que este PDF confirma como parte del pedido real del negocio, no una idea unilateral de Jorge Calderón. El resto del brief (DealerCenter tasks viejos, contabilidad, IA de ventas, segmentación) es alcance nuevo y grande — no hay indicación de que Bianca lo priorizó por encima de lo ya en curso (ManyChat, ticket de soporte DealerCenter, SMS). Tratarlo como backlog de roadmap a conversar con Jorge González/Bianca sobre orden de prioridad, no como pedido urgente indiferenciado.

**Pendiente:** decidir con Jorge (el consultor, no el cliente) el orden de ataque del backlog nuevo antes de comprometer fechas con Bianca — probablemente: (1) terminar comentarios IG/FB en ManyChat (ya en curso, trial corriendo), (2) DealerCenter tasks viejos +48/72h (marcado MUY IMPORTANTE por el cliente), (3) el resto según disponibilidad.

**Estado:** brief recibido y documentado, sin ejecutar todavía más allá de lo que ya estaba en curso (ManyChat comentarios IG/FB).
