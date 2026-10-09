import 'server-only';
import { Bad } from './guard';
import { who } from './session';
import { store, type Store, type User } from './store';

/** The database, or a plain answer that there is none. */
export async function needStore(): Promise<Store> {
  const found = await store();
  if (!found) throw new Bad('There is no database behind this site. It keeps everything in your browser instead.', 503);
  return found;
}

/** The signed-in account, or a plain answer that nobody is signed in. */
export async function needUser(): Promise<User> {
  const user = await who();
  if (!user) throw new Bad('Sign in first.', 401);
  return user;
}
