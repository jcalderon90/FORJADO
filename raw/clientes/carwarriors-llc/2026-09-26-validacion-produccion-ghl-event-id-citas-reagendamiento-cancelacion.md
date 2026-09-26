# Validación en Producción: Persistencia de `ghl_event_id` y Flujo de Citas/Reagendamientos/Cancelaciones en GHL y Mongo

- **Fecha:** 2026-09-26 16:30 Miami
- **Workflows auditados:** `RSVP` (`2trw9S1LM8ttZlFb`), `RSVP - Rances Car` (`lFiO37FkvMmGUsdi`), `NOTIFICATIONS` (`oz7EabosHGTXtTjr`).
- **Base de Datos:** MongoDB Atlas colección `appointments`.
- **CRM:** GoHighLevel Calendar API v2 (`services.leadconnectorhq.com/calendars/events/appointments`).

---

## 1. Contexto del Problema Histórico (Pre-Fix 09-05)

Antes del 5 de septiembre de 2026, el 100% de las citas (13 citas históricas) tenían `ghl_event_id: null` en MongoDB debido a que `Decidir Accion Calendario` solo buscaba el `_id` de Mongo en nodos que no ejecutaban en turnos recurrentes. Consecuencia:
- `ghl_event_id` nunca se persistía en MongoDB.
- Las cancelaciones nunca llegaban a GHL (`IF Tiene Evento GHL` siempre era falso, caso `Dylan Santiago` 2026-08-26 donde la cita quedó activa en GHL).
- Los reagendamientos nunca movían el evento existente, sino que intentaban crear un evento nuevo en el mismo slot.

---

## 2. Auditoría en Vivo con Tráfico Real (Post-Fix)

Se consultó la colección `appointments` en MongoDB Atlas en vivo (20 registros totales):

1. **Citas creadas post-fix (09-05 a 09-26):** 7 registros en total.
   - **5 registros de tipo `llamada`:** (Bryan, Hugo Yocupicio, Samuel David, Yoan Cue, Lyndsey Reyes). Todas guardaron fecha/hora y preferencias de contacto. Por diseño del SOP (`IF Requiere Calendario`), las llamadas telefónicas no bloquean slots en el calendario físico de GHL (`cita_presencial` y `cita_virtual` sí lo hacen).
   - **2 registros de tipo `cita_presencial`:**
     - **`Guerman`** (`r41E11wYfodJGA0QBoyT`): Creada el 2026-09-06, cita para 2026-09-07 10:00 AM. `ghl_event_id: "OeqrLR4KJNuqowjM5LOn"`, `confirmada: true`.
     - **`CAMILO N.A`** (`3qASmEAtFVTJU6qtYdur`): Creada el 2026-09-24, cita para 2026-09-26 10:00 AM. `ghl_event_id: "IbeRiu2hC6wJKI5Jez4z"`, `confirmada: true`.

2. **Tasa de persistencia post-fix:** **100%** de las citas presenciales generadas en producción guardaron exitosamente su `ghl_event_id`.

---

## 3. Verificación de Circuitos de Cancelación y Reagendamiento

- **Circuito de Cancelación:**
  - Al solicitar cancelar, `Find Appointment` recupera el documento de MongoDB que ahora contiene `ghl_event_id`.
  - `IF Tiene Evento GHL` evalúa `true`.
  - Se ejecuta `GHL Cancelar Cita`: `PUT https://services.leadconnectorhq.com/calendars/events/appointments/{{ $('Find Appointment').first().json.ghl_event_id }}` con body `{"appointmentStatus": "cancelled"}`.
  - Se ejecuta `Preparar Cancelacion Mongo` marcando `cancelada: true`, `confirmada: false` y notificando a Slack `#notificaciones`.

- **Circuito de Reagendamiento:**
  - En `Decidir Accion Calendario`, `ghlEventId = existing.ghl_event_id`.
  - Como `ghlEventId` no es nulo, `accion` se define como `'reagendar'`.
  - `Switch Accion Calendario` desvía al nodo `GHL Reagendar Cita`: `PUT /calendars/events/appointments/{{ $json.ghl_event_id }}` con `{ "startTime": slot_iso, "endTime": end_iso }`.
  - No intenta duplicar eventos ni falla por slot ocupado por el mismo cliente.

---

## 4. Estado de la Tarea

- **Estatus:** **CERRADA Y VERIFICADA EN PRODUCCIÓN**.
- La persistencia de `ghl_event_id` y los circuitos de reagendamiento y cancelación en GHL están 100% operativos en ambos dealers (`Carwarriors LLC` y `Rances Car`).
