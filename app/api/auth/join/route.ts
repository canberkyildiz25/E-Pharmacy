import bcrypt from 'bcryptjs';
import { account } from '@/lib/server/check';
import { answer, Bad, body, brake, own } from '@/lib/server/guard';
import { needStore } from '@/lib/server/need';
import { seen } from '@/lib/server/seen';
import { open } from '@/lib/server/session';
import type { User } from '@/lib/server/store';

export async function POST(request: Request) {
  return answer(async () => {
    own(request);
    brake(request, 'join', 8, 600_000);
    const store = await needStore();
    const { name, email, password, role } = account(await body(request), true);
    // one address, named in the environment, oversees the platform
    const overseer = process.env.NOBET_ADMIN?.trim().toLowerCase();
    const user: User = { id: crypto.randomUUID(), name, email, role: overseer && email === overseer ? 'admin' : role, hash: await bcrypt.hash(password, 11), made: Date.now() };
    if (!(await store.addUser(user))) throw new Bad('There is already an account with that address. Sign in instead.', 409);
    await open(user);
    return Response.json(await seen(store, user), { status: 201 });
  });
}
