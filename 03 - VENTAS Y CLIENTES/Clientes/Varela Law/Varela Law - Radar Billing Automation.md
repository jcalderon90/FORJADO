---
tags: [forjado, varela-law, automatizacion, mycase, google-sheets, n8n]
tipo: proyecto
cliente: Varela Law
estado: en curso
creado: 2026-06-20
actualizado: 2026-07-13
---

# Varela Law — Automatización: Radar Billing & Payments

## Problema actual

Mario llena manualmente la pestaña **Billing & Payments** del Google Sheet "Radar - Civil Cases" extrayendo los datos financieros de cada caso en MyCase uno por uno. Esto toma **2-3 horas** cada vez que lo actualiza.

---

## Estado actual (resumen — 2026-07-13)

- **Join de identidad resuelto:** se abandonó el join por "Case No." (eran dos sistemas de numeración distintos, nunca compatibles) y se construyó la pestaña **ID MAP** vía el workflow `Radar Billing - Build ID MAP (TEST)` (n8n `JoQ4f8txlZTi89O4`). Cobertura: 69% match limpio, 2% ambiguo, 28% sin match — necesita revisión humana.
- **Join real reconstruido usando ID MAP como llave estable (2026-07-13):** `Radar Billing - Join to TEST2` (`UPrV8mk5weAKswuT`) ya no re-deriva el match por nombre en cada corrida — lee ID MAP directamente, limpia TEST2 antes de escribir (re-ejecutable sin duplicar) y deja en blanco las filas `AMBIGUOUS`/`NO MATCH` para revisión manual. Ejecutado con éxito (ejecución `2026`, status `success`). **Pendiente confirmar en el Sheet real** cuántas de las 68 filas limpias trajeron billing — no se pudo verificar el contenido de TEST2 desde esta sesión (sin acceso de lectura directo al Sheet).
- **Bloqueado en 2 frentes, ambos esperando a terceros:**
  1. Mario está revisando manualmente ID MAP (filas `AMBIGUOUS`/`NO MATCH`, 30 de 98) — sin fecha aún. Se puede avanzar en paralelo (propuesto, no iniciado): ayudar a proponer candidatos de match para esas filas si se comparte un export de ID MAP.
  2. Mario va a preguntarle a soporte de MyCase si existe un endpoint no documentado para Trust Balance / Invoices Awaiting Payment (la API pública no los expone, hallazgo del 2026-07-05). Alternativa propuesta (no iniciada): revisar la documentación pública de MyCase (Stoplight) en busca de endpoints de trust accounting no probados todavía.
- **Layout del destino final resuelto a medias:** Mario confirmó usar la pestaña **07-05-26** como referencia y descartó **Billing and Payments**. Todavía falta releer el layout de columnas y la fórmula de Net Trust Balance contra 07-05-26 (la sección "Procedimiento manual actualizado" abajo describe un layout hipotético basado en TEST, no en 07-05-26 — pendiente de reemplazar).
- **No tocar aún:** "Billing & Payments" ni la pestaña 07-05-26 real — todo el trabajo de automatización sigue aislado en TEST/TEST2/ID MAP hasta validar montos y layout con Mario.

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
- [x] **Bloqueante del join re-investigado y en gran parte resuelto — 2026-07-06.** La nota anterior ("solo 2 de 84 cruzaron") estaba mal diagnosticada. Se construyó un workflow de diagnóstico temporal (`Radar Billing - Join Diagnostic (scratch)`, archivado tras el análisis) que leyó CIVIL CASES (99 filas) y TEST (1077 filas) en vivo y comparó ambas columnas "Case No." normalizando (minúsculas, sin espacios/guiones/puntuación). Resultado real:
  - **84 de 99 filas cruzan exacto por Case No. normalizado** (ej.: `"2025- 21058"` en ambos lados, mismo string literal incluyendo el espacio interno raro — el problema anterior era no normalizar, no un sistema de numeración distinto).
  - **+11 filas más cruzan por nombre de cliente** (fallback) — son filas donde CIVIL CASES tiene la columna "Case No." vacía.
  - **Solo 3 casos reales sin cruzar**: Kindelan Jose, Paredes Rogelio, Tizol Julian — a revisar manualmente (probablemente casos cerrados que no están en MyCase, o con nombre muy distinto).
  - 1 fila adicional sin match es `"TOTAL"`, un footer de resumen del Sheet, no un caso real — hay que filtrarla en el workflow real.
  - **Cobertura real: 95 de 98 casos reales (97%)** se pueden vincular automáticamente con Case No. normalizado + fallback por nombre.
- [x] Construido el workflow real de join **"Radar Billing - Join to TEST2"** (n8n id `UPrV8mk5weAKswuT`) — 2026-07-06/07. Seguí instrucción explícita del usuario de **no tocar TEST ni Billing & Payments todavía**: este workflow lee CIVIL CASES en vivo, trae `/cases`+`/invoices`+`/invoice_payments`+`/time_entries`+`/expenses` de MyCase en vivo (no desde la pestaña TEST), aplica la regla de join (Case No. normalizado → fallback por nombre → descarta filas de footer) y escribe en una pestaña nueva **TEST2** (gid `305326864`), creada específicamente para esto. Primer intento (ejecución `1975`) falló solo al escribir — TEST2 estaba vacía y `appendOrUpdate` necesita headers preexistentes; se corrigió a operación `append`. Segundo intento (ejecución `1977`) corrió completo sin error.
- [x] **RESUELTO 2026-07-08 — causa raíz del hallazgo crítico del 2026-07-07.** Se verificó contra la UI real de MyCase (3 casos, incluido Barbosa) que el `case_number` de MyCase **es estable y nunca cambia** — no es un problema de inmutabilidad. La causa real: la columna "Case No." de CIVIL CASES es un **número de expediente judicial** (ej. `2025-89003`, formato `AÑO-NNNNN` con condado/corte), un sistema de numeración **totalmente distinto** al `case_number` de MyCase (formato `NN-NNNN`, ej. `25-1291`). Nunca fueron el mismo identificador — el 97% de cobertura del diagnóstico del 2026-07-06 fue un espejismo: comparaba snapshot contra snapshot y el matching por nombre (fallback) ocultó el problema real. Confirmado con evidencia de la ejecución real de `Radar Billing - Join to TEST2` (`1977`): 0 matches exactos por Case No. en las filas inspeccionadas.
- [x] **Decisión de arquitectura (2026-07-08):** abandonar el join por "Case No." por completo. Se descubrió una pestaña **ID MAP** (gid `2067761435`) ya creada en el Sheet con el esquema correcto (`Client (Sheet)`, `Case No. (Sheet)`, `MyCase ID`, `MyCase Case No.`, `MyCase Name`, `Status`, `Match Method`) pero vacía — claramente pensada para esto pero nunca implementada.
- [x] **Construido y ejecutado workflow "Radar Billing - Build ID MAP (TEST)"** (n8n id `JoQ4f8txlZTi89O4`) — 2026-07-08. Trae todos los cases de MyCase, lee CIVIL CASES, y matchea por nombre parseado ("Apellido, Nombre [- Sufijo]") con desambiguación por sufijo de matter (EMP/FMF/CNV) y por número de expediente embebido en el nombre de MyCase cuando hay múltiples candidatos. Limpia y reescribe ID MAP en cada corrida (idempotente). En el camino se corrigió un bug real del workflow anterior: el matching viejo (primer token del nombre, sin validar apellido completo) había asignado erróneamente **dos clientes distintos** ("Correa, Jose" y "Correa, Vladimir") al mismo caso de MyCase (`26-1358`).
  - **Resultado sobre 98 filas de CIVIL CASES:** 68 matches automáticos limpios (69%: 65 apellido+nombre, 2 desambiguados por expediente embebido, 1 por apellido único), 2 `AMBIGUOUS` (mismo cliente con varios matters, sin señal para elegir), 28 `NO MATCH` (probablemente casos cerrados fuera del fetch de `/cases`, clientes no creados aún en MyCase, o discrepancias de nombre — no es un bug, requiere ojo humano).
- [ ] **Pendiente:** revisar manualmente en la pestaña ID MAP las filas `AMBIGUOUS`/`NO MATCH` (filtrar por columna "Match Method") y completar a mano el MyCase ID/Case No. donde se pueda determinar.
- [ ] Una vez revisado ID MAP: reconstruir el join real usando ID MAP como llave persistente (no re-derivar el matching por nombre en cada corrida), escribir en TEST2 para validar, y solo después tocar "Billing & Payments" — validando montos de un par de casos reales contra la UI de MyCase.
- [x] **Respuesta de Mario (2026-07-08):** confirmó que la pestaña **07-05-26** es la más actualizada (la que llena a mano día a día) y que la pestaña **Billing and Payments** puede ignorarse — queda descartada como destino/referencia. Falta re-derivar el layout de columnas y la fórmula de Net Trust Balance contra 07-05-26 en vez de contra Billing & Payments.
- [ ] **En curso — Mario va a checar con soporte de MyCase (2026-07-08)** sobre si hay forma de obtener **Trust Balance** e **Invoices Awaiting Payment** (el hallazgo del 2026-07-05 de que no están disponibles vía la API pública de MyCase). Ni el join ni el matching resuelven esto — bloqueado en espera de su respuesta antes de decidir si la automatización parcial (Total Invoiced, Total Collected, Un-Invoiced) es suficiente.
- [ ] Con la pestaña 07-05-26 confirmada como referencia: releer su layout de columnas y fórmulas (reemplaza la sección "Procedimiento manual actualizado" abajo, que estaba basada en un layout hipotético de TEST/Billing & Payments) y confirmar la fórmula real de Net Trust Balance.
- [ ] Despliegue y programación del trigger (recién después de validar el join, los montos, y el layout final con Mario).
- [x] **Reconstruido el join real usando ID MAP como llave persistente (2026-07-13).** Se modificó `Radar Billing - Join to TEST2` (`UPrV8mk5weAKswuT`) mientras se espera respuesta de Mario: (1) nodo nuevo `Clear TEST2` limpia la pestaña antes de cada corrida (mismo patrón idempotente que ya usaba `Build ID MAP`, evita duplicar filas al re-ejecutar); (2) el nodo antes llamado `Read Civil Cases` ahora lee la pestaña **ID MAP** en vez de CIVIL CASES; (3) el nodo de join (`Join via ID MAP`, antes `Join Civil Cases with MyCase`) ya no re-deriva el match por nombre en cada corrida — usa directamente el `MyCase Case No.` guardado en ID MAP como llave estable, eliminando el riesgo del bug de matching por primer nombre (Correa Jose/Vladimir) que sí existía en esta versión vieja. Las filas `AMBIGUOUS`/`NO MATCH` de ID MAP pasan a TEST2 con billing en blanco (visibles, no bloquean el resto). Ejecutado en modo manual (ejecución `2026`, 2026-07-13, ~3.5 min, status `success`). **Pendiente confirmar en el Sheet:** cuántas de las 68 filas limpias de ID MAP trajeron billing real en TEST2 — no hay acceso directo de lectura al Sheet desde esta sesión para verificarlo automáticamente.

---

## Procedimiento manual actualizado (versión 2026-07-06)

> [!warning] Reemplaza la definición anterior de la pestaña "Billing & Payments" — layout y fuente de columnas distintos
> Mario describió este procedimiento el 2026-07-06 como el que está siguiendo manualmente ahora mismo, usando la pestaña **07-05-26** como referencia (la va llenando a mano día a día). Tiene columnas y origen de datos diferentes a lo documentado antes en este archivo — ver conflictos abajo.

**(1) Copiar de la pestaña Civil Cases a las columnas A-E de la pestaña nueva (TEST):**

| Col TEST | Campo | Origen (Civil Cases) |
|---|---|---|
| A | Client Name | Col A |
| B | Case Type | Col B |
| C | Retained | Col G |
| D | Age | Col I |
| E | Resp | Col J |

**(2) Llenar columnas F-K con datos de MyCase (Caso → Time & Billing → Info):**

| Col TEST | Campo | Origen MyCase |
|---|---|---|
| F | Total Amount Collected | Case Billing Totals |
| G | Invoices Awaiting Payment | Case Billing Totals |
| H | Total Invoiced Amount | Case Billing Totals |
| I | Available Trust Balance | Running Trust Balance |
| J | Uninvoiced Balance | Running Trust Balance |
| K | Running Trust Balance | Running Trust Balance |

**(3) Columnas calculadas:**

| Col TEST | Campo | Fórmula |
|---|---|---|
| L | Total Outstanding | `H + J` (Total Invoiced Amount + Uninvoiced Balance) |
| M | Net Trust Balance | `G - E - H` (ver duda abajo) |
| N | Type | En blanco por ahora |

> [!bug] Duda sin resolver — fórmula de Net Trust Balance (col M)
> La fórmula `G - E - H` resta la columna **E**, que en este layout es **"Resp"** (paralegal/abogado asignado — texto, no un número). Restar texto de una fórmula financiera no tiene sentido; en Sheets se trataría como 0 y el resultado real sería `G - H` (Invoices Awaiting Payment − Total Invoiced Amount), lo cual tampoco es claramente "Net Trust Balance" en términos conceptuales. Hipótesis: desfase de letras de columna, posiblemente copiado de una versión anterior del Sheet antes de insertar Case Type/Age/Resp al inicio. **Pendiente:** confirmar contra la pestaña `07-05-26` (que Mario llena a mano) cuál es el cálculo real antes de automatizar o dar esto por definitivo.

> [!bug] SUPERADO 2026-07-08 — Mario confirmó ignorar "Billing and Payments" y usar la pestaña 07-05-26 como referencia. Este bloque de conflicto queda obsoleto en cuanto se releve el layout contra 07-05-26.

> [!bug] Conflicto — nombre de pestaña "TEST" ya está en uso con otro layout
> La pestaña **TEST** ya fue poblada el 2026-07-06 por el workflow n8n `Radar Billing - Auto Fill (TEST)` (`gQjtpc3B4NinSsW5`) con **993 filas** y columnas `Client, Case No. (MyCase), Status, Practice Area, Billing Type, Outstanding Balance, Opened/Closed Date, Tot Invoiced, Tot Collected, Uninvoiced` (ver sección "Estado" más abajo). Es un layout distinto al de este procedimiento manual (A-N). **Pendiente confirmar con Mario:** si este procedimiento manual va en la misma pestaña TEST (pisando el volcado automático) o en una pestaña separada, y si el volcado automático de 993 filas sigue vigente o se reemplaza por este enfoque.
>
> También difiere de la definición anterior de la pestaña **Billing & Payments** (A-L, sin Case Type/Age/Resp, "Para" en vez de esas tres columnas) — ver tabla al inicio de este archivo. No está claro si "Billing & Payments" y este nuevo layout de "TEST" son el mismo destino final o dos cosas paralelas.

---

## Relacionado

- [[Varela Law]] — datos del cliente y accesos
- [[Varela Law - MyCase API]] — documentación técnica de la API
