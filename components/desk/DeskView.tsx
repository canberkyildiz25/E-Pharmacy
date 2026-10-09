'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type CSSProperties } from 'react';
import { homeOf, live } from '@/lib/orders';
import { lira } from '@/lib/places';
import { medicinePath, pharmacyPath } from '@/lib/seed';
import { demo, Refused, run, useStore } from '@/lib/store';
import { newest, standing, when } from '@/lib/time';
import { CATEGORIES, type Medicine, type Pharmacy } from '@/lib/types';
import { fromPrice, useMe, useNow, useReady, useWorld } from '@/lib/world';
import { Refusal } from '../Field';
import { OrderSlip } from '../OrderSlip';
import { Tabs, useTab } from '../Tabs';
import { toast } from '../Toasts';
import { Suppliers } from './Suppliers';

const WEEK = 7 * 86_400_000;
const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'pharmacies', label: 'Pharmacies' },
  { key: 'orders', label: 'Orders' },
  { key: 'medicines', label: 'Medicines' },
  { key: 'people', label: 'People' },
  { key: 'suppliers', label: 'Suppliers' },
] as const;
const ROLES = { customer: 'Customer', pharmacist: 'Pharmacist', admin: 'Administrator' };

const said = (error: unknown) => (error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');

/** The administrator's side of the site: every pharmacy, order, medicine, account and supplier. */
export function DeskView() {
  const world = useWorld();
  const ready = useReady();
  const me = useMe();
  const now = useNow();
  const [tab, goTab] = useTab(TABS);
  const router = useRouter();
  const local = useStore((state) => state.ready && state.mode === 'local');
  const [problem, setProblem] = useState<string | null>(null);

  if (!ready) return <p className="lost" aria-busy="true" />;
  if (!me || me.role !== 'admin')
    return (
      <div className="lost">
        <h1>The desk is the administrator&rsquo;s.</h1>
        <p>{me ? `You are signed in as a ${me.role}. ` : ''}From it, every pharmacy on the list can be seen, and taken off it.</p>
        {me ? (
          <Link className="btn" href={homeOf(me.role)}>
            Go back
          </Link>
        ) : (
          <Link className="btn" href="/sign-in/?next=/desk/">
            Sign in
          </Link>
        )}
        {local && !me && (
          <button
            type="button"
            className="more"
            onClick={() => {
              demo('admin');
              router.refresh();
            }}
          >
            Walk in as Deniz
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    );

  const week = world.orders.filter((order) => now && when(order, now) > now - WEEK);
  const taken = week.filter((order) => order.state === 'done').reduce((sum, order) => sum + order.total, 0);
  const openNow = world.pharmacies.filter((shop) => !shop.paused && now && standing(shop, now).open).length;
  const byShop = world.pharmacies
    .map((shop) => ({ shop, orders: world.orders.filter((order) => order.pharmacyId === shop.id && order.state !== 'cancelled') }))
    .map((entry) => ({ ...entry, sum: entry.orders.reduce((sum, order) => sum + order.total, 0) }))
    .filter((entry) => entry.orders.length)
    .sort((a, b) => b.sum - a.sum);
  const most = Math.max(1, ...byShop.map((entry) => entry.sum));
  const sorted = [...world.orders].sort((a, b) => newest(a, b, now || 1));
  const shopName = (id: string) => world.pharmacies.find((entry) => entry.id === id)?.name ?? 'A pharmacy no longer listed';

  async function pause(shop: Pharmacy) {
    setProblem(null);
    try {
      await run({ do: 'pharmacy.pause', id: shop.id, paused: !shop.paused });
      if (!shop.paused) toast(`${shop.name} is off the list. Its own page stays for its pharmacist.`);
    } catch (error) {
      setProblem(said(error));
    }
  }
  async function dropMedicine(item: Medicine) {
    setProblem(null);
    try {
      await run({ do: 'medicine.drop', id: item.id });
      toast(`${item.name} was taken out of the catalogue.`);
    } catch (error) {
      setProblem(said(error));
    }
  }

  return (
    <>
      <header className="panel">
        <h1>The desk</h1>
        <p className="panel__say">{me.name}. What is on the list, what has been ordered, and who has an account.</p>
      </header>

      <Tabs base="/desk/" tabs={TABS} on={tab} go={goTab} label="The desk" />
      <Refusal text={problem} />

      {tab === 'overview' && (
        <>
          <dl className="figures figures--near">
            <div>
              <dt className="label">Pharmacies listed</dt>
              <dd>{world.pharmacies.filter((shop) => !shop.paused).length}</dd>
            </div>
            <div>
              <dt className="label">Open at this minute</dt>
              <dd data-lit={openNow ? '' : undefined} suppressHydrationWarning>
                {openNow}
              </dd>
            </div>
            <div>
              <dt className="label">Orders this week</dt>
              <dd suppressHydrationWarning>{week.length}</dd>
            </div>
            <div>
              <dt className="label">Taken this week</dt>
              <dd suppressHydrationWarning>{lira(taken)}</dd>
            </div>
          </dl>
          <section className="part" aria-labelledby="by-title">
            <h2 id="by-title">What each counter has taken</h2>
            {byShop.length ? (
              <ol className="bars">
                {byShop.map((entry) => (
                  <li key={entry.shop.id}>
                    <Link className="link" href={pharmacyPath(entry.shop.id)}>
                      {entry.shop.name}
                    </Link>
                    <span className="bars__bar" style={{ '--share': entry.sum / most } as CSSProperties} aria-hidden="true" />
                    <span className="fig">{lira(entry.sum)}</span>
                    <span className="bars__n">
                      {entry.orders.length} {entry.orders.length === 1 ? 'order' : 'orders'}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="part__none">Nothing has been ordered yet.</p>
            )}
          </section>
          <section className="part" aria-labelledby="latest-title">
            <div className="part__head">
              <h2 id="latest-title">The latest orders</h2>
              <Link className="more" href="/desk/?tab=orders">
                Every order
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <ul className="slips">
              {sorted.slice(0, 4).map((order) => (
                <OrderSlip key={order.id} order={order} now={now} level={3} title={shopName(order.pharmacyId)} sub={`for ${order.name}`} />
              ))}
            </ul>
          </section>
        </>
      )}

      {tab === 'pharmacies' && (
        <section className="part part--near" aria-labelledby="pharmacies-title">
          <h2 id="pharmacies-title">Pharmacies</h2>
          <div className="ledger" role="region" aria-labelledby="pharmacies-title" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Pharmacist</th>
                  <th scope="col">On the shelf</th>
                  <th scope="col">Now</th>
                  <th scope="col">
                    <span className="sr-only">Change</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {world.pharmacies.map((shop) => (
                  <tr key={shop.id} data-off={shop.paused ? '' : undefined}>
                    <th scope="row">
                      <Link className="link" href={pharmacyPath(shop.id)}>
                        {shop.name}
                      </Link>
                      <small>
                        {shop.hood}, {shop.district}
                      </small>
                    </th>
                    <td>{shop.pharmacist}</td>
                    <td className="fig">{world.shelf.filter((stock) => stock.pharmacyId === shop.id).length}</td>
                    <td suppressHydrationWarning>{shop.paused ? 'Off the list' : now ? standing(shop, now).line : ''}</td>
                    <td className="ledger__acts">
                      <button type="button" className="btn btn--line btn--small" onClick={() => pause(shop)}>
                        {shop.paused ? 'Put it back' : 'Take it off'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'orders' && (
        <section className="part part--near" aria-labelledby="orders-title">
          <div className="part__head">
            <h2 id="orders-title">Orders</h2>
            <p className="part__none">
              {sorted.length} in all, {sorted.filter(live).length} still on the way.
            </p>
          </div>
          {sorted.length ? (
            <ul className="slips">
              {sorted.map((order) => (
                <OrderSlip key={order.id} order={order} now={now} level={3} title={shopName(order.pharmacyId)} sub={`for ${order.name}`} />
              ))}
            </ul>
          ) : (
            <p className="part__none">Nothing has been ordered yet.</p>
          )}
        </section>
      )}

      {tab === 'medicines' && (
        <section className="part part--near" aria-labelledby="medicines-title">
          <div className="part__head">
            <h2 id="medicines-title">The catalogue</h2>
            <p className="part__none">The examples stay. Anything a pharmacist added can be taken out here.</p>
          </div>
          <div className="ledger" role="region" aria-labelledby="medicines-title" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Shelf</th>
                  <th scope="col">Kept by</th>
                  <th scope="col">From</th>
                  <th scope="col">
                    <span className="sr-only">Change</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {world.medicines.map((item) => {
                  const kept = world.shelf.filter((stock) => stock.medicineId === item.id).length;
                  const from = fromPrice(world, item.id);
                  return (
                    <tr key={item.id}>
                      <th scope="row">
                        <Link className="link" href={medicinePath(item.id)}>
                          {item.name}
                        </Link>
                        <small>
                          {item.form}
                          {item.by ? `, added by ${shopName(item.by)}` : ''}
                        </small>
                      </th>
                      <td>{CATEGORIES.find((entry) => entry.key === item.category)?.label}</td>
                      <td className="fig">{kept}</td>
                      <td className="fig">{from === null ? '' : lira(from)}</td>
                      <td className="ledger__acts">
                        {!item.sample && (
                          <button type="button" className="btn btn--line btn--small" onClick={() => dropMedicine(item)}>
                            Take it out
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'people' && (
        <section className="part part--near" aria-labelledby="people-title">
          <div className="part__head">
            <h2 id="people-title">People</h2>
            <p className="part__none">{local ? 'The accounts that come with the demonstration, and any made in this browser.' : 'Everybody with an account.'}</p>
          </div>
          <div className="ledger" role="region" aria-labelledby="people-title" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Here as</th>
                  <th scope="col">Pharmacy</th>
                  <th scope="col">Orders</th>
                </tr>
              </thead>
              <tbody>
                {world.people.map((entry) => (
                  <tr key={entry.id}>
                    <th scope="row">
                      {entry.name}
                      <small>{entry.email}</small>
                    </th>
                    <td>{ROLES[entry.role]}</td>
                    <td>{entry.pharmacyId ? shopName(entry.pharmacyId) : ''}</td>
                    <td className="fig">{entry.role === 'customer' ? world.orders.filter((order) => order.customer === entry.id).length : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'suppliers' && <Suppliers suppliers={world.suppliers} />}
    </>
  );
}
