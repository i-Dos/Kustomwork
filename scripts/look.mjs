/**
 * Foto-Look «Milwaukee Touch»
 * Nimmt alle Bilder aus fotos-original/ und schreibt sie gefiltert nach src/assets/fotos/.
 * Warm, leicht entsättigt, angehobene Schatten. Filmkorn kommt per CSS (.foto::before),
 * optional eingebacken über grainOpacity > 0.
 * Aufruf: npm run fotos   (neue Fotos einfach in fotos-original/ legen)
 * Parameter pro Kunde: src/config/look.json
 */
import sharp from 'sharp';
import { readdir, mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'fotos-original';
const OUT = 'src/assets/fotos';
const look = JSON.parse(await readFile('src/config/look.json', 'utf8'));
const force = process.argv.includes('--force');

await mkdir(OUT, { recursive: true });

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp|heic|tiff?)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const files = await walk(SRC);
let done = 0;
for (const file of files) {
  const rel = path.relative(SRC, file).replace(/\.(png|webp|heic|tiff?)$/i, '.jpg');
  const target = path.join(OUT, rel);
  if (!force) {
    try {
      if ((await stat(target)).mtimeMs > (await stat(file)).mtimeMs) continue;
    } catch {}
  }
  await mkdir(path.dirname(target), { recursive: true });

  const base = sharp(file).rotate().resize({ width: look.maxWidth, withoutEnlargement: true });
  const { width, height } = await base.clone().metadata().then(async () => {
    const b = await base.clone().toBuffer({ resolveWithObject: true });
    return b.info;
  });

  // Farbton: Mischung aus Original und Sepia-Matrix (Wärme), dann Sättigung, Kontrast, matte Schatten
  const w = look.warmth; // 0..1
  const sepia = [
    [0.393, 0.769, 0.189],
    [0.349, 0.686, 0.168],
    [0.272, 0.534, 0.131],
  ];
  const id = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const m = id.map((row, i) => row.map((v, j) => v * (1 - w) + sepia[i][j] * w));
  // leichte Farbverschiebung Richtung Sand/Oliv: Rot und Grün etwas rauf, Blau runter
  const [r, g, b] = look.balance;
  m[0] = m[0].map((v) => v * r);
  m[1] = m[1].map((v) => v * g);
  m[2] = m[2].map((v) => v * b);

  const graded = await base
    .clone()
    .recomb(m)
    .modulate({ saturation: look.saturation, brightness: look.brightness })
    .linear(look.contrast, look.lift) // a*x + b: Kontrast und angehobene Schwarzwerte
    .toBuffer();

  // Filmkorn als halbtransparente Rausch-Ebene
  const grain = await sharp({
    create: { width, height, channels: 3, noise: { type: 'gaussian', mean: 128, sigma: look.grain } },
  })
    .greyscale()
    .ensureAlpha(look.grainOpacity)
    .png()
    .toBuffer();

  // Korn nur einbacken, wenn gewünscht. Standard: Korn per CSS-Overlay (spart viele KB pro Bild)
  await sharp(graded)
    .composite(look.grainOpacity > 0 ? [{ input: grain, blend: 'overlay' }] : [])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(target);
  done++;
}
console.log(`Foto-Look: ${done} von ${files.length} Bildern bearbeitet.`);
