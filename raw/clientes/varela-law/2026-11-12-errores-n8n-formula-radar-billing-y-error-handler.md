---
tags: [forjado, cliente, varela-law, n8n, radar-billing, zelle, error-handler, google-sheets]
tipo: raw
cliente: Varela Law
fecha: 2026-11-12
---

# Revisión de errores n8n: fórmula rota en 07-05-26, ráfaga de 504 de Zelle y filtro en ERROR HANDLER

Disparador: llegó a Jorge el correo "ERROR!!! en n8n" de `TRACKING INCOMING ZELLE PAYMENTS - OUTLOOK` (`BruqJ1jdEV9xl5zG`) con `504 Gateway timed out` de Microsoft Graph (2026-11-12 17:55 UTC). Se revisaron todos los flujos de la instancia.

## Qué se encontró (revisión de los últimos 30 días)

- Ejecuciones `error`/`crashed`: solo **una** visible, `3180` de `Radar Billing - Write Production (07-05-26)`.
- El `ERROR HANDLER` (`mwmapzwppW-NTV4NwOhSq`) se disparó 29 veces; leyendo su `Error Trigger` salen dos problemas distintos. El resto de flujos, sin errores.

### 1. Radar Billing - Write Production (`5wpx12QtdLtyRT0Z`) — 2 noches sin escribir

- Falló en la corrida de las 04:00 UTC del **11-11 (`3180`) y del 11-12 (`3193`)** en el nodo `Update 07-05-26 (F/H/J only)`: `Could not find column for key "Client Name"`. Del 10-30 al 11-10 todas las corridas `success`.
- La ejecución `3193` **ya no existe** en n8n (la alerta sí llegó); alguien o algo la borró. El flujo figura con `updatedAt` 2026-11-12 14:27 UTC pero sin versión nueva en el historial (la última es `5a88e20b`, 2026-08-12).
- **Causa (verificada leyendo la hoja):** `07-05-26!A1` tenía `={QUERY('CIVIL CASES'!A:I, "SELECT A, B, G, I, J", 1)}` y devolvía `#VALUE!`. El rango termina en I pero la consulta pide J. En julio la fórmula era `'CIVIL CASES'!A:J` (ver [[../../../wiki/clientes/varela-law-radar-billing|Radar Billing]], layout confirmado 2026-07-23): **alguien borró una columna de CIVIL CASES** entre A y J. Google ajustó el rango solo (`A:J → A:I`), pero no las letras del texto de la consulta.
  - Comparando con `CLOSED CASES/OWE MONEY` (A Client Name, B Case Type, C Case Status, **D Balance**, E Party, F Opposing Party, G Retained, H DCO, I Age, J Handling…), la columna borrada estaba en la posición D. Por eso, en la estructura vieja, `A,B,G,I,J` = Client Name, Case Type, Retained, Age, Resp.
  - Además, **`CIVIL CASES!A1` está vacío** (antes decía "Client Name").
  - Estructura actual de CIVIL CASES: A (nombres, encabezado vacío), B Case Type, C Case Status, D Party, E Opposing Party, F Retained, G DCO, H Age, I Paralegal, J Case No., K Notes…
  - Las copias del reporte (`Copy of 07-05-26`, `08-01-26`, `09-01-26`, `Copy of 10-01-26`, `Copy of 11-01-26`) confirman que A–E deben ser **Client Name, Case Type, Retained, Age, Resp**.
- **Corrección del diagnóstico de agosto:** el 2026-08-12 se atribuyó el mismo error a una falla transitoria de Google Sheets y se agregó `retryOnFail` (3 intentos). Con el retry activo volvió a fallar dos noches seguidas, así que esa explicación no se sostiene: lo más probable es que en agosto también se tocara la estructura de la hoja.

**Arreglo aplicado (autorizado por Jorge):** se escribió solo la celda `07-05-26!A1`:

```
={QUERY('CIVIL CASES'!A:I, "SELECT A, B, F, H, I LABEL A 'Client Name', I 'Resp'", 1)}
```

- El `LABEL` deja fijo "Client Name" (y "Resp") aunque alguien vuelva a vaciar o renombrar el encabezado en CIVIL CASES.
- **No se tocó CIVIL CASES.** Si vuelven a borrar o mover columnas ahí, la fórmula se puede romper otra vez.
- **Verificado** releyendo la pestaña (ejecución `3270` de `PEd9fBOxd05T94WO`): encabezados Client Name/Case Type/Retained/Age/Resp, nombres de vuelta (Abarca Freddy, Alipio David, Alvarado Irma, Batres Byron…).
- Cómo se escribió: flujo temporal `TMP - Read CIVIL CASES headers (inspection)` (`j5eDN9bMWjeMLboZ`, HTTP Request con la credencial `Google Sheets account`, API `values:batchGet` y `values.update` con `USER_ENTERED`). **Archivado** al terminar, porque había quedado con la escritura configurada.
- Se ejecutaron también, solo lectura, `Radar Billing - Read 07-05-26 (Values, Inspection)` (`PEd9fBOxd05T94WO`, `3256`, `3270`) y `Radar Billing - Read 07-05-26 (Inspection)` (`uaI9ESCgYiB6VGFd`, `3257`).

**Problema aparte, previo a hoy (sin corregir):** en 07-05-26 solo A–E se recalculan con la fórmula. De F en adelante (montos, G/I/N manuales, notas de seguimiento) son valores fijos por fila. Al agregarse clientes a CIVIL CASES los nombres se corren y esos datos quedan en la fila de otro cliente. Evidencia:
- Abarca, Freddy (fila 2) muestra 5,863.30 cobrados, que en `Copy of 07-05-26` eran de Alvarado, Irma.
- Alipio, David (contratado 9/18/26) tiene notas de julio ("7/6/26 Uninvoiced invoices emailed…").

La corrida nocturna reescribe F/H/J buscando por nombre, así que esas tres quedan bien. **G, I, N, K–M y las notas probablemente están desalineadas.**

### 2. Zelle por Outlook — fallos de Microsoft Graph repetidos

- **23 alertas entre 17:23 y 17:59 UTC del 11-12** (502/504, casi una por minuto; se abrieron 3 y eran todas del trigger de Zelle, el ritmo coincide con su sondeo de cada minuto).
- Antes: 502 el 10-29, `ETIMEDOUT 20.190.139.173` (login de Microsoft) el 11-07, 503 el 11-09, `EAI_AGAIN graph.microsoft.com` (DNS) el 11-10. Los 502/503/504 son de Microsoft; el timeout y el DNS apuntan a la red del VPS de Hostinger.
- El flujo sigue activo; última ejecución con correo procesado: `3203` (11-12 16:45 UTC, `success`). En principio no se pierden pagos: el trigger toma los correos **no leídos** y el flujo solo los marca leídos al final.
- `retryOnFail` del nodo trigger no aplica a los sondeos (polling), por eso no ayudó.

### 3. ERROR HANDLER — filtro de fallos temporales (publicado)

- Nodo nuevo **`Filtrar fallos temporales`** (Code) entre `Error Trigger` y `HTML`:
  - Errores de ejecución: avisan siempre, al instante.
  - Errores de trigger no temporales (credencial, permisos): avisan siempre.
  - Errores de trigger temporales (`502|503|504|429`, bad gateway, gateway timed out, service unavailable, timed out, `ETIMEDOUT`, `ECONNRESET`, `ECONNREFUSED`, `EAI_AGAIN`, `ENOTFOUND`, socket hang up, DNS server): avisa **al 5º seguido del mismo flujo**, un correo por incidente con la nota "Van N fallos temporales seguidos… desde las HH:MM (hora de Chicago)", y recordatorio cada 60 min si sigue. Un incidente se cierra tras 10 min sin fallos. Estado en `$getWorkflowStaticData('global')`, se limpia a las 24 h.
  - Si el filtro mismo falla (`catch`), deja pasar todo.
- `HTML` muestra `incidentNote` cuando viene.
- Probado con `test_workflow` (`3275`, pin data con 8 errores: 1 de ejecución, 1 de credencial y 6 temporales): pasaron exactamente 3 (ejecución, credencial y el 5º temporal). Publicado: versión activa **`50731237`**.
- **No probado:** que el contador persista entre ejecuciones reales del ERROR HANDLER (en pruebas manuales la static data no se guarda). Se confirma con la próxima caída de Microsoft: debe llegar un solo correo con "Van 5 fallos temporales seguidos…".
- Con lo del 11-12 habría llegado 1 correo en vez de 23. Los fallos aislados (10-29, 11-07, 11-09, 11-10) ya no mandarían correo; quedan registrados en las ejecuciones del ERROR HANDLER.

### 4. Seguimiento el mismo día: filtro confirmado en producción y diagnóstico de Microsoft Graph (18:08–18:19 UTC)

- **El filtro funciona con fallos reales.** La caída de Microsoft siguió después de publicarlo. Desde las 18:08 UTC hubo 10 disparos del ERROR HANDLER y **un solo correo**: el del 5º fallo, a las 18:12:58 UTC (ejecución `3285`), con la nota "Van 5 fallos temporales seguidos del disparador desde las 12:08 (hora de Chicago)". Los demás disparos (`3277`–`3296`) terminaron en `Filtrar fallos temporales` sin datos de salida. Queda **confirmado que el contador persiste entre ejecuciones reales**. Si la caída sigue, el próximo recordatorio debería llegar ~19:12 UTC.
- **Diagnóstico (flujo temporal `TMP - Diagnostico Graph Zelle`, `NTLrAfYuwXN1skFD`, ejecución `3294`, solo lectura, credencial `automations@varela.law`).** Hizo tres llamadas a `GET /v1.0/me/messages`:
  - A, sin filtro: **504** a los 30 s.
  - B, `isRead eq false and from/emailAddress/address eq 'mvarela@varela.law'`: **502** a los 25 s.
  - C, el filtro exacto del trigger con `contains(subject, …)`: **504** a los 30 s.
- **Conclusión:** falla hasta la consulta más simple, así que el problema **no es el filtro `contains` del trigger** ni la credencial (el token se obtiene bien). Es Microsoft Graph o Exchange Online, que no sirve el buzón `automations@varela.law`. No hay nada que corregir en n8n. El flujo temporal quedó **archivado**.
- No se pudo distinguir entre una caída general de Exchange Online y una falla solo de ese buzón. Es el único flujo activo con Outlook (`TRACKING INCOMING WEB PAYMENTS - OUTLOOK` está inactivo). Request-ids para un eventual ticket con Microsoft: `d9690bbe-5f90-4e4e-8865-7c1d9c82772d`, `32b35c39-7382-456b-926e-32326776bb44`.
- Mientras dure, los Zelle se quedan sin leer en el buzón. La última ejecución con correo es `3203` (16:45 UTC).

## Pendientes

- [ ] **Caída de Graph (11-12, en curso desde 17:23 UTC):** (a) que alguien de Varela con acceso de administrador revise Service health → Exchange Online en admin.microsoft.com y si el buzón `automations@varela.law` abre en Outlook web; si abre y no hay incidente, abrir ticket con Microsoft con los request-ids de arriba; (b) cuando se recupere, confirmar que el flujo de Zelle procesó los correos acumulados (deben aparecer ejecuciones `success` nuevas y filas en la hoja y en Mongo).
- [ ] **2026-11-13:** confirmar que `Radar Billing - Write Production` (04:00 UTC) corrió `success` con la fórmula nueva.
- [ ] Avisar a Varela (Mario) del desalineamiento de 07-05-26 (G, I, N, K–M y notas en la fila de otro cliente) antes de que se usen para cobrar. Decidir el arreglo de fondo: por ejemplo, que esas columnas también se busquen por nombre en vez de ser valores fijos por fila.
- [ ] Pedirle a Varela que no borre ni mueva columnas de CIVIL CASES sin avisar, o que la fórmula se revise cuando lo hagan (en agosto pasó lo mismo, probablemente).
- [ ] Revisar en `automations@varela.law` si quedó algún correo de Zelle sin leer de 17:23–17:59 UTC del 11-12.
- [x] ~~Confirmar con la próxima caída de Microsoft que el filtro del ERROR HANDLER manda un solo correo.~~ Confirmado el mismo 11-12: llegó 1 correo con 10 fallos (sección 4).
