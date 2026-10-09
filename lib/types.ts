/* What the site is made of. The same shapes are used for the examples that
   ship with it, for what a visitor's browser keeps, and for the database when
   one is connected. */

export type Role = 'customer' | 'pharmacist' | 'admin';

/** Somebody with an account. A pharmacist's account points at the pharmacy they run. */
export interface Person {
  id: string;
  name: string;
  email: string;
  role: Role;
  pharmacyId?: string;
  made: number;
}

export interface Photo {
  src: string;
  w: number;
  h: number;
}

/* A moment. A real one is milliseconds since 1970. An example keeps how many
   minutes ago it was instead, so that the examples never go stale. */
export interface Ago {
  min: number;
}
export interface Timed {
  at: number;
  ago?: Ago;
}

export interface Pharmacy {
  id: string;
  name: string;
  pharmacist: string;
  district: string;
  hood: string;
  address: string;
  /** An example has no number to call. */
  phone: string | null;
  lat: number;
  lng: number;
  delivers: boolean;
  /** Its place on the rota: the night in every four that it keeps the watch. */
  slot: number;
  /** One line about the shop, in the pharmacist's words. */
  note: string;
  /** A picture of the shop, when it has one. */
  photo?: Photo | null;
  /** The account that runs it. */
  owner?: string;
  /** Taken off the lists by the administrator. */
  paused?: boolean;
  sample: boolean;
}

export const CATEGORIES = [
  { key: 'pain', label: 'Pain and fever' },
  { key: 'cold', label: 'Colds and throats' },
  { key: 'vitamins', label: 'Vitamins' },
  { key: 'skin', label: 'Skin' },
  { key: 'baby', label: 'Babies' },
  { key: 'firstaid', label: 'First aid' },
  { key: 'mouth', label: 'Teeth and eyes' },
] as const;
export type Category = (typeof CATEGORIES)[number]['key'];

/** Something a pharmacy sells without a prescription. */
export interface Medicine {
  id: string;
  name: string;
  /** How much of it: "20 tablets", "100 ml". */
  form: string;
  category: Category;
  about: string;
  warning: string;
  photo: Photo | null;
  /** The pharmacy that added it, when it is not one of the examples. */
  by?: string;
  sample: boolean;
}

/** One medicine on one pharmacy's shelf: what it costs there, and how many are left. */
export interface Stock {
  id: string;
  pharmacyId: string;
  medicineId: string;
  /** Turkish lira, whole. */
  price: number;
  count: number;
}

export const STATES = ['placed', 'accepted', 'ready', 'out', 'done', 'cancelled'] as const;
export type OrderState = (typeof STATES)[number];

export interface Line {
  medicineId: string;
  name: string;
  form: string;
  price: number;
  qty: number;
}

export interface Order extends Timed {
  /** The reference said over the counter, like NB-4821. */
  id: string;
  pharmacyId: string;
  customer: string;
  name: string;
  phone: string;
  mode: 'collect' | 'deliver';
  address: string | null;
  note: string | null;
  lines: Line[];
  total: number;
  state: OrderState;
  /** Every state it has been through, in order. */
  steps: ({ state: OrderState } & Timed)[];
  sample?: boolean;
}

export interface Review extends Timed {
  id: string;
  pharmacyId: string;
  by: string;
  rating: number;
  text: string;
  sample?: boolean;
}

/** A wholesaler the platform buys from. Only the administrator sees these. */
export interface Supplier {
  id: string;
  name: string;
  city: string;
  supplies: string;
  since: number;
  active: boolean;
  sample?: boolean;
}

/** Everything, as one page of the site needs it. */
export interface World {
  pharmacies: Pharmacy[];
  medicines: Medicine[];
  shelf: Stock[];
  orders: Order[];
  reviews: Review[];
  suppliers: Supplier[];
  people: Person[];
}
export type Part = keyof World;
export const PARTS: Part[] = ['pharmacies', 'medicines', 'shelf', 'orders', 'reviews', 'suppliers', 'people'];

export const stockId = (pharmacyId: string, medicineId: string) => `${pharmacyId}:${medicineId}`;
