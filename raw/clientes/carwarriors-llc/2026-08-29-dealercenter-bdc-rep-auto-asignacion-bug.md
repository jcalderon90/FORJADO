# 2026-08-29 (noche) — DealerCenter: confirmado en vivo el bug de auto-asignación de BDC Rep, evidencia ampliada y sumada al ticket de soporte, 2 mitigaciones evaluadas y descartadas

**Contexto:** Jorge preguntó si la sincronización de leads con DealerCenter (GHL↔DealerCenter, ambas direcciones) estaba funcionando bien. Se confirmó que sí (ver hallazgo separado, ambas direcciones sanas). En el proceso surgió el tema de si el auto-asignamiento de BDC Rep en DealerCenter (el problema original que reportó Bianca el 2026-08-22, ver `project_carwarriors_dealercenter_lead_sync`) ya estaba resuelto.

## Verificación en vivo en DealerCenter (Playwright, sesión de Jorge)

Se navegó a Dealer Settings → Customer → Lead Assignment (cuenta CARWARRIORS LLC) y se confirmó:
- **Sales Rep** y **BDC Rep** (rotación plana "Assignment Users"): ambas tablas siguen **"No records available"** — vacías, tal como se decidió el 08-22.
- **"Do not auto assign leads unless status is New"**: sigue **apagado** en ambas secciones — la mitigación identificada el 08-26 nunca se aplicó.
- **Custom Lead Assignment** (31 reglas): verificadas cargadas y visibles en el DOM, con reps reales asignados por regla (Alejandra Roa/Nallely De Leon para CW, Scarleth Rubi/Carlos Samuel Aguilar para Rances).

## El ticket de soporte ya existía — encontrado y leído completo

Jorge mencionó que ya había un ticket abierto. Se encontró en DealerCenter → Force → Support: **#TICKET-20586098**, *"Motor de auto-asignación asigna un representante aunque nadie tenga 'Ready for Leads' activo"*, creado 2026-08-28, status **Open**, **sin ninguna respuesta de soporte** (sección de mensajes vacía). Contenido completo: 2 evidencias (Rosalio Leiva Fernandez, tel. 786-890-4538, y un lead de prueba interno tipo Walk-in) donde el sistema asigna BDC Rep pese a que su propio log dice "no BDC rep ready for leads during automatic assignment". Pregunta a soporte: si es bug conocido y si hay alguna config además del toggle "Do not auto assign..." que lo evite.

## Aclaración importante de alcance (corregirla propia interpretación del asistente)

Se distinguió entre dos problemas que se habían mezclado: (1) el reclamo ORIGINAL de Bianca (08-22) — leads de Rances/CarGurus cayendo en Nallely/Alejandra (equipo equivocado) — causado por la tabla de rotación plana que en ese momento solo tenía a esas 2 personas; **este síntoma específico no aparece en los datos de hoy** para las 6 categorías oficiales de Bianca (Tesla/Trade CW, Tesla/Trade Rances, CarGurus, Capital One) — se auditaron ~50 leads recientes de esas categorías y el 100% fueron al rep correcto. (2) El bug del ticket (08-26) — un fallback distinto y más profundo del motor de DealerCenter.

**Pero Jorge aportó nueva evidencia real de Bianca** (mensajes de WhatsApp del 24 y 26 de agosto, pegados textualmente) con una lista de 15 números de teléfono que, según ella, se asignaron "a una BDC que no tiene nada que ver, y encima son Lost". Esto obligó a revisar más a fondo.

## Auditoría manual completa de los leads de Alejandra Roa (112 leads, filtrado por BDC Rep en Customer List)

Se filtró el reporte "Customers List" por BDC Rep = Alejandra Roa (111→112 resultados, cambió en vivo mientras se auditaba) y se revisaron las 3 páginas completas (112 de 112). Resultado: **~40% (44 de 112) tienen una fuente que no le corresponde a Alejandra**, en 4 categorías:

1. **Cruce con Nallely** (fuentes con su nombre, sin regla propia en Custom Lead Assignment): `TIKTOK NALLE` (5), `FACEBOOK NALLE (OR)` (2), `FACEBOOK MARI (NALLE)` (5) — 12 casos.
2. **Cruce entre dealers, violando una regla que SÍ existe y funciona bien normalmente**: 1 caso grave — cliente "OSLAYDA" (786) 366-9126, Lead Source `TESLA RANCES` (regla real: debe ir a Scarleth Rubi/Carlos Samuel Aguilar), pero terminó en Alejandra Roa. Este es el hallazgo más fuerte porque descarta la hipótesis de "solo pasa cuando no hay regla que aplique".
3. **Fuentes sin regla ni dueño claro**: `CARWARRIORS CALL` (2), `PEDRO REFERIDO` (2), `FACEBOOK MARVIN N` (1), `OFFERUP` (3), `REFERIDO JOANDRY` (1, y ese mismo Lead Source en otros leads va normalmente a Scarleth — inconsistente), `CARZING` (1), `WHATSAPP CW` (1, dudoso).
4. **Lead Source completamente vacío**: ~11 casos, todos igual asignados a Alejandra.

Se verificó en detalle 2 casos concretos abriendo el registro del cliente:
- **Bianca Cangialosiprueba** (754-802-9108) — su propia prueba, confirmada: Lead Source "Walk-in", Status "Lost" (marcado por ella misma 08-21), BDC Rep = Alejandra Roa. Coincide exactamente con la Evidencia 2 del ticket.
- **Rosalio Leiva Fernandez** (786-890-4538) — tiene **3 registros duplicados** en DealerCenter (2× Working Deal, 1× Lost). El registro Lost revisado mostró en realidad BDC Rep = Fran Rodriguez (no Alejandra como dice el ticket) y Lead Source "maikol referido fran" — no se pudo determinar con certeza cuál de los 3 duplicados es el que describe el ticket original; posible que el dato haya cambiado desde entonces, o que sea otro de los duplicados. No se investigó más a fondo por tiempo — queda como ambigüedad sin resolver.

## Evidencia sumada al ticket (2 mensajes nuevos)

1. Primer mensaje: confirmación del caso propio de Bianca (754-802-9108) + lista de los 13 números únicos de su reporte de WhatsApp, pidiendo a soporte que los revise en logs de backend.
2. Segundo mensaje: el caso más grave (OSLAYDA, Tesla Rances → Alejandra, violando una regla real) + resumen de la auditoría completa (~40% de 112 leads de Alejandra mal asignados) + reiteración de la pregunta a soporte.

Ambos mensajes confirmados visibles en el ticket ("You · Just now"). **Sigue Open, sin respuesta de soporte al cierre de esta sesión.**

## 2 mitigaciones propias evaluadas y descartadas (no se tocó nada en producción)

1. **Apagar el switch "Enable BDC Rep Support"** (Dealer Settings → Customer → Lead Assignment): se abrió el diálogo de confirmación real de DealerCenter, que advierte explícitamente que apagarlo también **impide ver o actualizar manualmente el BDC Rep tanto en leads nuevos como existentes** — es decir, ni siquiera serviría para el objetivo (que el equipo asigne a mano), sería peor que el problema actual. Se canceló el diálogo (clic en "No"), el switch quedó exactamente como estaba (ON).
2. **Quitar las 31 reglas de Custom Lead Assignment**: descartado por razonamiento, no se llegó a intentar en la UI — el bug no depende de si existen reglas o no (es un fallback del motor independiente de eso, confirmado por el caso Tesla Rances que sí tenía regla y aun así falló); quitar las reglas solo aumentaría el % de leads expuestos al mismo fallback (del ~40% actual hacia ~100%), perdiendo además el ~60% que hoy sí se reparte bien.

**Conclusión operativa:** no hay ningún cambio de configuración seguro que se pueda aplicar de este lado. Se dejaron las reglas tal cual (siguen funcionando bien para la mayoría del volumen) y se redactó un mensaje corto para que Jorge se lo pase a Bianca por WhatsApp, explicando lo encontrado, lo ya escalado, y pidiéndole que el equipo revise cada tanto los leads de Alejandra por si hay que reasignar alguno a mano mientras se espera respuesta de soporte.

**Se evaluó automatizar el chequeo periódico del ticket** (agente programado en la nube) y se descartó: esos agentes corren aislados sin acceso al navegador local ni a la sesión ya logueada de DealerCenter — un chequeo automático se toparía con la pantalla de login sin nadie para autenticarla. Queda como chequeo manual, a pedido de Jorge en una futura sesión.

**Pendiente real:** esperar respuesta de soporte de DealerCenter al ticket #TICKET-20586098. Mientras tanto, auditoría manual periódica recomendada (Customer List filtrado por BDC Rep, comparando Lead Source contra las categorías/fuentes reales de cada rep) — no automatizada.
