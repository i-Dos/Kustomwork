// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const PREVIEW = process.env.PREVIEW === 'true';
const SITE_URL = 'https://kustomwork.ch'; // gleich wie site.url in src/config/site.ts

/**
 * Schreibt nach dem Build eine .htaccess für Infomaniak (Apache):
 * HTTPS-Weiterleitung, Caching, Sicherheits-Header und im Vorschau-Modus X-Robots-Tag: noindex.
 */
function htaccess() {
  return {
    name: 'htaccess',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const lines = [
          '# Automatisch erzeugt beim Build (astro.config.mjs)',
          'Options -Indexes',
          'ErrorDocument 404 /404.html',
          '',
          '<IfModule mod_rewrite.c>',
          '  RewriteEngine On',
          '  RewriteCond %{HTTPS} off',
          '  RewriteCond %{HTTP:X-Forwarded-Proto} !https',
          '  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
          '  # www -> ohne www',
          '  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]',
          '  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]',
          '</IfModule>',
          '',
          '<IfModule mod_headers.c>',
          '  Header set X-Content-Type-Options "nosniff"',
          '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
          '  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"',
          '  <FilesMatch "\\.(avif|webp|jpg|jpeg|png|svg|woff2|css|js)$">',
          '    Header set Cache-Control "public, max-age=31536000, immutable"',
          '  </FilesMatch>',
          '  <FilesMatch "\\.(html|xml|txt|webmanifest)$">',
          '    Header set Cache-Control "public, max-age=0, must-revalidate"',
          '  </FilesMatch>',
          '  <FilesMatch "^sw\\.js$">',
          '    Header set Cache-Control "no-cache"',
          '  </FilesMatch>',
          PREVIEW ? '  Header set X-Robots-Tag "noindex, nofollow"' : '',
          '</IfModule>',
          '',
          '<IfModule mod_deflate.c>',
          '  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/plain application/xml',
          '</IfModule>',
          '',
          'AddType application/manifest+json .webmanifest',
        ];
        if (PREVIEW) {
          lines.push(
            '',
            '# VORSCHAU: Passwortschutz am einfachsten im Infomaniak Manager einrichten',
            '# (Webhosting > Website > Verzeichnisschutz). Alternativ hier:',
            '# AuthType Basic',
            '# AuthName "Vorschau"',
            '# AuthUserFile /home/clients/<id>/.htpasswd',
            '# Require valid-user',
          );
        }
        await writeFile(new URL('.htaccess', dir), lines.join('\n') + '\n');
      },
    },
  };
}

export default defineConfig({
  // Fertig optimierte Bilder (AVIF/WebP) liegen im Repo, damit Cloudflare sie nicht
  // bei jedem Build neu rechnen muss (sonst über 10 Minuten). Aufräumen: npm run bildcache:neu
  cacheDir: './.bildcache',
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !['/kontakt/danke/', '/impressum/', '/datenschutz/', '/offline/'].some((p) => page.includes(p)),
    }),
    htaccess(),
  ],
  vite: {
    define: {
      'import.meta.env.PREVIEW': JSON.stringify(PREVIEW ? 'true' : 'false'),
    },
  },
});
