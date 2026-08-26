"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Minus,
  ShoppingBag,
  Check,
  FlaskConical,
  ShieldCheck,
  Truck,
  ChevronRight,
  Beaker,
  Calculator,
  Snowflake,
  Star,
  Mail,
} from "lucide-react";
import { type Product, AVAILABILITY_LABEL } from "@/lib/products";
import {
  PEPTIDE_DATA,
  USAGE_NOTES,
} from "@/lib/peptide-details";
import { ProductImage } from "./ProductImage";
import { useCart } from "@/lib/cart-context";
import { formatGBP, cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

type Tab = "description" | "research" | "usage" | "reviews";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const data = PEPTIDE_DATA[product.slug];
  const isWater = product.slug === "bacteriostatic-water";

  const [variantSku, setVariantSku] = useState(product.variants[0].sku);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [view, setView] = useState<"vial" | "range">("vial");
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.sku === variantSku)!;

  function handleAdd() {
    add(variant.sku, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Full Description" },
    { id: "research", label: "Research" },
    { id: "usage", label: "Usage" },
    { id: "reviews", label: "Reviews" },
  ];

  const details: { label: string; value: string }[] = [
    { label: "Name", value: data?.fullName ? `${product.name} (${data.fullName})` : product.name },
    { label: "Quantity", value: variant.strength },
    { label: "Catalogue Number", value: variant.sku },
    ...(data?.molecularFormula ? [{ label: "Molecular Formula", value: data.molecularFormula }] : []),
    ...(data?.molecularWeight ? [{ label: "Molecular Weight", value: data.molecularWeight }] : []),
    ...(data?.casNumber ? [{ label: "CAS Number", value: data.casNumber }] : []),
    { label: "Form", value: product.form },
  ];

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-500">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop" className="hover:text-brand-700">Shop</Link>
          <ChevronRight size={13} />
          <span className="text-ink-800">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Gallery — filmstrip on the left, stage on the right */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex gap-3">
              {/* vertical thumbnails */}
              <div className="flex shrink-0 flex-col gap-3">
                <button
                  onClick={() => setView("vial")}
                  aria-label="View vial"
                  className={cn(
                    "flex h-[72px] w-[72px] items-center justify-center rounded-lg border bg-mist transition",
                    view === "vial" ? "border-brand-500 ring-1 ring-brand-500" : "border-line hover:border-brand-300",
                  )}
                >
                  <ProductImage slug={product.slug} name={product.name} imageUrl={product.imageUrl} className="h-14 w-auto" />
                </button>
                <button
                  onClick={() => setView("range")}
                  aria-label="View range"
                  className={cn(
                    "flex h-[72px] w-[72px] items-center justify-center rounded-lg border bg-mist transition",
                    view === "range" ? "border-brand-500 ring-1 ring-brand-500" : "border-line hover:border-brand-300",
                  )}
                >
                  <Image src="/products/bioplus-range.webp" alt="BioPlus range" width={160} height={89} className="object-contain" />
                </button>
              </div>

              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-line bg-mist">
                <span className="brand-gradient absolute inset-x-0 top-0 h-[3px]" />
                <div className="absolute left-4 top-5 flex gap-2">
                  {product.bestSeller && (
                    <span className="rounded-md bg-ink-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Best Seller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="brand-gradient rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      New
                    </span>
                  )}
                </div>
                <span className="absolute right-4 top-5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  {data?.purity ?? "Research Grade"} Purity
                </span>
                {view === "vial" ? (
                  <ProductImage slug={product.slug} name={product.name} imageUrl={product.imageUrl} priority className="h-[420px] w-auto py-8" />
                ) : (
                  <Image src="/products/bioplus-range.webp" alt="BioPlus Labs research vial range" width={1600} height={893} className="w-[92%] object-contain py-8" />
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-white text-center text-[11px] font-medium text-ink-600">
              <Assurance icon={FlaskConical} label={isWater ? "Sterile" : "Lyophilised"} />
              <Assurance icon={ShieldCheck} label="Batch-Tested" />
              <Assurance icon={Truck} label="UK Dispatch" />
            </div>
          </div>

          {/* Buy box */}
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-[15px] text-ink-600">{product.tagline}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-ink-900">{formatGBP(variant.price)}</span>
              <span className="text-sm text-ink-500">per vial · {variant.label}</span>
            </div>

            <p className="mt-5 text-[14.5px] leading-relaxed text-ink-700">{product.blurb}</p>

            {/* Variant selector */}
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold uppercase tracking-wide text-ink-800">Select option</span>
                <span className="text-[12px] text-ink-500">SKU {variant.sku}</span>
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {product.variants.map((v) => {
                  const active = v.sku === variantSku;
                  return (
                    <button
                      key={v.sku}
                      onClick={() => setVariantSku(v.sku)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                        active ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" : "border-line bg-white hover:border-brand-300",
                      )}
                    >
                      <span>
                        <span className="block text-[13px] font-semibold text-ink-900">{v.label}</span>
                        <span
                          className={cn(
                            "block text-[11px] font-medium",
                            v.availability === "in-stock"
                              ? "text-emerald-600"
                              : v.availability === "arriving-soon"
                                ? "text-brand-600"
                                : "text-ink-500",
                          )}
                        >
                          {AVAILABILITY_LABEL[v.availability]}
                        </span>
                      </span>
                      <span className="font-display text-base font-bold text-ink-900">{formatGBP(v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qty + add */}
            {variant.availability === "in-stock" ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex h-13 items-center rounded-full border border-line px-1">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-haze" aria-label="Decrease">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-display text-lg font-bold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-haze" aria-label="Increase">
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="brand-gradient inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white transition hover:brightness-110"
                >
                  {added ? (<><Check size={20} /> Added to cart</>) : (<><ShoppingBag size={19} /> Add to cart — {formatGBP(variant.price * qty)}</>)}
                </button>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-line bg-mist p-5">
                <p className="font-display text-[15px] font-bold text-ink-900">
                  {variant.availability === "arriving-soon" ? "Arriving soon" : "Currently out of stock"}
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">
                  {variant.availability === "arriving-soon"
                    ? "This option is on its way into stock. Email us and we'll let you know the moment it lands."
                    : "This option has sold out. Email us and we'll let you know as soon as it is restocked."}
                </p>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Stock enquiry — ${product.name} ${variant.label}`)}`}
                  className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-900/15 px-6 text-sm font-bold text-ink-800 transition hover:border-brand-500 hover:text-brand-700"
                >
                  <Mail size={16} /> Notify me by email
                </a>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/dosage-calculator" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700">
                <Calculator size={15} /> Dosage calculator
              </Link>
              <Link href="/certificates-of-analysis" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700">
                <ShieldCheck size={15} /> View COA
              </Link>
            </div>

            {/* RUO notice */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <FlaskConical size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-[12.5px] leading-relaxed text-amber-900">
                <strong>Research Use Only.</strong> Intended solely for laboratory and scientific research. Not for
                human or animal consumption and not intended to diagnose, treat, cure, or prevent any disease. No dosage
                or administration guidance is provided.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="scroll-slim flex gap-1 overflow-x-auto border-b border-line sm:justify-center">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-[14px] font-semibold transition-colors",
                  tab === t.id ? "text-brand-700" : "text-ink-600 hover:text-ink-900",
                )}
              >
                {tab === t.id ? <ChevronRight size={14} className="rotate-90" /> : <ChevronRight size={14} className="text-ink-400" />}
                {t.label}
                {tab === t.id && <span className="brand-gradient absolute inset-x-2 bottom-0 h-0.5 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="py-8">
            {tab === "description" && (
              <div className="mx-auto max-w-4xl">
                <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-ink-900 sm:text-[28px]">
                  High-Purity {product.name} – {variant.strength}
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{product.blurb}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                  With a verified peptide purity of <strong>{data?.purity ?? "research grade"}</strong>, this{" "}
                  {product.form.toLowerCase()} provides consistent quality for reliable laboratory experimentation.
                </p>

                <ul className="mt-6 space-y-2.5">
                  <Badge text={`${data?.purity ?? "Research Grade"} Purity – Research Grade`} />
                  <Badge text={product.tagline} />
                  <Badge text={isWater ? "USP-Grade Sterile Reconstitution Solution" : "Precision-Tested Lyophilised Peptide"} />
                </ul>

                <h3 className="font-display mt-8 flex items-center gap-2 text-lg font-bold text-brand-700">
                  <Beaker size={18} /> Product Details
                </h3>
                <div className="mt-3 max-w-2xl overflow-hidden rounded-xl border border-line">
                  {details.map((d, i) => (
                    <div key={d.label} className={cn("flex justify-between gap-4 px-4 py-2.5 text-[14px]", i !== details.length - 1 && "border-b border-line")}>
                      <span className="text-ink-500">{d.label}</span>
                      <span className="text-right font-semibold text-ink-900">{d.value}</span>
                    </div>
                  ))}
                </div>
                {data?.blendNote && <p className="mt-3 text-[13px] text-ink-500">{data.blendNote}</p>}

                <h3 className="font-display mt-8 flex items-center gap-2 text-lg font-bold text-brand-700">
                  <Snowflake size={18} /> Storage
                </h3>
                <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-ink-700">
                  As supplied, {product.name} is stored in a sealed vial protected from light at{" "}
                  <strong>2 °C to 8 °C</strong>. Storage conditions are printed on the vial label.
                </p>

                <p className="mt-6 max-w-3xl text-[13.5px] leading-relaxed text-ink-600">
                  <strong className="text-ink-900">Note:</strong> This product is supplied strictly for{" "}
                  <strong className="text-ink-900">laboratory research use only</strong>. Not for human consumption or
                  clinical application. {SITE.name} provides no handling, preparation, or administration instructions —
                  qualified researchers are responsible for determining their own protocols.
                </p>
              </div>
            )}


            {tab === "research" && (
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-xl font-bold text-ink-900">Research highlights</h2>
                <p className="mt-2 text-[14px] text-ink-600">
                  Areas in which {product.name} is investigated within the research community.
                </p>
                <ul className="mt-6 space-y-3">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3">
                      <span className="brand-gradient mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-ink-700">{h}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl bg-mist p-4 text-[13px] leading-relaxed text-ink-600">
                  Information is provided for educational and research-reference purposes only and should not be
                  interpreted as medical advice or a claim of efficacy.
                </p>
              </div>
            )}

            {tab === "usage" && (
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-xl font-bold text-ink-900">Handling &amp; usage</h2>
                <ul className="mt-6 space-y-3">
                  {USAGE_NOTES.map((u) => (
                    <li key={u} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
                      <FlaskConical size={17} className="mt-0.5 shrink-0 text-brand-600" />
                      <span className="text-[14px] leading-relaxed text-ink-700">{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "reviews" && (
              <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-line bg-mist p-8 text-center">
                <div className="flex justify-center gap-1 text-ink-300">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={20} className="fill-ink-200 text-ink-200" />
                  ))}
                </div>
                <h3 className="font-display mt-4 text-lg font-bold text-ink-900">No reviews yet</h3>
                <p className="mx-auto mt-2 max-w-md text-[13.5px] text-ink-600">
                  Verified customer reviews for {product.name} will appear here. Be the first to share your research
                  experience after a verified purchase.
                </p>
                <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-800 hover:border-brand-500 hover:text-brand-700">
                  Share feedback <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Assurance({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-3.5">
      <Icon size={18} className="text-brand-600" />
      {label}
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] text-ink-700">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-700">
        <Check size={13} strokeWidth={3} />
      </span>
      {text}
    </li>
  );
}
