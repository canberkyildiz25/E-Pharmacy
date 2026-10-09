'use client';

/* What a page reads: the world as the signed-in account may see it, the time,
   and where the visitor is. */

import { useEffect, useMemo, useState } from 'react';
import { distance, districtPoint, type Point } from './places';
import { useStore, worldOf } from './store';
import { standing, type Standing } from './time';
import type { Medicine, Pharmacy, Stock, World } from './types';

/** Now, once the page is in a browser, and again every half minute. 0 before that. */
export function useNow() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export function useWorld(): World {
  const ready = useStore((state) => state.ready);
  const mode = useStore((state) => state.mode);
  const me = useStore((state) => state.me);
  const accounts = useStore((state) => state.accounts);
  const kept = useStore((state) => state.kept);
  const gone = useStore((state) => state.gone);
  const remote = useStore((state) => state.remote);
  // the pieces above are what the world is made from: it is made again only when one of them changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => worldOf(useStore.getState()), [ready, mode, me, accounts, kept, gone, remote]);
}

export const useMe = () => useStore((state) => state.me);
export const useReady = () => useStore((state) => state.ready);

/** Where distances are measured from: where the visitor said they are, or the middle of the district they chose. */
export function usePoint(): Point {
  const district = useStore((state) => state.district);
  const point = useStore((state) => state.point);
  return useMemo(() => point ?? districtPoint(district), [point, district]);
}

export interface Placed {
  shop: Pharmacy;
  km: number;
  /** Null until the clock is known. */
  now: Standing | null;
}

/** Pharmacies in the order somebody in a hurry wants them: open ones first, nearest first. */
export function rank(shops: Pharmacy[], from: Point, now: number): Placed[] {
  return shops
    .filter((shop) => !shop.paused)
    .map((shop) => ({ shop, km: distance(from, shop), now: now ? standing(shop, now) : null }))
    .sort((a, b) => Number(b.now?.open ?? false) - Number(a.now?.open ?? false) || a.km - b.km);
}

export interface Offer {
  stock: Stock;
  placed: Placed;
}

/** Where one medicine can be had, best first: in stock and open, then nearest. */
export function offers(world: World, item: Medicine, from: Point, now: number): Offer[] {
  const placed = rank(world.pharmacies, from, now);
  return world.shelf
    .filter((stock) => stock.medicineId === item.id)
    .flatMap((stock) => {
      const at = placed.find((entry) => entry.shop.id === stock.pharmacyId);
      return at ? [{ stock, placed: at }] : [];
    })
    .sort((a, b) => Number(b.stock.count > 0) - Number(a.stock.count > 0) || placed.indexOf(a.placed) - placed.indexOf(b.placed));
}

/** The lowest price a medicine is kept at anywhere, or null when nobody keeps it. */
export const fromPrice = (world: World, medicineId: string) => {
  const prices = world.shelf.filter((stock) => stock.medicineId === medicineId).map((stock) => stock.price);
  return prices.length ? Math.min(...prices) : null;
};
