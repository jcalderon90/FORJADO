# Saneamiento Técnico: Eliminación de Rama "OFF TOPIC" en PRINCIPAL y Paridad Estructural 100% con Rances Car

**Fecha:** 2026-09-23  
**Cliente:** Carwarriors LLC & Rances Car  
**Componente:** Workflow n8n `PRINCIPAL`  
**Estado:** 🟢 Completado y Verificado  

---

## 1. Contexto y Diagnóstico
Durante la auditoría del workflow n8n `PRINCIPAL` (Carwarriors LLC), se detectó que permanecía una rama huérfana y deshabilitada:
- `IF FUERA DE CONTEXTO` (`id: 629f0cc4-7f96-46f0-b608-5aa8b6fe3929`)
- `OFF TOPIC - Respuesta` (`id: 126f49f3-953b-4a21-a02d-f2ab5f455de1`)
- `OFF TOPIC - Respond` (`id: 22215b98-5d23-4660-8fcc-34f20699befd`)

En particular, el nodo `OFF TOPIC - Respuesta` contenía texto hardcodeado perteneciente a un cliente histórico ajeno de FORJADO:
> *"Lo siento, ese tema está fuera de mis capacidades. Soy una asistente virtual y exclusiva de SPECTRUM VIVIENDA, y mi única función es ayudarte con información sobre nuestros proyectos de vivienda..."*

A diferencia de `PRINCIPAL`, el workflow gemelo `PRINCIPAL - Rances Car` ya había eliminado estos nodos previamente, generando una divergencia innecesaria en la cantidad de nodos y estructura entre ambos dealers.

## 2. Acciones Realizadas
1. **Verificación de Inbound Connections:**
   Se comprobó programáticamente que ningún nodo en ejecución apuntaba hacia `IF FUERA DE CONTEXTO`. La rama estaba 100% aislada.
2. **Remoción Atómica:**
   - Se eliminaron los 3 nodos de `PRINCIPAL.json`.
   - Se removieron las conexiones internas salientes en `connections['IF FUERA DE CONTEXTO']` y `connections['OFF TOPIC - Respuesta']`.
3. **Validación de Integridad y Paridad:**
   - Se ejecutó validación JSON estricta (`JSON.parse`).
   - Se compararon los nombres de nodos entre `PRINCIPAL` y `PRINCIPAL - Rances Car`: diferencia neta de 0 nodos.
   - Cantidad final de nodos: **98 en Carwarriors LLC** y **98 en Rances Car** (paridad exacta 1:1).

## 3. Impacto Operativo
- Eliminación total de referencias y copys heredados de Spectrum Vivienda.
- Reducción del tamaño del payload de exportación del workflow.
- Mantenimiento y sincronización simplificados para futuras iteraciones multi-dealer.
