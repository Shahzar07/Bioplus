import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LegalLayout } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions governing the purchase and use of products from BioPlus Labs.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        breadcrumb={[{ label: "Legal", href: "/legal/research-disclaimer" }, { label: "Terms & Conditions" }]}
      />
      <LegalLayout updated="June 2026">
        <p>
          By accessing this website and purchasing products from BioPlus Labs, you acknowledge and agree to these
          terms and conditions. Please review them carefully.
        </p>

        <h2>Research Use Only</h2>
        <p>
          All products sold by BioPlus Labs are intended strictly for in-vitro research, laboratory testing, and
          analytical purposes only. Products are <strong>not</strong> intended for human or animal consumption, medical
          use, therapeutic application, or diagnostic procedures of any kind. The products offered on this website have
          not been granted a marketing authorisation by the Medicines and Healthcare products Regulatory Agency (MHRA) for human or veterinary use.
        </p>

        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years of age to purchase from BioPlus Labs. By purchasing, you certify that you
          are purchasing for legitimate research purposes and that all products will be handled only by qualified
          researchers and trained laboratory professionals.
        </p>

        <h2>Customer responsibilities</h2>
        <p>
          By purchasing products, customers acknowledge that they possess the knowledge, training, facilities, and
          equipment necessary to safely handle research materials. Customers assume full responsibility for the proper
          handling, storage, use, and disposal of all products purchased, and agree that all products will be used
          solely for lawful research purposes in accordance with applicable laws, regulations, and industry standards.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          BioPlus Labs shall not be responsible for any damages, losses, claims, or liabilities arising from the
          misuse, improper handling, or unauthorized use of its products.
        </p>

        <h2>Orders, pricing & payment</h2>
        <p>
          Orders may be placed securely 24 hours a day, 7 days a week. We accept major credit and debit cards through
          our secure payment processing platform; additional payment methods may be displayed during checkout. Prices,
          product availability, and promotions are subject to change. Orders are subject to verification before
          fulfilment.
        </p>

        <h2>Shipping & returns</h2>
        <p>
          See our <a href="/shipping">Shipping &amp; Delivery</a> information and{" "}
          <a href="/legal/returns">Returns &amp; Refunds</a> policy for details on processing, delivery, and
          resolutions for damaged, incomplete, or incorrect orders.
        </p>

        <h2>Governing terms</h2>
        <p>
          These terms, together with our <a href="/legal/privacy">Privacy Policy</a>,{" "}
          <a href="/legal/research-disclaimer">Research Disclaimer</a>, and{" "}
          <a href="/legal/regulatory-notice">Regulatory &amp; Legal Notice</a>, govern your use of this website and your
          purchases. By accessing this website and purchasing products, you acknowledge and agree to all of the above.
        </p>
      </LegalLayout>
    </>
  );
}
