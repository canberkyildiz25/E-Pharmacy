import 'server-only';
import { overlay, type Change } from '../rules';
import { SEED } from '../seed';
import type { Part, Person, World } from '../types';
import { memory } from './memory';
import { mongo, reach } from './mongo';

/* Where accounts and everything they make live when the site has a server
   behind it.

   There are three answers, chosen by the environment:

   - MONGODB_URI is set: MongoDB.
   - NOBET_DB=memory: a store that lives in the server's memory and is gone
     when it stops. It is for running the whole thing end to end on a
     machine with no database, and for the tests.
   - neither: none. The API says so, and the site keeps everything in the
     visitor's browser instead.

   The store is plain: it keeps accounts, and it keeps lists of things by
   their id. What may be kept, and by whom, is decided in rules.ts. It reads
   whole lists, which suits a demonstration and a few hundred orders, and
   would want paging before it met a real city. */

export interface User extends Person {
  hash: string;
}

/** The lists the store keeps, apart from the accounts. */
export type Kept = Exclude<Part, 'people'>;
export const KEPT: Kept[] = ['pharmacies', 'medicines', 'shelf', 'orders', 'reviews', 'suppliers'];

export interface Store {
  userByEmail(email: string): Promise<User | null>;
  userById(id: string): Promise<User | null>;
  users(): Promise<User[]>;
  /** False when the address already has an account. */
  addUser(user: User): Promise<boolean>;
  saveUser(user: User): Promise<void>;
  /** Everything in the lists. */
  load(): Promise<Pick<World, Kept>>;
  /** Keeps what a change puts and removes what it drops. */
  apply(change: Change): Promise<void>;
}

export type Db = 'mongo' | 'memory' | 'none';

/** A database needs a secret to sign sessions with. Without one it is treated as not there. */
const secretSet = () => (process.env.NOBET_SECRET ?? '').length >= 32;

let warned = false;

export function configured(): Db {
  if (process.env.MONGODB_URI) {
    if (secretSet()) return 'mongo';
    if (!warned) {
      warned = true;
      console.error('Nobet: MONGODB_URI is set but NOBET_SECRET is missing or shorter than 32 characters. Running without a database.');
    }
    return 'none';
  }
  return process.env.NOBET_DB === 'memory' ? 'memory' : 'none';
}

/* A database that is configured but cannot be reached (asleep, paused, wrong
   address) is worse than none: every page would wait on it and fail. So the
   answer is checked, and remembered for half a minute. */
let checked = { at: 0, up: false };

export async function db(): Promise<Db> {
  const kind = configured();
  if (kind !== 'mongo') return kind;
  if (Date.now() - checked.at > 30_000) checked = { at: Date.now(), up: await reach() };
  return checked.up ? 'mongo' : 'none';
}

export async function store(): Promise<Store | null> {
  const kind = await db();
  if (kind === 'mongo') return mongo();
  if (kind === 'memory') return memory();
  return null;
}

export const shown = ({ id, name, email, role, pharmacyId, made }: User): Person => ({ id, name, email, role, ...(pharmacyId ? { pharmacyId } : {}), made });

/* The examples under everything the database holds. The demonstration's own
   orders and accounts are left out: on a real server nobody can sign in as
   them. */
const UNDER: World = { ...SEED, orders: [], people: [] };

export async function world(from: Store): Promise<World> {
  const [kept, users] = await Promise.all([from.load(), from.users()]);
  return overlay(UNDER, { ...kept, people: users.map(shown) });
}
