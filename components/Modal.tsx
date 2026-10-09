'use client';

import { X } from '@phosphor-icons/react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

/** A small form over the page. The browser's own dialog: it holds the focus,
    closes on Escape, and gives the focus back to what opened it. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby={id}
      onClose={onClose}
      onClick={(event) => {
        // a click on the dialog itself is a click on the veil round it
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="modal__in">
        <div className="modal__top">
          <h2 id={id}>{title}</h2>
          <button type="button" className="iconbtn" aria-label="Close" onClick={onClose}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  );
}
