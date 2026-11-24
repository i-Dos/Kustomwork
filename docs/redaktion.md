# Redaktions-Tool (/admin)

Andy pflegt die Website selbst unter **/admin** (Sveltia CMS, kostenlos, ohne Datenbank).
Jede Änderung wird als Commit im GitHub-Repo gespeichert, danach baut sich die Seite neu (ca. 2 Minuten).
Das Design steckt in den Vorlagen (`src/pages`, `src/components`) und lässt sich über die Masken nicht verändern.

## Was Andy bearbeiten kann

| Bereich im Tool | Datei(en) |
|---|---|
| Seiten (Startseite, Andy, Leistungen, Bekleidung, Sixnineteen, For Sale, Projekte, Blog, Kontakt, Impressum, Datenschutz) | `src/content/seiten/*.md` |
| For Sale (Bikes) | `src/content/bikes/*.md` |
| Projekte, Blog | `src/content/projekte/*.md`, `src/content/blog/*.md` |
| Häufige Fragen, Lookbook | `src/content/faq/*.md`, `src/content/lookbook/*.md` |
| Firma & Kontakt (Telefon, Adresse, Öffnungszeiten, Social, UID) | `src/config/firma.json` |

Welche Felder es gibt, steht in `src/pages/admin/config.json.ts`.

**Offene Fragen an Andy:** Die gelben Boxen auf der Website kommen aus dem Feld «Offene Fragen an Andy»
im jeweiligen Eintrag (Andy, Blog, Projekte, For Sale). Andy schreibt die Antwort ins Feld, speichert,
und sein Text ersetzt die gelbe Box an derselben Stelle.

**Fotos:** Uploads landen in `src/assets/fotos/uploads/` (im Browser auf max. 2400 px verkleinert, als WebP).
Beim Build bekommt jedes neue Foto automatisch den KustomWork-Look (`scripts/look.mjs`), markiert im EXIF,
damit nichts doppelt gefiltert wird.

## Login

Andy braucht ein **kostenloses GitHub-Konto** und Schreibrechte auf das Repo. Er meldet sich unter /admin
mit «Sign In with GitHub» an. Der Anmelde-Dienst läuft auf unserem eigenen Server, es braucht keinen
weiteren Anbieter.

Einmalig einzurichten (Repo-Inhaber):

1. **Andy einladen:** GitHub > Repo i-Dos/Kustomwork > Settings > Collaborators > Add people (Rolle Write).
2. **OAuth-App anlegen** (pro Adresse eine): GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
   - Vorschau: Homepage `https://kustomwork.ds-709.workers.dev`, Callback `https://kustomwork.ds-709.workers.dev/oauth/callback`
   - Live: Homepage `https://kustomwork.ch`, Callback `https://kustomwork.ch/oauth/callback.php`
   - Danach «Generate a new client secret».
3. **Geheimnisse hinterlegen**
   - Vorschau (Cloudflare): Workers & Pages > kustomwork > Settings > Variables and Secrets:
     `GITHUB_CLIENT_ID` (Text) und `GITHUB_CLIENT_SECRET` (Secret).
   - Live (Infomaniak): Datei `kustomwork-geheim.php` **eine Ebene über dem Web-Ordner** anlegen:
     ```php
     <?php return ['github_client_id' => '…', 'github_client_secret' => '…'];
     ```

Technik: Vorschau `worker/index.js` (Routen `/oauth/auth`, `/oauth/callback`),
Infomaniak `src/pages/oauth/*.php.ts` (erzeugt `/oauth/auth.php`, `/oauth/callback.php`).

## Betrieb auf Infomaniak

Infomaniak-Webhosting liefert nur fertige Dateien aus und baut nichts selbst. Darum baut GitHub Actions
die Seite bei jeder Änderung und lädt sie per SSH/rsync hoch: Vorlage `docs/infomaniak-deploy.yml`
(Anleitung im Kopf der Datei). Dazu im Infomaniak-Manager SSH für das Webhosting aktivieren und einen
SSH-Schlüssel hinterlegen. Ein zusätzliches Infomaniak-Konto für Andy braucht es dafür nicht.

## Version

Sveltia CMS ist in `public/admin/index.html` auf eine feste Version gepinnt. Update: Versionsnummer dort
anpassen und /admin kurz testen.
