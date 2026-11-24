import { site } from '../config/site';

const abs = (path: string) => new URL(path, site.url).href;
export const orgId = `${site.url}/#business`;

/** LocalBusiness (AutoRepair + MotorcycleDealer) */
export function businessSchema(image?: string) {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    '@type': site.businessType,
    '@id': orgId,
    name: site.name,
    description: site.description,
    url: site.url + '/',
    email: site.email,
    telephone: site.phone,
    ...(image ? { image } : {}),
    logo: { '@type': 'ImageObject', url: abs('/logo/logo-512.png'), width: 512, height: 460 },
    founder: { '@type': 'Person', '@id': `${site.url}/andy/#person`, name: site.owner },
    ...(site.foundingYear ? { foundingDate: site.foundingYear } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    openingHoursSpecification: site.openingHours.map((o) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: o.days,
      opens: o.opens,
      closes: o.closes,
    })),
    areaServed: site.areaServed.map((a) => ({ '@type': 'Place', name: a })),
    knowsAbout: site.knowsAbout,
    slogan: site.tagline,
    priceRange: '$$$',
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url + '/',
    name: site.name,
    inLanguage: site.lang,
    publisher: { '@id': orgId },
  };
}

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': `${site.url}/andy/#person`,
    name: site.owner,
    jobTitle: 'Inhaber und Kustom-Bike-Builder',
    worksFor: { '@id': orgId },
    url: abs('/andy/'),
    knowsAbout: ['Harley-Davidson', 'Chopper', 'Panhead', 'Kustom Bikes', 'Indian Larry'],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqSchema(faqs: { frage: string; antwort: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.frage,
      acceptedAnswer: { '@type': 'Answer', text: f.antwort },
    })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; date: Date; updated?: Date; image: string; autor: string }) {
  return {
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    mainEntityOfPage: abs(a.path),
    url: abs(a.path),
    datePublished: a.date.toISOString(),
    dateModified: (a.updated ?? a.date).toISOString(),
    image: a.image,
    inLanguage: site.lang,
    author: { '@type': 'Person', '@id': `${site.url}/andy/#person`, name: a.autor },
    publisher: { '@id': orgId },
  };
}

export function projectSchema(p: { title: string; description: string; path: string; date: Date; image: string; basis: string }) {
  return {
    '@type': 'CreativeWork',
    name: p.title,
    description: p.description,
    url: abs(p.path),
    image: p.image,
    dateCreated: p.date.toISOString().slice(0, 10),
    creator: { '@id': orgId },
    about: { '@type': 'Motorcycle', name: p.basis, brand: { '@type': 'Brand', name: 'Harley-Davidson' } },
    inLanguage: site.lang,
  };
}

export function motorcycleOfferSchema(b: { title: string; marke: string; modell: string; jahrgang: number; km?: string; preis?: number; status: string; image: string; path: string }) {
  const availability = { verfügbar: 'InStock', reserviert: 'LimitedAvailability', verkauft: 'SoldOut' }[b.status] ?? 'InStock';
  return {
    '@type': 'Motorcycle',
    name: b.title,
    brand: { '@type': 'Brand', name: b.marke },
    model: b.modell,
    vehicleModelDate: String(b.jahrgang),
    image: b.image,
    url: abs(b.path),
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      availability: `https://schema.org/${availability}`,
      priceCurrency: 'CHF',
      ...(b.preis ? { price: b.preis } : {}),
      seller: { '@id': orgId },
    },
  };
}

/** Dienstleistung mit eigener @id (Anker auf der Leistungsseite) */
export function serviceSchema(l: { id: string; titel: string; text: string; serviceType: string }, path = '/dienstleistungen/') {
  return {
    '@type': 'Service',
    '@id': `${abs(path)}#${l.id}`,
    name: l.titel,
    description: l.text,
    serviceType: l.serviceType,
    url: `${abs(path)}#${l.id}`,
    provider: { '@id': orgId },
    areaServed: site.areaServed.map((a) => ({ '@type': 'Place', name: a })),
  };
}
