---
tags: [forjado, cliente, callacar, arquitectura, web, frontend]
tipo: raw
cliente: CallaCar Transportation Pty Ltd
fecha: 2026-09-15
---

# 2026-09-15 — Análisis inicial de insumos, alcance y arquitectura para CALLACAR Web

## Contexto de la sesión
Arranque del proyecto de presencia web de CALLACAR (CallaCar Transportation Pty Ltd, ABN 45 680 814 779) en el repositorio `aplicaciones/call-a-car-web`. El objetivo de la sesión fue analizar los insumos recibidos en la carpeta `raw/` del proyecto para determinar la arquitectura, stack tecnológico idóneo y alcance de implementación.

## Insumos analizados

### 1. Paquete de entrega del diseñador (`CALLACAR-homepage-designer-package (1)`)
- **Archivos entregados:**
  - `index.html`: Estructura semántica completa para la página de inicio.
  - `assets/styles.css`: Sistema de diseño responsivo basado en CSS moderno.
  - `assets/site.js`: Interacción ligera para el menú de navegación móvil.
  - `assets/callacar-adelaide-hero.png`: Fotografía principal en alta resolución (Adelaide, Australia).
  - `assets/callacar-logo.png`: Logotipo oficial suministrado por el cliente.
  - `assets/callacar-app-home.jpeg`: Captura de pantalla oficial de la aplicación móvil de CALLACAR.
  - `HANDOVER.md`: Guía de implementación del diseñador.
- **Identidad visual:**
  - Inspirada en la app oficial: Navy profundo (`#020b1f`), Azul CALLACAR (`#0876bd`), degradados Cyan (`#27d7eb`) y blanco.
  - Tipografía recomendada: Inter / sans-serif del sistema.
- **Rutas y enlaces oficiales detectados:**
  - App Store (iOS): `https://apps.apple.com/au/app/callacar-anything-anywhere/id6754860146`
  - Google Play (Android): `https://play.google.com/store/apps/details?id=com.adna88.CaCapp`
  - Botones de acción (`Post a transport job` y `Become a CALLACAR driver`) apuntan provisionalmente a `https://www.callacar.au`.

### 2. Documentación legal (`Callacar_Terms_v5_FULLY_INTEGRATED.docx`)
- Contrato legal integral para CALLACAR TRANSPORTATION PTY LTD (ABN 45 680 814 779).
- Modela la plataforma como un marketplace de transporte peer-to-peer en Australia que conecta:
  - **Service Seekers (Clientes):** Publican fletes de muebles, electrodomésticos, compras de Marketplace y mudanzas.
  - **Service Providers (Conductores):** Contratistas independientes con vehículos adecuados (utes, furgonetas, trailers, camiones) que cotizan directamente y retienen el 100% de su tarifa (0% comisión de conductor).
- Exige la existencia de páginas accesibles de Términos y Condiciones y Política de Privacidad en la web.

## Hallazgos arquitecturales y caminos de conversión
1. **Prioridad número uno de conversión:** Publicación de solicitud de flete por parte de clientes.
2. **Prioridad secundaria:** Captación de conductores con vehículo propio bajo la propuesta de valor de 0% de comisión.
3. **Descarga de aplicaciones nativas:** Sección dedicada con enlaces directos a App Store y Google Play para gestión desde el móvil.

## Pendientes y preguntas abiertas
- [ ] Definir con el usuario si el alcance inmediato es una Landing Page estática/SSG de máxima velocidad de conversión o una Aplicación Web transaccional con autenticación y gestión de trabajos en el navegador.
- [ ] Seleccionar el stack tecnológico final acorde a dicha definición.
- [ ] Incorporar las páginas legales (Terms & Conditions, Privacy Policy) derivadas del documento legal.
