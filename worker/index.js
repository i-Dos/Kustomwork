/**
 * Cloudflare Worker für die Vorschau (Workers mit Static Assets).
 * Liefert die statischen Dateien aus dist/ und schützt sie mit Basic Auth.
 *
 * Passwort, in dieser Reihenfolge:
 *  1. Geheimnis VORSCHAU_PASSWORT (im Cloudflare-Dashboard, Laufzeit-Bereich), oder
 *  2. Variable VORSCHAU_PASSWORT_SHA256 aus wrangler.jsonc (nur der SHA-256-Hash steht im Repo).
 * Benutzer: VORSCHAU_BENUTZER (Standard «kustom»). Für Infomaniak wird dieser Ordner nicht gebraucht.
 */
export default {
  async fetch(request, env) {
    if (!(await istErlaubt(request, env))) {
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
    out.headers.set('Cache-Control', 'private, no-store');
    if ((res.headers.get('Content-Type') || '').includes('text/html')) {
      out = new HTMLRewriter()
        .on('meta[name="robots"]', { element: (el) => el.setAttribute('content', 'noindex, nofollow') })
        .transform(out);
    }
    return out;
  },
};

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function istErlaubt(request, env) {
  const user = env.VORSCHAU_BENUTZER || 'kustom';
  const klar = env.VORSCHAU_PASSWORT;
  const hash = (env.VORSCHAU_PASSWORT_SHA256 || '').toLowerCase();
  if (!klar && !hash) return true; // kein Schutz konfiguriert
  const [scheme, encoded] = (request.headers.get('Authorization') || '').split(' ');
  if (scheme !== 'Basic' || !encoded) return false;
  let u, p;
  try {
    const [a, ...rest] = atob(encoded).split(':');
    u = a;
    p = rest.join(':');
  } catch {
    return false;
  }
  if (u !== user) return false;
  if (klar && p === klar) return true;
  if (hash && (await sha256(p)) === hash) return true;
  return false;
}
