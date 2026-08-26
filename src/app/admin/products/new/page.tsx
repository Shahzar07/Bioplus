import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireStaff();

  return (
    <div className="space-y-5">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-700 hover:text-brand-700"
      >
        <ArrowLeft size={15} /> All products
      </Link>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
        Add product
      </h1>

      <ProductForm
        values={{
          slug: "",
          name: "",
          tagline: "",
          blurb: "",
          form: "Lyophilised powder",
          highlights: "",
          status: "ACTIVE",
          imageUrl: "",
          bestSeller: false,
          isNew: true,
          variants: [],
        }}
      />
    </div>
  );
}
