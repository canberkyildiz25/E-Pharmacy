import 'server-only';
import { seenBy } from '../rules';
import type { Person, World } from '../types';
import { shown, world, type Store, type User } from './store';

/** What goes back to the browser after anything has happened: who it is, and what they may see. */
export async function seen(store: Store, user: User | null): Promise<{ me: Person | null; world: World }> {
  const me = user ? shown(user) : null;
  return { me, world: seenBy(await world(store), me) };
}
