import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bild = (image: any) => z.object({ src: image(), alt: z.string() });
/** Build Log / Technik: bereich + notiz; offen = Frage an Andy, bis er die Details liefert */
/** Offene Fragen an Andy: ohne Antwort gelbe Box auf der Seite, mit Antwort normaler Text an derselben Stelle */
const ergaenzungen = z.array(z.object({ frage: z.string(), antwort: z.string().optional(), nach: z.string().optional() })).default([]);
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
      ergaenzungen,
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
      ergaenzungen,
      draft: z.boolean().default(false),
    }),
});

/**
 * For Sale: ein Markdown-File pro Bike = feste Vorlage (siehe src/content/bikes/_vorlage.md).
 * Dateien mit _ am Anfang werden ignoriert. Flache Felder, damit später ein Editor
 * (z. B. Sveltia/Decap CMS) die Einträge ohne Umbau pflegen kann.
 */
const bikes = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/bikes' }),
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
      kommission: z.boolean().default(false), // Verkauf in Kommission
      highlights: z.array(z.string()).default([]),
      details: z.array(z.object({ label: z.string(), wert: z.string() })).default([]), // Bauzettel: Motor, Getriebe, Farbe ...
      eingetragen: z.coerce.date().optional(),
      cover: image(),
      coverAlt: z.string(),
      galerie: z.array(bild(image)).default([]),
      ergaenzungen,
      order: z.number().default(0),
      platzhalter: z.boolean().default(false), // Beispiel-Eintrag, erscheint nicht im Schema für Google
      draft: z.boolean().default(false), // true = nicht veröffentlichen
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

/**
 * Seiten-Texte: ein Markdown-File pro Seite (src/content/seiten/<seite>.md), gepflegt über /admin.
 * kopf = Seitenkopf, abschnitte = benannte Textblöcke, listen = wiederholbare Einträge,
 * woerter = einfache Wortlisten. Das Aussehen bestimmen die Vorlagen in src/pages.
 */
const seiten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seiten' }),
  schema: ({ image }) => {
    const abschnitt = z
      .object({
        eyebrow: z.string(), titel: z.string(), script: z.string(), lead: z.string(), text: z.string(),
        bild: image(), bildAlt: z.string(), fokus: z.string(), fokusMobil: z.string(), button: z.string(), buttonLink: z.string(),
      })
      .partial();
    const eintrag = z
      .object({
        id: z.string(), titel: z.string(), jahr: z.string(), kurz: z.string(), text: z.string(),
        punkte: z.array(z.string()), bild: image(), bildAlt: z.string(), fokus: z.string(), dunkel: z.number(), gross: z.boolean(),
        linkText: z.string(), linkZiel: z.string(), thema: z.string(), serviceType: z.string(),
      })
      .partial();
    return z.object({
      seoTitel: z.string().optional(),
      seoBeschreibung: z.string().optional(),
      kopf: abschnitt.default({}),
      abschnitte: z.record(z.string(), abschnitt).default({}),
      listen: z.record(z.string(), z.array(eintrag)).default({}),
      woerter: z.record(z.string(), z.array(z.string())).default({}),
      ergaenzungen,
    });
  },
});

export const collections = { projekte, blog, bikes, lookbook, faq, seiten };
