import { getCollection, getEntry } from 'astro:content';

const live = (e: { data: { draft?: boolean } }) => import.meta.env.DEV || !e.data.draft;

export async function projekte() {
  return (await getCollection('projekte', live)).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || Number(a.data.platzhalter) - Number(b.data.platzhalter) || b.data.date.getTime() - a.data.date.getTime(),
  );
}
export async function beitraege() {
  return (await getCollection('blog', live)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export async function bikes() {
  return (await getCollection('bikes', (b) => !b.data.draft)).sort((a, b) => a.data.order - b.data.order);
}
export async function lookbook() {
  return (await getCollection('lookbook')).sort((a, b) => a.data.order - b.data.order);
}
export async function faqs(seite: string) {
  const all = (await getCollection('faq')).filter((f) => f.data.seiten.includes(seite)).sort((a, b) => a.data.order - b.data.order);
  return all.map((f) => ({
    frage: f.data.frage,
    html: f.rendered?.html ?? f.body ?? '',
    text: (f.body ?? '').replace(/\s+/g, ' ').trim(),
  }));
}

/** Texte einer Seite aus src/content/seiten/<id>.md (gepflegt über /admin) */
export async function seite(id: string) {
  const e = await getEntry('seiten', id);
  if (!e) throw new Error(`Seiten-Text fehlt: src/content/seiten/${id}.md`);
  const a = (k: string) => e.data.abschnitte[k] ?? {};
  const l = (k: string) => e.data.listen[k] ?? [];
  const w = (k: string) => e.data.woerter[k] ?? [];
  return { ...e.data, eintrag: e, a, l, w };
}
