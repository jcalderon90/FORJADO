# Generador de piezas de marca

Scripts que producen los archivos de `../logo`, `../favicon`, `../firma-correo`, `../banners` y `../plantillas-redes`. No hace falta tocarlos para usar la marca; sirven para regenerar piezas o cambiar textos.

- `final.mjs <carpeta>`: set base del logo (10 SVG + PNG de referencia).
- `piezas.mjs <carpeta-marca>`: logo sobre fondo claro, favicon, firma, banners y plantillas de redes. Los textos de cada pieza (titular, subtitulo) estan dentro del script.

Dependencias: `npm i opentype.js sharp @fontsource/archivo-black @fontsource/space-grotesk`, ejecutar desde una carpeta con `node_modules`.
Los scripts leen las fuentes desde `node_modules/@fontsource/...` y convierten el texto a trazos. Ojo: no usar `toPathData` de opentype.js (emite `NaN` con algunos valores); `piezas.mjs` serializa los trazos a mano.
