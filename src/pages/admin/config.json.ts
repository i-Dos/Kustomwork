/**
 * Konfiguration für das Redaktions-Tool (Sveltia CMS) unter /admin.
 * Hier ist festgelegt, WAS Andy bearbeiten kann. WIE es aussieht, bestimmen die Vorlagen
 * in src/pages und src/components: Über die Masken lässt sich das Design nicht verändern.
 *
 * Login: GitHub. Der Anmelde-Dienst (OAuth) läuft auf demselben Server unter /oauth/…
 * (Cloudflare-Vorschau: worker/index.js, Infomaniak: oauth/*.php, siehe docs/redaktion.md).
 */
import { site, isPreview } from '../../config/site';

const REPO = 'i-Dos/Kustomwork';
// Basis-URL für den Login. Vorschau: Cloudflare-Adresse, live: kustomwork.ch. Überschreibbar mit CMS_BASIS_URL.
const basis = import.meta.env.CMS_BASIS_URL || (isPreview ? site.previewUrl : site.url);

// Bilder: neue Uploads landen in src/assets/fotos/uploads und bekommen beim Build automatisch den Foto-Look.
// Pfad relativ zur Inhaltsdatei (alle Inhalte liegen eine Ebene unter src/content/).
const bilder = { media_folder: '../../assets/fotos/uploads', public_folder: '../../assets/fotos/uploads' };

type F = Record<string, unknown>;
const opt = (f: F): F => ({ required: false, ...f });
const str = (name: string, label: string, x: F = {}): F => ({ name, label, widget: 'string', ...x });
const txt = (name: string, label: string, x: F = {}): F => ({ name, label, widget: 'text', ...x });
const img = (name: string, label: string, x: F = {}): F => ({ name, label, widget: 'image', accept: 'image/*', ...x });
const bool = (name: string, label: string, x: F = {}): F => ({ name, label, widget: 'boolean', default: false, required: false, ...x });
const num = (name: string, label: string, x: F = {}): F => ({ name, label, widget: 'number', value_type: 'int', ...x });
const body = (label = 'Text'): F => ({ name: 'body', label, widget: 'markdown', required: false, hint: 'Zwischentitel mit «Überschrift 2». Bilder bitte nicht hier einfügen, sondern in den Bildfeldern.' });

const TEXT_HINWEIS = 'Leerzeile = neuer Absatz. **fett**, *kursiv*, [Linktext](/seite/). Platzhalter: {telefon} {email} {adresse} {zeiten}';
const FOKUS_HINWEIS = 'Welcher Bildteil sichtbar bleibt, z. B. «50% 50%» = Mitte, «50% 20%» = eher oben. Leer = Mitte.';
const ALT_HINWEIS = 'Kurze Beschreibung, was auf dem Bild zu sehen ist (für Google und Sehbehinderte).';

/** Abschnitt einer Seite: nur die Felder, die die Vorlage an dieser Stelle auch zeigt */
const teile: Record<string, F> = {
  eyebrow: opt(str('eyebrow', 'Überzeile (Schreibschrift)')),
  titel: opt(str('titel', 'Titel')),
  script: opt(str('script', 'Titel, Teil in Schreibschrift')),
  lead: opt(txt('lead', 'Einleitung (grösser)', { hint: TEXT_HINWEIS })),
  text: opt(txt('text', 'Text', { hint: TEXT_HINWEIS })),
  bild: opt(img('bild', 'Bild')),
  bildAlt: opt(str('bildAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS })),
  fokus: opt(str('fokus', 'Bildausschnitt', { hint: FOKUS_HINWEIS })),
  button: opt(str('button', 'Button-Text')),
  buttonLink: opt(str('buttonLink', 'Button-Ziel', { hint: 'z. B. /andy/ oder /blog/titel-des-beitrags/' })),
};
const abschnitt = (name: string, label: string, felder: string[], x: F = {}): F => ({
  name, label, widget: 'object', collapsed: true, required: false, fields: felder.map((f) => teile[f]), ...x,
});
const kopf = (felder = ['eyebrow', 'titel', 'lead', 'bild', 'bildAlt', 'fokus']) => abschnitt('kopf', 'Seitenkopf', felder, { collapsed: false });
const seo = [
  opt(str('seoTitel', 'Titel im Browser-Tab und bei Google')),
  opt(txt('seoBeschreibung', 'Beschreibung für Google', { hint: 'Ein bis zwei Sätze, höchstens ca. 160 Zeichen.' })),
];
const seite = (name: string, label: string, fields: F[], x: F = {}): F => ({
  name, label, file: `src/content/seiten/${name}.md`, fields: [...seo, ...fields], ...x,
});
const liste = (name: string, label: string, fields: F[], x: F = {}): F => ({ name, label, widget: 'list', required: false, collapsed: true, fields, ...x });

const leistung = (mitBild: boolean): F[] => [
  str('titel', 'Titel'),
  opt(txt('kurz', 'Kurztext')),
  opt(txt('text', 'Text', { hint: TEXT_HINWEIS })),
  ...(mitBild ? [liste('punkte', 'Stichpunkte', [], { field: str('punkt', 'Punkt'), fields: undefined }), opt(img('bild', 'Bild')), opt(str('bildAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS }))] : []),
  opt(str('linkText', 'Zusatz-Link: Text')),
  opt(str('linkZiel', 'Zusatz-Link: Ziel', { hint: 'z. B. /projekte/' })),
  opt({ name: 'thema', label: 'Thema im Anfrageformular', widget: 'select', options: [...site.form.topics] }),
  opt(str('id', 'Anker (technisch)', { hint: 'Wird aus dem Titel erzeugt, wenn leer. Bestehende nicht ändern, sonst funktionieren Links nicht mehr.' })),
  opt(str('serviceType', 'Art der Leistung für Google (technisch)')),
];

const seiten: F = {
  name: 'seiten',
  label: 'Seiten',
  icon: 'description',
  description: 'Texte und Bilder der einzelnen Seiten.',
  ...bilder,
  editor: { preview: false },
  files: [
    seite('start', 'Startseite', [
      kopf(['eyebrow', 'titel', 'script', 'lead']),
      { name: 'listen', label: 'Listen', widget: 'object', fields: [
        liste('heroBilder', 'Grosse Bilder oben (zufällig pro Besuch)', [
          img('bild', 'Bild'), str('bildAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS }), opt(str('fokus', 'Bildausschnitt', { hint: FOKUS_HINWEIS })),
          opt({ name: 'dunkel', label: 'Abdunkeln', widget: 'number', value_type: 'float', min: 0, max: 0.5, step: 0.05, default: 0.1, hint: '0 = gar nicht, 0.3 = deutlich. Bei hellen Bildern erhöhen, damit der Text lesbar bleibt.' }),
        ], { min: 1 }),
      ] },
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [
        abschnitt('intro', 'Einleitung', ['eyebrow', 'titel', 'lead', 'text', 'button', 'buttonLink']),
        abschnitt('projekte', 'Projekte', ['eyebrow', 'titel', 'button']),
        abschnitt('story', 'Andys Geschichte', ['eyebrow', 'titel', 'script', 'lead', 'text', 'bild', 'bildAlt', 'fokus', 'button', 'buttonLink']),
        abschnitt('forsale', 'For Sale', ['eyebrow', 'titel', 'button']),
        abschnitt('label', 'Sixnineteen', ['eyebrow', 'titel', 'lead', 'button']),
        abschnitt('blog', 'Blog', ['eyebrow', 'titel', 'button']),
        abschnitt('faq', 'Häufige Fragen', ['eyebrow', 'titel', 'text']),
        abschnitt('cta', 'Aufruf unten (Standard für alle Seiten)', ['titel', 'text']),
      ] },
    ], { icon: 'home' }),
    seite('andy', 'Andy (Über mich)', [
      kopf(),
      body('Geschichte'),
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [
        abschnitt('unterschrift', 'Unterschrift', ['text']),
        abschnitt('zeitstrahl', 'Meilensteine: Titel und Bild', ['titel', 'bild', 'bildAlt', 'fokus']),
        abschnitt('cta', 'Aufruf unten', ['titel', 'text']),
      ] },
      { name: 'listen', label: 'Listen', widget: 'object', fields: [
        liste('meilensteine', 'Meilensteine', [opt(str('jahr', 'Jahr')), txt('text', 'Was geschah')], { summary: '{{fields.jahr}}: {{fields.text}}' }),
        liste('werte', 'Drei Grundsätze', [str('titel', 'Titel'), txt('text', 'Text')], { summary: '{{fields.titel}}' }),
      ] },
    ]),
    seite('dienstleistungen', 'Leistungen', [
      kopf(),
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [
        abschnitt('kern', 'Schwerpunkt: Überschrift', ['eyebrow', 'titel', 'script']),
        abschnitt('rund', 'Rund ums Bike: Überschrift', ['eyebrow', 'titel', 'lead']),
        abschnitt('offen', 'Gelber Hinweis (leer = ausgeblendet)', ['text']),
        abschnitt('cta', 'Aufruf unten', ['titel', 'text']),
      ] },
      { name: 'listen', label: 'Leistungen', widget: 'object', fields: [
        liste('kern', 'Schwerpunkt (gross, mit Bild)', leistung(true), { summary: '{{fields.titel}}' }),
        liste('rund', 'Rund ums Bike (kompakt)', leistung(false), { summary: '{{fields.titel}}' }),
      ] },
    ]),
    seite('bekleidung', 'Bekleidung und Teile', [
      kopf(),
      { name: 'woerter', label: 'Marken', widget: 'object', fields: [{ name: 'marken', label: 'Marken im Laden', widget: 'list', field: str('marke', 'Marke') }] },
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [
        abschnitt('marken', 'Marken: Überschrift', ['eyebrow', 'titel', 'script', 'lead']),
        abschnitt('credit', 'Hinweis unter den Fotos', ['text']),
        abschnitt('label', 'Sixnineteen', ['eyebrow', 'titel', 'lead', 'button']),
        abschnitt('cta', 'Aufruf unten', ['titel', 'text']),
      ] },
      { name: 'listen', label: 'Fotos', widget: 'object', fields: [
        liste('bilder', 'Fotos vom Laden', [img('bild', 'Bild'), str('bildAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS }), bool('gross', 'Breit anzeigen')], { summary: '{{fields.bildAlt}}' }),
      ] },
    ]),
    seite('sixnineteen', 'Sixnineteen', [
      kopf(['eyebrow', 'titel', 'lead']),
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [
        abschnitt('offen', 'Gelber Hinweis (leer = ausgeblendet)', ['text']),
        abschnitt('lookbook', 'Lookbook: Überschrift', ['eyebrow', 'titel']),
        abschnitt('anfrage', 'Anfrage', ['lead', 'button']),
        abschnitt('ausserdem', 'Ausserdem in der Werkstatt', ['titel', 'text'], { hint: 'Platzhalter {marken} = Markenliste von der Seite Bekleidung' }),
      ] },
    ]),
    seite('for-sale', 'For Sale (Seitentexte)', [
      kopf(['eyebrow', 'titel', 'lead']),
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [
        abschnitt('verkauft', 'Bereits verkauft: Überschrift', ['eyebrow', 'titel']),
        abschnitt('anbieten', 'Bike anbieten', ['titel', 'lead', 'button']),
      ] },
    ]),
    seite('projekte', 'Projekte (Seitentexte)', [
      kopf(),
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [
        abschnitt('galerie', 'Galerie: Überschrift', ['eyebrow', 'titel']),
        abschnitt('faq', 'Fragen: Überschrift', ['eyebrow', 'titel']),
        abschnitt('cta', 'Aufruf unter jedem Projekt', ['titel', 'text']),
      ] },
    ]),
    seite('blog', 'Blog (Seitentexte)', [kopf(['eyebrow', 'titel', 'lead'])]),
    seite('kontakt', 'Kontakt', [
      kopf(),
      { name: 'abschnitte', label: 'Abschnitte', widget: 'object', fields: [abschnitt('formular', 'Formular', ['titel', 'button', 'text'])] },
    ]),
    seite('impressum', 'Impressum', [kopf(['titel']), body('Text (Adresse und Kontakt kommen automatisch)')]),
    seite('datenschutz', 'Datenschutz', [kopf(['titel']), body('Text')]),
  ],
};

const bikes: F = {
  name: 'bikes',
  label: 'For Sale',
  label_singular: 'Bike',
  icon: 'two_wheeler',
  description: 'Bikes im Verkauf. Aussehen ist fest vorgegeben, du füllst nur die Angaben aus. Auf «verkauft» setzen schiebt das Bike in «Neue Besitzer gefunden».',
  folder: 'src/content/bikes',
  create: true,
  reorder: true,
  slug: '{{marke}}-{{modell}}-{{jahrgang}}',
  summary: '{{title}} · {{jahrgang}} · {{status}}',
  ...bilder,
  editor: { preview: false },
  view_groups: [{ label: 'Status', field: 'status' }],
  fields: [
    str('title', 'Name', { hint: 'So steht es gross auf der Website, z. B. «Harley-Davidson WLA Flathead».' }),
    str('marke', 'Marke'),
    str('modell', 'Modell'),
    num('jahrgang', 'Jahrgang', { min: 1900, max: 2100 }),
    { name: 'status', label: 'Status', widget: 'select', options: ['verfügbar', 'reserviert', 'verkauft'], default: 'verfügbar' },
    opt(num('preis', 'Preis in CHF', { hint: 'Nur die Zahl, z. B. 18500. Leer = «Preis auf Anfrage».' })),
    opt(str('km', 'Kilometer', { hint: 'Frei formulierbar, z. B. «12\'500 km» oder «3000 km seit Motorrevision».' })),
    opt(str('mfk', 'Letzte MFK', { hint: 'z. B. 2025 oder 05.2025. Leer, wenn unbekannt.' })),
    bool('kommission', 'Verkauf in Kommission'),
    img('cover', 'Hauptfoto', { hint: 'Querformat. Bekommt beim Veröffentlichen automatisch den KustomWork-Farblook.' }),
    str('coverAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS }),
    liste('highlights', 'Stichworte', [], { field: str('punkt', 'Stichwort'), fields: undefined, hint: '2 bis 4 kurze Stichworte, z. B. «Motor revidiert».', max: 6 }),
    body('Beschreibung'),
    bool('platzhalter', 'Beispiel-Eintrag', { hint: 'Zeigt den Stempel «Beispiel». Bei echten Bikes aus.' }),
    bool('draft', 'Entwurf (noch nicht anzeigen)'),
  ],
};

const technik = liste('technik', 'Build Log (Technik)', [str('bereich', 'Bereich'), opt(txt('notiz', 'Notiz')), opt(txt('offen', 'Offene Frage', { hint: 'Wird als «noch offen» markiert, bis die Notiz ausgefüllt ist.' }))], { summary: '{{fields.bereich}}' });

const projekte: F = {
  name: 'projekte',
  label: 'Projekte',
  label_singular: 'Projekt',
  icon: 'build',
  folder: 'src/content/projekte',
  create: true,
  slug: '{{title}}',
  summary: '{{title}} ({{date | date(\'YYYY\')}})',
  ...bilder,
  editor: { preview: false },
  fields: [
    str('title', 'Name des Bikes'),
    opt(str('untertitel', 'Untertitel')),
    txt('description', 'Kurzbeschreibung für Google', { hint: 'Höchstens 180 Zeichen.', pattern: ['^[\\s\\S]{0,180}$', 'Bitte höchstens 180 Zeichen.'] }),
    { name: 'date', label: 'Datum (fertiggestellt)', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD' },
    str('basis', 'Basis', { hint: 'z. B. «Harley-Davidson Panhead 1952»' }),
    str('stil', 'Stil', { hint: 'z. B. Chopper, Bobber, Racer' }),
    img('cover', 'Hauptfoto'),
    str('coverAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS }),
    liste('galerie', 'Weitere Fotos', [img('src', 'Bild'), str('alt', 'Bildbeschreibung', { hint: ALT_HINWEIS })], { summary: '{{fields.alt}}' }),
    liste('datenblatt', 'Datenblatt', [str('label', 'Bezeichnung'), str('wert', 'Wert')], { summary: '{{fields.label}}: {{fields.wert}}' }),
    technik,
    opt(str('stempel', 'Stempel auf dem Bauzettel', { hint: 'Kurz, z. B. «MFK OK»' })),
    body('Geschichte zum Projekt'),
    bool('featured', 'Hervorheben (zuerst zeigen)'),
    bool('platzhalter', 'Platzhalter («Foto folgt»)'),
    bool('draft', 'Entwurf (noch nicht anzeigen)'),
  ],
};

const blog: F = {
  name: 'blog',
  label: 'Blog',
  label_singular: 'Beitrag',
  icon: 'article',
  folder: 'src/content/blog',
  create: true,
  slug: '{{title}}',
  summary: '{{title}} ({{date | date(\'DD.MM.YYYY\')}})',
  sortable_fields: { fields: ['date', 'title'], default: { field: 'date', direction: 'descending' } },
  ...bilder,
  editor: { preview: false },
  fields: [
    str('title', 'Titel'),
    txt('description', 'Kurzbeschreibung (Google und Übersicht)', { hint: 'Höchstens 180 Zeichen.', pattern: ['^[\\s\\S]{0,180}$', 'Bitte höchstens 180 Zeichen.'] }),
    { name: 'date', label: 'Datum', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD', default: '{{now}}' },
    img('cover', 'Titelbild'),
    str('coverAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS }),
    body('Beitrag'),
    liste('tags', 'Stichworte', [], { field: str('tag', 'Stichwort'), fields: undefined }),
    liste('faq', 'Fragen und Antworten (für Google)', [str('frage', 'Frage'), txt('antwort', 'Antwort')], { summary: '{{fields.frage}}' }),
    opt({ name: 'projekt', label: 'Passendes Projekt', widget: 'relation', collection: 'projekte', value_field: '{{slug}}', search_fields: ['title'], display_fields: ['title'] }),
    technik,
    opt({ name: 'updated', label: 'Aktualisiert am', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD' }),
    opt(str('autor', 'Autor', { default: 'Andy Gemperle' })),
    bool('draft', 'Entwurf (noch nicht anzeigen)'),
  ],
};

const faq: F = {
  name: 'faq',
  label: 'Häufige Fragen',
  label_singular: 'Frage',
  icon: 'help',
  folder: 'src/content/faq',
  create: true,
  slug: '{{frage}}',
  identifier_field: 'frage',
  summary: '{{frage}}',
  editor: { preview: false },
  fields: [
    str('frage', 'Frage'),
    { ...body('Antwort'), required: true },
    { name: 'seiten', label: 'Erscheint auf', widget: 'select', multiple: true, options: [
      { label: 'Startseite', value: 'start' }, { label: 'Projekte', value: 'projekte' }, { label: 'For Sale', value: 'forsale' }, { label: 'Sixnineteen', value: 'sixnineteen' },
    ], default: ['start'] },
    num('order', 'Reihenfolge', { default: 10, hint: 'Kleine Zahl = weiter oben' }),
  ],
};

const lookbook: F = {
  name: 'lookbook',
  label: 'Sixnineteen Lookbook',
  label_singular: 'Teil',
  icon: 'apparel',
  folder: 'src/content/lookbook',
  create: true,
  slug: '{{title}}',
  ...bilder,
  editor: { preview: false },
  fields: [
    str('title', 'Name'),
    str('art', 'Art', { hint: 'z. B. T-Shirt, Hoodie, Cap' }),
    img('bild', 'Foto'),
    str('bildAlt', 'Bildbeschreibung', { hint: ALT_HINWEIS }),
    liste('farben', 'Farben', [], { field: str('farbe', 'Farbe'), fields: undefined }),
    opt(str('groessen', 'Grössen')),
    opt(num('preis', 'Preis in CHF')),
    num('order', 'Reihenfolge', { default: 10 }),
    bool('platzhalter', 'Platzhalter'),
  ],
};

const firma: F = {
  name: 'einstellungen',
  label: 'Firma & Kontakt',
  icon: 'storefront',
  editor: { preview: false },
  files: [{
    name: 'firma',
    label: 'Adresse, Telefon, Öffnungszeiten',
    file: 'src/config/firma.json',
    fields: [
      str('telefon', 'Telefon', { hint: 'z. B. +41 77 523 14 54' }),
      str('email', 'E-Mail'),
      { name: 'adresse', label: 'Adresse', widget: 'object', fields: [str('strasse', 'Strasse und Nr.'), str('plz', 'PLZ'), str('ort', 'Ort')] },
      opt(str('parkplatz', 'Parkplätze')),
      liste('oeffnungszeiten', 'Öffnungszeiten', [
        str('label', 'Tage (wie angezeigt)', { hint: 'z. B. «Dienstag bis Freitag»' }),
        { name: 'tage', label: 'Tage (für Google)', widget: 'select', multiple: true, options: [
          { label: 'Montag', value: 'Monday' }, { label: 'Dienstag', value: 'Tuesday' }, { label: 'Mittwoch', value: 'Wednesday' }, { label: 'Donnerstag', value: 'Thursday' },
          { label: 'Freitag', value: 'Friday' }, { label: 'Samstag', value: 'Saturday' }, { label: 'Sonntag', value: 'Sunday' },
        ] },
        str('von', 'Von', { hint: 'z. B. 10:00', pattern: ['^\\d{2}:\\d{2}$', 'Format hh:mm, z. B. 10:00'] }),
        str('bis', 'Bis', { hint: 'z. B. 18:00', pattern: ['^\\d{2}:\\d{2}$', 'Format hh:mm, z. B. 18:00'] }),
      ], { summary: '{{fields.label}} {{fields.von}}–{{fields.bis}}', collapsed: false }),
      opt(str('oeffnungsHinweis', 'Hinweis zu den Öffnungszeiten')),
      opt(str('instagram', 'Instagram-Link')),
      opt(str('facebook', 'Facebook-Link')),
      opt(str('googleBusiness', 'Google-Unternehmensprofil (Link)')),
      opt(str('fussText', 'Text in der Fusszeile')),
      liste('formularThemen', 'Themen im Anfrageformular', [], { field: str('thema', 'Thema'), fields: undefined, hint: '«For Sale / Occasion» und «Sixnineteen / Bekleidung» bitte nicht umbenennen, darauf verlinken Buttons.' }),
    ],
  }],
};

/** Felder ohne Werte (fields: undefined) entfernen, damit die Konfiguration sauber bleibt */
const sauber = (x: unknown): unknown =>
  Array.isArray(x) ? x.map(sauber) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined).map(([k, v]) => [k, sauber(v)])) : x;

export function GET() {
  const config = {
    backend: {
      name: 'github',
      repo: REPO,
      branch: 'main',
      base_url: basis.replace(/\/$/, ''),
      // Cloudflare-Vorschau: Worker-Route /oauth/auth, Infomaniak: PHP-Datei /oauth/auth.php
      auth_endpoint: import.meta.env.CMS_AUTH_ENDPOINT || (isPreview ? 'oauth/auth' : 'oauth/auth.php'),
      commit_messages: {
        create: 'Neu: {{collection}} «{{slug}}» (über /admin)',
        update: 'Geändert: {{collection}} «{{slug}}» (über /admin)',
        delete: 'Gelöscht: {{collection}} «{{slug}}» (über /admin)',
        uploadMedia: 'Foto hochgeladen: {{path}}',
        deleteMedia: 'Foto gelöscht: {{path}}',
      },
    },
    app_title: `${site.name} · Redaktion`,
    logo_url: site.logo.dunkel,
    site_url: isPreview ? site.previewUrl : site.url,
    media_folder: 'src/assets/fotos/uploads',
    public_folder: '/src/assets/fotos/uploads',
    media_libraries: {
      default: {
        config: {
          max_file_size: 25_000_000,
          slugify_filename: true,
          // Grosse Handyfotos im Browser verkleinern, bevor sie hochgeladen werden
          transformations: { raster_image: { format: 'webp', quality: 88, width: 2400, height: 2400 } },
        },
      },
    },
    slug: { encoding: 'ascii', clean_accents: true },
    collections: [seiten, { divider: true }, bikes, projekte, blog, { divider: true }, faq, lookbook, firma],
  };
  return new Response(JSON.stringify(sauber(config), null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
