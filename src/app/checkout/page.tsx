"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, CreditCard, Check, FlaskConical, ShieldCheck, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/cart-context";
import { formatGBP } from "@/lib/cn";
import { ProductImage } from "@/components/product/ProductImage";
import { useVariantBySku } from "@/lib/catalog-context";

export default function CheckoutPage() {
  const { detailedLines, subtotal, clear, count } = useCart();
  const variantBySku = useVariantBySku();
  const [placed, setPlaced] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  const shipping = subtotal >= 250 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const orderNo = "BPL-" + Math.floor(100000 + Math.random() * 900000);
    clear();
    setPlaced(orderNo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (placed) {
    return (
      <Container size="narrow" className="py-20 text-center">
        <div className="brand-gradient mx-auto grid h-16 w-16 place-items-center rounded-full text-white">
          <Check size={30} strokeWidth={3} />
        </div>
        <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight">Order received</h1>
        <p className="mt-3 text-ink-600">
          Thank you. Your order <strong className="text-ink-900">{placed}</strong> has been received and is pending
          payment verification. You&apos;ll receive an email confirmation, and tracking once it ships.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/orders" className="brand-gradient rounded-full px-6 py-3 text-sm font-bold text-white">
            View order in Research Hub
          </Link>
          <Link href="/shop" className="rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-800 hover:border-brand-500">
            Continue shopping
          </Link>
        </div>
      </Container>
    );
  }

  if (count === 0) {
    return (
      <Container size="narrow" className="py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-ink-600">Add research compounds before checking out.</p>
        <Link href="/shop" className="brand-gradient mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white">
          Shop the catalogue
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-brand-700">
        <ArrowLeft size={16} /> Back to cart
      </Link>
      <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          {/* Contact */}
          <Fieldset step="1" title="Contact information">
            <Field label="Email address" type="email" name="email" placeholder="researcher@lab.ac.uk" required full />
            <Field label="Phone" type="tel" name="phone" placeholder="07700 900123" full />
          </Fieldset>

          {/* Research / shipping address */}
          <Fieldset step="2" title="Research delivery address">
            <Field label="Institution / Lab (optional)" name="org" placeholder="University Research Lab" full />
            <Field label="First name" name="fname" required />
            <Field label="Last name" name="lname" required />
            <Field label="Address line 1" name="addr" placeholder="House number and street" required full />
            <Field label="Address line 2 (optional)" name="addr2" full />
            <Field label="Town / City" name="city" required />
            <Field label="County (optional)" name="county" />
            <Field label="Postcode" name="postcode" placeholder="EH32 9BZ" required />
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-ink-800">Country</label>
              <select className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-500" defaultValue="GB">
                <option value="GB">United Kingdom</option>
                <option value="IE">Ireland</option>
              </select>
            </div>
          </Fieldset>

          {/* Payment */}
          <Fieldset step="3" title="Payment">
            <div className="full col-span-full">
              <div className="flex items-center gap-2 rounded-xl border border-line bg-mist px-4 py-3 text-[13px] text-ink-700">
                <CreditCard size={18} className="text-brand-600" />
                <span>Major credit &amp; debit cards accepted. Payment is processed securely via our encrypted gateway.</span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Card number" name="card" placeholder="0000 0000 0000 0000" full />
                <Field label="Expiry" name="exp" placeholder="MM / YY" />
                <Field label="CVC" name="cvc" placeholder="123" />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-500">
                <Lock size={12} /> This is a demonstration checkout. Live card processing is enabled once the payment
                gateway is connected.
              </p>
            </div>
          </Fieldset>

          {/* RUO acknowledgment */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand-600"
              required
            />
            <span className="text-[12.5px] leading-relaxed text-amber-900">
              <FlaskConical size={14} className="mr-1 inline text-amber-600" />
              I certify that I am purchasing for legitimate research purposes, am at least 18 years of age, and that all
              products will be used solely for laboratory research in accordance with applicable laws. Products are not
              for human or animal consumption.
            </span>
          </label>
        </div>

        {/* Summary */}
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
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="font-semibold">{formatGBP(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Delivery</dt>
                <dd className="font-semibold">{shipping === 0 ? "Free" : formatGBP(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-display text-xl font-bold">{formatGBP(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={!agree}
              className="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-40"
            >
              <Lock size={16} /> Place order — {formatGBP(total)}
            </button>
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-ink-500">
              <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-brand-600" /> SSL secure</span>
              <span className="flex items-center gap-1"><FlaskConical size={13} className="text-brand-600" /> Research Use Only</span>
            </div>
          </div>
        </aside>
      </form>
    </Container>
  );
}

function Fieldset({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
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
      <label className="mb-1.5 block text-[13px] font-semibold text-ink-800">{label}</label>
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500"
      />
    </div>
  );
}
