import 'server-only';
import type { World } from '../types';
import { KEPT, type Kept, type Store, type User } from './store';

/* A store in the server's memory: for a machine with no database, and for
   the tests. It is gone when the server stops. */

interface Held {
  users: Map<string, User>;
  lists: Record<Kept, Map<string, { id: string }>>;
}

const held = globalThis as { nobetMemory?: Held };

function open(): Held {
  return (held.nobetMemory ??= { users: new Map(), lists: Object.fromEntries(KEPT.map((part) => [part, new Map()])) as Held['lists'] });
}

export function memory(): Store {
  const { users, lists } = open();
  return {
    async userByEmail(email) {
      return [...users.values()].find((user) => user.email === email) ?? null;
    },
    async userById(id) {
      return users.get(id) ?? null;
    },
    async users() {
      return [...users.values()];
    },
    async addUser(user) {
      if ([...users.values()].some((known) => known.email === user.email)) return false;
      users.set(user.id, { ...user });
      return true;
    },
    async saveUser(user) {
      users.set(user.id, { ...user });
    },
    async load() {
      return Object.fromEntries(KEPT.map((part) => [part, [...lists[part].values()]])) as unknown as Pick<World, Kept>;
    },
    async apply(change) {
      for (const part of KEPT) {
        for (const entry of change.put[part] ?? []) lists[part].set(entry.id, structuredClone(entry));
        for (const id of change.drop[part] ?? []) lists[part].delete(id);
      }
    },
  };
}
