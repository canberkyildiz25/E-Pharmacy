'use client';

import { ArrowRight, Minus, Plus } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { lira } from '@/lib/places';
import { medicinePath, orderPath, pharmacyPath } from '@/lib/seed';
import { emptyBasket, Refused, run, setQty, useStore } from '@/lib/store';
import { standing } from '@/lib/time';
import { stockId } from '@/lib/types';
import { useMe, useNow, useReady, useWorld } from '@/lib/world';
import { Choices, Field, Refusal } from './Field';
import { MedicinePhoto } from './MedicineTile';
import { toast } from './Toasts';

const PHONE = /^[+\d][\d ()-]{6,19}$/;

/** The basket: what is in it, what it comes to, and the few things a pharmacy needs to know to hand it over. */
export function BasketView() {
  const world = useWorld();
  const ready = useReady();
  const me = useMe();
  const now = useNow();
  const router = useRouter();
  const basket = useStore((state) => (state.ready ? state.basket : null));
  const shop = basket ? world.pharmacies.find((entry) => entry.id === basket.pharmacyId && !entry.paused) : undefined;

  const [mode, setMode] = useState<'collect' | 'deliver'>('collect');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [wrong, setWrong] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <p className="lost" aria-busy="true" />;
  if (!basket || !shop)
    return (
      <div className="empty">
        <h2>Nothing in it yet.</h2>
        <p>Find a pharmacy that is open, or look for what you need, and add it from there. A basket goes to one pharmacy at a time.</p>
        <Link className="btn" href="/open/">
          See who is open
        </Link>
      </div>
    );

  const lines = basket.lines.map((line) => {
    const item = world.medicines.find((entry) => entry.id === line.medicineId);
    const stock = world.shelf.find((entry) => entry.id === stockId(shop.id, line.medicineId));
    return { ...line, item, stock, short: !item || !stock || stock.count < line.qty };
  });
  const total = lines.reduce((sum, line) => sum + (line.stock?.price ?? 0) * line.qty, 0);
  const short = lines.some((line) => line.short);
  const state = now ? standing(shop, now) : null;
  const carried = shop.delivers ? mode : 'collect';
  const called = name || me?.name || '';

  function fewer(medicineId: string, qty: number, label: string) {
    const before = useStore.getState().basket;
    setQty(medicineId, qty - 1);
    if (qty === 1) toast(`${label} was taken out.`, () => useStore.setState({ basket: before }));
  }

  async function place(event: FormEvent) {
    event.preventDefault();
    const found: typeof wrong = {};
    if (called.trim().length < 2) found.name = 'Write the name the pharmacy should ask for.';
    if (!PHONE.test(phone.trim())) found.phone = 'Write a number the pharmacy can ring, digits and spaces only.';
    if (carried === 'deliver' && address.trim().length < 8) found.address = 'Write the street, the number and the flat.';
    setWrong(found);
    setProblem(null);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const id = await run({ do: 'order.place', pharmacyId: shop!.id, lines: basket!.lines, mode: carried, name: called, phone, address: carried === 'deliver' ? address : null, note: note || null });
      if (id) router.push(orderPath(id));
      emptyBasket();
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
      setBusy(false);
    }
  }

  return (
    <div className="basket">
      <section aria-labelledby="in-title">
        <h2 id="in-title">
          From <Link className="link" href={pharmacyPath(shop.id)}>{shop.name}</Link>
        </h2>
        <ul className="lines lines--thumbs">
          {lines.map((line) => {
            const label = line.item?.name ?? 'Something that is no longer kept';
            const most = Math.min(9, line.stock?.count ?? 0);
            return (
              <li key={line.medicineId}>
                <span className="thumb" aria-hidden="true">{line.item ? <MedicinePhoto item={line.item} sizes="56px" /> : <span className="nophoto" />}</span>
                <p className="lines__name">
                  {line.item ? (
                    <Link className="link" href={medicinePath(line.item.id)}>
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                  <small>{line.short ? (line.stock?.count ? `Only ${line.stock.count} left on the shelf` : 'No longer on the shelf: take it out to go on') : line.item?.form}</small>
                </p>
                <span className="qty">
                  <button type="button" className="iconbtn" aria-label={line.qty === 1 ? `Take ${label} out` : `One fewer of ${label}`} onClick={() => fewer(line.medicineId, line.qty, label)}>
                    <Minus size={16} weight="bold" aria-hidden="true" />
                  </button>
                  <output className="fig" aria-label={`${line.qty} of ${label}`}>
                    {line.qty}
                  </output>
                  <button type="button" className="iconbtn" aria-label={`One more of ${label}`} disabled={line.qty >= most} onClick={() => setQty(line.medicineId, line.qty + 1)}>
                    <Plus size={16} weight="bold" aria-hidden="true" />
                  </button>
                </span>
                <p className="lines__price fig">{lira((line.stock?.price ?? 0) * line.qty)}</p>
              </li>
            );
          })}
        </ul>
        <dl className="sum">
          <div>
            <dt>{carried === 'deliver' ? 'Brought to your door' : 'Collected at the counter'}</dt>
            <dd>No charge</dd>
          </div>
          <div>
            <dt>To pay at the pharmacy</dt>
            <dd className="fig">{lira(total)}</dd>
          </div>
        </dl>
        <Link className="more basket__more" href={pharmacyPath(shop.id)}>
          More from its shelf
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="till-title">
        <h2 id="till-title">Sending it</h2>
        {!me ? (
          <div className="basket__ask">
            <p>An order is placed from an account, so that the pharmacy knows who is coming and you can see where it has got to. The basket is kept while you sign in.</p>
            <div>
              <Link className="btn" href="/sign-in/?next=/basket/">
                Sign in
              </Link>
              <Link className="btn btn--line" href="/join/?next=/basket/">
                Join
              </Link>
            </div>
          </div>
        ) : me.role !== 'customer' ? (
          <div className="basket__ask">
            <p>
              You are signed in as {me.role === 'admin' ? 'the administrator' : 'a pharmacist'}. An order is placed from a customer&rsquo;s account: sign out at the foot of the page, then sign in as one.
            </p>
          </div>
        ) : (
          <form className="form" onSubmit={place} noValidate>
            {shop.delivers ? (
              <Choices
                legend="How to get it"
                name="mode"
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'collect', label: 'I will collect it' },
                  { value: 'deliver', label: 'Bring it to me' },
                ]}
              />
            ) : (
              <p className="form__note">{shop.name} does not deliver, so this one is collected at the counter.</p>
            )}
            <div className="form__row">
              <Field label="Name" error={wrong.name}>
                {(wire) => <input {...wire} className="input" value={called} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={60} required />}
              </Field>
              <Field label="Phone" error={wrong.phone}>
                {(wire) => <input {...wire} className="input" type="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="05xx xxx xx xx" maxLength={20} required />}
              </Field>
            </div>
            {carried === 'deliver' && (
              <Field label="Address" error={wrong.address}>
                {(wire) => <input {...wire} className="input" value={address} onChange={(event) => setAddress(event.target.value)} autoComplete="street-address" maxLength={200} required />}
              </Field>
            )}
            <Field label="A note for the pharmacist" optional>
              {(wire) => <textarea {...wire} className="input" value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} rows={3} />}
            </Field>
            <Refusal text={short ? 'Something in the basket is not on the shelf in that number any more. Take it out, or ask for fewer.' : problem} />
            <div className="form__acts">
              <button type="submit" className="btn" disabled={busy || short} data-busy={busy ? '' : undefined}>
                {busy ? 'Sending' : 'Send the order'}
              </button>
            </div>
            <p className="form__note" suppressHydrationWarning>
              It goes to {shop.name}. {state && !state.open ? 'They are closed now, and will see it when they open. ' : ''}
              Nothing is paid here: you pay the pharmacy when it is handed over.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
