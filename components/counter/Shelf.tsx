'use client';

import { Plus, Trash } from '@phosphor-icons/react';
import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { lira } from '@/lib/places';
import { medicinePath } from '@/lib/seed';
import { shrink } from '@/lib/shrink';
import { Refused, run } from '@/lib/store';
import { CATEGORIES, type Category, type Medicine, type Pharmacy, type Photo, type Stock, type World } from '@/lib/types';
import { Field, Refusal } from '../Field';
import { Modal } from '../Modal';
import { toast } from '../Toasts';

const said = (error: unknown) => (error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');

/** One thing on the shelf: its price and how many are left, changed in place. */
function Row({ stock, item, own }: { stock: Stock; item: Medicine; own: boolean }) {
  const id = useId();
  const [price, setPrice] = useState(String(stock.price));
  const [count, setCount] = useState(String(stock.count));
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const changed = Number(price) !== stock.price || Number(count) !== stock.count;

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    try {
      await run({ do: 'shelf.set', medicineId: item.id, price: Number(price), count: Number(count) });
    } catch (error) {
      setProblem(said(error));
    } finally {
      setBusy(false);
    }
  }

  async function takeOff() {
    setProblem(null);
    try {
      if (own) {
        await run({ do: 'medicine.drop', id: item.id });
        toast(`${item.name} was taken out of the catalogue.`);
      } else {
        await run({ do: 'shelf.drop', medicineId: item.id });
        toast(`${item.name} is off the shelf.`, () => void run({ do: 'shelf.set', medicineId: item.id, price: stock.price, count: stock.count }).catch(() => {}));
      }
    } catch (error) {
      setProblem(said(error));
    }
  }

  return (
    <li>
      <form className="stock__row" onSubmit={save}>
        <p className="stock__name">
          <Link className="link" href={medicinePath(item.id)}>
            {item.name}
          </Link>
          <small>
            {item.form}
            {stock.count === 0 ? <em>Out</em> : stock.count <= 3 ? <em>Running low</em> : null}
          </small>
        </p>
        <div className="stock__num">
          <label htmlFor={`${id}-price`}>Price, ₺</label>
          <input id={`${id}-price`} className="input fig" type="number" inputMode="numeric" min={1} max={50000} step={1} value={price} onChange={(event) => setPrice(event.target.value)} required />
        </div>
        <div className="stock__num">
          <label htmlFor={`${id}-count`}>Left</label>
          <input id={`${id}-count`} className="input fig" type="number" inputMode="numeric" min={0} max={9999} step={1} value={count} onChange={(event) => setCount(event.target.value)} required />
        </div>
        <button type="submit" className="btn btn--small" disabled={!changed || busy} data-busy={busy ? '' : undefined}>
          Save
        </button>
        <button type="button" className="iconbtn" onClick={takeOff} aria-label={own ? `Take ${item.name} out of the catalogue` : `Take ${item.name} off the shelf`}>
          <Trash size={20} aria-hidden="true" />
        </button>
      </form>
      {problem && <Refusal text={problem} />}
    </li>
  );
}

/** Puts something the catalogue already has on this pharmacy's shelf. */
function FromCatalogue({ rest }: { rest: Medicine[] }) {
  const [medicineId, setMedicineId] = useState(rest[0]?.id ?? '');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState('10');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const chosen = rest.some((item) => item.id === medicineId) ? medicineId : (rest[0]?.id ?? '');

  async function add(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    try {
      await run({ do: 'shelf.set', medicineId: chosen, price: Number(price), count: Number(count) });
      setPrice('');
    } catch (error) {
      setProblem(said(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form stock__add" onSubmit={add}>
      <Field label="From the catalogue">
        {(wire) => (
          <select {...wire} className="input" value={chosen} onChange={(event) => setMedicineId(event.target.value)}>
            {rest.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}, {item.form}
              </option>
            ))}
          </select>
        )}
      </Field>
      <div className="form__row">
        <Field label="Price, ₺">{(wire) => <input {...wire} className="input fig" type="number" inputMode="numeric" min={1} max={50000} step={1} value={price} onChange={(event) => setPrice(event.target.value)} required />}</Field>
        <Field label="How many you have">{(wire) => <input {...wire} className="input fig" type="number" inputMode="numeric" min={0} max={9999} step={1} value={count} onChange={(event) => setCount(event.target.value)} required />}</Field>
      </div>
      <Refusal text={problem} />
      <div className="form__acts">
        <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
          Put it on the shelf
        </button>
      </div>
    </form>
  );
}

/** Something the catalogue does not have yet: it is added for everybody, and put on this shelf. */
function NewMedicine({ done }: { done: () => void }) {
  const [name, setName] = useState('');
  const [form, setForm] = useState('');
  const [category, setCategory] = useState<Category>('pain');
  const [about, setAbout] = useState('');
  const [warning, setWarning] = useState('');
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [price, setPrice] = useState('');
  const [count, setCount] = useState('10');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    setProblem(null);
    if (!file) return setPhoto(null);
    try {
      setPhoto(await shrink(file));
    } catch (error) {
      setPhoto(null);
      setProblem(said(error));
    }
  }

  async function add(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    try {
      await run({ do: 'medicine.add', name, form, category, about, warning, photo, price: Number(price), count: Number(count) });
      done();
    } catch (error) {
      setProblem(said(error));
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={add}>
      <Field label="What it is called" hint="The plain name and the strength, not a brand.">
        {(wire) => <input {...wire} className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Cetirizine 10 mg" maxLength={60} minLength={3} required />}
      </Field>
      <div className="form__row">
        <Field label="How much of it">{(wire) => <input {...wire} className="input" value={form} onChange={(event) => setForm(event.target.value)} placeholder="10 tablets" maxLength={40} required />}</Field>
        <Field label="The shelf it goes on">
          {(wire) => (
            <select {...wire} className="input" value={category} onChange={(event) => setCategory(event.target.value as Category)}>
              {CATEGORIES.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <Field label="What it is for">{(wire) => <textarea {...wire} className="input" value={about} onChange={(event) => setAbout(event.target.value)} maxLength={240} minLength={10} rows={2} required />}</Field>
      <Field label="What to be careful of" optional>
        {(wire) => <textarea {...wire} className="input" value={warning} onChange={(event) => setWarning(event.target.value)} maxLength={240} rows={2} />}
      </Field>
      <Field label="A photograph" hint={photo ? `Kept at ${photo.w} by ${photo.h}.` : 'Made small in this browser before it is kept.'} optional>
        {(wire) => <input {...wire} className="input" type="file" accept="image/*" onChange={(event) => void pick(event.target.files?.[0])} />}
      </Field>
      <div className="form__row">
        <Field label="Price, ₺">{(wire) => <input {...wire} className="input fig" type="number" inputMode="numeric" min={1} max={50000} step={1} value={price} onChange={(event) => setPrice(event.target.value)} required />}</Field>
        <Field label="How many you have">{(wire) => <input {...wire} className="input fig" type="number" inputMode="numeric" min={0} max={9999} step={1} value={count} onChange={(event) => setCount(event.target.value)} required />}</Field>
      </div>
      <Refusal text={problem} />
      <div className="form__acts">
        <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
          Add it
        </button>
      </div>
    </form>
  );
}

/** A pharmacy's shelf, as the pharmacist keeps it. */
export function Shelf({ shop, world }: { shop: Pharmacy; world: World }) {
  const [adding, setAdding] = useState(false);
  const mine = world.shelf.filter((stock) => stock.pharmacyId === shop.id);
  const rest = world.medicines.filter((item) => !mine.some((stock) => stock.medicineId === item.id));
  const worth = mine.reduce((sum, stock) => sum + stock.price * stock.count, 0);

  return (
    <>
      <section className="part part--near" aria-labelledby="kept-title">
        <div className="part__head">
          <h2 id="kept-title">On the shelf</h2>
          <p className="part__none">
            {mine.length} {mine.length === 1 ? 'thing' : 'things'}, worth <span className="fig">{lira(worth)}</span> at your prices.
          </p>
        </div>
        {mine.length ? (
          <ul className="stock">
            {CATEGORIES.flatMap((category) =>
              mine.flatMap((stock) => {
                const item = world.medicines.find((entry) => entry.id === stock.medicineId && entry.category === category.key);
                return item ? [<Row key={`${stock.id}:${stock.price}:${stock.count}`} stock={stock} item={item} own={item.by === shop.id} />] : [];
              }),
            )}
          </ul>
        ) : (
          <p className="part__none">Nothing yet. Put the first thing on it below.</p>
        )}
      </section>

      <section className="part" aria-labelledby="more-title">
        <h2 id="more-title">Put something on it</h2>
        {rest.length ? <FromCatalogue rest={rest} /> : <p className="part__none">Everything in the catalogue is already on your shelf.</p>}
        <p className="stock__new">
          <button type="button" className="btn btn--line" onClick={() => setAdding(true)}>
            <Plus size={18} weight="bold" aria-hidden="true" />
            Add something new
          </button>
        </p>
      </section>

      <Modal open={adding} onClose={() => setAdding(false)} title="Something new">
        <NewMedicine done={() => setAdding(false)} />
      </Modal>
    </>
  );
}
