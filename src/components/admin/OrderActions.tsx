"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Check, Truck, StickyNote } from "lucide-react";
import { AdminButton } from "@/components/admin/ui";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma";
import {
  addOrderNote,
  saveTracking,
  updateOrderStatus,
  type ActionResult,
} from "@/app/admin/orders/actions";

function Banner({ state }: { state: ActionResult }) {
  if (!state) return null;
  return state.error ? (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] font-medium text-red-800"
    >
      <AlertCircle size={15} className="mt-px shrink-0" />
      {state.error}
    </p>
  ) : (
    <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] font-medium text-emerald-800">
      <Check size={15} className="mt-px shrink-0" />
      {state.ok}
    </p>
  );
}

function Pending({ children, variant }: { children: React.ReactNode; variant?: "primary" | "outline" | "danger" }) {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" variant={variant} disabled={pending}>
      {pending ? "Working…" : children}
    </AdminButton>
  );
}

/** Status transitions available from where the order is now. */
export function StatusActions({
  orderId,
  available,
}: {
  orderId: string;
  available: OrderStatus[];
}) {
  const [state, action] = useActionState<ActionResult, FormData>(updateOrderStatus, undefined);

  return (
    <div className="space-y-3">
      {/* The banner stays even once the order is closed, so the confirmation
          for the action that closed it does not vanish with the buttons. */}
      <Banner state={state} />
      {available.length === 0 && (
        <p className="text-[12.5px] text-ink-500">This order is closed — no further changes.</p>
      )}
      <div className="flex flex-wrap gap-2">
        {available.map((status) => (
          <form key={status} action={action}>
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="status" value={status} />
            <Pending
              variant={status === "CANCELLED" || status === "REFUNDED" ? "danger" : status === "PAID" ? "primary" : "outline"}
            >
              Mark {ORDER_STATUS_LABEL[status].toLowerCase()}
            </Pending>
          </form>
        ))}
      </div>
      {(available.includes("CANCELLED") || available.includes("REFUNDED")) && (
        <p className="text-[11.5px] text-ink-500">
          Cancelling or refunding returns this order&apos;s vials to stock.
        </p>
      )}
    </div>
  );
}

export function TrackingForm({
  orderId,
  carrier,
  trackingNumber,
}: {
  orderId: string;
  carrier: string | null;
  trackingNumber: string | null;
}) {
  const [state, action] = useActionState<ActionResult, FormData>(saveTracking, undefined);

  return (
    <form action={action} className="space-y-3">
      <Banner state={state} />
      <input type="hidden" name="orderId" value={orderId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">Carrier</span>
          <input
            name="carrier"
            defaultValue={carrier ?? ""}
            placeholder="Royal Mail"
            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none focus:border-brand-500"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">Tracking number</span>
          <input
            name="trackingNumber"
            defaultValue={trackingNumber ?? ""}
            placeholder="AB123456789GB"
            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none focus:border-brand-500"
          />
        </label>
      </div>
      <Pending variant="outline">
        <Truck size={15} /> Save tracking
      </Pending>
    </form>
  );
}

export function NoteForm({ orderId }: { orderId: string }) {
  const [state, action] = useActionState<ActionResult, FormData>(addOrderNote, undefined);

  return (
    <form action={action} className="space-y-3">
      <Banner state={state} />
      <input type="hidden" name="orderId" value={orderId} />
      <textarea
        name="note"
        rows={3}
        placeholder="Internal note — visible to staff only"
        className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-brand-500"
      />
      <Pending variant="outline">
        <StickyNote size={15} /> Add note
      </Pending>
    </form>
  );
}

export function PrintButton() {
  return (
    <AdminButton variant="outline" onClick={() => window.print()}>
      Print packing slip
    </AdminButton>
  );
}
