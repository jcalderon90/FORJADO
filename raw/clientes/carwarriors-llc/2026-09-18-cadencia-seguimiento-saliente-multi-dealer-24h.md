# 2026-09-18 — Implementación de Cadencia de Seguimiento Saliente Multi-Dealer (24h) en Producción

## Contexto y Objetivo
El playbook BDC automotriz establece que cuando un prospecto deja de responder en los canales digitales (WhatsApp, Instagram, Facebook Messenger, SMS), el sistema debe ejecutar una secuencia de re-enganche oportuna.

Debido a la restricción regulatoria de Meta (WhatsApp Business API y Messenger), los mensajes en texto plano solo pueden enviarse dentro de la **ventana de 24 horas** desde la última interacción del usuario; fuera de esa ventana se requiere una plantilla pre-aprobada por Meta.

Se acordó con Jorge unificar la solución en un único workflow multi-dealer (`CW` y `RANCES`) y construir la cadencia completa de 3 intentos dentro de la ventana segura de 24 horas.

---

## Decisiones Técnicas y Arquitectura

### 1. Multi-Dealer Nativo (Carwarriors + Rances Car)
- El nodo `Buscar Leads Silenciosos` consulta MongoDB (`users`) filtrando:
  ```json
  {
    "dealer": { "$in": ["CW", "RANCES"] },
    "spam_bloqueado": { "$ne": true },
    "has_reservation": { "$ne": true }
  }
  ```
- La tabla de datos de n8n `GHL Locations` (`3V2Oq6RyrnfPtkzi`) provee dinámicamente el `ghlToken` y `vendorName` según el `locationId` del lead.

### 2. Ventanas de Tiempo y Ejecución (Schedule Trigger cada 15 min)
Para garantizar cobertura completa sin huecos ni envíos duplicados, la consulta divide los silencios en tres franjas contiguas de 15 minutos:
1. **Intento 1 (~1 hora):** `[ $now - 75m, $now - 60m )`
2. **Intento 2 (~5 horas):** `[ $now - 315m, $now - 300m )`
3. **Intento 3 (~20 horas):** `[ $now - 1215m, $now - 1200m )`

### 3. Matriz de Mensajes BDC (Español / Inglés)

| Intento | Timing | Objetivo BDC | Mensaje en Español | Mensaje en Inglés |
| :---: | :---: | :--- | :--- | :--- |
| **1** | 60 min | Cierre de 2 opciones para hoy | *"¡Hola! Vi que estabas interesado [en el {vehículo}]. Tengo disponibilidad hoy para que lo veas — ¿te queda mejor a las 4pm o a las 6pm?"* | *"Hi! I saw you were interested [in the {vehículo}]. I have availability today for you to see it — does 4pm or 6pm work better?"* |
| **2** | 5 horas | Gancho de $0 down y cita mañana | *"¡Hola! ¿Pudiste revisar los horarios? Si prefieres, te puedo ir adelantando las opciones con $0 de inicial [para el {vehículo}] o apartarte un espacio para mañana por la mañana. ¿Qué te queda mejor?"* | *"Hi! Were you able to check the schedule? If you prefer, I can share our $0 down payment options [for the {vehículo}] or reserve a spot for tomorrow morning. Which works better for you?"* |
| **3** | 20 horas | Cierre de retirada (Push-Away Close) | *"¡Hola! Como no tuvimos respuesta, asumí que ya resolviste o pausaste la búsqueda del auto. Avísame si aún te interesa [el {vehículo} / ver opciones] para guardarte el turno antes de cerrarlo, o si prefieres que no te contactemos más."* | *"Hi! Since we didn't hear back, I assumed you found another option or paused your search. Let me know if you're still interested [in the {vehículo}] so I can save your spot before closing it out, or if you prefer no further messages."* |

---

## Manejo de Estado en MongoDB (`recontacto_saliente`)
- Se evalúa `cand.last_interaction` contra `prev.last_interaction_relevante`.
- Si el lead responde en cualquier momento, `PRINCIPAL` actualiza su `last_interaction`, lo que automáticamente reinicia el ciclo de seguimiento desde el Intento 1 si vuelve a quedar en silencio más adelante.
- Si el lead agenda una cita (`has_reservation: true`) o se marca spam (`spam_bloqueado: true`), queda automáticamente excluido de la consulta.
- Se previene cualquier envío redundante verificando que `previoIntento >= targetIntento`.

---

## Despliegue y Sincronización
- **Workflow n8n:** `Fh4fB5Cgk1hchvxe`
- **Nombre:** `SEGUIMIENTO SALIENTE - Cadencia 24h (CW + Rances Car)`
- **Versión Activa:** `ac921e29-0f75-499e-9820-da687acd4e0d`
- **Archivo Local:** `raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/SEGUIMIENTO-SALIENTE-CADENCIA-24H.json`
