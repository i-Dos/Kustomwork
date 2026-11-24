/**
 * Passwortschutz für die Vorschau auf Cloudflare Pages (Basic Auth).
 * Aktiv nur, wenn in Cloudflare die Umgebungsvariable VORSCHAU_PASSWORT gesetzt ist.
 * Benutzername: VORSCHAU_BENUTZER (Standard «kustom»).
 * Auf Infomaniak wird dieser Ordner nicht verwendet.
 */
export async function onRequest({ request, env, next }) {
  const pass = env.VORSCHAU_PASSWORT;
  if (!pass) return next();
  const user = env.VORSCHAU_BENUTZER || 'kustom';
  const auth = request.headers.get('Authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme === 'Basic' && encoded) {
    const [u, ...rest] = atob(encoded).split(':');
    if (u === user && rest.join(':') === pass) {
      const res = await next();
      const out = new Response(res.body, res);
      out.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return out;
    }
  }
  return new Response('Vorschau, bitte anmelden.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="KustomWork Vorschau", charset="UTF-8"', 'X-Robots-Tag': 'noindex' },
  });
}
