/**
 * Erzeugt beim Build /anfrage.php für Infomaniak (PHP ist auf dem Webhosting vorhanden).
 * Versand über PHP mail() an site.form.to, Antwort-Adresse = Absender der Anfrage.
 * Auf statischen Vorschau-Hosts ohne PHP funktioniert das Formular nicht.
 */
import { site } from '../config/site';

export function GET() {
  const cfg = JSON.stringify({ to: site.form.to, from: site.form.from, subject: site.form.subject, thanks: site.form.thanksPath, name: site.name });
  const php = `<?php
// Automatisch erzeugt (src/pages/anfrage.php.ts). Nicht von Hand bearbeiten.
declare(strict_types=1);
$cfg = json_decode('${cfg.replace(/'/g, "\\'")}', true);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: /kontakt/'); exit; }
// Honeypot: Bots füllen das versteckte Feld aus
if (!empty($_POST['website'])) { header('Location: ' . $cfg['thanks']); exit; }
function feld(string $k, int $max = 2000): string { return trim(mb_substr(strip_tags((string)($_POST[$k] ?? '')), 0, $max)); }
$name = feld('name', 120);
$email = filter_var(feld('email', 200), FILTER_VALIDATE_EMAIL);
$nachricht = feld('nachricht', 5000);
if (!$name || !$email || !$nachricht || empty($_POST['datenschutz'])) {
  http_response_code(400);
  echo '<!doctype html><meta charset="utf-8"><p>Bitte Name, gültige E-Mail und Nachricht angeben. <a href="javascript:history.back()">Zurück</a></p>';
  exit;
}
$zeilen = [
  'Thema: ' . feld('thema', 100),
  'Name: ' . $name,
  'E-Mail: ' . $email,
  'Telefon: ' . feld('telefon', 50),
  'Bike: ' . feld('bike', 200),
  '',
  $nachricht,
  '',
  '---',
  'Herkunft: ' . feld('quelle', 500),
  'Gesendet: ' . date('d.m.Y H:i'),
];
$headers = [
  'From: ' . $cfg['name'] . ' Website <' . $cfg['from'] . '>',
  'Reply-To: ' . str_replace(["\\r", "\\n"], '', $name) . ' <' . $email . '>',
  'Content-Type: text/plain; charset=UTF-8',
];
$betreff = '=?UTF-8?B?' . base64_encode($cfg['subject'] . ': ' . feld('thema', 100)) . '?=';
$ok = mail($cfg['to'], $betreff, implode("\\n", $zeilen), implode("\\r\\n", $headers));
header('Location: ' . ($ok ? $cfg['thanks'] : '/kontakt/?fehler=1'));
`;
  return new Response(php, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
