import { MapPin, Pencil, Building2 } from "lucide-react";
import { PanelHeader, ACCOUNT_USER } from "@/components/account/AccountShell";

function AddressCard({ type, icon: Icon }: { type: string; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300">
          <Icon size={15} /> {type}
        </span>
        <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/60 hover:text-white">
          <Pencil size={14} /> Edit
        </button>
      </div>
      <address className="mt-4 space-y-0.5 not-italic text-[14px] leading-relaxed text-white/75">
        <p className="font-semibold text-white">{ACCOUNT_USER.name}</p>
        <p>Research Division</p>
        <p>14 Nicolson Square</p>
        <p>Edinburgh, EH8 9BX</p>
        <p>United Kingdom</p>
        <p className="pt-2 text-white/50">{ACCOUNT_USER.email}</p>
      </address>
    </div>
  );
}

export default function ResearchAddressPage() {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Research Address"
        subtitle="Manage the delivery and billing addresses used for your research orders."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <AddressCard type="Delivery Address" icon={MapPin} />
        <AddressCard type="Billing Address" icon={Building2} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-white/55">
        Orders ship only to verified research addresses. To add a new address or update an existing one, use the Edit
        action above or contact support for institutional accounts and laboratory supply agreements.
      </div>
    </div>
  );
}
