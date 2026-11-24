/**
 * KUNDENKONFIGURATION
 * -------------------------------------------------------------
 * Alles Kundenspezifische steht hier (plus Inhalte in src/content,
 * Fotos in fotos-original/ und der Foto-Look in src/config/look.json).
 * Für einen neuen Kunden: diese Dateien ersetzen, Layout und
 * Komponenten bleiben unverändert.
 *
 * Kontakt, Öffnungszeiten und Profile stehen in firma.json und werden
 * über /admin (Redaktions-Tool, «Firma & Kontakt») gepflegt.
 *
 * [OFFEN] markiert Angaben, die noch bestätigt werden müssen.
 */

import firma from './firma.json';

/** Telefon für tel:-Links: nur Ziffern und + */
const telHref = (t: string) => t.replace(/[^\d+]/g, '');

export const site = {
  // --- Marke -------------------------------------------------
  name: "Gemperle's KustomWork",
  shortName: 'KustomWork',
  owner: 'Andy Gemperle',
  claim: 'Kustom aus Meilen',
  tagline: 'Harley-Davidson Kustom-Umbauten am Zürichsee',
  description:
    "Gemperle's KustomWork in Meilen baut Harley-Davidson-Motorräder nach Mass um: Chopper, Bobber und Kustom-Bikes der alten Schule, von Flathead bis Twin Cam. Dazu Occasionen und das eigene Label Sixnineteen.",
  url: 'https://kustomwork.ch',
  previewUrl: 'https://kustomwork.ds-709.workers.dev', // Cloudflare-Vorschau bis zum Livegang
  lang: 'de-CH',
  ogLocale: 'de_CH',
  foundingYear: '2018', // laut Logo «Est. 2018»

  // --- Kontakt -----------------------------------------------
  email: firma.email,
  phone: firma.telefon,
  phoneHref: telHref(firma.telefon),
  address: { street: firma.adresse.strasse, zip: firma.adresse.plz, city: firma.adresse.ort, region: 'ZH', country: 'CH' },
  geo: { lat: 47.2668, lng: 8.6461 }, // [OFFEN] Koordinaten in Google Maps prüfen
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gemperle%27s+KustomWork+Seestrasse+619+8706+Meilen',
  parking: firma.parkplatz,
  openingHours: firma.oeffnungszeiten.map((o) => ({ label: o.label, days: o.tage, opens: o.von, closes: o.bis })),
  openingNote: firma.oeffnungsHinweis,
  areaServed: ['Meilen', 'Zürichsee', 'Kanton Zürich', 'Schweiz'],

  // --- Positionierung (Schema.org, llms.txt) -----------------
  businessType: ['AutoRepair', 'MotorcycleDealer'],
  knowsAbout: [
    'Harley-Davidson', 'Kustom Bikes', 'Chopper', 'Bobber', 'Old School Chopper',
    'Flathead', 'Knucklehead', 'Panhead', 'Shovelhead', 'Ironhead', 'Sportster', 'Evolution', 'Twin Cam',
    'Starrrahmen', 'Springergabel', 'Suicide-Kupplung', 'Magnetzündung',
    'Triumph und Norton (Klassiker bis 1970)', 'MFK-Abnahme Schweiz', 'Indian Larry',
  ],
  focus:
    'Kustom-Umbauten und Neuaufbauten auf Harley-Davidson-Basis, vom Flathead der 1940er bis zum Twin Cam. Viele Teile werden selbst gedreht, gefräst und geschweisst. Dazu Occasionen in Kommission und Bekleidung.',

  // --- Profile (sameAs) --------------------------------------
  social: { instagram: firma.instagram, facebook: firma.facebook, googleBusiness: firma.googleBusiness },
  footerText: firma.fussText,

  partners: [
    // logo = einfarbige Version in public/partner (Original in brand/partner-original)
    { name: 'Motorcycle Storehouse', url: 'https://www.motorcyclestorehouse.com/', logo: '/partner/motorcycle-storehouse.png', w: 634, h: 120 },
    { name: 'Iron & Resin', url: 'https://ironandresin.com/', logo: '/partner/iron-and-resin.png', w: 324, h: 120 },
    { name: 'The Rokker Company', url: 'https://www.therokkercompany.com/', logo: '/partner/rokker.png', w: 243, h: 120 },
    { name: 'W&W Cycles', url: 'https://www.wwag.com/de/shop', logo: '/partner/wwag.png', w: 180, h: 120 },
  ],

  // --- Navigation --------------------------------------------
  nav: [
    { label: 'Projekte', href: '/projekte/' },
    { label: 'Leistungen', href: '/dienstleistungen/' },
    { label: 'Andy', href: '/andy/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'For Sale', href: '/for-sale/' },
    { label: 'Bekleidung', href: '/bekleidung/' },
    { label: 'Kontakt', href: '/kontakt/' },
  ],

  // --- Anfrageformular ---------------------------------------
  form: {
    action: '/anfrage.php', // PHP-Skript auf Infomaniak, erzeugt aus src/pages/anfrage.php.ts
    to: 'gemperles@kustomwork.ch',
    from: 'website@kustomwork.ch', // muss eine Adresse der eigenen Domain sein
    subject: 'Anfrage über kustomwork.ch',
    thanksPath: '/kontakt/danke/',
    topics: firma.formularThemen,
  },

  // --- Messung (optional, cookiefrei) ------------------------
  analytics: { plausibleDomain: '' },

  // --- Rechtliches -------------------------------------------
  legal: {
    impressumPath: '/impressum/',
    datenschutzPath: '/datenschutz/',
    responsible: 'Andy Gemperle',
    uid: firma.uid, // [OFFEN] UID, falls im Handelsregister eingetragen (firma.json)
  },

  logo: { hell: '/logo/logo-sand.svg', dunkel: '/logo/logo-braun.svg', ratio: 2142 / 1923 },

  photoCredit: 'Fotos: Andy und Fabienne Gemperle',
} as const;

/** Vorschau: PREVIEW=true beim Build => noindex überall, robots.txt sperrt alles */
export const isPreview = import.meta.env.PREVIEW === 'true';

export type Site = typeof site;
