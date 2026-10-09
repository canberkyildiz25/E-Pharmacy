import 'server-only';

/* What every request that changes something has to get past. */

export class Bad extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export const say = (status: number, message: string) => Response.json({ message }, { status });

/** Runs a handler, and turns a refusal into the answer it stands for. Anything else is logged, not shown. */
export async function answer(run: () => Promise<Response>): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof Bad) return say(error.status, error.message);
    console.error('Nobet:', error);
    return say(500, 'Something went wrong on the server. Try again in a moment.');
  }
}

/* A request that changes something has to come from this site's own pages.
   A browser says where a request came from, and a page on another site
   cannot forge that. */
export function own(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  let from: string | null = null;
  try {
    from = origin ? new URL(origin).host : null;
  } catch {
    from = null;
  }
  if (!from || !host || from !== host) throw new Bad('That request did not come from this site.', 403);
}

const LIMIT = 700_000;

/** The body of a request, as JSON, and not more of it than a medicine with a photograph needs. */
export async function body(request: Request): Promise<Record<string, unknown>> {
  if (!(request.headers.get('content-type') ?? '').startsWith('application/json')) throw new Bad('Send JSON.', 415);
  const text = await request.text();
  if (text.length > LIMIT) throw new Bad('That is too much to send at once. Use a smaller photograph.', 413);
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('not an object');
    return parsed as Record<string, unknown>;
  } catch {
    throw new Bad('That could not be read.');
  }
}

/* A brake on guessing passwords and on flooding a pharmacy with orders. It
   counts in the server's memory, so on a host that runs many copies of the
   server it slows an attacker down and does not stop one. */
const held = globalThis as { nobetHits?: Map<string, number[]> };

export function brake(request: Request, what: string, most: number, withinMs: number) {
  const hits = (held.nobetHits ??= new Map<string, number[]>());
  const from = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'local';
  const key = `${what}:${from}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < withinMs);
  if (recent.length >= most) throw new Bad('Too many tries. Wait a few minutes and try again.', 429);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
}
