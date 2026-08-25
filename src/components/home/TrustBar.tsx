import { ShieldCheck, FlaskConical, Microscope, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const BADGES = [
  {
    icon: Microscope,
    title: "Batch-Tested Purity",
    text: "Verified by HPLC, UPLC & Mass Spectrometry",
  },
  {
    icon: ShieldCheck,
    title: "Identity Verified",
    text: "Documentation maintained for traceability",
  },
  {
    icon: FlaskConical,
    title: "Research Use Only",
    text: "Lyophilised compounds for the lab",
  },
  {
    icon: Truck,
    title: "Same-Day UK Dispatch",
    text: "On orders approved before our 2pm cut-off",
  },
];

export function TrustBar() {
  return (
    <section className="metal-plate border-b border-line">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-line/70 sm:divide-y-0 lg:grid-cols-4">
          {BADGES.map((b, i) => (
            <div
              key={b.title}
              className={cn(
                "group relative flex items-start gap-3.5 px-5 py-7 first:pl-0 lg:last:pr-0",
                i % 2 === 0 && "border-l-0 sm:border-l",
                i === 0 && "sm:border-l-0",
              )}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-900 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <b.icon size={19} />
              </span>
              <div>
                <h3 className="text-[13.5px] font-bold leading-tight text-ink-900">{b.title}</h3>
                <p className="mt-1 text-[12px] leading-snug text-ink-600">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
