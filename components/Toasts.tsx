'use client';

import { create } from 'zustand';

/* A short message at the foot of the screen, for something whose effect the
   visitor cannot already see, or something that can be taken back. Saying
   "saved" about a thing that visibly saved is noise, and is not done here. */

interface Toast {
  id: number;
  text: string;
  undo?: () => void;
}

const useToasts = create<{ list: Toast[] }>(() => ({ list: [] }));
let next = 1;

export function toast(text: string, undo?: () => void) {
  const id = next++;
  useToasts.setState((state) => ({ list: [...state.list.slice(-2), { id, text, undo }] }));
  setTimeout(() => dismiss(id), undo ? 8000 : 4500);
}

function dismiss(id: number) {
  useToasts.setState((state) => ({ list: state.list.filter((item) => item.id !== id) }));
}

export function Toasts() {
  const list = useToasts((state) => state.list);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {list.map((item) => (
        <div key={item.id} className="toast">
          <span>{item.text}</span>
          {item.undo && (
            <button
              type="button"
              className="toast__undo"
              onClick={() => {
                item.undo?.();
                dismiss(item.id);
              }}
            >
              Undo
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
