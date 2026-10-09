'use client';

import { WarningCircle } from '@phosphor-icons/react';
import { useId, type ReactNode } from 'react';

/** What a control needs to be tied to its label, its hint and its error. */
export interface Wire {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

function Problem({ id, text }: { id: string; text: string }) {
  return (
    <p id={id} className="field__error">
      <WarningCircle size={18} weight="fill" aria-hidden="true" />
      {text}
    </p>
  );
}

/** A labelled control. The label is always visible, and an error says what to do about it. */
export function Field({ label, hint, error, optional = false, children }: { label: string; hint?: string; error?: string; optional?: boolean; children: (wire: Wire) => ReactNode }) {
  const id = useId();
  const described = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="field__opt"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': described, 'aria-invalid': error ? true : undefined })}
      <div className="field__slot">{error && <Problem id={`${id}-error`} text={error} />}</div>
    </div>
  );
}

/** One of a few, as a row of buttons where one is on. */
export function Choices<T extends string>({
  legend,
  name,
  value,
  onChange,
  options,
  hint,
  error,
}: {
  legend: string;
  name: string;
  value: T | '';
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const described = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <fieldset className="field" aria-describedby={described}>
      <legend>{legend}</legend>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      <div className="choices">
        {options.map((option) => (
          <label key={option.value} className="choice">
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <div className="field__slot">{error && <Problem id={`${id}-error`} text={error} />}</div>
    </fieldset>
  );
}

/** What went wrong with the whole form, said once, above its button. */
export function Refusal({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p className="refused" role="alert">
      <WarningCircle size={20} weight="fill" aria-hidden="true" />
      {text}
    </p>
  );
}
