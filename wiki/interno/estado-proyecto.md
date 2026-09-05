---
tags: [forjado, estado, pendientes, dashboard]
tipo: estado
estado: activo
actualizado: 2026-09-05
fuente_raw: raw/interno/estado-proyecto-source-2026-08-25.md
---

# Estado del Proyecto — FORJADO

> [!info] Cómo leer esta página
> Página **compilada**: solo el snapshot actual y los pendientes abiertos de la agencia. El historial diario completo (una entrada por fecha, con el detalle técnico de cada sesión) vive en [[../../raw/interno/estado-proyecto-source-2026-08-25|raw/interno/]] y en las páginas raw de cada cliente. Los detalles vivos de cada cliente están en sus páginas compiladas: [[../clientes/carwarriors-llc]] y [[../clientes/varela-law]].

## Resumen por cliente

| Cliente | Estado | Última actividad |
|---|---|---|
| **Carwarriors LLC** | **🟢 09-05: chequeo de salud OK — bots atendiendo bien, sync GHL↔DealerCenter sano, y confirmado con un caso real que el fix de timeout de OpenRouter del 09-03 funciona** (lead real quedó atendido en 2m28s en vez de colgarse 10 min). **🟡 09-05: aviso de seguridad enviado, esperando decisión del cliente sobre Yoan.** PIT tokens de GHL que estaban filtrados en repo público de terceros (`gyoan-byte/carwarriors-kb`) ya rotados (09-04); identidad del autor del repo confirmada (Yoan, especialista GHL con email `gyoan@carwarriorsllc.com` que construyó los bots legacy en marzo 2026 — no un desconocido). **09-05: mensaje enviado a Bianca/Jorge González** en lenguaje no técnico explicando el hallazgo (sin riesgo activo hoy) y dándoles a elegir entre pedirle ellos a Yoan que borre el archivo viejo o que FORJADO lo contacte — se decidió **no** contactar a Yoan proactivamente todavía, esperando que ellos elijan primero. **09-05: comentarios IG/FB (ManyChat→n8n) auditados — n8n confirmado 100% sano (prueba sintética directa al webhook, 200 OK), pero siguen 5 días sin ningún comentario real desde la publicación del 08-31.** No se pudo auditar el lado de ManyChat por falta de sesión/credenciales guardadas; se le pidió a Jorge revisar ManyChat Analytics o los posts reales de IG/FB para saber si es falta de tráfico orgánico o el trigger no está capturando nada. De paso (09-04) se portó al prompt de `PRINCIPAL`/`PRINCIPAL - Rances Car` una idea real del framework externo (jerarquía de alternativas cuando no hay match de inventario) y se corrigió un mojibake real (doble-encoding UTF-8) en el prompt de Rances Car — ambos publicados y verificados byte a byte. **09-04/05: acceso SSH habilitado al VPS de Carwarriors** (`ssh carwarriors-vps`, llave dedicada) — ya no depende de que Jorge ejecute remediaciones a mano. Se usó para probar si el "Trust this browser" de DealerCenter (evita MFA en logins repetidos) es portable a un entorno headless real — **inconcluso**: la sesión copiada expiró antes de poder probarlo, y el paso siguiente (login con contraseña desde el VPS) quedó bloqueado por el clasificador de permisos; pendiente retomar con otra vía. **DealerCenter ROI:** confirmado en vivo que el checkbox "Include in ROI" excluye una fuente del reporte sin borrarla (sin acción masiva en la UI para ~230 categorías); mensaje enviado a Bianca pidiendo el gasto real de marketing por fuente/mes. **Automation `Resolver Token WhatsApp – AutosMiami`** (resto de un template ajeno, dormida) — mensaje enviado a Jorge González en lenguaje no técnico preguntando si se puede borrar. Ticket de BDC Rep `#TICKET-20586098` sigue Open sin respuesta de soporte (reconfirmado 09-04). Contexto previo (09-01/09-03): WhatsApp en producción en Carwarriors LLC, gate de teléfono, guardrail de dirección, recorridos diferenciados por etapa del lead, fix de timeouts de OpenRouter, reporte mensual de ventas retail activado (falta confirmar primer envío real, 1 oct) — todo publicado. 🟡 Varios fixes de la semana siguen sin confirmar con tráfico real; varios pendientes esperando respuesta de Bianca/Jorge González/soporte DealerCenter. Ver detalle completo en [[../clientes/carwarriors-llc]] | 2026-09-05 |
| **Varela Law** | 🟡 Riesgo de negocio (API de MyCase): mensaje enviado a Mario 2026-08-28 explicando los 4 sistemas en producción que dependen de esa API — **esperando su respuesta**, no perseguir proactivamente. Parser de `Build ID MAP` — resultó ya estar corregido desde el 2026-08-14 (documentado recién ahora), verificado y cerrado. Columna N (Num Overdue Invoices) confirmada automatizable con datos que ya extraemos, sin construir todavía. Backlog nuevo de 6 ideas (investigación externa 2026-08-28): webhooks de MyCase, checklist al abrir caso, conflicto de interés en leads nuevos, seguimiento de clientes sin contacto reciente, y dos de bajo esfuerzo — activar la Agenda de Deadlines ya construida y ampliar el Borrador de Avisos para envío directo al cliente | 2026-08-28 |
| **Pipeline / prospección** | Ver [[../ventas/pipeline]] | 2026-08-15 |

## Bóveda / herramientas internas

- `.claude/skills/compile-wiki/` — compila sesiones de trabajo con clientes desde `raw/` hacia `wiki/` (usar al cerrar una sesión real).
- `.claude/skills/manage-vault/` — referencia general de convenciones para navegar/crear/editar en esta bóveda, creada 2026-09-02 a pedido de Jorge para que cualquier agente (no solo esta sesión) la gestione bien. Ver [[../../README|README]] y [[../../raw/interno/2026-09-02-skill-manage-vault-creada]].

## Pendientes de la agencia (no ligados a un cliente específico)

- [ ] Rotar la Location API Key de Carwarriors LLC en GHL (quedó expuesta en un chat el 2026-07-27) — Jorge indicó explícitamente no rotarla por ahora.
- [ ] Investigar `n8n.apps.carwarriorsllc.com` — instancia n8n externa, viva y mantenida (cert renovado, no es del proyecto FORJADO). **Actualizado 09-04:** probable relación con "Yoan" (`gyoan-byte`, email `gyoan@carwarriorsllc.com`, especialista GHL que construyó los bots legacy de Carwarriors en marzo 2026, identificado al investigar el repo `gyoan-byte/carwarriors-kb`) — no confirmado si es la misma persona que "Carlos Cisneros". Sin credenciales para ver qué corre ahí. Pendiente conseguir login o preguntarle directamente a Yoan/Carlos Cisneros.
- [ ] Completar datos del panel de inicio (fundador y contacto ya cargados): web/redes y forma legal/facturación — requiere datos del usuario.

## Relacionado

- [[../clientes/carwarriors-llc|Carwarriors LLC]]
- [[../clientes/varela-law|Varela Law]]
- [[../ventas/pipeline|Pipeline (MOC)]]
- [[../index|Índice de la bóveda]]
