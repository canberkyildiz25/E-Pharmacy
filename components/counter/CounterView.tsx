'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { homeOf, live } from '@/lib/orders';
import { lira } from '@/lib/places';
import { pharmacyPath } from '@/lib/seed';
import { demo, useStore } from '@/lib/store';
import { nights, standing, when } from '@/lib/time';
import { useMe, useNow, useReady, useWorld } from '@/lib/world';
import { Tabs, useTab } from '../Tabs';
import { Shelf } from './Shelf';
import { ShopForm } from './ShopForm';
import { Tickets } from './Tickets';

const WEEK = 7 * 86_400_000;
const TABS = [
  { key: 'orders', label: 'Orders' },
  { key: 'shelf', label: 'The shelf' },
  { key: 'shop', label: 'The shop' },
] as const;

/** For somebody who is not signed in: what the counter is, and the ways behind it. */
function Pitch() {
  const router = useRouter();
  const local = useStore((state) => state.ready && state.mode === 'local');
  return (
    <>
      <header className="page-head">
        <h1>Behind the counter</h1>
        <p>For the pharmacist. Put your pharmacy on the list, keep its shelf and its prices, and take orders that arrive with a name, a number and a reference.</p>
      </header>
      <div className="plate">
        <Image src="/scenes/shelf.jpg" alt="Shelves of plain white boxes and brown glass bottles in a pharmacy, lit by one lamp" width={1600} height={1000} sizes="(min-width: 96rem) 88rem, 94vw" quality={80} preload />
      </div>
      <dl className="facts facts--even">
        <div>
          <dt className="label">Hours</dt>
          <dd>Nine to seven, Monday to Saturday. The list shows you open then without being told.</dd>
        </div>
        <div>
          <dt className="label">The watch</dt>
          <dd>One night in four, by the rota. On yours the lamp beside your name stays lit until nine the next morning.</dd>
        </div>
        <div>
          <dt className="label">The shelf</dt>
          <dd>What you keep from the catalogue, at your prices, and anything it lacks, added with a photograph.</dd>
        </div>
        <div>
          <dt className="label">Orders</dt>
          <dd>Each comes with a name, a number and a reference. Accept it, put it on the counter, hand it over.</dd>
        </div>
      </dl>
      <p className="pitch__acts">
        <Link className="btn" href="/join/?next=/counter/">
          Make a pharmacist&rsquo;s account
        </Link>
        <Link className="btn btn--line" href="/sign-in/?next=/counter/">
          Sign in
        </Link>
        {local && (
          <button
            type="button"
            className="more"
            onClick={() => {
              demo('pharmacist');
              router.refresh();
            }}
          >
            Walk in as Selin
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
      </p>
    </>
  );
}

/** The pharmacist's side of the site: the orders, the shelf, and what the pharmacy says about itself. */
export function CounterView() {
  const world = useWorld();
  const ready = useReady();
  const me = useMe();
  const now = useNow();
  const [tab, goTab] = useTab(TABS);

  if (!ready) return <p className="lost" aria-busy="true" />;
  if (!me) return <Pitch />;
  if (me.role !== 'pharmacist')
    return (
      <div className="lost">
        <h1>The counter is a pharmacist&rsquo;s.</h1>
        <p>You are signed in as {me.role === 'admin' ? 'the administrator' : 'a customer'}. To stand behind a counter, sign out at the foot of the page and come back as a pharmacist.</p>
        <Link className="btn" href={homeOf(me.role)}>
          {me.role === 'admin' ? 'Go to the desk' : 'See who is open'}
        </Link>
      </div>
    );

  const shop = me.pharmacyId ? world.pharmacies.find((entry) => entry.id === me.pharmacyId) : undefined;
  if (!shop)
    return (
      <>
        <header className="page-head">
          <h1>Set up the pharmacy</h1>
          <p>What a customer needs to find you: the name over the door, where the door is, and a number to ring. It can all be changed afterwards.</p>
        </header>
        <ShopForm pharmacist={me.name} />
      </>
    );

  const orders = world.orders.filter((order) => order.pharmacyId === shop.id);
  const waiting = orders.filter((order) => order.state === 'placed').length;
  const inHand = orders.filter((order) => live(order) && order.state !== 'placed').length;
  const taken = orders.filter((order) => order.state === 'done' && now && when(order, now) > now - WEEK).reduce((sum, order) => sum + order.total, 0);
  const low = world.shelf.filter((stock) => stock.pharmacyId === shop.id && stock.count <= 3).length;
  const state = now ? standing(shop, now) : null;

  return (
    <>
      <header className="panel">
        <p className="shop__now" data-open={state?.open ? '' : undefined} suppressHydrationWarning>
          <i className="lamp" data-lit={state?.open ? '' : undefined} aria-hidden="true" />
          {state?.line ?? 'The counter'}
          {shop.paused && <span className="panel__paused">Taken off the list by the administrator</span>}
        </p>
        <h1>{shop.name}</h1>
        <p className="panel__say" suppressHydrationWarning>
          {me.name}. Your next nights on watch: {now ? nights(shop, now).join(', ') : 'one in four'}.{' '}
          <Link className="link" href={pharmacyPath(shop.id)}>
            See the page a customer sees
          </Link>
        </p>
        <dl className="figures">
          <div>
            <dt className="label">Waiting for you</dt>
            <dd data-lit={waiting ? '' : undefined}>{waiting}</dd>
          </div>
          <div>
            <dt className="label">In hand</dt>
            <dd>{inHand}</dd>
          </div>
          <div>
            <dt className="label">Taken this week</dt>
            <dd suppressHydrationWarning>{lira(taken)}</dd>
          </div>
          <div>
            <dt className="label">Running low</dt>
            <dd>{low}</dd>
          </div>
        </dl>
      </header>

      <Tabs base="/counter/" tabs={TABS.map((entry) => (entry.key === 'orders' ? { ...entry, count: waiting } : entry))} on={tab} go={goTab} label="The counter" />

      {tab === 'orders' && <Tickets orders={orders} me={me} now={now} />}
      {tab === 'shelf' && <Shelf shop={shop} world={world} />}
      {tab === 'shop' && (
        <section className="part part--near" aria-labelledby="shop-title">
          <h2 id="shop-title">What the pharmacy says about itself</h2>
          <ShopForm key={shop.id} shop={shop} pharmacist={me.name} />
        </section>
      )}
    </>
  );
}
