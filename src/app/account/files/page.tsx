import { FileText, Download, FlaskConical, Clock } from "lucide-react";
import { PanelHeader } from "@/components/account/AccountShell";

const FILES = [
  { name: "COA — Retatrutide (Batch RT-260514)", sku: "RT20", date: "Jun 14, 2026", method: "HPLC · MS", status: "ready" },
  { name: "COA — BPC-157 (Batch BC-260514)", sku: "BC10", date: "Jun 14, 2026", method: "HPLC · UPLC", status: "ready" },
  { name: "COA — Tirzepatide (Batch TR-260602)", sku: "TR10", date: "Jun 2, 2026", method: "Pending upload", status: "pending" },
];

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <PanelHeader title="Files & Certificates of Analysis" subtitle="Batch-specific COA and documentation for your orders." />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
        <ul className="divide-y divide-white/10">
          {FILES.map((f) => (
            <li key={f.name} className="flex items-center gap-4 px-4 py-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                <FileText size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-white">{f.name}</p>
                <p className="text-[12px] text-white/50">
                  SKU {f.sku} · {f.method} · {f.date}
                </p>
              </div>
              {f.status === "ready" ? (
                <button className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold text-white transition hover:border-brand-400 hover:text-brand-300">
                  <Download size={15} /> Download
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-2 text-[12px] font-semibold text-amber-300">
                  <Clock size={14} /> Forthcoming
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-white/55">
        <FlaskConical size={18} className="mt-0.5 shrink-0 text-brand-300" />
        <p>
          Each production batch is subject to comprehensive analytical testing — including HPLC, UPLC, and Mass
          Spectrometry — to verify identity, purity, and quality specifications. Certificates are uploaded here as they
          are finalized and remain available for your records.
        </p>
      </div>
    </div>
  );
}
