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
