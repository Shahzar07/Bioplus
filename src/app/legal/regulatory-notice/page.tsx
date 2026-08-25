import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LegalLayout } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Regulatory & Legal Notice",
  description:
    "Products sold by BioPlus Labs are strictly for in-vitro research, laboratory testing, and analytical purposes only.",
};

export default function RegulatoryNoticePage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="Regulatory & Legal Notice"
        breadcrumb={[{ label: "Legal", href: "/legal/research-disclaimer" }, { label: "Regulatory & Legal Notice" }]}
      />
      <LegalLayout>
        <p>
          No product supplied by {SITE.legalName} holds a marketing authorisation from the Medicines and Healthcare
          products Regulatory Agency (MHRA) or any other medicines regulator. Nothing on this website has been assessed
          by a regulatory body, and no product offered by {SITE.name} is intended to diagnose, treat, cure, mitigate, or
          prevent any disease or medical condition.
        </p>
        <p>
          <strong>
            All products sold by {SITE.name} are intended strictly for in-vitro research, laboratory testing, and
            analytical purposes only. Products are not intended for human or animal consumption, medical use,
            therapeutic application, or diagnostic procedures of any kind.
          </strong>
        </p>
        <p>
          {SITE.legalName} is a supplier of research compounds and laboratory materials. We are not a pharmacy, a
          licensed manufacturer or wholesale dealer of medicinal products, a healthcare provider, or a clinical
          practitioner, and we make no medicinal claims of any kind.
        </p>
        <p>
          Products are supplied only to customers aged 18 or over who are ordering in a research capacity. By purchasing
          from {SITE.name}, customers confirm that they possess the knowledge, training, facilities, and equipment
          necessary to handle research materials safely, and they assume full responsibility for the proper handling,
          storage, use, and disposal of everything they purchase.
        </p>
        <p>
          The purchaser agrees that all products will be used solely for lawful research purposes and in accordance with
          all applicable UK laws, regulations, and industry standards, including the Human Medicines Regulations 2012 and
          the Misuse of Drugs Act 1971 where relevant. {SITE.legalName} shall not be responsible for any damages, losses,
          claims, or liabilities arising from the misuse, improper handling, or unauthorised use of its products.
        </p>
        <p>
          Customers outside the United Kingdom are responsible for confirming that the products they order may lawfully
          be imported into their own country, and for any customs duties or import charges that arise.
        </p>
        <p>
          By accessing this website and purchasing products from {SITE.name}, the customer acknowledges and agrees to
          these terms and conditions.
        </p>
      </LegalLayout>
    </>
  );
}
