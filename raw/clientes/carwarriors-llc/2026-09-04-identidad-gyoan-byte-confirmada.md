---
tags: [forjado, cliente, carwarriors, ghl, seguridad, identidad, gyoan-byte]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-09-04
---

# 2026-09-04 — Identificado quién es `gyoan-byte`: no es un tercero desconocido, es un "especialista en GHL" con email @carwarriorsllc.com

**Contexto:** continuación de `[[2026-09-04-hallazgo-seguridad-tokens-ghl-filtrados-repo-externo]]` y `[[2026-09-04-kb-nativo-ghl-explorado-hallazgo-carwarriors-kb-externo]]`. Al revisar los 18 documentos restantes del framework externo (calidad confirmada sólida, cero menciones de Tesla/marcas problemáticas, varios guardrails reusables — ver detalle abajo), se consultó también la API pública de GitHub (`api.github.com/repos/.../commits`, `api.github.com/users/gyoan-byte`) para intentar identificar el origen.

## Hallazgo — identidad real

- **Perfil de GitHub:** nombre "Yoan GHL", bio "Especialista en GHL", company "Carwarrios LLC" (typo de "Carwarriors"), cuenta creada 2026-01-04.
- **Email de los commits (todos, mismo autor):** `gyoan@carwarriorsllc.com` — **dominio corporativo del propio cliente**, no un tercero sin relación.
- **Historial de commits real (marzo 2026):** "implement multi-account GHL agent scheduler with custom schedules" (17 mar), "Add RC bots and update CW bots with enhanced formatting" (23 mar), "config: add Rances Car account with BDC schedule" (23 mar), "docs: add Mercedes-Benz CLS to vehicle knowledge base" (2 mar). Es decir, esta persona construyó los bots legacy de GHL (Carwarriors LLC y Rances Car) y el Worker `activate-ai` (el mismo que contenía los tokens filtrados) en marzo 2026 — antes de la migración a n8n (decidida 2026-08-12).

## Reinterpretación del hallazgo de seguridad

Esto cambia el marco del hallazgo de tokens filtrados (`2026-09-04-hallazgo-seguridad-tokens-ghl-filtrados-repo-externo`): no parece ser una filtración de un desconocido sin relación con Carwarriors, sino **credenciales de trabajo de un especialista de GHL que construyó la infraestructura legacy del cliente**, dejadas en texto plano en un repo público que él mismo mantiene bajo el dominio corporativo del cliente. Sigue siendo una mala práctica real (secretos en texto plano, público, sin necesidad) y la rotación de tokens sigue siendo la decisión correcta — pero el nivel de "amenaza externa" es menor de lo que parecía inicialmente.

**Sigue sin confirmar:** si "Yoan" (`gyoan@carwarriorsllc.com`) sigue teniendo alguna relación activa con Carwarriors hoy, o si es la misma persona que "Carlos Cisneros" / `n8n.apps.carwarriorsllc.com` (misterio pendiente desde julio 2026, sin resolver) — razonable sospechar que sí, dado el mismo dominio de email y el mismo tipo de trabajo (especialista GHL externo), pero no está confirmado.

## Revisión de los 18 documentos restantes del framework — calidad confirmada, guardrails reusables identificados

Se leyeron 5 más como muestra representativa (de los 18 pendientes): `06_Objection_Handling`, `15_Trust_Authority`, `13_Conditional_Logic`, `09_Escalation_Policy`, `README`. Los 13 restantes no se leyeron (no se considera necesario para la decisión de fondo).

Hallazgos útiles y potencialmente reusables para el prompt de `PRINCIPAL`/`PRINCIPAL - Rances Car`:

- **`13_Conditional_Logic`**: jerarquía de alternativas cuando no hay match de inventario — (1) mismo modelo/año distinto, (2) misma marca/modelo similar, (3) mismo tipo de carrocería — en vez de simplemente decir "no disponible". Regla adicional: "si el cliente vuelve después de días o repite el mismo pedido, re-verificar Carros Listos antes de confirmar — nunca asumir que la disponibilidad previa sigue vigente". Esto es exactamente el tipo de guardrail que hubiera prevenido el incidente de Tesla (08-27).
- **`15_Trust_Authority`**: regla dura "no prometer precios, aprobaciones, pagos, ni inventario exacto"; construir confianza solo con datos verificables (dirección física real, horario real) — coincide con el guardrail de dirección que ya agregamos el 09-01, podría reforzar la redacción.
- **`09_Escalation_Policy`**: triggers claros de cuándo escalar a un asesor humano (precio exacto solicitado, fotos de unidad específica, señales de alta intención como "voy hoy"/"tengo el dinero listo"). El bot de n8n hoy no tiene esta lógica de escalamiento explícita — mejora real identificada, no implementada todavía.
- **`06_Objection_Handling`**: librería de 11 tipos de objeción con progresiones de respuesta de 5 pasos cada una, frases de validación rotativas para evitar repetición — más elaborado que lo que tiene el prompt actual.
- Cero menciones de Tesla/Lamborghini/marcas problemáticas en ningún documento leído (7 de 20 totales ahora revisados).

## Pendiente real

- [ ] Decidir con Jorge si vale la pena portar alguna de estas ideas concretas (jerarquía de alternativas de inventario, triggers de escalamiento, librería de objeciones) al prompt de `PRINCIPAL`/`PRINCIPAL - Rances Car` — identificadas, no implementadas.
- [ ] Decidir si contactar directamente a `gyoan@carwarriorsllc.com` (ahora que se tiene el email real) en vez de solo intentar vía GitHub — con el mensaje ya redactado para "gyoan-byte/Carlos Cisneros", pendiente de enviar.
- [ ] Sigue sin confirmarse si "Yoan" es la misma persona que "Carlos Cisneros"/`n8n.apps.carwarriorsllc.com` (misterio de julio 2026).
- [ ] Los 13 documentos restantes del framework no se leyeron — bajo prioridad, no se considera necesario a menos que se decida portar contenido de forma más sistemática.

## Relacionado

- [[carwarriors-llc]]
- [[2026-09-04-hallazgo-seguridad-tokens-ghl-filtrados-repo-externo]]
- [[2026-09-04-kb-nativo-ghl-explorado-hallazgo-carwarriors-kb-externo]]
