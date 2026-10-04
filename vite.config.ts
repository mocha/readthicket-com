import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/**
 * In dev, this site runs beside thicket's own dev server (http://localhost:5173
 * unless THICKET_URL says otherwise). What the app owns on the shared domain
 * (its API, fonts, icons) is passed through to it, so the pages work as they
 * will in production. Any other path this site doesn't have is sent to the app
 * by src/hooks.server.ts.
 */
const thicket = process.env.THICKET_URL ?? 'http://localhost:5173';
const app = { target: thicket, changeOrigin: true };

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: { '/api': app, '/fonts': app, '/icon.svg': app, '/icon-large.svg': app, '/favicon.ico': app, '/favicon-96x96.png': app, '/apple-touch-icon.png': app, '/manifest.webmanifest': app }
  }
});
