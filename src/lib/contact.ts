/** The Contact page's limits, shared by the form and the server that sends it. */

/** A Contact message: a letter, so more room than a note. */
export const CONTACT_LIMIT = 5_000;
/** The name on a Contact message. */
export const CONTACT_NAME_LIMIT = 100;

/** A loose check: something@something.something, no spaces. Matches thicket's lib/mail.ts. */
export const looksLikeEmail = (s: string) => s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
