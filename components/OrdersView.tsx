'use client';

import Link from 'next/link';
import { homeOf } from '@/lib/orders';
import { newest } from '@/lib/time';
import { useMe, useNow, useReady, useWorld } from '@/lib/world';
import { OrderSlip } from './OrderSlip';

/** A customer's own orders, the newest first. */
export function OrdersView() {
  const world = useWorld();
  const ready = useReady();
  const me = useMe();
  const now = useNow();

  if (!ready) return <p className="lost" aria-busy="true" />;
  if (!me)
    return (
      <div className="empty">
        <h2>Sign in to see them.</h2>
        <p>Orders belong to an account, so that nobody else can read what you asked a pharmacy for.</p>
        <Link className="btn" href="/sign-in/?next=/orders/">
          Sign in
        </Link>
      </div>
    );
  if (me.role !== 'customer')
    return (
      <div className="empty">
        <h2>These are a customer&rsquo;s pages.</h2>
        <p>{me.role === 'admin' ? 'Every order on the site is at the desk.' : 'The orders for your pharmacy are at the counter.'}</p>
        <Link className="btn" href={homeOf(me.role)}>
          {me.role === 'admin' ? 'Go to the desk' : 'Go to the counter'}
        </Link>
      </div>
    );

  const mine = world.orders.filter((order) => order.customer === me.id).sort((a, b) => newest(a, b, now || 1));
  if (!mine.length)
    return (
      <div className="empty">
        <h2>Nothing ordered yet.</h2>
        <p>When you send a basket to a pharmacy, it is kept here with where it has got to.</p>
        <Link className="btn" href="/open/">
          See who is open
        </Link>
      </div>
    );

  return (
    <ul className="slips">
      {mine.map((order) => {
        const shop = world.pharmacies.find((entry) => entry.id === order.pharmacyId);
        const things = order.lines.reduce((sum, line) => sum + line.qty, 0);
        return <OrderSlip key={order.id} order={order} now={now} title={shop?.name ?? 'A pharmacy no longer listed'} sub={`${things} ${things === 1 ? 'thing' : 'things'}, ${order.mode === 'deliver' ? 'to your door' : 'at the counter'}`} />;
      })}
    </ul>
  );
}
