import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Landmark, Package, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BankTransferDetails } from "@/components/checkout/BankTransferDetails";
import { PaymentWindow } from "@/components/checkout/PaymentWindow";
import { db } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { formatGBP } from "@/lib/cn";
import { hasBankDetails, PAYMENT_WINDOW_MINUTES } from "@/lib/payments";
import { ORDER_STATUS_LABEL, ORDER_STATUS_LIGHT, formatOrderDate } from "@/lib/order-status";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

/**
 * The order's own payment page — WooCommerce's order-received URL.
 *
 * Checkout redirects here, the confirmation email links here and the Research
 * Hub links here, so the account details and the payment reference are issued
 * by the store itself and stay reachable: a closed tab, a refresh or a phone
 * that was not the device used to order all land on the same page. Nobody has
 * to be sent the details by hand, and no proof of payment is asked for — the
 * order is held until the owner marks the transfer received.
 */
export default async function OrderReceivedPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { number } = await params;
  const { key } = await searchParams;

  const order = await db.order.findUnique({
    where: { number: decodeURIComponent(number) },
    include: { items: true },
  });
  if (!order) notFound();

  // The URL's key is what grants access to a guest. Signed-in customers reach
  // their own orders without it, and staff can open any of them.
  const user = await getCurrentUser();
  const permitted =
    (key !== undefined && key === order.accessKey) ||
    (user !== null && (order.userId === user.id || isStaff(user)));
  if (!permitted) notFound();

  const settings = await getSettings();
  const bank = settings.bankTransfer;
  const awaitingPayment = order.paymentStatus === "PENDING" && order.status === "AWAITING_PAYMENT";
  // Without blob storage there is nowhere to put a screenshot, so the upload
  // box is hidden rather than offered and then refused.
  const uploadsEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <Container size="narrow" className="py-16">
      <div className="text-center">
        <div className="brand-gradient mx-auto grid h-16 w-16 place-items-center rounded-full text-white">
          <Check size={30} strokeWidth={3} />
        </div>
        <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight">Order received</h1>
        <p className="mt-3 text-ink-600">
          Thank you, {order.firstName}. Your order <strong className="text-ink-900">{order.number}</strong>{" "}
          was placed on {formatOrderDate(order.placedAt)}.
        </p>
        <span
          className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${ORDER_STATUS_LIGHT[order.status]}`}
        >
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold">
          <Landmark size={19} className="text-brand-600" />
          {awaitingPayment ? "Pay by direct bank transfer" : "Payment"}
        </h2>

        {!awaitingPayment ? (
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600">
            Payment for this order has been received — there is nothing more to pay. You can follow
            its progress in your Research Hub.
          </p>
        ) : hasBankDetails(bank) ? (
          <>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
              Transfer <strong className="text-ink-900">{formatGBP(Number(order.total))}</strong> to
              the account below from your banking app, quoting the payment reference — that reference
              is how we match your transfer to this order. Please pay within{" "}
              {PAYMENT_WINDOW_MINUTES} minutes so we can dispatch today.
            </p>
            <BankTransferDetails bank={bank} reference={order.number} className="mt-4" />
            <PaymentWindow
              orderNumber={order.number}
              accessKey={order.accessKey}
              placedAt={order.placedAt.toISOString()}
              existingProofUrl={order.paymentProofUrl}
              uploadsEnabled={uploadsEnabled}
            />
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-mist px-4 py-3 text-[12.5px] leading-relaxed text-ink-600">
              <ShieldCheck size={15} className="mt-px shrink-0 text-brand-600" />
              <span>{bank.instructions}</span>
            </p>
          </>
        ) : (
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600">
            We&apos;ll email you the account details shortly. Please quote{" "}
            <strong className="text-ink-900">{order.number}</strong> as your payment reference.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold">
          <Package size={19} className="text-brand-600" /> Your order
        </h2>
        <ul className="mt-4 space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-[13.5px]">
              <span className="text-ink-700">
                {item.qty} × {item.name}{" "}
                <span className="text-ink-500">
                  {item.label} ({item.sku})
                </span>
              </span>
              <span className="font-semibold">{formatGBP(Number(item.lineTotal))}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <Line label="Subtotal" value={formatGBP(Number(order.subtotal))} />
          {Number(order.discount) > 0 && (
            <Line
              label={`Discount${order.discountCode ? ` (${order.discountCode})` : ""}`}
              value={`−${formatGBP(Number(order.discount))}`}
            />
          )}
          <Line
            label="Delivery"
            value={Number(order.shipping) === 0 ? "Free" : formatGBP(Number(order.shipping))}
          />
          <div className="flex justify-between border-t border-line pt-3">
            <dt className="font-bold">Total</dt>
            <dd className="font-display text-xl font-bold">{formatGBP(Number(order.total))}</dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-600">
          <p className="flex items-center gap-2 font-semibold text-ink-800">
            <Truck size={15} className="text-brand-600" /> Delivery address
          </p>
          <p className="mt-1.5">
            {order.firstName} {order.lastName}
            {order.organisation ? ` · ${order.organisation}` : ""}
            <br />
            {order.line1}
            {order.line2 ? `, ${order.line2}` : ""}
            <br />
            {order.city}
            {order.county ? `, ${order.county}` : ""} {order.postcode}
          </p>
        </div>
      </section>

      <p className="mt-6 text-center text-[12.5px] leading-relaxed text-ink-500">
        Keep this page — the link in your confirmation email brings you back to it at any time.
        We&apos;ll email you again as soon as the transfer clears and your order is dispatched.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={user ? "/account/orders" : "/register"}
          className="brand-gradient rounded-full px-6 py-3 text-sm font-bold text-white"
        >
          {user ? "View order in Research Hub" : "Create an account to track it"}
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-800 hover:border-brand-500"
        >
          Continue shopping
        </Link>
      </div>
    </Container>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-600">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
