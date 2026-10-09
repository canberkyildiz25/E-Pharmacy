'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { far, lira } from '@/lib/places';
import { pharmacyPath } from '@/lib/seed';
import { CATEGORIES } from '@/lib/types';
import { offers, useNow, usePoint, useReady, useWorld } from '@/lib/world';
import { Add } from './Add';
import { MedicinePhoto } from './MedicineTile';
import { Whereabouts } from './Whereabouts';

/** A medicine's own page: what it is, what to be careful of, and which pharmacy has it, open and near ones first. */
export function MedicineView({ id }: { id: string }) {
  const world = useWorld();
  const now = useNow();
  const from = usePoint();
  const ready = useReady();
  const item = world.medicines.find((entry) => entry.id === id);

  if (!item) {
    if (!ready) return <p className="lost" aria-busy="true" />;
    return (
      <div className="lost">
        <h1>That is not in the catalogue.</h1>
        <p>It may have been taken off the shelves, or the address may be mistyped.</p>
        <Link className="btn" href="/medicines/">
          See every medicine
        </Link>
      </div>
    );
  }

  const where = offers(world, item, from, now);
  const shelf = CATEGORIES.find((entry) => entry.key === item.category);

  return (
    <>
      <Link className="crumb" href="/medicines/">
        <ArrowLeft size={18} aria-hidden="true" />
        Every medicine
      </Link>

      <article className="item">
        <div className="item__photo">
          <MedicinePhoto item={item} sizes="(min-width: 60rem) 40vw, 94vw" lead />
        </div>
        <div className="item__say">
          <p className="label">{shelf?.label}</p>
          <h1>{item.name}</h1>
          <p className="item__form">{item.form}</p>
          <p className="item__about">{item.about}</p>
          {item.warning && (
            <p className="item__warn">
              <strong>Take care.</strong> {item.warning}
            </p>
          )}
          {item.sample && <p className="item__sample">The picture is a generated one of a plain pack, not a photograph of a product.</p>}
        </div>
      </article>

      <section className="part" aria-labelledby="where-title">
        <header className="part__head">
          <h2 id="where-title">Who has it</h2>
          <Whereabouts />
        </header>
        {where.length ? (
          <ul className="offers">
            {where.map(({ stock, placed }) => (
              <li key={stock.id} data-open={placed.now?.open ? '' : undefined}>
                <i className="lamp" data-lit={placed.now?.open ? '' : undefined} aria-hidden="true" />
                <div className="offers__shop">
                  <h3>
                    <Link href={pharmacyPath(placed.shop.id)}>{placed.shop.name}</Link>
                  </h3>
                  <p suppressHydrationWarning>
                    {placed.shop.hood}, {placed.shop.district}
                    <span className="fig">{far(placed.km)}</span>
                    {placed.now && <span className="offers__line">{placed.now.line}</span>}
                  </p>
                </div>
                <p className="offers__price fig">{lira(stock.price)}</p>
                <Add pharmacyId={placed.shop.id} medicineId={item.id} name={`${item.name} from ${placed.shop.name}`} left={stock.count} small />
              </li>
            ))}
          </ul>
        ) : (
          <p className="part__none">No pharmacy on the list keeps this at the moment.</p>
        )}
      </section>
    </>
  );
}
