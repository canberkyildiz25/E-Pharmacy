import type { Metadata } from 'next';
import { BasketView } from '@/components/BasketView';

export const metadata: Metadata = {
  title: 'Basket',
  description: 'What you are about to ask a pharmacy to put aside for you.',
  alternates: { canonical: '/basket/' },
  robots: { index: false },
};

export default function Basket() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Basket</h1>
        <p>What you are asking one pharmacy to put aside. It is paid for there, when it is handed over.</p>
      </header>
      <BasketView />
      <div className="page-foot" />
    </main>
  );
}
