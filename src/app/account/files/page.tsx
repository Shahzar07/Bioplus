import { FileText, Download, FlaskConical } from "lucide-react";
import { PanelHeader } from "@/components/account/AccountShell";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatOrderDate } from "@/lib/order-status";

export default async function FilesPage() {
  const user = await requireUser("/account/files");

  // COAs reach a customer through the orders they were attached to.
  const files = await db.coaFile.findMany({
    where: { order: { userId: user.id } },
    orderBy: { createdAt: "desc" },
    include: { order: { select: { number: true } }, product: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Files & Certificates of Analysis"
        subtitle="Batch-specific COA and documentation for your orders."
      />

      {files.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
            <FileText size={24} />
          </span>
          <p className="font-display mt-4 text-lg font-bold text-white">No documents yet</p>
          <p className="mt-1.5 text-[13.5px] text-white/55">
            Certificates of Analysis are attached to your orders as each batch is released, and appear
            here automatically.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
          <ul className="divide-y divide-white/10">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-4 px-4 py-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                  <FileText size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-white">
                    {f.product ? `COA — ${f.product.name}` : f.filename}
                    {f.batch ? ` (Batch ${f.batch})` : ""}
                  </p>
                  <p className="text-[12px] text-white/50">
                    Order {f.order?.number ?? "—"} · {formatOrderDate(f.createdAt)}
                  </p>
                </div>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold text-white transition hover:border-brand-400 hover:text-brand-300"
                >
                  <Download size={15} /> Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-white/55">
        <FlaskConical size={18} className="mt-0.5 shrink-0 text-brand-300" />
        <p>
          Each production batch is subject to comprehensive analytical testing — including HPLC, UPLC,
          and Mass Spectrometry — to verify identity, purity, and quality specifications. Certificates
          are uploaded here as they are finalized and remain available for your records.
        </p>
      </div>
    </div>
  );
}
