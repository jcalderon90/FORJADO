---
tags: [forjado, cliente, varela-law, radar-billing]
tipo: raw
cliente: Varela Law
fecha: 2026-08-28
---

# 2026-08-28 — Parser de Build ID MAP: ya estaba corregido (2026-08-14), verificado hoy

**Contexto:** la wiki traía como pendiente "corregir el parser de `Build ID MAP` (`JoQ4f8txlZTi89O4`) antes de la próxima corrida completa" desde 2026-07-15 — el parser viejo asumía que el nombre de MyCase seguía el orden "Apellido, Nombre" del Sheet y fallaba con nombres en orden invertido o dockets pegados sin separador.

**Hallazgo real (revisando el workflow vía MCP):** ese fix ya se aplicó el **2026-08-14**, quedó guardado en la versión activa (`versionId 78a832ba`, autor "Varela Law (via MCP)", nombre de versión "Fix parser: word-based name matching instead of Last,First split"), y se ejecutó con éxito contra el ID MAP real (ejecución `2255`, 2026-08-14T16:47 UTC). Nunca se documentó en la wiki ni en memoria — quedaba como pendiente abierto sin serlo.

**Qué cambió el fix:** en vez de partir el nombre por la coma/última palabra asumiendo el orden del Sheet, ahora indexa cada nombre de MyCase por el *set* de sus palabras y verifica que las palabras del apellido + la primera palabra del nombre estén todas presentes, sin importar el orden. Agrega un fallback por apellido único (tolerante a variaciones de ortografía del nombre) y desambigua por docket embebido cuando hay más de un candidato.

**Verificación de hoy (2026-08-28), leyendo la ejecución `2255` completa:**
- CIVIL CASES bajó de 99 a **87 filas** (Mario fue cerrando/quitando casos con el tiempo).
- **81 de 87 (93%) resuelven limpio** (`word_match`).
- **5 AMBIGUOUS:** Castano, Juan / Castano, Juan - FAA Financial (mismo MyCase ID en ambas, posible duplicado de captura, ya documentado desde 2026-07-25); Correa, Jose; Flores, Juan; Medina, Manuel.
- **1 NO MATCH:** Rojas Tovar, Manuel.
- De las 4 filas históricas que llevábamos meses marcando como "necesitan criterio humano": **Marquez, Dimas ahora resuelve solo** (confirma que el fix funciona en un caso real). Medina, Manuel y Rojas Tovar, Manuel siguen sin resolver — correctamente, son casos genuinamente ambiguos/sin dato para desempatar, no un fallo del parser. **Joj, Santos ya no aparece** en CIVIL CASES — su caso probablemente ya no está activo en el Sheet (no confirmado con Mario, no bloqueante).
- Los 3 AMBIGUOUS nuevos (Castano x2, Correa Jose, Flores Juan) son casos que el parser viejo probablemente resolvía mal en silencio (ej. el bug de Correa Jose/Vladimir del 2026-07-08) — ahora el parser los señala en vez de asignarlos a ciegas, que es el comportamiento correcto.

**Sin riesgo para producción:** `Radar Billing - Write Production` salta por completo las filas AMBIGUOUS/NO MATCH sin tocarlas (diseño de seguridad ya documentado desde 2026-07-25), así que esta corrida no afecta los valores que Mario ve en la pestaña 07-05-26 real.

**Cierra:** el pendiente "corregir el parser de Build ID MAP" — ya no es un riesgo latente si se vuelve a correr completo.

**Pendiente nuevo, no bloqueante:** revisar a criterio humano las 6 filas de ID MAP con problema (Castano Juan x2, Correa Jose, Flores Juan, Medina Manuel, Rojas Tovar Manuel) cuando surja la ocasión — mismo patrón que las 4 anteriores, sin urgencia.
