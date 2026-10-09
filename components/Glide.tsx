'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Gives a mouse wheel some weight: a turn of it carries the page a little
    way and lets it settle, instead of jumping by a fixed step. A finger on
    glass already scrolls like that, and a visitor who has asked for less
    motion is left with the browser's own scrolling. */
export function Glide() {
  const glide = useRef<Lenis | null>(null);
  const path = usePathname();

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.09,
      // a dialog scrolls itself, and the page behind it stays where it is
      prevent: (node) => node.closest('dialog') !== null,
    });
    glide.current = lenis;
    return () => {
      lenis.destroy();
      glide.current = null;
    };
  }, []);

  // a new page starts wherever the browser puts it, not where the last one was heading
  useEffect(() => {
    const lenis = glide.current;
    if (!lenis) return;
    lenis.stop();
    lenis.start();
  }, [path]);

  return null;
}
