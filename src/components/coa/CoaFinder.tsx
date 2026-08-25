"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, FileText, ArrowUpRight, FlaskConical, Search, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Result = { product: string; slug: string; purity: number; batch: string; tested: string };

/**
 * Batch register. Sample data for the design build — replace with the live
 * batch records and PDF links once the client's testing lab supplies them.
 */
const RESULTS: Result[] = [
  { product: "Retatrutide", slug: "retatrutide", purity: 99.2, batch: "BPL-0441-R7", tested: "Jun 2026" },
  { product: "BPC-157", slug: "bpc-157", purity: 99.4, batch: "BPL-0157-C4", tested: "Jun 2026" },
  { product: "TB-500 (Thymosin β4)", slug: "tb-500", purity: 98.9, batch: "BPL-0500-T2", tested: "May 2026" },
  { product: "Tirzepatide", slug: "tirzepatide", purity: 99.1, batch: "BPL-0395-Z9", tested: "May 2026" },
  { product: "CJC-1295 + Ipamorelin", slug: "cjc-1295-ipamorelin", purity: 98.7, batch: "BPL-0372-K1", tested: "May 2026" },
  { product: "MOTS-c", slug: "mots-c", purity: 98.6, batch: "BPL-0360-M5", tested: "Apr 2026" },
  { product: "Ipamorelin", slug: "ipamorelin", purity: 99.0, batch: "BPL-0356-I3", tested: "Apr 2026" },
  { product: "GHK-Cu", slug: "ghk-cu", purity: 99.3, batch: "BPL-0341-G8", tested: "Apr 2026" },
];

export function CoaFinder() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return RESULTS;
    return RESULTS.filter(
      (r) => r.product.toLowerCase().includes(term) || r.batch.toLowerCase().includes(term),
    );
  }, [q]);

  return (
    <section className="bg-mist py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeading
              eyebrow="Batch Register"
              title="Search Certificates of Analysis"
              intro="Every batch we supply is independently analysed before release. Search by product name or batch number to find the matching certificate. Not every batch has completed analysis yet — certificates also appear on each product page."
            />

            <label className="mt-6 flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-3 shadow-card focus-within:border-brand-500">
              <Search size={17} className="shrink-0 text-ink-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Product name or batch number…"
                aria-label="Search certificates of analysis"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-500"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear search" className="shrink-0 text-ink-500 hover:text-ink-900">
                  <X size={16} />
                </button>
              )}
            </label>

            <div className="mt-4 space-y-2.5 rounded-2xl border border-line bg-white p-5 text-[12.5px] shadow-card">
              <p className="flex items-center gap-2 font-semibold text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> PASS &gt; 99% — Meets BioPlus specification
              </p>
              <p className="flex items-center gap-2 font-semibold text-brand-700">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> PASS &gt; 98% — Acceptable research grade
              </p>
              <p className="flex items-start gap-2 pt-1 text-ink-500">
                <FlaskConical size={14} className="mt-0.5 shrink-0" /> Results are listed by product and batch number for
                full transparency.
              </p>
            </div>
          </div>

          {/* Results table */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <div className="grid grid-cols-[1.6fr_0.9fr_1fr] gap-3 border-b border-line bg-ink-900 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-white/70">
              <span>Product &amp; result</span>
              <span>Batch</span>
              <span className="text-right">Actions</span>
            </div>

            {filtered.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <p className="text-[14px] font-semibold text-ink-900">No certificates match “{q}”.</p>
                <p className="mt-1.5 text-[13px] text-ink-600">
                  Check the batch number printed on your vial label, or contact us and we will send the certificate
                  directly.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {filtered.map((r) => {
                  const top = r.purity >= 99;
                  return (
                    <li key={r.batch} className="grid grid-cols-[1.6fr_0.9fr_1fr] items-center gap-3 px-5 py-4">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${r.slug}`}
                          className="block truncate text-[14px] font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {r.product}
                        </Link>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            top ? "bg-emerald-100 text-emerald-700" : "bg-brand-100 text-brand-700"
                          }`}
                        >
                          <BadgeCheck size={12} /> PASS · {r.purity.toFixed(1)}%
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate font-mono text-[12px] text-ink-700">{r.batch}</span>
                        <span className="text-[11px] text-ink-500">Tested {r.tested}</span>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href="/account/files"
                          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700"
                        >
                          <FileText size={13} /> COA
                        </Link>
                        <Link
                          href={`/product/${r.slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700"
                        >
                          Product <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
