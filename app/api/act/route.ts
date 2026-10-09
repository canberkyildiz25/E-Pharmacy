import { act, Refused, type Action, type Change } from '@/lib/rules';
import { answer, Bad, body, brake, own } from '@/lib/server/guard';
import { needStore } from '@/lib/server/need';
import { seen } from '@/lib/server/seen';
import { who } from '@/lib/server/session';
import { shown, world } from '@/lib/server/store';

const fresh = () => crypto.randomUUID().replace(/-/g, '');

/** Does one thing by the rules in rules.ts, keeps what it changed, and sends back what this account may now see. */
export async function POST(request: Request) {
  return answer(async () => {
    own(request);
    brake(request, 'act', 60, 60_000);
    const store = await needStore();
    const user = await who();
    const sent = await body(request);
    let change: Change;
    try {
      change = act(await world(store), user ? shown(user) : null, sent as Action, Date.now(), fresh);
    } catch (error) {
      if (error instanceof Refused) throw new Bad(error.message, error.status);
      throw error;
    }
    await store.apply(change);
    // an account that has changed (a pharmacist who now has a shop) is kept where accounts are
    const changed = user ? change.put.people?.find((person) => person.id === user.id) : undefined;
    const now = user && changed ? { ...user, pharmacyId: changed.pharmacyId } : user;
    if (changed && now) await store.saveUser(now);
    return Response.json({ made: change.made, ...(await seen(store, now)) });
  });
}
