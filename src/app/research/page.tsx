import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Snowflake, Beaker, Clock, BookOpen, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { PRODUCTS, getProduct } from "@/lib/products";

const FEATURED = ["bpc-157", "tb-500", "tirzepatide", "retatrutide", "ghk-cu", "mots-c"]
  .map((s) => getProduct(s)!)
  .filter(Boolean);

export const metadata: Metadata = {
  title: "Research Library",
  description: "Background reference on the research compound classes BioPlus Labs supplies and the documentation that ships with them. Research Use Only.",
};

const GUIDES = [
  { icon: Snowflake, title: "Storage on arrival", text: "Every vial ships with its storage conditions printed on the label — sealed, protected from light, at 2–8 °C." },
  { icon: Beaker, title: "What we supply", text: "Lyophilised compounds in sealed, tamper-evident vials, plus bacteriostatic water as a separate laboratory consumable." },
  { icon: Clock, title: "Documentation", text: "Each batch carries a Certificate of Analysis recording identity and purity, searchable by batch number." },
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research Library"
        title="Reference material for the research community"
        intro="Background reference on the compound classes we supply and the documentation that ships with them. Provided for reference only — we do not publish preparation, dosing, or administration guidance."
        breadcrumb={[{ label: "Research" }]}
      />

      {/* Featured compounds — split panel, dark copy against a lit product bay */}
      <section className="py-16">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-line shadow-card">
            <div className="grid lg:grid-cols-[1fr_1.1fr]">
              {/* copy */}
              <div className="band-dark relative flex flex-col justify-center p-8 text-white sm:p-11">
                <div className="hairline-grid absolute inset-0 opacity-50" />
                <span className="brand-gradient absolute inset-x-0 top-0 h-[3px]" />
                <div className="relative">
                  <SectionHeading
                    eyebrow="Featured compounds"
                    title="The most-researched peptides, in one place"
                    intro="From regenerative research to metabolic studies, explore the compounds laboratories investigate most — each batch-tested and supplied as a lyophilised research vial."
                    dark
                  />
                  <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    {[
                      { v: `${PRODUCTS.length}`, l: "Compounds" },
                      { v: "UK", l: "Dispatch" },
                      { v: "≥98%", l: "Verified purity" },
                    ].map((s) => (
                      <div key={s.l}>
                        <dt className="font-display text-2xl font-extrabold text-white">{s.v}</dt>
                        <dd className="mt-0.5 text-[11.5px] leading-snug text-white/50">{s.l}</dd>
                      </div>
                    ))}
                  </dl>
                  <ButtonLink href="/shop" variant="light" className="mt-8">
                    Browse all compounds <ArrowRight size={16} />
                  </ButtonLink>
                </div>
              </div>

              {/* product bay */}
              <div className="relative flex items-center justify-center bg-mist p-8 sm:p-10">
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/20 blur-[90px]" />
                <Image
                  src="/products/bioplus-range.webp"
                  alt="BioPlus Labs research peptide vials"
                  width={1600}
                  height={893}
                  sizes="(max-width: 1024px) 92vw, 640px"
                  className="relative w-full drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* compound strip */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
            <div className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
              {FEATURED.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="group flex flex-col items-center p-5 transition-colors hover:bg-mist"
                >
                  <ProductImage slug={p.slug} name={p.name} className="h-28 w-auto transition-transform duration-500 group-hover:scale-105" />
                  <span className="mt-3 text-center text-[12px] font-semibold text-ink-800 group-hover:text-brand-700">
                    {p.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>


      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="How products are supplied" title="What arrives, and how it is documented" align="center" />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {GUIDES.map((g) => (
              <div key={g.title} className="rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <g.icon size={22} />
                </span>
                <h3 className="font-display mt-4 text-lg font-bold">{g.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{g.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-[13px] leading-relaxed text-ink-500">
            No statements on this website should be interpreted as medical advice or as a claim that any product can
            diagnose, treat, cure, mitigate, or prevent any disease, condition, or illness. Researchers are solely
            responsible for understanding the properties, handling requirements, and lawful use of all products.
          </p>
        </Container>
      </section>
    </>
  );
}
