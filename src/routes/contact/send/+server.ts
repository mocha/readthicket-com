/**
 * The Contact page's form sends here (POST /contact/send), for anyone, signed in or not. What
 * they write is emailed to our inbox (CONTACT_TO) with their address as the
 * reply address, so answering is pressing Reply.
 *
 * Nothing is saved: the email is the record. So the answer waits for the
 * mail to go out, and when it doesn't, the person is told, and still has
 * their words in the form to send again. The real reason is in the log.
 *
 * Moved from thicket's routes/contact.ts (issue #159), which never shipped.
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CONTACT_LIMIT, CONTACT_NAME_LIMIT, looksLikeEmail } from '$lib/contact';
import { CONTACT_TO, send } from '$lib/server/mail';
import { clientKey, hit } from '$lib/server/ratelimit';
import { signedInHandle } from '$lib/server/thicket';

/** One line, so a name can't add lines of its own to the email's subject or headers. */
const oneLine = (raw: unknown) => (typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim() : '');

/** Per address. Each message lands in our inbox; a person writing twice fits, a script filling it doesn't. */
const PER_HOUR = 5;

/**
 * Body: { name?, email, message, website? }. `website` is a box people never
 * see; only a script fills it in, and what it sends is answered as if it
 * went and dropped.
 */
export const POST: RequestHandler = async ({ request }) => {
  type Body = { name?: unknown; email?: unknown; message?: unknown; website?: unknown };
  const payload = await request.json().catch(() => ({})) as Body;
  if (typeof payload.website === 'string' && payload.website.trim()) return json({ ok: true }, { status: 201 });
  const name = oneLine(payload.name);
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!looksLikeEmail(email)) return json({ error: 'Enter your email, so we can write back.', field: 'email' }, { status: 400 });
  if (!message) return json({ error: 'Write a message first.', field: 'message' }, { status: 400 });
  if (message.length > CONTACT_LIMIT) return json({ error: `That’s longer than ${CONTACT_LIMIT.toLocaleString('en-US')} characters. Trim it a little, or send it in two parts.`, field: 'message' }, { status: 400 });
  if (name.length > CONTACT_NAME_LIMIT) return json({ error: 'That name is too long.', field: 'name' }, { status: 400 });
  const pace = hit(`contact:${clientKey(request.headers)}`, PER_HOUR, 60 * 60_000);
  if (!pace.ok) {
    const mins = Math.ceil(pace.retryAfterS / 60);
    return json({ error: `That’s a lot of messages from here. Try again in ${mins === 1 ? 'a minute' : `${mins} minutes`}.` }, { status: 429, headers: { 'retry-after': String(pace.retryAfterS) } });
  }
  const failed = () => json({ error: 'We couldn’t send your message. Try again in a little while.' }, { status: 502 });
  if (!CONTACT_TO) {
    console.error('[contact] a message couldn’t be sent: CONTACT_TO is unset.');
    return failed();
  }
  const handle = await signedInHandle(request.headers.get('cookie'));
  const from = [name || 'Someone', `<${email}>`, handle ? `(signed in as @${handle})` : null].filter(Boolean).join(' ');
  const sent = await send({ to: CONTACT_TO, replyTo: email, subject: `thicket contact: ${name || email}`, text: `${message}\n\n— ${from}\nSent from the Contact page. Reply to this email to answer them.` });
  return sent ? json({ ok: true }, { status: 201 }) : failed();
};
