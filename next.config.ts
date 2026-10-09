import path from 'node:path';
import type { NextConfig } from 'next';

/* The address the site is served from: set by hand, or the one Vercel gives
   the project, or this machine. */
const site = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

const config: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  env: { NEXT_PUBLIC_SITE_URL: site },
  trailingSlash: true,
  // one page gives way to the next
  experimental: { viewTransition: true },
  images: {
    // The pictures are files in public/, at most 1,600 pixels wide. A
    // photograph a pharmacist adds never comes through here: it is made
    // small in their browser and kept as it is.
    formats: ['image/webp'],
    deviceSizes: [640, 960, 1280, 1600],
    imageSizes: [160, 320, 480],
    qualities: [80],
    minimumCacheTTL: 2678400,
  },
  // the database driver is used on the server only, and only when an address for it is set
  serverExternalPackages: ['mongodb'],
};

export default config;
