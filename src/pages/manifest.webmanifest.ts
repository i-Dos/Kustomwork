import { site } from '../config/site';
export function GET() {
  return new Response(
    JSON.stringify({
      name: site.name,
      short_name: site.shortName,
      description: site.tagline,
      lang: site.lang,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#ebe0ca',
      theme_color: '#2e2118',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      shortcuts: [
        { name: 'Projekte', url: '/projekte/' },
        { name: 'For Sale', url: '/for-sale/' },
        { name: 'Kontakt', url: '/kontakt/' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
}
