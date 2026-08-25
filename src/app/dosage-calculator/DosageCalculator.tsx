"use client";

import { useMemo, useState } from "react";
import { Syringe, FlaskConical, Beaker, Gauge, FlaskRound } from "lucide-react";
import { cn } from "@/lib/cn";

const DOSE_PRESETS = [0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15]; // mg
const STRENGTH_PRESETS = [100, 250, 500, 750, 1000, 1500, 2000]; // mcg/ml
const VOLUME_PRESETS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]; // ml

export function DosageCalculator() {
  const [dose, setDose] = useState(0.5); // mg
  const [strength, setStrength] = useState(1000); // mcg/ml
  const [volume, setVolume] = useState(2.0); // ml

  const { mlToDraw, units, dosesPerVial, totalMg, overdraw } = useMemo(() => {
    const doseMcg = dose * 1000;
    const ml = strength > 0 ? doseMcg / strength : 0;
    const total = strength * volume; // mcg in vial
    return {
      mlToDraw: ml,
      units: ml * 100, // U-100 insulin syringe
      dosesPerVial: ml > 0 ? volume / ml : 0,
      totalMg: total / 1000,
      overdraw: ml > volume,
    };
  }, [dose, strength, volume]);

  const fillPct = volume > 0 ? Math.min(100, (mlToDraw / volume) * 100) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Inputs */}
      <div className="space-y-5">
        <OptionGroup
          icon={Syringe}
          title="Desired Dose"
          helper="0.1 mg = 100 mcg (µg)"
          unit="mg"
          presets={DOSE_PRESETS}
          value={dose}
          onChange={setDose}
          step={0.05}
        />
        <OptionGroup
          icon={FlaskConical}
          title="Peptide Strength"
          unit="mcg/ml"
          presets={STRENGTH_PRESETS}
          value={strength}
          onChange={setStrength}
          step={50}
        />
        <OptionGroup
          icon={Beaker}
          title="Volume (Bacteriostatic Water)"
          unit="ml"
          presets={VOLUME_PRESETS}
          value={volume}
          onChange={setVolume}
          step={0.5}
        />
      </div>

      {/* Result */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <div className="rounded-xl bg-mist p-6 text-center">
            <Gauge size={22} className="mx-auto text-brand-600" />
            <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500">You Need to Draw</p>
            <p className="font-display mt-1 text-5xl font-bold leading-none text-brand-700">
              {overdraw ? "—" : mlToDraw.toFixed(2)}
              <span className="ml-1 text-2xl text-ink-500">ml</span>
            </p>
            <p className="mt-1 text-[13px] text-ink-500">of Peptide Solution</p>
          </div>

          {/* Syringe */}
          <div className="mt-6 flex items-center justify-center">
            <SyringeGraphic fillPct={fillPct} />
          </div>

          {/* Secondary stats */}
          {overdraw ? (
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-center text-[12.5px] font-medium text-amber-800">
              The required draw exceeds the vial volume. Increase the peptide strength or volume.
            </p>
          ) : (
            <dl className="mt-5 space-y-2.5 text-sm">
              <Stat label="On a U-100 insulin syringe" value={`${units.toFixed(0)} units`} />
              <Stat label="Total peptide in vial" value={`${totalMg.toFixed(2)} mg`} />
              <Stat label="Approx. doses per vial" value={`${dosesPerVial.toFixed(1)}`} />
            </dl>
          )}

          <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-ink-500">
            <FlaskRound size={14} className="mt-0.5 shrink-0 text-brand-600" />
            For laboratory research reference only. Not medical or dosing advice. Products are Research Use Only.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line pb-2.5 last:border-0">
      <dt className="text-ink-600">{label}</dt>
      <dd className="font-display font-bold text-ink-900">{value}</dd>
    </div>
  );
}

function OptionGroup({
  icon: Icon,
  title,
  helper,
  unit,
  presets,
  value,
  onChange,
  step,
}: {
  icon: React.ElementType;
  title: string;
  helper?: string;
  unit: string;
  presets: number[];
  value: number;
  onChange: (v: number) => void;
  step: number;
}) {
  const isPreset = presets.includes(value);
  const [other, setOther] = useState(!isPreset);

  return (
    <section className="relative overflow-hidden rounded-xl border border-line bg-white p-5 pl-6 shadow-card sm:p-6 sm:pl-7">
      <span className="brand-gradient absolute inset-y-0 left-0 w-[3px]" />
      <div className="flex items-center gap-3">
        <span className="brand-gradient grid h-9 w-9 place-items-center rounded-lg text-white">
          <Icon size={17} />
        </span>
        <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {presets.map((p) => {
          const active = !other && value === p;
          return (
            <button
              key={p}
              onClick={() => {
                setOther(false);
                onChange(p);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-semibold transition-all",
                active
                  ? "brand-gradient border-transparent text-white shadow-[0_6px_16px_-6px_rgba(248,80,0,0.6)]"
                  : "border-line bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
              )}
            >
              {p} {unit}
            </button>
          );
        })}
        <button
          onClick={() => setOther(true)}
          className={cn(
            "rounded-full border px-4 py-2 text-[13px] font-semibold transition-all",
            other
              ? "brand-gradient border-transparent text-white"
              : "border-line bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
          )}
        >
          Other
        </button>
      </div>

      {other && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min={0}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="h-11 w-40 rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus:border-brand-500"
          />
          <span className="text-sm font-medium text-ink-500">{unit}</span>
        </div>
      )}

      {helper && <p className="mt-3 text-[12px] text-ink-500">{helper}</p>}
    </section>
  );
}

function SyringeGraphic({ fillPct }: { fillPct: number }) {
  // vertical syringe, barrel from y=40 to y=300 (260 tall)
  const top = 40;
  const height = 250;
  const fillH = (fillPct / 100) * height;
  const ticks = Array.from({ length: 11 }, (_, i) => i); // 0..10 -> 0..100
  return (
    <svg viewBox="0 0 160 360" className="h-72 w-auto" role="img" aria-label="Syringe fill illustration">
      {/* plunger top */}
      <rect x="40" y="6" width="80" height="10" rx="3" fill="#9aa4b5" />
      <rect x="74" y="14" width="12" height="28" fill="#9aa4b5" />
      {/* barrel */}
      <rect x="58" y={top} width="44" height={height} rx="6" fill="#f1f4f9" stroke="#cdd6e4" />
      {/* fill from bottom */}
      <rect
        x="60"
        y={top + (height - fillH)}
        width="40"
        height={fillH}
        rx="4"
        className="fill-brand-500"
        opacity="0.85"
      />
      {/* ticks + labels */}
      {ticks.map((t) => {
        const y = top + (t / 10) * height;
        const major = t % 1 === 0;
        return (
          <g key={t}>
            <line x1="102" y1={y} x2={major ? 116 : 110} y2={y} stroke="#94a0b4" strokeWidth="1" />
            <text x="120" y={y + 3} fontSize="9" fill="#64748b" fontFamily="var(--font-inter), sans-serif">
              {100 - t * 10}
            </text>
          </g>
        );
      })}
      {/* needle */}
      <rect x="76" y={top + height} width="8" height="14" fill="#cdd6e4" />
      <rect x="79" y={top + height + 14} width="2" height="40" fill="#aab4c4" />
    </svg>
  );
}
