---
tags: [carwarriors, inventario, dealercenter, cleverwave, fotos, fondos-virtuales, sop, raw]
tipo: bitacora-raw
fecha: 2026-11-02
cliente: Carwarriors LLC
origen: Bianca Cangialosi
---

# Registro Raw — Estandarización de Fotos de Inventario y Actualización de Videos (2026-11-02)

## 1. Actualización sobre Videos y Cuestionarios

- **Videos descartados (por ahora):** Los videos que se habían solicitado descargar pertenecen a un curso de pago cuya plataforma no permite la descarga directa de los archivos. Se descarta la tarea de descarga y doblaje de dichos videos.
- **Cuestionarios pendientes:** Bianca enviará posteriormente una serie de cuestionarios para ser incorporados al sistema.

---

## 2. Requerimiento Principal: Estandarización de Fotos de Vehículos

### Objetivo
Unificar la identidad visual de todo el inventario de **Carwarriors LLC** en **DealerCenter** que se encuentre en estado **"listo venta"** y cuente con fotografías cargadas, reemplazando los fondos originales por el escenario virtual oficial **"Car Warriors - Graffiti Garage"** a través de la plataforma interna (`carwarriors-dev.cleverwave.ai`).

### Plataformas y Accesos Involucrados
| Entorno | URL | Función |
|---|---|---|
| **DealerCenter** | `app.dealercenter.net` | Origen de inventario, consulta de estado y descarga de fotografías originales |
| **Car Warriors Studio (Cleverwave)** | `carwarriors-dev.cleverwave.ai` | Editor fotográfico / Estudio de ventas con IA para reemplazo de fondos |

---

## 3. SOP Paso a Paso: Flujo Operativo

### Fase A: Obtención de Fotografías en DealerCenter
1. Ingresar a **DealerCenter** (`app.dealercenter.net`) con credenciales de la agencia.
2. En el menú lateral izquierdo, seleccionar **Inventory** (Inventario).
3. Filtrar e identificar los vehículos en estado **"listo venta"** que cuenten con fotos ya subidas.
4. Hacer clic sobre el vehículo para abrir su ficha técnica detallada (ejemplo de referencia: *2019 Alfa Romeo Stelvio Ti Sport*).
5. Dirigirse a la pestaña superior **Media**.
6. Descargar el lote de fotografías utilizando el botón **Download**.

### Fase B: Procesamiento en Car Warriors Studio (`carwarriors-dev.cleverwave.ai`)
1. Iniciar sesión en el panel de **Car Warriors** (`carwarriors-dev.cleverwave.ai`).
2. En la barra de navegación superior, hacer clic en **Estudio de ventas**.
3. En la esquina superior izquierda, cambiar de la pestaña *Videos* a la pestaña **Fotos**.
4. En la sección **Inicio** (dentro de *Añadir fotos*), hacer clic en el botón blanco **Subir archivos** (formatos permitidos: PNG, JPG, JPEG, WEBP, HEIC, HEIF hasta 50 MB por archivo) y cargar las fotos descargadas de DealerCenter.
5. Ingresar a la subpestaña **Fondos** (`.../seller-studio/photos/backgrounds`).
6. Dentro de la galería de fondos oficiales, seleccionar el primer fondo de la izquierda: **"Car Warriors - Graffiti Garage"** (escenario oscuro estilo garaje moderno, luces LED de techo y logotipo corporativo de *Car Warriors* en el muro de fondo).
7. Procesar y guardar el lote de imágenes estandarizadas para su posterior actualización en DealerCenter.

---

## 4. Próximos Pasos y Factibilidad de Automatización
1. **Acceso a `carwarriors-dev.cleverwave.ai`:** Validar si las credenciales de Orlando (`orlandomma86@gmail.com` / `Realmadrid7`) o una cuenta propia de Jorge/Bianca tienen rol de administrador/editor en este dominio.
2. **Evaluación de Automatización:** Determinar si Cleverwave expone una API REST interna para carga de imágenes y aplicación de plantillas de fondo, o si el proceso se abordará inicialmente vía automatización de navegador (Puppeteer/Playwright/DevTools) o ejecución manual por lotes.
3. **Re-ingesta a DealerCenter:** Coordinar si las fotos procesadas se suben manualmente a la pestaña Media de DealerCenter o mediante el feed/SFTP si existe soporte de sync de assets.
