import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "outlineDark" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200 rounded-full disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "brand-gradient text-white shadow-[0_8px_24px_-8px_rgba(248,80,0,0.6)] hover:brightness-110 hover:-translate-y-0.5",
  dark: "bg-ink-900 text-white hover:bg-ink-800",
  outline: "border border-ink-900/15 text-ink-900 hover:border-brand-500 hover:text-brand-700 bg-white/60",
  outlineDark: "border border-white/20 bg-white/5 text-white hover:border-brand-400 hover:bg-white/10",
  light: "bg-white text-ink-900 hover:bg-brand-50 border border-white/0",
  ghost: "text-ink-700 hover:text-brand-700 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base py-3.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
