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
    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
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
