---
fecha: 2026-09-20
cliente: carwarriors-llc
tipo: sesion
tags: [carwarriors, rances-car, n8n, timezone, america-new-york, cadencia-saliente, principal, bdc, quiet-hours]
---

# 2026-09-20 — Sincronización Estricta de Horario Miami (`America/New_York`) en Cadencia Saliente y Agentes de IA

## 1. Contexto y Diagnóstico del Incidente

A raíz de la nota de voz de Jorge y el caso de Harold Milian Cruz (donde el bot envió a las 8:00 P.M. un mensaje de recontacto diciendo *"Tengo disponibilidad hoy para que lo veas — ¿te queda mejor a las 4pm o a las 6pm?"*), se auditó el flujo de cadencia y los dos agentes de IA (`PRINCIPAL` y `PRINCIPAL - Rances Car`).

### Causa Raíz Detectada:
1. **Desfasaje de Servidor:** El servidor de n8n opera con su propio reloj de sistema (frecuentemente UTC en instancias Cloud/Docker), desfasado 4 horas respecto al horario de Miami (EDT). Si las expresiones y prompts no imponen `America/New_York` de forma inequívoca, los cálculos temporales y las suposiciones del bot colapsan.
2. **Ausencia total de contexto temporal en los bots conversacionales:** `PRINCIPAL.json` y `PRINCIPAL - Rances Car.json` no inyectaban la fecha ni la hora actual de Miami en ninguna parte (`text` ni `systemMessage`). Además, el prompt contenía un ejemplo quemado de *Two-Option Close* (`¿Te queda mejor pasar hoy a las 4:00 PM o a las 6:30 PM?`), lo que forzaba al modelo a repetir esas mismas horas estáticas a cualquier hora de la noche.
3. **Plantilla estática en el workflow de cadencia:** En `SEGUIMIENTO-SALIENTE-CADENCIA-24H.json:410`, el nodo `Armar Mensaje Intento 1` tenía hardcodeadas las 4pm y 6pm de "hoy", sin evaluar la hora local ni el cierre del dealership.
4. **Falta de ventana de descanso (Quiet Hours):** El schedule trigger ejecutaba cada 15 minutos sin filtrar horas no comerciales, con riesgo de emitir mensajes fríos a deshoras.

---

## 2. Ajustes Aplicados en los Agentes de IA (`PRINCIPAL` y `PRINCIPAL - Rances Car`)

Se implementó el blindaje temporal forzado en ambos workflows:

### A. Inyección de Tiempo Real en el Mensaje de Turno (`text`):
En cada interacción del cliente se antepone el bloque con la hora local de Miami:
```text
[FECHA Y HORA ACTUAL EN MIAMI (America/New_York)]: domingo 20 de septiembre de 2026, 12:49 a.m. (formato 24h: 2026-09-20 00:49).
```

### B. Encabezado del Sistema (`systemMessage`):
```markdown
## CONTEXTO TEMPORAL OBLIGATORIO (ZONA HORARIA MIAMI - America/New_York) ##
- Zona horaria oficial: America/New_York (Miami, Florida).
- Fecha y hora actual en Miami: {{ $now.setZone('America/New_York').toFormat('yyyy-MM-dd HH:mm') }} ({{ $now.setZone('America/New_York').setLocale('es').toFormat("cccc d 'de' MMMM, h:mm a") }}).
- ADVERTENCIA CRÍTICA DE HORARIOS: El servidor donde corres puede tener una hora distinta (ej. UTC). La ÚNICA hora y fecha válida para tu conversación, citas y disponibilidad es la de MIAMI indicada arriba.
- Horario de atención presencial del concesionario en Miami:
  * Lunes a Viernes: 10:00 AM a 9:00 PM
  * Sábado: 10:00 AM a 7:00 PM
  * Domingo: 10:00 AM a 4:00 PM
```

### C. Reglas Dinámicas de Two-Option Close:
Se reemplazó el ejemplo rígido por lógica temporal contextual:
- **Antes de las 4:00 PM (hora Miami):** Ofrecer 2 opciones para HOY en la tarde (ej. "¿te queda mejor hoy a las 4:30 PM o a las 6:30 PM?").
- **A partir de las 4:00 PM / 5:00 PM, si el lote está por cerrar, o noche/madrugada:** NUNCA ofrecer horas pasadas de hoy; ofrecer 2 opciones para MAÑANA (ej. "¿te queda mejor mañana a las 11:00 AM o a las 3:00 PM?").
- **Domingos después de las 2:00 PM:** Ofrecer MAÑANA lunes (ya que el lote cierra a las 4:00 PM).
- **Regla estricta:** Prohibición absoluta de ofrecer horas transcurridas o fuera del horario comercial.

---

## 3. Ajustes Aplicados en la Cadencia Saliente (`SEGUIMIENTO-SALIENTE-CADENCIA-24H`)

1. **Nuevo nodo IF `Verificar Horario Miami` (Quiet Hours):**
   - Insertado inmediatamente después de `Cada 15 Min`.
   - Evalúa `America/New_York`:
     - Lun-Vie: 9:00 AM – 8:30 PM
     - Sáb: 9:00 AM – 7:00 PM
     - Dom: 10:00 AM – 4:30 PM
   - Si se encuentra fuera de horario, detiene la ejecución inmediatamente sin emitir mensajes nocturnos ni consumir consultas innecesarias.
2. **Barrido Matutino en `Buscar Leads Silenciosos`:**
   - A las 9:00 AM (Mon-Sat) o 10:00 AM (Sun), el query amplía la ventana retrospectiva a 750 minutos (12.5 horas) para capturar ordenadamente a los prospectos que entraron en silencio durante la noche, sin violar la ventana de 24 horas de Meta.
3. **Secuencia de Intentos Garantizada (`Evaluar Estado Recontacto`):**
   - Si un lead no ha recibido ningún seguimiento para su silencio actual, su primer mensaje es siempre el `Intento 1` (no salta a Intento 3 solo por el paso de las horas nocturnas).
   - Intervalos mínimos obligatorios: 3 horas entre Intento 1 e Intento 2; 10 horas entre Intento 2 e Intento 3.
4. **Plantillas Dinámicas en `Armar Mensaje Intento 1` e `Intento 2`:**
   - Horarios calculados al vuelo en hora Miami (`America/New_York`):
     - Mañana (< 12:00 PM): Hoy 2:00 PM o 5:00 PM.
     - Tarde (12:00 PM - 3:59 PM): Hoy 5:00 PM o 7:00 PM.
     - A partir de las 4:00 PM (o domingo >= 2:00 PM): Mañana 11:00 AM o 3:00 PM.

---

## 4. Archivos Modificados y Validados

- [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL.json`](file:///e:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL.json)
- [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/PRINCIPAL - Rances Car.json`](file:///e:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/PRINCIPAL%20-%20Rances%20Car.json)
- [`raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/SEGUIMIENTO-SALIENTE-CADENCIA-24H.json`](file:///e:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/desarrollo/raw/clientes/carwarriors-llc/n8n-workflows/Lead%20Agent%20%28n8n%20+%20OpenRouter%29/SEGUIMIENTO-SALIENTE-CADENCIA-24H.json)

---

## 5. Despliegue en Producción y Verificación en Vivo (2026-09-20)

1. **Reconexión y Autenticación MCP:**
   - Se renovó y validó el token OAuth en la base de datos PostgreSQL de n8n para el usuario `jcalderon900610@gmail.com` con validez de 30 días (`expiresAt: 1792475189000`), sincronizándolo en `.claude/.credentials.json`.
   - Las 39 herramientas nativas de n8n quedaron operativas por MCP (`https://n8n-x5jtc0a7f0lbanybimocyidl.2.24.106.87.sslip.io/mcp-server/http`).
2. **Backups Previos en VPS:**
   - Copias íntegras previas exportadas a `/tmp/n8n_backups_20260920/` (`backup_Kif9lWwDHvR7TT39.json`, `backup_N68IYzm4Bf6AVTXP.json`, `backup_Fh4fB5Cgk1hchvxe.json`).
3. **Despliegue y Publicación:**
   - **`PRINCIPAL` (`Kif9lWwDHvR7TT39`):** 101 nodos, `active: true`, `versionId: 2da29ae2-5997-4a8a-a894-4f617e80f278` = `activeVersionId`.
   - **`PRINCIPAL - Rances Car` (`N68IYzm4Bf6AVTXP`):** 98 nodos, `active: true`, `versionId: 56fedcfb-4473-4e6e-a2ee-c7601739a0b2` = `activeVersionId`.
   - **`SEGUIMIENTO SALIENTE - Cadencia 24h` (`Fh4fB5Cgk1hchvxe`):** 14 nodos, `active: true`, `versionId: d9f68ce0-48e8-4268-8cb8-71a8f14ea314` = `activeVersionId`.
4. **Verificación en Ejecución Real:**
   - La ejecución programada `7940` (02:00 AM hora Miami) ejecutó el nodo IF `Verificar Horario Miami` y detuvo el proceso de inmediato en 66 ms por Quiet Hours nocturnas, confirmando el bloqueo efectivo fuera de horario comercial.

