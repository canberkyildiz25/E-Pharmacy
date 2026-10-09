import type { Metadata } from 'next';
import Link from 'next/link';
import { Band } from '@/components/Band';
import { PHARMACIES } from '@/lib/seed';
import { REPO } from '@/lib/site';
import { CLOSES, hm, OPENS, ROTA } from '@/lib/time';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'How Nöbet decides which pharmacy is open, how an order goes from a basket to a counter, what a pharmacist can do, and what here is real.',
  alternates: { canonical: '/about/' },
};

export default function About() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>How it works</h1>
        <p>Nöbet is the Turkish word for a watch: the night one pharmacy stays open so that the others can close. This is what the site does with that, and what on it is real.</p>
      </header>

      <section className="told" aria-labelledby="hours-title">
        <h2 id="hours-title">Who is open</h2>
        <div className="told__say">
          <p>
            Every pharmacy keeps the ordinary hours: <span className="fig">{hm(OPENS)}</span> to <span className="fig">{hm(CLOSES)}</span>, Monday to Saturday. Outside them the ones on the rota keep the watch, from{' '}
            <span className="fig">{hm(CLOSES)}</span> until <span className="fig">{hm(OPENS)}</span> the next morning, and all of Sunday.
          </p>
          <p>
            Here each pharmacy has one night in {ROTA === 4 ? 'four' : ROTA}. The lamp beside its name is lit when it is open at this minute and dark when it is not, and the line beside the lamp says until when. All of it is worked out from the
            clock in Istanbul, whatever time it is where you are.
          </p>
          <Band />
        </div>
      </section>

      <section className="told" aria-labelledby="near-title">
        <h2 id="near-title">Which is nearest</h2>
        <div className="told__say">
          <p>
            Lists put the open ones first, and among those the nearest. Distance is measured in a straight line from the middle of the district you choose, or from the spot your browser reports if you press <strong>Use my position</strong>.
          </p>
          <p>That spot stays in your browser. It is never sent to the site, and it is forgotten when you choose a district again.</p>
        </div>
      </section>

      <section className="told" aria-labelledby="order-title">
        <h2 id="order-title">How an order goes</h2>
        <div className="told__say">
          <p>A basket goes to one pharmacy, because one pharmacy puts it together. You say whether you will collect it or want it brought, leave a name and a number, and send it.</p>
          <ul>
            <li>
              <span>
                <strong>Sent.</strong> The pharmacy has it, and what is in it is set aside. Until somebody there accepts it you can cancel, and it goes back on the shelf.
              </span>
            </li>
            <li>
              <span>
                <strong>Accepted.</strong> Somebody behind the counter is putting it together.
              </span>
            </li>
            <li>
              <span>
                <strong>Ready.</strong> On the counter with your reference on it, or packed to go out.
              </span>
            </li>
            <li>
              <span>
                <strong>Handed over.</strong> You pay then, at the pharmacy or at your door. Nothing is paid on the site.
              </span>
            </li>
          </ul>
          <p>Somebody who has had an order from a pharmacy can write a few lines about it. Nobody else can.</p>
        </div>
      </section>

      <section className="told" aria-labelledby="counter-title">
        <h2 id="counter-title">Behind the counter</h2>
        <div className="told__say">
          <p>
            A pharmacist makes an account, says where the shop is, and it is on the list. From{' '}
            <Link className="link" href="/counter/">
              the counter
            </Link>{' '}
            they keep a price and a count for each thing on the shelf, add what the catalogue lacks with a photograph, and move each order on a step at a time.
          </p>
          <p>One account oversees the rest: it can take a pharmacy off the list and put it back, take out of the catalogue anything a pharmacist added, and keep the list of suppliers.</p>
        </div>
      </section>

      <section className="told" aria-labelledby="real-title">
        <h2 id="real-title">What is real</h2>
        <div className="told__say">
          <p>
            The site is a demonstration, and I built it to show how such a thing can be made. The {PHARMACIES.length} pharmacies are examples with invented names and addresses, the prices are made up, and an order placed here reaches nobody.
          </p>
          <p>
            The medicines are plain ones sold without a prescription, described in general terms. Nothing here is medical advice: ask a pharmacist. For the pharmacy that is truly on watch tonight, look at the notice on the door of any closed
            one, or the list your chamber of pharmacists publishes. In an emergency, call <span className="fig">112</span>.
          </p>
        </div>
      </section>

      <section className="told" aria-labelledby="kept-title">
        <h2 id="kept-title">Where things are kept</h2>
        <div className="told__say">
          <p>
            As it runs here there is no database. Accounts, shelves, orders and reviews are kept in your own browser, laid over the examples, which is why one browser can be the customer, the pharmacist and the administrator in turn. A
            password made here is stretched before it is stored, and never leaves the browser.
          </p>
          <p>
            Given a MongoDB address, the same pages keep everything on a server instead, behind the same rules. The code is{' '}
            <a className="link" href={REPO} rel="noopener">
              on GitHub
            </a>
            , and where the film and the pictures came from is on{' '}
            <Link className="link" href="/credits/">
              the credits page
            </Link>
            .
          </p>
        </div>
      </section>
      <div className="page-foot" />
    </main>
  );
}
