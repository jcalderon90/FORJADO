// Generador de piezas de marca FORJADO (logo claro, favicon, firma, banners, plantillas de redes).
// Uso: node piezas.mjs <carpeta-marca>   (requiere opentype.js, sharp y @fontsource/{archivo-black,space-grotesk})
import opentype from 'opentype.js';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2];
const ORANGE = '#E85D04', CARBON = '#111111', SURFACE = '#222222', WHITE = '#F5F5F5', GRAY = '#999999', PAPER = '#FFFFFF';
const out = (...p) => { const f = path.join(ROOT, ...p); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; };

const font = (pkg, file) => { const b = fs.readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const ARCHIVO = font('archivo-black', 'archivo-black-latin-400-normal.woff');
const SG700 = font('space-grotesk', 'space-grotesk-latin-700-normal.woff');
const SG500 = font('space-grotesk', 'space-grotesk-latin-500-normal.woff');

// toPathData de opentype.js emite NaN con ciertos valores: serializo los comandos a mano
const num = (v) => String(+v.toFixed(2));
const pd = (p) => p.commands.map((c) => c.type === 'Z' ? 'Z' : c.type === 'C' ? `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}` : c.type === 'Q' ? `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}` : `${c.type}${num(c.x)} ${num(c.y)}`).join('');
// ---------- Texto como trazos (cada letra en el origen + translate: toPathData emite NaN con x grandes) ----------
const dCache = new Map();
const glyphD = (f, ch, size) => { const k = `${f.names.fullName?.en}|${ch}|${size}`; if (!dCache.has(k)) dCache.set(k, pd(f.charToGlyph(ch).getPath(0, 0, size))); return dCache.get(k); };
function measure(f, str, size, track) {
  let w = 0; const gl = [];
  for (let i = 0; i < str.length; i++) {
    const g = f.charToGlyph(str[i]); const next = str[i + 1] ? f.charToGlyph(str[i + 1]) : null;
    gl.push({ ch: str[i], x: w });
    w += g.advanceWidth * size / f.unitsPerEm + (next ? f.getKerningValue(g, next) * size / f.unitsPerEm : 0) + (next ? track * size : 0);
  }
  return { gl, w };
}
function textBlock(f, text, size, { track = 0, maxW = Infinity, lineH = 1.15 } = {}) {
  const lines = [];
  for (const para of text.split('\n')) {
    let cur = '';
    for (const w of para.split(' ')) {
      const t = cur ? cur + ' ' + w : w;
      if (cur && measure(f, t, size, track).w > maxW) { lines.push(cur); cur = w; } else cur = t;
    }
    if (cur) lines.push(cur);
  }
  return { f, size, track, lineH, lines: lines.map((l) => ({ str: l, ...measure(f, l, size, track) })) };
}
const blockH = (b) => (b.lines.length - 1) * b.size * b.lineH;
function textSvg(b, x, y, fill, { align = 'left', cw = 0 } = {}) {
  return b.lines.map((l, i) => {
    const ox = align === 'center' ? x + (cw - l.w) / 2 : x;
    const oy = y + i * b.size * b.lineH;
    return `<g transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)})" fill="${fill}">` +
      l.gl.filter((g) => g.ch !== ' ').map((g) => `<path transform="translate(${g.x.toFixed(2)} 0)" d="${glyphD(b.f, g.ch, b.size)}"/>`).join('') + '</g>';
  }).join('');
}

// ---------- Marca ----------
const SW = 428, SH = 467;
const SHARDS = ['M100 0 H428 V100 H0 Z', 'M0 130 H112 V380 L0 467 Z', 'M160 206 H400 L296 316 H160 Z'];
const SHARDS_MINI = ['M96 0 H428 V118 H0 Z', 'M0 166 H134 V388 L0 467 Z', 'M184 238 H412 L304 348 H184 Z'];
const shardsSvg = (fill, set = SHARDS) => set.map((d) => `<path d="${d}" fill="${fill}"/>`).join('');

// Wordmark: Archivo Black ensanchado 112 %, tracking 0.012em
const WM_FS = 330, STRETCH = 1.12, WM_TRACK = 0.012;
const wm = (() => {
  let x = 0; const parts = [];
  const t = 'FORJADO';
  for (let i = 0; i < t.length; i++) {
    const g = ARCHIVO.charToGlyph(t[i]);
    parts.push({ x, d: pd(g.getPath(0, 0, WM_FS)) });
    x += g.advanceWidth * WM_FS / ARCHIVO.unitsPerEm * STRETCH + (i < t.length - 1 ? WM_TRACK * WM_FS : 0);
  }
  return { parts, w: x, cap: ARCHIVO.tables.os2.sCapHeight * WM_FS / ARCHIVO.unitsPerEm };
})();
const wordmark = (fill, tx, ty, s) => `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})" fill="${fill}">` +
  wm.parts.map((p) => `<path transform="translate(${p.x.toFixed(2)} 0) scale(${STRETCH} 1)" d="${p.d}"/>`).join('') + '</g>';

// Logo horizontal sin márgenes: ancho w, alto SH
const H_CAP = SH * 0.40, H_S = H_CAP / wm.cap, H_GAP = 120;
const LOGO_H = { w: SW + H_GAP + wm.w * H_S, h: SH,
  body: (sym, txt) => shardsSvg(sym) + wordmark(txt, SW + H_GAP, SH / 2 + H_CAP / 2, H_S) };
// Logo vertical sin márgenes
const V_GAP = 100;
const LOGO_V = { w: Math.max(wm.w, SW), h: SH + V_GAP + wm.cap,
  body: (sym, txt) => `<g transform="translate(${(Math.max(wm.w, SW) - SW) / 2} 0)">${shardsSvg(sym)}</g>` + wordmark(txt, (Math.max(wm.w, SW) - wm.w) / 2, SH + V_GAP + wm.cap, 1) };

const svgDoc = (w, h, body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(w)} ${Math.round(h)}" width="${Math.round(w)}" height="${Math.round(h)}">` +
  (bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : '') + body + '</svg>\n';
const place = (logo, sym, txt, x, y, targetH) => { const k = targetH / logo.h; return `<g transform="translate(${x} ${y}) scale(${k.toFixed(5)})">${logo.body(sym, txt)}</g>`; };
const toPng = async (svgFile, pngFile, width, bg) => { let img = sharp(fs.readFileSync(svgFile), { density: 200 }).resize({ width }); if (bg) img = img.flatten({ background: bg }); await img.png().toFile(pngFile); };

// ============ 1) Logo sobre fondo claro: F naranja + wordmark carbón ============
{
  const PAD = 60;
  fs.writeFileSync(out('logo', 'forjado-logo-vertical-color-claro.svg'), svgDoc(LOGO_V.w + PAD * 2, LOGO_V.h + PAD * 2, `<g transform="translate(${PAD} ${PAD})">${LOGO_V.body(ORANGE, CARBON)}</g>`));
  fs.writeFileSync(out('logo', 'forjado-logo-horizontal-color-claro.svg'), svgDoc(LOGO_H.w + PAD * 2, LOGO_H.h + PAD * 2, `<g transform="translate(${PAD} ${PAD})">${LOGO_H.body(ORANGE, CARBON)}</g>`));
  await toPng(out('logo', 'forjado-logo-horizontal-color-claro.svg'), out('logo', 'forjado-logo-horizontal-color-claro.png'), 1600, PAPER);
}

// ============ 2) Favicon y íconos ============
{
  const icon = (S, set, padRatio, rx) => {
    const k = (S * (1 - padRatio * 2)) / SH;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" rx="${(S * rx).toFixed(2)}" fill="${CARBON}"/>` +
      `<g transform="translate(${((S - SW * k) / 2).toFixed(2)} ${((S - SH * k) / 2).toFixed(2)}) scale(${k.toFixed(5)})">${shardsSvg(ORANGE, set)}</g></svg>`;
  };
  fs.writeFileSync(out('favicon', 'favicon.svg'), icon(64, SHARDS_MINI, 0.14, 0.2));
  const pngs = {};
  for (const S of [16, 32, 48]) {
    pngs[S] = await sharp(Buffer.from(icon(S, SHARDS_MINI, 0.14, 0.2))).png().toBuffer();
    fs.writeFileSync(out('favicon', `favicon-${S}.png`), pngs[S]);
  }
  // Íconos grandes: versión original, sin esquinas redondeadas en apple-touch (iOS las aplica)
  fs.writeFileSync(out('favicon', 'apple-touch-icon-180.png'), await sharp(Buffer.from(icon(180, SHARDS, 0.22, 0)), { density: 144 }).resize(180, 180).png().toBuffer());
  fs.writeFileSync(out('favicon', 'icon-192.png'), await sharp(Buffer.from(icon(192, SHARDS, 0.22, 0.18))).png().toBuffer());
  fs.writeFileSync(out('favicon', 'icon-512.png'), await sharp(Buffer.from(icon(512, SHARDS, 0.22, 0.18))).png().toBuffer());
  // favicon.ico (PNG dentro de ICO) con 16, 32 y 48
  const sizes = [16, 32, 48]; const head = Buffer.alloc(6 + sizes.length * 16);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let off = head.length;
  sizes.forEach((S, i) => { const e = 6 + i * 16; head.writeUInt8(S, e); head.writeUInt8(S, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(pngs[S].length, e + 8); head.writeUInt32LE(off, e + 12); off += pngs[S].length; });
  fs.writeFileSync(out('favicon', 'favicon.ico'), Buffer.concat([head, ...sizes.map((S) => pngs[S])]));
}

// ============ 3) Firma de correo ============
{
  const logoSvg = out('firma-correo', 'firma-logo.svg');
  fs.writeFileSync(logoSvg, svgDoc(LOGO_H.w + 40, LOGO_H.h + 40, `<g transform="translate(20 20)">${LOGO_H.body(ORANGE, CARBON)}</g>`));
  await toPng(logoSvg, out('firma-correo', 'firma-logo.png'), 480);   // se muestra a 240 px (2x)
  fs.unlinkSync(logoSvg);
  fs.writeFileSync(out('firma-correo', 'firma.html'), `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Firma de correo - FORJADO</title></head>
<body style="margin:24px;background:#ffffff;">
<!--
  FIRMA DE CORREO - FORJADO
  1) Sube firma-logo.png a un sitio publico (tu web, Drive compartido, CDN) y cambia el src de la imagen por esa URL completa.
     Gmail/Outlook no muestran imagenes locales ni data: URIs en firmas.
  2) Reemplaza lo que va entre [corchetes]. Nombre y cargo son una propuesta: confirmalos.
  3) Abre este archivo en el navegador, selecciona la firma, copia y pega en Gmail > Configuracion > Firma.
-->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#111111;border-collapse:collapse;">
  <tr><td style="padding:0 0 12px 0;"><img src="firma-logo.png" width="240" alt="FORJADO" style="display:block;border:0;outline:none;"></td></tr>
  <tr><td style="border-left:3px solid #E85D04;padding:0 0 0 12px;">
    <div style="font-size:15px;line-height:20px;font-weight:bold;color:#111111;">Jorge Calder&oacute;n</div>
    <div style="font-size:13px;line-height:18px;color:#555555;">Fundador &middot; FORJADO</div>
    <div style="font-size:12px;line-height:18px;color:#555555;margin-top:8px;">Soluciones digitales hechas a la medida</div>
    <div style="font-size:12px;line-height:18px;color:#555555;">Automatizaci&oacute;n &middot; Software &middot; Marketing &middot; Consultor&iacute;a</div>
    <div style="font-size:12px;line-height:18px;margin-top:8px;color:#111111;">[tu correo] &nbsp;|&nbsp; [tu tel&eacute;fono] &nbsp;|&nbsp; [tu sitio web]</div>
  </td></tr>
</table>
</body></html>
`);
}

// ============ 4) Banners ============
const TAGLINE = 'Soluciones digitales hechas a la medida.';
{
  // LinkedIn 1584 x 396. La foto de perfil tapa la esquina inferior izquierda: contenido desde x=560.
  const W = 1584, H = 396, X = 560;
  const lh = 112, lw = LOGO_H.w * (lh / LOGO_H.h);
  const t1 = textBlock(SG700, TAGLINE, 40, { maxW: 960 });
  const t2 = textBlock(SG500, 'Automatización · Software · Marketing · Consultoría', 24, { maxW: 960 });
  const body = place(LOGO_H, ORANGE, WHITE, X, 70, lh) +
    `<rect x="${X}" y="226" width="64" height="4" fill="${ORANGE}"/>` +
    textSvg(t1, X, 282, WHITE) + textSvg(t2, X, 326, GRAY);
  if (X + lw > W - 60) throw new Error('logo LinkedIn no cabe: ' + (X + lw));
  fs.writeFileSync(out('banners', 'linkedin-1584x396.svg'), svgDoc(W, H, body, CARBON));
  await toPng(out('banners', 'linkedin-1584x396.svg'), out('banners', 'linkedin-1584x396.png'), 1584);
}
{
  // Portada web 1920 x 1080: F gigante en gris superficie, sangrando por la derecha
  const W = 1920, H = 1080, X = 160;
  const kF = 940 / SH;
  const eyebrow = textBlock(SG700, 'FORJADO', 28, { track: 0.28 });
  const h1 = textBlock(SG700, TAGLINE.replace('.', ''), 118, { maxW: 1020, lineH: 1.04 });
  const sub = textBlock(SG500, 'Automatización, software, marketing y estrategia. Calidad de oficio. Trato directo.', 34, { maxW: 880, lineH: 1.35 });
  const h1y = 430, suby = h1y + blockH(h1) + 110;
  const body = `<g transform="translate(${W - SW * kF + 190} 70) scale(${kF.toFixed(5)})">${shardsSvg(SURFACE)}</g>` +
    textSvg(eyebrow, X, 290, ORANGE) + `<rect x="${X}" y="318" width="64" height="4" fill="${ORANGE}"/>` +
    textSvg(h1, X, h1y, WHITE) + textSvg(sub, X, suby, GRAY);
  fs.writeFileSync(out('banners', 'portada-web-1920x1080.svg'), svgDoc(W, H, body, CARBON));
  await toPng(out('banners', 'portada-web-1920x1080.svg'), out('banners', 'portada-web-1920x1080.png'), 1920);
}

// ============ 5) Plantillas de redes ============
{
  // Post cuadrado 1080
  const W = 1080, H = 1080, P = 90;
  const h = textBlock(SG700, 'Forjado a\ntu medida.', 150, { maxW: 900, lineH: 1.02 });
  const s = textBlock(SG500, 'Calidad de oficio. Trato directo.', 40);
  const body = place(LOGO_H, ORANGE, WHITE, P, P, 70) +
    textSvg(h, P, 470, WHITE) +
    `<rect x="${P}" y="${H - 220}" width="64" height="6" fill="${ORANGE}"/>` + textSvg(s, P, H - 140, GRAY);
  fs.writeFileSync(out('plantillas-redes', 'post-1080x1080.svg'), svgDoc(W, H, body, CARBON));
  await toPng(out('plantillas-redes', 'post-1080x1080.svg'), out('plantillas-redes', 'post-1080x1080.png'), 1080);
}
{
  // Story 1080 x 1920 (zonas seguras: 250 px arriba, 340 abajo)
  const W = 1080, H = 1920, P = 90;
  const h = textBlock(SG700, 'Forjado a\ntu medida.', 160, { maxW: 900, lineH: 1.02 });
  const s = textBlock(SG500, 'Calidad de oficio. Trato directo.', 44);
  const hy = 860;
  const body = place(LOGO_H, ORANGE, WHITE, P, 260, 80) +
    textSvg(h, P, hy, WHITE) +
    `<rect x="${P}" y="${H - 420}" width="72" height="6" fill="${ORANGE}"/>` + textSvg(s, P, H - 340, GRAY);
  fs.writeFileSync(out('plantillas-redes', 'story-1080x1920.svg'), svgDoc(W, H, body, CARBON));
  await toPng(out('plantillas-redes', 'story-1080x1920.svg'), out('plantillas-redes', 'story-1080x1920.png'), 1080);
}
{
  // Imagen para compartir enlaces (Open Graph) 1200 x 630
  const W = 1200, H = 630, P = 80;
  const kF = 560 / SH;
  const h = textBlock(SG700, 'Soluciones digitales\nhechas a la medida', 68, { maxW: 1000, lineH: 1.08 });
  const s = textBlock(SG500, 'Calidad de oficio. Trato directo.', 30);
  const body = `<g transform="translate(${W - SW * kF + 110} 40) scale(${kF.toFixed(5)})">${shardsSvg(SURFACE)}</g>` +
    place(LOGO_H, ORANGE, WHITE, P, P, 84) + textSvg(h, P, 330, WHITE) +
    `<rect x="${P}" y="${H - 130}" width="64" height="5" fill="${ORANGE}"/>` + textSvg(s, P, H - 70, GRAY);
  fs.writeFileSync(out('plantillas-redes', 'og-1200x630.svg'), svgDoc(W, H, body, CARBON));
  await toPng(out('plantillas-redes', 'og-1200x630.svg'), out('plantillas-redes', 'og-1200x630.png'), 1200);
}
console.log('piezas ok');
