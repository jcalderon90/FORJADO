---
tags: [forjado, cliente, carwarriors, meta-api, graph-api, n8n, manychat, guia, bianca]
tipo: raw
cliente: Carwarriors LLC
fecha: 2026-10-26
---

# 2026-10-26 — Guía de Creación de Meta App para Bianca y Workflow n8n de Comentarios

**Contexto:** En la auditoría del 2026-09-28 se detectó que el flujo de comentarios de Instagram en ManyChat clasifica respuestas al azar debido a que la variable enviada a n8n es `{{last_input_text}}` (ManyChat no expone el texto del comentario). Además, la página de Facebook de Carwarriors está ligada a otra cuenta de ManyChat de booxter y no recibe ningún flujo. La solución definitiva acordada es conectar los Webhooks de Meta directamente a n8n mediante una Meta App propia de la empresa creada por Bianca Cangialosi.

---

## 1. Acción Inmediata de Contención en ManyChat (Para Jorge)

Para evitar que los prospectos que comentan en Instagram sigan recibiendo DMs aleatorios en inglés o fuera de contexto mientras se configura la Meta App:

1. Entrar a ManyChat (`app.manychat.com/fb4391897/`) → **Automatización** → Carpeta **FORJADO**.
2. Abrir el flujo **Respuesta Comentarios**.
3. **Opción A (Recomendada):** En el nodo posterior al Trigger (o en la bifurcación de la Condición `es_interes_real`), desconectar la línea que va hacia el bloque de mensaje de Instagram (`respuesta_dm`). Dejar únicamente la respuesta pública fija.
4. **Opción B:** Si se prefiere detener completamente el flujo automático hasta migrar, desactivar el switch del disparador *"El usuario comenta en cualquier publicación o reel"*.
5. Hacer clic en **Publicar** (*Publish*) arriba a la derecha.

---

## 2. Mensaje Listo para Enviar a Bianca (Copiar y Pegar)

```markdown
Hola Bianca, ¿cómo estás?

Te escribo porque estamos optimizando la atención automática de los comentarios en las publicaciones de Instagram y Facebook de Carwarriors. Para que el sistema pueda leer el comentario exacto de cada cliente y responderle al instante tanto de forma pública como por mensaje privado (DM), Meta exige crear una aplicación interna dentro de su panel de desarrolladores vinculada al negocio.

Es un proceso de unos 5-10 minutos. ¿Nos podrías apoyar creándola siguiendo estos pasos?

---

### Paso 1: Ingresar a Meta for Developers
1. Ve a [developers.facebook.com](https://developers.facebook.com) con la cuenta de Facebook que administra la Página y la cuenta comercial de Carwarriors.
2. Si es tu primera vez, haz clic en **Comenzar** o **Registrarse** (arriba a la derecha) y confirma tu cuenta.

### Paso 2: Crear la Aplicación
1. Haz clic en **Mis apps** (arriba a la derecha) → **Crear app**.
2. Selecciona el tipo de app: **Otro** (u *Otro tipo de caso de uso*) → clic en **Siguiente**.
3. Selecciona el tipo: **Negocio** (*Business*) → clic en **Siguiente**.
4. Completa los detalles:
   - **Nombre de la app:** `Carwarriors Comentarios`
   - **Correo de contacto:** Tu correo de Carwarriors.
   - **Cuenta comercial:** Selecciona el Meta Business Portfolio / Cuenta comercial de Carwarriors LLC.
5. Haz clic en **Crear app**.

### Paso 3: Agregar los Casos de Uso / Permisos
En el panel lateral izquierdo de la app:
1. Ve a **Casos de uso** (o *Productos*) y añade:
   - **Instagram Graph API** (o *Administrar mensajes y contenido en Instagram*).
   - **Webhooks**.
   - **Facebook Login for Business** (o *Messenger*).
2. Los permisos que debe tener la app para la página de Carwarriors son:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_engagement`
   - `pages_manage_metadata`
   - `pages_messaging`
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_messages`

### Paso 4: Obtener las Credenciales
Necesitamos tres datos para conectar el servidor:
1. **Identificador de la app (App ID):** Lo ves arriba del panel principal.
2. **Clave secreta de la app (App Secret):** Ve a **Configuración de la app** → **Básica** → Haz clic en *Mostrar* junto a "Clave secreta de la app".
3. **Token de acceso a la página (Page Access Token):**
   - Ve a **Herramientas** (arriba) → **Explorador de la Graph API** ([developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)).
   - Selecciona la app `Carwarriors Comentarios`.
   - En *Usuario o página*, selecciona la **Página de Carwarriors LLC**.
   - En *Permisos*, añade los permisos listados arriba.
   - Haz clic en **Generate Access Token** y copia el token generado.

### Paso 5: Envío Seguro
Para proteger las credenciales, por favor no las envíes en texto plano por WhatsApp. Puedes pegarlas en [privnote.com](https://privnote.com) (o [1timesecret.com](https://1timesecret.com)) y compartirnos solo el enlace que se autodestruye:
- App ID: ...
- App Secret: ...
- Page Access Token: ...

Cualquier duda en cualquiera de los pasos, avísame y lo vemos en un momento. ¡Muchas gracias por el apoyo!
```

---

## 3. Workflow de n8n Preparado

Se diseñó y exportó el workflow completo en:
`raw/clientes/carwarriors-llc/n8n-workflows/Meta Graph API/META-COMENTARIOS-GRAPH-API.json`

### Características de la arquitectura:
1. **Doble Handshake Meta:** Un único Webhook (`/meta-webhook-comentarios`) maneja tanto el handshake de verificación `GET` (`hub.challenge` con HTTP 200 inmediato) como la recepción de eventos `POST`.
2. **Respuesta inmediata asíncrona:** Al recibir el `POST`, n8n responde `200 OK` en <100ms a Meta para evitar retries o penalizaciones por timeout.
3. **Extracción unificada IG & FB:** Un nodo Code detecta si el evento viene de Instagram (`field: comments`) o Facebook (`field: feed`), extrayendo de forma limpia el texto real, autor e ID.
4. **Clasificador IA de Interés Real:** Reutiliza el Information Extractor con DeepSeek v4.1 Flash vía OpenRouter, detectando intención genuina de compra, idioma y vehículo mencionado.
5. **Respuestas Automáticas:**
   - **Pública:** Publica respuesta directa en el hilo del comentario vía `POST /{comment_id}/replies`.
   - **Privada (DM):** Si hay interés real, envía un mensaje privado directo vía `POST /me/messages` con `recipient.comment_id` respetando la ventana de mensajería de Meta.

---

## 4. Próximos Pasos (Checklist)

- [ ] Jorge aplica la contención en ManyChat (desconectar DM aleatorio).
- [ ] Jorge envía el mensaje de la sección 2 a Bianca.
- [ ] Al recibir las credenciales seguras de Bianca:
  - Importar `META-COMENTARIOS-GRAPH-API.json` en n8n de Carwarriors.
  - Guardar el Page Access Token en las credenciales HTTP Header Auth.
  - Configurar la URL de Webhook en Meta for Developers con el Verify Token.
  - Suscribir los campos `comments` (Instagram) y `feed` (Facebook Page).
  - Pasar la Meta App a modo **Live**.
