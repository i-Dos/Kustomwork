#!/bin/sh
# Deploy der Vorschau auf Cloudflare Workers (Bereitstellungsbefehl im Dashboard: npm run deploy:vorschau).
# Geheimnisse, die als BUILD-Variablen gesetzt sind (Einstellungen > Build > Variablen und geheime Schlüssel),
# sieht der laufende Worker nicht. Darum werden sie hier als Laufzeit-Geheimnisse an den Worker übergeben:
#   VORSCHAU_PASSWORT     Passwortschutz der Vorschau
#   GITHUB_CLIENT_ID      Login für /admin (GitHub OAuth App)
#   GITHUB_CLIENT_SECRET  Login für /admin
# Sind sie direkt als Laufzeit-Variablen gesetzt, bleiben diese unverändert (keep_vars in wrangler.jsonc).
set -e
npx wrangler deploy

geheim() {
  name="$1"
  eval "wert=\${$name}"
  if [ -n "$wert" ]; then
    if printf '%s' "$wert" | npx wrangler secret put "$name" >/dev/null 2>&1; then
      echo "$name als Laufzeit-Geheimnis gesetzt."
    else
      echo "Hinweis: $name konnte nicht gesetzt werden (evtl. schon als Laufzeit-Variable vorhanden)."
    fi
  else
    echo "Hinweis: $name nicht im Build gesetzt, Laufzeit-Wert bleibt unverändert."
  fi
}
geheim VORSCHAU_PASSWORT
geheim GITHUB_CLIENT_ID
geheim GITHUB_CLIENT_SECRET
