import { gemeinsam } from './_php';
// Erzeugt /oauth/auth.php (Infomaniak): leitet zur GitHub-Anmeldung weiter
export function GET() {
  return new Response(`<?php
// Automatisch erzeugt (src/pages/oauth/auth.php.ts). Nicht von Hand bearbeiten.
${gemeinsam}
$state = bin2hex(random_bytes(16));
setcookie('cms_state', $state, ['expires' => time() + 600, 'path' => '/oauth', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
$scope = preg_replace('/[^a-z_,: ]/', '', (string)($_GET['scope'] ?? 'repo')) ?: 'repo';
header('Location: https://github.com/login/oauth/authorize?' . http_build_query([
  'client_id' => $id, 'scope' => $scope, 'state' => $state, 'redirect_uri' => $origin . '/oauth/callback.php',
]), true, 302);
`);
}
