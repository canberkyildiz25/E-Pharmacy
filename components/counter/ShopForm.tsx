'use client';

import { Crosshair } from '@phosphor-icons/react';
import { useState, type FormEvent } from 'react';
import { DISTRICTS, HOME } from '@/lib/places';
import { shrink } from '@/lib/shrink';
import { Refused, run } from '@/lib/store';
import type { Pharmacy, Photo } from '@/lib/types';
import { Choices, Field, Refusal } from '../Field';
import { toast } from '../Toasts';

/** What a pharmacy says about itself. The same form sets one up and changes it later. */
export function ShopForm({ shop, pharmacist }: { shop?: Pharmacy; pharmacist: string }) {
  const [name, setName] = useState(shop?.name ?? '');
  const [who, setWho] = useState(shop?.pharmacist ?? pharmacist);
  const [district, setDistrict] = useState(shop?.district ?? HOME);
  const [hood, setHood] = useState(shop?.hood ?? '');
  const [address, setAddress] = useState(shop?.address ?? '');
  const [phone, setPhone] = useState(shop?.phone ?? '');
  const [delivers, setDelivers] = useState<'yes' | 'no'>(shop?.delivers ? 'yes' : 'no');
  const [note, setNote] = useState(shop?.note ?? '');
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  // not touched until a picture is chosen or taken away: then it is sent with the rest
  const [photo, setPhoto] = useState<Photo | null | undefined>(undefined);
  const shown = photo === undefined ? (shop?.photo ?? null) : photo;
  const [finding, setFinding] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function find() {
    if (!('geolocation' in navigator)) return setProblem('This browser cannot say where it is. The pharmacy will be put in the middle of its district.');
    setFinding(true);
    navigator.geolocation.getCurrentPosition(
      (found) => {
        setPin({ lat: found.coords.latitude, lng: found.coords.longitude });
        setFinding(false);
      },
      () => {
        setProblem('The browser did not say where you are. The pharmacy will be put in the middle of its district.');
        setFinding(false);
      },
      { maximumAge: 60_000, timeout: 10_000 },
    );
  }

  async function pick(file: File | undefined) {
    setProblem(null);
    if (!file) return;
    try {
      // wider than a medicine's picture: it sits across the head of the pharmacy's page
      setPhoto(await shrink(file, 960));
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That picture could not be read.');
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    try {
      await run({ do: 'shop.save', name, pharmacist: who, district, hood, address, phone, delivers: delivers === 'yes', note, lat: pin?.lat, lng: pin?.lng, ...(photo === undefined ? {} : { photo }) });
      if (shop) toast('The pharmacy’s page says that now.');
      setPin(null);
      setPhoto(undefined);
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={save}>
      <div className="form__row">
        <Field label="The name over the door">{(wire) => <input {...wire} className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Derman Eczanesi" maxLength={60} minLength={3} required />}</Field>
        <Field label="The pharmacist">{(wire) => <input {...wire} className="input" value={who} onChange={(event) => setWho(event.target.value)} autoComplete="name" maxLength={60} minLength={3} required />}</Field>
      </div>
      <div className="form__row">
        <Field label="District">
          {(wire) => (
            <select {...wire} className="input" value={district} onChange={(event) => setDistrict(event.target.value)}>
              {DISTRICTS.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Neighbourhood">{(wire) => <input {...wire} className="input" value={hood} onChange={(event) => setHood(event.target.value)} placeholder="Moda" maxLength={40} minLength={2} required />}</Field>
      </div>
      <Field label="Street and number">{(wire) => <input {...wire} className="input" value={address} onChange={(event) => setAddress(event.target.value)} autoComplete="street-address" maxLength={120} minLength={5} required />}</Field>
      <Field label="Phone" hint="The number somebody rings at night.">
        {(wire) => <input {...wire} className="input" type="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="0216 xxx xx xx" maxLength={20} required />}
      </Field>
      <Choices
        legend="Orders"
        name="delivers"
        value={delivers}
        onChange={setDelivers}
        options={[
          { value: 'no', label: 'Collected at the counter' },
          { value: 'yes', label: 'We also deliver' },
        ]}
      />
      <Field label="A line about the shop" hint="What a neighbour would say about it. It is shown under the name." optional>
        {(wire) => <textarea {...wire} className="input" value={note} onChange={(event) => setNote(event.target.value)} maxLength={160} rows={2} />}
      </Field>
      <Field label="A photograph of the shop" hint={shown ? 'It sits beside the name on the pharmacy’s page. Choose another to change it.' : 'The door, the counter, a shelf. It is made small in this browser before it is kept.'} optional>
        {(wire) => <input {...wire} className="input" type="file" accept="image/*" onChange={(event) => void pick(event.target.files?.[0])} />}
      </Field>
      {shown && (
        <div className="shopshot">
          {/* eslint-disable-next-line @next/next/no-img-element -- shown as it is kept, whether a file of the site's or one made in this browser */}
          <img src={shown.src} alt="The photograph as it will be shown" width={shown.w} height={shown.h} />
          <button type="button" className="btn btn--line btn--small" onClick={() => setPhoto(null)}>
            Take the photograph away
          </button>
        </div>
      )}
      <div className="field">
        <p className="field__hint" aria-live="polite">
          {pin ? `Pinned at ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}. Save to keep it.` : shop && shop.district === district ? 'Distances are measured to where the pharmacy is pinned now.' : `Distances will be measured to the middle of ${district}, unless you pin the shop.`}
        </p>
        <div>
          <button type="button" className="btn btn--line btn--small" onClick={find} disabled={finding} data-busy={finding ? '' : undefined}>
            {!finding && <Crosshair size={18} aria-hidden="true" />}
            Pin it where I am standing
          </button>
        </div>
        <div className="field__slot" />
      </div>
      <Refusal text={problem} />
      <div className="form__acts">
        <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
          {busy ? 'Saving' : shop ? 'Save the changes' : 'Put it on the list'}
        </button>
      </div>
    </form>
  );
}
