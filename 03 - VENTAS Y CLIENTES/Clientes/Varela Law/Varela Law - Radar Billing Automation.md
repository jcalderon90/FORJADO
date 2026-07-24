---
tags: [forjado, varela-law, automatizacion, mycase, google-sheets, n8n]
tipo: proyecto
cliente: Varela Law
estado: en curso
creado: 2026-06-20
actualizado: 2026-07-23
---

# Varela Law — Automatización: Radar Billing & Payments

## Problema actual

Mario llena manualmente la pestaña **Billing & Payments** del Google Sheet "Radar - Civil Cases" extrayendo los datos financieros de cada caso en MyCase uno por uno. Esto toma **2-3 horas** cada vez que lo actualiza.

---

## Estado actual (resumen — 2026-07-23)

- **Join de identidad resuelto:** se abandonó el join por "Case No." (eran dos sistemas de numeración distintos, nunca compatibles) y se construyó la pestaña **ID MAP** vía el workflow `Radar Billing - Build ID MAP (TEST)` (n8n `JoQ4f8txlZTi89O4`). Cobertura automática original: 69% match limpio, 2% ambiguo, 28% sin match.
- **Join real reconstruido usando ID MAP como llave estable (2026-07-13):** `Radar Billing - Join to TEST2` (`UPrV8mk5weAKswuT`) ya no re-deriva el match por nombre en cada corrida — lee ID MAP directamente, limpia TEST2 antes de escribir (re-ejecutable sin duplicar) y deja en blanco las filas `AMBIGUOUS`/`NO MATCH` para revisión manual. Ejecutado con éxito (ejecución `2026`, status `success`). **Pendiente confirmar en el Sheet real** cuántas de las 68 filas limpias trajeron billing — no se pudo verificar el contenido de TEST2 desde esta sesión (sin acceso de lectura directo al Sheet).
- **24 de las 28 filas `NO MATCH` resueltas manualmente (2026-07-15):** el "NO MATCH" no era un caso genuinamente irresoluble — el parser de `Build ID MAP` asume que el nombre en MyCase sigue el orden "Apellido, Nombre", pero muchos casos en MyCase están en orden "Nombre Apellido" o con el número de expediente pegado al nombre sin separador. Se cruzó cada apellido sin match contra los 994 casos completos de MyCase (abiertos+cerrados) y se encontró candidato de alta confianza para 24 de los 28 (la mayoría confirmado porque el docket del Sheet aparece embebido literalmente en el nombre de MyCase). Se construyó un workflow puntual **"Radar Billing - ID MAP Manual Corrections"** (n8n `Fo0Jh3eNIHcEaIcm`) que escribió esas 24 correcciones directo en ID MAP (ejecución `2032`, éxito), marcadas con `Match Method = "manual - resolved 2026-07-15"`. **Cobertura actual de ID MAP: 94 de 98 clientes (~96%).**
- **Quedan 4 filas sin resolver**, genuinamente necesitan criterio humano (ver detalle en la sección "Estado" más abajo): 2 `AMBIGUOUS` (Joj, Santos / Medina, Manuel — múltiples casos candidatos en MyCase, sin docket para desempatar) y 2 de confianza media (Marquez, Dimas / Rojas Tovar, Manuel — coincide el nombre pero no hay expediente para confirmar).
- **Bug de fondo detectado, sin corregir todavía:** si `Radar Billing - Build ID MAP (TEST)` (`JoQ4f8txlZTi89O4`) se vuelve a correr completo (p.ej. al agregar clientes nuevos a CIVIL CASES), su parser regenerará estas mismas 24 filas como `NO MATCH` otra vez, porque no maneja nombres en orden invertido ni dockets pegados sin separador. Vale la pena parchear el parser antes de la próxima corrida completa — si no, hay que repetir esta reconciliación manual.
- **RESUELTO — ambas preguntas a Mario respondidas.** (1) Layout final: tab **07-05-26**, ignorar "Billing & Payments" (respondió 2026-07-08). (2) Trust Balance/Invoices Awaiting Payment: soporte de MyCase confirmó que no están disponibles vía API (respondió 2026-07-23) — automatización parcial confirmada como alcance final.
- **Queda pendiente, no depende de Mario:** revisión manual de las 4 filas `AMBIGUOUS`/media-confianza en ID MAP (ver detalle en sección "Estado" abajo).
- **RESUELTO 2026-07-23 — layout real de 07-05-26 confirmado leyendo la pestaña en vivo.** Ver sección "Layout real de la pestaña 07-05-26" más abajo. Solo F (Total Amount Collected), H (Total Invoiced Amount) y J (Uninvoiced Balance) son automatizables; G/I/K/L/M quedan manuales (cadena de dependencia de Trust Balance). Fórmula real de Net Trust Balance resuelta: `Available Trust Balance − (Invoices Awaiting Payment + Uninvoiced Balance)`.
- **RESUELTO 2026-07-23 — "07-05-26" confirmado como pestaña fija (sin preguntarle a Mario).** Se listaron las 8 pestañas reales del Sheet (`sheetsSearch`): ninguna otra tiene nombre de fecha — descarta rotación por ciclo. `07-05-26` (gid `2118643852`) es el destino final.
- **EN CURSO 2026-07-23 — reconstruido `Radar Billing - Join to TEST2` (`UPrV8mk5weAKswuT`) para escribir solo F/H/J.** El nodo `Join via ID MAP` ahora solo calcula y expone `Total Amount Collected (F)`, `Total Invoiced Amount (H)`, `Uninvoiced Balance (J)` + `Client`/`Match Type` (antes traía columnas de un layout viejo que ya no aplica); `Clear TEST2` ahora limpia también el header (antes solo el cuerpo) para que el header nuevo se escriba solo. Ejecutado con éxito (ejecución `2080`, ~3.5 min).
- **✅ RESUELTO Y VERIFICADO 2026-07-23 — bug de signo en F (Total Amount Collected).** Investigado a fondo vía un workflow de diagnóstico puntual (`DIAG - Invoice Payments Sign Investigation`, n8n id `Xvjn45vTFsBb6nqf`, ejecución `2082`) que desglosó los 2835 registros de `/invoice_payments` por `transaction_type`: los tipos `Trust` (590 registros, -598,824 en total) y `CREDIT` (6 registros, -6,328) son los únicos negativos; todo lo demás (Purchase/Other/Check/Cash/Credit Card/Zelle) ya es positivo. `Trust` representa dinero trasladado desde la cuenta de trust del cliente hacia operativo para pagar una factura — sí cuenta como "cobrado" para MyCase, solo que su ledger interno lo registra en negativo (confirmado una nota real: *"Traslado de trust a operationg para cerrar caso"*). **Fix aplicado:** en el nodo `Sum Payments By Case`, tomar `Math.abs()` solo de los montos `Trust` antes de sumar (se dejan `CREDIT` en negativo, ya que un reembolso real sí debe restar). **Verificado contra la UI real de MyCase** (login con Playwright, caso de Byron Batres, id `46275856`, Case Billing Totals): Total Amount Collected real = **$2,822.25**; nuestro cálculo corregido dio exactamente **$2,822.25** (ejecución `2086`). También Alvarado, Irma dio `$5,863.30`, coincidiendo con la magnitud vista antes en la pestaña real. **F queda confiable.**
- **✅ RESUELTO Y VERIFICADO 2026-07-23 — H (Total Invoiced Amount) incompleto por un filtro por defecto de la API, no un bug de código.** Al verificar Batres contra la UI real: Total Invoiced Amount real = **$3,015.69**, nuestro cálculo daba **$0**. El endpoint `/invoices` reportaba en su propio header `item-count: 233` (total real según la API, no fallo de paginación nuestro) — sospechosamente bajo para 999 casos y miles de pagos. **Causa raíz encontrada en la documentación oficial de MyCase** (https://mycaseapi.stoplight.io/docs/mycase-api-documentation/163a0a18de0f2-get-invoices): la descripción del endpoint dice textualmente *"By default, only invoices with 'Online Payments Enabled' will be returned."* — existe un parámetro `only_allowed_online_payments` (boolean, default `true`) para desactivar ese filtro. **Fix:** se agregó `&only_allowed_online_payments=false` a la URL del nodo `Fetch Invoices (Paginated)`. **Verificado contra la UI real:** Batres pasó de $0 a **$3,015.69 exacto** (ejecución `2088`). **Bonus de verificación cruzada:** Alvarado, Irma ahora da F=$5,863.30 y H=$9,169.80, coincidiendo EXACTO con la fila de ejemplo leída antes de la pestaña real 07-05-26 (fila 2) — confirma con un segundo caso independiente que ambos bugs (F y H) quedaron resueltos. **0 de 20 filas de muestra con H=0** tras el fix (antes eran 5 de 10). **H queda confiable.**
- **Estado final de F/H/J: los tres quedan automatizables y verificados.** F y H verificados contra 2 casos reales independientes (Batres via UI en vivo, Alvarado via el ejemplo de 07-05-26). J (Uninvoiced Balance) no tuvo casos de prueba con valor distinto de 0 en la muestra, pero su lógica no cambió y no mostró señales de bug.
- **Próximo paso real:** (1) revisar visualmente TEST2 en el Sheet para una pasada final de sanity-check con más filas, (2) construir/activar el workflow de producción que escriba F/H/J en la pestaña 07-05-26 real (trigger manual o programado, a decidir), (3) revisar las 4 filas de ID MAP que aún necesitan criterio humano (no bloqueante, en paralelo).
- **No tocar aún:** "Billing & Payments" ni la pestaña 07-05-26 real — sigue pendiente el paso de pasar de TEST2 (validación) a producción, pero ya no hay bugs conocidos bloqueando ese paso.

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

### Pestaña: Billing & Payments (histórico — SUPERADO, ver nota abajo)

> [!bug] OBSOLETO — Mario confirmó 2026-07-08 que esta pestaña se ignora. El destino real es **07-05-26**, ver sección "Layout real de la pestaña 07-05-26" más abajo (única fuente confiable de columnas/fórmulas). Tabla dejada aquí solo como referencia histórica de cómo arrancó el proyecto.

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

## Datos a extraer de MyCase (histórico — columnas de Sheet abajo se refieren a Billing & Payments, ya OBSOLETO)

Ruta en MyCase: **Caso → Time & Billing → Info → Case Billing Totals**. Los campos de MyCase en sí siguen vigentes; el mapeo "Col Sheet" de abajo es viejo — ver el mapeo real a columnas F-M de la pestaña 07-05-26 más abajo.

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
- [x] **RESUELTO 2026-07-23 — Mario confirmó con soporte de MyCase.** No hay forma de obtener **Trust Balance** ni **Invoices Awaiting Payment** vía API — soporte de MyCase lo confirmó directamente, coincide con el hallazgo propio del 2026-07-05. **Decisión de alcance final: automatización parcial** — Total Amount Collected, Total Invoiced Amount y Un-Invoiced Balance se automatizan desde MyCase; Trust Balance (Available/Running) e Invoices Awaiting Payment quedan manuales, como hace Mario hoy.
- [x] **RESUELTO 2026-07-23 — releído el layout real de 07-05-26** vía workflow de inspección `Radar Billing - Read 07-05-26 (Inspection)` (`uaI9ESCgYiB6VGFd`, ejecución `2079`). Ver sección "Layout real de la pestaña 07-05-26" más abajo — reemplaza por completo la vieja sección "Procedimiento manual actualizado". Fórmula real de Net Trust Balance confirmada.
- [x] **RESUELTO 2026-07-23 — confirmado que "07-05-26" es la pestaña fija** (no rotativa), listando las 8 pestañas reales del Sheet — no fue necesario preguntarle a Mario.
- [x] **Reconstruido `Join via ID MAP` para escribir solo F/H/J (2026-07-23)** — antes tenía columnas de un layout viejo (Status, Practice Area, Outstanding Balance...) que ya no aplican al destino real. Ejecutado con éxito (ejecución `2080`).
- [x] **RESUELTO Y VERIFICADO 2026-07-23 — bug de signo en "Total Amount Collected" (col F).** Diagnóstico puntual (`DIAG - Invoice Payments Sign Investigation`, `Xvjn45vTFsBb6nqf`, ejecución `2082`) confirmó que solo los `transaction_type` `Trust` y `CREDIT` de `/invoice_payments` vienen negativos; `Trust` sí es dinero cobrado (traslado interno de fondos ya en trust), solo que MyCase lo registra en negativo. Fix: `Math.abs()` únicamente sobre montos `Trust` en `Sum Payments By Case`, dejando `CREDIT` como resta legítima. Verificado contra la UI real de MyCase (caso Batres, id `46275856`): real $2,822.25, calculado $2,822.25 exacto (ejecución `2086`). **F queda confiable.** Pendiente replicar el mismo fix en `Radar Billing - Auto Fill (TEST)` (`gQjtpc3B4NinSsW5`) si se sigue usando, ya que comparte el código viejo (con bug).
- [x] **RESUELTO Y VERIFICADO 2026-07-23 — H (Total Invoiced Amount) incompleto por filtro por defecto de la API.** Verificado contra Batres: real $3,015.69, calculado $0. Causa encontrada en la documentación oficial de MyCase: `/invoices` por defecto solo devuelve invoices con "Online Payments Enabled" (parámetro `only_allowed_online_payments`, default `true`). Fix: agregado `&only_allowed_online_payments=false` a la URL de `Fetch Invoices (Paginated)`. Verificado: Batres pasó a $3,015.69 exacto (ejecución `2088`); Alvarado, Irma coincidió exacto con la fila de ejemplo de 07-05-26 (F=$5,863.30, H=$9,169.80) — segundo caso independiente confirmando ambos fixes. 0 de 20 filas de muestra con H=0 tras el fix. **H queda confiable.**
- [ ] **Sanity-check final antes de producción:** revisar visualmente TEST2 en el Sheet con más filas, y confirmar J (Uninvoiced Balance) con al menos un caso de valor distinto de cero (la muestra actual solo tuvo J=0/20, salvo Boutte con J=20).
- [ ] Despliegue y programación del trigger hacia la pestaña 07-05-26 real (ya no hay bugs conocidos bloqueando este paso — F y H verificados contra 2 casos reales independientes).
- [x] **Reconstruido el join real usando ID MAP como llave persistente (2026-07-13).** Se modificó `Radar Billing - Join to TEST2` (`UPrV8mk5weAKswuT`) mientras se espera respuesta de Mario: (1) nodo nuevo `Clear TEST2` limpia la pestaña antes de cada corrida (mismo patrón idempotente que ya usaba `Build ID MAP`, evita duplicar filas al re-ejecutar); (2) el nodo antes llamado `Read Civil Cases` ahora lee la pestaña **ID MAP** en vez de CIVIL CASES; (3) el nodo de join (`Join via ID MAP`, antes `Join Civil Cases with MyCase`) ya no re-deriva el match por nombre en cada corrida — usa directamente el `MyCase Case No.` guardado en ID MAP como llave estable, eliminando el riesgo del bug de matching por primer nombre (Correa Jose/Vladimir) que sí existía en esta versión vieja. Las filas `AMBIGUOUS`/`NO MATCH` de ID MAP pasan a TEST2 con billing en blanco (visibles, no bloquean el resto). Ejecutado en modo manual (ejecución `2026`, 2026-07-13, ~3.5 min, status `success`). **Pendiente confirmar en el Sheet:** cuántas de las 68 filas limpias de ID MAP trajeron billing real en TEST2 — no hay acceso directo de lectura al Sheet desde esta sesión para verificarlo automáticamente.
- [x] **Resueltas manualmente 24 de las 28 filas `NO MATCH` de ID MAP (2026-07-15).** Diagnóstico: el parser de `Build ID MAP` (`JoQ4f8txlZTi89O4`) asume nombre de MyCase en orden "Apellido, Nombre" — falla con "Nombre Apellido", "Nombre, Apellido" (coma invertida), o docket pegado al nombre sin separador. Se buscó cada apellido sin match por substring contra los 994 casos completos de MyCase (abiertos+cerrados, no solo los activos) y se encontró un candidato único de alta confianza para 24 de los 28, la mayoría confirmado porque el número de expediente del Sheet aparece literalmente embebido en el nombre de MyCase (ej. Batres, Byron → docket `2025-02982` = `202502982` en el nombre MyCase "Byron Rafael Batres 202502982..."). Se construyó el workflow puntual **"Radar Billing - ID MAP Manual Corrections"** (n8n `Fo0Jh3eNIHcEaIcm`, Code node con las 24 correcciones hardcodeadas → Google Sheets Update matcheando por "Client (Sheet)") y se ejecutó (ejecución `2032`, éxito) — las 24 filas quedaron escritas en ID MAP con `Match Method = "manual - resolved 2026-07-15"`. Usuario confirmó explícitamente esta escritura (ID MAP es la pestaña de staging designada, no producción, pero el clasificador de modo automático de Claude Code pidió confirmación igual antes de escribir).
- [ ] **Quedan 4 filas sin resolver en ID MAP**, necesitan criterio humano (no se pueden auto-resolver con más búsqueda):
  - `Joj, Santos` (docket Sheet `2025-46359`) — 3 casos candidatos en MyCase (`25-1162` cerrado, `25-1275`, `26-1320`), ninguno tiene ese docket embebido.
  - `Medina, Manuel` (docket Sheet "New") — 2 candidatos: `25-1262` (Divorce) y `26-1407` (TN visa). El de Divorce es más probable dado que la pestaña es "CIVIL CASES", pero sin confirmar.
  - `Marquez, Dimas` (docket Sheet `2025-88199`) — único candidato `25-1239`, pero el docket embebido en el nombre de MyCase (`2025-22518`) no coincide con el del Sheet — posible caso relacionado distinto, confirmar antes de asignar.
  - `Rojas Tovar, Manuel` (docket Sheet `2026-24745`) — único candidato por primer apellido `25-1130` ("Manuel Rojas"), sin docket para confirmar.
- [ ] **Corregir el parser de `Build ID MAP` (`JoQ4f8txlZTi89O4`) antes de la próxima corrida completa** — si se re-ejecuta tal cual (p.ej. al agregar clientes nuevos a CIVIL CASES), regenerará las mismas 24 filas ya resueltas como `NO MATCH` de nuevo, porque el parser no maneja nombre en orden invertido ni docket sin separador.

---

## Layout real de la pestaña 07-05-26 (CONFIRMADO 2026-07-23, leído en vivo)

> [!important] Reemplaza por completo la sección anterior ("Procedimiento manual actualizado 2026-07-06"), que era una descripción verbal de Mario sobre un layout parecido en TEST — nunca confirmada contra 07-05-26 misma. Esta sección sí viene de una lectura real de la pestaña 07-05-26 (workflow de inspección `Radar Billing - Read 07-05-26 (Inspection)`, n8n id `uaI9ESCgYiB6VGFd`, ejecución `2079`, 2026-07-23, modo `general: 'FORMULA'` para ver fórmulas crudas).

**Columnas A-E — NO son estáticas, se generan solas:** están pobladas por una fórmula array `=QUERY('CIVIL CASES'!A:J, "SELECT A, B, G, I, J", 1)` anclada en A1, que trae en vivo Client Name/Case Type/Retained/Age/Resp desde CIVIL CASES. **La automatización no necesita tocar ni escribir estas columnas** — ya están sincronizadas por el propio Sheet.

**Columnas F en adelante (datos MyCase + fórmulas), confirmadas con datos reales de 5 filas de ejemplo:**

| Col | Campo | Origen | ¿Automatizable? |
|---|---|---|---|
| F | Total Amount Collected | MyCase | ✅ Sí |
| G | Invoices Awaiting Payment | MyCase | ❌ No — confirmado sin API (Mario, 2026-07-23) |
| H | Total Invoiced Amount | MyCase | ✅ Sí |
| I | Available Trust Balance | MyCase | ❌ No — confirmado sin API (Mario, 2026-07-23) |
| J | Uninvoiced Balance | MyCase | ✅ Sí (vía agregación de time_entries/expenses billable, ver hallazgo 2026-07-05) |
| K | Running Trust Balance | Fórmula `=I{row}-J{row}` | ❌ No — depende de I (bloqueada) |
| L | Total Outstanding | Fórmula `=G{row}+J{row}` | ❌ No — depende de G (bloqueada) |
| M | **Net Trust Balance** | Fórmula `=I{row}-L{row}` | ❌ No — depende de I y L |
| N | Num Overdue Invoices | Sin confirmar origen | 🟡 Por investigar (posible via conteo de `/invoices` vencidas) |
| O | Type | Manual, vacío en la muestra | — |
| P | "Amount Collected " (con espacio final) | Vacío en toda la muestra — posible columna legacy sin uso | — |
| Q+ | Notas de actividad fechadas en texto libre (ej. "7/13/26 invoices sent", "7/14 Unbilled Charges") | Manual, log de seguimiento del staff | — (fuera de alcance) |

**RESUELTA la duda pendiente de la fórmula de Net Trust Balance:** no es `G - E - H` (esa era una hipótesis sobre un layout equivocado). La real es **`Available Trust Balance − Total Outstanding`**, donde `Total Outstanding = Invoices Awaiting Payment + Uninvoiced Balance`. Como I y G están bloqueadas (no vía API), el bloqueo se propaga en cadena a K, L y M.

**Conclusión práctica — alcance final de la automatización:** de las columnas numéricas F-M, **solo F (Total Amount Collected), H (Total Invoiced Amount) y J (Uninvoiced Balance) son automatizables**. G, I, K, L y M quedan manuales, tal como Mario ya las llena. N queda pendiente de investigar (no es MyCase Billing Totals clásico, podría salir de `/invoices` filtrando vencidas).

**Nota técnica menor:** en la fila de ejemplo 6, la columna K (Running Trust Balance) no tenía fórmula sino un valor fijo (`1500`) — evidencia de que Mario a veces sobreescribe manualmente el resultado calculado. La automatización de F/H/J no debería tocar K/L/M, así que esto no es un conflicto, pero confirma que estas columnas se editan a mano con cierta frecuencia.

**RESUELTO 2026-07-23 — "07-05-26" es la pestaña fija, no rotativa.** Se listaron las 8 pestañas reales del Sheet (`sheetsSearch` vía n8n): CIVIL CASES, 07-05-26, CLOSED CASES/OWE MONEY, Billing & Payments, FMF, TEST2, TEST, ID MAP. Solo existe **una** pestaña con nombre de fecha — no hay ninguna otra fechada anterior (ej. 06-28-26), lo que descarta la hipótesis de rotación por ciclo sin necesidad de preguntarle a Mario. `07-05-26` (gid `2118643852`) es el destino final confirmado.

**Pendiente de resolver, no bloqueante:** confirmar si "Num Overdue Invoices" (col N) es automatizable desde `/invoices` de MyCase.

---

## Relacionado

- [[Varela Law]] — datos del cliente y accesos
- [[Varela Law - MyCase API]] — documentación técnica de la API
