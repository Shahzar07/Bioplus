import Image from "next/image";
import { ArrowRight, FileText, ShieldCheck, Truck, FlaskConical, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const PROOF = [
  { icon: ShieldCheck, label: "Third-party tested" },
  { icon: FileText, label: "COA with every batch" },
  { icon: Truck, label: "UK dispatch in 24–48h" },
  { icon: Lock, label: "Secure checkout" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      {/* DNA / particle background, colour-graded to the brand orange */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        autoPlay
        muted
        loop
        playsInline
        poster="/products/bioplus-range.webp"
        aria-hidden
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* legibility overlays — weighted left so the copy column stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          {/* Copy */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/35 bg-brand-500/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-300">
              <FlaskConical size={13} /> For research use only
            </span>

            <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-5xl lg:text-[3.65rem]">
              Research-grade peptides,
              <span className="block brand-text-gradient">verified to the batch.</span>
            </h1>

            <span className="brand-gradient mt-7 block h-[3px] w-16 rounded-full" />

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
              BioPlus Labs supplies UK researchers with third-party tested peptides and research compounds — every batch
              independently verified for identity and purity, documented, and traceable via Certificate of Analysis.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/shop" size="lg">
                Shop research products <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/certificates-of-analysis" size="lg" variant="outlineDark">
                Find a Certificate of Analysis
              </ButtonLink>
            </div>

            {/* proof strip */}
            <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3.5 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-x-4">
              {PROOF.map((p) => (
                <li key={p.label} className="flex items-start gap-2 text-[12.5px] font-medium leading-snug text-white/75">
                  <p.icon size={15} className="mt-px shrink-0 text-brand-400" />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Product display case */}
          <div className="relative hidden lg:block">
            <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/30 blur-[110px]" />
            <figure className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm">
              <span className="brand-gradient absolute inset-x-0 top-0 z-10 h-[3px]" />
              <Image
                src="/products/bioplus-range.webp"
                alt="The BioPlus Labs research vial range"
                width={1600}
                height={893}
                priority
                sizes="(max-width: 1024px) 90vw, 620px"
                className="w-full rounded-xl"
              />
              <figcaption className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-b-xl bg-gradient-to-t from-ink-950/85 to-transparent px-4 pb-3 pt-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                <span>The BioPlus range</span>
                <span className="text-brand-300">≥98–99% verified</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
