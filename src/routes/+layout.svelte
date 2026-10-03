<script lang="ts">
  /**
   * Every page on readthicket.com's own site: the logo, and the way in. The
   * header matches the one thicket draws for signed-out pages, so stepping
   * from here into the app (Log in, a collection) doesn't change the page's frame.
   *
   * Links into the app (/login, /everything, a collection) are ordinary links:
   * they leave this site, so the browser loads them in full.
   */
  import '../app.css';
  import Button from '$lib/components/Button.svelte';
  import Wordmark from '$lib/components/Wordmark.svelte';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();
</script>

<svelte:head><title>thicket</title></svelte:head>

<span class="skip"><Button variant="primary" href="#content">Skip to content</Button></span>

<header>
  <a class="brand tap" href="/"><img src="/icon.svg" alt="" width="32" height="32" /><Wordmark height={27} /></a>
  {#if data.me}
    <span class="auth"><Button link size="lg" href="/everything" data-sveltekit-reload>You’re already logged in <span aria-hidden="true">→</span></Button></span>
  {:else}
    <!-- Sign up jumps to the form at the end of the page. -->
    <span class="auth"><Button href="/login" data-sveltekit-reload>Log in</Button><Button variant="primary" href="#sign-up">Sign up</Button></span>
  {/if}
</header>

<main id="content" tabindex="-1">{@render children()}</main>

<style>
  /* Off the top of the screen until Tab reaches it, then in the top corner above everything. */
  .skip { position: fixed; top: var(--space-2); left: var(--space-2); z-index: 100; transform: translateY(-300%); }
  .skip:focus-within { transform: none; }
  main:focus { outline: none; }
  main {
    max-width: 640px; margin: 0 auto;
    padding: calc(env(safe-area-inset-top, 0px) + var(--space-5)) max(var(--space-3), env(safe-area-inset-right, 0px)) 0 max(var(--space-3), env(safe-area-inset-left, 0px));
  }
  header {
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
    max-width: 640px; margin: 0 auto; padding: var(--space-4) var(--space-3);
    /* A hairline under the logo, running the full width of the window. Drawn as a
       border image pushed out past both sides: it paints edge to edge but, unlike a
       wider box, can't make the page scroll sideways. */
    border-bottom: 1px solid; border-image: linear-gradient(var(--line), var(--line)) 0 0 1 0 / 0 0 1px 0 / 0 100vw;
  }
  /* The logo and the wordmark, the word's tall letters nearly as tall as the logo. */
  .brand { display: flex; align-items: center; gap: calc(var(--space-2) + 2px); color: var(--text); }
  .auth { display: flex; gap: var(--space-2); align-items: center; }
  @media (min-width: 900px) {
    main, header { max-width: 1040px; }
    main { padding: var(--space-5) var(--space-5) 0; }
    header { padding: var(--space-5) var(--space-5) var(--space-4); }
  }
</style>
