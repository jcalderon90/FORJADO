---
tags: [forjado, cliente, varela-law, zapier, texto, findmyfirm, google-sheets, leads]
tipo: raw
cliente: Varela Law
fecha: 2026-10-09
---

# Texto + FindMyFirm — Texto no tiene webhook/API de leads: pivote a Zapier

Continuación de [[2026-10-07-texto-leads-findmyfirm-parte1-n8n]].

## Qué pasó

- **Mario Varela (2026-10-09, 8:30 AM):** soporte de Texto le dijo que **hoy no es posible crear prospectos por API ni webhook**; la única integración para esto es Zapier. Pidió continuar con **Google Sheets → Zapier → Texto**: trigger `New Spreadsheet Row`, acción `Create Lead` de Texto. Preguntó cómo crear la cuenta de pago de Zapier.
- **Decisión de Jorge:** no pagar nada hasta que sea necesario. Pidió a Mario crear una cuenta de Zapier **gratuita** y agregar a `varelaLawremote@gmail.com` como colaborador. **Esperando a que Mario decida/cree la cuenta.**
- El workflow n8n `Texto - Leads FindMyFirm (Parte 1)` (`zyPZ9H05SA4a3V9s`) **sigue sin publicar**; no se envía nada a Texto.

## Investigación (web, 2026-10-09)

- **Texto en Zapier existe** (`zapier.com/apps/texto`), conexión por OAuth, marcada **Beta** en una fuente. Un trigger (`New Incoming Lead`) y una acción (`Create Lead`): `phoneNumber` obligatorio; `firstName`, `lastName`, `email` opcionales. Coincide con los 4 campos que ya extrae el n8n. La página de Zapier no enlaza a trytexto.com ni dice si requiere plan de pago, y existe otra app "Texto (SMS)" — confirmar al conectar que es la correcta.
- **Contradicción abierta:** `trytexto.com` anuncia "Webhooks" como forma de que las fuentes de leads envíen datos a Texto (además de Zapier y CSV). No hay docs públicas ni API. Puede ser que el soporte se equivocara o que el webhook sea solo para fuentes específicas (Meta, GoHighLevel). Si existiera webhook genérico, n8n lo usaría directo y no haría falta Zapier.
- **n8n no puede reemplazar a Zapier** para este paso: la acción `Create Lead` es una app de Zapier, no un endpoint HTTP.
- **Plan gratis de Zapier** (datos de terceros, **no verificados** en zapier.com/pricing): revisión cada 15 min, ~100 tareas/mes, Zaps de pocos pasos (un Filter para descartar leads inválidos podría no caber). Intervalos de planes pagos: fuentes no coinciden (Professional 2–5 min, Team 1–2 min).

## Opciones evaluadas

1. **Zapier puro** (lo que pidió Mario): Sheets `New Spreadsheet Row` → Filter (teléfono válido, descartar `true`/filas de prueba) → Texto `Create Lead`. Retraso = intervalo del plan.
2. **n8n detecta y filtra + Catch Hook de Zapier → Texto:** instantáneo (n8n revisa cada minuto), requiere plan de pago de Zapier (Webhooks). Solo proponerlo si el retraso de la opción 1 molesta.
3. Preguntar a Texto por webhook real / otras vías (Make, correo, formulario). Mensaje para soporte redactado en la conversación, **no enviado**.
4. Automatizar el panel web de Texto: descartada (frágil, probablemente viola términos).

## Pendiente

- [ ] Mario: crear cuenta Zapier (gratis) y dar acceso. Si no permite colaboradores en plan gratis, alternativa: crearla con `varelaLawremote@gmail.com`.
- [ ] Celular de prueba de Mario (aún no lo da). **No activar el Zap** hasta tenerlo.
- [ ] Armar el Zap sin activarlo; verificar en pantalla si el plan gratis guarda Texto (Beta) + Filter, y normalizar teléfono (`+1...`) según lo que pida Texto.
- [ ] Decidir si se envían los leads que ya están en el Sheet (hoy solo se enviarían los nuevos).
- [ ] Opcional: enviar consulta a soporte de Texto sobre el webhook anunciado en su sitio.
- [ ] Si Zapier funciona, archivar el workflow n8n de la parte 1 (o reutilizarlo como detector para la opción 2).
