'use client';

import { Crosshair } from '@phosphor-icons/react';
import { useId, useState } from 'react';
import { DISTRICTS } from '@/lib/places';
import { locate, Refused, setDistrict, useStore } from '@/lib/store';
import { toast } from './Toasts';

/** Where the visitor is: a district they choose, or the spot their browser reports when they ask it to. */
export function Whereabouts() {
  const id = useId();
  const district = useStore((state) => state.district);
  const point = useStore((state) => (state.ready ? state.point : null));
  const [busy, setBusy] = useState(false);

  async function find() {
    setBusy(true);
    try {
      await locate();
    } catch (error) {
      toast(error instanceof Refused ? error.message : 'The browser did not say where you are.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="where">
      <label className="sr-only" htmlFor={id}>
        Your district
      </label>
      <select id={id} className="input where__pick" value={point ? '' : district} onChange={(event) => event.target.value && setDistrict(event.target.value)}>
        {point && <option value="">Where you are now</option>}
        {DISTRICTS.map((entry) => (
          <option key={entry.name} value={entry.name}>
            {entry.name}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn--line where__find" onClick={find} disabled={busy} data-busy={busy ? '' : undefined} aria-pressed={Boolean(point)}>
        {!busy && <Crosshair size={18} aria-hidden="true" />}
        Use my position
      </button>
    </div>
  );
}
