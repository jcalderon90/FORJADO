# Guía de Implementación — Guardrail Anti-Spam / Bajo Interés en PRINCIPAL

**Objetivo:** detectar engagement-farming (spam de interacción en videos, países no comprables) y bajo interés ("solo mirando", "después veo") para bloquear/silenciar y no gastar tokens en conversaciones sin propósito comercial.

---

## Cambios requeridos en `PRINCIPAL` (n8n)

### 1. Nuevo nodo: `SPAM SEMANTICO CHECK` (Code node)
**Ubicación:** Entre `INPUT FINAL` → `CONTEXT 1` (antes del agente, después de normalizar el mensaje).
**Propósito:** pre-filtro determinista, costo 0, sin LLM.

```javascript
// SPAM SEMANTICO CHECK
const entrada = $('INPUT FINAL').first().json.input || '';
const texto = entrada.toLowerCase();

// Patrones SPAM engagement-farming
const patronesSpam = [
  /interacc[ió]n/, /participaci[oó]n/, /comenta/, /comparte/, /sube.*video/,
  /me gusta/, /s[ií]gueme/, /suscr[ií]bete/, /follow/, /like[s]?/, /engagement/,
  /ganar dinero/, /dinero por ver/, /dinero por/,
  /participar en/, /interactuar/, /comenta tu/, /comenta mis/
];

// Patrones BAJO INTERÉS (sin intención comercial)
const patronesBajoInteres = [
  /solo estoy mirando/, /despu[eé]s veo/, /no tengo dinero/, /solo curioso/,
  /no me interesa/, /solo pregunto/, /solo viendo/, /pasando el rato/
];

// Señales de INTENCIÓN COMERCIAL (excluyen spam/bajo-interés)
const senalesComerciales = [
  /auto/, /carro/, /veh[ií]culo/, /camioneta/, /suv/, /sed[aá]n/, /pickup/,
  /marca/, /modelo/, /a[nñ]o/, /kilometraje/, /precio/, /costo/, /pago/,
  /financiamiento/, /cr[eé]dito/, /enganche/, /mensualidad/, /cuota/,
  /visita/, /cita/, /test drive/, /test-drive/, /videollamada/, /llamada/,
  /agendar/, /disponible/, /stock/, /inventario/, /promo/, /oferta/,
  /trade/, /trade-in/, /entrega/, /carro que tengo/, /mi carro/
];

const esSpam = patronesSpam.some(r => r.test(texto));
const esBajoInteres = patronesBajoInteres.some(r => r.test(texto));
const tieneSenalComercial = senalesComerciales.some(r => r.test(texto));

// Si hay señal comercial clara -> NO es spam/bajo-interés
const spamDetectado = (esSpam || esBajoInteres) && !tieneSenalComercial;

let motivo = '';
if (esSpam && !tieneSenalComercial) motivo = 'spam_engagement_farming';
else if (esBajoInteres && !tieneSenalComercial) motivo = 'bajo_interes';

return [{
  json: {
    spam_detectado: spamDetectado,
    motivo: motivo || null,
    patrones_encontrados: {
      spam: esSpam,
      bajo_interes: esBajoInteres,
      senal_comercial: tieneSenalComercial
    }
  }
}];
```

---

### 2. Extender `Lenguaje & Asesoria` (sub-agente)
**Cambio en su salida JSON:** agregar campo `es_spam` y `motivo_spam` (booleano + string) basado en análisis semántico del mensaje + contexto.

**Prompt addition (en su systemMessage):**
```
## CLASIFICACIÓN SPAM / BAJO INTERÉS
Si el usuario pide interacción/participación en videos, "me gusta", "sígueme", "suscríbete", "ganar dinero" SIN mencionar auto/precio/cita -> es_spam: true, motivo_spam: "engagement_farming".
Si dice "solo estoy mirando", "después veo", "no tengo dinero", "solo curioso" y no avanza a calificación en 3 turnos -> es_spam: true, motivo_spam: "bajo_interes".
NO confundir con objeciones reales (precio, crédito, trade-in) -> es_spam: false.
```

---

### 3. Nuevo nodo: `SPAM DECISION` (If node)
**Ubicación:** Después de `Parse response` (o integrado en `Parse response`).
**Condición:** `{{ $json.es_spam === true || $('SPAM SEMANTICO CHECK').first().json.spam_detectado === true }}`

**Rama TRUE (spam):**
1. `SPAM SET FLAG` (Set node) → `{ es_spam: true, motivo_spam: "..." }`
2. `SPAM RESPUESTA CIERRE` (Set node) → respuesta única: "Gracias por escribir. Si buscas un auto estamos para ayudarte. 😊"
3. `SPAM TAG GHL` (HTTP Request — reusa patrón `SPAM BLOCK MANYCHAT` pero endpoint GHL `/contacts/{id}/tags` con tag `SPAM_BLOQUEADO`)
4. `SPAM FLAG MONGO` (MongoDB update — reusa `SET SPAM FIELD`: `spam_bloqueado: true` en `users`)
5. `SPAM ALERTA SLACK` (reusa `Format Spam Alert` + `Send a message`)
6. `SEND GHL MESSAGE` (envía la respuesta de cierre)
7. **END** (no pasa a `lead_collector`, no dispara `IF NUEVO LEAD`, no `Notifications Master`)

**Rama FALSE (normal):**
→ Flujo actual (`Hay Cambios?` → `Update User Lead` → `IF NUEVO LEAD` → etc.)

---

### 4. Aprovechar infraestructura existente (no duplicar)
- `SPAM BLOCK MANYCHAT` → adaptar a GHL (`/contacts/{id}/tags`, tag `SPAM_BLOQUEADO`)
- `Prepare Spam Flag` + `SET SPAM FIELD` → reusar tal cual (`spam_bloqueado: true`)
- `Format Spam Alert` + `Send a message` (Slack) → reusar
- `Check Spam Flag` (Mongo) → ya existe al inicio del flujo; al marcar `spam_bloqueado: true`, los mensajes siguientes caen en `SPAM BLOCKED IF` → `SPAM BLOCKED PERM` (silencio total)

---

### 5. Corregir ruta `OFF TOPIC` (bug heredado)
**Problema:** `IF FUERA DE CONTEXTO` → `OFF TOPIC - Respuesta` (branding Spectrum) → `OFF TOPIC - Respond` (API ManyChat, `manychat_id`).
**Fix:** 
- Opción A (simple): Borrar `IF FUERA DE CONTEXTO` + `OFF TOPIC - Respuesta` + `OFF TOPIC - Respond`. Dejar que `PRINCIPAL` maneje fuera-de-contexto (ya tiene GUARDRAIL).
- Opción B (si se quiere ruta separada): Rewirar `OFF TOPIC - Respond` a `SEND GHL MESSAGE` (cambiar HTTP Request a GHL `/conversations/messages`, auth `Bearer {ghlToken}`).

---

## Variables de entorno / configuración
- Umbral de turnos consecutivos (default: 3) → configurable en nodo `SPAM SEMANTICO CHECK` o variable de entorno.
- Lista de países no comprables → array en el código del nodo.

---

## Orden de implementación sugerido
1. Agregar nodo `SPAM SEMANTICO CHECK` (Code) y conectar `INPUT FINAL` → `SPAM SEMANTICO CHECK` → `CONTEXT 1`.
2. Extender `Lenguaje & Asesoria` output con `es_spam`/`motivo_spam` (prompt + Parse JSON).
3. Agregar `SPAM DECISION` (If) después de `Parse response`.
4. Rama TRUE: `SPAM SET FLAG` → `SPAM RESPUESTA CIERRE` → `SPAM TAG GHL` → `SPAM FLAG MONGO` → `SPAM ALERTA SLACK` → `SEND GHL MESSAGE` → END.
4. Rama FALSE: conectar a `Hay Cambios?` (flujo actual).
5. Corregir `OFF TOPIC` (borrar o rewirar a GHL).
6. Probar con casos: engagement-farming, bajo interés, objeción real, consulta normal.

---

## Archivos afectados (local exports actualizados)
- `PRINCIPAL.json` → prompt actualizado (GUARDRAIL + DETECCION ANTI-SPAM), OFF TOPIC branding corregido.
- `VECTORIZAR-KB.json` → 12 chunks BDC playbook, referencias `carwarriors_*`.
- `KB-SEARCH.json` → referencias `carwarriors_*`, comentario embeddings actualizado.
- `Estado del Proyecto.md` → decisiones registradas (sync todo contacto nuevo, diseño guardrail aprobado).

---

**Nota:** Esta guía es para aplicar en n8n-carwarriors vía MCP (`patchNode`/`createNode`/`updateWorkflow`) o edición manual en la UI. Los exports locales sirven de referencia/backup.