'use client';

import { PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { useState, type FormEvent } from 'react';
import { Refused, run } from '@/lib/store';
import type { Supplier } from '@/lib/types';
import { Choices, Field, Refusal } from '../Field';
import { Modal } from '../Modal';
import { toast } from '../Toasts';

const said = (error: unknown) => (error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');

function SupplierForm({ supplier, done }: { supplier?: Supplier; done: () => void }) {
  const [name, setName] = useState(supplier?.name ?? '');
  const [city, setCity] = useState(supplier?.city ?? 'İstanbul');
  const [supplies, setSupplies] = useState(supplier?.supplies ?? '');
  const [since, setSince] = useState(String(supplier?.since ?? new Date().getFullYear()));
  const [active, setActive] = useState<'yes' | 'no'>(supplier && !supplier.active ? 'no' : 'yes');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    try {
      await run({ do: 'supplier.save', id: supplier?.id, name, city, supplies, since: Number(since), active: active === 'yes' });
      done();
    } catch (error) {
      setProblem(said(error));
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={save}>
      <Field label="Name">{(wire) => <input {...wire} className="input" value={name} onChange={(event) => setName(event.target.value)} maxLength={60} minLength={3} required />}</Field>
      <div className="form__row">
        <Field label="City">{(wire) => <input {...wire} className="input" value={city} onChange={(event) => setCity(event.target.value)} maxLength={40} minLength={2} required />}</Field>
        <Field label="With us since">{(wire) => <input {...wire} className="input fig" type="number" inputMode="numeric" min={1950} max={2100} step={1} value={since} onChange={(event) => setSince(event.target.value)} required />}</Field>
      </div>
      <Field label="What they supply">{(wire) => <input {...wire} className="input" value={supplies} onChange={(event) => setSupplies(event.target.value)} maxLength={120} minLength={3} required />}</Field>
      <Choices
        legend="Buying from them"
        name="active"
        value={active}
        onChange={setActive}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'Not any more' },
        ]}
      />
      <Refusal text={problem} />
      <div className="form__acts">
        <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
          {supplier ? 'Save the changes' : 'Add the supplier'}
        </button>
      </div>
    </form>
  );
}

/** The wholesalers the platform buys from. Only the administrator sees or changes these. */
export function Suppliers({ suppliers }: { suppliers: Supplier[] }) {
  const [open, setOpen] = useState<Supplier | 'new' | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const sorted = [...suppliers].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'tr'));

  async function drop(supplier: Supplier) {
    setProblem(null);
    try {
      await run({ do: 'supplier.drop', id: supplier.id });
      toast(`${supplier.name} is off the list.`, () => void run({ do: 'supplier.save', name: supplier.name, city: supplier.city, supplies: supplier.supplies, since: supplier.since, active: supplier.active }).catch(() => {}));
    } catch (error) {
      setProblem(said(error));
    }
  }

  return (
    <section className="part part--near" aria-labelledby="suppliers-title">
      <div className="part__head">
        <h2 id="suppliers-title">Suppliers</h2>
        <button type="button" className="btn btn--line" onClick={() => setOpen('new')}>
          <Plus size={18} weight="bold" aria-hidden="true" />
          Add a supplier
        </button>
      </div>
      <Refusal text={problem} />
      <div className="ledger" role="region" aria-labelledby="suppliers-title" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Supplies</th>
              <th scope="col">Since</th>
              <th scope="col">Buying</th>
              <th scope="col">
                <span className="sr-only">Change</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((supplier) => (
              <tr key={supplier.id} data-off={supplier.active ? undefined : ''}>
                <th scope="row">
                  {supplier.name}
                  <small>{supplier.city}</small>
                </th>
                <td>{supplier.supplies}</td>
                <td className="fig">{supplier.since}</td>
                <td>{supplier.active ? 'Yes' : 'Not any more'}</td>
                <td className="ledger__acts">
                  <button type="button" className="iconbtn" onClick={() => setOpen(supplier)} aria-label={`Change ${supplier.name}`}>
                    <PencilSimple size={20} aria-hidden="true" />
                  </button>
                  {!supplier.sample && (
                    <button type="button" className="iconbtn" onClick={() => drop(supplier)} aria-label={`Take ${supplier.name} off the list`}>
                      <Trash size={20} aria-hidden="true" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open !== null} onClose={() => setOpen(null)} title={open === 'new' ? 'A new supplier' : open ? open.name : 'A supplier'}>
        <SupplierForm key={open === 'new' || !open ? 'new' : open.id} supplier={open === 'new' || !open ? undefined : open} done={() => setOpen(null)} />
      </Modal>
    </section>
  );
}
