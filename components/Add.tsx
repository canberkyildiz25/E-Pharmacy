'use client';

import { Check, Plus } from '@phosphor-icons/react';
import { useState } from 'react';
import { addToBasket, useStore } from '@/lib/store';
import { toast } from './Toasts';

/** Puts one of a medicine in the basket, from one pharmacy. A basket goes to one pharmacy, so adding from another starts it again, and says so. */
export function Add({ pharmacyId, medicineId, name, left, small = false }: { pharmacyId: string; medicineId: string; name: string; left: number; small?: boolean }) {
  const inBasket = useStore((state) => (state.ready && state.basket?.pharmacyId === pharmacyId ? (state.basket.lines.find((line) => line.medicineId === medicineId)?.qty ?? 0) : 0));
  const [just, setJust] = useState(false);

  function add() {
    const before = useStore.getState().basket;
    addToBasket(pharmacyId, medicineId);
    setJust(true);
    setTimeout(() => setJust(false), 1400);
    if (before && before.pharmacyId !== pharmacyId) toast('A basket goes to one pharmacy, so it was started again.', () => useStore.setState({ basket: before }));
  }

  if (left < 1)
    return (
      <button type="button" className={`btn btn--line${small ? ' btn--small' : ''}`} disabled>
        Out of stock
      </button>
    );
  return (
    <button type="button" className={`btn${small ? ' btn--small' : ''}`} onClick={add} disabled={inBasket >= Math.min(9, left)} aria-label={`Add ${name} to the basket`}>
      {just ? <Check size={18} weight="bold" aria-hidden="true" /> : <Plus size={18} weight="bold" aria-hidden="true" />}
      {inBasket ? `In the basket: ${inBasket}` : 'Add'}
    </button>
  );
}
