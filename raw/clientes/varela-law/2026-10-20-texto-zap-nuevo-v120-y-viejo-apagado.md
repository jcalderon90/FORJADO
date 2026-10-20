---
tags: [forjado, cliente, varela-law, zapier, texto]
tipo: raw
cliente: Varela Law
fecha: 2026-10-20
---

# Texto: Mario reporta otra desconexión; Zap nuevo con la v1.2.0 publicado y el viejo apagado

Continuación de [[2026-10-16-verificacion-y-cierre-del-dia]] y [[2026-10-14-agenda-5-dias-y-zapier-reconectado]].

## Qué pasó

- Mario mandó a Jorge una captura de Zapier "Reconnect to Zapier" (conexión `Mario Varela - Mario Varela Law Firm`, v1.2.0) con: "Otra vez se desconectó. ¿Ya hiciste lo que recomendó Zain de Texto? Create a fresh Zap so you're on the latest Texto app version – older Zaps don't always pick up updates automatically." **Es la primera vez que aparece la recomendación de Zain (soporte de Texto) en la bóveda.** La captura marca 12:24 PM sin zona horaria.
- `list_zapier_connections` (Texto, `App229472CLIAPI`) a ~16:55 UTC: conexión `02bce20a-b517-831f-9463-70e35f39d36c`, `is_expired: false`, `lastchanged` 2026-10-20 16:25:44 UTC (11:25 AM CT / 12:25 PM Miami), `app_version` 1.2.0. **No se pudo determinar quién reconectó ni si fue antes o después del mensaje de Mario** (la zona horaria de la captura no consta).
- El Zap `383180348` (`Texto - Leads FindMyFirm (hoja limpia a Create Lead)`) estaba **encendido** (v1 publicada por Mario hace 6 días, con un borrador encima), como ya decía la nota del 10-16. Pasos: (1) Google Sheets `New Spreadsheet Row`, hoja `Texto - Leads limpios para Zapier (FindMyFirm)` / `Sheet1`, cuenta `varelalawremote@gmail.com`; (2) **Texto (1.1.2)** `Create Lead` con `firstName`, `lastName`, `phoneNumber` y `email` tomados de las columnas del mismo nombre. Es decir, el paso de Texto seguía fijado en la v1.1.2 aunque la conexión ya es la 1.2.0 (lo que describe Zain).

## Qué se hizo (con autorización de Jorge)

- Con la sesión de Zapier de Mario en el navegador automatizado (Jorge inició sesión), se creó **desde cero** el Zap `384163782` (no duplicado, para que el paso de Texto tome la versión actual): mismo trigger y mismo mapeo de 4 campos que el viejo; el paso de Texto aparece sin número de versión (la más reciente).
- La acción `Create Lead` de la **v1.2.0 tiene un campo nuevo, `Message`** (opcional), que la v1.1.2 no tenía. **Se dejó vacío**: cambiaría lo que Texto envía al lead. Podría servir para el saludo en el idioma del lead (ver [[2026-10-19-agenda-hora-chicago-e-idioma-saludo-texto]]); decisión de Mario.
- **Publicado y encendido sin probar el paso 2** (`Skip test`; "Zap published… using version v1", 2026-10-20 ~17:36 UTC): el `Test step` habría creado un lead real con los datos de muestra (Ivan Vargas, `+17138653500`, fila 4, 10-17). No se envió ningún SMS.
- Renombrado a `Texto v1.2.0 - Leads FindMyFirm (nuevo)`.
- **Zap viejo `383180348` apagado** (queda con su v1 publicada y su borrador, sin tocar) para no mandar el SMS dos veces al mismo lead. Se reenciende con el interruptor del editor.
- Decisión de Jorge: "dejar lo nuevo que hicimos a ver si funciona".

## Riesgos / qué vigilar

- El primer lead real que entre a la hoja limpia es la primera ejecución del Zap nuevo: revisar en `Zap runs` del `384163782` que salió bien y en Texto que el lead tiene su SMS.
- Ambos Zaps usan **la misma conexión**: si Texto se vuelve a desconectar, el Zap nuevo también falla sin avisar. Soporte de Texto aún no responde sobre la caducidad ([[mensajes/consulta-soporte-texto-2026-10-13]]); alternativa: enviar los leads a Texto por webhook/API desde n8n.
- Si el nuevo falla, reencender el viejo no arregla la causa (misma conexión), solo vuelve al comportamiento anterior.
- Mensaje a Mario redactado por Claude (hecho, nuevo Zap activo, viejo apagado, sin SMS de prueba, avisar si se desconecta otra vez). **No consta que Jorge lo haya enviado.**

## Alternativa sin Zapier: ¿Texto tiene webhook/API? (misma sesión, solo investigación)

Jorge propuso ofrecer a Mario otra infraestructura "porque la combinación de estos servicios está dando problemas". Claude recomendó primero mandar los leads a Texto directo desde n8n y **omitió que ya estaba descartado**: el 10-09 el soporte de Texto le dijo a Mario que no se puede crear prospectos por API ni webhook ([[2026-10-09-texto-leads-pivote-a-zapier]]). Jorge lo recordó ("creo que Mario investigó que no se podía") y se revisó.

- **Lo que falla** es solo el tramo Zapier ↔ Texto (conexión que caduca a las ~19-20 h); n8n, la hoja, Gmail y Slack no dan problemas. Cambiar todo el stack no arregla eso.
- **Contradicción sin resolver** (la de la nota del 10-09): `trytexto.com` y `/features/integrations` (leídas 2026-10-20) dicen que se pueden subir leads "via Webhook or CSV" desde Meta Ads, Google Ads y GoHighLevel, y el FAQ: "Any source that sends data via webhook or Zapier!". **No hay documentación**: ni URL del endpoint, ni token, ni formato, ni API key. La búsqueda web no encontró nada más.
- Posibles lecturas: el soporte se equivocó, el webhook es solo para fuentes específicas, o depende del plan.
- **Cómo salir de la duda:** (1) que Mario/Jorge miren el panel de Texto (Integraciones / fuentes de leads) por una URL y token de webhook; (2) pregunta precisa a soporte: URL, token, JSON y si aplica al plan de Mario (la consulta del 10-13 la mezcla con la de la caducidad y sigue sin respuesta); (3) si no hay webhook: seguir con Zapier + una alerta en n8n que avise si el Zap falla, o evaluar otro servicio de SMS/agente de IA (el más costoso: Mario ya tiene el agente montado en Texto).
- Sin cambios en n8n, Zapier ni Texto; sin mensajes enviados a Mario ni a soporte. Jorge no ha decidido aún qué proponer.

## Pendientes

- [ ] Decidir con Jorge qué se le propone a Mario sobre el tramo Zapier ↔ Texto; redactar (si se quiere) el mensaje a soporte de Texto enfocado solo en el webhook y el recado a Mario para que revise el panel.
- [ ] Que Mario sepa que el Zap viejo está apagado y el nuevo activo; que avise si Texto se desconecta.
- [ ] Primer lead real: confirmar ejecución en `Zap runs` del `384163782`, fila en la hoja limpia, SMS y conversación en Texto.
- [ ] Mario: decidir si se usa el campo `Message` / saludo bilingüe.
- [ ] Respuesta de soporte de Texto sobre la caducidad; si se repite, evaluar webhook/API desde n8n.
- [ ] Plan de Zapier antes de ~10-22 (pendiente ya abierto en el estado).
