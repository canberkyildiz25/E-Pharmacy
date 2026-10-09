import Link from 'next/link';
import { live, stateName } from '@/lib/orders';
import { lira } from '@/lib/places';
import { orderPath } from '@/lib/seed';
import { since } from '@/lib/time';
import type { Order } from '@/lib/types';

/** An order in a list. The whole line is the link, and its lamp is lit while the order is still on its way. */
export function OrderSlip({ order, title, sub, now, level = 2 }: { order: Order; title: string; sub: string; now: number; level?: 2 | 3 }) {
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <li data-live={live(order) ? '' : undefined}>
      <i className="lamp" data-lit={live(order) ? '' : undefined} aria-hidden="true" />
      <div className="slips__what">
        <Title>
          <Link href={orderPath(order.id)}>{title}</Link>
        </Title>
        <p>
          <span className="slips__state">{stateName(order.state, order.mode)}</span>
          <span>{sub}</span>
        </p>
      </div>
      <p className="slips__end">
        <span className="fig">{order.id}</span>
        <span suppressHydrationWarning>{since(order, now)}</span>
        <span className="fig">{lira(order.total)}</span>
      </p>
    </li>
  );
}
