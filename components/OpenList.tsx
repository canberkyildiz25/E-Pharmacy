'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { clockLine } from '@/lib/time';
import { rank, useNow, usePoint, useWorld } from '@/lib/world';
import { PharmacyRow } from './PharmacyRow';
import { Whereabouts } from './Whereabouts';

const SHOW = [
  { value: 'all', label: 'Every pharmacy' },
  { value: 'open', label: 'Open now' },
  { value: 'watch', label: 'On watch tonight' },
  { value: 'brings', label: 'Delivers' },
] as const;
type Show = (typeof SHOW)[number]['value'];

/** Every pharmacy, open ones first and nearest first, with the ways to narrow the list. */
export function OpenList() {
  const world = useWorld();
  const now = useNow();
  const from = usePoint();
  const district = useStore((state) => state.district);
  const located = useStore((state) => (state.ready ? Boolean(state.point) : false));
  const [show, setShow] = useState<Show>('all');

  const placed = rank(world.pharmacies, from, now);
  const shown = placed.filter((entry) => (show === 'open' ? entry.now?.open : show === 'watch' ? entry.now?.watch : show === 'brings' ? entry.shop.delivers : true));

  return (
    <>
      <div className="narrow">
        <Whereabouts />
        <fieldset className="field narrow__show">
          <legend className="sr-only">Which pharmacies to show</legend>
          <div className="choices">
            {SHOW.map((option) => (
              <label key={option.value} className="choice">
                <input type="radio" name="show" value={option.value} checked={show === option.value} onChange={() => setShow(option.value)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <p className="narrow__sum" role="status" suppressHydrationWarning>
        {shown.length} {shown.length === 1 ? 'pharmacy' : 'pharmacies'}, nearest to {located ? 'where you are' : district} first.
        {now > 0 && (
          <>
            {' '}
            It is <span className="fig">{clockLine(now)}</span> in Istanbul.
          </>
        )}
      </p>
      {shown.length ? (
        <ol className="rows">
          {shown.map((entry) => (
            <PharmacyRow key={entry.shop.id} placed={entry} level={2} />
          ))}
        </ol>
      ) : (
        <div className="empty">
          <h2>None, at this hour.</h2>
          <p>No pharmacy on the list is {show === 'open' ? 'open' : 'like that'} just now. Look at every pharmacy to see when each one opens.</p>
          <button type="button" className="btn" onClick={() => setShow('all')}>
            Show every pharmacy
          </button>
        </div>
      )}
    </>
  );
}
