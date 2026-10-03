import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

/**
 * Dev only: a path this site doesn't have belongs to the app (/login,
 * /everything, /@handle…), so send the browser there. In production the app is
 * the front door and never hands this site those paths.
 */
const thicket = env.THICKET_URL ?? 'http://localhost:5173';

export const handle: Handle = async ({ event, resolve }) => {
  const res = await resolve(event);
  if (dev && res.status === 404) return Response.redirect(new URL(event.url.pathname + event.url.search, thicket), 302);
  return res;
};
