"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Check } from "lucide-react";
import type { FormResult } from "@/app/account/actions";

/**
 * Shared building blocks for the forms inside the dark Research Hub panels.
 * They wrap a server action and surface its success/error result inline.
 */

export function DarkField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={props.name} className="mb-1.5 block text-[13px] font-semibold text-white/70">
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-brand-400"
      />
      {hint && <p className="mt-1.5 text-[11.5px] text-white/40">{hint}</p>}
    </div>
  );
}

export function SubmitButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="brand-gradient h-11 rounded-full px-7 text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function FormBanner({ state }: { state: FormResult }) {
  if (!state) return null;
  if (state.error) {
    return (
      <p
        role="alert"
        className="mb-5 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-[13px] font-medium text-red-200"
      >
        <AlertCircle size={16} className="mt-px shrink-0" />
        {state.error}
      </p>
    );
  }
  return (
    <p className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-[13px] font-medium text-emerald-200">
      <Check size={16} className="mt-px shrink-0" />
      {state.ok}
    </p>
  );
}

/** A dark panel form bound to a server action. */
export function DarkForm({
  action,
  title,
  children,
  submitLabel,
}: {
  action: (state: FormResult, formData: FormData) => Promise<FormResult>;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(action, undefined);

  return (
    <form action={formAction} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-display mb-5 text-base font-bold text-white">{title}</h2>
      <FormBanner state={state} />
      {children}
      <div className="mt-7">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
