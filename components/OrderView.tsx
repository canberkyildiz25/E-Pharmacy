'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';
import { homeOf, moveName, stateName, stateSay, stepsOf } from '@/lib/orders';
import { lira } from '@/lib/places';
import { nextStates } from '@/lib/rules';
import { pharmacyPath } from '@/lib/seed';
import { Refused, run } from '@/lib/store';
import { stamp } from '@/lib/time';
import type { OrderState } from '@/lib/types';
import { useMe, useNow, useReady, useWorld } from '@/lib/world';
import { Refusal } from './Field';

/** One order: where it has got to, what is in it, and whatever the person looking at it may do next. */
export function OrderView({ id }: { id: string }) {
  const world = useWorld();
  const ready = useReady();
  const me = useMe();
  const now = useNow();
  const [busy, setBusy] = useState<OrderState | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const order = world.orders.find((entry) => entry.id.toLowerCase() === id.toLowerCase());

  if (!order || !me) {
    if (!ready) return <p className="lost" aria-busy="true" />;
    return (
      <div className="lost">
        <h1>{me ? 'This account has no order by that reference.' : 'Sign in to see an order.'}</h1>
        <p>An order can be read by the person who placed it, by the pharmacy it went to, and by the administrator.</p>
        <Link className="btn" href={me ? homeOf(me.role) : `/sign-in/?next=/orders/${id.toLowerCase()}/`}>
          {me ? 'Go back' : 'Sign in'}
        </Link>
      </div>
    );
  }

  const shop = world.pharmacies.find((entry) => entry.id === order.pharmacyId);
  const shopName = shop?.name ?? 'The pharmacy';
  const mine = me.role === 'customer';
  const next = nextStates(order, me);
  const reached = (state: OrderState) => order.steps.find((step) => step.state === state);
  const back = mine ? { href: '/orders/', label: 'My orders' } : me.role === 'admin' ? { href: '/desk/?tab=orders', label: 'Every order' } : { href: '/counter/', label: 'The counter' };

  async function move(to: OrderState) {
    setBusy(to);
    setProblem(null);
    try {
      await run({ do: 'order.move', id: order!.id, to });
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <Link className="crumb" href={back.href}>
        <ArrowLeft size={18} aria-hidden="true" />
        {back.label}
      </Link>

      <header className="order">
        <p className="order__ref">
          <span className="fig">{order.id}</span>
          {shop ? (
            <Link className="link" href={pharmacyPath(shop.id)}>
              {shop.name}
            </Link>
          ) : (
            shopName
          )}
        </p>
        <h1 aria-live="polite">{stateName(order.state, order.mode)}</h1>
        <p className="order__say">{mine ? stateSay(order, shopName) : `${order.name}, ${order.mode === 'deliver' ? 'to be brought to the door' : 'collecting at the counter'}.`}</p>

        {order.state === 'cancelled' ? (
          <p className="order__say" suppressHydrationWarning>
            Called off on {stamp(reached('cancelled') ?? order, now)}.
          </p>
        ) : (
          <ol className="steps">
            {stepsOf(order).map((state) => {
              const step = reached(state);
              return (
                <li key={state} data-done={step ? '' : undefined} aria-current={order.state === state ? 'step' : undefined}>
                  <i className="lamp" data-lit={step ? '' : undefined} aria-hidden="true" />
                  <span>
                    {stateName(state, order.mode)}
                    {!step && <span className="sr-only"> (not yet)</span>}
                  </span>
                  <span className="fig" suppressHydrationWarning>
                    {step && now ? stamp(step, now) : ''}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {(next.length > 0 || problem) && (
          <>
            <p className="order__acts">
              {next.map((to) => (
                <button key={to} type="button" className={`btn${to === 'cancelled' ? ' btn--line' : ''}`} disabled={busy !== null} data-busy={busy === to ? '' : undefined} onClick={() => move(to)}>
                  {moveName(to, order, me)}
                </button>
              ))}
            </p>
            <Refusal text={problem} />
          </>
        )}
        {mine && order.state === 'done' && shop && (
          <p className="order__acts">
            <Link className="btn btn--line" href={`${pharmacyPath(shop.id)}#said-title`}>
              Write a review
            </Link>
          </p>
        )}
      </header>

      <div className="order__parts">
        <section aria-labelledby="what-title">
          <h2 id="what-title">What is in it</h2>
          <ul className="lines">
            {order.lines.map((line) => (
              <li key={line.medicineId}>
                <p className="lines__name">
                  {line.qty > 1 ? `${line.qty} of ${line.name}` : line.name}
                  <small>{line.form}</small>
                </p>
                <p className="lines__price fig">{lira(line.price * line.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="sum">
            <div>
              <dt>{order.state === 'done' ? 'Paid at the pharmacy' : order.state === 'cancelled' ? 'It would have come to' : 'To pay at the pharmacy'}</dt>
              <dd className="fig">{lira(order.total)}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="who-title">
          <h2 id="who-title">{mine ? 'What the pharmacy was told' : 'Who it is for'}</h2>
          <dl className="facts">
            <div>
              <dt className="label">Name</dt>
              <dd>{order.name}</dd>
            </div>
            <div>
              <dt className="label">Phone</dt>
              <dd className="fig">{order.phone}</dd>
            </div>
            <div>
              <dt className="label">{order.mode === 'deliver' ? 'Bring it to' : 'How'}</dt>
              <dd>{order.mode === 'deliver' ? order.address : shop ? `Collected at ${shop.address}, ${shop.hood}` : 'Collected at the counter'}</dd>
            </div>
            {order.note && (
              <div>
                <dt className="label">Note</dt>
                <dd>{order.note}</dd>
              </div>
            )}
            <div>
              <dt className="label">Sent</dt>
              <dd className="fig" suppressHydrationWarning>
                {now ? stamp(order, now) : ''}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
