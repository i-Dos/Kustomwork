/**
 * GitHub-Login für das Redaktions-Tool auf Infomaniak (PHP ist auf dem Webhosting vorhanden).
 * Gleiches Verhalten wie die Cloudflare-Variante in worker/index.js.
 * Geheimnisse stehen NICHT im Repo, sondern auf dem Server ausserhalb des Web-Ordners:
 *   <eine Ebene über dem Web-Ordner>/kustomwork-geheim.php
 *   <?php return ['github_client_id' => '…', 'github_client_secret' => '…'];
 */
export const gemeinsam = `
declare(strict_types=1);
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
$datei = dirname($_SERVER['DOCUMENT_ROOT']) . '/kustomwork-geheim.php';
$g = is_file($datei) ? require $datei : [];
$id = $g['github_client_id'] ?? '';
$geheim = $g['github_client_secret'] ?? '';
$origin = 'https://' . $_SERVER['HTTP_HOST'];
function antwort(string $status, array $inhalt): void {
  $m = 'authorization:github:' . $status . ':' . json_encode($inhalt, JSON_UNESCAPED_SLASHES);
  $titel = $status === 'success' ? 'Angemeldet, das Fenster schliesst sich.' : 'Anmeldung fehlgeschlagen: ' . htmlspecialchars($inhalt['error'] ?? '');
  header('Content-Type: text/html; charset=utf-8');
  echo '<!doctype html><html lang="de"><meta charset="utf-8"><body style="font:16px system-ui;padding:2rem">' . $titel
    . '<script>(function(){var o=location.origin,m=' . json_encode($m, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . ';'
    . "window.addEventListener('message',function(e){if(e.origin!==o)return;window.opener&&window.opener.postMessage(m,o);setTimeout(function(){window.close()},500)},{once:true});"
    . "window.opener&&window.opener.postMessage('authorizing:github',o);})();</script>";
  exit;
}
if (!$id || !$geheim) antwort('error', ['provider' => 'github', 'error' => 'Login ist noch nicht eingerichtet (kustomwork-geheim.php fehlt).']);
`;
