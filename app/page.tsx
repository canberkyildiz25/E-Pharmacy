import { Behind } from '@/components/home/Behind';
import { Cover } from '@/components/home/Cover';
import { Needs } from '@/components/home/Needs';
import { OpenNow } from '@/components/home/OpenNow';
import { Watch } from '@/components/home/Watch';

export default function Home() {
  return (
    <main id="main">
      <Cover />
      <OpenNow />
      <Needs />
      <Watch />
      <Behind />
    </main>
  );
}
