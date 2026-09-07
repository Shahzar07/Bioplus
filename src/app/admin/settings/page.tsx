import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Panel, PanelHead, TableWrap, Td, Th } from "@/components/admin/ui";
import {
  SettingField,
  SettingTextArea,
  SettingsPanel,
} from "@/components/admin/SettingsForms";
import { saveBankTransfer, saveShipping, saveStore } from "./actions";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireStaff();
  const settings = await getSettings();

  const activity = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { actor: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
          Settings
        </h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Delivery, payment and contact details used across the storefront.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsPanel
          title="Delivery"
          subtitle="Applied at checkout to every order."
          action={saveShipping}
        >
          <SettingField
            label="Free delivery from (£)"
            name="freeThreshold"
            type="number"
            step="0.01"
            min="0"
            defaultValue={settings.shipping.freeThreshold}
          />
          <SettingField
            label="Delivery charge below that (£)"
            name="flatRate"
            type="number"
            step="0.01"
            min="0"
            defaultValue={settings.shipping.flatRate}
          />
        </SettingsPanel>

        <SettingsPanel
          title="Bank transfer"
          subtitle="The account customers pay into. Every new order is issued these details with its own order number as the payment reference — on the payment page, in the confirmation email and in the customer's Research Hub."
          action={saveBankTransfer}
        >
          <SettingField
            label="Account name"
            name="accountName"
            defaultValue={settings.bankTransfer.accountName}
          />
          <SettingField label="Bank" name="bankName" defaultValue={settings.bankTransfer.bankName} />
          <SettingField
            label="Sort code"
            name="sortCode"
            placeholder="00-00-00"
            defaultValue={settings.bankTransfer.sortCode}
          />
          <SettingField
            label="Account number"
            name="accountNumber"
            placeholder="12345678"
            defaultValue={settings.bankTransfer.accountNumber}
          />
          <SettingField
            label="IBAN (optional)"
            name="iban"
            placeholder="GB00 TIDE 0000 0000 0000 00"
            defaultValue={settings.bankTransfer.iban}
            hint="Only needed for transfers from outside the UK."
          />
          <SettingField
            label="BIC / SWIFT (optional)"
            name="bic"
            defaultValue={settings.bankTransfer.bic}
          />
          <SettingTextArea
            label="Payment instructions"
            name="instructions"
            rows={3}
            defaultValue={settings.bankTransfer.instructions}
          />
        </SettingsPanel>

        <SettingsPanel title="Store" action={saveStore}>
          <SettingField
            label="Contact email"
            name="email"
            type="email"
            defaultValue={settings.store.email}
          />
          <SettingField label="Opening hours" name="hours" defaultValue={settings.store.hours} />
          <SettingField
            label="Default low-stock threshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            defaultValue={settings.store.lowStockThreshold}
            hint="Used for new SKUs; each SKU can override it."
          />
        </SettingsPanel>

        <Panel>
          <PanelHead title="Recent activity" subtitle="Who changed what." />
          {activity.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13.5px] text-ink-500">Nothing logged yet.</p>
          ) : (
            <TableWrap>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <Th>When</Th>
                    <Th>Action</Th>
                    <Th>By</Th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((entry) => (
                    <tr key={entry.id}>
                      <Td className="whitespace-nowrap text-[12.5px] text-ink-600">
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(entry.createdAt)}
                      </Td>
                      <Td className="text-[12.5px]">
                        <span className="font-mono">{entry.action}</span>
                        {entry.detail && (
                          <span className="block text-ink-500">{entry.detail}</span>
                        )}
                      </Td>
                      <Td className="text-[12.5px] text-ink-600">
                        {entry.actor?.name ?? entry.actor?.email ?? "—"}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Panel>
      </div>
    </div>
  );
}
