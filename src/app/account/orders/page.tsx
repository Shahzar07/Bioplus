import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { PanelHeader } from "@/components/account/AccountShell";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { ORDER_STATUS_DARK, ORDER_STATUS_LABEL, formatOrderDate } from "@/lib/order-status";

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");

  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { placedAt: "desc" },
    include: { items: true, coaFiles: true },
  });

  return (
    <div className="space-y-6">
      <PanelHeader title="Orders" subtitle="Track and review your BioPlus Labs orders." />

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
            <ShoppingBag size={24} />
          </span>
          <p className="font-display mt-4 text-lg font-bold text-white">No orders yet</p>
          <p className="mt-1.5 text-[13.5px] text-white/55">
            Your orders will appear here once you place one.
          </p>
          <Link
            href="/shop"
            className="brand-gradient mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
          >
            Shop the catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                    <Package size={18} />
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-white">{o.number}</p>
                    <p className="text-[12px] text-white/50">Placed {formatOrderDate(o.placedAt)}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${ORDER_STATUS_DARK[o.status]}`}
                >
                  {ORDER_STATUS_LABEL[o.status]}
                </span>
              </div>

              <ul className="mt-4 space-y-1.5">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between text-[13.5px] text-white/70">
                    <span>
                      {it.qty} × {it.name} {it.label}{" "}
                      <span className="text-white/40">({it.sku})</span>
                    </span>
                    <span className="text-white/50">{formatGBP(Number(it.lineTotal))}</span>
                  </li>
                ))}
              </ul>

              {o.status === "AWAITING_PAYMENT" && (
                <p className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-2.5 text-[12.5px] text-amber-200">
                  Awaiting bank transfer — please quote{" "}
                  <strong className="font-semibold">{o.number}</strong> as your payment reference.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="text-[13px] text-white/55">
                  {o.trackingNumber ? (
                    <>
                      Tracking:{" "}
                      <span className="font-semibold text-brand-300">
                        {o.trackingCarrier ? `${o.trackingCarrier} · ` : ""}
                        {o.trackingNumber}
                      </span>
                    </>
                  ) : (
                    "Tracking available once shipped"
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg font-bold text-white">
                    {formatGBP(Number(o.total))}
                  </span>
                  {o.coaFiles.length > 0 && (
                    <Link
                      href="/account/files"
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-300 hover:text-brand-200"
                    >
                      View COA ({o.coaFiles.length})
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
