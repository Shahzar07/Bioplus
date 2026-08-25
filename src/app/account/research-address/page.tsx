import { MapPin } from "lucide-react";
import { PanelHeader } from "@/components/account/AccountShell";
import { DarkField, DarkForm } from "@/components/account/DarkForm";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { saveResearchAddress } from "../actions";

export default async function ResearchAddressPage() {
  const user = await requireUser("/account/research-address");
  const address = await db.address.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  // Fall back to the most recent order's delivery details for a guest who has
  // since registered, so the form is not blank on first visit.
  const lastOrder = address
    ? null
    : await db.order.findFirst({
        where: { userId: user.id },
        orderBy: { placedAt: "desc" },
      });

  // Address and Order name the institution field differently; normalise so the
  // rest of the page reads one shape.
  const seed = address
    ? { ...address, org: address.org }
    : lastOrder
      ? { ...lastOrder, org: lastOrder.organisation }
      : null;
  const [fallbackFirst, ...fallbackRest] = (user.name ?? "").split(" ");

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Research Address"
        subtitle="Manage the delivery address used for your research orders."
      />

      {seed && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300">
            <MapPin size={15} /> Current delivery address
          </span>
          <address className="mt-4 space-y-0.5 not-italic text-[14px] leading-relaxed text-white/75">
            <p className="font-semibold text-white">
              {seed.firstName} {seed.lastName}
            </p>
            {seed.org && <p>{seed.org}</p>}
            <p>{seed.line1}</p>
            {seed.line2 && <p>{seed.line2}</p>}
            <p>
              {seed.city}
              {seed.county ? `, ${seed.county}` : ""} {seed.postcode}
            </p>
            <p>{seed.country === "GB" ? "United Kingdom" : seed.country}</p>
            <p className="pt-2 text-white/50">{user.email}</p>
          </address>
        </div>
      )}

      <DarkForm action={saveResearchAddress} title={seed ? "Update address" : "Add your research address"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <DarkField
            label="Institution / Lab (optional)"
            name="org"
            defaultValue={seed?.org ?? user.organisation ?? ""}
            placeholder="University Research Lab"
          />
          <div className="hidden sm:block" />
          <DarkField
            label="First name"
            name="firstName"
            defaultValue={seed?.firstName ?? fallbackFirst ?? ""}
            required
          />
          <DarkField
            label="Last name"
            name="lastName"
            defaultValue={seed?.lastName ?? fallbackRest.join(" ")}
            required
          />
          <DarkField
            label="Address line 1"
            name="line1"
            defaultValue={seed?.line1 ?? ""}
            placeholder="House number and street"
            required
          />
          <DarkField label="Address line 2 (optional)" name="line2" defaultValue={seed?.line2 ?? ""} />
          <DarkField label="Town / City" name="city" defaultValue={seed?.city ?? ""} required />
          <DarkField label="County (optional)" name="county" defaultValue={seed?.county ?? ""} />
          <DarkField
            label="Postcode"
            name="postcode"
            defaultValue={seed?.postcode ?? ""}
            placeholder="EH32 9BZ"
            required
          />
          <div>
            <label htmlFor="country" className="mb-1.5 block text-[13px] font-semibold text-white/70">
              Country
            </label>
            <select
              id="country"
              name="country"
              defaultValue={seed?.country ?? "GB"}
              className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-brand-400"
            >
              <option value="GB">United Kingdom</option>
              <option value="IE">Ireland</option>
            </select>
          </div>
        </div>
      </DarkForm>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-white/55">
        Orders ship only to verified research addresses. For institutional accounts and laboratory
        supply agreements, contact support.
      </div>
    </div>
  );
}
