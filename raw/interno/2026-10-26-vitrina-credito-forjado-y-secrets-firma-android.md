---
tags: [forjado, vitrina, marca, android, seguridad, ci]
tipo: sesion
fecha: 2026-10-26
estado: cerrado
---

# Sesión 2026-10-26 — Vitrina: crédito "Creado por FORJADO" con logo oficial y secrets de firma Android

## 1. Contexto
Jorge pidió revisar si Vitrina (`aplicaciones/vitrina/vitrina-frontend`) tenía correcto el branding de "creado por FORJADO". Antes se había propuesto pilotear OmniRoute con la clave `forjado-dev`; Jorge pidió **no hacerlo por ahora** y no se tocó nada de eso.

## 2. Hallazgos de la revisión
- El crédito existía solo como texto: pie común (`SiteFooter.astro`) con la palabra FORJADO en Archivo Black color `#1b2748`, sin monograma F ni wordmark ensanchado; `<meta name="author">`; términos y privacidad ("servicio de FORJADO"); paquete Android `cu.forjado.vitrina`.
- Redacción incoherente: pie "Creado por" vs. catálogo imprimible "desarrollada por", este último en `text-stone-400` (poco contraste).
- Vitrina tiene identidad propia: turquesa `#0e6b78`, fondo crema `#faf9f6`, favicon/íconos/manifest propios, cuerpo en fuente del sistema (ahorro de datos en Cuba). Ningún archivo de `wiki/interno/marca/` se usaba.
- Seguridad: `.github/workflows/android-release.yml` traía la contraseña de keystore `vitrina_forjado_2026` como valor por defecto en el repo y, sin secrets, generaba una llave nueva en cada release (la APK saldría firmada distinta cada vez → los usuarios no podrían actualizar).

## 3. Decisión (Jorge, "si dale")
Vitrina **mantiene identidad propia** y FORJADO figura como autor/endorser. Anotado en [[../../wiki/interno/marca/identidad-visual|identidad-visual]] (cierra el "por decidir" del 10-14).

## 4. Cambios aplicados (repo `vitrina-frontend`, commit `f807c99`, pusheado a `main`)
- Pie común: "Creado por" + logo horizontal oficial variante fondo claro (`public/forjado-logo-horizontal.svg`, copia de `wiki/interno/marca/logo/forjado-logo-horizontal-color-claro.svg`), enlazado a `https://forjadoland.netlify.app`.
- Catálogo imprimible: "Vitrina digital creada por FORJADO", `text-stone-600`.
- `android-release.yml`: eliminada la contraseña por defecto (4 ocurrencias) y la rama que generaba keystore nuevo; ahora el paso falla con error claro si faltan `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD` o `ANDROID_KEY_PASSWORD`.
- Verificado: `eslint` de los archivos tocados sin avisos, `npm run build` OK, y en el servidor de desarrollo el pie renderiza el `<img>` y el logo responde 200 (no se revisó visualmente en navegador). `package.json` sigue en Astro `^7.3.5`.
- Repo `desarrollo`: commit `821c523` (nota en `identidad-visual.md`), pusheado.

## 5. Pendientes que quedan
- Configurar en GitHub (`vitrina-frontend`) los 3 secrets de firma Android; sin ellos el próximo release de la APK falla a propósito.
- Si el `public/vitrina.apk` actual se firmó con la contraseña que estaba en el repo, esa clave quedó expuesta en el historial de git: valorar generar una llave nueva y guardarla solo como secret (implica nuevo `assetlinks.json` y que los instalados no podrán actualizar sobre la llave vieja).
- Verificar visualmente el pie en navegador/móvil.
