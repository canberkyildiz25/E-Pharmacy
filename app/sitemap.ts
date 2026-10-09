import type { MetadataRoute } from 'next';
import { MEDICINES, medicinePath, PHARMACIES, pharmacyPath } from '@/lib/seed';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/open/', '/medicines/', '/counter/', '/about/', '/credits/', ...PHARMACIES.map((shop) => pharmacyPath(shop.id)), ...MEDICINES.map((item) => medicinePath(item.id))];
  return paths.map((path) => ({ url: `${SITE}${path}` }));
}
