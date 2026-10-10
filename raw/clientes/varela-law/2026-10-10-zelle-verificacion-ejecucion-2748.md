---
tags: [forjado, cliente, varela-law, n8n, zelle, verificacion]
tipo: raw
cliente: Varela Law
fecha: 2026-10-10
---

# Tracking Zelle — verificación del fix con una ejecución real (2026-10-10)

Continuación de [[2026-10-09-fix-zelle-ia-gratis-regex-wells-fargo-y-logica-if]]. Solo lectura de ejecuciones; no se cambió nada.

## Hallazgos

- Desde el fix hubo **una sola ejecución real**: **#2748** (2026-10-09 18:18 UTC, `success`, modo trigger). Fue un pago **Chase de $400.00** (transacción distinta de los dos pendientes). Recorrió la rama correcta: `If` → `Edit Fields` → `DATA FIELDS` → `Insert documents` (Mongo) → `Append row in sheet` → `Update a message` (marcado como leído). **El fix funciona en el camino normal con un correo de Chase.**
- **Wells Fargo sigue sin probarse** con un correo real.
- En #2748 el nodo `OpenRouter Chat Model` falló una vez con `OpenAI: Rate limit reached` (error del proveedor del modelo gratis) y se ejecutó 3 veces; el `Basic LLM Chain` terminó bien en ~5.8 s gracias a los reintentos. Confirma que el modelo gratis (`google/gemma-4-31b-it:free`) **sí topa límites de uso**, y que `retryOnFail` los absorbe por ahora. Vigilar si empeora (alternativas gratis ya anotadas en la nota del 10-09).
- No hay ejecuciones con `error` ni `crashed` en ningún workflow desde 2026-10-08.
- **No verificado:** si los dos pagos del 10-09 (Chase $650.00 y Wells Fargo $1,000.00 "Owner withdrawal") ya se cargaron a mano en Sheets/Mongo. No se pudo comprobar: la búsqueda de un spreadsheet llamado `Incoming Mail Payments` con la cuenta `varelalawremote@gmail.com` no devolvió resultados (puede tener otro título, estar en otra cuenta o ser una pestaña), y no hay acceso a Outlook ni a Mongo desde esta sesión.

## Pendiente

- [ ] Confirmar si los dos pagos del 10-09 siguen sin registrar (correos sin leer en Outlook; filas en `Oct`/Mongo `zelle_payments`) y cargarlos o reprocesarlos.
- [ ] Confirmar con Mario si los "Owner withdrawal" de Wells Fargo deben registrarse.
- [ ] Probar el parser de Wells Fargo con el próximo correo real.

## Verificación en el Sheet (2026-10-10, solo lectura)

- Spreadsheet `Incoming Zelle Payments` (id `1j_2va73Riv9_gmkVbDAKkGq9u661ZldS9BaaAkTNHYQ`; el título real es ese, no "Incoming Mail Payments"), accesible con la conexión de Zapier `varelalawremote@gmail.com`. Pestañas `2025`, `Jan`…`Dec`, `Pruebas`. Columnas de `Oct`: Sender Name, Amount, Sent Date, Transaction No., Memo, ID (ID = `_id` de Mongo).
- Pestaña `Oct`: 12 pagos, del 1 al 9 de octubre. Está el Chase de $400.00 de la ejecución #2748 (transacción `31152895297`), sin duplicar.
- **Faltan los dos pagos pendientes:** no aparecen ni la transacción Chase `31145442877` ($650.00) ni la confirmación Wells Fargo `JPM99cz8odsb` ($1,000.00 "Owner withdrawal"). **Siguen sin registrar en Sheets** (Mongo no se pudo revisar).
- Ojo: cargarlos solo en el Sheet los dejaría sin registro en Mongo (`zelle_payments`), y la columna ID del Sheet es el `_id` de Mongo. Lo más consistente es reprocesar los correos por el workflow (p. ej. ejecutar desde el editor de n8n con el correo como evento de prueba del trigger de Outlook), o insertar en ambos sitios.

## Decisión (2026-10-10)

- Jorge confirmó que los correos de Wells Fargo "Owner withdrawal" (envíos de la propia firma) **sí deben registrarse** en el tracking. Cierra la duda abierta desde 2026-10-09: el parser de Wells Fargo ya los procesa y no hace falta excluirlos. No se indicó quién lo decidió en el negocio (Jorge o Mario).
- Sigue pendiente reprocesar los dos pagos del 2026-10-09 (Chase $650.00 y Wells Fargo $1,000.00) y probar el parser de Wells Fargo con un correo real.
