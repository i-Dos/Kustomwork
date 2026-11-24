import type { ImageMetadata } from 'astro';

/** Alle gefilterten Fotos aus src/assets/fotos, per Dateiname abrufbar (z. B. 'larry-seite.jpg'). */
const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/fotos/**/*.{jpg,jpeg,png,webp}', { eager: true });

export function foto(name: string): ImageMetadata {
  const hit = all[`/src/assets/fotos/${name}`];
  if (!hit) throw new Error(`Foto nicht gefunden: ${name}`);
  return hit.default;
}

export const formatCHF = (n: number) => `CHF ${n.toLocaleString('de-CH').replace(/,/g, "'")}.–`;
export const datum = (d: Date) => d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' });

/** Teilenummer-Optik für Bauzettel: KW-<Jahr>-<3 Ziffern aus der id>, stabil pro Eintrag */
export function teilenummer(id: string, date?: Date) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `KW-${date ? date.getFullYear() : '0000'}-${String(h % 1000).padStart(3, '0')}`;
}
