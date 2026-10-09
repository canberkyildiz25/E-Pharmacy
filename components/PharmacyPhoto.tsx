import Image from 'next/image';
import type { Pharmacy } from '@/lib/types';

/** A pharmacy's picture: a file the site ships, resized on the way, or one its pharmacist added, kept as it was made. Nothing when it has none. */
export function PharmacyPhoto({ shop, sizes, lead = false }: { shop: Pharmacy; sizes: string; lead?: boolean }) {
  if (!shop.photo) return null;
  if (shop.photo.src.startsWith('data:')) {
    const alt = `${shop.name}, in a photograph its pharmacist added`;
    // eslint-disable-next-line @next/next/no-img-element -- a picture kept in the browser has no address to resize from
    return <img src={shop.photo.src} alt={alt} width={shop.photo.w} height={shop.photo.h} decoding="async" />;
  }
  return <Image src={shop.photo.src} alt={`A corner of ${shop.name}, lit by one lamp`} width={shop.photo.w} height={shop.photo.h} sizes={sizes} quality={80} preload={lead} loading={lead ? 'eager' : 'lazy'} />;
}
