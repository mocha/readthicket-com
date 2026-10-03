<script lang="ts">
  /** readthicket.com's front door. Everything else a reader does is in the app, at /everything. */
  import Landing from '$lib/components/Landing.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const title = 'thicket · Read the web on your own terms';
  const description = 'Read the web on your own terms. Follow the sites you like and get every new post in one place, newest first. No ranking, no ads, nothing about you for sale.';
  const url = 'https://readthicket.com';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:site_name" content="thicket" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta name="twitter:card" content="summary" />
  <link rel="canonical" href={url} />
</svelte:head>

<Landing signedIn={!!data.me} />
