/** llms.txt: kompakte Zusammenfassung für KI-Assistenten (https://llmstxt.org) */
import { site } from '../config/site';
import { projekte, beitraege, bikes } from '../lib/inhalte';

export async function GET() {
  const p = (await projekte()).filter((x) => !x.data.platzhalter);
  const b = await beitraege();
  const s = (await bikes()).filter((x) => x.data.status !== 'verkauft');
  const u = (path: string) => `${site.url}${path}`;
  const zeiten = site.openingHours.map((o) => `${o.label} ${o.opens}–${o.closes}`).join(', ');
  const txt = `# ${site.name}

> ${site.description}

- Inhaber: ${site.owner}
- Adresse: ${site.address.street}, ${site.address.zip} ${site.address.city}, Schweiz (am Zürichsee)
- Telefon: ${site.phone}
- E-Mail: ${site.email}
- Öffnungszeiten: ${zeiten}. ${site.openingNote}
- Schwerpunkt: ${site.focus}
- Nicht angeboten: reine Service- und Reparaturaufträge
- Fachgebiete: ${site.knowsAbout.join(', ')}

## Seiten

- [Projekte](${u('/projekte/')}): Kustom-Umbauten mit Fotos und Datenblättern
- [Andys Geschichte](${u('/andy/')}): Werdegang von Andy Gemperle
- [For Sale](${u('/for-sale/')}): Motorräder und Occasionen zum Verkauf
- [Sixnineteen](${u('/sixnineteen/')}): Eigenes Kleiderlabel, erhältlich in der Werkstatt
- [Kontakt](${u('/kontakt/')}): Anfrageformular, Anfahrt, Öffnungszeiten

## Projekte

${p.map((x) => `- [${x.data.title}](${u(`/projekte/${x.id}/`)}): ${x.data.description}`).join('\n')}

## Blog

${b.map((x) => `- [${x.data.title}](${u(`/blog/${x.id}/`)}): ${x.data.description}`).join('\n')}

## Zu verkaufen

${s.map((x) => `- ${x.data.title}, Jahrgang ${x.data.jahrgang}${x.data.preis ? `, CHF ${x.data.preis}` : ''}`).join('\n')}
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
