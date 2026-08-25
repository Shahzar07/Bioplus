import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { formatGBP } from "@/lib/cn";
import { formatOrderDate } from "@/lib/order-status";
import { EmptyState, Panel, PanelHead, TableWrap, Td, Th } from "@/components/admin/ui";
import { DiscountForm, DiscountToggle } from "@/components/admin/DiscountControls";

export const metadata: Metadata = { title: "Discounts" };

export default async function DiscountsPage() {
  await requireStaff();
  const discounts = await db.discount.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
          Discounts
        </h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Codes customers can enter at checkout. Validity is enforced server-side.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel>
          <PanelHead title="Codes" />
          {discounts.length === 0 ? (
            <EmptyState icon={Ticket} title="No discount codes">
              Create one to run a promotion.
            </EmptyState>
          ) : (
            <TableWrap>
              <table className="w-full min-w-[620px] border-collapse">
                <thead>
                  <tr>
                    <Th>Code</Th>
                    <Th>Discount</Th>
                    <Th>Conditions</Th>
                    <Th className="text-right">Used</Th>
                    <Th className="text-right">Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((discount) => (
                    <tr key={discount.id} className="transition hover:bg-mist">
                      <Td className="font-mono text-[13px] font-bold text-ink-900">
                        {discount.code}
                      </Td>
                      <Td>
                        {discount.type === "PERCENT"
                          ? `${Number(discount.value)}% off`
                          : `${formatGBP(Number(discount.value))} off`}
                      </Td>
                      <Td className="text-[12.5px] text-ink-600">
                        {discount.minSpend && (
                          <span className="block">
                            Minimum spend {formatGBP(Number(discount.minSpend))}
                          </span>
                        )}
                        {discount.startsAt && (
                          <span className="block">From {formatOrderDate(discount.startsAt)}</span>
                        )}
                        {discount.endsAt && (
                          <span className="block">Until {formatOrderDate(discount.endsAt)}</span>
                        )}
                        {!discount.minSpend && !discount.startsAt && !discount.endsAt && "—"}
                      </Td>
                      <Td className="text-right">
                        {discount.usedCount}
                        {discount.usageLimit ? ` / ${discount.usageLimit}` : ""}
                      </Td>
                      <Td className="text-right">
                        <DiscountToggle id={discount.id} code={discount.code} active={discount.active} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Panel>

        <Panel>
          <PanelHead title="New code" />
          <DiscountForm />
        </Panel>
      </div>
    </div>
  );
}
