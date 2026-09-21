---
tags: [forjado, cliente, carwarriors, gohighlevel, dealercenter, n8n, auditoria, whatsapp]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-21
---

# 2026-09-21 — Auditoría en vivo del Sync WhatsApp -> GHL -> DealerCenter y Verificación de Lead Assignment

## Contexto y Solicitud del Cliente
Jorge González (dueño de Carwarriors) y Jorge Calderón coordinaron una llamada operativa. Jorge González solicitó verificar si todos los clientes que entran por WhatsApp (tanto en Carwarriors LLC como en Rances Car) se están subiendo automáticamente a DealerCenter.
En paralelo, Bianca (marketing) envió un audio con instrucciones del soporte de DealerCenter sobre la reasignación de leads de Capital One hacia Dayron Barrizonte.

## Auditoría Técnica en Vivo (n8n + MongoDB + SFTP)

### 1. Sincronización GHL -> DealerCenter (`Subir a DealerCenter` — `ZxcF7cmf3V8FZabx`)
Se auditaron las últimas 300 ejecuciones del workflow conectado al webhook `ghl-dealercenter-adf`:
- **100% de las ejecuciones analizadas provienen de WhatsApp** (`source: Whatsapp`).
- Cobertura Multi-Dealer comprobada:
  - **Carwarriors LLC (CW):** 272 ejecuciones auditadas.
  - **Rances Car (RANCES):** 28 ejecuciones auditadas.
- Desglose de resultados:
  - **Leads Nuevos subidos exitosamente vía SFTP (ADF XML):** 
    - Ejemplo CW: **Marvin Medrano** (`+13054979454`), subido hoy **2026-09-21 10:38 AM Miami** (`1790001512137_UWCIn0MVln8gFOkbSODk.xml`, Lead Source `TESLA CW`).
    - Ejemplo Rances: **Wilys Sandoval** (`+13053376281`), subido el **2026-09-19** (`1789857610836_MH2b0iiglr835cKOj33a.xml`, Lead Source `TESLA RANCES`).
  - **Duplicados Evitados (Dedupe contra Mongo `dealercenter_customers`):** 295 de 300 ejecuciones. El filtro de teléfono previene saturar y duplicar registros preexistentes en DealerCenter cuando un contacto vuelve a escribir por WhatsApp o se actualiza en GHL.
  - **Leads sin teléfono:** 0 (todo contacto de WhatsApp incluye teléfono por definición de canal).

### 2. Estado de Chatbots y Canales Conexos
- **`PRINCIPAL` (CW):** 500+ ejecuciones en los últimos días, atendiendo con fluidez hoy.
- **`PRINCIPAL - Rances Car`:** 168 ejecuciones, atendiendo con normalidad hoy.
- **`COMENTARIOS-MANYCHAT`:** 8 ejecuciones registradas entre el 13 y el 20 de septiembre. Todas procesadas y clasificadas sin interés real de compra. El volumen orgánico de comentarios se mantiene bajo.

### 3. Aclaración Lead Assignment (Capital One -> Dayron Barrizonte)
Bianca consultó a soporte de DealerCenter e indicó modificar las reglas 16 y 17 de Customer Lead Assignment.
- **Verificación:** Esta acción ya fue completada y publicada el **15 de septiembre de 2026**:
  - **Rule 16 a Rule 31** (todas las variantes de Capital One) fueron reasignadas a **Dayron Barrizonte** (`Dayron Barrizonte - Barrizonte1996`).
  - **Rule 32** (OfferUp) fue creada y asignada a **Carlos Martínez** (`Carlos Martinez - Carlos4125`).
- El sistema de DealerCenter ya opera bajo estas reglas desde dicha fecha.
