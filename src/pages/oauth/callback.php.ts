import { gemeinsam } from './_php';
// Erzeugt /oauth/callback.php (Infomaniak): tauscht den Code gegen ein Token und meldet es dem Redaktions-Tool
export function GET() {
  return new Response(`<?php
// Automatisch erzeugt (src/pages/oauth/callback.php.ts). Nicht von Hand bearbeiten.
${gemeinsam}
$code = (string)($_GET['code'] ?? '');
$state = (string)($_GET['state'] ?? '');
if (!$code || !$state || !hash_equals((string)($_COOKIE['cms_state'] ?? ''), $state)) antwort('error', ['provider' => 'github', 'error' => 'Ungültige Anfrage, bitte nochmals anmelden.']);
$ctx = stream_context_create(['http' => [
  'method' => 'POST',
  'header' => "Accept: application/json\\r\\nContent-Type: application/json\\r\\nUser-Agent: kustomwork-cms-login\\r\\n",
  'content' => json_encode(['client_id' => $id, 'client_secret' => $geheim, 'code' => $code, 'redirect_uri' => $origin . '/oauth/callback.php']),
  'timeout' => 15,
]]);
$daten = json_decode((string)@file_get_contents('https://github.com/login/oauth/access_token', false, $ctx), true) ?: [];
if (empty($daten['access_token'])) antwort('error', ['provider' => 'github', 'error' => $daten['error_description'] ?? 'Kein Token erhalten.']);
antwort('success', ['provider' => 'github', 'token' => $daten['access_token']]);
`);
}
