import { Truck, FlaskConical, BadgeCheck } from "lucide-react";

const ITEMS = [
  { icon: Truck, text: "Same-working-day UK dispatch on orders approved before 2pm" },
  { icon: BadgeCheck, text: "HPLC / UPLC / MS batch-tested for purity & identity" },
  { icon: FlaskConical, text: "Research Use Only · Not for human or animal consumption" },
  { icon: Truck, text: "Discreet, secure packaging · SSL-encrypted checkout" },
];

export function AnnouncementBar() {
  return (
    <div className="band-dark relative overflow-hidden text-white">
      <div className="flex animate-marquee whitespace-nowrap py-2 will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {ITEMS.map((it, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-2 text-[12px] font-medium text-white/80">
                <it.icon size={14} className="text-brand-400" />
                {it.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
