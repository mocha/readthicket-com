import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

/**
 * Sending email from this site: one message, what someone wrote on the
 * Contact page, to our own inbox. Same SMTP account as the thicket app
 * (SMTP_URL; on Railway, a reference to the app's), same From line.
 *
 * CONTACT_TO is that inbox. It is a setting so the address stays out of the
 * code and never appears on the site.
 */
const SMTP_URL = env.SMTP_URL?.trim() || undefined;
const MAIL_FROM = env.MAIL_FROM?.trim() || 'thicket <no-reply@readthicket.com>';
export const CONTACT_TO = env.CONTACT_TO?.trim() || undefined;

const transport = SMTP_URL ? nodemailer.createTransport(SMTP_URL) : null;

if (!SMTP_URL) console.error('[contact] SMTP_URL is unset: the Contact page can’t deliver messages until it is.');
if (!CONTACT_TO) console.error('[contact] CONTACT_TO is unset: the Contact page can’t deliver messages until it is.');

export type Message = { to: string; subject: string; text: string; replyTo?: string };

export async function send(msg: Message): Promise<boolean> {
  if (!transport) {
    console.error(`[mail] sending "${msg.subject}" failed: SMTP_URL is unset`);
    return false;
  }
  try {
    await transport.sendMail({ from: MAIL_FROM, ...msg });
    return true;
  } catch (e) {
    console.error(`[mail] sending "${msg.subject}" failed:`, e instanceof Error ? e.message : e);
    return false;
  }
}
