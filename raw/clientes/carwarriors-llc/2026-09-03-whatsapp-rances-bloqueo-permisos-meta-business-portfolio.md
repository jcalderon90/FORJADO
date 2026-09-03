---
tags: [forjado, cliente, carwarriors, whatsapp, ghl, meta, facebook, permisos, pendiente]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-03
---

# 2026-09-03 — WhatsApp Rances Car: bloqueo real identificado (permisos de Meta Business Portfolio, no cuenta equivocada)

**Contexto:** continuación de [[2026-09-02-whatsapp-rances-car-mensaje-enviado-bianca]] — Jorge (dueño) decidió avanzar sin esperar más la respuesta de Bianca sobre qué cuenta de Facebook usar: usar directamente el Facebook de Carwarriors LLC para conectar el WhatsApp de Rances Car. Se retomó el wizard de GHL (Settings → WhatsApp → Rances Car) en el paso "Connect with Facebook".

## Diagnóstico

Al completar el flujo de Embedded Signup de Meta (vía Playwright, sesión de Facebook ya logueada como **Jorge Calderón**), la pantalla "Selecciona los activos comerciales que quieras compartir con LeadConnector" solo ofrece 2 opciones en el dropdown "Porfolio empresarial": `creador_inquisitivo` y `Ryu Gaming Show` — ninguno relacionado con Carwarriors.

Se verificó en paralelo en Meta Business Suite (pestaña ya abierta por Jorge, con acceso confirmado) que esa misma cuenta (Jorge Calderón) **sí tiene acceso a la página de Facebook "Carwarriors LLC Miami"**, la cual pertenece al Business Portfolio **"Carwarriors Cuenta Publicitaria"**. Se confirmó que es la misma identidad en ambos lados (un solo usuario de Facebook logueado en el navegador, sin cuentas alternativas disponibles para cambiar).

**Causa raíz:** son dos niveles de permiso distintos en Meta. Jorge Calderón tiene acceso de **página** (suficiente para Business Suite), pero el wizard de WhatsApp de GHL exige ser **Admin del Business Portfolio completo** que contiene esa página — nivel que no tiene sobre "Carwarriors Cuenta Publicitaria". No se completó ni guardó nada en el wizard (se canceló el diálogo de Facebook sin seleccionar portfolio).

## Mensaje enviado a Bianca (2026-09-03)

Se le explicó el bloqueo (permiso de Admin de Business Portfolio, no cuenta equivocada) y se le dieron **2 opciones**: (1) agregar a Jorge Calderón como Admin del portfolio "Carwarriors Cuenta Publicitaria" para que FORJADO complete la conexión, o (2) que ellos mismos completen el wizard en GHL (Settings → WhatsApp → Rances Car → "Connect with Facebook") ya que cuentan con el nivel de admin necesario. Mensaje enviado en español neutral. **Esperando respuesta/acción de Bianca — no perseguir proactivamente.**

## Pendiente real

- [ ] **Bloqueante:** esperando que Bianca elija una de las 2 opciones y la ejecute (o confirme quién lo hace).
- [ ] Si eligen la Opción 1 (darnos permiso), una vez asignado el rol de Admin, retomar el wizard desde Settings → WhatsApp → Rances Car (se reinicia desde el paso 1 cada vez que se recarga, pero es rápido de re-transitar hasta "Connect with Facebook").
- [ ] Si eligen la Opción 2 (lo hacen ellos), confirmar con Bianca/Jorge González cuando esté hecho y verificar en GHL que la conexión quedó activa.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-02-whatsapp-rances-car-mensaje-enviado-bianca]]
- [[2026-09-02-whatsapp-rances-car-conexion-facebook-pendiente]]
