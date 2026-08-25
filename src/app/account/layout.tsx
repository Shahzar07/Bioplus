import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Research Hub",
  description: "Your BioPlus Labs account — orders, COA files, research address, and settings.",
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <AccountShell
      user={{
        name: user.name ?? user.email,
        email: user.email,
        organisation: user.organisation,
      }}
    >
      {children}
    </AccountShell>
  );
}
