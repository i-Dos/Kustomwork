/**
 * Cloudflare Worker für die Vorschau (Workers mit Static Assets).
 * Liefert die statischen Dateien aus dist/ und schützt sie mit Basic Auth,
 * sobald das Secret VORSCHAU_PASSWORT gesetzt ist. Benutzer: VORSCHAU_BENUTZER (Standard «kustom»).
 * Für Infomaniak wird dieser Ordner nicht gebraucht.
 */
export default {
  async fetch(request, env) {
    const pass = env.VORSCHAU_PASSWORT;
    if (pass && !istErlaubt(request, env.VORSCHAU_BENUTZER || 'kustom', pass)) {
      return new Response('Vorschau, bitte anmelden.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="KustomWork Vorschau", charset="UTF-8"',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'no-store',
        },
      });
    }
    // Vorschau nie indexieren, unabhängig davon, wie gebaut wurde
    if (new URL(request.url).pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' } });
    }
    const res = await env.ASSETS.fetch(request);
    let out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    if ((res.headers.get('Content-Type') || '').includes('text/html')) {
      out = new HTMLRewriter()
        .on('meta[name="robots"]', { element: (el) => el.setAttribute('content', 'noindex, nofollow') })
        .transform(out);
    }
    return out;
  },
};

function istErlaubt(request, user, pass) {
  const [scheme, encoded] = (request.headers.get('Authorization') || '').split(' ');
  if (scheme !== 'Basic' || !encoded) return false;
  try {
    const [u, ...rest] = atob(encoded).split(':');
    return u === user && rest.join(':') === pass;
  } catch {
    return false;
  }
}
