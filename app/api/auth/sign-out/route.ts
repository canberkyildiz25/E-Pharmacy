import { answer, own } from '@/lib/server/guard';
import { needStore } from '@/lib/server/need';
import { seen } from '@/lib/server/seen';
import { shut } from '@/lib/server/session';

export async function POST(request: Request) {
  return answer(async () => {
    own(request);
    await shut();
    return Response.json(await seen(await needStore(), null));
  });
}
