import { env } from '$env/dynamic/private';

/**
 * Where this site's server reaches the thicket app: its private address in
 * production (THICKET_URL), thicket's dev server otherwise. Browsers never use
 * it; they reach the app on the shared domain.
 */
export const THICKET_URL = (env.THICKET_URL ?? 'http://localhost:5173').replace(/\/+$/, '');

/**
 * Who's signed in, asked of the app with the visitor's own cookie, so the
 * header knows whether to offer Sign up or the way back in. Null for a visitor
 * without an account, and also when the app can't be reached: the page still
 * renders, offering sign up.
 */
export async function signedInHandle(cookie: string | null): Promise<string | null> {
  if (!cookie) return null;
  try {
    const res = await fetch(`${THICKET_URL}/api/auth/me`, { headers: { cookie, accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const me = (await res.json()) as { handle?: string };
    return me.handle ?? null;
  } catch {
    return null;
  }
}
