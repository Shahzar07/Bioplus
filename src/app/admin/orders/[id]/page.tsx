import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  MapPin,
  User,
  FlaskConical,
  Clock,
  Package,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { gatewayTitle, orderReceivedPath } from "@/lib/payments";
import {
  NEXT_STATUSES,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  formatOrderDate,
} from "@/lib/order-status";
import { Panel, PanelHead, StatusBadge, TableWrap, Td, Th } from "@/components/admin/ui";
import {
  NoteForm,
  PrintButton,
  StatusActions,
  TrackingForm,
} from "@/components/admin/OrderActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, select: { number: true } });
  return { title: order ? `Order ${order.number}` : "Order" };
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      coaFiles: true,
      user: { select: { id: true, name: true, email: true } },
      events: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { name: true, email: true } } },
      },
    },
  });
  if (!order) notFound();

  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  // Staff are authorised by their session, so the order key is not needed here.
  const proofUrl = `/api/orders/payment-proof?number=${encodeURIComponent(order.number)}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-700 hover:text-brand-700"
        >
          <ArrowLeft size={15} /> All orders
        </Link>
        <PrintButton />
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
              {order.number}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Placed {formatOrderDate(order.placedAt)} · {itemCount}{" "}
            {itemCount === 1 ? "vial" : "vials"} · Payment{" "}
            {PAYMENT_STATUS_LABEL[order.paymentStatus].toLowerCase()}
          </p>
        </div>
        <p className="font-display text-2xl font-bold text-ink-900">
          {formatGBP(Number(order.total))}
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Panel>
            <PanelHead title="Items" />
            <TableWrap>
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr>
                    <Th>Product</Th>
                    <Th>SKU</Th>
                    <Th className="text-right">Qty</Th>
                    <Th className="text-right">Unit</Th>
                    <Th className="text-right">Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <Td>
                        <Link
                          href={`/product/${item.slug}`}
                          target="_blank"
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {item.name}
                        </Link>
                        <span className="block text-[12px] text-ink-500">{item.label}</span>
                      </Td>
                      <Td className="font-mono text-[12.5px] text-ink-600">{item.sku}</Td>
                      <Td className="text-right">{item.qty}</Td>
                      <Td className="text-right text-ink-600">{formatGBP(Number(item.unitPrice))}</Td>
                      <Td className="text-right font-semibold">{formatGBP(Number(item.lineTotal))}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
            <dl className="space-y-2 border-t border-line px-5 py-4 text-[13.5px]">
              <Row label="Subtotal" value={formatGBP(Number(order.subtotal))} />
              {Number(order.discount) > 0 && (
                <Row
                  label={`Discount${order.discountCode ? ` (${order.discountCode})` : ""}`}
                  value={`−${formatGBP(Number(order.discount))}`}
                />
              )}
              <Row
                label="Delivery"
                value={Number(order.shipping) === 0 ? "Free" : formatGBP(Number(order.shipping))}
              />
              <div className="flex items-center justify-between border-t border-line pt-2.5">
                <dt className="font-bold text-ink-900">Total</dt>
                <dd className="font-display text-lg font-bold text-ink-900">
                  {formatGBP(Number(order.total))}
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel className="print:hidden">
            <PanelHead title="Fulfilment" subtitle="Move the order along and record its tracking." />
            <div className="space-y-6 p-5">
              <StatusActions orderId={order.id} available={NEXT_STATUSES[order.status]} />
              <div className="border-t border-line pt-5">
                <TrackingForm
                  orderId={order.id}
                  carrier={order.trackingCarrier}
                  trackingNumber={order.trackingNumber}
                />
              </div>
            </div>
          </Panel>

          <Panel className="print:hidden">
            <PanelHead title="Activity" subtitle="Everything that has happened to this order." />
            <div className="space-y-5 p-5">
              <NoteForm orderId={order.id} />
              <ol className="space-y-3 border-t border-line pt-5">
                {order.events.map((event) => (
                  <li key={event.id} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    <div className="min-w-0">
                      <p className="text-[13.5px] text-ink-800">{event.message}</p>
                      <p className="text-[11.5px] text-ink-500">
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(event.createdAt)}
                        {event.actor ? ` · ${event.actor.name ?? event.actor.email}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <PanelHead title="Customer" />
            <div className="space-y-3 p-5 text-[13.5px]">
              <p className="flex items-start gap-2">
                <User size={15} className="mt-0.5 shrink-0 text-ink-500" />
                <span>
                  <span className="font-semibold text-ink-900">
                    {order.firstName} {order.lastName}
                  </span>
                  <span className="block text-ink-600">{order.email}</span>
                  {order.phone && <span className="block text-ink-600">{order.phone}</span>}
                  {order.user ? (
                    <Link
                      href={`/admin/customers/${order.user.id}`}
                      className="mt-1 inline-block text-[12.5px] font-semibold text-brand-700 hover:underline"
                    >
                      View customer
                    </Link>
                  ) : (
                    <span className="mt-1 inline-block rounded-full bg-haze px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                      Guest checkout
                    </span>
                  )}
                </span>
              </p>
              <p className="flex items-start gap-2 border-t border-line pt-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-ink-500" />
                <address className="not-italic text-ink-700">
                  {order.organisation && <span className="block">{order.organisation}</span>}
                  <span className="block">{order.line1}</span>
                  {order.line2 && <span className="block">{order.line2}</span>}
                  <span className="block">
                    {order.city}
                    {order.county ? `, ${order.county}` : ""}
                  </span>
                  <span className="block font-semibold text-ink-900">{order.postcode}</span>
                  <span className="block">{order.country === "GB" ? "United Kingdom" : order.country}</span>
                </address>
              </p>
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Payment" />
            <div className="space-y-2.5 p-5 text-[13.5px]">
              <div className="flex items-center gap-2 text-ink-700">
                <Landmark size={15} className="text-ink-500" />
                {gatewayTitle(order.paymentMethod)} · reference{" "}
                <span className="font-semibold text-ink-900">{order.number}</span>
              </div>
              <p className="text-ink-600">
                Status:{" "}
                <span
                  className={
                    order.paymentStatus === "PAID"
                      ? "font-semibold text-emerald-700"
                      : "font-semibold text-amber-700"
                  }
                >
                  {PAYMENT_STATUS_LABEL[order.paymentStatus]}
                </span>
              </p>
              {order.paidAt && (
                <p className="text-ink-600">Paid {formatOrderDate(order.paidAt)}</p>
              )}
              {order.paymentProofUploadedAt && (
                <a
                  href={proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-3 rounded-xl border border-line bg-mist p-2.5 transition hover:border-brand-400"
                >
                  {/* The customer's screenshot of their transfer. Evidence to
                      check against the bank, never proof of payment itself. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proofUrl}
                    alt="Payment screenshot from the customer"
                    className="h-14 w-14 shrink-0 rounded-lg bg-white object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-ink-900">
                      Payment screenshot
                    </span>
                    <span className="block text-[12px] text-ink-600">
                      {order.paymentProofUploadedAt
                        ? `Uploaded ${formatOrderDate(order.paymentProofUploadedAt)}`
                        : "Uploaded by the customer"}
                      {" · open"}
                    </span>
                  </span>
                </a>
              )}

              {/* The customer's own payment page — for when they ask for the
                  account details again rather than being sent them by hand. */}
              <Link
                href={orderReceivedPath(order.number, order.accessKey)}
                className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
              >
                Customer payment page <ExternalLink size={13} />
              </Link>
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Compliance" />
            <div className="space-y-2 p-5 text-[13px] text-ink-700">
              <p className="flex items-start gap-2">
                <FlaskConical size={15} className="mt-0.5 shrink-0 text-brand-600" />
                {order.ruoAcceptedAt ? (
                  <span>
                    Research-use declaration accepted{" "}
                    <span className="font-semibold text-ink-900">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(order.ruoAcceptedAt)}
                    </span>
                  </span>
                ) : (
                  <span className="text-amber-700">No declaration recorded.</span>
                )}
              </p>
              {order.coaFiles.length > 0 && (
                <p className="flex items-center gap-2 border-t border-line pt-2.5">
                  <Package size={15} className="text-ink-500" />
                  {order.coaFiles.length} COA{order.coaFiles.length === 1 ? "" : "s"} attached
                </p>
              )}
            </div>
          </Panel>

          {(order.customerNote || order.trackingNumber) && (
            <Panel>
              <PanelHead title="Notes & tracking" />
              <div className="space-y-2.5 p-5 text-[13.5px] text-ink-700">
                {order.trackingNumber && (
                  <p className="flex items-center gap-2">
                    <Clock size={15} className="text-ink-500" />
                    {order.trackingCarrier ? `${order.trackingCarrier} · ` : ""}
                    <span className="font-semibold text-ink-900">{order.trackingNumber}</span>
                  </p>
                )}
                {order.customerNote && (
                  <p className="rounded-xl bg-mist px-3.5 py-2.5 text-[12.5px]">
                    <span className="font-semibold text-ink-900">Customer note: </span>
                    {order.customerNote}
                  </p>
                )}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-600">{label}</dt>
      <dd className="font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
