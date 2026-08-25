import type { Metadata } from "next";
import { Boxes, Percent, FileText, Handshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wholesale & Bulk Pricing",
  description: "Wholesale purchasing, laboratory supply agreements, and bulk pricing from BioPlus Labs.",
};

const PERKS = [
  { icon: Percent, title: "Volume discounts", text: "Quantity discounts may be available on select products and larger-volume orders." },
  { icon: Boxes, title: "Lab supply agreements", text: "Recurring supply arrangements tailored to your laboratory's research needs." },
  { icon: FileText, title: "Documentation & COA", text: "Batch-specific Certificates of Analysis and supporting documentation for traceability." },
  { icon: Handshake, title: "Dedicated support", text: "Work directly with our team on pricing, fulfilment, and account management." },
];

export default function WholesalePage() {
  return (
    <>
      <PageHero
        eyebrow="Wholesale Programme"
        title="Wholesale, bulk pricing & laboratory supply agreements"
        intro="BioPlus Labs offers both retail and wholesale purchasing options. Customers interested in wholesale purchasing, laboratory supply agreements, or bulk-pricing opportunities are encouraged to contact our team directly."
        breadcrumb={[{ label: "Wholesale" }]}
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p, i) => (
              <div key={p.title} className="group relative bg-white p-7 transition-colors hover:bg-mist">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink-900 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <p.icon size={19} />
                  </span>
                  <span className="font-display text-[13px] font-bold tracking-[0.16em] text-ink-500/40">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-base font-bold">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">{p.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container size="narrow">
          <div className="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-9">
            <SectionHeading eyebrow="Request a quote" title="Tell us about your requirements" />
            <form className="mt-7 grid gap-4 sm:grid-cols-2">
              <WField label="Contact name" name="name" required />
              <WField label="Company / Institution" name="org" required />
              <WField label="Email" type="email" name="email" required />
              <WField label="Phone" name="phone" />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-semibold text-ink-800">Products & estimated volume</label>
                <textarea
                  rows={4}
                  placeholder="List the products (and SKUs) and approximate quantities you're interested in."
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button type="button" className="brand-gradient h-12 w-full rounded-full text-sm font-bold text-white transition hover:brightness-110">
                  Request wholesale pricing
                </button>
                <p className="mt-3 text-center text-[12px] text-ink-500">
                  Prefer email? Reach us at{" "}
                  <a href={`mailto:${SITE.email}`} className="font-semibold text-brand-700 hover:underline">
                    {SITE.email}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

function WField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-ink-800">{label}</label>
      <input {...props} className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus:border-brand-500" />
    </div>
  );
}
