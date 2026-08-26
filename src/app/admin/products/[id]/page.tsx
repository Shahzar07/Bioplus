import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, select: { name: true } });
  return { title: product?.name ?? "Product" };
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-700 hover:text-brand-700"
        >
          <ArrowLeft size={15} /> All products
        </Link>
        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 hover:underline"
        >
          View on storefront <ExternalLink size={14} />
        </Link>
      </div>

      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
        {product.name}
      </h1>

      <ProductForm
        values={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          tagline: product.tagline,
          blurb: product.blurb,
          form: product.form,
          highlights: product.highlights.join("\n"),
          status: product.status,
          imageUrl: product.imageUrl ?? "",
          bestSeller: product.bestSeller,
          isNew: product.isNew,
          variants: product.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            label: v.label,
            strength: v.strength,
            price: String(Number(v.price)),
            availability: v.availability,
            stockQty: String(v.stockQty),
            lowStockAt: String(v.lowStockAt),
          })),
        }}
      />
    </div>
  );
}
