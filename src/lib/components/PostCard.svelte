<script lang="ts">
  /**
   * The landing page's picture of an article card: thicket's ItemCard as it
   * looks to a visitor (source line, picture, title, summary, author), with
   * none of what it does in the app (bookmarks, notes, the reader). It lives
   * only inside the phone picture, which can't be tapped, so it needs none of it.
   *
   * Markup and styles follow thicket's packages/web/src/lib/components/ItemCard.svelte.
   * When that card's look changes, change this to match.
   */
  import { noOrphan } from '$lib/orphans';
  import type { RiverItem } from '$lib/api';
  import { hostOf } from '$lib/time';
  import Card from './Card.svelte';
  import CardMeta from './CardMeta.svelte';

  let { item }: { item: RiverItem } = $props();
  let imgFailed = $state(false);
  const source = $derived(item.feedTitle ?? hostOf(item.siteUrl ?? item.url));
</script>

<Card pad={false}>
  <header>
    <CardMeta feedId={item.feedId} hasIcon={item.hasIcon} name={source} when={item.publishedAt} />
  </header>
  <div class="link">
    {#if item.imageUrl && !imgFailed}
      <img class="hero" src={item.imageUrl} alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror={() => (imgFailed = true)} />
    {/if}
    <h3 class="card-title">{noOrphan(item.title ?? item.summary ?? item.url)}</h3>
    {#if item.title && item.summary && item.summary !== item.title}
      <p class="card-summary">{item.summary}</p>
    {/if}
    {#if item.author}
      <footer>{item.author}</footer>
    {/if}
  </div>
</Card>

<style>
  header {
    display: flex; align-items: center; gap: var(--space-2);
    font-size: calc(var(--text-sm) * var(--size-app)); color: var(--text-2);
    padding: var(--space-3) var(--space-2) 0 var(--card-pad); min-width: 0;
  }
  .link { display: block; padding: var(--space-2) var(--card-pad) var(--card-pad); }
  .hero {
    width: calc(100% + var(--card-pad) * 2); max-width: none; margin: 0 calc(var(--card-pad) * -1) var(--space-3); aspect-ratio: 16 / 9; object-fit: cover;
    background: var(--surface-2);
  }
  footer { margin-top: var(--space-3); font-size: calc(var(--text-sm) * var(--size-app)); color: var(--text-2); }
</style>
