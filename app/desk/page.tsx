import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DeskView } from '@/components/desk/DeskView';

export const metadata: Metadata = {
  title: 'The desk',
  description: 'The administrator’s side: every pharmacy on the list, every order, the catalogue, the accounts and the suppliers.',
  alternates: { canonical: '/desk/' },
  robots: { index: false },
};

export default function Desk() {
  return (
    <main id="main" className="wrap">
      <Suspense>
        <DeskView />
      </Suspense>
      <div className="page-foot" />
    </main>
  );
}
