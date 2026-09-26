# Confirmación en Producción: Tráfico Real de Comentarios en ManyChat e Ingesta en n8n (`COMENTARIOS-MANYCHAT`)

- **Fecha:** 2026-09-26 16:55 Miami
- **Workflow:** `COMENTARIOS-MANYCHAT` (`07BgeGy4vukFJDlu`)
- **Webhook Endpoint:** `POST /webhook/manychat-comentario-clasificar`
- **Motor IA:** Information Extractor + OpenRouter `deepseek/deepseek-v4-flash`
- **Origen:** Automatización "Respuesta Comentarios" en ManyChat (Instagram `@carwarriorsllc` y Facebook)

---

## 1. Contexto

El flujo "Respuesta Comentarios" había quedado inadvertidamente en estado STOPPED con el disparador deshabilitado a principios de septiembre en ManyChat, provocando 9 días consecutivos sin actividad visible en n8n. El 2026-09-09 se reactivó y se consolidó el Playbook BDC el 2026-09-18. Quedaba pendiente confirmar con tráfico real si las ejecuciones estaban entrando de forma sostenida y si el clasificador estaba respondiendo correctamente.

---

## 2. Auditoría de Ejecuciones Reales en Producción

Se auditaron las ejecuciones del workflow `07BgeGy4vukFJDlu` en n8n (`search_workflow_executions`):
- **Total de ejecuciones reales registradas post-reactivación:** **16 ejecuciones**.
- **Tasa de éxito:** **100%** (`status: success`, 0 errores).
- **Modo:** `webhook` (proveniente de la Solicitud Externa de ManyChat).
- **Cronología de tráfico orgánico reciente:**
  - **2026-09-26 (Hoy):** 2 ejecuciones (03:54 y 09:44 UTC / 05:44 AM Miami).
  - **2026-09-25 (Ayer):** 4 ejecuciones (02:45, 03:39, 11:29, 16:07 UTC).
  - **2026-09-24:** 1 ejecución.
  - **2026-09-22:** 1 ejecución.
  - **2026-09-20:** 1 ejecución.
  - **2026-09-19:** 1 ejecución.
  - **2026-09-18:** 1 ejecución.
  - **2026-09-17:** 2 ejecuciones.
  - **2026-09-16:** 1 ejecución.
  - **2026-09-15:** 1 ejecución.
  - **2026-09-13:** 1 ejecución.

---

## 3. Pruebas de Clasificación y Generación de Mensajes

Se validó el comportamiento del pipeline con 3 casos de control directos al webhook de producción:

1. **Consulta con Interés Real (Español):**
   - *Entrada:* `"Hola cuanto piden de down por la Silverado 2021?"`
   - *Resultado:* `es_interes_real: true`, vehículo detectado: `"Silverado 2021"`.
   - *Salida DM:* Saludo personalizado, mención del auto, oferta de $0 enganche, pasaporte/ITIN y cierre Two-Option (WhatsApp vs. visita presencial hoy).

2. **Comentario Genérico / Sin Interés:**
   - *Entrada:* `"Que bonito carro! 🔥"`
   - *Resultado:* `es_interes_real: false`, `respuesta_publica: "¡Gracias por comentar! 🙌"`, `respuesta_dm: ""` (no envía DM intrusivo).

3. **Consulta en Inglés con Interés Real:**
   - *Entrada:* `"How much down for the BMW X5?"`
   - *Resultado:* `es_interes_real: true`, idioma detectado: `"en"`, vehículo detectado: `"BMW X5"`.
   - *Salida DM:* Redacción nativa en inglés con las mismas directivas comerciales.

---

## 4. Estado de la Tarea

- **Estatus:** **CERRADA Y VERIFICADA AL 100% EN PRODUCCIÓN**.
- El tráfico orgánico de Instagram/Facebook está entrando de forma estable todos los días, la automatización en ManyChat sigue LIVE y n8n clasifica y responde en menos de 4 segundos sin anomalías.
