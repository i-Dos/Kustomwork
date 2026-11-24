import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bild = (image: any) => z.object({ src: image(), alt: z.string() });
/** Build Log / Technik: bereich + notiz; offen = Frage an Andy, bis er die Details liefert */
const technik = z.array(z.object({ bereich: z.string(), notiz: z.string().optional(), offen: z.string().optional() })).default([]);

/** Projekte: ein Markdown-File pro Bike */
const projekte = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projekte' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      untertitel: z.string().optional(),
      description: z.string().max(180),
      date: z.coerce.date(),
      basis: z.string(),
      stil: z.string(),
      cover: image(),
      coverAlt: z.string(),
      galerie: z.array(bild(image)).default([]),
      datenblatt: z.array(z.object({ label: z.string(), wert: z.string() })).default([]),
      technik,
      stempel: z.string().optional(), // Text für den Stempel auf dem Bauzettel
      quelle: z.string().optional(),
      featured: z.boolean().default(false),
      platzhalter: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/** Blog */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(180),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      autor: z.string().default('Andy Gemperle'),
      cover: image(),
      coverAlt: z.string(),
      tags: z.array(z.string()).default([]),
      faq: z.array(z.object({ frage: z.string(), antwort: z.string() })).default([]),
      projekt: z.string().optional(), // id eines verwandten Projekts
      technik,
      draft: z.boolean().default(false),
    }),
});

/** For Sale: Bikes und Occasionen */
const bikes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bikes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      marke: z.string(),
      modell: z.string(),
      jahrgang: z.number(),
      km: z.string().optional(),
      mfk: z.string().optional(),
      preis: z.number().optional(), // CHF, leer = auf Anfrage
      status: z.enum(['verfügbar', 'reserviert', 'verkauft']),
      highlights: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string(),
      galerie: z.array(bild(image)).default([]),
      order: z.number().default(0),
      platzhalter: z.boolean().default(false),
    }),
});

/** Sixnineteen Lookbook */
const lookbook = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lookbook' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      art: z.string(), // T-Shirt, Hoodie, Cap ...
      farben: z.array(z.string()).default([]),
      groessen: z.string().optional(),
      preis: z.number().optional(),
      bild: image(),
      bildAlt: z.string(),
      order: z.number().default(0),
      platzhalter: z.boolean().default(false),
    }),
});

/** FAQ */
const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({ frage: z.string(), order: z.number().default(0), seiten: z.array(z.string()).default(['start']) }),
});

export const collections = { projekte, blog, bikes, lookbook, faq };
