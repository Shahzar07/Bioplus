import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { PanelHeader } from "@/components/account/AccountShell";

type Status = "processing" | "shipped" | "delivered";

const ORDERS: {
  id: string;
  date: string;
  status: Status;
  items: { name: string; sku: string; qty: number }[];
  total: string;
  tracking?: string;
}[] = [
  {
    id: "BPL-204881",
    date: "14 June 2026",
    status: "shipped",
    items: [
      { name: "Retatrutide 20 mg × 10", sku: "BPL-RT20", qty: 1 },
      { name: "BPC-157 10 mg × 10", sku: "BPL-BC10", qty: 1 },
    ],
    total: "£240.00",
    tracking: "AB123456789GB",
  },
  {
    id: "BPL-203774",
    date: "2 June 2026",
    status: "delivered",
    items: [{ name: "Tirzepatide 10 mg × 10", sku: "BPL-TR10", qty: 2 }],
    total: "£110.00",
    tracking: "AB987654321GB",
  },
  {
    id: "BPL-202590",
    date: "21 May 2026",
    status: "delivered",
    items: [
      { name: "CJC-1295 + Ipamorelin × 10", sku: "BPL-CP10", qty: 1 },
      { name: "Bacteriostatic Water 10 mL × 10", sku: "BPL-BA10", qty: 1 },
    ],
    total: "£95.00",
  },
];

const STATUS_META: Record<Status, { label: string; icon: React.ElementType; cls: string }> = {
  processing: { label: "Processing", icon: Clock, cls: "bg-amber-500/15 text-amber-300" },
  shipped: { label: "Shipped", icon: Truck, cls: "bg-brand-500/15 text-brand-300" },
  delivered: { label: "Delivered", icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-300" },
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PanelHeader title="Orders" subtitle="Track and review your BioPlus Labs orders." />

      <div className="space-y-4">
        {ORDERS.map((o) => {
          const sm = STATUS_META[o.status];
          return (
            <div key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                    <Package size={18} />
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-white">{o.id}</p>
                    <p className="text-[12px] text-white/50">Placed {o.date}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${sm.cls}`}>
                  <sm.icon size={13} /> {sm.label}
                </span>
              </div>

              <ul className="mt-4 space-y-1.5">
                {o.items.map((it) => (
                  <li key={it.sku} className="flex justify-between text-[13.5px] text-white/70">
                    <span>
                      {it.qty} × {it.name} <span className="text-white/40">({it.sku})</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="text-[13px] text-white/55">
                  {o.tracking ? (
                    <>Tracking: <span className="font-semibold text-brand-300">{o.tracking}</span></>
                  ) : (
                    "Tracking available once shipped"
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg font-bold text-white">{o.total}</span>
                  <Link
                    href="/account/files"
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-300 hover:text-brand-200"
                  >
                    View COA <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
