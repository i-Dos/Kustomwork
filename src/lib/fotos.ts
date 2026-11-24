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
