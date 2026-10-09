import type { Metadata, Viewport } from 'next';
import { DM_Mono, Jost } from 'next/font/google';
import { ViewTransition, type ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Glide } from '@/components/Glide';
import { Masthead } from '@/components/Masthead';
import { Start } from '@/components/Start';
import { Toasts } from '@/components/Toasts';
import { AUTHOR, DESCRIPTION, SITE } from '@/lib/site';
import './globals.css';

/* Two families. Jost is a geometric face in the line of the lettering on old
   shop fronts and medicine labels, and sets everything that is read. DM Mono
   sets the figures: a time, a distance, a price, an order's reference. */
const jost = Jost({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '500'], variable: '--font-jost', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Nöbet · The pharmacy that is open now', template: '%s · Nöbet' },
  description: DESCRIPTION,
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Nöbet',
    title: 'Nöbet · The pharmacy that is open now',
    description: DESCRIPTION,
    url: '/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'One light stays on: an Istanbul street at night under amber street lamps' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
};

export const viewport: Viewport = { themeColor: '#03061e', colorScheme: 'dark' };

/* Runs before first paint: says that scripts run, and whether motion is welcome. */
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('live')})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <a className="skip-link" href="#main">
          Skip to the page
        </a>
        <Masthead />
        {/* one page gives way to the next, under a masthead that stays put */}
        <ViewTransition>{children}</ViewTransition>
        <Footer />
        <Toasts />
        <Start />
        <Glide />
      </body>
    </html>
  );
}
