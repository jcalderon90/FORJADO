---
tags: [tecnologia, video-ia, imagen-ancla, google-flow, veo, consistencia-visual, automatizacion]
tipo: tecnologia
estado: activo
fecha: 2026-11-15
fuente: Pau Rodríguez (Análisis de Flujos Autónomos con Claude y Google Flow)
---

# Metodología de la "Imagen Ancla" y Automatización de Video IA

## 1. Contexto y Problema

Uno de los principales cuellos de botella en la producción de contenido audiovisual con Inteligencia Artificial generativa es la **inconsistencia visual** (*character morphing*, mutación de productos y degradación de texturas entre planos consecutivos). Cuando se envía un prompt de video directo (*Text-to-Video* o T2V), cada generación interpreta el sujeto desde cero, destruyendo la continuidad narrativa y comercial.

Esta metodología resuelve el problema mediante la técnica de la **"Imagen Ancla"** (Anchor Image / Reference Invariant), complementada con flujos de trabajo autónomos para herramientas como **Google Flow** (interfaz experimental de Google Labs sobre Google Veo) y motores nativos como nuestro [`content/engine`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine).

---

## 2. Los Tres Pilares de la Metodología

```
[ Fase 1: Anclaje Visual ]
  Generar 1 imagen estática (T2I) del personaje/producto aislado.
  -> Coste: 0 créditos / mínimo.
            │
            ▼
[ Fase 2: Bloqueo de Referencia ]
  Fijar la imagen ancla como referencia invariable de identidad/estilo.
            │
            ▼
[ Fase 3: Generación Secuencial ]
  Prompts de video describiendo SOLO la acción o contexto.
  -> Manteniendo fisonomía, vestimenta y texturas del Ancla.
```

1. **Fase 1 — Definición del Ancla (Cero o bajo coste):**
   - Se redacta un prompt descriptivo exhaustivo enfocado exclusivamente en el sujeto (fondos neutros, iluminación uniforme, plano completo o medio).
   - Se genera una imagen estática única.
2. **Fase 2 — Fijación de la Referencia:**
   - La imagen ancla se inyecta como condicionamiento multimodal (`sequence_reference`, `anchor_image` o condicionamiento *Image-to-Video*).
3. **Fase 3 — Prompts de Acción Cinemáticos:**
   - En las escenas subsiguientes, el prompt ya no describe la ropa ni los rasgos del sujeto; describe únicamente la interacción, ángulo de cámara y entorno.

---

## 3. Implementación en FORJADO

### A. Integración en `content/engine` (Motor Propio)

La infraestructura de `content/engine` se actualizó para soportar de forma nativa la metodología de Imagen Ancla:

- **Modelos (`prompt_base/models.py`):**
  - [`VideoScript`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine/flows/image_content_generator/pipeline/prompt_base/models.py) incorpora `anchor_prompt: Optional[str]`, permitiendo definir el sujeto o producto invariante en la concepción del guion.
  - [`ImageTask`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine/tools/image_generation/midjourney.py) admite `sequence_reference` individual o compartida.
- **Generación Visual (`tools/image_generation/gemini.py`):**
  - [`GeminiImageGenerator.generate_images`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine/tools/image_generation/gemini.py) recibe `anchor_image: Optional[Path]`, inyectando la imagen ancla con directivas explícitas de preservación de identidad física y texturas.
- **Pipeline Orquestador (`pipeline/pipeline.py`):**
  - [`step2_generate_images`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine/flows/image_content_generator/pipeline/pipeline.py) evalúa la presencia de `anchor_prompt`, genera el activo estático en `ideas/{id}/anchor/anchor_subject.png` (si no existe) y lo condiciona sobre todas las escenas del lote.
- **Video Nativo Veo 3.1 (`tools/video_generation/gemini.py`):**
  - [`GeminiVideoGenerator`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine/tools/video_generation/gemini.py) soporta `img_start_path` (Image-to-Video) e interpolación con `last_frame`.

### B. Módulo de Automatización de Google Flow (`tools/google_flow`)

Para aprovechar la cuota gratuita diaria de **50 puntos de Google Labs** (Google Flow / Google Veo) sin incurrir en costes de API:

- **Ubicación:** [`tools/google_flow/flow_bot.py`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine/tools/google_flow/flow_bot.py)
- **Capacidades:**
  - Control de navegador Selenium compatible con perfiles de Chrome autenticados (`--user-data-dir`) o sesiones con depuración remota (`--remote-debugging-port`).
  - Carga automática de la Imagen Ancla como referencia de personaje.
  - Control estricto de presupuesto de créditos (evita lanzar clips de 10 puntos si el balance es insuficiente).
  - **Manejo de errores resiliente (Self-Healing):** Detecta banners de fallo del servidor de Google (*"Generation failed. Please try again"*) y reintenta la petición automáticamente.
- **Script CLI:** [`scripts/run_google_flow.py`](file:///E:/1TRABAJO/PROGRAMMING/Proyectos/FORJADO/content/engine/scripts/run_google_flow.py)
  ```bash
  python scripts/run_google_flow.py --prompt "Robot delivering flowers under rain" --anchor path/to/anchor.png --video
  ```

---

## 4. Aplicaciones Directas para Clientes de FORJADO

1. **Vitrina (E-commerce / Mipymes):**
   - **Spot Comercial de Producto:** Fotografía del producto del comercio (ancla) -> generación de video publicitario contextualizado en movimiento sin alterar el producto real.
2. **Carwarriors LLC (Car Studio):**
   - Aplicación directa de la homografía y consistencia automotriz: mantener el vehículo invariante y cambiar dinámicamente escenarios de fondo (showroom, carretera, ciudad nocturna).
3. **Contenido de Marca Propia (UGC y Shorts):**
   - Avatares consistentes para reels educativos y videos promocionales de Calibre y FORJADO.

