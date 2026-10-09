'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AUTHOR, REPO } from '@/lib/site';
import { signOut, useStore } from '@/lib/store';

/** The foot of every page: what the word means, what is real here, and the small print. */
export function Footer() {
  const me = useStore((state) => (state.ready ? state.me : null));
  const router = useRouter();
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <div className="foot__say">
          <p className="wordmark">Nöbet</p>
          <p>Turkish for a watch: the night a pharmacy stays open so that the others can close.</p>
          <p>This is a demonstration. The pharmacies are examples, the prices are made up, and nothing ordered here reaches anybody. In an emergency, call 112.</p>
        </div>
        <nav className="foot__ways" aria-label="About this site">
          <Link href="/open/">
            <span>Open now</span>
          </Link>
          <Link href="/medicines/">
            <span>Medicines</span>
          </Link>
          <Link href="/counter/">
            <span>For pharmacists</span>
          </Link>
          <Link href="/about/">
            <span>How it works</span>
          </Link>
          <Link href="/credits/">
            <span>Credits</span>
          </Link>
          <a href={REPO}>
            <span>Source on GitHub</span>
          </a>
        </nav>
        <div className="foot__end">
          <a className="link" href={AUTHOR.url}>
            Made by {AUTHOR.name}
          </a>
          {me ? (
            <button
              type="button"
              className="foot__out"
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
            >
              Sign out {me.name.split(' ')[0]}
            </button>
          ) : (
            <span>Times are Istanbul time.</span>
          )}
        </div>
      </div>
    </footer>
  );
}
