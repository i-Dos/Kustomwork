# Gemperle's KustomWork – Website

Statische Website mit [Astro](https://astro.build) 7. Kein Server, kein CMS: Der Build erzeugt reine HTML-, CSS- und Bilddateien in `dist/`, die auf jedes Webhosting passen (geplant: Infomaniak).

## Schnellstart

```bash
npm install
npm run dev              # lokale Entwicklung auf http://localhost:4321
npm run build            # Live-Build nach dist/
npm run build:vorschau   # Vorschau-Build: noindex überall, robots.txt sperrt alles
```

Node 22.23 oder neuer.

## Aufbau als Vorlage

Alles Kundenspezifische ist vom Code getrennt. Für einen neuen Kunden nur diese Teile ersetzen:

| Was | Wo |
|---|---|
| Firmendaten, Öffnungszeiten, Navigation, Hero-Bilder, Formular | `src/config/site.ts` |
| Farben und Schriften | `src/styles/global.css` (Abschnitt Design-Tokens) |
| Foto-Look (Wärme, Sättigung, Kontrast) | `src/config/look.json` |
| Originalfotos | `fotos-original/` |
| Inhalte | `src/content/` (projekte, blog, bikes, lookbook, faq) |

Layout, Komponenten, Schema.org, Sitemap, llms.txt, PWA und Formular bleiben unverändert.

## Inhalte pflegen

Jeder Eintrag ist eine Markdown-Datei mit einem Kopfbereich (Frontmatter):

- **Projekt:** `src/content/projekte/<name>.md`, Felder: title, description, basis, stil, cover, galerie, datenblatt
- **Blogbeitrag:** `src/content/blog/<name>.md`, optional `faq` (erscheint als FAQ-Schema bei Google und KI-Suchen)
- **For Sale:** `src/content/bikes/<name>.md`, `status: verfügbar | reserviert | verkauft`
- **Sixnineteen:** `src/content/lookbook/<name>.md`
- **FAQ:** `src/content/faq/<name>.md`, `seiten` steuert, wo die Frage erscheint

`draft: true` blendet einen Eintrag im Live-Build aus. `platzhalter: true` markiert Beispielinhalte.
Stellen, die Andy noch bestätigen muss, sind mit `[OFFEN]` oder einem gelben Kasten (`offen-block`) markiert.

## Fotos

1. Originalfoto in `fotos-original/` legen (Unterordner erlaubt).
2. `npm run fotos` erzeugt die gefilterte Version in `src/assets/fotos/` (läuft auch automatisch bei `npm run build`).
3. Im Inhalt auf `../../assets/fotos/<datei>.jpg` verweisen.

Astro erzeugt daraus beim Build AVIF/WebP in mehreren Grössen. Das Filmkorn liegt als CSS-Overlay über den Bildern, damit die Dateien klein bleiben.

## Startseite: Zufallsbild

`site.hero` listet die Bilder. Pro Besuch erscheint eines davon, nie zweimal hintereinander gleich. Es lädt nur das gewählte Bild (gut für Ladezeit/LCP). Daneben verlinkt ein Hinweis automatisch den neusten Blogbeitrag oder das neuste Projekt.

## SEO und GEO

- Schema.org als JSON-LD: AutoRepair + MotorcycleDealer (LocalBusiness), WebSite, Person (Andy), BlogPosting, CreativeWork (Projekte), Motorcycle mit Offer (For Sale), FAQPage, BreadcrumbList
- `sitemap-index.xml`, `robots.txt` (KI-Crawler erlaubt), `llms.txt` (automatisch aus Inhalten), `rss.xml`
- Kanonische URLs, Open Graph mit automatisch zugeschnittenem Bild
- Selbst gehostete Schriften, keine Cookies, keine Google-Dienste

## Anfrageformular

`src/pages/anfrage.php.ts` erzeugt beim Build `anfrage.php`. Es verschickt die Anfrage per PHP `mail()` an `site.form.to`. Auf Infomaniak funktioniert das direkt. Absender ist `site.form.from`, eine Adresse der eigenen Domain (muss bei Infomaniak existieren). Auf Vorschau-Hosts ohne PHP wird das Formular nicht verschickt.

Für die Auswertung schickt das Formular mit, über welche Seite und Quelle (Referrer, utm_source) jemand gekommen ist.

## Deployment auf Infomaniak

1. `npm run build`
2. Inhalt von `dist/` per SFTP oder Infomaniak-FTP-Manager in das Web-Verzeichnis der Domain laden (inkl. der versteckten Datei `.htaccess`).
3. Die `.htaccess` regelt HTTPS-Weiterleitung, www-Weiterleitung, Caching und 404-Seite.

Für eine geschützte Vorschau: `npm run build:vorschau` und Verzeichnisschutz im Infomaniak Manager aktivieren.

## Vorschau auf Cloudflare (Workers, bis zum Livegang)

Konfiguration: `wrangler.jsonc` (Worker `kustomwork`, statische Dateien aus `dist/`) und `worker/index.js` (Passwortschutz).

Im Cloudflare-Dashboard unter Workers & Pages → `kustomwork` → Settings:
1. **Build:** Build command `npm run build:vorschau`, Deploy command `npm run deploy:vorschau`, Root directory leer, Branch `main`.
2. **Variables and Secrets:** Secret `VORSCHAU_PASSWORT` setzen (zur Laufzeit oder als Build-Geheimnis, das Deploy-Skript überträgt es), optional Text-Variable `VORSCHAU_BENUTZER` (Standard `kustom`).
3. Jeder Push auf `main` baut und veröffentlicht die Vorschau neu.

Die Vorschau ist dreifach gegen Suchmaschinen gesperrt: meta robots, robots.txt und X-Robots-Tag. `.htaccess` und `anfrage.php` werden dort nicht hochgeladen (`public/.assetsignore`), das Formular funktioniert also erst auf Infomaniak.

## PWA

`manifest.webmanifest`, Icons in `public/icons/`, Service Worker `public/sw.js` (Seiten Netz-zuerst, Bilder Cache-zuerst, Offline-Seite). Bei grösseren Änderungen `VERSION` in `sw.js` erhöhen.
