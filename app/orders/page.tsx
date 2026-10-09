import type { Metadata } from 'next';
import { OrdersView } from '@/components/OrdersView';

export const metadata: Metadata = {
  title: 'My orders',
  description: 'What you have asked pharmacies to put aside, and where each order has got to.',
  alternates: { canonical: '/orders/' },
  robots: { index: false },
};

export default function Orders() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>My orders</h1>
        <p>What you have asked a pharmacy to put aside, the newest first. A lit lamp is an order still on its way.</p>
      </header>
      <OrdersView />
      <div className="page-foot" />
    </main>
  );
}
