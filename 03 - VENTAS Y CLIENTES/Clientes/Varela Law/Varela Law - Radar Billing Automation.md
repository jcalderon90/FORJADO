---
tags: [forjado, varela-law, automatizacion, mycase, google-sheets, n8n]
tipo: proyecto
cliente: Varela Law
estado: pendiente
creado: 2026-06-20
actualizado: 2026-06-20
---

# Varela Law — Automatización: Radar Billing & Payments

## Problema actual

Mario llena manualmente la pestaña **Billing & Payments** del Google Sheet "Radar - Civil Cases" extrayendo los datos financieros de cada caso en MyCase uno por uno. Esto toma **2-3 horas** cada vez que lo actualiza.

---

## Proceso manual actual

1. Ir a MyCase → buscar cliente en el Search box
2. Seleccionar el **caso** (ícono portafolio, no el perfil/monito del cliente)
3. Dentro del caso: **Time & Billing → Info**
4. Copiar los números de "Case Billing Totals" y "Running Trust Balance"
5. Pegarlos manualmente en el Google Sheet

---

## Google Sheet

- **Nombre:** Radar - Civil Cases
- **URL:** https://docs.google.com/spreadsheets/d/1jo3XRFfWRVNJViiPRYjqPt3I-hRw0zl3RPPfQuIaPLw/edit
- **Acceso:** varelalawremote@gmail.com

### Pestaña: Civil Cases (fuente maestra)

| Col | Campo | Notas |
|---|---|---|
| A | Client Name | Lista de todos los clientes activos |
| B | Case | Tipo de caso |
| C | Case Status | Estado actual |
| D | Balance | |
| E | Party | Pet / Resp / App |
| F | Opposing Party | |
| G | Retained | Fecha de retención |
| H | DCO | |
| I | Ag | Días abierto |
| J | Resp | Paralegal/abogado asignado |
| K | Case No. | Número de caso |
| L | Notes | Notas internas |

### Pestaña: Billing & Payments (destino de la automatización)

| Col | Campo | Origen |
|---|---|---|
| A | Client | De Col A de Civil Cases |
| B | Retained | De Col G de Civil Cases |
| C | Para | Paralegal asignado (manual por ahora) |
| D | Tot Collected | **MyCase** → Total Amount Collected |
| E | Inv Awaiting Pmt | **MyCase** → Invoices Awaiting Payment |
| F | Tot Invoiced | **MyCase** → Total Invoiced Amount |
| G | Avl Trust | **MyCase** → Available Trust Balance |
| H | Uninvoiced | **MyCase** → Un-Invoiced Balance |
| I | Trust Bal | **MyCase** → Running Trust Balance |
| J | Tot Outstanding | Fórmula calculada |
| K | Net Trust Bal | Fórmula calculada |
| L | Type | Notas (HOLD, FF, etc.) |

---

## Datos a extraer de MyCase

Ruta en MyCase: **Caso → Time & Billing → Info → Case Billing Totals**

| Campo MyCase | Col Sheet |
|---|---|
| Total Amount Collected | D |
| Invoices Awaiting Payment | E |
| Total Invoiced Amount | F |
| Available Trust Balance | G |
| Un-Invoiced Balance | H |
| Running Trust Balance | I |

---

## Plan de automatización (n8n)

### Flujo propuesto

1. **Trigger** — manual o programado (ej. cada lunes)
2. **Leer Google Sheet** — obtener lista de clientes desde pestaña Civil Cases (Col A)
3. **Por cada cliente** — buscar en MyCase API (`GET /cases` filtrando por nombre)
4. **Obtener billing** — llamar al endpoint de billing del caso
5. **Escribir en Sheet** — actualizar columnas D-I en pestaña Billing & Payments

### Endpoints MyCase relevantes

```
GET /cases?query={nombre_cliente}   → encontrar el case_id
GET /cases/{id}                     → datos del caso
GET /invoices?case_id={id}          → facturas del caso
GET /time_entries?case_id={id}      → entradas de tiempo
```

> [!note] Los campos exactos de billing (Trust Balance, etc.) pueden venir del endpoint `/cases/{id}` o requerir combinar `/invoices` + `/time_entries`. Confirmar con una llamada de prueba.

### Ahorro estimado
**2-3 horas → ~5 minutos** de ejecución automática.

---

## Estado

- [ ] Confirmar acceso a Google Sheet con varelalawremote@gmail.com
- [ ] Probar `GET /cases` con nombre de cliente para validar búsqueda
- [ ] Identificar endpoint exacto que devuelve Trust Balance y billing totals
- [ ] Construir workflow en n8n
- [ ] Prueba con un cliente real (ej. Wendy Perla)
- [ ] Despliegue y programación del trigger

---

## Relacionado

- [[Varela Law]] — datos del cliente y accesos
- [[Varela Law - MyCase API]] — documentación técnica de la API
