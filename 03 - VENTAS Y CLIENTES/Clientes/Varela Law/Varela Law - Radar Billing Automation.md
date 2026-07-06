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

## Investigación de API (2026-07-05) — hallazgo importante

> [!warning] No todos los campos están disponibles vía API pública de MyCase
> Se probó en vivo contra la API real (usando el caso demo `[SAMPLE] John Doe Matter`, id `14752926`, que MyCase incluye por defecto — no es un cliente real):
>
> - `GET /cases` y `GET /cases/{id}` — solo traen `outstanding_balance` genérico. Ninguno de los 6 campos de billing.
> - `GET /invoice_payments`, `GET /time_entries`, `GET /expenses` — el filtro `case_id` **no funciona server-side** (hay que traer todo y filtrar en n8n, o paginar). Sirven como insumo para reconstruir por agregación:
>   - **Total Amount Collected** ← sumar `amount` de `/invoice_payments` por caso
>   - **Total Invoiced Amount** ← sumar montos de `/invoices` por caso (no probado directamente, pero es el endpoint lógico)
>   - **Un-Invoiced Balance** ← `/time_entries` + `/expenses` marcados `billable` sin `invoices` asociado
> - **Available Trust Balance, Running Trust Balance e Invoices Awaiting Payment (como agregado) NO aparecen en ningún endpoint probado.** Todo indica que MyCase no expone el trust accounting vía su API pública (común en software legal por razones de compliance/IOLTA).
>
> **Implicación:** la automatización, tal como está planteada, **no puede reemplazar completamente** el proceso manual de Mario — como mucho puede auto-completar 2-3 de las 6 columnas (D, E parcial, H), dejando el Trust Balance (columnas G, I) manual. Antes de construir el workflow completo hay que decidir si esto vale la pena parcialmente, o si conviene preguntarle a soporte de MyCase si hay un endpoint de trust accounting no documentado.

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

- [x] Probar `GET /cases` — no soporta búsqueda por nombre vía `?query=` (se probó y no filtró; devuelve la lista paginada completa) — 2026-07-05
- [x] Identificar endpoint exacto que devuelve Trust Balance y billing totals — **no existe**; ver hallazgo arriba — 2026-07-05
- [x] Decisión: automatización parcial ahora (Total Invoiced, Total Amount Collected, Un-Invoiced Balance) — 2026-07-06
- [x] Construir workflow "Radar Billing - Auto Fill (TEST)" en n8n (id `gQjtpc3B4NinSsW5`) — 2026-07-06. Pagina `/cases`, `/invoices`, `/invoice_payments`, `/time_entries`, `/expenses` vía cursor (header `Link`, no `page`/`per_page` como decía la doc — ver [[Varela Law - MyCase API]]), agrupa por caso, escribe en la pestaña TEST del Sheet.
- [x] **BLOQUEANTE de join documentado:** la columna "Case No." de la pestaña CIVIL CASES **no usa el mismo formato** que `case_number` de MyCase (sistemas de numeración distintos). De 84 casos activos, solo 2 cruzaron. El match por nombre tampoco es confiable.
- [x] Decisión (2026-07-06): en vez de bloquear todo por el join, se simplificó el workflow para volcar **todos los datos disponibles de MyCase directamente a la pestaña TEST** (sin cruzar contra el Sheet), usando el propio `case_number`/`name` de MyCase como identificador — para tener el dato crudo disponible y decidir el mapeo después con calma.
- [x] Workflow "Radar Billing - Auto Fill (TEST)" (`gQjtpc3B4NinSsW5`) ejecutado con éxito — **993 filas** escritas en la pestaña TEST: Client, Case No. (MyCase), Status, Practice Area, Billing Type, Outstanding Balance, Opened/Closed Date, Tot Invoiced, Tot Collected, Uninvoiced. Cobertura: 147 casos con invoices, 713 con pagos, 388 con tiempo no facturado, 57 con gastos no facturados — 2026-07-06
- [ ] Revisar la pestaña TEST con Mario/el usuario y decidir cómo vincular esto con "CIVIL CASES" y "Billing & Payments" (opciones: agregar columna con el case_number de MyCase al Sheet, cruzar por cliente/contacto en vez de por caso, u otro identificador)
- [ ] Una vez resuelto el join: probar con un cliente real y validar los montos contra la UI de MyCase
- [ ] Despliegue y programación del trigger (recién después de validar el join y los montos)

---

## Relacionado

- [[Varela Law]] — datos del cliente y accesos
- [[Varela Law - MyCase API]] — documentación técnica de la API
