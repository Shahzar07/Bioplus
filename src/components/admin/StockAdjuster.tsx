"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Minus, Plus } from "lucide-react";
import { adjustStock, type StockResult } from "@/app/admin/inventory/actions";

/** Add or remove stock for one SKU, with the reason recorded. */
export function StockAdjuster({ variantId, sku }: { variantId: string; sku: string }) {
  const [state, action] = useActionState<StockResult, FormData>(adjustStock, undefined);
  const [amount, setAmount] = useState("1");

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={action} className="flex items-center gap-1.5">
        <input type="hidden" name="variantId" value={variantId} />
        <input
          aria-label={`Adjustment amount for ${sku}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
          inputMode="numeric"
          className="h-8 w-14 rounded-lg border border-line bg-white px-2 text-center text-[13px] outline-none focus:border-brand-500"
        />
        <AdjustButton name="delta" value={amount || "0"} label={`Add stock to ${sku}`}>
          <Plus size={14} />
        </AdjustButton>
        <AdjustButton name="delta" value={`-${amount || "0"}`} label={`Remove stock from ${sku}`}>
          <Minus size={14} />
        </AdjustButton>
      </form>
      {state?.error && <p className="text-[11px] font-medium text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-[11px] font-medium text-emerald-700">{state.ok}</p>}
    </div>
  );
}

function AdjustButton({
  name,
  value,
  label,
  children,
}: {
  name: string;
  value: string;
  label: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={name}
      value={value}
      aria-label={label}
      disabled={pending}
      className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-ink-700 transition hover:border-brand-500 hover:text-brand-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
