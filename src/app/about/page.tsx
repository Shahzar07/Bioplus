import type { Metadata } from "next";
import {
  Microscope,
  ShieldCheck,
  Eye,
  Headset,
  Boxes,
  Truck,
  Target,
  Compass,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About BioPlus Labs",
  description:
    "A UK laboratory supplier built on quality you can verify. Learn about the BioPlus Labs mission, vision, and commitment to batch-level transparency.",
};

const STATS = [
  { value: "500+", label: "Batches tested" },
  { value: "99%+", label: "Average verified purity" },
  { value: "24–48h", label: "UK dispatch" },
  { value: "100%", label: "Batch-matched COAs" },
];

const WHY = [
  { icon: Boxes, title: "Quality-Focused Manufacturing", text: "We partner with manufacturing facilities that operate under stringent quality standards and established production protocols to promote consistency and reliability." },
  { icon: Microscope, title: "Rigorous Analytical Testing", text: "Products are evaluated using advanced analytical techniques to verify purity, identity, and quality specifications before reaching our customers." },
  { icon: Eye, title: "Transparency & Accountability", text: "We believe researchers should have confidence in the products they purchase. Our commitment to transparency helps ensure consistency, traceability, and trust." },
  { icon: Headset, title: "Responsive Customer Support", text: "Our team is dedicated to providing timely assistance and knowledgeable support throughout the ordering process and beyond." },
  { icon: Truck, title: "Efficient Order Fulfilment", text: "Orders approved before our 2pm cut-off are dispatched the same working day from the UK, packed discreetly and tracked door to door." },
  { icon: ShieldCheck, title: "Built for Researchers", text: "Everything we do is designed with the needs of the research community in mind — from product selection and quality assurance to customer service and fulfilment." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About BioPlus Labs"
        title="A UK laboratory supplier built on quality you can verify."
        intro="BioPlus Labs was founded to close the trust gap in research chemical supply. We work with vetted manufacturing partners, batch-test everything independently, and publish the paperwork — so UK researchers spend less time verifying suppliers and more time on their work."
        breadcrumb={[{ label: "About" }]}
      />

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Commitment to Quality"
              title="Reliable research begins with reliable products."
              intro="We believe the integrity of scientific research depends on the quality of the materials being used. For that reason, we work with carefully selected manufacturing partners and suppliers that adhere to strict production standards and quality control protocols."
            />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              Each production batch is subject to comprehensive analytical testing to verify identity, purity, and
              quality specifications. Testing methodologies may include High-Performance Liquid Chromatography (HPLC),
              Ultra-Performance Liquid Chromatography (UPLC), Mass Spectrometry (MS), and other validated analytical
              procedures. Supporting documentation and testing records are maintained to promote accountability and
              traceability throughout the supply chain.
            </p>
            <div className="mt-7">
              <ButtonLink href="/certificates-of-analysis">Explore our testing methodology</ButtonLink>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-line bg-white p-7 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Target size={20} />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold">Our Mission</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                To support scientific advancement by delivering dependable research materials, exceptional service, and
                a transparent customer experience that researchers can trust.
              </p>
            </div>
            <div className="band-dark relative overflow-hidden rounded-2xl p-7 text-white">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/30 blur-2xl" />
              <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-brand-300">
                <Compass size={20} />
              </span>
              <h3 className="font-display relative mt-4 text-lg font-bold">Our Vision</h3>
              <p className="relative mt-2 text-[14px] leading-relaxed text-white/65">
                To become a recognised leader in the research compound industry by setting the standard for product
                quality, integrity, and customer confidence — while helping advance innovation within the scientific
                community.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-[var(--radius-card)] border border-line bg-mist p-7 text-center">
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink-900">{s.value}</p>
                <p className="mt-1.5 text-[13px] font-medium text-ink-600">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mist py-20">
        <Container>
          <SectionHeading
            eyebrow="Why Researchers Choose BioPlus"
            title="Built for the research community"
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <w.icon size={20} />
                </span>
                <h3 className="font-display mt-4 text-base font-bold text-ink-900">{w.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">{w.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7 text-center">
            <p className="mx-auto max-w-3xl text-[14px] leading-relaxed text-amber-900">
              <strong>Research Use Only.</strong> Products offered by BioPlus Labs are intended solely for
              laboratory and scientific research purposes. They are not intended for human consumption, therapeutic use,
              or the diagnosis, treatment, cure, or prevention of any disease.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
