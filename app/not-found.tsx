import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'No light on here' };

export default function NotFound() {
  return (
    <main id="main" className="wrap">
      <div className="astray">
        <h1>No light on at this address.</h1>
        <p>The page may have moved, or the address may be mistyped. The pharmacies are all still where they were.</p>
        <div>
          <Link className="btn" href="/open/">
            See who is open
          </Link>
          <Link className="btn btn--line" href="/">
            The front page
          </Link>
        </div>
      </div>
    </main>
  );
}
