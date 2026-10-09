import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MedicineList } from '@/components/MedicineList';
import { MedicineTile } from '@/components/MedicineTile';
import { MEDICINES, SHELF } from '@/lib/seed';

export const metadata: Metadata = {
  title: 'Medicines',
  description: 'What the pharmacies keep that needs no prescription: for pain and fever, colds, babies, skin and first aid, with the lowest price each is kept at.',
  alternates: { canonical: '/medicines/' },
};

/* The list as it is sent, before the browser has read the search in the
   address: every example, with the lowest price it is kept at. A browser
   that runs no scripts is left with this, which is the whole catalogue. */
function Everything() {
  return (
    <>
      <p className="narrow__sum">{MEDICINES.length} medicines. None of them needs a prescription.</p>
      <div className="tiles">
        {MEDICINES.map((item) => {
          const prices = SHELF.filter((stock) => stock.medicineId === item.id).map((stock) => stock.price);
          return <MedicineTile key={item.id} item={item} from={prices.length ? Math.min(...prices) : null} level={2} />;
        })}
      </div>
    </>
  );
}

export default function Medicines() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Medicines</h1>
        <p>What the pharmacies keep that needs no prescription. Open one to see who has it on the shelf, nearest and open first.</p>
      </header>
      <Suspense fallback={<Everything />}>
        <MedicineList />
      </Suspense>
      <div className="page-foot" />
    </main>
  );
}
