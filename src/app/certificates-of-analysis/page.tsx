import type { Metadata } from "next";
import { Microscope, FlaskConical, FileCheck, ShieldCheck, Beaker, ScanLine } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CoaFinder } from "@/components/coa/CoaFinder";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description:
    "Search and download BioPlus Labs Certificates of Analysis by product or batch number. Identity and purity verified by HPLC, UPLC, and Mass Spectrometry.",
};

const METHODS = [
  { icon: ScanLine, title: "HPLC", full: "High-Performance Liquid Chromatography", text: "Separates and quantifies compounds to assess purity and detect impurities." },
  { icon: Beaker, title: "UPLC", full: "Ultra-Performance Liquid Chromatography", text: "Higher-resolution chromatography for precise purity and identity profiling." },
  { icon: Microscope, title: "MS", full: "Mass Spectrometry", text: "Confirms molecular identity and mass to verify the correct compound." },
];

const STEPS = [
  { n: "01", title: "Sourcing", text: "We partner with facilities operating under stringent quality standards and established production protocols." },
  { n: "02", title: "Batch testing", text: "Each production batch undergoes comprehensive analytical testing to verify identity, purity, and quality specifications." },
  { n: "03", title: "Documentation", text: "Supporting documentation and testing records are maintained to promote accountability and traceability." },
  { n: "04", title: "COA access", text: "Batch-specific Certificates of Analysis are made available in your account once your order ships." },
];

export default function CertificatesOfAnalysisPage() {
  return (
    <>
      <PageHero
        eyebrow="Certificates of Analysis"
        title="Every batch is documented — search it by product or batch number."
        intro="The integrity of scientific research depends on the quality of the materials used. Every production batch is evaluated using advanced analytical techniques before reaching researchers."
        breadcrumb={[{ label: "Certificates of Analysis" }]}
      />

      <CoaFinder />

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Testing methodology" title="Verified by validated analytical procedures" align="center" />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {METHODS.map((m) => (
              <div key={m.title} className="rounded-[var(--radius-card)] border border-line bg-white p-7 text-center shadow-card">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <m.icon size={24} />
                </span>
                <h3 className="font-display mt-5 text-2xl font-bold">{m.title}</h3>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-brand-600">{m.full}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600">{m.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="band-dark relative overflow-hidden py-20 text-white">
        <div className="hairline-grid absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Our process"
            title="From sourcing to certificate"
            intro="A transparent chain of custody from manufacturing through delivery."
            align="center"
            dark
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="brand-text-gradient font-display text-3xl font-extrabold">{s.n}</span>
                <h3 className="font-display mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Certificates of Analysis"
              title="Documentation maintained for every batch"
              intro="We believe researchers should have confidence in the products they purchase. COA and testing records are maintained to promote consistency, traceability, and trust — and are made available to you once your order ships."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/account/files">View your COA</ButtonLink>
              <ButtonLink href="/shop" variant="outline">Shop tested compounds</ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Pillar icon={FileCheck} title="Identity verified" text="Confirmed molecular identity for each compound." />
            <Pillar icon={FlaskConical} title="Purity profiled" text="Quantified purity against quality specifications." />
            <Pillar icon={ShieldCheck} title="Traceable" text="Records maintained across the supply chain." />
            <Pillar icon={Microscope} title="Validated methods" text="HPLC, UPLC, MS, and other validated procedures." />
          </div>
        </Container>
      </section>
    </>
  );
}

function Pillar({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon size={20} />
      </span>
      <h3 className="font-display mt-3 text-base font-bold">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">{text}</p>
    </div>
  );
}
