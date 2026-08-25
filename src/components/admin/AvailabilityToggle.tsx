"use client";

import { useTransition } from "react";
import { Check, X, Clock } from "lucide-react";
import type { Availability } from "@/generated/prisma";
import { setVariantAvailability } from "@/app/admin/products/actions";

/**
 * One-click stock control.
 *
 * Cycles in-stock → out-of-stock → arriving-soon, publishing to the storefront
 * on every change — the "stock / unstock" action, without opening the editor.
 */

const NEXT: Record<Availability, Availability> = {
  IN_STOCK: "OUT_OF_STOCK",
  OUT_OF_STOCK: "ARRIVING_SOON",
  ARRIVING_SOON: "IN_STOCK",
};

const META: Record<Availability, { label: string; icon: React.ElementType; className: string }> = {
  IN_STOCK: {
    label: "In stock",
    icon: Check,
    className: "bg-emerald-100 text-emerald-800 ring-emerald-200 hover:bg-emerald-200",
  },
  OUT_OF_STOCK: {
    label: "Out of stock",
    icon: X,
    className: "bg-red-50 text-red-700 ring-red-200 hover:bg-red-100",
  },
  ARRIVING_SOON: {
    label: "Arriving soon",
    icon: Clock,
    className: "bg-amber-100 text-amber-800 ring-amber-200 hover:bg-amber-200",
  },
};

export function AvailabilityToggle({
  variantId,
  sku,
  availability,
}: {
  variantId: string;
  sku: string;
  availability: Availability;
}) {
  const [pending, startTransition] = useTransition();
  const meta = META[availability];
  const Icon = meta.icon;

  return (
    <button
      type="button"
      disabled={pending}
      data-testid={`availability-${sku}`}
      aria-label={`${sku} is ${meta.label.toLowerCase()} — change to ${META[NEXT[availability]].label.toLowerCase()}`}
      title={`Change to ${META[NEXT[availability]].label.toLowerCase()}`}
      onClick={() => {
        const formData = new FormData();
        formData.set("variantId", variantId);
        formData.set("availability", NEXT[availability]);
        startTransition(() => setVariantAvailability(formData));
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ring-1 ring-inset transition disabled:opacity-50 ${meta.className}`}
    >
      <Icon size={11} />
      {pending ? "Saving…" : meta.label}
    </button>
  );
}
