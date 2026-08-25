import { cn } from "@/lib/cn";

/** Outlined pill eyebrow — the BioPlus section marker. */
export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em]",
        dark
          ? "border-brand-400/30 bg-brand-500/10 text-brand-300"
          : "border-brand-600/25 bg-brand-50 text-brand-700",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-brand-400" : "bg-brand-600")} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = false,
  rule = true,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  /** Short orange rule under the title — the BioPlus heading signature. */
  rule?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-display mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {rule && (
        <span
          className={cn(
            "brand-gradient mt-4 block h-[3px] w-12 rounded-full",
            align === "center" && "mx-auto",
          )}
        />
      )}
      {intro && (
        <p className={cn("mt-4 text-[15px] leading-relaxed", dark ? "text-white/60" : "text-ink-600")}>{intro}</p>
      )}
    </div>
  );
}
