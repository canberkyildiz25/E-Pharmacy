'use client';

import { ArrowDown } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Whereabouts } from '@/components/Whereabouts';

/* The front cover: a street in Istanbul at night, under its lamps. The film
   is a quiet loop, with a button to stop it. Under it is a photograph of its
   first frame, so the page is whole before the film arrives, and stays whole
   where a film is not wanted. */

/** A window much taller than it is wide is given the upright cut. */
const UPRIGHT = '(max-aspect-ratio: 3/4)';
const cut = () => (matchMedia(UPRIGHT).matches ? '/film/street-tall.mp4' : '/film/street.mp4');

export function Cover() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.src = cut();
    // a browser that will not start a film leaves the photograph up
    element.play().catch(() => undefined);
  }, []);

  function toggle() {
    const element = video.current;
    if (!element) return;
    if (playing) {
      element.pause();
      return;
    }
    if (!element.getAttribute('src')) element.src = cut();
    element.play().catch(() => undefined);
  }

  return (
    <section className="cover" data-film={playing ? 'playing' : 'still'}>
      <div className="cover__film">
        <picture>
          <source media={UPRIGHT} srcSet="/film/street-tall.jpg" />
          <img src="/film/street.jpg" alt="A wet street in Istanbul at night, lit amber by its street lamps, with a minaret behind the trees" width={1920} height={1080} fetchPriority="high" decoding="async" />
        </picture>
        <video ref={video} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      </div>

      <div className="wrap cover__in">
        <h1 className="cover__title">
          <span className="cover__line">
            <span>One light</span>
          </span>{' '}
          <span className="cover__line">
            <span>stays on.</span>
          </span>
        </h1>
        <p className="cover__lede">Every night a few pharmacies keep the watch so the rest can close. Find the nearest that is open now.</p>
        <div className="cover__acts">
          <Whereabouts />
          <Link className="btn" href="#open">
            See who is open
            <ArrowDown size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <button type="button" className="cover__ctl" onClick={toggle}>
        {playing ? 'Pause the film' : 'Play the film'}
      </button>
    </section>
  );
}
