"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type QA = { q: string; a: string };

export function Accordion({ items, className }: { items: QA[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={cn("divide-y divide-line rounded-2xl border border-line bg-white", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="font-display text-[15px] font-bold text-ink-900 sm:text-base">{item.q}</span>
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                  isOpen ? "brand-gradient rotate-45 border-transparent text-white" : "border-line text-ink-600",
                )}
              >
                <Plus size={16} />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 text-[14px] leading-relaxed text-ink-600 sm:px-6">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
