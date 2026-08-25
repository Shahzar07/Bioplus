"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ShieldAlert, ShieldCheck } from "lucide-react";
import { Panel, PanelHead } from "@/components/admin/ui";
import {
  saveCustomerNote,
  setUserRole,
  setUserStatus,
  type CustomerResult,
} from "@/app/admin/customers/actions";
import type { Role, UserStatus } from "@/generated/prisma";

export function CustomerControls({
  userId,
  email,
  role,
  status,
  notes,
  isSelf,
  canChangeRole,
}: {
  userId: string;
  email: string;
  role: Role;
  status: UserStatus;
  notes: string;
  isSelf: boolean;
  canChangeRole: boolean;
}) {
  const [noteState, noteAction] = useActionState<CustomerResult, FormData>(
    saveCustomerNote,
    undefined,
  );

  return (
    <>
      <Panel>
        <PanelHead title="Account" />
        <div className="space-y-4 p-5">
          {isSelf ? (
            <p className="rounded-xl bg-mist px-3.5 py-2.5 text-[12.5px] text-ink-600">
              This is your own account — suspend and role changes are disabled here to avoid
              locking yourself out.
            </p>
          ) : (
            <>
              <form action={setUserStatus}>
                <input type="hidden" name="id" value={userId} />
                <input
                  type="hidden"
                  name="status"
                  value={status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"}
                />
                <StatusButton status={status} email={email} />
              </form>

              {canChangeRole && (
                <form action={setUserRole} className="flex items-end gap-2">
                  <input type="hidden" name="id" value={userId} />
                  <label className="block flex-1">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">
                      Role
                    </span>
                    <select
                      name="role"
                      defaultValue={role}
                      className="h-9 w-full rounded-xl border border-line bg-white px-3 text-[13px] outline-none focus:border-brand-500"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="STAFF">Staff — dashboard access</option>
                      <option value="ADMIN">Admin — full control</option>
                    </select>
                  </label>
                  <SmallSubmit>Update</SmallSubmit>
                </form>
              )}
            </>
          )}
        </div>
      </Panel>

      <Panel>
        <PanelHead title="Internal note" subtitle="Staff only — never shown to the customer." />
        <form action={noteAction} className="space-y-3 p-5">
          <input type="hidden" name="id" value={userId} />
          <textarea
            name="notes"
            rows={4}
            defaultValue={notes}
            placeholder="Wholesale enquiry, payment arrangement, anything worth remembering"
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-brand-500"
          />
          {noteState?.ok && (
            <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-700">
              <Check size={14} /> {noteState.ok}
            </p>
          )}
          <SmallSubmit>Save note</SmallSubmit>
        </form>
      </Panel>
    </>
  );
}

function StatusButton({ status, email }: { status: UserStatus; email: string }) {
  const { pending } = useFormStatus();
  const suspending = status === "ACTIVE";
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={suspending ? `Suspend ${email}` : `Reactivate ${email}`}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition disabled:opacity-50 ${
        suspending
          ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {suspending ? <ShieldAlert size={15} /> : <ShieldCheck size={15} />}
      {pending ? "Working…" : suspending ? "Suspend account" : "Reactivate account"}
    </button>
  );
}

function SmallSubmit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-700 disabled:opacity-50"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
