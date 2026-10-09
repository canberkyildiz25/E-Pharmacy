'use client';

import { CLOSES, clockOf, hm, OPENS } from '@/lib/time';
import { useNow } from '@/lib/world';

const DAY = 24 * 60;

/* A day from nine to nine, drawn as one line: the hours every pharmacy
   keeps, then the hours only the watch does, and a mark where now is. */
export function Band() {
  const now = useNow();
  const clock = now ? clockOf(now) : null;
  const along = clock ? (((clock.minutes - OPENS + DAY) % DAY) / DAY) * 100 : null;

  return (
    <div className="band" role="img" aria-label={`A day from ${hm(OPENS)} to ${hm(OPENS)}: every pharmacy is open until ${hm(CLOSES)}, and the watch keeps the rest.`}>
      <div className="band__bar">
        <span className="band__day" />
        <span className="band__night" />
        {along !== null && <i className="band__now" style={{ left: `${along}%` }} />}
      </div>
      <div className="band__marks fig" aria-hidden="true">
        <span>{hm(OPENS)}</span>
        <span>{hm(CLOSES)}</span>
        <span>{hm(OPENS)}</span>
      </div>
      <div className="band__names" aria-hidden="true">
        <span>Every pharmacy</span>
        <span>The watch</span>
      </div>
    </div>
  );
}
