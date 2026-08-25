"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, ChevronRight, FlaskConical } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PRIMARY_NAV, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart-context";
import { SearchOverlay } from "./SearchOverlay";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const { count, setDrawerOpen } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* brushed metal edge — the BioPlus signature */}
      <div className="metal-plate h-[3px] w-full" />
      <div
        className={cn(
          "relative border-b transition-all duration-300",
          scrolled ? "border-line bg-white/92 backdrop-blur-md" : "border-line/60 bg-white",
        )}
      >
        <div className="mx-auto flex h-[88px] max-w-7xl items-center gap-4 px-5 sm:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="-ml-1 rounded-full p-2 text-ink-800 hover:bg-haze lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Logo variant="black" height={46} priority className="shrink-0" />

          {/* Centred nav with an underline indicator */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
            {PRIMARY_NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1 text-[14px] font-semibold transition-colors",
                    active ? "text-ink-900" : "text-ink-600 hover:text-ink-900",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "brand-gradient absolute -bottom-1.5 left-0 h-[2.5px] rounded-full transition-all duration-300",
                      active ? "w-full opacity-100" : "w-0 opacity-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2.5 text-ink-800 transition hover:bg-haze"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link href="/account" className="rounded-full p-2.5 text-ink-800 transition hover:bg-haze" aria-label="Account">
              <User size={20} />
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative rounded-full p-2.5 text-ink-800 transition hover:bg-haze"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="brand-gradient absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <Link
              href="/shop"
              className="brand-gradient ml-2 hidden items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(248,80,0,0.75)] transition hover:brightness-110 sm:inline-flex"
            >
              <FlaskConical size={15} /> Shop Now
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile nav */}
      <div className={cn("fixed inset-0 z-[80] lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <div
          className={cn(
            "absolute inset-0 bg-ink-950/50 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-pop transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Logo variant="black" height={34} href={null} />
            <button onClick={() => setMobileOpen(false)} className="rounded-full p-2 hover:bg-haze" aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="scroll-slim flex-1 overflow-y-auto px-3 py-4">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-ink-800 hover:bg-mist"
              >
                {item.label}
                <ChevronRight size={16} className="text-ink-500" />
              </Link>
            ))}
          </nav>
          <div className="border-t border-line px-5 py-4 text-sm text-ink-600">
            <a href={`mailto:${SITE.email}`} className="font-semibold text-ink-900">
              {SITE.email}
            </a>
            <div className="mt-1 text-xs">{SITE.hours.days}, {SITE.hours.time}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
