/* The rules of the site, written once: who may do what, what a thing has to
   look like to be accepted, and what changes when it is.

   The same function runs in the visitor's browser when there is no database,
   and on the server when there is one. Nothing in here trusts what it is
   handed: every field is checked for its kind and its length, and only the
   fields a thing has are kept. */

import { DISTRICTS, districtPoint } from './places';
import { ROTA } from './time';
import { CATEGORIES, stockId, type Category, type Line, type Medicine, type Order, type OrderState, type Part, type Person, type Pharmacy, type Photo, type Review, type Stock, type Supplier, type World } from './types';

/** A plain "no", with the reason in words a person can act on. */
export class Refused extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export type Action =
  | { do: 'order.place'; pharmacyId: string; lines: { medicineId: string; qty: number }[]; mode: 'collect' | 'deliver'; name: string; phone: string; address?: string | null; note?: string | null }
  | { do: 'order.move'; id: string; to: OrderState }
  | { do: 'review.add'; pharmacyId: string; rating: number; text: string }
  | { do: 'shop.save'; name: string; pharmacist: string; district: string; hood: string; address: string; phone: string; delivers: boolean; note: string; lat?: number | null; lng?: number | null; photo?: Photo | null }
  | { do: 'shelf.set'; medicineId: string; price: number; count: number }
  | { do: 'shelf.drop'; medicineId: string }
  | { do: 'medicine.add'; name: string; form: string; category: Category; about: string; warning: string; photo: Photo | null; price: number; count: number }
  | { do: 'medicine.drop'; id: string }
  | { do: 'pharmacy.pause'; id: string; paused: boolean }
  | { do: 'supplier.save'; id?: string; name: string; city: string; supplies: string; since: number; active: boolean }
  | { do: 'supplier.drop'; id: string };

/** What an action changes: things to keep (new, or in place of the old one with that id) and things to remove. */
export interface Change {
  put: { [P in Part]?: World[P] };
  drop: { [P in Part]?: string[] };
  /** The id of the thing the action was about, for the page to go to. */
  made?: string;
}

/* ---------- reading what was sent ---------- */

type Sent = Record<string, unknown>;

function text(value: unknown, what: string, least: number, most: number): string {
  if (typeof value !== 'string') throw new Refused(`${what} is missing.`);
  // control characters are dropped; a line break is kept
  const clean = [...value]
    .filter((letter) => {
      const code = letter.charCodeAt(0);
      return code === 10 || (code > 31 && code !== 127);
    })
    .join('')
    .trim();
  if (clean.length < least) throw new Refused(`${what} is missing or too short.`);
  if (clean.length > most) throw new Refused(`${what} is too long: keep it under ${most} characters.`);
  return clean;
}
const maybe = (value: unknown, what: string, most: number) => (value === null || value === undefined || value === '' ? null : text(value, what, 0, most) || null);

function whole(value: unknown, what: string, least: number, most: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < least || value > most) throw new Refused(`${what} has to be a whole number from ${least} to ${most}.`);
  return value;
}
function yes(value: unknown, what: string): boolean {
  if (typeof value !== 'boolean') throw new Refused(`${what} is missing.`);
  return value;
}
function one<T extends string>(value: unknown, of: readonly T[], what: string): T {
  if (typeof value !== 'string' || !of.includes(value as T)) throw new Refused(`${what} is not one of the choices.`);
  return value as T;
}
const PHONE = /^[+\d][\d ()-]{6,19}$/;
function phone(value: unknown): string {
  const clean = text(value, 'The phone number', 7, 20);
  if (!PHONE.test(clean)) throw new Refused('That does not look like a phone number.');
  return clean;
}

/** A photograph the browser made: a small JPEG, carried in the request itself. */
function picture(value: unknown): Photo | null {
  if (value === null || value === undefined) return null;
  const sent = value as Sent;
  if (typeof sent.src !== 'string' || !sent.src.startsWith('data:image/jpeg;base64,') || sent.src.length > 420_000) throw new Refused('The photograph is not one this site made, or it is too large.');
  return { src: sent.src, w: whole(sent.w, 'The photograph', 16, 2400), h: whole(sent.h, 'The photograph', 16, 2400) };
}

/* ---------- who is asking ---------- */

function need(who: Person | null, ...roles: Person['role'][]): Person {
  if (!who) throw new Refused('Sign in first.', 401);
  if (roles.length && !roles.includes(who.role)) throw new Refused('That is not something this account can do.', 403);
  return who;
}
function shopOf(world: World, who: Person): Pharmacy {
  const shop = who.pharmacyId ? world.pharmacies.find((entry) => entry.id === who.pharmacyId) : undefined;
  if (!shop) throw new Refused('Set up the pharmacy first.', 409);
  return shop;
}

/** The states an order can go to from where it is, for whoever is looking at it. */
export function nextStates(order: Order, who: Person | null): OrderState[] {
  if (!who) return [];
  if (who.role === 'customer') return order.customer === who.id && order.state === 'placed' ? ['cancelled'] : [];
  if (who.role === 'pharmacist' && who.pharmacyId !== order.pharmacyId) return [];
  if (order.state === 'placed') return ['accepted', 'cancelled'];
  if (order.state === 'accepted') return ['ready', 'cancelled'];
  if (order.state === 'ready') return [order.mode === 'deliver' ? 'out' : 'done'];
  if (order.state === 'out') return ['done'];
  return [];
}

const slug = (name: string) =>
  name
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);

/* ---------- the actions ---------- */

/** Does one thing, or refuses. `fresh` hands out a short random string, and `now` is the moment it happens. */
export function act(world: World, who: Person | null, sent: Action, now: number, fresh: () => string): Change {
  const action = sent as Action & Sent;
  switch (action.do) {
    case 'order.place': {
      const customer = need(who, 'customer');
      const shop = world.pharmacies.find((entry) => entry.id === action.pharmacyId && !entry.paused);
      if (!shop) throw new Refused('That pharmacy is not taking orders.', 404);
      if (!Array.isArray(action.lines) || !action.lines.length || action.lines.length > 20) throw new Refused('The basket is empty.');
      const mode = one(action.mode, ['collect', 'deliver'] as const, 'How to get it');
      if (mode === 'deliver' && !shop.delivers) throw new Refused(`${shop.name} does not deliver. Choose to collect it.`);
      const lines: Line[] = [];
      const shelf: Stock[] = [];
      for (const wanted of action.lines) {
        const qty = whole(wanted?.qty, 'The number', 1, 9);
        const stock = world.shelf.find((entry) => entry.id === stockId(shop.id, String(wanted?.medicineId)));
        const item = stock && world.medicines.find((entry) => entry.id === stock.medicineId);
        if (!stock || !item) throw new Refused(`${shop.name} does not keep one of the things in the basket.`, 409);
        if (stock.count < qty) throw new Refused(stock.count ? `${shop.name} has only ${stock.count} of ${item.name} left.` : `${shop.name} has run out of ${item.name}.`, 409);
        if (lines.some((entry) => entry.medicineId === item.id)) throw new Refused('The same thing is in the basket twice.');
        lines.push({ medicineId: item.id, name: item.name, form: item.form, price: stock.price, qty });
        shelf.push({ ...stock, count: stock.count - qty });
      }
      const taken = new Set(world.orders.map((order) => order.id));
      let id = '';
      do id = `NB-${5000 + (parseInt(fresh().slice(0, 6), 16) % 5000)}`;
      while (taken.has(id));
      const order: Order = {
        id,
        pharmacyId: shop.id,
        customer: customer.id,
        name: text(action.name, 'Your name', 2, 60),
        phone: phone(action.phone),
        mode,
        address: mode === 'deliver' ? text(action.address, 'The address', 8, 200) : null,
        note: maybe(action.note, 'The note', 280),
        lines,
        total: lines.reduce((sum, entry) => sum + entry.price * entry.qty, 0),
        state: 'placed',
        at: now,
        steps: [{ state: 'placed', at: now }],
      };
      return { put: { orders: [order], shelf }, drop: {}, made: order.id };
    }

    case 'order.move': {
      const order = world.orders.find((entry) => entry.id === action.id);
      if (!order) throw new Refused('There is no order with that reference.', 404);
      const to = one(action.to, nextStates(order, need(who)), 'That step');
      const moved: Order = { ...order, state: to, steps: [...order.steps, { state: to, at: now }] };
      if (to !== 'cancelled') return { put: { orders: [moved] }, drop: {}, made: order.id };
      // what was set aside goes back on the shelf
      const shelf = order.lines.flatMap((entry) => {
        const stock = world.shelf.find((kept) => kept.id === stockId(order.pharmacyId, entry.medicineId));
        return stock ? [{ ...stock, count: stock.count + entry.qty }] : [];
      });
      return { put: { orders: [moved], shelf }, drop: {}, made: order.id };
    }

    case 'review.add': {
      const customer = need(who, 'customer');
      const shop = world.pharmacies.find((entry) => entry.id === action.pharmacyId);
      if (!shop) throw new Refused('There is no pharmacy with that name here.', 404);
      if (!world.orders.some((order) => order.customer === customer.id && order.pharmacyId === shop.id && order.state === 'done')) throw new Refused(`A review is for somebody who has had an order from ${shop.name}.`, 403);
      const review: Review = { id: `rv-${fresh()}`, pharmacyId: shop.id, by: customer.name.split(' ')[0], rating: whole(action.rating, 'The rating', 1, 5), text: text(action.text, 'The review', 10, 400), at: now };
      return { put: { reviews: [review] }, drop: {}, made: review.id };
    }

    case 'shop.save': {
      const owner = need(who, 'pharmacist');
      const current = owner.pharmacyId ? world.pharmacies.find((entry) => entry.id === owner.pharmacyId) : undefined;
      const district = one(action.district, DISTRICTS.map((entry) => entry.name), 'The district');
      const name = text(action.name, 'The name of the pharmacy', 3, 60);
      const sentPoint = typeof action.lat === 'number' && typeof action.lng === 'number' && Math.abs(action.lat - 41) < 1 && Math.abs(action.lng - 29) < 1.5 ? { lat: action.lat, lng: action.lng } : null;
      const point = sentPoint ?? (current && current.district === district ? { lat: current.lat, lng: current.lng } : districtPoint(district));
      const id = current?.id ?? `${slug(name) || 'eczane'}-${fresh().slice(0, 4)}`;
      const shop: Pharmacy = {
        id,
        name,
        pharmacist: text(action.pharmacist, 'The pharmacist', 3, 60),
        district,
        hood: text(action.hood, 'The neighbourhood', 2, 40),
        address: text(action.address, 'The address', 5, 120),
        phone: phone(action.phone),
        // only where it is: the middle of a district comes with the district's name, which is not the shop's
        lat: point.lat,
        lng: point.lng,
        delivers: yes(action.delivers, 'Whether you deliver'),
        slot: current?.slot ?? [...id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % ROTA,
        note: text(action.note, 'The line about the shop', 0, 160),
        // left out, the picture stays as it was; sent as nothing, it is taken away
        photo: action.photo === undefined ? (current?.photo ?? null) : picture(action.photo),
        owner: owner.id,
        paused: current?.paused,
        sample: false,
      };
      return { put: { pharmacies: [shop], ...(current ? {} : { people: [{ ...owner, pharmacyId: id }] }) }, drop: {}, made: id };
    }

    case 'shelf.set': {
      const shop = shopOf(world, need(who, 'pharmacist'));
      const item = world.medicines.find((entry) => entry.id === action.medicineId);
      if (!item) throw new Refused('That is not in the catalogue.', 404);
      const stock: Stock = { id: stockId(shop.id, item.id), pharmacyId: shop.id, medicineId: item.id, price: whole(action.price, 'The price', 1, 50_000), count: whole(action.count, 'How many are left', 0, 9999) };
      return { put: { shelf: [stock] }, drop: {}, made: stock.id };
    }

    case 'shelf.drop': {
      const shop = shopOf(world, need(who, 'pharmacist'));
      const id = stockId(shop.id, String(action.medicineId));
      if (!world.shelf.some((entry) => entry.id === id)) throw new Refused('That is not on your shelf.', 404);
      return { put: {}, drop: { shelf: [id] }, made: id };
    }

    case 'medicine.add': {
      const shop = shopOf(world, need(who, 'pharmacist'));
      const name = text(action.name, 'The name', 3, 60);
      if (world.medicines.some((entry) => entry.name.toLocaleLowerCase('tr') === name.toLocaleLowerCase('tr'))) throw new Refused('There is already something by that name in the catalogue. Put that one on your shelf.', 409);
      const item: Medicine = {
        id: `${slug(name) || 'item'}-${fresh().slice(0, 4)}`,
        name,
        form: text(action.form, 'How much of it', 1, 40),
        category: one(action.category, CATEGORIES.map((entry) => entry.key), 'The shelf it belongs on'),
        about: text(action.about, 'What it is for', 10, 240),
        warning: text(action.warning, 'What to be careful of', 0, 240),
        photo: picture(action.photo),
        by: shop.id,
        sample: false,
      };
      const stock: Stock = { id: stockId(shop.id, item.id), pharmacyId: shop.id, medicineId: item.id, price: whole(action.price, 'The price', 1, 50_000), count: whole(action.count, 'How many are left', 0, 9999) };
      return { put: { medicines: [item], shelf: [stock] }, drop: {}, made: item.id };
    }

    case 'medicine.drop': {
      const asker = need(who, 'pharmacist', 'admin');
      const item = world.medicines.find((entry) => entry.id === action.id);
      if (!item) throw new Refused('That is not in the catalogue.', 404);
      if (item.sample) throw new Refused('The examples that ship with the site stay in the catalogue.', 403);
      if (asker.role === 'pharmacist' && item.by !== asker.pharmacyId) throw new Refused('Another pharmacy added that.', 403);
      return { put: {}, drop: { medicines: [item.id], shelf: world.shelf.filter((entry) => entry.medicineId === item.id).map((entry) => entry.id) }, made: item.id };
    }

    case 'pharmacy.pause': {
      need(who, 'admin');
      const shop = world.pharmacies.find((entry) => entry.id === action.id);
      if (!shop) throw new Refused('There is no pharmacy with that name here.', 404);
      return { put: { pharmacies: [{ ...shop, paused: yes(action.paused, 'Paused or not') }] }, drop: {}, made: shop.id };
    }

    case 'supplier.save': {
      need(who, 'admin');
      const current = action.id ? world.suppliers.find((entry) => entry.id === action.id) : undefined;
      if (action.id && !current) throw new Refused('There is no supplier by that reference.', 404);
      const supplier: Supplier = {
        id: current?.id ?? `sp-${fresh().slice(0, 6)}`,
        name: text(action.name, 'The name', 3, 60),
        city: text(action.city, 'The city', 2, 40),
        supplies: text(action.supplies, 'What they supply', 3, 120),
        since: whole(action.since, 'The year', 1950, 2100),
        active: yes(action.active, 'Active or not'),
      };
      return { put: { suppliers: [supplier] }, drop: {}, made: supplier.id };
    }

    case 'supplier.drop': {
      need(who, 'admin');
      const supplier = world.suppliers.find((entry) => entry.id === action.id);
      if (!supplier) throw new Refused('There is no supplier by that reference.', 404);
      if (supplier.sample) throw new Refused('The examples that ship with the site stay on the list. Mark it as no longer active instead.', 403);
      return { put: {}, drop: { suppliers: [supplier.id] }, made: supplier.id };
    }

    default:
      throw new Refused('That is not something this site does.');
  }
}

/* ---------- putting worlds together ---------- */

type Kept = { id: string };

/** One list laid over another: a thing with the same id takes the place of the one under it. */
function lay<T extends Kept>(under: T[], over: T[] = [], gone: string[] = []): T[] {
  const ids = new Set(over.map((entry) => entry.id));
  const lost = new Set(gone);
  return [...over, ...under.filter((entry) => !ids.has(entry.id))].filter((entry) => !lost.has(entry.id));
}

export function overlay(under: World, over: Partial<World>, gone: Change['drop'] = {}): World {
  return {
    pharmacies: lay(under.pharmacies, over.pharmacies, gone.pharmacies),
    medicines: lay(under.medicines, over.medicines, gone.medicines),
    shelf: lay(under.shelf, over.shelf, gone.shelf),
    orders: lay(under.orders, over.orders, gone.orders),
    reviews: lay(under.reviews, over.reviews, gone.reviews),
    suppliers: lay(under.suppliers, over.suppliers, gone.suppliers),
    people: lay(under.people, over.people, gone.people),
  };
}

export const EMPTY: World = { pharmacies: [], medicines: [], shelf: [], orders: [], reviews: [], suppliers: [], people: [] };

/** What one account is allowed to see of the whole. */
export function seenBy(world: World, who: Person | null): World {
  const mine = (order: Order) => who?.role === 'admin' || (who?.role === 'pharmacist' && order.pharmacyId === who.pharmacyId) || order.customer === who?.id;
  return {
    ...world,
    pharmacies: who?.role === 'admin' ? world.pharmacies : world.pharmacies.filter((shop) => !shop.paused || shop.id === who?.pharmacyId),
    orders: who ? world.orders.filter(mine) : [],
    suppliers: who?.role === 'admin' ? world.suppliers : [],
    people: who?.role === 'admin' ? world.people : who ? world.people.filter((person) => person.id === who.id) : [],
  };
}
