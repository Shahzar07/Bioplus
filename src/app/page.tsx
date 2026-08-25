import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, FlaskConical, Microscope, FileCheck, Headset, Boxes, ShieldCheck, Calculator, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { stacks, bestSellingPeptides } from "@/lib/products";
import { getCatalogue } from "@/lib/catalog";
import { FAQS } from "@/data/faq";
import { Testimonials } from "@/components/home/Testimonials";

const PROCESS = [
  { n: "01", icon: FlaskConical, title: "Sourced & synthesised", text: "Every compound is sourced from vetted manufacturing partners working under controlled laboratory conditions." },
  { n: "02", icon: Microscope, title: "Independently tested", text: "Each batch is verified by third-party HPLC/MS analysis for identity, purity, and contaminants." },
  { n: "03", icon: FileCheck, title: "Certified & documented", text: "A matching Certificate of Analysis is issued per batch and searchable on our COA page." },
  { n: "04", icon: Truck, title: "Dispatched from the UK", text: "Packed discreetly and shipped from the UK within 24–48 hours, tracked door to door." },
];

const QUALITY = [
  { icon: Microscope, title: "Rigorous Analytical Testing", text: "Every production batch is evaluated by HPLC, UPLC, and Mass Spectrometry to verify identity, purity, and quality." },
  { icon: FileCheck, title: "Transparency & Accountability", text: "Supporting documentation and testing records are maintained to promote traceability throughout the supply chain." },
  { icon: Boxes, title: "Quality-Focused Manufacturing", text: "We partner with facilities operating under stringent quality standards and established production protocols." },
  { icon: Headset, title: "Responsive Support", text: "Knowledgeable assistance throughout the ordering process and beyond, from order placement through delivery." },
];

export default async function HomePage() {
  const catalogue = await getCatalogue();

  return (
    <>
      <Hero />
      <TrustBar />

      {/* Featured range */}
      <section className="relative overflow-hidden py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/15 blur-[90px]" />
            <Image
              src="/products/bioplus-range.webp"
              alt="The BioPlus Labs research vial range"
              width={1600}
              height={893}
              sizes="(max-width: 1024px) 92vw, 560px"
              className="relative mx-auto w-full rounded-2xl drop-shadow-2xl"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="The BioPlus Range"
              title={<>Lab-grade vials, <span className="brand-text-gradient">precision-filled</span> and batch-tested.</>}
              intro="Every BioPlus Labs vial is lyophilised, sealed, and verified for identity and purity before it leaves us — with storage and research-use guidance printed on the label."
            />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {["≥98–99% verified purity", "HPLC / UPLC / MS tested", "Tamper-evident crimp seals", "Refrigerated 12-month shelf life", "Batch-matched COA with every kit", "Dispatched from the UK in 24–48h"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[14px] font-medium text-ink-700">
                  <span className="brand-gradient grid h-5 w-5 shrink-0 place-items-center rounded-full text-white">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/shop">Shop the catalogue <ArrowRight size={16} /></ButtonLink>
              <ButtonLink href="/dosage-calculator" variant="outline">
                <Calculator size={16} /> Dosage calculator
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Quality process — numbered dark band */}
      <section className="band-dark relative overflow-hidden py-20 text-white">
        <div className="hairline-grid absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Our quality commitment"
            title={<>From synthesis to your door, <span className="brand-text-gradient">every step is verified</span>.</>}
            align="center"
            dark
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s) => (
              <div key={s.n} className="group relative bg-ink-900 p-7 transition-colors hover:bg-ink-800">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
                    <s.icon size={19} />
                  </span>
                  <span className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-white/25">
                    Step {s.n}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-[17px] font-bold">{s.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/55">{s.text}</p>
                <span className="brand-gradient absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>


      {/* Research Peptide Stacks */}
      <section className="bg-mist py-20">
        <Container>
          <SectionHeading
            eyebrow="Combination Research"
            title="Research peptide stacks"
            intro="Pre-blended combination vials that pair complementary research compounds in a single lyophilised kit."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stacks(catalogue).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Best Selling & New Peptides */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Most Researched"
            title="Best-selling & new peptides"
            intro="The single-compound research peptides laboratories order most — in stock and ready to ship."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellingPeptides(catalogue).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/shop" variant="dark" size="lg">
              Explore the full catalogue <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Quality */}
      <section className="bg-mist py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Commitment to Quality"
              title={<>Reliable research begins with <span className="brand-text-gradient">reliable products</span>.</>}
              intro="We believe the integrity of scientific research depends on the quality of the materials used. Quality assurance, consistency, and transparency are at the core of everything we do."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/about">About BioPlus Labs</ButtonLink>
              <ButtonLink href="/certificates-of-analysis" variant="outline">
                Testing methodology
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {QUALITY.map((q) => (
              <div key={q.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <q.icon size={20} />
                </span>
                <h3 className="font-display mt-4 text-base font-bold text-ink-900">{q.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-600">{q.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Affiliate band */}
      <section className="py-6">
        <Container>
          <div className="band-dark relative overflow-hidden rounded-3xl px-8 py-12 text-white sm:px-14 sm:py-16">
            <div className="hairline-grid absolute inset-0 opacity-60" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.6fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
                  <ShieldCheck size={13} /> Affiliate Programme
                </span>
                <h2 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                  Partner with BioPlus Labs and earn on every referral.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65">
                  Researchers, content creators, and labs can join our affiliate programme to share BioPlus Labs
                  with their network and earn commissions on qualified orders.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <ButtonLink href="/affiliate" size="lg" variant="light">
                  Join the programme <ArrowRight size={18} />
                </ButtonLink>
                <ButtonLink href="/wholesale" size="lg" variant="outlineDark">
                  Wholesale &amp; bulk pricing
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <section className="py-20">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Questions & Answers"
            title="Peptides & research FAQ"
            intro="Common questions about research peptides, storage, and how BioPlus Labs operates."
            align="center"
          />
          <div className="mt-10">
            <Accordion items={FAQS.slice(0, 6)} />
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/faq" variant="outline">
              See all FAQs <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
