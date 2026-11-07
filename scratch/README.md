# Scratchpad & Pruebas Operativas (`scratch/`)

Espacio de trabajo local para scripts experimentales, pruebas de concepto, automatización temporal y fixtures de prueba.

> [!NOTE]
> El contenido ejecutable y los archivos multimedia en esta carpeta son temporales y están excluidos del control de versiones principal vía `.gitignore` para no sobrecargar el repositorio con artefactos efímeros o datos de prueba. Este archivo `README.md` se conserva en el repositorio como referencia estructural.

---

## Contenido y Flujos de Trabajo

### 1. Pruebas de Inyección y Scraping (Carwarriors / DealerCenter)
Scripts de prueba para automatizar la interacción y carga de inventario/fotos en portales automotrices (DealerCenter / Carwarriors):
- `build_cw_inject.js`: Compilador del script de inyección para el portal Carwarriors.
- `build_dc_inject.js`: Compilador del script de inyección para el portal DealerCenter.
- `build_injection.js`: Ensamblador de scripts de inyección en consola/browser.
- `cw_inject_current.js`: Versión activa del payload de inyección para Carwarriors.
- `inject_upload.js`: Inyector para pruebas de subida y procesamiento de imágenes.
- `run_test_dc.js`: Ejecutor de pruebas automatizadas contra DealerCenter.
- `serve_photos.js`: Servidor HTTP local provisional para suministrar imágenes al navegador durante pruebas automatizadas.
- `test_dispatch.js`: Validación de eventos DOM disparados programáticamente.
- `test_single.js` / `test_single_inject.js`: Pruebas atómicas de carga de una sola unidad de inventario.
- `single_code.txt` / `single_photo_b64.txt`: Fragmentos y payloads de prueba (código y codificación Base64).

### 2. Conjuntos de Datos y Fixtures de Prueba
- `alfa-romeo-stelvio-ND56867/`: Lote de imágenes de prueba (unidad Alfa Romeo Stelvio) utilizado para validar la carga masiva y posicionamiento de fotos en el inventario.

---

## Políticas de Mantenimiento
- **Descartabilidad:** Los archivos en esta carpeta pueden modificarse o depurarse tras consolidar funcionalidades en las aplicaciones productivas (`aplicaciones/carwarriors` o `aplicaciones/call-a-car-web`).
- **Secretos:** Nunca almacenar credenciales de producción ni tokens sensibles en archivos de scratchpad.
