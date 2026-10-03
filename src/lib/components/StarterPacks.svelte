<script lang="ts">
  /**
   * "Peek inside": the collections thicket offers newcomers on Explore, each
   * card a link into the app, where anyone can read it without an account.
   *
   * Follows thicket's packages/web/src/lib/components/StarterPacks.svelte as
   * it looks signed out. Copying happens in the app: the button goes to the
   * collection's page with ?copy, which copies it on arrival, by way of Sign
   * up for someone without an account (see thicket's lib/copyintent.svelte.ts).
   */
  import { onMount } from 'svelte';
  import { api, exploreApi, collectionHref, copyNext, profileHref, type ExploreCollection } from '$lib/api';
  import SourceIcon from './SourceIcon.svelte';
  import Card from './Card.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  let { heading, lede, signedIn = false }: { heading: string; lede?: string; signedIn?: boolean } = $props();

  const copyHref = (c: ExploreCollection) => {
    const next = copyNext(c.handle, c.slug, 'starter_card');
    return signedIn ? next : `/signup?next=${encodeURIComponent(next)}`;
  };

  let packs = $state<ExploreCollection[]>([]);
  /** The account these came from, when the instance names one. Worth crediting: it has a profile, and notes and bookmarks on it. */
  let from = $state<string | null>(null);

  onMount(() => {
    exploreApi.featured().then((r) => {
      packs = r.collections.filter((c) => !c.isMine);
      from = r.from;
    }).catch(() => {});
  });
</script>

{#if packs.length}
  <section class="packs">
    <h2>{heading}</h2>
    {#if lede}<p class="lede">{lede}</p>{/if}
    <ul>
      {#each packs as c (c.id)}
        <Card as="li" class="pack">
          <div class="meta">
            <span class="icons" aria-hidden="true">
              {#each c.sample as f (f.id)}<SourceIcon feedId={f.id} hasIcon={f.hasIcon} name={f.title} size={20} />{/each}
            </span>
            <span class="count">{c.feedCount} {c.feedCount === 1 ? 'site' : 'sites'}{#if !from}{' · '}{c.displayName ?? `@${c.handle}`}{/if}</span>
          </div>
          <!-- The name is the link, stretched over the whole card, so the card
               still opens the collection while the button below stays its own control. -->
          <h3 class="card-title"><a class="name" href={collectionHref(c.handle, c.slug)}>{c.name}</a></h3>
          {#if c.description}<p class="card-summary">{c.description}</p>{/if}
          <div class="take">
            <Button variant="secondary" size="sm" href={copyHref(c)} onclick={() => { if (!signedIn) api.event('copy_signup_started', { handle: c.handle, slug: c.slug, from: 'starter_card' }); }}>
              <Icon name="copy" size={16} />Copy to my collections
            </Button>
          </div>
        </Card>
      {/each}
    </ul>
    {#if from}
      <p class="from">These are <a href={profileHref(from)}>@{from}</a>’s collections.</p>
    {/if}
  </section>
{/if}

<style>
  .packs { margin: 0; }
  h2 { font-family: var(--font-headings); font-size: calc(var(--text-2xl) * var(--size-headings)); margin: 0 0 var(--space-1); }
  /* With no lede, the heading needs its own room above the cards. */
  h2 + ul { margin-top: var(--space-4); }
  .lede { margin: 0 0 var(--space-4); color: var(--text-2); font-size: calc(var(--text-base) * var(--size-app)); max-width: 60ch; }
  /* As many columns as fit, with every card wide enough for its small line of
     icons, count, and name. Counted from the space the list really has, not the window. */
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(17rem * var(--size-app))), 1fr)); }
  ul :global(.pack) { display: flex; flex-direction: column; }
  /* Pressing the button presses the button, not the card. */
  ul :global(.pack:has(.take:active)) { transform: none; }
  /* The same small line an article card opens with: 14px, secondary ink. */
  .meta { display: flex; align-items: center; gap: var(--space-2); min-width: 0; color: var(--text-2); font-size: calc(var(--text-sm) * var(--size-app)); }
  /* Side by side, not stacked: site icons are rounded squares, and overlapping
     them clips their letters. */
  .icons { display: flex; flex: none; gap: var(--space-1); }
  /* One line, like an article card's: a long name trails off rather than wrapping. */
  .count { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  /* Written as "after the small line" so it outranks the shared card title's own zero margin. */
  .meta + .card-title { margin-top: var(--space-2); }
  .name { color: inherit; text-decoration: none; }
  /* The article card's cue that the card opens something: the title underlines
     softly while the pointer is anywhere on the card but the button. */
  @media (hover: hover) { .name:hover { text-decoration: underline; text-decoration-color: var(--text-3); text-underline-offset: 3px; } }
  .name::after { content: ''; position: absolute; inset: 0; }
  .name:focus-visible { outline: none; }
  ul :global(.pack:has(.name:focus-visible)) { outline: 2px solid var(--accent); outline-offset: 2px; }
  /* Pinned to the bottom so the buttons line up across a row of uneven cards,
     and lifted above the stretched link so a tap lands on the button. */
  .take { margin-top: auto; padding-top: var(--space-3); position: relative; z-index: 1; }
  .from { margin: var(--space-4) 0 0; color: var(--text-2); font-size: calc(var(--text-sm) * var(--size-app)); line-height: 1.5; max-width: 62ch; }
  .from a { color: var(--accent); font-weight: 600; }
</style>
