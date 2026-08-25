import Link from "next/link";
import { cn } from "@/lib/cn";
import { ORDER_STATUS_LABEL, ORDER_STATUS_LIGHT } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma";

/** Shared primitives for the dashboard, kept on the storefront's tokens. */

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white shadow-card", className)}>
      {children}
    </section>
  );
}

export function PanelHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div>
        <h2 className="font-display text-[15px] font-bold text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  href?: string;
  tone?: "default" | "warn";
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-500">{label}</p>
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
            tone === "warn" ? "bg-amber-100 text-amber-700" : "bg-brand-50 text-brand-600",
          )}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="font-display mt-3 text-[28px] font-bold leading-none text-ink-900">{value}</p>
      {hint && <p className="mt-1.5 text-[12px] text-ink-500">{hint}</p>}
    </>
  );

  const className =
    "block rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-brand-500/40";

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset",
        ORDER_STATUS_LIGHT[status],
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon size={24} />
      </span>
      <p className="font-display mt-4 text-[16px] font-bold text-ink-900">{title}</p>
      {children && <div className="mt-1.5 text-[13px] text-ink-500">{children}</div>}
    </div>
  );
}

/** Dashboard table shell — tables scroll horizontally rather than the page. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}

export function Th({
  children,
  className,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      {...rest}
      className={cn(
        "whitespace-nowrap border-b border-line px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...rest}
      className={cn("border-b border-line px-5 py-3.5 text-[13.5px] text-ink-800", className)}
    >
      {children}
    </td>
  );
}

export function AdminButton({
  variant = "primary",
  className,
  ...props
}: {
  variant?: "primary" | "outline" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "brand-gradient text-white hover:brightness-110",
    outline: "border border-line bg-white text-ink-800 hover:border-brand-500 hover:text-brand-700",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition disabled:opacity-50",
        variants[variant],
        className,
      )}
    />
  );
}
