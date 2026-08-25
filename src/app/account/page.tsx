import Link from "next/link";
import { Package, FileText, MapPin, Truck, ArrowUpRight } from "lucide-react";
import { AccountGreeting } from "@/components/account/AccountShell";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const QUICK = [
  { title: "Recent orders", text: "Review order status, tracking, and history.", href: "/account/orders", icon: Package },
  { title: "Certificates of Analysis", text: "Download batch-specific COA documents.", href: "/account/files", icon: FileText },
  { title: "Research address", text: "Manage your shipping & billing details.", href: "/account/research-address", icon: MapPin },
];

export default async function AccountDashboard() {
  const user = await requireUser();

  const [totalOrders, inTransit, coaFiles] = await Promise.all([
    db.order.count({ where: { userId: user.id } }),
    db.order.count({ where: { userId: user.id, status: { in: ["SHIPPED", "PROCESSING"] } } }),
    db.coaFile.count({ where: { order: { userId: user.id } } }),
  ]);

  const stats = [
    { label: "Total orders", value: totalOrders, icon: Package, href: "/account/orders" },
    { label: "In transit", value: inTransit, icon: Truck, href: "/account/orders" },
    { label: "COA files", value: coaFiles, icon: FileText, href: "/account/files" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
        <AccountGreeting />
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/55">
          From your account dashboard you can view your{" "}
          <Link href="/account/orders" className="text-brand-300 hover:text-brand-200">recent orders</Link>, manage your{" "}
          <Link href="/account/research-address" className="text-brand-300 hover:text-brand-200">shipping and billing addresses</Link>, and{" "}
          <Link href="/account/settings" className="text-brand-300 hover:text-brand-200">edit your password and account details</Link>.
        </p>
      </div>

      {/* Welcome card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-300">
            Member Access · RUO Platform
          </span>
          <h1 className="font-display mt-3 text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl">
            <span className="block text-white">WELCOME BACK,</span>
            <span className="brand-text-gradient block uppercase">{user.name ?? user.email}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/55">
            Your BioPlus Labs account hub is built for order visibility, research-supply access, and account
            management — all in one secure dashboard.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand-500/40 hover:bg-white/[0.06]"
          >
            <div>
              <p className="text-[12px] text-white/50">{s.label}</p>
              <p className="font-display mt-1 text-3xl font-bold text-white">{s.value}</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
              <s.icon size={20} />
            </span>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        {QUICK.map((q) => (
          <Link
            key={q.title}
            href={q.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-500/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/15 text-brand-300">
                <q.icon size={18} />
              </span>
              <ArrowUpRight size={17} className="text-white/30 transition group-hover:text-brand-300" />
            </div>
            <h3 className="font-display mt-4 text-base font-bold text-white">{q.title}</h3>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">{q.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
