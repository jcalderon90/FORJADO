# 2026-09-18 — Implementación de Clasificación de Clientes Potenciales (Lead Scoring) y Respuestas BDC en Comentarios de Instagram

## Contexto y Necesidad del Negocio
Jorge identificó dos pendientes críticos para cerrar el ciclo comercial de Carwarriors y Rances Car:
1. **Clasificación de Clientes Potenciales:** Diferenciar de inmediato qué leads están listos para comprar frente a los que solo están curioseando, para que los vendedores en GoHighLevel puedan priorizar su tiempo y llamar primero a los más calientes.
2. **Atención de Comentarios en Instagram:** Superar los textos genéricos estáticos ("Contanos qué auto te interesa") para que el bot responda de forma personalizada con IA mencionando el auto por el que preguntaron y aplicando el Playbook BDC.

---

## 1. Clasificación de Clientes Potenciales (Lead Scoring / Tiering)

### Matriz de Calificación Automática

| Tier | Clasificación | Tag en GHL | Criterio de Negocio | Acción del Sistema |
| :---: | :---: | :---: | :--- | :--- |
| **Tier 1** | **CALIENTE** | `lead-caliente` | Tiene teléfono confirmado **Y** (vehículo específico de interés **O** timing inmediato **O** cita presencial). | Sincroniza tag `lead-caliente` en GHL + Actualiza Mongo (`clasificacion: "CALIENTE"`) + Dispara alerta prioritaria en Slack `#notificaciones`. |
| **Tier 2** | **TIBIO** | `lead-tibio` | Mostró interés en un modelo o financiamiento ($0 down/pasaporte), pero **aún no tiene teléfono** o timing futuro. | Sincroniza tag `lead-tibio` en GHL + Actualiza Mongo (`clasificacion: "TIBIO"`). El bot sigue empujando el gancho de valor para extraer el número. |
| **Tier 3** | **FRIO** | `lead-frio` | Respuestas vagas, curioseando, sin modelo ni teléfono. | Sincroniza tag `lead-frio` en GHL y Mongo. Si se queda en silencio, entra a la cadencia de re-enganche de 24h. |

### Cambios Técnicos en `PRINCIPAL` y `PRINCIPAL - Rances Car`
1. **Nodo `Parse response`:**
   - Extrae `telefono`, `interes_vehiculo`, `metodo_pago`, `timing_compra` y estado de cita.
   - Computa `clasificacion` (`CALIENTE`, `TIBIO`, `FRIO`) y `tag_ghl` (`lead-caliente`, `lead-tibio`, `lead-frio`).
   - Define `datos_completos = (clasificacion === 'CALIENTE')`, asegurando que `'Notifications Master' Nuevos Leads` se dispare con datos reales de contacto.
2. **Nodo `Hay Cambios?`:**
   - Agregada verificación de `$json.telefono` y `$json.clasificacion` para evitar que actualizaciones de solo teléfono pasen desapercibidas.
3. **Nodo `Prepare Update`:**
   - Agregados assignments para `telefono`, `clasificacion` y `tag_ghl`.
4. **Nuevo Nodo `GHL Tag Lead`:**
   - Emite `POST https://services.leadconnectorhq.com/contacts/{contactId}/tags` con el token dinámico de la subcuenta y `onError: continueRegularOutput`.
   - Conectado en paralelo a `Update User Lead`.

---

## 2. Respuestas Dinámicas en Comentarios de Instagram (`COMENTARIOS-MANYCHAT`)

### Arquitectura de Respuesta BDC
1. **Extracción Enriquecida con IA (`Clasificar Interés Real`):**
   - Extrae `es_interes_real` (booleano).
   - Extrae `idioma` (`es` / `en`).
   - Extrae `vehiculo_mencionado` (marca, modelo o segmento consultado en el comentario).
2. **Respuesta Pública en el Post de Instagram:**
   - Español: *"¡Gracias por tu interés! 🚗 Te escribimos por mensaje privado con toda la información."*
   - Inglés: *"Thanks for your interest! 🚗 We just sent you a private message with all the details."*
3. **Mensaje Privado Directo (DM) con Playbook BDC:**
   - Saluda por su nombre de pila de Instagram (`contact_nombre`).
   - Menciona el vehículo específico consultado.
   - Aplica gancho de $0 de inicial y aprobación con pasaporte/ITIN.
   - Cierra con técnica de dos opciones (WhatsApp para fotos/cuotas o visita al lote hoy).

---

## Versiones Publicadas en Producción

* **`PRINCIPAL` (Carwarriors):** `df4ed57a-9466-498f-8383-c8eddaa8a641`
* **`PRINCIPAL - Rances Car`:** `3f6578d4-d476-40f3-af99-d1b60d7ed5d6`
* **`COMENTARIOS-MANYCHAT`:** `67669030-739d-48a4-9e25-7fe34d2aea74`
