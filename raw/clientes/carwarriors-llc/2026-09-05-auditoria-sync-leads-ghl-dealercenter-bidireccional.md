---
tags: [forjado, cliente, carwarriors, dealercenter, sync, lead-source, bug]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-05
---

# 2026-09-05 — Auditoría de la sincronización de leads GHL↔DealerCenter (ambas direcciones): sana en general, bug latente (sin daño real todavía) en el mapeo de Lead Source Tesla/Trade-In

**Contexto:** Jorge pidió comprobar que la sincronización de leads en las 2 direcciones se esté haciendo correctamente con todas sus condiciones de negocio.

**Nota de sesión:** el MCP de `n8n-carwarriors` estuvo caído ~5 minutos a mitad de esta auditoría (timeout en toda llamada, incluida una búsqueda simple) — Jorge lo reconectó desde su lado y se retomó sin pérdida de trabajo.

**Método:** inspección de código de los 2 workflows en producción (`Subir a DealerCenter` GHL→DC y `DealerCenter -> Mongo -> GHL (Lead Sync)` DC→GHL), auditoría de ejecuciones reales recientes de ambos, y verificación cruzada contra la colección espejo `dealercenter_customers` en Mongo (alimentada por el reporte diario real de DealerCenter — es la fuente de verdad de qué Lead Source strings existen de verdad en DealerCenter) usando el mismo patrón de workflow temporal de solo lectura ya usado antes (creado, ejecutado, **archivado inmediatamente**).

## Dirección GHL → DealerCenter (`Subir a DealerCenter`, webhook)

Condiciones de negocio verificadas en código y confirmadas con ejecuciones reales de hoy:

1. **Gate de teléfono** (`Tiene Telefono?`): si el contacto de GHL no tiene teléfono, corta en `Sin Telefono - No Enviado` sin armar ni subir el XML. Confirmado en código; no se encontró un caso real en la muestra de ejecuciones revisada (la mayoría de los leads reales llegan con teléfono vía WhatsApp/Instagram), pero la lógica es correcta y ya fue la causa/fix de un bug documentado el 2026-09-01.
2. **Dedupe contra Mongo** (`Buscar en Mongo (Dedupe)` + `Es Cliente Nuevo?`): busca en `dealercenter_customers` por teléfono o email antes de subir; si ya existe, va a `Duplicado Evitado` sin re-subir. **Verificado con múltiples ejecuciones reales de hoy** (ej. "OLLIANIS NA", "JOSE ESCALANTE") — funcionando correctamente.
3. **Hallazgo operativo (no es un bug, es diseño correcto):** el sync inverso (DealerCenter→GHL) crea/actualiza contactos en GHL, lo que dispara la automatización de GHL que llama a este mismo webhook — un ciclo potencial. Confirmado con ejecuciones reales (ráfaga de ~20 ejecuciones a las 12:31 UTC hoy, coincidiendo exactamente con la ventana del sync diario DC→GHL): el dedupe de Mongo detecta correctamente que esos contactos ya existen en `dealercenter_customers` (porque vinieron de ahí) y los enruta a `Duplicado Evitado` — **el ciclo se rompe correctamente, no genera duplicados.**
4. **XML/ADF correcto:** verificado byte a byte un XML real subido hoy (lead "Jhovany Rosario", Instagram/Meta) — `requestdate` ISO sin milisegundos/zona, `vendor id=14031841` correcto, escaping de XML aplicado, subida SFTP exitosa a `/Leads/`.

### 🟡 Hallazgo real: mapeo de Lead Source para Tesla/Trade-In no coincide con los valores reales de DealerCenter (bug latente, sin daño confirmado todavía)

El código de `Build ADF XML` tiene un `LEAD_SOURCE_MAP` que decide el Lead Source según si `attributionSource.campaign` contiene "TESLA" o "TRADE" (si no, cae a un bucket genérico "META"):

```js
const LEAD_SOURCE_MAP = {
  CW: { TESLA: 'Tesla CW', TRADE: 'TRADE IN CW', META: 'META CW' },
  RANCES: { TESLA: 'TESLA RANCES', TRADE: 'Trade in Rances', META: 'Meta Rances' }
};
```

Verificado contra la colección `dealercenter_customers` (ground truth real, viene del Excel real de DealerCenter):

- **CW / META → `META CW`**: coincide exacto. Confirmado con 25+ leads reales desde 2026-08-12 hasta hoy, siempre "META CW" tal cual — **esta rama, la que usa casi el 100% del tráfico real del bot (leads orgánicos de redes sociales), está sana.**
- **CW / TESLA → código genera `Tesla CW`, la realidad es `TESLA CW`** (todo mayúsculas). Mismatch confirmado — el código de este mismo archivo tiene un comentario propio advirtiendo exactamente este riesgo ("una capitalización distinta crea una categoría nueva y separada, fragmentando el reporte").
- **RANCES / TRADE → código genera `Trade in Rances`, la realidad es `TRADE IN RANCES`** (todo mayúsculas, sin guión) — mismatch confirmado, y "TRADE IN RANCES" es de hecho la fuente MÁS común en los leads reales de Rances.
- **CW / TRADE → código genera `TRADE IN CW`; la realidad tiene 3 variantes ya coexistiendo en DealerCenter** (`CW TRADE IN` — la más común, orden invertido; `TRADE-IN CW` — con guión; y datos legacy con errores de tipeo tipo `TRADE RAMSES`/`TRADE IN RAMCES`) — ninguna coincide con lo que genera el código. Esto es parte del mismo pendiente abierto desde 2026-07-23 (ver [[../../wiki/clientes/carwarriors-llc-sftp-dealercenter]]) de "levantar la tabla completa de valores de Lead Source con Jorge/Bianca" — sigue sin resolverse.
- **RANCES / TESLA → código genera `TESLA RANCES`, coincide con la realidad.** ✅

**Impacto real, no teórico:** se buscó explícitamente (case-sensitive) si alguna vez se creó un registro real con los valores exactos que genera el código (`Tesla CW`, `Trade in Rances`, `Meta Rances`, `TRADE IN CW`) — **cero resultados.** Esto significa que las ramas Tesla/Trade de este clasificador prácticamente nunca se disparan en la práctica (el campo `attributionSource.campaign` de un lead orgánico de redes sociales rara vez contiene literalmente "TESLA" o "TRADE") — **no hay daño confirmado hoy**, pero es una mina de tiempo: el día que sí se dispare (ej. una campaña paga de Meta Ads llamada "Tesla Trade-In Q4"), crearía una categoría de Lead Source nueva y mal escrita en DealerCenter, que muy probablemente no coincidiría con ninguna de las 31 reglas de Custom Lead Assignment — el mismo patrón exacto que causó el ~40% de leads mal asignados a Alejandra Roa en la auditoría del 2026-08-29 (fuentes "sin dueño claro").

**No se corrigió en esta sesión** — el valor correcto de CW/Trade-In sigue ambiguo entre "CW TRADE IN" y "TRADE-IN CW" (dos variantes reales conviviendo), necesita que Jorge/Bianca confirmen cuál es la oficial antes de tocar el código. CW/Tesla y RANCES/Trade sí tienen un valor correcto inequívoco confirmado por los datos (`TESLA CW`, `TRADE IN RANCES`) — se podría corregir esos dos con confianza si Jorge lo pide.

## Dirección DealerCenter → Mongo → GHL (`DealerCenter -> Mongo -> GHL (Lead Sync)`, cron diario)

Condiciones de negocio verificadas:

1. **Extracción del Excel:** localiza la fila real de encabezados buscando "Customer Unique ID" (evita filas de metadata del reporte). Filas sin `customerUniqueId` se descartan.
2. **Enrutamiento de dealer:** por substring "RANCES" en el Lead Source (mayúsculas), si no contiene "RANCES" cae a CW por defecto — consistente con que las 3 subcuentas comparten un solo DCID y se distinguen solo por convención de nombre.
3. **Normalización de teléfono:** últimos 10 dígitos + prefijo `+1`.
4. **Upsert en Mongo** (`dealercenter_customers`, por `customerUniqueId`, con `onError: continueRegularOutput` — un registro con error no tumba el resto del batch).
5. **Gate de contacto usable** (`Con Email o Telefono`, filtro): solo sigue a GHL si hay email o teléfono. Verificado en 2 ejecuciones reales completas (hoy: 50/50 items pasaron; ayer 09-04: 200/200 pasaron) — el filtro nunca tuvo que descartar nada en la muestra revisada (DealerCenter parece no generar filas sin ningún dato de contacto), pero está ahí como red de seguridad.
6. **Upsert en GHL** (`/contacts/upsert`, batching de 5, `onError: continueRegularOutput`): **0 errores** en las 2 ejecuciones completas revisadas (50 y 200 items respectivamente).

**Salud operativa:** cron corre cada día ~12:30 UTC, sin huecos desde 2026-08-23 (13 ejecuciones consecutivas, todas `success`), consistente con el chequeo de salud previo del 08-27.

## Actualización (misma sesión) — fix aplicado y publicado

Jorge confirmó `CW TRADE IN` como el valor a usar para CW/Trade-In (la variante real más común, 6+ casos vs 1 de `TRADE-IN CW`). Se corrigió `LEAD_SOURCE_MAP` en el nodo `Build ADF XML` de `Subir a DealerCenter`:

```js
// Antes
CW: { TESLA: 'Tesla CW', TRADE: 'TRADE IN CW', META: 'META CW' },
RANCES: { TESLA: 'TESLA RANCES', TRADE: 'Trade in Rances', META: 'Meta Rances' }
// Despues
CW: { TESLA: 'TESLA CW', TRADE: 'CW TRADE IN', META: 'META CW' },
RANCES: { TESLA: 'TESLA RANCES', TRADE: 'TRADE IN RANCES', META: 'Meta Rances' }
```

Publicado y verificado byte a byte en la versión activa (`versionId` y `activeVersionId` ambos `89dcf751-bb80-4ece-a27f-33bddb2d948b`). `META CW`/`Meta Rances` sin tocar (ya alineados). No se probó con una ejecución sintética — como estas ramas (Tesla/Trade) casi nunca se disparan con tráfico real (el campo `attributionSource.campaign` rara vez contiene esas palabras), no hay forma de confirmar el fix sin esperar a que ocurra un caso real o forzar un campaign de prueba; se deja para observar la próxima vez que se dispare una de esas dos ramas.

## Pendiente real

- [ ] Decidir con Jorge/Bianca si corregir el `LEAD_SOURCE_MAP` de `Build ADF XML` ahora (preventivo, sin daño activo) o esperar — mínimo CW/Tesla (`Tesla CW` → `TESLA CW`) y RANCES/Trade (`Trade in Rances` → `TRADE IN RANCES`) tienen corrección inequívoca; CW/Trade-In necesita que confirmen cuál de las 2 variantes reales (`CW TRADE IN` vs `TRADE-IN CW`) es la oficial antes de tocarlo.
- [ ] Sigue abierto desde 2026-07-23: levantar la tabla completa de valores de Lead Source por campaña/dealer con Jorge/Bianca (bloqueador humano, no técnico) — este hallazgo aporta datos nuevos reales a ese pendiente.
- [ ] 2 leads de prueba (`FORJADO TEST BORRAR`, `FORJADO TEST BORRAR CALENDAR`) siguen visibles en el espejo `dealercenter_customers` (marcados `LOST`) pese a que el vault documenta que se limpiaron el 2026-08-25 — no confirmado si siguen en DealerCenter real o es que el espejo no refleja borrados. No investigado a fondo, bajo impacto.

## Relacionado

- [[carwarriors-llc]]
- [[../../wiki/clientes/carwarriors-llc-sftp-dealercenter|carwarriors-llc-sftp-dealercenter (investigación original ADF/XML)]]
- [[2026-08-29-dealercenter-bdc-rep-auto-asignacion-bug]]
- [[2026-08-27-chequeo-salud-sync-leads]]
