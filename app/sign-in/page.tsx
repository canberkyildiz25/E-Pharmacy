import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Door } from '@/components/Door';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to order from a pharmacy, or to run one. The demonstration also has three accounts to walk straight into.',
  alternates: { canonical: '/sign-in/' },
  robots: { index: false },
};

export default function SignIn() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Sign in</h1>
        <p>To send a basket to a pharmacy and see where it has got to, or to stand behind a counter of your own.</p>
      </header>
      <Suspense>
        <Door kind="in" />
      </Suspense>
      <div className="page-foot" />
    </main>
  );
}
