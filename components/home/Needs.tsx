'use client';

import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { MedicineTile } from '@/components/MedicineTile';
import { CATEGORIES } from '@/lib/types';
import { fromPrice, useWorld } from '@/lib/world';

/** The other way in: by what is needed. A search, the shelves by name, and a few things from them. */
export function Needs() {
  const world = useWorld();
  const router = useRouter();
  const id = useId();
  const [text, setText] = useState('');
  const shown = ['infant-syrup', 'paracetamol', 'thermometer', 'saline-spray', 'vitamin-d', 'plasters'].flatMap((wanted) => world.medicines.filter((item) => item.id === wanted));

  function search(event: FormEvent) {
    event.preventDefault();
    router.push(text.trim() ? `/medicines/?q=${encodeURIComponent(text.trim())}` : '/medicines/');
  }

  return (
    <section className="needs" aria-labelledby="needs-title">
      <div className="wrap needs__in">
        <header className="needs__head">
          <h2 id="needs-title">Or start from what you need</h2>
          <form className="needs__search" role="search" onSubmit={search}>
            <label className="sr-only" htmlFor={id}>
              Search the medicines
            </label>
            <input id={id} className="input" type="search" value={text} onChange={(event) => setText(event.target.value)} placeholder="fever, plasters, vitamin D" autoComplete="off" enterKeyHint="search" />
            <button type="submit" className="iconbtn needs__go" aria-label="Search">
              <MagnifyingGlass size={22} aria-hidden="true" />
            </button>
          </form>
          <ul className="needs__shelves">
            {CATEGORIES.map((shelf) => (
              <li key={shelf.key}>
                <Link className="btn btn--line btn--small" href={`/medicines/?shelf=${shelf.key}`}>
                  {shelf.label}
                </Link>
              </li>
            ))}
          </ul>
        </header>
        <div className="rail">
          {shown.map((item) => (
            <MedicineTile key={item.id} item={item} from={fromPrice(world, item.id)} sizes="(min-width: 64rem) 20vw, 60vw" />
          ))}
        </div>
        <p className="needs__all">
          <Link className="more" href="/medicines/">
            All {world.medicines.length} medicines
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
