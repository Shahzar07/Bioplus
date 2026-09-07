"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Check, Send } from "lucide-react";
import { submitContactMessage, type ContactState } from "./actions";

/** The public contact form. Every submission is stored and emailed to the shop. */
export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(submitContactMessage, {
    status: "idle",
  });

  if (state.status === "sent") {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
          <Check size={24} strokeWidth={3} />
        </span>
        <p className="font-display mt-4 text-lg font-bold text-emerald-900">Message sent</p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-emerald-900/75">
          Thanks — we&apos;ve got it and will reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 grid gap-4 sm:grid-cols-2">
      {state.status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800 sm:col-span-2"
        >
          <AlertCircle size={16} className="mt-px shrink-0" />
          {state.error}
        </p>
      )}
      <Field label="First name" name="firstName" required />
      <Field label="Last name" name="lastName" required />
      <Field label="Email" type="email" name="email" required full />
      <Field label="Subject" name="subject" full />
      <div className="sm:col-span-2">
        <label htmlFor="message" className="mb-1.5 block text-[13px] font-semibold text-ink-800">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition focus:border-brand-500"
          placeholder="How can we help with your research?"
        />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton />
        <p className="mt-3 text-center text-[11px] text-ink-500">
          By contacting us you acknowledge our products are Research Use Only.
        </p>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
    >
      <Send size={16} />
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

function Field({
  label,
  full,
  ...props
}: { label: string; full?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={props.name} className="mb-1.5 block text-[13px] font-semibold text-ink-800">
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500"
      />
    </div>
  );
}
