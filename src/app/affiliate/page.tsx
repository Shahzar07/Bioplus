import type { Metadata } from "next";
import { UserPlus, Share2, Wallet, BarChart3, BadgeCheck, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Affiliate Programme",
  description: "Join the BioPlus Labs affiliate programme and earn commissions on qualified referral orders.",
};

const STEPS = [
  { icon: UserPlus, title: "Apply", text: "Submit your details and tell us about your audience or research network." },
  { icon: Share2, title: "Share", text: "Get a unique referral link and share BioPlus Labs with your network." },
  { icon: Wallet, title: "Earn", text: "Earn competitive commissions on every qualified order placed through your link." },
];

const PERKS = [
  { icon: BarChart3, title: "Real-time tracking", text: "Monitor clicks, conversions, and commissions from your affiliate dashboard." },
  { icon: BadgeCheck, title: "Competitive rates", text: "Earn on qualified orders with transparent, reliable commission tracking." },
  { icon: Clock, title: "Reliable payouts", text: "Get paid on a consistent schedule for the referrals you drive." },
];

export default function AffiliatePage() {
  return (
    <>
      <PageHero
        eyebrow="Affiliate Programme"
        title="Partner with BioPlus Labs and earn on every referral."
        intro="Researchers, content creators, and labs can join our affiliate programme to share BioPlus Labs with their network and earn commissions on qualified orders."
        breadcrumb={[{ label: "Affiliate" }]}
      />

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="How it works" title="Three steps to start earning" align="center" />
          {/* connected step track */}
          <ol className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
            <span className="absolute left-0 right-0 top-6 hidden h-px bg-line sm:block" aria-hidden />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative text-center">
                <span className="brand-gradient relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full text-white ring-8 ring-white">
                  <s.icon size={21} />
                </span>
                <span className="mt-4 block text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-600">
                  Step 0{i + 1}
                </span>
                <h3 className="font-display mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-ink-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-mist py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Why join" title="Built to reward our partners" />
            <ul className="mt-7 space-y-4">
              {PERKS.map((p) => (
                <li key={p.title} className="flex items-start gap-4 rounded-xl border border-line bg-white p-5 shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <p.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold">{p.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-600">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Signup */}
          <div className="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-bold">Apply to the programme</h2>
            <p className="mt-1.5 text-[13.5px] text-ink-600">Tell us a little about you and we&apos;ll be in touch.</p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2">
              <AField label="Full name" name="name" required full />
              <AField label="Email" type="email" name="email" required />
              <AField label="Website / Social" name="site" />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-semibold text-ink-800">Audience / network</label>
                <textarea
                  rows={4}
                  placeholder="Describe your audience, platform, or research network."
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button type="button" className="brand-gradient h-12 w-full rounded-full text-sm font-bold text-white transition hover:brightness-110">
                  Submit application
                </button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

function AField({ label, full, ...props }: { label: string; full?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-[13px] font-semibold text-ink-800">{label}</label>
      <input {...props} className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus:border-brand-500" />
    </div>
  );
}
