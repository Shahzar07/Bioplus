"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Check } from "lucide-react";
import { Panel, PanelHead } from "@/components/admin/ui";
import type { SettingsResult } from "@/app/admin/settings/actions";

export function SettingsPanel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action: (state: SettingsResult, formData: FormData) => Promise<SettingsResult>;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState<SettingsResult, FormData>(action, undefined);

  return (
    <Panel>
      <PanelHead title={title} subtitle={subtitle} />
      <form action={formAction} className="space-y-4 p-5">
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
        {children}
        <Save />
      </form>
    </Panel>
  );
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="brand-gradient inline-flex h-9 items-center rounded-full px-5 text-[13px] font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function SettingField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">{label}</span>
      <input
        {...props}
        className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none transition focus:border-brand-500"
      />
      {hint && <span className="mt-1 block text-[11.5px] text-ink-500">{hint}</span>}
    </label>
  );
}

export function SettingTextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">{label}</span>
      <textarea
        {...props}
        className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] outline-none transition focus:border-brand-500"
      />
    </label>
  );
}
