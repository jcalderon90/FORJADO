---
tags: [forjado, cliente, carwarriors, whatsapp, ghl, automation]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — Verificado el gap de WhatsApp en Rances Car; trigger agregado preventivamente

**Contexto:** pendiente que había quedado abierto desde el 09-01 (ver [[2026-09-01-whatsapp-activado-fix-trigger-lead-agent]]): confirmar si Rances Car tenía el mismo problema que Carwarriors LLC (automation "Lead Agent - n8n" sin trigger de WhatsApp).

## Hallazgo 1 — Rances Car NO tiene WhatsApp Messaging contratado

Verificado en el Launchpad de Rances Car (`1j1dHo8HEbZdElQUGFoC`): la tarjeta "Integrate WhatsApp" muestra botón **"Connect"** (no "Connected"), a diferencia de Carwarriors LLC. Es decir, a día de hoy no hay ningún número de WhatsApp conectado en esta subcuenta — no es una desconexión, nunca se contrató.

## Hallazgo 2 — El automation "Lead Agent - n8n" tenía el mismo gap

Aun sin WhatsApp activo, se revisó igual el automation equivalente (`Lead Agent - n8n`, dentro de la misma carpeta "Agente AI", Published, 176 inscritos) por la regla de "todo cambio a los 2 agentes". Tenía **exactamente el mismo problema que Carwarriors LLC tenía antes del fix del 09-01**: solo 2 triggers "Customer replied" (Reply channel = "Facebook messenger" e "Instagram DM"), sin ninguno para WhatsApp.

También se confirmó que Rances Car tiene su propio automation legado "Whatsapp" (Published, **13680 inscritos** — número aún mayor que el de Carwarriors LLC, 8520) sin explorar, mismo patrón sospechoso de integración vieja tipo broadcast. Sigue sin abrirse (ver pendiente).

## Fix aplicado (preventivo)

Se agregó un tercer trigger "Customer replied → Reply channel is WhatsApp" al automation `Lead Agent - n8n` de Rances Car, con la misma estructura que los otros dos, alimentando al mismo nodo `#1 N8N Webhook - Lead Agent`. Guardado con "Save" (el workflow ya estaba Published, quedó live de inmediato). Verificado navegando fuera y volviendo a entrar: los 3 triggers persisten.

**Por qué hacerlo ahora si WhatsApp no está conectado todavía:** para que el día que Rances Car contrate WhatsApp Messaging (como ya hizo Carwarriors LLC), el bot ya esté listo para recibir esos mensajes sin repetir el mismo hallazgo de nuevo — el trigger no tiene ningún efecto mientras no exista tráfico real de WhatsApp, así que agregarlo ahora no tiene riesgo.

## Nota de navegación (refuerzo del procedimiento ya documentado)

Confirmado de nuevo el patrón: `goto()` directo a cualquier ruta `/v2/location/{id}/...` devuelve 404, incluso a una URL donde ya se había aterrizado antes en la misma sesión — el SPA exige entrar siempre por click interno (Sub-Accounts → Switch to Sub-Account). Dentro del builder de un workflow, el panel de "Add filters"/valores de un filtro no siempre responde a un click por rol/ref normal (varios intentos con `browser_click` no abrieron el desplegable) — funcionó de forma confiable usando `browser_run_code_unsafe` con `frame.getByText(texto, { exact: true }).click()` apuntando al iframe `workflow-builder` por nombre.

## Pendiente

- Rances Car sigue sin WhatsApp Messaging contratado — no es accionable hasta que Jorge/Jorge González decidan comprarlo (mismo $10/mes que ya paga Carwarriors LLC).
- Automations legacy sin explorar en ambos dealers (`Whatsapp`, `Whatsapp-Domingos`, `Whatsapp-Normal`, `Resolver Token WhatsApp – AutosMiami` en Carwarriors LLC; `Whatsapp` en Rances Car) — no se sabe si son ruido muerto o interfieren.
