import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LegalLayout } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "BioPlus Labs returns and replacements policy for research compounds and laboratory materials.",
};

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Returns & Refunds"
        breadcrumb={[{ label: "Legal", href: "/legal/research-disclaimer" }, { label: "Returns & Refunds" }]}
      />
      <LegalLayout updated="June 2026">
        <p>
          Due to the nature of research compounds and laboratory materials, BioPlus Labs generally does not accept
          returns once products have been shipped.
        </p>

        <h2>Damaged, incomplete, or incorrect orders</h2>
        <p>
          If an order arrives damaged, incomplete, or contains an incorrect item, customers should contact our support
          team within <strong>48 hours of delivery</strong>. We will review the issue and, when appropriate, provide a
          replacement or corrective resolution.
        </p>

        <h2>Our commitment</h2>
        <p>
          Our goal is to ensure that every customer receives exactly what was ordered and that any legitimate concerns
          are handled promptly and professionally.
        </p>

        <h2>How to request a resolution</h2>
        <p>
          Please contact <a href="mailto:customerservice@biopluslabs.co.uk">customerservice@biopluslabs.co.uk</a> with your order
          number and a description of the issue (including photos where applicable). Our team will respond as quickly as
          possible to resolve the matter.
        </p>
      </LegalLayout>
    </>
  );
}
