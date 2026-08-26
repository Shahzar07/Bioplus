"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Ticket,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { logout } from "@/app/(auth)/actions";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/discounts", label: "Discounts", icon: Ticket },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  user,
  pendingOrders,
}: {
  user: { name: string; email: string; role: string };
  pendingOrders: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-ink-950 px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-display text-[15px] font-bold text-white">
          BioPlus <span className="text-brand-400">Admin</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-white/70 hover:bg-white/10"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside
        className={cn(
          "z-40 w-full shrink-0 flex-col bg-ink-950 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[248px]",
          open ? "flex" : "hidden lg:flex",
        )}
      >
        <div className="hidden items-center gap-2 px-5 py-5 lg:flex">
          <span className="brand-gradient grid h-8 w-8 place-items-center rounded-lg text-[13px] font-bold text-white">
            B+
          </span>
          <span className="font-display text-[15px] font-bold text-white">
            BioPlus <span className="text-brand-400">Admin</span>
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 pb-4 lg:px-3">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition",
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <item.icon size={17} className={active ? "text-brand-400" : "text-white/35"} />
                {item.label}
                {item.href === "/admin/orders" && pendingOrders > 0 && (
                  <span className="brand-gradient ml-auto grid h-5 min-w-[20px] place-items-center rounded-full px-1.5 text-[10.5px] font-bold text-white">
                    {pendingOrders}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <div className="mt-2 rounded-xl bg-white/[0.04] px-3 py-3">
            <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11.5px] text-white/45">{user.email}</p>
            <form action={logout}>
              <button
                type="submit"
                className="mt-2.5 flex items-center gap-1.5 text-[12px] font-semibold text-white/55 transition hover:text-brand-300"
              >
                <LogOut size={13} /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
