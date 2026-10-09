import bcrypt from 'bcryptjs';
import { account } from '@/lib/server/check';
import { answer, Bad, body, brake, own } from '@/lib/server/guard';
import { needStore } from '@/lib/server/need';
import { seen } from '@/lib/server/seen';
import { open } from '@/lib/server/session';

/* Compared against when there is no such account, so that a wrong address
   takes as long to refuse as a wrong password. It is the hash of nothing
   anybody can type. */
const NOBODY = bcrypt.hashSync(crypto.randomUUID(), 11);

export async function POST(request: Request) {
  return answer(async () => {
    own(request);
    brake(request, 'sign-in', 10, 600_000);
    const store = await needStore();
    const { email, password } = account(await body(request), false);
    const user = await store.userByEmail(email);
    const right = await bcrypt.compare(password, user?.hash ?? NOBODY);
    // the same answer for a wrong address and a wrong password
    if (!user || !right) throw new Bad('That address and password do not match an account.', 401);
    await open(user);
    return Response.json(await seen(store, user));
  });
}
