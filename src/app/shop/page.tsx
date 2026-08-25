import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Research Catalogue",
  description: "Browse BioPlus Labs high-purity research peptides and laboratory materials. Research Use Only.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ShopClient />
    </Suspense>
  );
}
