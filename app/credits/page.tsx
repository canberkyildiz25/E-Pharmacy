import type { Metadata } from 'next';
import { MEDICINES, PHARMACIES } from '@/lib/seed';

export const metadata: Metadata = {
  title: 'Credits',
  description: 'Who made the film on Nöbet, how the pictures were made, and which typefaces and libraries the site is built with.',
  alternates: { canonical: '/credits/' },
};

export default function Credits() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Credits</h1>
        <p>Two people filmed the street and the rain. The pictures of medicines and of pharmacies were generated, and none of them shows a real product or a real shop.</p>
      </header>

      <section className="told" aria-labelledby="film-title">
        <h2 id="film-title">The film</h2>
        <div className="told__say">
          <p>
            The street on the front page was filmed in Istanbul by Göksu Taymaz, and is from{' '}
            <a className="link" href="https://www.pexels.com/video/27937641/" rel="noopener">
              Pexels
            </a>
            . The rain on the window, further down that page, is by Imeel Bagdisar, also from{' '}
            <a className="link" href="https://www.pexels.com/video/4458918/" rel="noopener">
              Pexels
            </a>
            . Both are used under the{' '}
            <a className="link" href="https://www.pexels.com/license/" rel="noopener license">
              Pexels licence
            </a>
            .
          </p>
          <p>Each is cut to a short loop that ends where it begins, graded towards the night blue and lamp amber of the rest of the site, made smaller, and has no sound. Neither person has anything to do with this site.</p>
        </div>
      </section>

      <section className="told" aria-labelledby="pictures-title">
        <h2 id="pictures-title">The pictures</h2>
        <div className="told__say">
          <p>
            The {MEDICINES.length} pictures of medicines, the {PHARMACIES.length} of the example pharmacies and the two of a counter and a shelf were generated for this project with Pollinations. The packs in them are plain, with nothing printed on
            them, so that no picture can be taken for a brand, and no picture is of a real shop. A medicine&rsquo;s page and an example pharmacy&rsquo;s page each say so beside the picture.
          </p>
          <p>A photograph a pharmacist adds, of a medicine or of the shop, is their own. It is made small in their browser and kept as it is.</p>
        </div>
      </section>

      <section className="told" aria-labelledby="type-title">
        <h2 id="type-title">The lettering</h2>
        <div className="told__say">
          <p>
            Everything that is read is set in{' '}
            <a className="link" href="https://fonts.google.com/specimen/Jost" rel="noopener">
              Jost
            </a>
            , by Owen Earl. The figures, a time, a distance, a price, an order&rsquo;s reference, are in{' '}
            <a className="link" href="https://fonts.google.com/specimen/DM+Mono" rel="noopener">
              DM Mono
            </a>
            , by Colophon Foundry. Both are under the SIL Open Font Licence and are served from this site.
          </p>
        </div>
      </section>

      <section className="told" aria-labelledby="built-title">
        <h2 id="built-title">Built with</h2>
        <div className="told__say">
          <p>
            <a className="link" href="https://nextjs.org" rel="noopener">
              Next.js
            </a>{' '}
            and React, with Tailwind CSS for the base of the styles. The icons are{' '}
            <a className="link" href="https://phosphoricons.com" rel="noopener">
              Phosphor
            </a>
            , the weight in the wheel is{' '}
            <a className="link" href="https://lenis.darkroom.engineering" rel="noopener">
              Lenis
            </a>
            , and what a browser keeps is held with Zustand. The map a pharmacy&rsquo;s page links to is OpenStreetMap.
          </p>
        </div>
      </section>
      <div className="page-foot" />
    </main>
  );
}
