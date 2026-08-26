import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * BioPlus Labs product photography, one shot per catalogue item.
 * Files are named `/products/vial-<slug>.webp` — add a matching file when a
 * new product is added and it is picked up automatically.
 */
const VIAL_BY_SLUG: Record<string, string> = {
  retatrutide: "/products/vial-retatrutide.webp",
  tirzepatide: "/products/vial-tirzepatide.webp",
  cagrilintide: "/products/vial-cagrilintide.webp",
  "aod-9604": "/products/vial-aod-9604.webp",
  "bpc-157": "/products/vial-bpc-157.webp",
  "tb-500": "/products/vial-tb-500.webp",
  glow: "/products/vial-glow.webp",
  klow: "/products/vial-klow.webp",
  tesamorelin: "/products/vial-tesamorelin.webp",
  ipamorelin: "/products/vial-ipamorelin.webp",
  "cjc-1295": "/products/vial-cjc-1295.webp",
  "igf-1-lr3": "/products/vial-igf-1-lr3.webp",
  "ghk-cu": "/products/vial-ghk-cu.webp",
  "melanotan-2": "/products/vial-melanotan-2.webp",
  "mots-c": "/products/vial-mots-c.webp",
  "ss-31": "/products/vial-ss-31.webp",
  "nad-plus": "/products/vial-nad.webp",
  "bacteriostatic-water": "/products/vial-bacteriostatic-water.webp",
};

const FALLBACK = "/products/vial-bpc-157.webp";

export function vialFor(slug: string): string {
  return VIAL_BY_SLUG[slug] ?? FALLBACK;
}

/**
 * An image uploaded from the dashboard wins over the bundled photography; the
 * vial shot is the fallback for products that have never had one set.
 */
export function ProductImage({
  slug,
  name,
  imageUrl,
  className,
  sizes,
  priority = false,
}: {
  slug: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={imageUrl || vialFor(slug)}
      alt={`${name} — BioPlus Labs research vial`}
      width={880}
      height={1200}
      sizes={sizes ?? "(max-width: 768px) 40vw, 320px"}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
