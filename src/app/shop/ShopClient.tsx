"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { lowestPrice, productAvailability } from "@/lib/products";
import { useCatalogue } from "@/lib/catalog-context";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

/** In stock first, then arriving soon, then out of stock. */
const AVAILABILITY_RANK = { "in-stock": 0, "arriving-soon": 1, "out-of-stock": 2 } as const;

export function ShopClient() {
  const catalogue = useCatalogue();
  const [sort, setSort] = useState<Sort>("featured");

  const products = useMemo(() => {
    const list = [...catalogue];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => lowestPrice(a) - lowestPrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => lowestPrice(b) - lowestPrice(a));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort(
          (a, b) =>
            AVAILABILITY_RANK[productAvailability(a)] - AVAILABILITY_RANK[productAvailability(b)] ||
            Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false) ||
            a.name.localeCompare(b.name),
        );
    }
    return list;
  }, [sort, catalogue]);

  return (
    <>
      {/* Page header — brushed silver plate */}
      <section className="metal-plate relative overflow-hidden border-b border-line">
        <div className="absolute inset-x-0 top-0 h-px bg-white/70" />
        <Container className="relative py-12 sm:py-14">
          <nav className="text-[12px] text-ink-500">
            Home <span className="mx-1.5">/</span> <span className="text-ink-700">Shop</span>
          </nav>
          <div className="mt-5 flex gap-5 sm:gap-7">
            <span className="brand-gradient mt-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
            <div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                Research Catalogue
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-600">
                Every product we supply, on one page. High-purity research compounds and laboratory materials,
                batch-tested for identity and purity. All products are Research Use Only.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-[13px] text-ink-500">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sort" className="hidden text-ink-600 sm:inline">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-ink-800 outline-none focus:border-brand-500"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Container>
    </>
  );
}
