import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { DosageCalculator } from "./DosageCalculator";

export const metadata: Metadata = {
  title: "Peptide Dosage Calculator",
  description:
    "Calculate the volume to draw for your research peptide reconstitution. Enter desired dose, peptide strength, and volume.",
};

export default function DosageCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Research Tools"
        title="Peptide Dosage Calculator"
        intro="Enter the details to calculate your peptide dosage. A reconstitution reference tool for laboratory research workflows."
        breadcrumb={[{ label: "Dosage Calculator" }]}
      />
      <Container className="py-12">
        <DosageCalculator />
      </Container>
    </>
  );
}
