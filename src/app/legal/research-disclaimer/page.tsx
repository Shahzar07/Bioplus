import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LegalLayout } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Research-Use-Only Disclaimer",
  description: "All products offered by BioPlus Labs are intended solely for laboratory research purposes.",
};

export default function ResearchDisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Research Use Only"
        title="Important Research Disclaimer"
        breadcrumb={[{ label: "Legal", href: "/legal/research-disclaimer" }, { label: "Research Disclaimer" }]}
      />
      <LegalLayout>
        <p>
          All products offered by BioPlus Labs are intended solely for laboratory research, analytical testing,
          and scientific investigation purposes. Products sold by BioPlus Labs are <strong>not</strong> intended
          for human consumption, animal consumption, therapeutic use, medical use, diagnostic use, or clinical
          application of any kind.
        </p>
        <p>
          By purchasing from BioPlus Labs, customers acknowledge and agree that all products will be handled only
          by qualified researchers and trained laboratory professionals in controlled research environments and in
          accordance with all applicable laws, regulations, and industry standards.
        </p>
        <p>
          BioPlus Labs is a supplier of research compounds and laboratory materials. We are not a compounding
          pharmacy, medical provider, healthcare practitioner, or pharmaceutical manufacturer. The products offered on
          this website hold no marketing authorisation from the Medicines and Healthcare products Regulatory Agency (MHRA) for human or veterinary
          use.
        </p>
        <p>
          No statements made on this website, in product descriptions, marketing materials, customer communications, or
          other content should be interpreted as medical advice or as a claim that any product can diagnose, treat,
          cure, mitigate, or prevent any disease, condition, or illness.
        </p>
        <p>
          The information presented on this website is provided for educational and research reference purposes only.
          Researchers are solely responsible for understanding the properties, handling requirements, storage
          conditions, and lawful use of all products purchased.
        </p>
        <p>
          Products must not be used in foods, drugs, cosmetics, dietary supplements, medical devices, or any application
          intended for human or animal use. Statements and information contained on this website have not been
          assessed by the Medicines and Healthcare products Regulatory Agency (MHRA) or any other medicines regulator.
        </p>
        <p>
          By accessing this website and purchasing products from BioPlus Labs, you certify that you are purchasing
          for legitimate research purposes and agree to use all products in compliance with applicable laws and
          regulations.
        </p>
      </LegalLayout>
    </>
  );
}
