/**
 * KUNDENKONFIGURATION
 * -------------------------------------------------------------
 * Alles Kundenspezifische steht hier (plus Inhalte in src/content,
 * Fotos in fotos-original/ und der Foto-Look in src/config/look.json).
 * Für einen neuen Kunden: diese Dateien ersetzen, Layout und
 * Komponenten bleiben unverändert.
 *
 * [OFFEN] markiert Angaben, die noch bestätigt werden müssen.
 */

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
  lang: 'de-CH',
  ogLocale: 'de_CH',
  foundingYear: '2018', // laut Logo «Est. 2018»

  // --- Kontakt -----------------------------------------------
  email: 'gemperles@kustomwork.ch',
  phone: '+41 77 523 14 54',
  phoneHref: '+41775231454',
  address: { street: 'Seestrasse 619', zip: '8706', city: 'Meilen', region: 'ZH', country: 'CH' },
  geo: { lat: 47.2668, lng: 8.6461 }, // [OFFEN] Koordinaten in Google Maps prüfen
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gemperle%27s+KustomWork+Seestrasse+619+8706+Meilen',
  parking: 'Parkplätze direkt vor der Werkstatt.',
  openingHours: [
    { label: 'Dienstag bis Freitag', days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '18:00' },
    { label: 'Samstag', days: ['Saturday'], opens: '10:00', closes: '15:00' },
  ],
  openingNote: 'Montag geschlossen. Oder jederzeit nach Vereinbarung.',
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
  social: {
    instagram: 'https://www.instagram.com/gemperles_kustomwork/',
    facebook: '', // [OFFEN] Link zur Facebook-Seite
    googleBusiness: '', // [OFFEN] Link zum Google-Unternehmensprofil nach Übernahme
  },

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

  // --- Hero: Zufallsbild pro Besuch (Dateien in src/assets/fotos) ---
  // dunkel = zusätzliche Abdunklung 0 bis 0.5 für helle Bilder, damit der Text lesbar bleibt
  hero: [
    { src: 'larry-seite.jpg', alt: 'Indian-Larry-Tribute-Bike auf Panhead-Basis am Zürichsee', focus: '50% 60%', dunkel: 0.1 },
    { src: 'andy-fahrt.jpg', alt: 'Andy Gemperle fährt seinen Panhead-Chopper', focus: '60% 40%', dunkel: 0.1 },
    { src: 'larry-heck.jpg', alt: 'Heckansicht des Panhead-Choppers mit Sissybar und Weisswandreifen', focus: '50% 55%', dunkel: 0.2 },
    { src: 'jimdo/start.jpg', alt: 'Kustom-Bike mit Flammenlackierung in der Werkstatt', focus: '50% 50%' },
    { src: 'jimdo/59-racer-1.jpg', alt: '59 Racer vor Backsteinwand', focus: '50% 65%', dunkel: 0.3 },
    { src: 'jimdo/akoni-1.jpg', alt: 'Akoni Panhead mit Sunburst-Tank', focus: '50% 65%', dunkel: 0.35 },
  ],

  // --- Anfrageformular ---------------------------------------
  form: {
    action: '/anfrage.php', // PHP-Skript auf Infomaniak, erzeugt aus src/pages/anfrage.php.ts
    to: 'gemperles@kustomwork.ch',
    from: 'website@kustomwork.ch', // muss eine Adresse der eigenen Domain sein
    subject: 'Anfrage über kustomwork.ch',
    thanksPath: '/kontakt/danke/',
    topics: ['Kustom-Umbau', 'Neuaufbau / Restauration', 'Motor- / Getrieberevision', 'Tuning', 'Service / Reparatur / MFK', 'For Sale / Occasion', 'Sixnineteen / Bekleidung', 'Etwas anderes'],
  },

  // --- Messung (optional, cookiefrei) ------------------------
  analytics: { plausibleDomain: '' },

  // --- Rechtliches -------------------------------------------
  legal: {
    impressumPath: '/impressum/',
    datenschutzPath: '/datenschutz/',
    responsible: 'Andy Gemperle',
    uid: '', // [OFFEN] UID, falls im Handelsregister eingetragen
  },

  logo: { hell: '/logo/logo-sand.svg', dunkel: '/logo/logo-braun.svg', ratio: 2142 / 1923 },

  photoCredit: 'Fotos: Andy und Fabienne Gemperle',
} as const;

/** Vorschau: PREVIEW=true beim Build => noindex überall, robots.txt sperrt alles */
export const isPreview = import.meta.env.PREVIEW === 'true';

export type Site = typeof site;
