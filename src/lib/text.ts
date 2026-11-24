/**
 * Kleiner Markdown-Umsetzer für Textfelder aus dem Redaktions-Tool (Seiten-Texte).
 * Kann: Absätze, Zeilenumbruch, **fett**, *kursiv*, [Link](url), Listen mit «- ».
 * Bewusst klein: Andy schreibt Text, das Aussehen bestimmen die Vorlagen.
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function inline(s = ''): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const extern = /^https?:/.test(u);
      return `<a href="${u.replace(/"/g, '%22')}"${extern ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
    })
    .replace(/\n/g, '<br />');
}

/** Mehrere Absätze; klasse = CSS-Klasse für den ersten Absatz (z. B. «lead») */
export function absaetze(s = '', ersteKlasse?: string): string {
  return s
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((block, i) => {
      const zeilen = block.split('\n');
      if (zeilen.every((z) => /^\s*[-*] /.test(z))) return `<ul>${zeilen.map((z) => `<li>${inline(z.replace(/^\s*[-*] /, ''))}</li>`).join('')}</ul>`;
      const k = i === 0 && ersteKlasse ? ` class="${ersteKlasse}"` : '';
      return `<p${k}>${inline(block)}</p>`;
    })
    .join('\n');
}

import { site } from '../config/site';

/** Öffnungszeiten als Satz: «Dienstag bis Freitag 10 bis 18 Uhr, Samstag 10 bis 15 Uhr» */
export const zeitenSatz = () =>
  site.openingHours.map((o) => `${o.label} ${o.opens.replace(/:00$/, '')} bis ${o.closes.replace(/:00$/, '')} Uhr`).join(', ');

/** Platzhalter in Texten: {telefon} {email} {adresse} {zeiten} {marken} */
function platzhalter(s: string, html: boolean, extra: Record<string, string> = {}) {
  const werte: Record<string, [string, string]> = {
    telefon: [site.phone, `<a href="tel:${site.phoneHref}" class="tel">${site.phone}</a>`],
    email: [site.email, `<a href="mailto:${site.email}">${site.email}</a>`],
    adresse: [`${site.address.street}, ${site.address.zip} ${site.address.city}`, `${site.address.street}, ${site.address.zip} ${site.address.city}`],
    zeiten: [zeitenSatz(), zeitenSatz()],
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, [v, esc(v)]])),
  };
  return s.replace(/\{(\w+)\}/g, (m, k) => (werte[k] ? werte[k][html ? 1 : 0] : m));
}

/** Für Fliesstext mit Platzhaltern (HTML) */
export const text = (s = '', extra?: Record<string, string>) => platzhalter(inline(s), true, extra);
export const textAbsaetze = (s = '', ersteKlasse?: string, extra?: Record<string, string>) => platzhalter(absaetze(s, ersteKlasse), true, extra);
/** Für Meta-Beschreibungen (reiner Text) */
export const klartext = (s = '', extra?: Record<string, string>) => platzhalter(s, false, extra);

/** Anker aus einem Titel: «Motor- und Getrieberevisionen» → «motor-und-getrieberevisionen» */
export const slug = (s = '') =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-');

/**
 * Setzt die offenen Fragen (ergaenzungen) in den Text ein: am Ende des Abschnitts «nach»
 * (Zwischentitel), am Anfang oder am Ende. Ohne Antwort: gelbe Box mit der Frage.
 * Mit Antwort: Andys Text als normale Absätze, die Box verschwindet.
 */
export function mitErgaenzungen(html: string, liste: { frage: string; antwort?: string; nach?: string }[] = []) {
  let out = html;
  for (const e of liste) {
    const block = e.antwort?.trim()
      ? textAbsaetze(e.antwort)
      : `<p class="offen-block"><strong>Offen, Andy ergänzt:</strong> ${inline(e.frage)} <em>(Antwort im Redaktions-Tool unter «Offene Fragen an Andy»)</em></p>`;
    const nach = (e.nach ?? 'ende').trim();
    if (nach === 'ende' || !nach) { out += '\n' + block; continue; }
    const h2 = [...out.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
    if (nach === 'anfang') {
      const i = h2[0]?.index ?? out.length;
      out = out.slice(0, i) + block + '\n' + out.slice(i);
      continue;
    }
    const plain = (x: string) => x.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const k = h2.findIndex((m) => plain(m[1]) === plain(nach));
    if (k === -1) { out += '\n' + block; continue; }
    const i = h2[k + 1]?.index ?? out.length;
    out = out.slice(0, i) + block + '\n' + out.slice(i);
  }
  return out;
}
