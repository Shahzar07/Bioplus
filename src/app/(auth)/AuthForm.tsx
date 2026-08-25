"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, FlaskConical, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { AuthState } from "./actions";

type Mode = "login" | "register";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50"
    >
      <Lock size={16} />
      {pending ? "Please wait…" : label}
    </button>
  );
}

export function AuthForm({
  mode,
  action,
  next,
}: {
  mode: Mode;
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  next?: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(action, undefined);
  const isRegister = mode === "register";

  return (
    <Container size="narrow" className="py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/25 bg-brand-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Member Access · RUO Platform
          </span>
          <h1 className="font-display mt-5 text-4xl font-extrabold tracking-tight">
            {isRegister ? "Create your account" : "Sign in"}
          </h1>
          <p className="mt-2.5 text-[14.5px] text-ink-600">
            {isRegister
              ? "Track orders, download batch Certificates of Analysis, and manage your research delivery address."
              : "Access your Research Hub, orders and Certificates of Analysis."}
          </p>
        </div>

        <form action={formAction} className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
          {next && <input type="hidden" name="next" value={next} />}

          {state?.error && (
            <p
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800"
            >
              <AlertCircle size={16} className="mt-px shrink-0" />
              {state.error}
            </p>
          )}

          <div className="space-y-4">
            {isRegister && (
              <>
                <Field label="Full name" name="name" autoComplete="name" required />
                <Field
                  label="Institution / Lab (optional)"
                  name="organisation"
                  autoComplete="organization"
                  placeholder="University Research Lab"
                />
              </>
            )}
            <Field
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="researcher@lab.ac.uk"
              required
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              hint={isRegister ? "At least 10 characters." : undefined}
            />
          </div>

          {isRegister && (
            <p className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[12px] leading-relaxed text-amber-900">
              <FlaskConical size={14} className="mt-0.5 shrink-0 text-amber-600" />
              Accounts are for researchers aged 18 or over. All products are supplied for laboratory
              research use only and not for human or animal consumption.
            </p>
          )}

          <div className="mt-6">
            <Submit label={isRegister ? "Create account" : "Sign in"} />
          </div>

          <p className="mt-5 text-center text-[13px] text-ink-600">
            {isRegister ? (
              <>
                Already registered?{" "}
                <Link href="/login" className="font-semibold text-brand-700 hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                No account yet?{" "}
                <Link href="/register" className="font-semibold text-brand-700 hover:underline">
                  Create one
                </Link>
              </>
            )}
          </p>
        </form>

        <p className="mt-6 text-center text-[12px] text-ink-500">
          You can also check out as a guest — an account is never required to order.
        </p>
      </div>
    </Container>
  );
}

function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={props.name} className="mb-1.5 block text-[13px] font-semibold text-ink-800">
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500"
      />
      {hint && <p className="mt-1.5 text-[11.5px] text-ink-500">{hint}</p>}
    </div>
  );
}
