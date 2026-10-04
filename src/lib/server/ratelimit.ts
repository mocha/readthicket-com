/**
 * A small in-memory limit, per visitor address, the way thicket's
 * lib/ratelimit.ts counts. One process, so memory is enough; a restart
 * forgets, which is fine for a limit this loose.
 */
type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

export function hit(key: string, limit: number, windowMs: number): { ok: true } | { ok: false; retryAfterS: number } {
  const now = Date.now();
  if (windows.size > 10_000) for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
  const w = windows.get(key);
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (w.count >= limit) return { ok: false, retryAfterS: Math.ceil((w.resetAt - now) / 1000) };
  w.count += 1;
  return { ok: true };
}

/**
 * Who's asking: the visitor's address as the proxies in front report it.
 * Requests reach this site through the thicket app, which passes those
 * headers along unchanged. Matches clientKey in thicket's lib/ratelimit.ts.
 */
export function clientKey(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  return headers.get('cf-connecting-ip') ?? headers.get('x-real-ip') ?? (xff ? xff.split(',')[0].trim() : null) ?? 'unknown';
}
