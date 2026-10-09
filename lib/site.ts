/* The site's own address, used for canonical links and the sitemap.
   next.config.ts works it out. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const NAME = 'Nöbet';
export const DESCRIPTION = 'Find the nearest pharmacy in Istanbul that is open now, see what is on its shelf, and order ahead. A demonstration, with example pharmacies.';

export const AUTHOR = { name: 'Canberk Yıldız', url: 'https://canberkyildiz.netlify.app' };
export const REPO = 'https://github.com/canberkyildiz25/E-Pharmacy';
