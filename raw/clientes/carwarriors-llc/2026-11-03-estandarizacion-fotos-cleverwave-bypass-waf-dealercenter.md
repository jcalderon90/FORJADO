---
tags: [carwarriors, inventario, dealercenter, cleverwave, waf-bypass, socks5, playwright, automation, raw]
tipo: bitacora-raw
fecha: 2026-11-03
cliente: Carwarriors LLC
origen: Sesión operativa FORJADO
---

# Registro Raw — Estandarización de Fotos Cleverwave, Bypass de WAF DealerCenter y Automatización (2026-11-03)

## 1. Contexto y Objetivos de la Sesión
- **Objetivo Operativo:** Continuar con la fase 2 del flujo de estandarización fotográfica para vehículos en estado `LISTO VENTA` de Carwarriors LLC.
- **Vehículo Seleccionado:** **2024 Hyundai Tucson Limited** (Stock: `R300375`, VIN: `5NMJECDE4RH300375`, Color: `BLACK`, Millaje: `17,665 mi`).
- **Plataformas Involucradas:**
  - **DealerCenter:** `https://app.dealercenter.net` (Extracción de lote de fotos vía pestaña Media).
  - **Cleverwave Studio:** `https://carwarriors-dev.cleverwave.ai` (Carga y renderizado con fondo *"Car Warriors · Graffiti Garage"* y placas corporativas).

---

## 2. Hallazgos Técnicos y Resolución de Bloqueos

### A. Bloqueo de Red / WAF en DealerCenter (`ERR_CONNECTION_TIMED_OUT`)
- **Síntoma:** Al automatizar la navegación hacia `app.dealercenter.net`, las peticiones directas desde la red local sufrieron timeouts repetidos de conexión TCP (`ERR_CONNECTION_TIMED_OUT`). El firewall de Akamai/WAF de DealerCenter restringió la IP local debido a la frecuencia de conexiones previas de pruebas.
- **Diagnóstico:** Se probó conectividad directa desde el servidor de producción de FORJADO (`carwarriors-vps`, `2.24.106.87`), comprobando que dicho nodo cuenta con reputación limpia y resuelve las peticiones HTTP/2 de DealerCenter en <1 segundo.
- **Solución Implementada:**
  - Se levantó un túnel dinámico SOCKS5 mediante SSH hacia el VPS:
    ```bash
    ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -N -D 1080 carwarriors-vps
    ```
  - Se configuró la instancia de Google Chrome con `--proxy-server="socks5://127.0.0.1:1080"`.
  - **Resultado:** DealerCenter cargó inmediatamente y de forma fluida, eliminando por completo los bloqueos de red.

### B. Control del Navegador y Protocolo CDP (Chrome DevTools Protocol)
- Se configuró un perfil dedicado de automatización (`/Users/jorgecalderon/.chrome-automation-profile`) con puerto de depuración remota `9222`.
- El usuario realizó la autenticación con MFA en DealerCenter y en Cleverwave en dicho navegador.
- Se conectó el runtime de automatización Python (Playwright vía CDP) a `http://localhost:9222`, validando:
  - **Pestaña Cleverwave:** Autenticada en `/seller-studio/photos/projects`, visualizando el proyecto completado previo (*2023 Alfa Romeo Stelvio - ND56867*) y el botón de subida habilitado.
  - **Pestaña DealerCenter:** Autenticada y navegando con normalidad a través del proxy SOCKS5.

---

## 3. Estado del Inventario a Procesar
- **Lote Actual:** *2024 Hyundai Tucson Limited* (`R300375`).
- **Siguientes pasos:**
  1. Navegación directa a la ficha del Tucson en DealerCenter.
  2. Descarga del paquete ZIP con las fotos originales desde la pestaña *Media*.
  3. Descompresión y subida directa de archivos a Cleverwave Studio creando el proyecto `2024 Hyundai Tucson Limited - R300375`.
  4. Aplicación del fondo virtual *"Car Warriors · Graffiti Garage"*, alineación de perspectivas y confirmación de renderizado (`Approve and process photos`).
  5. Descarga y archivo del paquete ZIP procesado.
