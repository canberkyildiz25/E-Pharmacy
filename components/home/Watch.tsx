'use client';

import { useEffect, useRef, useState } from 'react';
import { Band } from '@/components/Band';

/* How the watch works, said once, over a rainy window with one lamp behind
   it. The band under it is a day from nine to nine. */
export function Watch() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // stopped by hand: it stays stopped when it comes back onto the screen
  const stopped = useRef(false);

  // the rain only falls while it is on the screen
  useEffect(() => {
    const element = video.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !stopped.current) {
        if (!element.getAttribute('src')) element.src = '/film/rain.mp4';
        element.play().catch(() => undefined);
      } else element.pause();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const element = video.current;
    if (!element) return;
    stopped.current = playing;
    if (playing) {
      element.pause();
      return;
    }
    if (!element.getAttribute('src')) element.src = '/film/rain.mp4';
    element.play().catch(() => undefined);
  }

  return (
    <section className="watch" aria-labelledby="watch-title">
      <div className="watch__film" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- the first frame of the film, shown until it plays */}
        <img src="/film/rain.jpg" alt="" width={1600} height={900} loading="lazy" decoding="async" />
        <video ref={video} muted loop playsInline preload="none" tabIndex={-1} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      </div>
      <div className="wrap watch__in">
        <h2 id="watch-title">How the watch works</h2>
        <p className="watch__say">
          From nine to seven, Monday to Saturday, every pharmacy is open. After seven, and all of Sunday, the ones whose turn it is keep the watch until nine the next morning. Here every pharmacy
          keeps one night in four.
        </p>
        <Band />
        <button type="button" className="watch__ctl" onClick={toggle}>
          {playing ? 'Pause the rain' : 'Play the rain'}
        </button>
      </div>
    </section>
  );
}
