'use client';

import { Basket } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import type { Person } from '@/lib/types';

const WAYS = [
  { href: '/open/', label: 'Open now' },
  { href: '/medicines/', label: 'Medicines' },
];

/** Where an account's own pages are, and what the link to them says. */
function own(me: Person | null): { href: string; label: string } {
  if (me?.role === 'pharmacist') return { href: '/counter/', label: 'The counter' };
  if (me?.role === 'admin') return { href: '/desk/', label: 'The desk' };
  if (me) return { href: '/orders/', label: 'My orders' };
  return { href: '/sign-in/', label: 'Sign in' };
}

function Ways({ onGo }: { onGo?: () => void }) {
  // with its closing slash, whichever way the server was given it
  const path = usePathname().replace(/\/?$/, '/');
  const me = useStore((state) => state.me);
  const ready = useStore((state) => state.ready);
  const mine = own(ready ? me : null);
  return (
    <>
      {WAYS.map((way) => (
        <Link key={way.href} href={way.href} aria-current={path.startsWith(way.href) ? 'page' : undefined} onClick={onGo}>
          <span>{way.label}</span>
        </Link>
      ))}
      {(!ready || !me) && (
        <Link href="/counter/" aria-current={path.startsWith('/counter/') ? 'page' : undefined} onClick={onGo}>
          <span>For pharmacists</span>
        </Link>
      )}
      <Link href={mine.href} aria-current={path.startsWith(mine.href) ? 'page' : undefined} onClick={onGo}>
        <span>{mine.label}</span>
      </Link>
    </>
  );
}

function BasketLink({ onGo }: { onGo?: () => void }) {
  const count = useStore((state) => (state.ready ? (state.basket?.lines.reduce((sum, line) => sum + line.qty, 0) ?? 0) : 0));
  return (
    <Link className="mast__basket" href="/basket/" aria-label={count ? `Basket, ${count} ${count === 1 ? 'thing' : 'things'}` : 'Basket, empty'} onClick={onGo}>
      <Basket size={22} aria-hidden="true" />
      {count > 0 && <span className="fig">{count}</span>}
    </Link>
  );
}

/** The masthead on every page. Over the film on the front page it is
    lettering only; once the page has moved under it, it is a bar. */
export function Masthead() {
  const top = useRef<HTMLDivElement>(null);
  const mast = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  const close = () => sheet.current?.close();

  // a link in the menu has been followed: the menu has done its job
  useEffect(() => {
    sheet.current?.close();
  }, [path]);

  // the marker is as tall as whatever the masthead should stay clear over
  useEffect(() => {
    if (!top.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => mast.current?.toggleAttribute('data-raised', !entry.isIntersecting));
    observer.observe(top.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={top} className="mast-top" aria-hidden="true" />
      <header ref={mast} className="mast">
        <div className="wrap mast__in">
          <Link className="wordmark" href="/" aria-label="Nöbet, the front page">
            Nöbet
          </Link>
          <nav className="mast__ways" aria-label="The site">
            <Ways />
          </nav>
          <div className="mast__end">
            <BasketLink />
            <button type="button" className="mast__menu" aria-haspopup="dialog" onClick={() => sheet.current?.showModal()}>
              Menu
            </button>
          </div>
        </div>

        <dialog ref={sheet} className="sheet" aria-label="Menu">
          <div className="sheet__in">
            <div className="sheet__top">
              <Link className="wordmark" href="/" onClick={close}>
                Nöbet
              </Link>
              <button type="button" className="mast__menu" onClick={close}>
                Close
              </button>
            </div>
            <nav className="sheet__ways" aria-label="The site">
              <Ways onGo={close} />
            </nav>
          </div>
        </dialog>
      </header>
    </>
  );
}
