import type { Metadata } from 'next';
import { OpenList } from '@/components/OpenList';

export const metadata: Metadata = {
  title: 'Open now',
  description: 'Every pharmacy on the list, the open ones first and the nearest first, with the ones keeping tonight’s watch.',
  alternates: { canonical: '/open/' },
};

export default function Open() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Open now</h1>
        <p>Every pharmacy on the list, the open ones first and the nearest first. A lit lamp means the door is open at this minute.</p>
      </header>
      <OpenList />
      <div className="page-foot" />
    </main>
  );
}
