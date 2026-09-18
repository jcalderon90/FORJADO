---
name: actualiza-estado
description: Actualiza el estado actual del proyecto y sus pendientes. Invócala cuando el usuario escriba "/actualiza-estado" o pida un reporte del estado del proyecto, tareas completadas, auditoría de sistemas y pendientes operativos.
---

# Actualiza Estado del Proyecto y Pendientes

Esta skill proporciona un procedimiento estandarizado para auditar, consolidar y reportar el estado de cualquier proyecto activo y sus pendientes inmediatos.

## Cuándo Usar Esta Skill
- Cuando el usuario use el slash command `/actualiza-estado`.
- Cuando el usuario solicite "actualiza el estado actual del proyecto y sus pendientes", "cómo va el proyecto", "qué queda pendiente", o "resumen de estado".
- Al inicio o cierre de una fase de trabajo para sincronizar la visibilidad del equipo.

## Procedimiento de Ejecución (Paso a Paso)

### 1. Auditoría del Entorno y Cambios Recientes
1. **Inspección de Git y Código:**
   - Ejecuta `git status --short` y `git log -n 5 --oneline` para conocer los commits y modificaciones recientes.
2. **Revisión de Documentación y Bitácoras:**
   - Si el proyecto cuenta con carpeta `raw/`, `docs/`, `wiki/` o notas diarias, revisa el archivo de notas o estado más reciente.
3. **Comprobación de Sistemas Externos (si aplica):**
   - Para flujos en n8n: consultar ejecuciones recientes (`search_workflow_executions`) o status de despliegues.
   - Para aplicaciones web/backend: verificar el estado del build (`npm run build` / `astro check`) o tests.

### 2. Consolidación de Avances vs. Pendientes
Clasifica los elementos en tres categorías claras:
- **🟢 Completado / En Producción:** Tareas terminadas, validadas y activas.
- **🟡 En Progreso / Requiere Verificación:** Tareas con cambios aplicados que esperan feedback con tráfico real o aprobación del usuario.
- **🔴 Pendientes Críticos / Backlog:** Siguientes pasos accionables en orden de prioridad de negocio.

### 3. Generación del Artefacto de Estado
Crea o actualiza un artefacto markdown titulado `project_status_and_pending.md` en el directorio de la sesión con la siguiente estructura:
1. **Resumen Ejecutivo:** Tabla comparativa con Área, Tarea, Estado y Resultado Clave.
2. **Detalle Técnico de Implementaciones Recientes:** Explicación precisa de qué cambió y por qué.
3. **Diagrama de Flujo / Estado (Mermaid):** Visualización del estado actual y dependencias.
4. **Lista Priorizada de Pendientes:** Próximos pasos inmediatos con impacto y responsables.

### 4. Presentación al Usuario
- Responde de forma concisa, directa y ejecutiva (siguiendo las directivas globales de Antigravity).
- Presenta la tabla de resumen y los puntos pendientes prioritarios sin volcar código redundante.
- Enlaza el artefacto creado para que el usuario pueda consultarlo con un solo clic.
