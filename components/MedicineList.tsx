'use client';

import { useId } from 'react';
import { useAddress } from '@/lib/address';
import { fold } from '@/lib/places';
import { CATEGORIES, type Category } from '@/lib/types';
import { fromPrice, useWorld } from '@/lib/world';
import { MedicineTile } from './MedicineTile';

/* Every medicine, narrowed by a search and by the shelf it belongs on. What
   is being looked for is kept in the address, so that a search can be sent
   to somebody or come back to. */
export function MedicineList() {
  const world = useWorld();
  const id = useId();
  const [at, setAt] = useAddress(['q', 'shelf']);
  const text = at.q;
  const shelf = CATEGORIES.some((entry) => entry.key === at.shelf) ? (at.shelf as Category) : null;

  const wanted = fold(text).split(/\s+/).filter(Boolean);
  const shown = world.medicines.filter((item) => {
    if (shelf && item.category !== shelf) return false;
    if (!wanted.length) return true;
    const have = fold(`${item.name} ${item.form} ${item.about} ${CATEGORIES.find((entry) => entry.key === item.category)?.label ?? ''}`);
    return wanted.every((word) => have.includes(word));
  });

  return (
    <>
      <div className="narrow">
        <div className="field narrow__search">
          <label className="sr-only" htmlFor={id}>
            Search the medicines
          </label>
          <input id={id} className="input" type="search" value={text} onChange={(event) => setAt({ q: event.target.value })} placeholder="fever, plasters, vitamin D" autoComplete="off" enterKeyHint="search" />
        </div>
        <fieldset className="field narrow__show">
          <legend className="sr-only">Which shelf</legend>
          <div className="choices">
            <label className="choice">
              <input type="radio" name="shelf" checked={!shelf} onChange={() => setAt({ shelf: '' })} />
              <span>Every shelf</span>
            </label>
            {CATEGORIES.map((entry) => (
              <label key={entry.key} className="choice">
                <input type="radio" name="shelf" checked={shelf === entry.key} onChange={() => setAt({ shelf: entry.key })} />
                <span>{entry.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <p className="narrow__sum" role="status">
        {shown.length} {shown.length === 1 ? 'medicine' : 'medicines'}
        {(text.trim() || shelf) && ' that match'}. None of them needs a prescription.
      </p>
      {shown.length ? (
        <div className="tiles">
          {shown.map((item) => (
            <MedicineTile key={item.id} item={item} from={fromPrice(world, item.id)} level={2} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Nothing by that name.</h2>
          <p>Try the plain word for it, or look along every shelf. A pharmacist will know what you mean: ask at the counter.</p>
          <button type="button" className="btn" onClick={() => setAt({ q: '', shelf: '' })}>
            Show every medicine
          </button>
        </div>
      )}
    </>
  );
}
