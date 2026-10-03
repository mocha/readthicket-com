import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * readthicket.com's own pages, server-rendered. In production the thicket app
 * is the front door: it hands this site the paths it owns (see thicket's
 * SITE_URL) and serves everything else itself, so both share one domain.
 *
 * `appDir` is `_site`, not SvelteKit's default `_app`, because the app's own
 * built files already live under /_app on the same domain.
 */
const config = {
  preprocess: vitePreprocess(),
  kit: { adapter: adapter(), appDir: '_site' }
};

export default config;
