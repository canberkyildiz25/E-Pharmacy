import { answer } from '@/lib/server/guard';
import { needStore } from '@/lib/server/need';
import { seen } from '@/lib/server/seen';
import { who } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

/** Everything the signed-in account may see, or what anybody may see when nobody is signed in. */
export async function GET() {
  return answer(async () => Response.json(await seen(await needStore(), await who()), { headers: { 'cache-control': 'no-store' } }));
}
