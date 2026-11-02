---
tags: [forjado, cliente, varela-law, n8n, contratos, zelle]
tipo: raw
cliente: Varela Law
fecha: 2026-11-02
---

# Contratos verificados tras el fix del 10-15 y arreglo de la doble verificación de Zelle

Continuación de [[2026-11-02-revision-ejecuciones-y-fix-error-handler]] y de los puntos (b) y (d) de [[2026-10-15-revision-general-y-fix-fecha-contratos]].

## Contratos (`CONTRACTS FROM SLACK`, `jLgZaTceNMLtM9sh`) — solo lectura
Son los 3 primeros contratos reales después del fix del 10-15 (versión `f03c0161`). Todos `success`, con todos los nodos en verde:

| Ejecución | Fecha | Cliente | `fecha_contrato` | Honorarios abog./paral./asist. |
|---|---|---|---|---|
| #2990 | 10-27 | Gerardo Martinez Castillo (Family) | `2026-10-27` | 375 / 150 / 100-150 |
| #3015 | 10-29 | Jessica Banda (Family, "contract modification") | `2026-10-28` | 375 / 150 / 100-150 |
| #3016 | 10-29 | Jessica Banda (Family, "contract enforcement") | **`2021-10-28`** | **400 / 175** / 100-150 |

- **Fecha ISO: OK.** Las 3 salen en `YYYY-MM-DD` en el parser, en Mongo (`Create Case`, `Log Contract`) y en el Sheet.
- **Descarga del PDF sin token escrito a mano: OK.** `Download PDF` funcionó en las 3 con la credencial `Contract-Bot API`. El punto (b) del 10-15 queda cerrado.
- **Para revisar a mano:**
  - **#3016:** la IA leyó el año como **2021**, aunque el archivo se llama `2026-10-29 - jessica banda - scanned contract enforcement.pdf`. Los honorarios también difieren (400/175). Puede ser un contrato antiguo que de verdad es de 2021, o un error de lectura del escaneo. Hay que mirar el PDF. Si es un error, corregir la fecha del caso en Mongo `cases`, en `contracts_log` y en el Sheet `SLACK CONTRACTS`.
  - **Jessica Banda entró dos veces con 10 s de diferencia** (#3015 y #3016), y las dos ejecuciones pasaron por `Create Client as Contact`. Lo más probable es que haya **2 contactos duplicados** de Jessica Banda en Mongo `contacts`, cada uno con su caso. No lo pude comprobar porque no tengo herramienta de lectura sobre Mongo.

## Zelle (`BruqJ1jdEV9xl5zG`) — bug de la doble verificación, corregido
- En la ejecución #3068 de hoy (Chase, JORVIN TREMINIO, $500.00) la IA **sí respondió bien**, sin error de límite. Pero `RESPONSE` entregó `{"response":{}}`.
- **Causa:** el modelo usa `responseFormat: json_object`, así que el `Basic LLM Chain` entrega los campos ya separados en `$json` (`amount`, `senderName`…) y no un `$json.text`. `RESPONSE` hacía `$json.text.replace(...)`, saltaba al `catch` y devolvía `{ rawText: undefined }`, que queda como `{}`. Con eso, el `If` tomaba el monto de la IA como NaN y dejaba pasar todo. **La doble verificación estaba apagada justo cuando la IA funcionaba.** Por eso el atraso de "falla la IA" del 10-15 parecía ser solo de límite de uso.
- **Fix:** `RESPONSE` acepta las dos formas, texto (con o sin markdown) u objeto. El `If` normaliza `$` y comas también en el monto de la IA; si la IA no da monto, sigue dejando pasar el pago con el regex, como antes.
- Publicado: versión activa `b170c752` (la anterior era `ac7a0966`). Sin probar con un correo real. El próximo Zelle debe pasar por `RESPONSE` con `amount` lleno.
- **Nota:** el modelo es `openrouter/free` otra vez, no `google/gemma-4-31b-it:free` como dejó el fix del 10-09. El workflow se modificó el 10-30 (`updatedAt` 2026-10-30 15:44 UTC, con ejecuciones manuales #3030 y #3031), sin nota en la bóveda. Hoy funciona; si vuelven los límites de uso, fijar un modelo `:free`.

## Pendientes
- [ ] Mirar el PDF de #3016 (Jessica Banda, "enforcement") y decidir si 2021-10-28 está bien.
- [ ] Revisar en Mongo si Jessica Banda quedó duplicada en `contacts`; si es así, unir los contactos y dejar los 2 casos colgando del mismo.
- [ ] Ver con el próximo Zelle real que `RESPONSE` trae el monto y que el pago se registra.
- [ ] Averiguar quién cambió el workflow de Zelle el 10-30 y por qué.
