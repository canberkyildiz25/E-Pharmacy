/* An order in words: the steps it goes through, what each is called, and
   what the button that moves it on says. */

import type { Order, OrderState, Person, Role } from './types';

/** The steps an order goes through, in order, for the way it is to be had. */
export const stepsOf = (order: Pick<Order, 'mode'>): OrderState[] => (order.mode === 'deliver' ? ['placed', 'accepted', 'ready', 'out', 'done'] : ['placed', 'accepted', 'ready', 'done']);

/** Still on its way to somebody: not finished and not called off. */
export const live = (order: Pick<Order, 'state'>) => order.state !== 'done' && order.state !== 'cancelled';

export function stateName(state: OrderState, mode: Order['mode']): string {
  switch (state) {
    case 'placed':
      return 'Sent';
    case 'accepted':
      return 'Accepted';
    case 'ready':
      return mode === 'deliver' ? 'Packed' : 'Ready to collect';
    case 'out':
      return 'On its way';
    case 'done':
      return mode === 'deliver' ? 'Delivered' : 'Collected';
    case 'cancelled':
      return 'Cancelled';
  }
}

/** Where an order is, in a sentence, for the person who placed it. */
export function stateSay(order: Order, shop: string): string {
  switch (order.state) {
    case 'placed':
      return `${shop} has not looked at it yet. Until it does, you can still cancel.`;
    case 'accepted':
      return `${shop} is putting it together.`;
    case 'ready':
      return order.mode === 'deliver' ? `It is packed, and waiting for somebody to carry it.` : `It is on the counter at ${shop}. Say the reference when you get there.`;
    case 'out':
      return `Somebody from ${shop} is on the way to you with it.`;
    case 'done':
      return order.mode === 'deliver' ? `It was handed over at your door.` : `It was handed over at the counter.`;
    case 'cancelled':
      return `Nothing was charged, and what was set aside went back on the shelf.`;
  }
}

/** What the button that moves an order says, to whoever is pressing it. */
export function moveName(to: OrderState, order: Order, who: Person): string {
  if (to === 'cancelled') return who.role === 'customer' ? 'Cancel the order' : order.state === 'placed' ? 'Refuse it' : 'Call it off';
  if (to === 'accepted') return 'Accept it';
  if (to === 'ready') return order.mode === 'deliver' ? 'It is packed' : 'It is on the counter';
  if (to === 'out') return 'It has gone out';
  return order.mode === 'deliver' ? 'It was delivered' : 'It was collected';
}

/** Where an account lands after signing in. */
export const homeOf = (role: Role) => (role === 'pharmacist' ? '/counter/' : role === 'admin' ? '/desk/' : '/open/');
