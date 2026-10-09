'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

/* A search, a filter or a tab, kept in the address without going anywhere.

   Following a link is a journey: the router fades the old page out and the
   new one in, and for that moment nothing can be pressed. Typing in a search
   box is not a journey, and a box whose text waited on the router would drop
   letters. So the value lives here, where it changes at once, and the address
   is rewritten underneath it with the browser's own history.

   The router notices that, and tells every reader of the address a moment
   later. `mine` is what this hook has written that the address has not caught
   up with yet, so that its own echo is not mistaken for somebody following a
   link or pressing Back: only an address it did not write is taken as news. */

type Values = Record<string, string>;

const SEP = '\u0000';

export function useAddress(names: readonly string[]): [Values, (next: Values, how?: 'replace' | 'push') => void] {
  const path = usePathname();
  const params = useSearchParams();
  const now: Values = Object.fromEntries(names.map((name) => [name, params.get(name) ?? '']));
  const key = names.map((name) => now[name]).join(SEP);

  const [held, setHeld] = useState(now);
  const [mine, setMine] = useState([key]);
  if (!mine.includes(key)) {
    // it came from outside: a link on the page, or the Back button
    setMine([key]);
    setHeld(now);
  } else if (mine.length > 1 && mine[mine.length - 1] === key) {
    // the address has caught up with the last thing written
    setMine([key]);
  }

  function set(next: Values, how: 'replace' | 'push' = 'replace') {
    const merged = { ...held, ...next };
    const kept = names.map((name) => (merged[name].trim() ? merged[name] : ''));
    const query = new URLSearchParams();
    names.forEach((name, index) => kept[index] && query.set(name, kept[index]));
    setHeld(merged);
    setMine((list) => [...list, kept.join(SEP)]);
    window.history[how === 'push' ? 'pushState' : 'replaceState'](null, '', query.size ? `${path}?${query}` : path);
  }

  return [held, set];
}
