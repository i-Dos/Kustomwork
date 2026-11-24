#!/bin/sh
# Deploy der Vorschau auf Cloudflare Workers (Bereitstellungsbefehl im Dashboard: npm run deploy:vorschau).
# Ist VORSCHAU_PASSWORT als Build-Variable/-Geheimnis gesetzt, wird es als Laufzeit-Geheimnis
# an den Worker übergeben, damit der Passwortschutz greift.
set -e
npx wrangler deploy
if [ -n "$VORSCHAU_PASSWORT" ]; then
  printf '%s' "$VORSCHAU_PASSWORT" | npx wrangler secret put VORSCHAU_PASSWORT
  echo "Passwortschutz aktiv."
else
  echo "Hinweis: VORSCHAU_PASSWORT nicht im Build gesetzt, Laufzeit-Geheimnis wird nicht verändert."
fi
