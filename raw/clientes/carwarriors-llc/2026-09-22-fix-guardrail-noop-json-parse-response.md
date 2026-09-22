# Incidencia y Resolución: Filtrado de JSON crudo `{"": "noop"}` a Leads en Messenger

**Fecha:** 2026-09-22  
**Cliente:** Carwarriors LLC & Rances Car  
**Canal:** Facebook Messenger / GHL  
**Severidad:** Media (Experiencia de usuario / BDC)  
**Estado:** 🟢 Resuelto y Desplegado en Producción vía MCP  

---

## 1. Contexto del Problema
Bianca reportó una captura de pantalla donde un lead ("Roycel Otrupon Osa", interesado en Tesla) recibió un mensaje con el texto literal:
`{\"\":  \"noop\"}`

Inmediatamente después, el bot envió la propuesta de cita:
*“¡Hola! Vi que estabas interesado. Tengo disponibilidad para mostrártelo mañana — ¿te queda mejor a las 11:00 AM o a las 3:00 PM?”*

## 2. Análisis de Causa Raíz (RCA)
1. **Comportamiento del LLM:**
   El modelo en OpenRouter (en situaciones donde no deseaba emitir texto o interpretar un comando interno) generó una respuesta atípica con clave vacía: `{"": "noop"}` en lugar del esquema JSON formal esperado (`{"respuesta": "...", "accion": {...}}`).
2. **Deficiencia en `Parse response` (Code Node):**
   La función `extraerJson()` no encontró la clave obligatoria `respuesta`, por lo que entró en la rama `if (!found)`.
   En dicha rama:
   ```javascript
   const recovered = prepareForHttp(cleanRaw);
   return [{ json: { respuesta: recovered || "Lo siento...", ... } }];
   ```
   Como `cleanRaw` no era una cadena vacía, `recovered` conservó `{"": "noop"}` y se envió directamente como mensaje al cliente a través de LeadConnector/GHL.

## 3. Acciones de Mitigación y Blindaje
Se aplicó un doble blindaje tanto en **PRINCIPAL (Carwarriors LLC)** como en **PRINCIPAL - Rances Car**:

### A. Guard en `Parse response` (JavaScript)
Se validó que si el contenido de `recovered` inicia con `{` o `[` (indicativo de JSON/estructura técnica no parseada), sea descartado automáticamente y reemplazado por la respuesta de contingencia:
```javascript
if (!found) {
  const recovered = prepareForHttp(cleanRaw);
  // GUARD: si recovered es JSON crudo (ej. {"": "noop"}), no enviarlo al usuario
  const esJsonCrudo = !recovered || recovered.trimStart().startsWith('{') || recovered.trimStart().startsWith('[');
  return [{ 
    json: { 
      respuesta: esJsonCrudo ? "Lo siento, tuve un problema procesando esa respuesta. ¿Puedes repetirlo?" : recovered,
      accion_tipo: "error",
      error: "no_json",
      raw_output: raw,
      consulta_pendiente_guardar: entradaUsuarioActual,
      consulta_pendiente_limpiar: false
    }
  }];
}
```

### B. Restricción en el System Prompt (`PRINCIPAL`)
Se agregó en la sección `## REGLAS ESTRICTAS ##`:
> `- PROHIBIDO responder con JSON mal formado, clave vacía, o la palabra "noop". La clave respuesta SIEMPRE debe contener texto legible para el usuario. Las únicas acciones válidas son: saludar|calificar|consultar_inventario|agendar|escalar|aclarar|esperar.`

## 4. Despliegue
- **Carwarriors LLC (Workflow `Kif9lWwDHvR7TT39`):** Desplegado vía MCP `n8n-carwarriors`. 2 operaciones aplicadas.
- **Rances Car (Workflow `N68IYzm4Bf6AVTXP`):** Desplegado vía MCP `n8n-carwarriors`. 2 operaciones aplicadas.
- **Repositorio Git:** Cambios sincronizados en `raw/clientes/carwarriors-llc/n8n-workflows/Lead Agent (n8n + OpenRouter)/`.
