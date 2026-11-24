import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { beitraege } from '../lib/inhalte';
import { site } from '../config/site';

export async function GET(context: APIContext) {
  const posts = await beitraege();
  return rss({
    title: `${site.name} Blog`,
    description: site.description,
    site: context.site!,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/blog/${p.id}/` })),
    customData: `<language>${site.lang}</language>`,
  });
}
