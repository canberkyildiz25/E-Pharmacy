import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Door } from '@/components/Door';

export const metadata: Metadata = {
  title: 'Join',
  description: 'Make an account to order from a pharmacy, or to put a pharmacy of your own on the list.',
  alternates: { canonical: '/join/' },
  robots: { index: false },
};

export default function Join() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Join</h1>
        <p>One account, for one side of the counter: to order from a pharmacy, or to put your own on the list.</p>
      </header>
      <Suspense>
        <Door kind="join" />
      </Suspense>
      <div className="page-foot" />
    </main>
  );
}
