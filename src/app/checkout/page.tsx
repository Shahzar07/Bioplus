import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your BioPlus Labs research order. Research Use Only.",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const settings = await getSettings();

  // Pre-fill from the saved research address, then the most recent order.
  const address = user
    ? await db.address.findFirst({ where: { userId: user.id, isDefault: true } })
    : null;
  const lastOrder =
    user && !address
      ? await db.order.findFirst({ where: { userId: user.id }, orderBy: { placedAt: "desc" } })
      : null;

  const [firstName, ...rest] = (user?.name ?? "").split(" ");
  const prefill = {
    email: user?.email ?? "",
    phone: user?.phone ?? lastOrder?.phone ?? "",
    organisation: address?.org ?? lastOrder?.organisation ?? user?.organisation ?? "",
    firstName: address?.firstName ?? lastOrder?.firstName ?? firstName ?? "",
    lastName: address?.lastName ?? lastOrder?.lastName ?? rest.join(" "),
    line1: address?.line1 ?? lastOrder?.line1 ?? "",
    line2: address?.line2 ?? lastOrder?.line2 ?? "",
    city: address?.city ?? lastOrder?.city ?? "",
    county: address?.county ?? lastOrder?.county ?? "",
    postcode: address?.postcode ?? lastOrder?.postcode ?? "",
    country: address?.country ?? lastOrder?.country ?? "GB",
  };

  return (
    <CheckoutClient
      prefill={prefill}
      bankTransfer={settings.bankTransfer}
      freeShippingThreshold={settings.shipping.freeThreshold}
      signedIn={Boolean(user)}
    />
  );
}
