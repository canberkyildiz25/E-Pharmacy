'use client';

import type { MouseEvent } from 'react';
import { useAddress } from '@/lib/address';

/** Which part of a panel is showing, and the way to change it. It is kept in the address, so that a part can be linked to and the Back button works, but changing it is not a journey to another page. */
export function useTab<T extends string>(tabs: readonly { key: T }[]): [T, (tab: T) => void] {
  const [at, setAt] = useAddress(['tab']);
  const on = tabs.find((tab) => tab.key === at.tab)?.key ?? tabs[0].key;
  return [on, (tab) => setAt({ tab: tab === tabs[0].key ? '' : tab }, 'push')];
}

export function Tabs<T extends string>({ base, tabs, on, go, label }: { base: string; tabs: readonly { key: T; label: string; count?: number }[]; on: T; go: (tab: T) => void; label: string }) {
  function press(event: MouseEvent, tab: T) {
    // a click meant for a new tab or a new window is left to the browser
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    go(tab);
  }
  return (
    <nav className="tabs" aria-label={label}>
      {tabs.map((tab, index) => (
        <a key={tab.key} href={index ? `${base}?tab=${tab.key}` : base} aria-current={tab.key === on ? 'page' : undefined} onClick={(event) => press(event, tab.key)}>
          {tab.label}
          {tab.count ? <span className="fig">{tab.count}</span> : null}
        </a>
      ))}
    </nav>
  );
}
