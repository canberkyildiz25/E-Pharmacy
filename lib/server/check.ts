import 'server-only';
import type { Role } from '../types';
import { Bad } from './guard';

/* What somebody sends to make an account or to sign in. Everything else that
   is sent to the site is checked by the rules themselves. */

function clean(value: unknown, what: string, least: number, most: number) {
  if (typeof value !== 'string') throw new Bad(`${what} is missing.`);
  const text = [...value]
    .filter((letter) => letter.charCodeAt(0) > 31 && letter.charCodeAt(0) !== 127)
    .join('')
    .trim();
  if (text.length < least) throw new Bad(`${what} is missing or too short.`);
  if (text.length > most) throw new Bad(`${what} is too long.`);
  return text;
}

export function account(input: Record<string, unknown>, joining: boolean) {
  const email = clean(input.email, 'The email address', 5, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Bad('That does not look like an email address.');
  if (typeof input.password !== 'string' || !input.password) throw new Bad('The password is missing.');
  // bcrypt reads the first 72 bytes of a password and ignores the rest, so a longer one is refused, not cut
  if (joining && (input.password.length < 8 || new TextEncoder().encode(input.password).length > 72)) throw new Bad('Use a password of between 8 and 72 characters.');
  const role: Exclude<Role, 'admin'> = input.role === 'pharmacist' ? 'pharmacist' : 'customer';
  return { email, password: input.password, name: joining ? clean(input.name, 'Your name', 2, 60) : '', role };
}
