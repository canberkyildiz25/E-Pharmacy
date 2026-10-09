/* What the browser keeps, and the one place the pages change anything.

   The site runs in one of two ways, and asks the server which:

   - local: there is no database. Accounts, shelves, orders and reviews are
     kept in this browser's storage, laid over the examples that ship with the
     site. This is how the public demonstration runs, and it is why one
     browser can be the customer, the pharmacist and the administrator in turn.
   - remote: a database is connected. Every action goes to the API, which
     applies the same rules and sends back what this account may see.

   Either way the rules are the ones in rules.ts, and the basket and where the
   visitor is are kept here, because they belong to the browser. */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { HOME, type Point } from './places';
import { act, EMPTY, overlay, Refused, seenBy, type Action, type Change } from './rules';
import { DEMO, SEED } from './seed';
import { PARTS, type Person, type Role, type World } from './types';

export { Refused };

interface Account extends Person {
  salt: string;
  hash: string;
}

export interface Basket {
  pharmacyId: string;
  lines: { medicineId: string; qty: number }[];
}

interface State {
  /** True once the stored state has been read; before that, pages show the examples alone. */
  ready: boolean;
  mode: 'local' | 'remote';
  me: Person | null;
  accounts: Account[];
  /** What this browser has added or changed, over the examples. */
  kept: Partial<World>;
  /** What it has taken away from them. */
  gone: Change['drop'];
  /** What the server last said this account may see. */
  remote: World | null;
  basket: Basket | null;
  district: string;
  /** Where the visitor said they are, when they have said. */
  point: Point | null;
}

/* A browser gives a site a few megabytes. When there is no room left the
   write is dropped, and the action that caused it finds out and says so. */
let full = false;
const room = {
  getItem: (name: string) => localStorage.getItem(name),
  removeItem: (name: string) => localStorage.removeItem(name),
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
      full = false;
    } catch {
      full = true;
    }
  },
};

export const useStore = create<State>()(
  persist((): State => ({ ready: false, mode: 'local', me: null, accounts: [], kept: {}, gone: {}, remote: null, basket: null, district: HOME, point: null }), {
    name: 'nobet',
    version: 1,
    storage: createJSONStorage(() => room),
    skipHydration: true,
    partialize: (state) => ({ me: state.me, accounts: state.accounts, kept: state.kept, gone: state.gone, basket: state.basket, district: state.district, point: state.point }),
  }),
);

const set = useStore.setState;
const get = useStore.getState;

const token = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (byte) => byte.toString(16).padStart(2, '0')).join('');

/* A demo account's password never leaves the browser, and is not kept as
   typed: it is stretched with PBKDF2 and only the result is stored. */
async function stretch(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120_000 }, key, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function ask<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  });
  const answer = (await response.json().catch(() => ({}))) as { message?: string } & T;
  if (!response.ok) throw new Refused(answer.message ?? 'That did not go through. Try again in a moment.', response.status);
  return answer;
}

const person = ({ id, name, email, role, pharmacyId, made }: Account): Person => ({ id, name, email, role, pharmacyId, made });

/** Everything this browser knows, before it is cut down to what one account may see. */
function whole(state: State): World {
  const laid = overlay(SEED, state.kept, state.gone);
  return { ...laid, people: [...state.accounts.map(person), ...laid.people.filter((entry) => !state.accounts.some((account) => account.id === entry.id))] };
}

/** The world as the signed-in account may see it. */
export function worldOf(state: State): World {
  if (!state.ready) return seenBy(SEED, null);
  if (state.mode === 'remote') return state.remote ?? seenBy(overlay(SEED, { orders: [], people: [] }), null);
  return seenBy(whole(state), state.me);
}

/* ---------- starting up ---------- */

let started: Promise<void> | null = null;

/** Reads what the browser has kept, then asks the server how the site is running. */
export function start() {
  started ??= (async () => {
    await useStore.persist.rehydrate();
    try {
      const { db } = await ask<{ db: string }>('/api/status/', 'GET');
      if (db !== 'none') {
        const { me, world } = await ask<{ me: Person | null; world: World }>('/api/world/', 'GET');
        set({ mode: 'remote', me, remote: world });
      }
    } catch {
      // no answer: carry on with what the browser has
    }
    set({ ready: true });
  })();
  return started;
}

/* ---------- accounts ---------- */

export async function join(name: string, email: string, password: string, role: Exclude<Role, 'admin'>) {
  const address = email.trim().toLowerCase();
  if (get().mode === 'remote') {
    const answer = await ask<{ me: Person; world: World }>('/api/auth/join/', 'POST', { name, email: address, password, role });
    set({ me: answer.me, remote: answer.world });
    return;
  }
  if (address.endsWith('.example') || get().accounts.some((account) => account.email === address)) throw new Refused('There is already an account with that address in this browser. Sign in instead.');
  const salt = token();
  const account: Account = { id: token(), name: name.trim(), email: address, role, made: Date.now(), salt, hash: await stretch(password, salt) };
  set((state) => ({ accounts: [...state.accounts, account], me: person(account) }));
}

export async function signIn(email: string, password: string) {
  const address = email.trim().toLowerCase();
  if (get().mode === 'remote') {
    const answer = await ask<{ me: Person; world: World }>('/api/auth/sign-in/', 'POST', { email: address, password });
    set({ me: answer.me, remote: answer.world });
    return;
  }
  const account = get().accounts.find((candidate) => candidate.email === address && candidate.hash);
  // the same answer for a wrong address and a wrong password
  if (!account || (await stretch(password, account.salt)) !== account.hash) throw new Refused('That address and password do not match an account in this browser.');
  set({ me: person(account) });
}

/** One of the three accounts behind the demonstration. They have no password, and exist only without a database. */
export function demo(role: Role) {
  if (get().mode === 'remote') throw new Refused('The demonstration accounts are only for the site without a database.');
  const state = get();
  const known = whole(state).people.find((entry) => entry.id === DEMO[role]);
  if (known) set({ me: known });
}

export async function signOut() {
  if (get().mode === 'remote') {
    const answer = await ask<{ world: World }>('/api/auth/sign-out/', 'POST').catch(() => null);
    set({ me: null, remote: answer?.world ?? get().remote });
    return;
  }
  set({ me: null });
}

/* ---------- doing things ---------- */

/** Does one thing by the rules, here or on the server, and returns the id of what it was about. */
export async function run(action: Action): Promise<string | undefined> {
  const state = get();
  if (state.mode === 'remote') {
    const answer = await ask<{ made?: string; me: Person | null; world: World }>('/api/act/', 'POST', action);
    set({ me: answer.me, remote: answer.world });
    return answer.made;
  }
  const change = act(whole(state), state.me, action, Date.now(), token);
  const before = { kept: state.kept, gone: state.gone, me: state.me, accounts: state.accounts };
  const kept: Partial<World> = { ...state.kept };
  const gone: Change['drop'] = { ...state.gone };
  for (const part of PARTS) {
    // accounts are kept in their own list, with what signs them in
    if (part === 'people') continue;
    const put = change.put[part] as { id: string }[] | undefined;
    const drop = change.drop[part];
    if (!put && !drop) continue;
    const ids = new Set([...(put ?? []).map((entry) => entry.id), ...(drop ?? [])]);
    const rest = ((kept[part] ?? []) as { id: string }[]).filter((entry) => !ids.has(entry.id));
    (kept as Record<string, unknown>)[part] = [...(put ?? []), ...rest];
    if (drop) gone[part] = [...new Set([...(gone[part] ?? []), ...drop])];
    // a thing that is kept again is no longer gone
    if (put && gone[part]) gone[part] = gone[part]!.filter((id) => !put.some((entry) => entry.id === id));
  }
  // an account that has changed (a pharmacist who now has a shop) is changed where accounts are kept
  const changed = change.put.people?.find((entry) => entry.id === state.me?.id);
  set({ kept, gone, ...(changed ? { me: changed, accounts: state.accounts.map((account) => (account.id === changed.id ? { ...account, pharmacyId: changed.pharmacyId } : account)) } : {}) });
  if (full) {
    set(before);
    throw new Refused('This browser has no room left to keep that. If it has a photograph, try without it.');
  }
  return change.made;
}

/* ---------- the basket, and where the visitor is ---------- */

export function addToBasket(pharmacyId: string, medicineId: string, qty = 1) {
  set((state) => {
    const same = state.basket?.pharmacyId === pharmacyId ? state.basket : { pharmacyId, lines: [] };
    const line = same.lines.find((entry) => entry.medicineId === medicineId);
    const lines = line ? same.lines.map((entry) => (entry === line ? { ...entry, qty: Math.min(9, entry.qty + qty) } : entry)) : [...same.lines, { medicineId, qty: Math.min(9, qty) }];
    return { basket: { pharmacyId, lines } };
  });
}

export function setQty(medicineId: string, qty: number) {
  set((state) => {
    if (!state.basket) return {};
    const lines = qty < 1 ? state.basket.lines.filter((entry) => entry.medicineId !== medicineId) : state.basket.lines.map((entry) => (entry.medicineId === medicineId ? { ...entry, qty: Math.min(9, qty) } : entry));
    return { basket: lines.length ? { ...state.basket, lines } : null };
  });
}

export const emptyBasket = () => set({ basket: null });
export const setDistrict = (district: string) => set({ district, point: null });

/** Asks the browser where the visitor is. The answer stays in this browser. */
export function locate(): Promise<void> {
  return new Promise((done, refuse) => {
    if (!('geolocation' in navigator)) return refuse(new Refused('This browser cannot say where it is. Choose a district instead.'));
    navigator.geolocation.getCurrentPosition(
      (found) => {
        set({ point: { lat: found.coords.latitude, lng: found.coords.longitude } });
        done();
      },
      () => refuse(new Refused('The browser did not say where you are. Choose a district instead.')),
      { maximumAge: 300_000, timeout: 10_000 },
    );
  });
}

/** Forgets everything this browser has kept for the site. */
export function forget() {
  set({ me: null, accounts: [], kept: {}, gone: {}, basket: null, district: HOME, point: null });
}

export { EMPTY };
