'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { start } from '@/lib/store';

/** Runs once per visit: reads what the browser has kept and asks the server
    how the site is running. Also lets things arrive as they come into view:
    anything marked data-in gets the class is-in the first time it is on
    screen, and keeps it. */
export function Start() {
  const path = usePathname();

  useEffect(() => {
    void start();
  }, []);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const waiting = document.querySelectorAll<HTMLElement>('[data-in]:not(.is-in)');
    if (!waiting.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    waiting.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);

  return null;
}
