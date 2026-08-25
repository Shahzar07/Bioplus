import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

/**
 * BioPlus Labs lockup.
 * `black` is the client artwork as supplied (for light surfaces); `white` is the
 * silver treatment of the same artwork, for the dark bands and the footer.
 */
export function Logo({
  variant = "black",
  href = "/",
  className,
  height = 34,
  iconOnly = false,
  priority = false,
}: {
  variant?: "black" | "white";
  href?: string | null;
  className?: string;
  height?: number;
  iconOnly?: boolean;
  priority?: boolean;
}) {
  const src = iconOnly
    ? `/brand/bioplus-icon-${variant}.png`
    : `/brand/bioplus-logo-${variant}.png`;
  const ratio = iconOnly ? 130 / 120 : 529 / 145;
  const width = Math.round(height * ratio);

  const img = (
    <Image
      src={src}
      alt={SITE.name}
      width={width}
      height={height}
      priority={priority}
      className={cn("w-auto", className)}
      style={{ height }}
    />
  );

  if (href === null) return img;
  return (
    <Link href={href} aria-label={`${SITE.name} — home`} className="inline-flex items-center">
      {img}
    </Link>
  );
}
