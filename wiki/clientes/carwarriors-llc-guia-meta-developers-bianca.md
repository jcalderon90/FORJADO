---
tags: [forjado, carwarriors, meta, facebook-developers, sop, webhook, n8n]
tipo: guia-operativa
destinatario: Bianca Cangialosi
creado: 2026-10-26
estado: pendiente-ejecucion
---

# 📘 Guía Paso a Paso: Configuración de Meta App y Conexión Directa a la IA (Carwarriors)

Esta guía detalla los pasos exactos que debe seguir **Bianca** en la plataforma de Meta para conectar directamente los comentarios de Facebook, Instagram y los mensajes de WhatsApp con nuestro motor de IA en n8n.

> [!NOTE] ¿Por qué hacemos esto?
> Actualmente herramientas como ManyChat recortan o limitan el texto real de los comentarios de los clientes antes de enviarlo al bot. Conectando la App oficial de Meta directamente a nuestro servidor:
> 1. La IA leerá el comentario 100% íntegro de inmediato.
> 2. No dependemos de límites de suscripciones de terceros ($0 coste recurrente).
> 3. Las citas y respuestas quedan garantizadas en segundos.

---

## 📋 Resumen de lo que necesitamos al finalizar
Al completar estos pasos, Bianca solo debe copiar y enviarnos estos 4 datos:
1. **Identificador de la App (App ID)**
2. **Clave secreta de la App (App Secret)**
3. **Token de Acceso Permanente (System User Token)**
4. **Phone Number ID** (del WhatsApp Business de Carwarriors)

---

## PASO 1: Ingreso a Meta for Developers
1. Inicia sesión en tu cuenta de Facebook (la que tiene rol de Administrador en el Business Portfolio de Carwarriors).
2. Entra a: **[https://developers.facebook.com/](https://developers.facebook.com/)**
3. Si es tu primera vez, haz clic en **"Empezar" / "Get Started"** arriba a la derecha para habilitar tu perfil de desarrollador (solo te pedirá verificar tu teléfono/correo).
4. Haz clic en **"Mis apps" / "My Apps"** (arriba a la derecha).

---

## PASO 2: Crear la App de Negocio
1. Haz clic en el botón verde **"Crear app" / "Create App"**.
2. ¿Qué quieres que haga tu app?:
   - Selecciona **"Otro" / "Other"** y haz clic en *Siguiente*.
3. Selecciona tipo de app:
   - Elige **"Negocio" / "Business"** y haz clic en *Siguiente*.
4. Detalles básicos:
   - **Nombre de la app:** Ponle `Carwarriors AI Engine` (o `Carwarriors Bot`).
   - **Correo de contacto de la app:** Tu correo de trabajo de Carwarriors.
   - **Cuenta de Business Manager comercial:** Despliega y **selecciona obligatoriamente el Business Portfolio de Carwarriors LLC** (¡muy importante para que tenga acceso a la página y al WhatsApp oficial!).
5. Haz clic en **"Crear app" / "Create app"** e introduce la contraseña de Facebook si te la solicita.

---

## PASO 3: Agregar los Productos a la App
Una vez creada la app, estarás en el Panel de Control. En la sección "Agregar productos a tu app":

### A. Producto WhatsApp:
1. Busca la tarjeta **WhatsApp** y haz clic en **"Configurar" / "Set up"**.
2. Te pedirá vincular el Meta Business Account. Asegúrate de que quede seleccionado el de Carwarriors.
3. En el menú lateral izquierdo bajo *WhatsApp*, haz clic en **"Configuración de la API" / "API Setup"**.
4. Ahí verás:
   - **Identificador de número de teléfono (Phone number ID)** ➔ *Cópialo para enviárnoslo*.
   - **Identificador de cuenta de WhatsApp Business (WABA ID)**.

### B. Producto Webhooks:
1. En el menú lateral izquierdo, haz clic en **"Agregar producto" / "Add product"** (o en el panel principal).
2. Busca la tarjeta **Webhooks** y haz clic en **"Configurar" / "Set up"**.

---

## PASO 4: Crear el Token Permanente (System User)
> [!IMPORTANT]
> Los tokens de prueba normales expiran a las 24 horas o 60 días. Para que el bot funcione de forma continua sin caídas, debemos generar un **Token Permanente de Usuario del Sistema**.

1. Abre en otra pestaña la Configuración del Negocio de Meta:  
   👉 **[https://business.facebook.com/settings/](https://business.facebook.com/settings/)**
2. Asegúrate de estar dentro del negocio **Carwarriors LLC**.
3. En el menú lateral izquierdo, ve a **Usuarios ➔ Usuarios del sistema** (*Users ➔ System users*).
4. Haz clic en **"Agregar" / "Add"**:
   - Nombre: `Carwarriors Bot System`
   - Rol: **Administrador**
   - Haz clic en *Crear usuario del sistema*.
5. Con el nuevo usuario seleccionado, haz clic en **"Asignar activos" / "Assign Assets"**:
   - **Páginas:** Selecciona la Página de Facebook de Carwarriors y activa **Control total (Administrar página)**.
   - **Cuentas de WhatsApp:** Selecciona la cuenta de WhatsApp de Carwarriors y activa **Control total**.
   - Haz clic en *Guardar cambios*.
6. Ahora haz clic en el botón **"Generar nuevo token" / "Generate new token"**:
   - **App de Meta:** Elige la app que creaste en el Paso 2 (`Carwarriors AI Engine`).
   - **Caducidad del token:** Selecciona **Nunca / Never**.
   - **Permisos obligatorios a marcar (activa estas casillas):**
     - [x] `pages_read_engagement`
     - [x] `pages_manage_posts`
     - [x] `pages_manage_metadata`
     - [x] `pages_read_user_content`
     - [x] `leads_retrieval`
     - [x] `whatsapp_business_messaging`
     - [x] `whatsapp_business_management`
7. Haz clic en **"Generar token"**.
8. **Copia el token inmediatamente y guárdalo en un bloc de notas seguro.** (Meta no lo volverá a mostrar por seguridad).

---

## PASO 5: Obtener Credenciales de la App
1. Vuelve a **[developers.facebook.com](https://developers.facebook.com/)** en tu app `Carwarriors AI Engine`.
2. En el menú lateral izquierdo, ve a **Configuración de la app ➔ Básica** (*App settings ➔ Basic*).
3. Ahí verás:
   - **Identificador de la app (App ID):** Cópialo.
   - **Clave secreta de la app (App Secret):** Haz clic en "Mostrar", pon tu contraseña y cópiala.

---

## PASO 6: Datos a enviar al equipo técnico (Jorge / FORJADO)

Por favor, copia esta plantilla completada y envíala a Jorge por Slack o chat interno seguro:

```text
=== DATOS CONEXIÓN META CARWARRIORS ===
App ID: 
App Secret: 
Phone Number ID (WhatsApp): 
Token Permanente: EAA...
======================================
```

Con estos datos, nosotros nos encargamos de programar la URL del Webhook en n8n y activar el bot para que responda automáticamente a cada lead en tiempo real.

---

## Ver también
- [[carwarriors-llc-ecosistema-completo|Ecosistema Tecnológico Completo — Carwarriors LLC & Rances Car]]
- [[carwarriors-llc|Ficha de cliente: Carwarriors LLC]]
