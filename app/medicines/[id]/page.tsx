import type { Metadata } from 'next';
import { MedicineView } from '@/components/MedicineView';
import { MEDICINES, medicinePath } from '@/lib/seed';

/* The examples are built ahead of time. Anything a pharmacist has added is
   known only to the browser or the database, so its page is made when it is
   asked for and filled in by the browser. */
export function generateStaticParams() {
  return MEDICINES.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps<'/medicines/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const item = MEDICINES.find((entry) => entry.id === id);
  if (!item) return { title: 'A medicine', robots: { index: false } };
  return {
    title: `${item.name}, ${item.form}`,
    description: `${item.about} Which pharmacies have it on the shelf, open and near ones first.`,
    alternates: { canonical: medicinePath(item.id) },
    openGraph: { images: item.photo ? [{ url: item.photo.src, width: item.photo.w, height: item.photo.h }] : undefined },
  };
}

export default async function MedicinePage({ params }: PageProps<'/medicines/[id]'>) {
  const { id } = await params;
  return (
    <main id="main" className="wrap">
      <MedicineView id={id} />
      <div className="page-foot" />
    </main>
  );
}
