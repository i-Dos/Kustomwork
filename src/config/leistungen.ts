/**
 * Dienstleistungen von Gemperle's KustomWork.
 * kern = Schwerpunkt (gross, mit Bild), rund = «Rund ums Bike» (kompakt).
 * id = Anker auf /dienstleistungen/#id und @id im Service-Schema.
 * bild = Datei in src/assets/fotos (Platzhalter, bis Andy passende Fotos liefert).
 */
export interface Leistung {
  id: string;
  titel: string;
  kurz: string;
  text: string;
  punkte?: string[];
  bild?: string;
  bildAlt?: string;
  link?: { href: string; text: string };
  serviceType: string;
  thema?: string; // Vorauswahl im Kontaktformular (muss in site.form.topics stehen)
}

export const kern: Leistung[] = [
  {
    id: 'custom-bikes',
    titel: 'Custom Bikes nach Kundenwunsch',
    kurz: 'Dein Bike als Einzelstück, gebaut zum Fahren.',
    text: 'Das ist der Kern unserer Arbeit. Wir hören zu, wie du fährst und was dir gefällt, und bauen daraus ein Motorrad, das es kein zweites Mal gibt. Old School Chopper, Bobber, Racer oder ein dezenter Umbau deiner Harley: Viele Teile entstehen direkt bei uns an der Drehbank und am Schweissgerät. Und am Ende kommt das Bike durch die MFK.',
    punkte: ['Umbau deiner Harley oder Neuaufbau ab Rahmen', 'Eigenbau-Teile: Tank, Schutzblech, Halter, Griffe', 'Lack und Pinstriping mit Partnern, denen wir vertrauen', 'Bis zur Abnahme durch die MFK'],
    bild: 'larry-seite.jpg',
    bildAlt: 'Old-School-Chopper auf Panhead-Basis, gebaut von Andy Gemperle',
    link: { href: '/projekte/', text: 'Unsere Projekte ansehen' },
    serviceType: 'Custom-Motorrad-Umbau',
    thema: 'Kustom-Umbau',
  },
  {
    id: 'oldtimer-restaurationen',
    titel: 'Oldtimer-Restaurationen und Neuaufbauten',
    kurz: 'Flathead, Knucklehead, Panhead, Shovelhead.',
    text: 'Alte Harleys sind unsere Leidenschaft. Wir restaurieren Klassiker originalgetreu oder bauen sie mit Respekt vor der Technik neu auf. Von der Bestandesaufnahme über die Revision aller Baugruppen bis zur ersten Ausfahrt, und auf Wunsch bis zur Veteranen-Prüfung.',
    punkte: ['Komplette Restauration oder sanfte Auffrischung', 'Neuaufbau aus Teilen und Kisten', 'Teilebeschaffung für alte Modelle', 'Begleitung zur Veteranen-MFK'],
    bild: 'jimdo/panhead48-1.jpg',
    bildAlt: 'Harley-Davidson FL Panhead von 1948 vor der Werkstatt in Meilen',
    link: { href: '/blog/harley-motoren-der-alten-schule/', text: 'Harley-Motoren der alten Schule' },
    serviceType: 'Oldtimer-Restauration',
    thema: 'Neuaufbau / Restauration',
  },
  {
    id: 'motor-getriebe-revisionen',
    titel: 'Motor- und Getrieberevisionen',
    kurz: 'Zerlegen, vermessen, richtig wieder zusammenbauen.',
    text: 'Ob der Motor Öl verliert, das Getriebe hakt oder einfach die Laufleistung erreicht ist: Wir zerlegen, vermessen und revidieren Motoren und Getriebe, von alten seitengesteuerten Flatheads bis zur Twin Cam.',
    punkte: ['Motorrevision inkl. Köpfe und Ventiltrieb', 'Getriebe- und Kupplungsrevision', 'Vergaser und Zündung einstellen', 'Probefahrt und Kontrolle nach dem Einfahren'],
    bild: 'jimdo/larry-3.jpg',
    bildAlt: 'Detail eines revidierten Harley-Davidson-Motors',
    serviceType: 'Motorrevision',
    thema: 'Motor- / Getrieberevision',
  },
  {
    id: 'tuning',
    titel: 'Tuning',
    kurz: 'Mehr Druck, besserer Sound, legal auf der Strasse.',
    text: 'Luftfilter, Auspuff, Nockenwelle, Abstimmung: Wir holen mehr aus deinem Motor heraus, ohne dass er seinen Charakter verliert. Dabei achten wir darauf, dass alles für die Schweizer Strasse zugelassen ist.',
    punkte: ['Ansaugung und Auspuff', 'Nockenwellen und Motortuning', 'Abstimmung von Vergaser oder Einspritzung', 'Zulassungsfähige Lösungen'],
    bild: 'jimdo/59-racer-1.jpg',
    bildAlt: '59 Racer, getunte Harley-Davidson vor Backsteinwand',
    serviceType: 'Motorrad-Tuning',
    thema: 'Tuning',
  },
];

export const rund: Leistung[] = [
  { id: 'service-reparaturen', titel: 'Service und Reparaturen', kurz: 'Regelmässiger Service und Reparaturen, damit dein Bike zuverlässig läuft.', text: 'Wir warten und reparieren Harley-Davidsons aller Generationen, vom Ölwechsel bis zur Fehlersuche.', serviceType: 'Motorrad-Service' },
  { id: 'mfk', titel: 'MFK-Bereitstellung und Vorführung', kurz: 'Wir bereiten dein Bike für die MFK vor und führen es auf Wunsch vor.', text: 'Kontrolle, nötige Arbeiten und Vorführung beim Strassenverkehrsamt aus einer Hand.', serviceType: 'MFK-Vorbereitung' },
  { id: 'reifenservice', titel: 'Reifenservice für alle Marken', kurz: 'Reifen montieren, auswuchten, beraten, nicht nur für Harleys.', text: 'Reifenwechsel und Beratung für Motorräder aller Marken.', serviceType: 'Motorrad-Reifenservice' },
  { id: 'unfall-instandsetzung', titel: 'Unfall-Instandsetzung', kurz: 'Nach einem Sturz bringen wir dein Bike wieder auf die Strasse.', text: 'Schadenaufnahme, Instandsetzung und Abwicklung nach einem Unfall.', serviceType: 'Unfall-Instandsetzung' },
  { id: 'ersatzteile', titel: 'Ersatzteile', kurz: 'Original- und Zubehörteile, auch für alte Modelle.', text: 'Wir beschaffen Ersatz- und Zubehörteile für Harley-Davidson, auch für Klassiker.', link: { href: '/bekleidung/', text: 'Teile im Laden' }, serviceType: 'Ersatzteile' },
  { id: 'bekleidung', titel: 'Motorradbekleidung und mehr', kurz: 'Rokker, Iron & Resin, Biltwell und weitere Marken im Laden.', text: 'Bekleidung, Helme, Brillen und Handschuhe von Marken, hinter denen wir stehen.', link: { href: '/bekleidung/', text: 'Zum Laden' }, serviceType: 'Motorradbekleidung' },
  { id: 'kommission', titel: 'Verkauf von Occasionen in Kommission', kurz: 'Wir verkaufen dein Bike für dich, ehrlich beschrieben.', text: 'Wir prüfen, fotografieren und verkaufen ausgewählte Bikes in Kommission.', link: { href: '/for-sale/', text: 'For Sale' }, serviceType: 'Kommissionsverkauf' },
  { id: 'beratung', titel: "Beratung, wenn's um Harley geht", kurz: 'Kaufberatung, Umbauideen, Fragen zur Technik: frag uns.', text: 'Wir beraten dich beim Kauf, bei Umbauplänen und bei allen Fragen rund um Harley-Davidson.', link: { href: '/kontakt/', text: 'Frag uns' }, serviceType: 'Beratung' },
];
