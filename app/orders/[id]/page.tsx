import type { Metadata } from 'next';
import { OrderView } from '@/components/OrderView';

/* An order is private, and only the browser or the database knows it: the
   page is the same for every reference, and is filled in once it is known who
   is looking. */
export const metadata: Metadata = {
  title: 'An order',
  robots: { index: false },
};

export default async function OrderPage({ params }: PageProps<'/orders/[id]'>) {
  const { id } = await params;
  return (
    <main id="main" className="wrap">
      <OrderView id={id} />
      <div className="page-foot" />
    </main>
  );
}
