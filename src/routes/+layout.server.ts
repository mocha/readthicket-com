import type { LayoutServerLoad } from './$types';
import { signedInHandle } from '$lib/server/thicket';

export const load: LayoutServerLoad = async ({ request }) => ({
  me: await signedInHandle(request.headers.get('cookie'))
});
