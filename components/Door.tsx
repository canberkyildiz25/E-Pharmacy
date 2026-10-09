'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { homeOf } from '@/lib/orders';
import { demo, join, Refused, signIn, useStore } from '@/lib/store';
import type { Role } from '@/lib/types';
import { Choices, Field, Refusal } from './Field';

const TRY: { role: Role; who: string; what: string }[] = [
  { role: 'customer', who: 'A customer', what: 'Ece, who has an order waiting at a counter' },
  { role: 'pharmacist', who: 'A pharmacist', what: 'Selin, behind the counter of Derman Eczanesi' },
  { role: 'admin', who: 'The administrator', what: 'Deniz, who sees every pharmacy and every order' },
];

/** Signing in and joining are one page in two states. Without a database there are also three accounts to walk straight into. */
export function Door({ kind }: { kind: 'in' | 'join' }) {
  const router = useRouter();
  const params = useSearchParams();
  const mode = useStore((state) => state.mode);
  const ready = useStore((state) => state.ready);
  // only ever a page of this site
  const asked = params.get('next');
  const next = asked && /^\/[a-z0-9/-]*$/i.test(asked) && !asked.startsWith('//') ? asked : null;
  const carry = next ? `?next=${next}` : '';

  const [role, setRole] = useState<'customer' | 'pharmacist'>(next === '/counter/' ? 'pharmacist' : 'customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrong, setWrong] = useState<{ name?: string; email?: string; password?: string }>({});
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const land = () => router.push(next ?? homeOf(useStore.getState().me?.role ?? 'customer'));

  async function send(event: FormEvent) {
    event.preventDefault();
    const found: typeof wrong = {};
    if (kind === 'join' && name.trim().length < 2) found.name = 'Write your name as a pharmacy should say it.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) found.email = 'Write an address like name@example.com.';
    if (kind === 'join' ? password.length < 8 : !password) found.password = kind === 'join' ? 'Use at least eight characters.' : 'Write your password.';
    setWrong(found);
    setProblem(null);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      if (kind === 'join') await join(name, email, password, role);
      else await signIn(email, password);
      land();
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
      setBusy(false);
    }
  }

  function walkIn(as: Role) {
    try {
      demo(as);
      router.push(next && as === 'customer' ? next : homeOf(as));
    } catch (error) {
      setProblem(error instanceof Refused ? error.message : 'That did not go through.');
    }
  }

  return (
    <div className="door">
      <section aria-labelledby="door-title">
        <h2 id="door-title" className="sr-only">
          {kind === 'join' ? 'A new account' : 'Your account'}
        </h2>
        <form className="form" onSubmit={send} noValidate>
          {kind === 'join' && (
            <>
              <Choices
                legend="What are you here to do"
                name="role"
                value={role}
                onChange={setRole}
                options={[
                  { value: 'customer', label: 'Order from a pharmacy' },
                  { value: 'pharmacist', label: 'Run a pharmacy' },
                ]}
              />
              <Field label="Name" error={wrong.name}>
                {(wire) => <input {...wire} className="input" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={60} required />}
              </Field>
            </>
          )}
          <Field label="Email" error={wrong.email}>
            {(wire) => <input {...wire} className="input" type="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={120} required />}
          </Field>
          <Field label="Password" hint={kind === 'join' ? 'At least eight characters.' : undefined} error={wrong.password}>
            {(wire) => <input {...wire} className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={kind === 'join' ? 'new-password' : 'current-password'} maxLength={200} required />}
          </Field>
          <Refusal text={problem} />
          <div className="form__acts">
            <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
              {busy ? 'One moment' : kind === 'join' ? 'Make the account' : 'Sign in'}
            </button>
          </div>
        </form>
        <p className="door__other">
          {kind === 'join' ? 'Been here before? ' : 'New here? '}
          <Link className="link" href={kind === 'join' ? `/sign-in/${carry}` : `/join/${carry}`}>
            {kind === 'join' ? 'Sign in' : 'Make an account'}
          </Link>
        </p>
        {ready && mode === 'local' && <p className="door__other">An account made here is kept in this browser only, and its password is never sent anywhere.</p>}
      </section>

      {(!ready || mode === 'local') && (
        <section className="door__try" aria-labelledby="try-title">
          <h2 id="try-title">Or walk straight in</h2>
          <p>Three accounts come with the demonstration, one for each side of the counter. Whatever you do as one of them stays in this browser.</p>
          <ul>
            {TRY.map((entry) => (
              <li key={entry.role}>
                <button type="button" onClick={() => walkIn(entry.role)} disabled={!ready}>
                  <strong>{entry.who}</strong>
                  <small>{entry.what}</small>
                  <ArrowRight size={22} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
