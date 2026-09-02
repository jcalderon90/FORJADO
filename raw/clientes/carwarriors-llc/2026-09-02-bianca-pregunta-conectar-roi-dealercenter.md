---
tags: [forjado, cliente, carwarriors, dealercenter, roi, marketing, pendiente]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — Bianca pregunta si se puede "conectar" algo para que el reporte ROI de DealerCenter muestre resultados

**Contexto:** Bianca escribió por WhatsApp (9:37am) con una captura del reporte **ROI** de DealerCenter (Reports → ROI, filtro "This month"). La tabla lista 234 filas por "Name" (valores de Lead Source / categorías de marketing: `BIANCA REFERIDO FRAN`, `CAMARO`, `CAMPAÑA`, `CAMPAÑA FACEBOOK`, `CAMPANA HONDAS`, `CAMPANA INFINITI`, `CAMPANA INFINITI M`, etc.), todas en 0 — Received Leads, Appts, Converted Leads, Conversion Rate, Marketing Cost y Cost Per Lead en $0.00/0.00%. Su pregunta textual: "tengo una pregunta / podremos conectar eso aca?? / para que aparezca resultados ahi??" — no especificó qué es "eso" (no se le pidió aclarar todavía).

**Sin responder a Bianca todavía.** No se sabe con certeza si pregunta por:
1. Que las categorías de "Name" (que no coinciden con los valores de Lead Source reales que usa el pipeline actual: `Trade-In CW`, `Tesla CW`, `Trade In Rances`, `Tesla Rances`, `CarGurus`, `Capital One`, ver `carwarriors-llc-source-2026-08-25.md`) reciban leads reales — lo que implicaría o remapear el Lead Source que sube el bot/ADF a estas categorías, o que estas categorías son de otra fuente (leads manuales/telefónicos etiquetados distinto).
2. Que el **Marketing Cost** (columna en $0.00 para todas) se conecte a una fuente real de gasto publicitario (ej. Meta Ads) para que el ROI/Cost Per Lead deje de ser $0 — DealerCenter probablemente requiere carga manual de "Historical Costs" por campaña/mes (el propio reporte avisa en rojo: "Marketing Cost and ROI may not be accurate since Historical Costs are absent for one or more months").

## Investigación iniciada, bloqueada en MFA

Se intentó entrar a DealerCenter (Playwright, sesión persistente `dc`, credenciales `jcalderon90` de `reference_dealercenter-login-credentials`) para ver en vivo qué son estas categorías de "Name" (¿Lead Source? ¿una tabla separada de "Marketing Sources"/campañas con costo asociado bajo Dealer Settings?) y cómo se puebla el Marketing Cost. El login pidió **código SMS de 6 dígitos** (a diferencia de GHL, que ofrece email) — se le preguntó a Jorge el código y **pidió dejarlo pendiente para desarrollar luego**, sin proceder. Sesión de Playwright cerrada sin cambios.

## Pendiente real

- [ ] Retomar el login a DealerCenter (pedir el código SMS a Jorge en el momento, o buscar si hay opción de "remember this device" ya activada de una sesión anterior) y navegar a Reports → ROI + Dealer Settings → Marketing (o donde viva la config de estas categorías) para entender el mecanismo real antes de responder.
- [ ] Una vez entendido, decidir con Jorge qué responderle a Bianca (y si aplica, si esto requiere retomar el mapeo de Lead Source por campaña ya documentado en `carwarriors-llc-source-2026-08-25.md`, sección de asignación de leads por campaña).
- [ ] No se le ha respondido nada a Bianca todavía — sigue esperando.

## Relacionado

- [[carwarriors-llc]]
- [[carwarriors-llc-sftp-dealercenter]]
