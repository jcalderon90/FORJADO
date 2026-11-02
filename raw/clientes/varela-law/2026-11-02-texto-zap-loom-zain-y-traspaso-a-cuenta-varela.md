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

## Pendientes
- [ ] Confirmación de Zain de que su Zap ha sido desactivado.
- [ ] Encender (ON) el Zap definitivo en la cuenta de Zapier de Varela Law.
- [ ] Monitorear la primera ejecución real del nuevo Zap y la llegada del SMS en Texto.
