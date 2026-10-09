'use client';

import Link from 'next/link';
import { useState } from 'react';
import { live, moveName, stateName } from '@/lib/orders';
import { lira } from '@/lib/places';
import { nextStates } from '@/lib/rules';
import { orderPath } from '@/lib/seed';
import { Refused, run } from '@/lib/store';
import { newest, since } from '@/lib/time';
import type { Order, OrderState, Person } from '@/lib/types';
import { Refusal } from '../Field';

function Ticket({ order, me, now }: { order: Order; me: Person; now: number }) {
  const [busy, setBusy] = useState<OrderState | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const next = nextStates(order, me);

  async function move(to: OrderState) {
    setBusy(to);
    setProblem(null);
    try {
      await run({ do: 'order.move', id: order.id, to });
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <li className="ticket" data-live={live(order) ? '' : undefined}>
      <div className="ticket__head">
        <h3>
          <Link href={orderPath(order.id)}>{order.name}</Link>
        </h3>
        <span className="fig">{order.id}</span>
        <span className="ticket__state">{stateName(order.state, order.mode)}</span>
        <span suppressHydrationWarning>{since(order, now)}</span>
      </div>
      <ul className="ticket__lines">
        {order.lines.map((line) => (
          <li key={line.medicineId}>
            <span className="fig">{line.qty}</span>
            {line.name}, {line.form}
          </li>
        ))}
      </ul>
      {order.note && <p className="ticket__note">{order.note}</p>}
      <p className="ticket__for">
        <span className="fig">{lira(order.total)}</span>
        <span>{order.mode === 'deliver' ? `To ${order.address}` : 'Collecting'}</span>
        <a className="link fig" href={`tel:${order.phone.replace(/[^+\d]/g, '')}`}>
          {order.phone}
        </a>
      </p>
      {next.length > 0 && (
        <div className="ticket__acts">
          {next.map((to) => (
            <button key={to} type="button" className={`btn btn--small${to === 'cancelled' ? ' btn--line' : ''}`} disabled={busy !== null} data-busy={busy === to ? '' : undefined} onClick={() => move(to)}>
              {moveName(to, order, me)}
            </button>
          ))}
        </div>
      )}
      {problem && <Refusal text={problem} />}
    </li>
  );
}

/** How soon an order wants a hand: one nobody has looked at comes before one already on its way. */
const URGENCY: OrderState[] = ['placed', 'accepted', 'ready', 'out'];

/** The orders for one pharmacy: the ones still to do, the unanswered first and the longest waiting before the rest, then the finished ones. */
export function Tickets({ orders, me, now }: { orders: Order[]; me: Person; now: number }) {
  const todo = orders.filter(live).sort((a, b) => URGENCY.indexOf(a.state) - URGENCY.indexOf(b.state) || newest(b, a, now || 1));
  const finished = orders
    .filter((order) => !live(order))
    .sort((a, b) => newest(a, b, now || 1))
    .slice(0, 12);

  return (
    <>
      <section className="part part--near" aria-labelledby="todo-title">
        <h2 id="todo-title">To do</h2>
        {todo.length ? (
          <ul className="tickets">
            {todo.map((order) => (
              <Ticket key={order.id} order={order} me={me} now={now} />
            ))}
          </ul>
        ) : (
          <p className="part__none">Nothing is waiting. An order shows here the moment somebody sends one.</p>
        )}
      </section>
      {finished.length > 0 && (
        <section className="part" aria-labelledby="finished-title">
          <h2 id="finished-title">Finished</h2>
          <ul className="tickets">
            {finished.map((order) => (
              <Ticket key={order.id} order={order} me={me} now={now} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
