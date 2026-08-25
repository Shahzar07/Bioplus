"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { createContext, useContext } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { logout } from "@/app/(auth)/actions";

export type AccountUser = {
  name: string;
  email: string;
  organisation: string | null;
};

const AccountUserContext = createContext<AccountUser | null>(null);

/** The signed-in customer, for the client pages nested inside the shell. */
export function useAccountUser(): AccountUser {
  const user = useContext(AccountUserContext);
  if (!user) throw new Error("useAccountUser must be used within AccountShell");
  return user;
}

function LogOutButton({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <form action={logout}>
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}

const NAV = [
  { href: "/account", label: "Research Hub", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/files", label: "Files & COA", icon: FileText },
  { href: "/account/research-address", label: "Research Address", icon: MapPin },
  { href: "/account/settings", label: "Account Settings", icon: Settings },
];

export function AccountShell({
  user,
  children,
}: {
  user: AccountUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AccountUserContext.Provider value={user}>
    <section className="band-dark relative min-h-[80vh] text-white">
      <div className="hairline-grid absolute inset-0 opacity-50" />
      <Container className="relative py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
          {/* Sidebar */}
          <aside>
            <nav className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 border-b border-white/10 px-5 py-4 text-[14px] font-semibold transition-all",
                      active ? "bg-white/[0.07] text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "brand-gradient absolute inset-y-0 left-0 w-[3px] transition-opacity",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <item.icon size={18} className={active ? "text-brand-400" : "text-white/40"} />
                    {item.label}
                  </Link>
                );
              })}
              <LogOutButton className="flex w-full items-center gap-3 px-5 py-4 text-left text-[14px] font-semibold text-white/60 transition-all hover:bg-white/[0.04] hover:text-white">
                <LogOut size={18} className="text-white/40" />
                Log out
              </LogOutButton>
            </nav>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[12.5px] text-white/55">
              <p className="font-semibold text-white/80">Need assistance?</p>
              <p className="mt-1 leading-relaxed">
                Our support team is here to help with orders, COA, and account questions.
              </p>
              <a href="mailto:customerservice@biopluslabs.co.uk" className="mt-2 inline-block font-semibold text-brand-300 hover:text-brand-200">
                customerservice@biopluslabs.co.uk
              </a>
            </div>
          </aside>

          {/* Content */}
          <div>{children}</div>
        </div>
      </Container>
    </section>
    </AccountUserContext.Provider>
  );
}

export function PanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 pl-7">
      <span className="brand-gradient absolute inset-y-0 left-0 w-[3px]" />
      <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
      <p className="mt-1 text-[13.5px] text-white/55">{subtitle}</p>
    </div>
  );
}

export function AccountGreeting() {
  const user = useAccountUser();
  return (
    <p className="text-[14px] text-white/60">
      Hello <strong className="text-white">{user.name}</strong> (not {user.name}?{" "}
      <LogOutButton className="text-brand-300 underline-offset-2 hover:text-brand-200 hover:underline">
        Log out
      </LogOutButton>
      )
    </p>
  );
}
