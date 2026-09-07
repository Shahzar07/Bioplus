"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import { bankTransferRows, type BankTransferSettings } from "@/lib/payments";

/**
 * The account details a customer pays into, with the order number as the
 * reference. Rendered from the settings the dashboard holds, never typed out
 * by hand, and copyable field by field so nothing is mistyped into a banking
 * app — the reference least of all, since it is what matches the transfer to
 * the order.
 */
export function BankTransferDetails({
  bank,
  reference,
  tone = "light",
  copyable = true,
  className,
}: {
  bank: BankTransferSettings;
  reference: string;
  tone?: "light" | "dark";
  /** Off before the order exists, when the reference is not yet a real value. */
  copyable?: boolean;
  className?: string;
}) {
  const rows = bankTransferRows(bank, reference);
  const dark = tone === "dark";

  return (
    <dl className={cn("space-y-0", className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between gap-4 border-b py-2.5 last:border-0",
            dark ? "border-white/10" : "border-line",
          )}
        >
          <dt className={cn("text-sm", dark ? "text-white/55" : "text-ink-600")}>{row.label}</dt>
          <dd className="flex items-center gap-2">
            <span
              className={cn(
                row.emphasise
                  ? cn("font-display text-base font-bold", dark ? "text-brand-300" : "text-brand-700")
                  : cn("text-sm font-semibold", dark ? "text-white" : "text-ink-900"),
              )}
            >
              {row.value}
            </span>
            {copyable && <CopyButton label={row.label} value={row.value} dark={dark} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CopyButton({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked — the value is on screen to read anyway */
        }
      }}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={cn(
        "transition",
        copied
          ? "text-emerald-500"
          : dark
            ? "text-white/40 hover:text-brand-300"
            : "text-ink-500 hover:text-brand-600",
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
