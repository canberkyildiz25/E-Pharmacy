import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CounterView } from '@/components/counter/CounterView';

export const metadata: Metadata = {
  title: 'For pharmacists',
  description: 'Put your pharmacy on the list: its hours and its nights on watch, its shelf at your prices, and orders that arrive with a name and a reference.',
  alternates: { canonical: '/counter/' },
};

export default function Counter() {
  return (
    <main id="main" className="wrap">
      <Suspense>
        <CounterView />
      </Suspense>
      <div className="page-foot" />
    </main>
  );
}
