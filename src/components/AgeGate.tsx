"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Check } from "lucide-react";
import { Logo } from "./Logo";

const STORAGE_KEY = "bioplus-access-verified-v1";

const STATEMENTS = [
  "I am at least 18 years of age.",
  "I understand that all products offered by BioPlus Labs are intended solely for laboratory research purposes.",
  "I acknowledge that these products are not intended for human or animal consumption.",
  "I understand that products sold by BioPlus Labs are not intended to diagnose, treat, cure, or prevent any disease.",
  "I agree to comply with all applicable laws and regulations regarding the purchase, possession, and use of research materials.",
];

export function AgeGate() {
  const [open, setOpen] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "yes") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function enter() {
    try {
      localStorage.setItem(STORAGE_KEY, "yes");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  function leave() {
    window.location.href = "https://www.google.com";
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="band-dark absolute inset-0 hairline-grid" />
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" />

      <div className="animate-fade-up relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-pop">
        <div className="brand-gradient h-1.5 w-full" />
        <div className="p-7 sm:p-9">
          <div className="flex flex-col items-center text-center">
            <Logo variant="white" href={null} height={40} priority />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              <ShieldCheck size={13} /> Research Access Verification
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Before entering this website, please confirm the following:
            </p>
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-500/40">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                allChecked ? "brand-gradient border-transparent" : "border-white/30 bg-transparent"
              }`}
            >
              {allChecked && <Check size={14} className="text-white" strokeWidth={3} />}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={allChecked}
              onChange={(e) => setAllChecked(e.target.checked)}
            />
            <span className="text-[13px] font-semibold text-white">
              I confirm and agree to all of the statements below.
            </span>
          </label>

          <ul className="mt-4 space-y-2.5">
            {STATEMENTS.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-white/65">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={enter}
              disabled={!allChecked}
              className="brand-gradient h-12 flex-1 rounded-full text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(248,80,0,0.7)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enter Site
            </button>
            <button
              onClick={leave}
              className="h-12 flex-1 rounded-full border border-white/15 text-sm font-semibold text-white/70 transition hover:bg-white/5"
            >
              Leave Site
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-white/40">
            By selecting &ldquo;Enter Site,&rdquo; you certify that you are at least 18 years of age and
            understand the research-use-only nature of the products offered by BioPlus Labs.
          </p>
        </div>
      </div>
    </div>
  );
}
