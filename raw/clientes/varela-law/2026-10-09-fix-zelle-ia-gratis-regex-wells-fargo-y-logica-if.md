---
tags: [forjado, cliente, varela-law, n8n, zelle, openrouter, regex, fix]
tipo: raw
cliente: Varela Law
fecha: 2026-10-09
---

# Fix en Tracking de Pagos Zelle — IA gratis fija, regex de Wells Fargo y lógica del `If`

Workflow: **`TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK`** (`BruqJ1jdEV9xl5zG`). Jorge pidió revisar dos ejecuciones del 2026-10-09 que figuraban como "Succeeded" (#2746 a las 07:40 CT y #2745 a las 00:26 CT).

## Diagnóstico

Ambas ejecuciones terminaron "exitosas" pero por la **rama de discrepancia del `If`**: mandaron el correo de alerta a `jcalderon900610@gmail.com` y **no** pasaron por Mongo, Google Sheets ni "marcar como leído". Los pagos no quedaron registrados y los correos siguen sin leer.

| Ejecución | Correo | Qué falló |
|---|---|---|
| #2746 | Chase — PEDRO SANDOVALBECER, $650.00, trans. 31145442877 | El regex extrajo todo bien. La IA devolvió `User Safety: unsafe / Safety Categories: Fraud/Deception, PII/Privacy` en vez del JSON: `openrouter/free` es un router que a veces asigna un modelo de moderación (tipo `nemotron-content-safety`). El `If` comparó `Number(undefined)` con 650 → falso. |
| #2745 | Wells Fargo — LAW OFFICE OF MARIO VARELA, PLLC, $1,000.00, memo "Owner withdrawal", conf. JPM99cz8odsb | La IA acertó el monto pero dio transacción "6334". El regex falló: el formato de Wells Fargo no tiene la etiqueta `Amount` ni `Transaction number` ("sent you $1,000.00", "Confirmation: …"), así que sacó monto/transacción "not found" y remitente "Wells Fargo". Tardó 2m 4s (probable lentitud/reintentos del modelo gratis). |

Hallazgo extra: en correos de Chase sin memo, el regex tomaba el nombre del remitente como memo (texto "Memo NOMBRE is registered…").

## Cambios aplicados (versión `e76e3483`, publicada)

1. **`OpenRouter Chat Model`:** `openrouter/free` → `google/gemma-4-31b-it:free` (fijo, temperatura 0, `responseFormat: json_object`). Debe ser un modelo **gratis** porque la cuenta de OpenRouter no tiene créditos. Alternativas gratis con soporte JSON listadas en la API de OpenRouter al 2026-10-09: `google/gemma-4-26b-a4b-it:free`, `nvidia/nemotron-3-super-120b-a12b:free`.
2. **`Basic LLM Chain`:** `retryOnFail` (3 intentos, 2 s entre intentos) y `onError: continueRegularOutput` — si la IA falla, el flujo sigue con los datos del código.
3. **`Code in JavaScript1`:** nuevos patrones para Wells Fargo — remitente (`with Zelle NOMBRE sent you $`), monto (`sent you $X`), transacción (`Confirmation: …` alfanumérico); el memo se limpia en "We deposited…" y se descarta si es igual al nombre del remitente. Probado en local contra los dos correos reales (ambos extraen bien todos los campos). El workflow completo **no** se probó: el trigger de Outlook no se puede disparar por MCP.
4. **`If`:** ahora pasa si el código tiene `success: true` y (la IA no devolvió un monto numérico **o** coincide con el del código). Solo alerta cuando el código falla o cuando dos resultados válidos difieren.
5. **`Send a message` (alerta):** el texto incluye remitente, monto y número de transacción.

## Pendiente tras esta sesión

- Los dos pagos del 2026-10-09 (Chase $650.00 de PEDRO SANDOVALBECER; Wells Fargo $1,000.00 "Owner withdrawal") **no están** en Sheets ni en Mongo y sus correos siguen sin leer — cargarlos a mano o reprocesarlos.
- Verificar con la próxima ejecución real que registra bien y que Gemma gratis no da errores de límite de uso.
- Confirmar con Mario si los correos de Wells Fargo "Owner withdrawal" (envíos de la propia firma) deben registrarse en el tracking.
