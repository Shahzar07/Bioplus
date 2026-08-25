import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProduct, productAvailability } from "@/lib/products";
import { getCatalogue, getCatalogueProduct } from "@/lib/catalog";

export async function generateStaticParams() {
  const catalogue = await getCatalogue();
  return catalogue.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogueProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.blurb,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalogue = await getCatalogue();
  const product = getProduct(catalogue, slug);
  if (!product) notFound();

  // No categories — show other in-stock products, then anything else, to fill four slots.
  const related = catalogue
    .filter((p) => p.slug !== product.slug)
    .sort(
      (a, b) =>
        Number(productAvailability(b) === "in-stock") - Number(productAvailability(a) === "in-stock") ||
        Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false),
    )
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="bg-mist py-16">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="More from the catalogue" title="You may also be researching" />
              <Link
                href="/shop"
                className="hidden items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 sm:inline-flex"
              >
                View all products <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
