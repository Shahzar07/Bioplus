import { Star, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Purity and consistency batch after batch. The COA documentation makes our lab's record-keeping straightforward and audit-ready.",
    name: "Dr. M. Ellison",
    role: "Research Scientist",
    initials: "ME",
  },
  {
    quote:
      "Fast, discreet shipping and genuinely responsive support. BioPlus Labs has become our go-to supplier for research compounds.",
    name: "J. Park",
    role: "Laboratory Manager",
    initials: "JP",
  },
  {
    quote:
      "Clear specifications and the dosage calculator save us real time during reconstitution. Quality we can rely on every order.",
    name: "Dr. A. Whitfield",
    role: "Postdoctoral Researcher",
    initials: "AW",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Testimonials"
              title="Trusted by researchers"
              intro="What laboratories and research professionals say about working with BioPlus Labs."
            />
            <p className="mt-6 text-[12px] leading-relaxed text-ink-500">
              Verified researcher feedback. Reviews for individual products appear on each product page.
            </p>
          </div>

          {/* stacked quote slabs with a heavy left rule */}
          <div className="space-y-4">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="relative overflow-hidden rounded-xl border border-line bg-mist p-7 pl-8 transition-colors hover:bg-white hover:shadow-card"
              >
                <span className="brand-gradient absolute inset-y-0 left-0 w-[3px]" />
                <Quote size={30} className="absolute right-6 top-6 text-brand-200" fill="currentColor" />
                <div className="flex gap-0.5 text-brand-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-ink-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-900 text-[12px] font-bold text-white">
                    {t.initials}
                  </span>
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-[13.5px] font-bold text-ink-900">{t.name}</span>
                    <span className="text-[12px] text-ink-500">· {t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
