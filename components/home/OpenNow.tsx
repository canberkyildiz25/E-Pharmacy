'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { PharmacyRow } from '@/components/PharmacyRow';
import { useStore } from '@/lib/store';
import { clockLine } from '@/lib/time';
import { rank, useNow, usePoint, useWorld } from '@/lib/world';

/** The answer the front page exists to give: who is open now, nearest first. */
export function OpenNow() {
  const world = useWorld();
  const now = useNow();
  const from = usePoint();
  const district = useStore((state) => state.district);
  const located = useStore((state) => (state.ready ? Boolean(state.point) : false));
  const placed = rank(world.pharmacies, from, now);
  const open = placed.filter((entry) => entry.now?.open).length;
  const watch = placed.filter((entry) => entry.now?.watch).length;

  return (
    <section className="wrap open" id="open" aria-labelledby="open-title">
      <header className="open__head">
        <h2 id="open-title">Open now</h2>
        <p className="open__sum" suppressHydrationWarning>
          {now ? (
            <>
              <span className="fig">{clockLine(now)}</span> in Istanbul. {open} of {placed.length} pharmacies are open, and {watch} keep the watch tonight. Nearest to {located ? 'where you are' : district} first.
            </>
          ) : (
            <>Nearest to {district} first.</>
          )}
        </p>
      </header>
      <ol className="rows">
        {placed.slice(0, 6).map((entry) => (
          <PharmacyRow key={entry.shop.id} placed={entry} />
        ))}
      </ol>
      <p className="open__all">
        <Link className="more" href="/open/">
          All {placed.length} pharmacies
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
