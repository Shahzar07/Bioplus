"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Check } from "lucide-react";
import {
  saveDiscount,
  toggleDiscount,
  type DiscountResult,
} from "@/app/admin/discounts/actions";

export function DiscountForm() {
  const [state, action] = useActionState<DiscountResult, FormData>(saveDiscount, undefined);

  return (
    <form action={action} className="space-y-4 p-5">
      {state?.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] font-medium text-red-800"
        >
          <AlertCircle size={15} className="mt-px shrink-0" />
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] font-medium text-emerald-800">
          <Check size={15} className="mt-px shrink-0" />
          {state.ok}
        </p>
      )}

      <Field label="Code" name="code" placeholder="RESEARCH10" required />

      <label className="block">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">Type</span>
        <select
          name="type"
          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none focus:border-brand-500"
        >
          <option value="PERCENT">Percentage off</option>
          <option value="FIXED">Fixed amount off</option>
        </select>
      </label>

      <Field label="Value" name="value" type="number" step="0.01" min="0" placeholder="10" required />
      <Field
        label="Minimum spend (optional)"
        name="minSpend"
        type="number"
        step="0.01"
        min="0"
        placeholder="100"
      />
      <Field
        label="Usage limit (optional)"
        name="usageLimit"
        type="number"
        min="1"
        placeholder="Unlimited"
      />
      <Field label="Starts (optional)" name="startsAt" type="date" />
      <Field label="Ends (optional)" name="endsAt" type="date" />

      <Submit />
    </form>
  );
}

export function DiscountToggle({
  id,
  code,
  active,
}: {
  id: string;
  code: string;
  active: boolean;
}) {
  return (
    <form action={toggleDiscount} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={active ? `Pause ${code}` : `Activate ${code}`}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset transition ${
          active
            ? "bg-emerald-100 text-emerald-800 ring-emerald-200 hover:bg-emerald-200"
            : "bg-haze text-ink-600 ring-line hover:bg-line"
        }`}
      >
        {active ? "Active" : "Paused"}
      </button>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="brand-gradient inline-flex h-9 w-full items-center justify-center rounded-full px-5 text-[13px] font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50"
    >
      {pending ? "Creating…" : "Create code"}
    </button>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">{label}</span>
      <input
        {...props}
        className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none transition focus:border-brand-500"
      />
    </label>
  );
}
