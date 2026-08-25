import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LegalLayout } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BioPlus Labs collects, uses, and protects customer information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        breadcrumb={[{ label: "Legal", href: "/legal/research-disclaimer" }, { label: "Privacy Policy" }]}
      />
      <LegalLayout updated="June 2026">
        <p>
          Protecting our customers&apos; personal information is a top priority at BioPlus Labs. This policy
          explains how we collect, use, and safeguard the information you provide when using our website and placing
          orders.
        </p>

        <h2>Security</h2>
        <p>
          Our website utilizes industry-standard SSL (Secure Socket Layer) encryption technology to safeguard sensitive
          information during transmission. We maintain strict privacy practices and take reasonable measures to protect
          customer data from unauthorized access, disclosure, or misuse.
        </p>

        <h2>How we use your information</h2>
        <p>
          Customer information is used solely for order processing, customer support, account management, and
          communications related to your purchases. We use the details you provide — such as your name, contact
          information, shipping and billing addresses, and order history — to fulfill and support your orders.
        </p>

        <h2>Information sharing</h2>
        <p>
          BioPlus Labs does not sell, rent, or share customer information with third parties except as necessary
          to process payments, fulfill orders, comply with legal obligations, or provide services directly related to
          your purchase.
        </p>

        <h2>Your choices</h2>
        <p>
          You may create an account to manage your information and order history, or check out as a guest where
          available. To request access to, correction of, or deletion of your personal information, please contact our
          support team at <a href="mailto:customerservice@biopluslabs.co.uk">customerservice@biopluslabs.co.uk</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this Privacy Policy may be directed to{" "}
          <a href="mailto:customerservice@biopluslabs.co.uk">customerservice@biopluslabs.co.uk</a>.
        </p>
      </LegalLayout>
    </>
  );
}
