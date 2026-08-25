import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Container } from "./Container";
import { Eyebrow } from "./SectionHeading";

/**
 * Inner-page hero — a brushed silver plate with a heavy orange rule against the
 * title, echoing the metal lockup the logo sits on.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="metal-plate relative overflow-hidden border-b border-line">
      {/* molecular ring watermark */}
      <Image
        src="/brand/bioplus-icon-black.png"
        alt=""
        aria-hidden
        width={130}
        height={120}
        className="pointer-events-none absolute -right-6 top-1/2 hidden h-[190%] w-auto -translate-y-1/2 opacity-[0.07] sm:block"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-white/70" />

      <Container className="relative py-12 sm:py-16">
        {breadcrumb && (
          <nav className="flex items-center gap-1.5 text-[12px] text-ink-500">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            {breadcrumb.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5">
                <ChevronRight size={13} />
                {b.href ? (
                  <Link href={b.href} className="hover:text-brand-700">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-brand-700">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="mt-6 flex gap-5 sm:gap-7">
          <span className="brand-gradient mt-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="font-display mt-3.5 max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-ink-900 sm:text-5xl">
              {title}
            </h1>
            {intro && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-600">{intro}</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}
