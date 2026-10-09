import type { Metadata } from 'next';
import { PharmacyView } from '@/components/PharmacyView';
import { PHARMACIES, pharmacyPath } from '@/lib/seed';

/* The example pharmacies are built ahead of time. Any other is one somebody
   opened, which only the browser or the database knows about, so its page is
   made when it is asked for and filled in by the browser. */
export function generateStaticParams() {
  return PHARMACIES.map((shop) => ({ id: shop.id }));
}

export async function generateMetadata({ params }: PageProps<'/pharmacies/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const shop = PHARMACIES.find((entry) => entry.id === id);
  if (!shop) return { title: 'A pharmacy', robots: { index: false } };
  return {
    title: `${shop.name}, ${shop.hood}`,
    description: `${shop.name} in ${shop.hood}, ${shop.district}: when it is open, the nights it keeps the watch, and what is on its shelf. An example pharmacy.`,
    alternates: { canonical: pharmacyPath(shop.id) },
    openGraph: { images: shop.photo ? [{ url: shop.photo.src, width: shop.photo.w, height: shop.photo.h }] : undefined },
  };
}

export default async function PharmacyPage({ params }: PageProps<'/pharmacies/[id]'>) {
  const { id } = await params;
  return (
    <main id="main" className="wrap">
      <PharmacyView id={id} />
      <div className="page-foot" />
    </main>
  );
}
