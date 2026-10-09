import { db } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

/** How the site is running: with MongoDB, with the memory store, or with no database at all. */
export async function GET() {
  return Response.json({ db: await db() }, { headers: { 'cache-control': 'no-store' } });
}
