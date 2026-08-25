import type { Metadata } from "next";
import Link from "next/link";
import { Mail, LifeBuoy } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { FAQS } from "@/data/faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about research peptides, storage, reconstitution, shelf life, and BioPlus Labs policies.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Questions & Answers"
        title="Peptides & research FAQ"
        intro="Common questions about research peptides, storage, reconstitution, and how BioPlus Labs operates. All products are Research Use Only."
        breadcrumb={[{ label: "FAQ" }]}
      />
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* Sticky help panel */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="band-dark relative overflow-hidden rounded-2xl p-7 text-white">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/25 blur-2xl" />
              <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
                <LifeBuoy size={20} />
              </span>
              <h2 className="font-display relative mt-5 text-2xl font-bold">Still have questions?</h2>
              <p className="relative mt-2.5 text-[14px] leading-relaxed text-white/60">
                If your question isn&apos;t answered here, our UK support team is happy to help — we aim to reply within
                one working day.
              </p>
              <div className="relative mt-6 flex flex-col gap-2.5">
                <ButtonLink href="/contact" variant="light">
                  Contact us
                </ButtonLink>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-[13px] font-semibold text-white transition hover:border-brand-400"
                >
                  <Mail size={15} /> Email us
                </a>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-mist p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">Also useful</p>
              <ul className="mt-3 space-y-2 text-[13.5px]">
                {[
                  { label: "Shipping & delivery", href: "/shipping" },
                  { label: "Returns & refunds", href: "/legal/returns" },
                  { label: "Certificates of Analysis", href: "/certificates-of-analysis" },
                  { label: "Dosage calculator", href: "/dosage-calculator" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-medium text-ink-700 hover:text-brand-700">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <Accordion items={FAQS} />
        </div>
      </Container>
    </>
  );
}
