'use client';

import { ArrowLeft, ArrowSquareOut, Phone, Star } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { far, lira } from '@/lib/places';
import { medicinePath } from '@/lib/seed';
import { Refused, run } from '@/lib/store';
import { CLOSES, hm, newest, nights, OPENS, since, standing } from '@/lib/time';
import { CATEGORIES } from '@/lib/types';
import { rank, useMe, useNow, usePoint, useReady, useWorld } from '@/lib/world';
import { Add } from './Add';
import { Field } from './Field';
import { MedicinePhoto } from './MedicineTile';
import { PharmacyPhoto } from './PharmacyPhoto';

/** A rating as five stars, said in words for a reader that cannot see them. */
export function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} weight={star <= rating ? 'fill' : 'regular'} aria-hidden="true" />
      ))}
    </span>
  );
}

/** A pharmacy's own page. It is looked up in the browser, so that a shop opened a minute ago has a page like any other. */
export function PharmacyView({ id }: { id: string }) {
  const world = useWorld();
  const now = useNow();
  const from = usePoint();
  const ready = useReady();
  const me = useMe();
  const shop = world.pharmacies.find((entry) => entry.id === id);

  if (!shop) {
    if (!ready) return <p className="lost" aria-busy="true" />;
    return (
      <div className="lost">
        <h1>There is no pharmacy here by that name.</h1>
        <p>It may have closed its counter, or the address may be mistyped.</p>
        <Link className="btn" href="/open/">
          See every pharmacy
        </Link>
      </div>
    );
  }

  const state = now ? standing(shop, now) : null;
  const km = rank([shop], from, now)[0]?.km ?? 0;
  const shelf = world.shelf.filter((stock) => stock.pharmacyId === shop.id);
  const reviews = world.reviews.filter((review) => review.pharmacyId === shop.id).sort((a, b) => newest(a, b, now || 1));
  const mayReview = me?.role === 'customer' && world.orders.some((order) => order.customer === me.id && order.pharmacyId === shop.id && order.state === 'done');

  return (
    <>
      <Link className="crumb" href="/open/">
        <ArrowLeft size={18} aria-hidden="true" />
        Every pharmacy
      </Link>

      <header className="shop" data-photo={shop.photo ? '' : undefined}>
        <div className="shop__say">
          <p className="shop__now" data-open={state?.open ? '' : undefined} suppressHydrationWarning>
            <i className="lamp" data-lit={state?.open ? '' : undefined} aria-hidden="true" />
            {state ? state.line : `Open ${hm(OPENS)} to ${hm(CLOSES)}, Monday to Saturday`}
          </p>
          <h1>{shop.name}</h1>
          {shop.note && <p className="shop__note">{shop.note}</p>}
          <p className="shop__acts">
            {shop.phone && (
              <a className="btn" href={`tel:${shop.phone.replace(/[^+\d]/g, '')}`}>
                <Phone size={18} weight="fill" aria-hidden="true" />
                <span className="fig">{shop.phone}</span>
              </a>
            )}
            <a className="btn btn--line" href={`https://www.openstreetmap.org/?mlat=${shop.lat}&mlon=${shop.lng}#map=17/${shop.lat}/${shop.lng}`} rel="noopener">
              Show it on a map
              <ArrowSquareOut size={18} aria-hidden="true" />
            </a>
          </p>
          {shop.sample && <p className="shop__sample">An example pharmacy, so there is no number to call, and its picture is a generated one. A real one shows the number and the photograph its pharmacist gave.</p>}
        </div>
        {shop.photo && (
          <div className="shop__photo">
            <PharmacyPhoto shop={shop} sizes="(min-width: 64rem) 46vw, 94vw" lead />
          </div>
        )}
        <dl className="facts">
          <div>
            <dt className="label">Where</dt>
            <dd>
              {shop.address}
              <small>
                {shop.hood}, {shop.district}
                <span className="fig" suppressHydrationWarning>
                  {far(km)} away
                </span>
              </small>
            </dd>
          </div>
          <div>
            <dt className="label">Pharmacist</dt>
            <dd>{shop.pharmacist}</dd>
          </div>
          <div>
            <dt className="label">Hours</dt>
            <dd>
              {hm(OPENS)} to {hm(CLOSES)}, Monday to Saturday
              <small suppressHydrationWarning>On watch: {now ? nights(shop, now).join(', ') : 'one night in four'}</small>
            </dd>
          </div>
          <div>
            <dt className="label">Orders</dt>
            <dd>{shop.delivers ? 'Collected at the counter, or brought to your door' : 'Collected at the counter'}</dd>
          </div>
        </dl>
      </header>

      <section className="part" aria-labelledby="shelf-title">
        <h2 id="shelf-title">On the shelf</h2>
        {shelf.length ? (
          CATEGORIES.map((category) => {
            const kept = shelf.flatMap((stock) => {
              const item = world.medicines.find((entry) => entry.id === stock.medicineId && entry.category === category.key);
              return item ? [{ stock, item }] : [];
            });
            if (!kept.length) return null;
            return (
              <div key={category.key} className="shelf">
                <h3>{category.label}</h3>
                <ul>
                  {kept.map(({ stock, item }) => (
                    <li key={stock.id}>
                      <span className="thumb" aria-hidden="true">
                        <MedicinePhoto item={item} sizes="56px" />
                      </span>
                      <p className="shelf__name">
                        <Link className="link" href={medicinePath(item.id)}>
                          {item.name}
                        </Link>
                        <small>{item.form}</small>
                      </p>
                      <p className="shelf__price fig">{lira(stock.price)}</p>
                      <Add pharmacyId={shop.id} medicineId={item.id} name={item.name} left={stock.count} small />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <p className="part__none">Nothing is on this shelf yet.</p>
        )}
      </section>

      <section className="part" aria-labelledby="said-title">
        <h2 id="said-title">What people said</h2>
        {reviews.length ? (
          <ul className="said">
            {reviews.map((review) => (
              <li key={review.id}>
                <Stars rating={review.rating} />
                <p className="said__text">{review.text}</p>
                <p className="said__by" suppressHydrationWarning>
                  {review.by}, {since(review, now)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="part__none">Nobody has written about {shop.name} yet.</p>
        )}
        {mayReview ? <ReviewForm pharmacyId={shop.id} name={shop.name} /> : <p className="part__none">A review can be written by somebody who has had an order from here.</p>}
      </section>
    </>
  );
}

function ReviewForm({ pharmacyId, name }: { pharmacyId: string; name: string }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    try {
      await run({ do: 'review.add', pharmacyId, rating, text });
      setText('');
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form said__form" onSubmit={send}>
      <fieldset className="field">
        <legend>How was {name}?</legend>
        <div className="choices">
          {[5, 4, 3, 2, 1].map((value) => (
            <label key={value} className="choice">
              <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} />
              <span>{value} of 5</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="What happened" hint="What you would tell a neighbour: was it ready, was somebody kind, was it easy to find." error={problem ?? undefined}>
        {(wire) => <textarea {...wire} className="input" value={text} onChange={(event) => setText(event.target.value)} maxLength={400} rows={3} required minLength={10} />}
      </Field>
      <div className="form__acts">
        <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
          {busy ? 'Sending' : 'Send the review'}
        </button>
      </div>
    </form>
  );
}
