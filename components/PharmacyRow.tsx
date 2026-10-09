import Link from 'next/link';
import { far } from '@/lib/places';
import { pharmacyPath } from '@/lib/seed';
import type { Placed } from '@/lib/world';

/* A pharmacy in a list: its lamp, its name, where it is, how far, and one
   line on whether it is open. The lamp is lit when it is. */
export function PharmacyRow({ placed, level = 3 }: { placed: Placed; level?: 2 | 3 }) {
  const { shop, km, now } = placed;
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <li className="row" data-open={now?.open ? '' : undefined}>
      <i className="lamp" data-lit={now?.open ? '' : undefined} aria-hidden="true" />
      <div className="row__what">
        <Title className="row__name">
          <Link href={pharmacyPath(shop.id)}>{shop.name}</Link>
        </Title>
        <p className="row__place">
          {shop.hood}, {shop.district}
          {shop.delivers && <span>Delivers</span>}
        </p>
      </div>
      <p className="row__now" suppressHydrationWarning>
        <span className="row__line">{now ? now.line : 'Nine to seven, Monday to Saturday'}</span>
        <span className="fig">{far(km)}</span>
      </p>
    </li>
  );
}
