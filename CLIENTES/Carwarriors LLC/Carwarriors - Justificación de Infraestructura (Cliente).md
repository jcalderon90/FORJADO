---
tags: [forjado, carwarriors, propuesta, cliente]
tipo: documento-cliente
estado: borrador
creado: 2026-06-18
actualizado: 2026-06-18
---

# Por qué esta infraestructura — Carwarriors LLC

> Documento de respaldo para presentar al cliente. Lenguaje de negocio, sin jerga técnica.

---

## La idea central

En lugar de depender de cinco plataformas distintas que no se hablan entre sí, vamos a construir **un sistema centralizado donde todo está conectado**. Cada lead que entra por Instagram, cada llamada que recibe el equipo, cada movimiento en el pipeline — todo fluye hacia un solo lugar, y desde ahí se automatiza.

El cliente no paga por plataformas que le cobran por cada acción. Paga por **su propia infraestructura**, que trabaja para él las 24 horas.

---

## Qué usamos y por qué

### 🖥️ Servidor propio (VPS)
**La razón:** Todo el sistema corre en un servidor que le pertenece al cliente. Sus datos no viven en plataformas de terceros que pueden cambiar precios, cerrarse o tener interrupciones. Si mañana cambia de agencia, se lleva todo.

**En términos simples:** Es como tener tu propia oficina en lugar de rentar un escritorio en un coworking. Más control, más seguridad, más estabilidad.

**Costo:** ~$8/mes. Menos que un café a la semana.

---

### ⚙️ n8n — El cerebro de las automatizaciones
**La razón:** n8n conecta todas las plataformas del cliente (GoHighLevel, ManyChat, DealerCenter, Zonitel) y ejecuta las automatizaciones sin límite de operaciones. Herramientas como Zapier o Make cobran por cada acción — con n8n el costo es fijo y no importa cuántos flujos corran.

**En términos simples:** Es el operador que nunca duerme. Recibe la información de cada plataforma, toma decisiones y ejecuta acciones — sin que nadie tenga que hacerlo manualmente.

**Por qué no Zapier o Make:** Ambos cobran por operación. Con el volumen de Carwarriors (96 llamadas/día + leads de Instagram + pipeline de ventas), el costo mensual sería 5–10x mayor. n8n corre en el servidor del cliente y no tiene ese costo variable.

---

### 🤖 Agentes de Inteligencia Artificial
**La razón:** Los agentes IA no son chatbots simples. Son sistemas que **leen el historial del lead**, entienden el contexto, y actúan de forma inteligente: califican al prospecto, sugieren el siguiente paso al vendedor, analizan por qué se perdió una venta, generan mensajes personalizados.

**En términos simples:** Es como darle a cada vendedor un asistente que ya leyó todo el historial del cliente antes de que empiece la conversación.

**Costo de IA:** Pay-per-use. Se paga solo por lo que se usa, aproximadamente $10–30/mes al volumen actual. No hay contrato fijo.

---

### 🗄️ Base de datos (MongoDB Atlas)
**La razón:** Toda la información del negocio — leads, llamadas, análisis, historial — queda guardada en una sola base de datos segura en la nube. Esta base también permite que los agentes IA "recuerden" el contexto de cada lead a lo largo del tiempo.

**En términos simples:** Es la memoria del sistema. Sin esto, cada automatización actúa sin saber qué pasó antes. Con esto, el sistema recuerda cada interacción y actúa en consecuencia.

**Costo:** $0 para empezar (plan gratuito). Solo escala cuando el volumen lo requiere.

---

### 🔗 GoHighLevel + ManyChat (sin cambios)
**La razón:** El cliente ya invirtió en estas plataformas y su equipo las conoce. No las reemplazamos — las **potenciamos**. GHL sigue siendo el CRM donde el equipo ve los leads. ManyChat sigue siendo el chatbot de Instagram. La diferencia es que ahora ambos están conectados al sistema central y las acciones ocurren automáticamente.

**En términos simples:** No cambia lo que ya funciona. Le agregamos inteligencia encima.

---

## Resumen de costos mensuales

| Componente | Costo |
|---|---|
| Servidor (VPS Hostinger KVM 1) | ~$8/mes |
| Base de datos (MongoDB Atlas) | $0 — gratis al inicio |
| Inteligencia Artificial (OpenRouter) | ~$10–30/mes |
| GoHighLevel | ya lo tienen |
| ManyChat | ya lo tienen |
| **Total infraestructura** | **~$18–38/mes** |

> Este costo es del cliente directo a los proveedores. El retainer de FORJADO es aparte y cubre el desarrollo, la configuración y el mantenimiento del sistema.

---

## Lo que esto reemplaza (o evita pagar)

| Si usaran otras herramientas | Costo estimado |
|---|---|
| Zapier (96 llamadas/día + leads) | +$200/mes |
| Chatbot IA externo (ManyChat IA) | +$50–100/mes |
| Plataforma de reportes de llamadas | +$100–200/mes |
| Consultor de datos por hora | +$500+/mes |
| **Total alternativa** | **+$850–$1,000/mes** |

---

## En una frase

> Construimos la infraestructura una vez, el cliente la posee para siempre, y trabaja sola. El costo mensual es menor que lo que paga un empleado por hora.
