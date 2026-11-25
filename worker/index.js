/**
 * Cloudflare Worker für die Vorschau (Workers mit Static Assets).
 * Liefert die statischen Dateien aus dist/ und schützt sie mit Basic Auth.
 *
 * Passwort, in dieser Reihenfolge:
 *  1. Geheimnis VORSCHAU_PASSWORT (im Cloudflare-Dashboard, Laufzeit-Bereich), oder
 *  2. Variable VORSCHAU_PASSWORT_SHA256 aus wrangler.jsonc (nur der SHA-256-Hash steht im Repo).
 * Benutzer: VORSCHAU_BENUTZER (Standard «kustom»). Für Infomaniak wird dieser Ordner nicht gebraucht.
 *
 * Login für das Redaktions-Tool (/admin): /oauth/auth und /oauth/callback (GitHub OAuth).
 * Geheimnisse im Cloudflare-Dashboard: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET. Anleitung: docs/redaktion.md
 */
export default {
  async fetch(request, env) {
    const pfad = new URL(request.url).pathname;
    // Login-Routen brauchen kein Vorschau-Passwort: Sie geben nur ein GitHub-Token an den eigenen Tab zurück
    if (pfad === '/oauth/auth' || pfad === '/oauth/callback') return oauth(request, env, pfad);
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

// --- GitHub-Login für Sveltia CMS --------------------------------------------
// Gleiches Protokoll wie Sveltia CMS Authenticator / Netlify: Popup meldet das Token per postMessage.

function seite(titel, skript) {
  return new Response(
    `<!doctype html><html lang="de"><meta charset="utf-8"><title>${titel}</title><body style="font:16px system-ui;padding:2rem">${titel}<script>${skript}</script></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  );
}

function antwort(status, inhalt) {
  // Nachricht nur an das eigene Fenster (gleiche Herkunft) schicken
  const nachricht = `authorization:github:${status}:${JSON.stringify(inhalt)}`;
  return seite(
    status === 'success' ? 'Angemeldet, das Fenster schliesst sich.' : 'Anmeldung fehlgeschlagen: ' + (inhalt.error || ''),
    `(function(){var o=location.origin,m=${JSON.stringify(nachricht)};
      window.addEventListener('message',function(e){if(e.origin!==o)return;window.opener&&window.opener.postMessage(m,o);setTimeout(function(){window.close()},500)},{once:true});
      window.opener&&window.opener.postMessage('authorizing:github',o);})();`,
  );
}

function cookie(request, name) {
  const c = request.headers.get('Cookie') || '';
  const m = c.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? m[1] : '';
}

async function oauth(request, env, pfad) {
  const url = new URL(request.url);
  const id = env.GITHUB_CLIENT_ID;
  const geheim = env.GITHUB_CLIENT_SECRET;
  if (!id || !geheim) {
    const fehlt = [!id && 'GITHUB_CLIENT_ID', !geheim && 'GITHUB_CLIENT_SECRET'].filter(Boolean).join(' und ');
    return antwort('error', { provider: 'github', error: `Login ist noch nicht eingerichtet: ${fehlt} fehlt im Cloudflare-Worker (Einstellungen > Variablen und geheime Schlüssel).` });
  }

  if (pfad === '/oauth/auth') {
    const state = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');
    const ziel = new URL('https://github.com/login/oauth/authorize');
    ziel.searchParams.set('client_id', id);
    ziel.searchParams.set('scope', url.searchParams.get('scope') || 'repo');
    ziel.searchParams.set('state', state);
    ziel.searchParams.set('redirect_uri', `${url.origin}/oauth/callback`);
    return new Response(null, {
      status: 302,
      headers: { Location: ziel.toString(), 'Set-Cookie': `cms_state=${state}; Path=/oauth; Max-Age=600; HttpOnly; Secure; SameSite=Lax`, 'Cache-Control': 'no-store' },
    });
  }

  // /oauth/callback
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state || state !== cookie(request, 'cms_state')) return antwort('error', { provider: 'github', error: 'Ungültige Anfrage, bitte nochmals anmelden.' });
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'kustomwork-cms-login' },
    body: JSON.stringify({ client_id: id, client_secret: geheim, code, redirect_uri: `${url.origin}/oauth/callback` }),
  });
  const daten = await res.json().catch(() => ({}));
  if (!daten.access_token) return antwort('error', { provider: 'github', error: daten.error_description || 'Kein Token erhalten.' });
  return antwort('success', { provider: 'github', token: daten.access_token });
}
