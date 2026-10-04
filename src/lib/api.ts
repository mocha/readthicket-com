/**
 * The few things this site asks of the thicket app, from the browser. The app
 * shares this site's domain, so these are plain same-origin requests and the
 * visitor's cookie rides along. Shapes match thicket's packages/web/src/lib/api.ts;
 * only what these pages use is here.
 */

export type RiverItem = {
  id: number; feedId: number; feedTitle: string | null; siteUrl: string | null;
  feedSlug: string;
  url: string | null; title: string | null; author: string | null; summary: string | null;
  linkUrl: string | null; linkLabel: string | null;
  imageUrl: string | null; publishedAt: string; hasIcon: boolean;
};
export type RiverPage = { items: RiverItem[]; nextCursor: string | null };

export type ExploreCollection = {
  id: number; name: string; slug: string; description: string | null; handle: string; displayName: string | null; feedCount: number;
  sample: { id: number; title: string | null; hasIcon: boolean }[];
};

export type Me = { handle: string };

export class ApiError extends Error {
  constructor(message: string, public status: number, public field?: string) { super(message); }
}

async function j<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { headers: { 'content-type': 'application/json' }, ...init });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.error ?? `HTTP ${res.status}`, res.status, body.field);
  return body as T;
}

export const api = {
  river: (opts: { collection?: number | null; limit?: number } = {}) => {
    const q = new URLSearchParams();
    if (opts.collection) q.set('collection', String(opts.collection));
    if (opts.limit) q.set('limit', String(opts.limit));
    return j<RiverPage>(`/api/river?${q}`);
  },
  event: (kind: string, payload: Record<string, unknown> = {}) => {
    // Fire and forget; analytics must never slow the page or surface errors.
    void fetch('/api/events', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind, payload }), keepalive: true }).catch(() => {});
  }
};

export const exploreApi = {
  featured: () => j<{ from: string | null; collections: (ExploreCollection & { isMine: boolean })[] }>('/api/explore/featured')
};

export const authApi = {
  signup: (handle: string, password: string, email: string) => j<Me>('/api/auth/signup', { method: 'POST', body: JSON.stringify({ handle, password, email }) })
};

export const iconUrl = (feedId: number) => `/api/feeds/${feedId}/icon`;
export const profileHref = (handle: string) => `/@${handle}`;
export const collectionHref = (handle: string, slug: string) => `/@${handle}/collections/${slug}`;

/** The handle rules, word for word what the server says when it turns a handle down. */
export const HANDLE_RULES = 'A handle needs 2 to 30 characters and must start with a letter or number. You can use lowercase letters, numbers, hyphens, and/or underscores.';

/**
 * Where to send someone to copy a collection: its page with `?copy`, which
 * copies it on arrival. Matches copyNext in thicket's lib/copyintent.svelte.ts.
 */
export const copyNext = (handle: string, slug: string, from: string) =>
  `/@${encodeURIComponent(handle)}/collections/${encodeURIComponent(slug)}?copy=${encodeURIComponent(from)}`;

export const contactApi = {
  /**
   * Send a message from the Contact page. It goes to this site's own server
   * (src/routes/contact/send/+server.ts), not the app. `website` is the hidden box
   * only scripts fill in.
   */
  send: (name: string, email: string, message: string, website: string) =>
    j<{ ok: true }>('/contact/send', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ name, email, message, website }) })
};
