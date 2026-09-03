---
tags: [forjado, cliente, carwarriors, dealercenter, roi, marketing, diagnostico]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-02
---

# 2026-09-02 — DealerCenter ROI: diagnóstico completo, listo para responder a Bianca

**Contexto:** continuación de [[2026-09-02-bianca-pregunta-conectar-roi-dealercenter]] — el login había quedado bloqueado en MFA por SMS. Retomado con Jorge disponible; en la práctica **no pidió ni SMS ni email**, la sesión ya estaba recordada en el dispositivo (login directo a `app.dealercenter.net`, sin prompt de 2FA).

## Hallazgo 1: el reporte SÍ tiene datos reales, solo están enterrados

El reporte `Reports → ROI` (`reportId=-1013`) tiene **236 filas**, una por cada string de Lead Source distinto que DealerCenter haya visto alguna vez (confirmado por su propia descripción: "Sources can be grouped under a single alias name" — no hay curación, cada variante/typo genera una fila nueva). Paginado a 50 filas por página (5 páginas), ordenado alfabéticamente.

La captura que mandó Bianca corresponde a la **página 1**, dominada por categorías vacías o legacy sin relación con el pipeline actual: `$0`, `$0 down`, `$0 down Ramces`, variantes granulares de integraciones nativas (`CarGurus - Autolist - Inventory Leads Website`, `Capital One - AutoNavigator - Trade-In`, etc.), y nombres con typos evidentes (`cw suv David`, `CW trade intes`, `TRADE VID.3 W`). Todas en 0 porque genuinamente no reciben tráfico.

Las categorías que sí usa el pipeline real (`Trade-In CW`, `Tesla CW`, `Trade in Rances`, ver `carwarriors-llc-source-2026-08-25.md`) están más adelante en la lista (páginas 4-5) y **sí muestran leads reales este mes**:

| Lead Source | Received Leads (Sep 2026, mes en curso) |
|---|---|
| Tesla CW | 2 (+ 6 Appts Made) |
| Trade-In CW | 1 |
| Trade in Rances | 7 |

Conclusión: el mecanismo de captura de leads → DealerCenter funciona bien. El problema es puramente de **presentación** — 236 filas sin curar hacen ilegible el reporte a simple vista.

## Hallazgo 2: Marketing Cost / Cost Per Lead / ROI% están en $0.00 para TODO, por diseño

Confirmado en Settings → Customer → Lead Management → **Lead Sources and Costs** (`/apps/shell/admin/settings/customer/lead-management/lead-sources-and-costs`): cada Lead Source tiene un checkbox "Include in ROI" (activado para `Trade-In CW`, `Tesla CW`, confirmado) y dos campos de costo — **Flat** y **Per Lead** — ambos vacíos para absolutamente todas las fuentes revisadas, incluidas las activas.

Esto no es un bug: la propia descripción del reporte lo advierte ("Marketing Cost and ROI may not be accurate since Historical Costs are absent for one or more months"). DealerCenter **no jala el gasto real de ads de ninguna plataforma** (Meta, Google, etc.) — es carga 100% manual en esa pantalla (o vía el botón "Manage Historical Costs" para meses pasados). Sin esa carga, el ROI% siempre va a dar 0% o indefinido sin importar cuántos leads reales lleguen.

## Respuesta lista para Bianca (pendiente que Jorge la envíe)

Dos cosas separadas:
1. El reporte no está roto — los leads sí están llegando y quedando registrados (ver tabla arriba). Hay que ignorar/limpiar las ~230 categorías legacy sin uso para que sea legible, o filtrar por "Received Leads > 0".
2. Si además quiere ver el % de ROI real (no solo el conteo de leads), alguien tiene que cargar manualmente cuánto se gastó en marketing por fuente/mes en esa pantalla de Settings — DealerCenter no lo conecta automático a ninguna cuenta de ads.

## Pendiente real

- [ ] Decidir con Bianca/Jorge González si vale la pena limpiar las categorías legacy de "Lead Sources and Costs" (borrar o des-marcar "Include in ROI" en las que nunca se van a usar) para que el reporte quede legible de entrada.
- [ ] Si se quiere ROI real, decidir quién carga el gasto mensual de marketing por fuente (Bianca, según el mensaje original, maneja el marketing).
- [ ] Enviar la respuesta a Bianca (no enviada todavía, este archivo documenta el diagnóstico listo para redactarla).

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-02-bianca-pregunta-conectar-roi-dealercenter]]
