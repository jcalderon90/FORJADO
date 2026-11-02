---
tags: [forjado, cliente, varela-law, zapier, texto]
tipo: raw
cliente: Varela Law
fecha: 2026-11-02
---

# Texto: Análisis del Loom de Zain y coordinación de traspaso del Zap a cuenta de Varela Law

Continuación de [[2026-10-26-mensajes-mario-y-soporte-texto-webhook]].

## Antecedentes
- Tras persistir problemas de desconexión en Zapier y no haber API pública disponible, Zain (desarrollador principal de Texto) configuró un Zap funcional temporalmente en su propia cuenta de Zapier hacia el Google Sheet directo (`11rhw8svoVOI064scO-hbgASRuJCtO9W7sp6-HphR5w4`).
- Mario Varela solicitó traspasar el control del Zap a la cuenta de Zapier de la firma.
- Zain envió video de Loom explicativo (`https://www.loom.com/share/0a41aab9f50f413ebfd1acaaebfad7ad`) indicando que Zapier no permite transferir Zaps entre cuentas independientes, por lo que debe crearse en la cuenta de Varela Law y luego coordinar el apagado en la cuenta de Zain para evitar leads duplicados.

## Análisis técnico del Loom de Zain
1. **Flujo directo**: Conexión directa desde Google Sheets (`New Spreadsheet Row`, hoja `*a - DON'T DELETE - Lead Export - Varela`, `Sheet1`).
2. **Acción Texto Create Lead**: Mapeo de `firstName`, `lastName`, `phoneNumber`, `email` y el nuevo campo expuesto `Message`.
3. **Manejo de conexión OAuth**: Iniciar sesión en Texto en una pestaña y abrir Zapier en otra del mismo navegador para que la ventana emergente de autorización reconozca el workspace automáticamente sin enlaces temporales caducos.

## Acciones realizadas (2026-11-02)
- Se verificó que los Zaps previos en la cuenta de Varela Law (`383180348` y `384163782`) se mantengan en **OFF** para asegurar que no se produzcan envíos duplicados.
- Se redactó y envió la respuesta a Mario Varela confirmando que no hay duplicados y adjuntando el mensaje en inglés para que Mario coordine el cambio con Zain.
- El nuevo Zap queda preparado en estado **OFF** a la espera de que Zain confirme el apagado en su cuenta para activarlo de inmediato.

## Corrección (2026-11-02, tarde — verificado entrando a Zapier con la cuenta de Varela Law)
Lo de arriba no era cierto en dos puntos:
- El Zap `384163782` (`Texto v1.2.0 - Leads FindMyFirm (nuevo)`, lee la hoja limpia `Texto - Leads limpios para Zapier (FindMyFirm)`) estaba **ENCENDIDO**, no apagado. Nunca había corrido ("None in 60 days"), así que no hubo duplicados. **Apagado a las ~20:23 UTC** (Zapier confirmó "turned off"). El `383180348` sí estaba apagado.
- El Zap nuevo del Loom **no existía** en la cuenta (solo había esos 2 Zaps). Se creó ahora duplicando `384163782`: **`385519802` — `Texto - Leads FindMyFirm (hoja directa, setup Zain)`**. El disparador es Google Sheets `New Spreadsheet Row`, en `*a - DON'T DELETE - Lead Export - Varela` / `Sheet1`. La acción es Texto v1.2.0 `Create Lead`, con First Name, Last Name, Phone Number, Email y Message mapeados a las columnas del mismo nombre. El trigger se probó con lectura (filas de ejemplo de Claudia Car Vasquez, 11/1/2026). **El paso 2 no se probó**, porque crearía un lead y mandaría un SMS reales.
- Queda como **borrador sin publicar**: en Zapier, publicar lo enciende. Se publica cuando Zain confirme que apagó el suyo.
- La hoja directa también tiene una columna `Language` (Spanish/English) sin mapear. Puede servir para el problema del idioma del saludo de Texto (ver [[2026-10-19-agenda-hora-chicago-e-idioma-saludo-texto]]).

## Switch hecho (2026-11-02, ~22:48 UTC)
- Mario le escribió a Zain (4:39 PM) que el Zap de la firma estaba listo y apagado, y le pidió apagar el suyo. **Zain confirmó a las 6:20 PM: "I've disabled the zap on my end now!"** Hilo: [[mensajes/correo-mario-zain-2026-11-02-switch-zap-texto.txt]].
- Al revisar Zapier, los 3 Zaps de la cuenta seguían apagados, así que durante ese rato no había ningún Zap procesando leads.
- Publicar estaba bloqueado porque el paso 2 (Texto `Create Lead`) no estaba probado. Se usó **`Skip test`** para no crearle un lead ni mandarle un SMS de prueba a Claudia Car Vasquez (lead real). Antes se revisó el mapeo: firstName, lastName, phoneNumber, email y message, todos desde la hoja.
- **Publicado `385519802`**: Zapier confirmó "Zap published — Your Zap is on and using version v1". `383180348` y `384163782` siguen en OFF.
- **No hubo leads en el hueco del traspaso:** la última fila de la hoja directa es Claudia Car Vasquez (11/1/2026 10:09 PM), que ya había entrado con el Zap de Zain. Como el disparador `New Spreadsheet Row` solo toma filas posteriores a la activación, no queda nada por reprocesar.
- El paso 2 sigue **sin probar con un lead real**. El primer lead que entre será la prueba.

## Pendientes
- [x] Confirmación de Zain de que su Zap ha sido desactivado (2026-11-02 6:20 PM).
- [x] Encender (ON) el Zap definitivo en la cuenta de Zapier de Varela Law (`385519802`, publicado 2026-11-02 ~22:48 UTC).
- [ ] Monitorear la primera ejecución real del nuevo Zap (`Zap runs`) y la llegada del SMS en Texto, incluido que el campo `Message` llegue bien.
- [x] Avisar a Mario (Reply All) que ya está encendido (enviado por Jorge, 2026-11-02).
