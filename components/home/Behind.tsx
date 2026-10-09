import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';

/** The other side of the counter: what a pharmacist gets, and the way in. */
export function Behind() {
  return (
    <section className="wrap behind" aria-labelledby="behind-title">
      <div className="behind__photo" data-in>
        <Image src="/scenes/counter.jpg" alt="A pharmacist's hands setting a small amber bottle on a wooden counter, under one lamp" width={1600} height={1000} sizes="(min-width: 64rem) 52vw, 100vw" quality={80} />
      </div>
      <div className="behind__say">
        <h2 id="behind-title">Behind the counter</h2>
        <p>A pharmacist keeps three things here: the shelf, with a price and a count for each thing on it; the orders, from the moment one comes in to the moment it is handed over; and the nights the shop is on watch.</p>
        <p className="behind__acts">
          <Link className="btn" href="/counter/">
            Open your counter
          </Link>
          <Link className="more" href="/about/">
            How it works
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
