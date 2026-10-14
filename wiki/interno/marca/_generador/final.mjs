import opentype from 'opentype.js';
import sharp from 'sharp';
import fs from 'node:fs';

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const ORANGE = '#E85D04', CARBON = '#111111', WHITE = '#F5F5F5', PAPER = '#FFFFFF';

const b = fs.readFileSync('node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff');
const font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));

// Wordmark: Archivo Black ensanchado 1.12, tracking 0.012em. Cada letra en el origen + translate
// (toPathData emite NaN con coordenadas x grandes).
const FS = 330, STRETCH = 1.12, TRACK = 0.012, TEXT = 'FORJADO';
let x = 0; const letters = [];
for (let i = 0; i < TEXT.length; i++) {
  const g = font.charToGlyph(TEXT[i]);
  letters.push({ x, d: g.getPath(0, 0, FS).toPathData(2) });
  x += (g.advanceWidth * FS / font.unitsPerEm) * STRETCH + (i < TEXT.length - 1 ? TRACK * FS : 0);
}
const WM_W = x, WM_CAP = font.tables.os2.sCapHeight * FS / font.unitsPerEm;
const wordmark = (fill, tx, ty, s) =>
  `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})" fill="${fill}">` +
  letters.map((l) => `<path transform="translate(${l.x.toFixed(2)} 0) scale(${STRETCH} 1)" d="${l.d}"/>`).join('') + '</g>';

// Monograma F: tres astillas con chaflán, 428 x 467
const SW = 428, SH = 467;
const SHARDS = ['M100 0 H428 V100 H0 Z', 'M0 130 H112 V380 L0 467 Z', 'M160 206 H400 L296 316 H160 Z'];
const mono = (fill) => SHARDS.map((d) => `<path d="${d}" fill="${fill}"/>`).join('');

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(w)} ${Math.round(h)}" width="${Math.round(w)}" height="${Math.round(h)}">` +
  (bg ? bg : '') + body + '</svg>\n';

const PAD = 60;
const VARS = {
  color: { sym: ORANGE, txt: WHITE },
  mono: { sym: WHITE, txt: WHITE },
  invertido: { sym: CARBON, txt: CARBON },
};

function vertical(v) {
  const gap = 100, W = Math.max(WM_W, SW) + PAD * 2, H = PAD + SH + gap + WM_CAP + PAD;
  return [W, H,
    `<g transform="translate(${(W - SW) / 2} ${PAD})">${mono(v.sym)}</g>` +
    wordmark(v.txt, (W - WM_W) / 2, PAD + SH + gap + WM_CAP, 1)];
}
function horizontal(v) {
  const cap = SH * 0.40, s = cap / WM_CAP, wmw = WM_W * s, gap = 120;
  const W = PAD * 2 + SW + gap + wmw, H = SH + PAD * 2;
  return [W, H,
    `<g transform="translate(${PAD} ${PAD})">${mono(v.sym)}</g>` +
    wordmark(v.txt, PAD + SW + gap, PAD + SH / 2 + cap / 2, s)];
}
function simbolo(v) {
  return [SW + PAD * 2, SH + PAD * 2, `<g transform="translate(${PAD} ${PAD})">${mono(v.sym)}</g>`];
}

for (const [name, v] of Object.entries(VARS)) {
  for (const [kind, fn] of Object.entries({ vertical, horizontal, simbolo })) {
    const [w, h, body] = fn(v);
    fs.writeFileSync(`${OUT}/forjado-logo-${kind}-${name}.svg`, svg(w, h, body));
  }
}

// Avatar circular 800x800: F naranja sobre círculo carbón
{
  const S = 800, k = (S * 0.46) / SH, sw = SW * k, sh = SH * k;
  fs.writeFileSync(`${OUT}/forjado-avatar-circular.svg`, svg(S, S,
    `<circle cx="400" cy="400" r="400" fill="${CARBON}"/>` +
    `<g transform="translate(${(S - sw) / 2} ${(S - sh) / 2}) scale(${k})">${mono(ORANGE)}</g>`));
}

// PNG de referencia (no para producción)
const png = async (file, bg, width) => {
  let img = sharp(fs.readFileSync(`${OUT}/${file}`), { density: 200 }).resize({ width });
  if (bg) img = img.flatten({ background: bg });
  await img.png().toFile(`${OUT}/${file.replace('.svg', '.png')}`);
};
await png('forjado-logo-vertical-color.svg', CARBON, 1600);
await png('forjado-logo-horizontal-color.svg', CARBON, 2000);
await png('forjado-logo-vertical-mono.svg', CARBON, 1600);
await png('forjado-logo-vertical-invertido.svg', PAPER, 1600);
await png('forjado-avatar-circular.svg', null, 800);
console.log('ok');
