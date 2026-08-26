import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OrderAlerts } from "@/components/admin/OrderAlerts";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · BioPlus Admin" },
  robots: { index: false, follow: false },
};

/** The dashboard reads live data on every request — never cache it. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();

  const [pendingOrders, latest] = await Promise.all([
    db.order.count({ where: { status: "AWAITING_PAYMENT" } }),
    db.order.findFirst({ orderBy: { placedAt: "desc" }, select: { id: true } }),
  ]);

  return (
    <div className="min-h-screen bg-mist lg:flex">
      <AdminSidebar
        user={{ name: user.name ?? user.email, email: user.email, role: user.role }}
        pendingOrders={pendingOrders}
      />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
          >
            <Home size={14} /> Back to Home
          </Link>
        </div>
        {children}
      </main>
      <OrderAlerts initialLatestOrderId={latest?.id ?? null} />
    </div>
  );
}
