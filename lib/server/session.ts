import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { configured, store, type User } from './store';

/* Who is signed in. The session is a signed token in a cookie that scripts
   on the page cannot read, sent only to this site, and only over HTTPS once
   the site is deployed. It names the account and nothing else: what the
   account may do is looked up each time. */

const COOKIE = 'nobet';
const MONTH = 60 * 60 * 24 * 30;

const held = globalThis as { nobetSecret?: Uint8Array };

function secret() {
  // the memory store is for one machine and one run, so its secret can be made up on the spot
  if (configured() === 'memory' && !process.env.NOBET_SECRET) return (held.nobetSecret ??= crypto.getRandomValues(new Uint8Array(32)));
  return new TextEncoder().encode(process.env.NOBET_SECRET ?? '');
}

export async function open(user: User) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime(`${MONTH}s`).sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: MONTH });
}

export async function shut() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in account, or nobody. */
export async function who(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
    if (!payload.sub) return null;
    return (await (await store())?.userById(payload.sub)) ?? null;
  } catch {
    return null;
  }
}
