"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Check,
  FlaskConical,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Landmark,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/cart-context";
import { useVariantBySku } from "@/lib/catalog-context";
import { formatGBP } from "@/lib/cn";
import { ProductImage } from "@/components/product/ProductImage";
import { BankTransferDetails } from "@/components/checkout/BankTransferDetails";
import {
  DEFAULT_GATEWAY,
  ENABLED_GATEWAYS,
  hasBankDetails,
  type BankTransferSettings,
} from "@/lib/payments";
import { submitOrder, quoteCart, type CheckoutState, type QuoteResult } from "./actions";

type Prefill = {
  email: string;
  phone: string;
  organisation: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
};

export function CheckoutClient({
  prefill,
  bankTransfer,
  freeShippingThreshold,
  signedIn,
}: {
  prefill: Prefill;
  bankTransfer: BankTransferSettings;
  freeShippingThreshold: number;
  signedIn: boolean;
}) {
  const { detailedLines, lines, clear, count } = useCart();
  const variantBySku = useVariantBySku();
  const router = useRouter();
  const [state, formAction] = useActionState<CheckoutState, FormData>(submitOrder, {
    status: "idle",
  });
  const [agree, setAgree] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [method, setMethod] = useState(DEFAULT_GATEWAY);

  // Totals are quoted by the server so the figure shown is the figure charged.
  useEffect(() => {
    if (state.status === "placed") return;
    let cancelled = false;
    quoteCart(lines, discountCode || undefined).then((result) => {
      if (!cancelled) setQuote(result);
    });
    return () => {
      cancelled = true;
    };
  }, [lines, discountCode, state.status]);

  const showBankPreview = hasBankDetails(bankTransfer);
  const placed = state.status === "placed";
  const redirectTo = state.status === "placed" ? state.redirectTo : null;

  // Clear the cart once the order is safely recorded, then hand over to the
  // order's own payment page. Replacing rather than pushing keeps Back from
  // returning to a checkout form whose cart has already been consumed.
  useEffect(() => {
    if (!redirectTo) return;
    clear();
    router.replace(redirectTo);
    // `clear` is stable enough for this one-shot effect; re-running on cart
    // identity changes would wipe a cart the customer has started rebuilding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectTo]);

  if (placed) {
    return (
      <Container size="narrow" className="py-24 text-center">
        <Loader2 size={28} className="mx-auto animate-spin text-brand-600" />
        <p className="mt-4 text-sm font-semibold text-ink-700">
          Order {state.orderNumber} placed — opening your payment details…
        </p>
      </Container>
    );
  }

  if (count === 0) {
    return (
      <Container size="narrow" className="py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-ink-600">Add research compounds before checking out.</p>
        <Link
          href="/shop"
          className="brand-gradient mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
        >
          Shop the catalogue
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-brand-700"
      >
        <ArrowLeft size={16} /> Back to cart
      </Link>
      <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight">Checkout</h1>

      {!signedIn && (
        <p className="mt-3 text-[13.5px] text-ink-600">
          Checking out as a guest.{" "}
          <Link href="/login?next=%2Fcheckout" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>{" "}
          to use a saved address and keep this order in your Research Hub.
        </p>
      )}

      <form action={formAction} className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* The cart is the browser's; the server re-prices every line from it. */}
        <input type="hidden" name="lines" value={JSON.stringify(lines)} />
        <input type="hidden" name="discountCode" value={quote?.discountCode ?? ""} />

        <div className="space-y-8">
          {state.status === "error" && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800"
            >
              <AlertCircle size={16} className="mt-px shrink-0" />
              {state.error}
            </p>
          )}

          <Fieldset step="1" title="Contact information">
            <Field label="Email address" type="email" name="email" defaultValue={prefill.email} placeholder="researcher@lab.ac.uk" required full />
            <Field label="Phone" type="tel" name="phone" defaultValue={prefill.phone} placeholder="07700 900123" full />
          </Fieldset>

          <Fieldset step="2" title="Research delivery address">
            <Field label="Institution / Lab (optional)" name="organisation" defaultValue={prefill.organisation} placeholder="University Research Lab" full />
            <Field label="First name" name="firstName" defaultValue={prefill.firstName} required />
            <Field label="Last name" name="lastName" defaultValue={prefill.lastName} required />
            <Field label="Address line 1" name="line1" defaultValue={prefill.line1} placeholder="House number and street" required full />
            <Field label="Address line 2 (optional)" name="line2" defaultValue={prefill.line2} full />
            <Field label="Town / City" name="city" defaultValue={prefill.city} required />
            <Field label="County (optional)" name="county" defaultValue={prefill.county} />
            <Field label="Postcode" name="postcode" defaultValue={prefill.postcode} placeholder="EH32 9BZ" required />
            <div>
              <label htmlFor="country" className="mb-1.5 block text-[13px] font-semibold text-ink-800">
                Country
              </label>
              <select
                id="country"
                name="country"
                defaultValue={prefill.country}
                className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-500"
              >
                <option value="GB">United Kingdom</option>
                <option value="IE">Ireland</option>
              </select>
            </div>
          </Fieldset>

          <Fieldset step="3" title="Payment method">
            <div className="col-span-full space-y-3">
              {ENABLED_GATEWAYS.map((gateway) => {
                const selected = method === gateway.id;
                return (
                  <label
                    key={gateway.id}
                    className={`block cursor-pointer rounded-xl border px-4 py-3.5 transition ${
                      selected ? "border-brand-500 bg-brand-50/50" : "border-line bg-white hover:border-brand-300"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={gateway.id}
                        checked={selected}
                        onChange={() => setMethod(gateway.id)}
                        className="h-4 w-4 accent-brand-600"
                      />
                      <Landmark size={17} className="shrink-0 text-brand-600" />
                      <span className="text-[14px] font-bold text-ink-900">{gateway.title}</span>
                    </span>
                    {selected && (
                      <span className="mt-2.5 block pl-7 text-[12.5px] leading-relaxed text-ink-600">
                        {gateway.description}
                      </span>
                    )}
                  </label>
                );
              })}

              {method === "BANK_TRANSFER" && showBankPreview && (
                <div className="rounded-xl border border-line bg-mist px-4 py-3.5">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-500">
                    You&apos;ll be paying into
                  </p>
                  <BankTransferDetails
                    bank={bankTransfer}
                    reference="Your order number"
                    copyable={false}
                    className="mt-1.5"
                  />
                </div>
              )}

              <Field
                label="Order notes (optional)"
                name="customerNote"
                placeholder="Anything we should know about this order"
                full
              />
            </div>
          </Fieldset>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <input
              type="checkbox"
              name="ruo"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand-600"
              required
            />
            <span className="text-[12.5px] leading-relaxed text-amber-900">
              <FlaskConical size={14} className="mr-1 inline text-amber-600" />
              I certify that I am purchasing for legitimate research purposes, am at least 18 years of
              age, and that all products will be used solely for laboratory research in accordance with
              applicable laws. Products are not for human or animal consumption.
            </span>
          </label>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {detailedLines.map((l) => {
                const found = variantBySku(l.sku);
                return (
                  <li key={l.sku} className="flex items-center gap-3">
                    <span className="relative flex h-14 w-12 items-center justify-center rounded-lg bg-white">
                      {found && <ProductImage slug={found.product.slug} name={l.name} className="h-12 w-auto" />}
                      <span className="brand-gradient absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white">
                        {l.qty}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{l.name}</span>
                      <span className="block truncate text-[11px] text-ink-500">{l.label}</span>
                    </span>
                    <span className="text-[13px] font-bold">{formatGBP(l.lineTotal)}</span>
                  </li>
                );
              })}
            </ul>

            <DiscountField
              value={discountCode}
              onChange={setDiscountCode}
              applied={quote?.discountCode}
              error={quote?.error}
            />

            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="font-semibold">{formatGBP(quote?.subtotal ?? 0)}</dd>
              </div>
              {(quote?.discount ?? 0) > 0 && (
                <div className="flex justify-between text-brand-700">
                  <dt>Discount ({quote?.discountCode})</dt>
                  <dd className="font-semibold">−{formatGBP(quote?.discount ?? 0)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-600">Delivery</dt>
                <dd className="font-semibold">
                  {quote?.shipping === 0 ? "Free" : formatGBP(quote?.shipping ?? 0)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-display text-xl font-bold">{formatGBP(quote?.total ?? 0)}</dd>
              </div>
            </dl>

            {(quote?.subtotal ?? 0) < freeShippingThreshold && (
              <p className="mt-3 text-[11.5px] text-ink-500">
                Spend {formatGBP(freeShippingThreshold - (quote?.subtotal ?? 0))} more for free delivery.
              </p>
            )}

            <PlaceOrderButton disabled={!agree} total={quote?.total ?? 0} />

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-ink-500">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-brand-600" /> SSL secure
              </span>
              <span className="flex items-center gap-1">
                <FlaskConical size={13} className="text-brand-600" /> Research Use Only
              </span>
            </div>
          </div>
        </aside>
      </form>
    </Container>
  );
}

function PlaceOrderButton({ disabled, total }: { disabled: boolean; total: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-40"
    >
      <Lock size={16} />
      {pending ? "Placing order…" : `Place order — ${formatGBP(total)}`}
    </button>
  );
}

function DiscountField({
  value,
  onChange,
  applied,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  applied?: string;
  error?: string;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <div className="mt-5 border-t border-line pt-4">
      <label htmlFor="discount-draft" className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">
        Discount code
      </label>
      <div className="flex gap-2">
        <input
          id="discount-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value.toUpperCase())}
          placeholder="Optional"
          className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-sm uppercase outline-none transition focus:border-brand-500"
        />
        <button
          type="button"
          onClick={() => onChange(draft.trim())}
          className="h-10 shrink-0 rounded-xl border border-ink-900/15 px-4 text-[13px] font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-700"
        >
          Apply
        </button>
      </div>
      {applied && !error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11.5px] font-medium text-emerald-700">
          <Check size={12} /> {applied} applied
        </p>
      )}
      {error && <p className="mt-1.5 text-[11.5px] font-medium text-red-700">{error}</p>}
    </div>
  );
}

function Fieldset({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
      <h2 className="font-display flex items-center gap-3 border-b border-line bg-mist px-6 py-4 text-[17px] font-bold">
        <span className="brand-gradient grid h-7 w-7 place-items-center rounded-md text-[13px] font-bold text-white">
          {step}
        </span>
        {title}
      </h2>
      <div className="grid gap-4 p-6 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  full,
  ...props
}: { label: string; full?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={props.name} className="mb-1.5 block text-[13px] font-semibold text-ink-800">
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500"
      />
    </div>
  );
}
