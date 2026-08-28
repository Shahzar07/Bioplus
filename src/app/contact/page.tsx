import type { Metadata } from "next";
import { Mail, MapPin, Clock, Building2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact BioPlus Labs for product, ordering, shipping, wholesale, and account support.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We're here to help"
        intro="Questions about products, ordering, delivery, wholesale, or your account? Our support team aims to respond to every enquiry within one working day."
        breadcrumb={[{ label: "Contact" }]}
      />

      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          {/* Info — single dark panel with divided rows */}
          <div className="band-dark relative overflow-hidden rounded-2xl text-white lg:sticky lg:top-28 lg:self-start">
            <div className="hairline-grid absolute inset-0 opacity-50" />
            <span className="brand-gradient absolute inset-x-0 top-0 h-[3px]" />
            <div className="relative divide-y divide-white/10">
              <ContactRow icon={Mail} label="Email — the fastest way to reach us">
                <a href={`mailto:${SITE.email}`} className="font-semibold text-white hover:text-brand-300">
                  {SITE.email}
                </a>
                <p className="mt-1 text-white/65">
                  All enquiries are handled by email so everything stays documented against your order.
                </p>
              </ContactRow>
              <ContactRow icon={Clock} label="Office hours">
                <p className="font-semibold text-white">
                  {SITE.hours.days}, {SITE.hours.time}
                </p>
                <p className="text-white/65">
                  Orders placed after 18:00 on a Friday are processed the following Monday.
                </p>
              </ContactRow>
              <ContactRow icon={MapPin} label="Location">
                <p className="font-semibold text-white">{SITE.legalName}</p>
                <p className="text-white/65">{SITE.address.country}</p>
                <p className="text-white/65">
                  {SITE.address.county}, {SITE.address.town}
                </p>
                {SITE.companyNumber && (
                  <p className="mt-1.5 text-white/65">
                    Registered in Scotland, company no.{" "}
                    <span className="font-mono text-white/85">{SITE.companyNumber}</span>
                  </p>
                )}
              </ContactRow>
              <ContactRow icon={Building2} label="Wholesale & laboratory supply">
                <p className="text-white/65">
                  Interested in wholesale purchasing, lab supply agreements, or bulk pricing? Email us and we&apos;ll
                  send trade terms.
                </p>
              </ContactRow>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-bold text-ink-900">Send us a message</h2>
            <p className="mt-1.5 text-[13.5px] text-ink-600">We typically respond within one working day.</p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="First name" name="fname" required />
              <Field label="Last name" name="lname" required />
              <Field label="Email" type="email" name="email" required full />
              <Field label="Subject" name="subject" full />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-semibold text-ink-800">Message</label>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition focus:border-brand-500"
                  placeholder="How can we help with your research?"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="brand-gradient h-12 w-full rounded-full text-sm font-bold text-white transition hover:brightness-110"
                >
                  Send message
                </button>
                <p className="mt-3 text-center text-[11px] text-ink-500">
                  By contacting us you acknowledge our products are Research Use Only.
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}

function ContactRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</p>
        <div className="mt-1.5 text-[14px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, full, ...props }: { label: string; full?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
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
