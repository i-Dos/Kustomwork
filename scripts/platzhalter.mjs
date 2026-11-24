/** Erzeugt Platzhalterbilder (Foto folgt) in fotos-original/platzhalter/. Nur für den Entwurf. */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const dir = 'fotos-original/platzhalter';
await mkdir(dir, { recursive: true });
const items = [
  ['59-racer', '59 Racer', 'Projekt'],
  ['akoni-panhead', 'Akoni Panhead', 'Projekt'],
  ['softail-slim-s', 'Softail Slim S', 'Projekt'],
  ['triumph-t120', 'Triumph T120 Bonneville', 'For Sale'],
  ['xl1200v', 'Sportster XL1200V Seventy-Two', 'For Sale'],
  ['fl-panhead', 'FL Panhead 1948', 'For Sale'],
  ['wla', 'WLA Flathead 1942', 'For Sale'],
  ['shirt', 'Sixnineteen T-Shirt', 'Lookbook'],
  ['hoodie', 'Sixnineteen Hoodie', 'Lookbook'],
  ['cap', 'Sixnineteen Cap', 'Lookbook'],
  ['patch', 'Sixnineteen Patch', 'Lookbook'],
  ['werkstatt', 'Werkstatt Meilen', 'Werkstatt'],
];
for (const [file, title, kind] of items) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <defs><radialGradient id="g" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#6b5640"/><stop offset="1" stop-color="#2a2119"/></radialGradient></defs>
  <rect width="1600" height="1200" fill="url(#g)"/>
  <g fill="none" stroke="#c9b48f" stroke-opacity=".35" stroke-width="10">
    <circle cx="470" cy="760" r="190"/><circle cx="1130" cy="760" r="190"/>
    <path d="M470 760 L700 560 L980 560 L1130 760 M700 560 L640 460 M980 560 L1060 380 L1120 360"/>
  </g>
  <text x="800" y="230" text-anchor="middle" font-family="DejaVu Sans Condensed, sans-serif" font-size="44" letter-spacing="12" fill="#c9b48f">${kind.toUpperCase()} · FOTO FOLGT</text>
  <text x="800" y="1080" text-anchor="middle" font-family="DejaVu Sans Condensed, sans-serif" font-weight="bold" font-size="76" fill="#efe6d4">${title}</text>
</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(`${dir}/${file}.jpg`);
}
console.log('Platzhalter erzeugt:', items.length);
