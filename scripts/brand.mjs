/**
 * Erzeugt aus brand/logo.svg (Vektor, Farbe currentColor) alle Logo-Ableitungen:
 * Farbvarianten, App-Icons, Favicon, Schema.org-Logo und das Standard-Teilen-Bild (og-default.jpg).
 * Aufruf: npm run brand (läuft auch bei npm run build)
 * Farben und Hintergrundbild pro Kunde unten anpassen.
 */
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

import { optimize } from 'svgo';

const FARBEN = { sand: '#ebe0ca', braun: '#2e2118' };
const DUNKEL = '#2e2118';
const OG_FOTO = 'src/assets/fotos/jimdo/start.jpg';

const master = await readFile('brand/logo.svg', 'utf8');
const farbig = (c) => Buffer.from(master.replaceAll('currentColor', c));
await mkdir('public/logo', { recursive: true });
await mkdir('public/icons', { recursive: true });

// Web-Versionen mit SVGO verkleinert (halbe Dateigrösse, schnelleres Laden)
for (const [name, c] of Object.entries(FARBEN)) await writeFile(`public/logo/logo-${name}.svg`, optimize(farbig(c).toString(), { multipass: true }).data);
await sharp(farbig(FARBEN.braun)).resize(512).png().toFile('public/logo/logo-512.png');

// Icons: Logo in Sand auf dunklem Grund, mit Rand (maskable braucht mehr Rand)
async function icon(size, rand, file) {
  const inner = Math.round(size * (1 - 2 * rand));
  const logo = await sharp(farbig(FARBEN.sand)).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: DUNKEL } })
    .composite([{ input: logo, gravity: 'center' }]).png().toFile(file);
}
await icon(512, 0.06, 'public/icons/icon-512.png');
await icon(192, 0.06, 'public/icons/icon-192.png');
await icon(512, 0.16, 'public/icons/icon-maskable-512.png');
await icon(180, 0.08, 'public/icons/apple-touch-icon.png');
await icon(48, 0.02, 'public/favicon-48.png');
await icon(32, 0.02, 'public/favicon-32.png');

// Standard-Teilen-Bild 1200x630: Foto, Verlauf, Logo
const verlauf = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#1a120b" stop-opacity=".92"/><stop offset=".55" stop-color="#1a120b" stop-opacity=".55"/><stop offset="1" stop-color="#1a120b" stop-opacity=".1"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
const logo = await sharp(farbig(FARBEN.sand)).resize(470).png().toBuffer();
await sharp(OG_FOTO).resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: verlauf }, { input: logo, left: 60, top: Math.round((630 - 422) / 2) }])
  .jpeg({ quality: 82, mozjpeg: true }).toFile('public/og-default.jpg');

console.log('Logo-Ableitungen erzeugt.');
