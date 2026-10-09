/* Time, as a pharmacy keeps it. Every clock on the site is Istanbul time,
   on the server and in the browser alike. Istanbul is three hours ahead of
   UTC the whole year, so the sums are plain.

   The hours are the ordinary ones in Turkey: a pharmacy is open from nine to
   seven, Monday to Saturday. Outside those hours the ones on the rota keep
   the watch: from seven in the evening to nine the next morning, and all of
   Sunday. Here every pharmacy has one night in four. */

import type { Pharmacy, Timed } from './types';

const MINUTE = 60_000;
const DAY = 86_400_000;
const AHEAD = 3 * 60 * MINUTE;

export const OPENS = 9 * 60;
export const CLOSES = 19 * 60;
export const ROTA = 4;

export interface Clock {
  /** Days since 1970, in Istanbul. */
  day: number;
  /** Sunday is 0. */
  weekday: number;
  /** Minutes since midnight. */
  minutes: number;
}

const weekdayOf = (day: number) => (((day + 4) % 7) + 7) % 7;

export function clockOf(now: number): Clock {
  const local = now + AHEAD;
  const day = Math.floor(local / DAY);
  // the first of January 1970 was a Thursday
  return { day, weekday: weekdayOf(day), minutes: Math.floor((local - day * DAY) / MINUTE) };
}

const two = (value: number) => String(value).padStart(2, '0');
export const hm = (minutes: number) => `${two(Math.floor(minutes / 60))}:${two(minutes % 60)}`;
/** The time in Istanbul, as 02:14. */
export const clockLine = (now: number) => hm(clockOf(now).minutes);

/** The watch a moment falls in: before nine in the morning it is still last night's. */
export const watchOf = (clock: Clock) => (clock.minutes < OPENS ? clock.day - 1 : clock.day);
/** Whether a pharmacy keeps the watch that begins on a given day. */
export const keeps = (pharmacy: Pick<Pharmacy, 'slot'>, day: number) => ((day % ROTA) + ROTA) % ROTA === pharmacy.slot;

export interface Standing {
  open: boolean;
  /** Keeping the watch now, or due to keep tonight's. */
  watch: boolean;
  /** One line a person can act on. */
  line: string;
}

export function standing(pharmacy: Pick<Pharmacy, 'slot'>, now: number): Standing {
  const clock = clockOf(now);
  const watch = keeps(pharmacy, watchOf(clock));
  const hours = clock.weekday !== 0 && clock.minutes >= OPENS && clock.minutes < CLOSES;
  if (hours) return watch ? { open: true, watch, line: 'Open now, and through the night' } : { open: true, watch, line: `Open until ${hm(CLOSES)}` };
  if (watch) return { open: true, watch, line: clock.weekday === 0 && clock.minutes >= OPENS ? 'On watch all day and tonight' : `On watch until ${hm(OPENS)}` };
  // shut after seven on a Saturday, and all of a Sunday, until Monday
  const untilMonday = (clock.weekday === 6 && clock.minutes >= CLOSES) || (clock.weekday === 0 && clock.minutes >= OPENS);
  return { open: false, watch, line: untilMonday ? `Closed. Opens Monday at ${hm(OPENS)}` : `Closed. Opens at ${hm(OPENS)}` };
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** The next nights a pharmacy keeps the watch, as names of days: Tonight, Tomorrow, Tuesday. */
export function nights(pharmacy: Pick<Pharmacy, 'slot'>, now: number, howMany = 3): string[] {
  const first = watchOf(clockOf(now));
  const found: string[] = [];
  for (let day = first; found.length < howMany && day < first + 14; day += 1) {
    if (!keeps(pharmacy, day)) continue;
    found.push(day === first ? 'Tonight' : day === first + 1 ? 'Tomorrow' : WEEKDAYS[weekdayOf(day)]);
  }
  return found;
}

/** The moment itself. An example's is counted back from now. */
export const when = (item: Timed, now: number) => (item.ago ? now - item.ago.min * MINUTE : item.at);

/** just now, 12 minutes ago, 3 hours ago, yesterday, 5 days ago */
export function since(item: Timed, now: number) {
  const minutes = item.ago ? item.ago.min : Math.max(0, Math.round((now - item.at) / MINUTE));
  if (minutes < 2) return 'just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 8 October, 21:40 */
export function stamp(item: Timed, now: number) {
  const local = new Date(when(item, now) + AHEAD);
  return `${local.getUTCDate()} ${MONTHS[local.getUTCMonth()]}, ${two(local.getUTCHours())}:${two(local.getUTCMinutes())}`;
}

export const newest = (a: Timed, b: Timed, now: number) => when(b, now) - when(a, now);
