import Image from 'next/image';
import Link from 'next/link';
import { lira } from '@/lib/places';
import { medicinePath } from '@/lib/seed';
import type { Medicine } from '@/lib/types';

/** A medicine's picture: a file the site ships, resized on the way, or one a pharmacist added, kept as it was made. */
export function MedicinePhoto({ item, sizes, lead = false }: { item: Medicine; sizes: string; lead?: boolean }) {
  if (!item.photo) return <span className="nophoto" role="img" aria-label={`${item.name}: no picture`} />;
  if (item.photo.src.startsWith('data:')) {
    // eslint-disable-next-line @next/next/no-img-element -- a picture kept in the browser has no address to resize from
    return <img src={item.photo.src} alt={item.name} width={item.photo.w} height={item.photo.h} loading="lazy" decoding="async" />;
  }
  return <Image src={item.photo.src} alt={`${item.name}, ${item.form}`} width={item.photo.w} height={item.photo.h} sizes={sizes} quality={80} preload={lead} loading={lead ? 'eager' : 'lazy'} />;
}

/* A medicine in a list: its picture, its name, how much of it, and the lowest
   price it is kept at. */
export function MedicineTile({ item, from, level = 3, sizes = '(min-width: 64rem) 22vw, (min-width: 40rem) 30vw, 46vw' }: { item: Medicine; from: number | null; level?: 2 | 3; sizes?: string }) {
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <article className="tile">
      <div className="tile__photo">
        <MedicinePhoto item={item} sizes={sizes} />
      </div>
      <Title className="tile__name">
        <Link href={medicinePath(item.id)}>{item.name}</Link>
      </Title>
      <p className="tile__form">
        {item.form}
        <span className="fig">{from === null ? 'Not on a shelf' : `from ${lira(from)}`}</span>
      </p>
    </article>
  );
}
