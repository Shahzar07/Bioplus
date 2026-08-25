import Link from "next/link";
import { Container } from "./Container";
import { cn } from "@/lib/cn";

/** Styled long-form text wrapper for legal & policy content. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-none text-[15px] leading-relaxed text-ink-700",
        "[&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink-900",
        "[&_h3]:font-display [&_h3]:mt-7 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink-900",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc [&_li]:marker:text-brand-500",
        "[&_strong]:font-semibold [&_strong]:text-ink-900",
        "[&_a]:font-semibold [&_a]:text-brand-700 [&_a:hover]:underline",
        className,
      )}
    >
      {children}
    </div>
  );
}

const LEGAL_LINKS = [
  { label: "Research-Use-Only Disclaimer", href: "/legal/research-disclaimer" },
  { label: "Regulatory & Legal Notice", href: "/legal/regulatory-notice" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Refunds", href: "/legal/returns" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms & Conditions", href: "/legal/terms" },
];

export function LegalLayout({
  children,
  updated,
}: {
  children: React.ReactNode;
  updated?: string;
}) {
  return (
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        {/* Policy index */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-500">Policies</p>
          <nav className="mt-4 space-y-1 border-l border-line">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[13.5px] font-medium text-ink-600 transition hover:border-brand-500 hover:text-brand-700"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          {updated && (
            <p className="mt-7 rounded-lg bg-mist px-3.5 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink-500">
              Last updated {updated}
            </p>
          )}
        </aside>

        <div className="min-w-0 max-w-3xl">
          <Prose>{children}</Prose>
        </div>
      </div>
    </Container>
  );
}
