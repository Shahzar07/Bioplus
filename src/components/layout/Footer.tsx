import Link from "next/link";
import { Mail, MapPin, FlaskConical, Clock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function Footer() {
  const cols = [FOOTER_NAV.shop, FOOTER_NAV.company, FOOTER_NAV.account, FOOTER_NAV.legal];
  return (
    <footer className="band-dark relative text-white">
      <div className="hairline-grid absolute inset-0 opacity-60" />
      <div className="relative">
        {/* RUO disclaimer band */}
        <div className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-2 text-brand-300">
              <FlaskConical size={18} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Research Use Only</span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-white/60">
              All products sold by {SITE.name} are intended strictly for in-vitro research, laboratory testing, and
              analytical purposes only. They are <strong className="text-white/80">not</strong> intended for human or
              animal consumption, medical use, therapeutic application, or diagnostic procedures of any kind. These
              statements have not been assessed by the MHRA or any other medicines regulator.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
            <div>
              <Logo variant="white" height={46} />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                UK-supplied research peptides and laboratory compounds, batch-tested for identity and purity. Every order
                ships from the UK with traceable documentation and a batch-matched Certificate of Analysis.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-white/70">
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="shrink-0 text-brand-400" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-white">
                    {SITE.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={15} className="mt-0.5 shrink-0 text-brand-400" />
                  <span>
                    {SITE.hours.days}, {SITE.hours.time}
                    <span className="mt-0.5 block text-[12.5px] text-white/45">
                      Orders placed after 18:00 on a Friday are processed the following Monday.
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand-400" />
                  <span>
                    {SITE.addressLine}
                    {SITE.companyNumber && (
                      <span className="mt-0.5 block text-[12.5px] text-white/45">
                        Company no. {SITE.companyNumber}
                      </span>
                    )}
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {cols.map((col) => (
                <div key={col.title}>
                  <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                    <span className="h-1 w-1 rounded-full bg-brand-500" />
                    {col.title}
                  </h4>
                  <ul className="mt-4 space-y-2.5 border-l border-white/10 pl-4">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-[13.5px] text-white/70 transition hover:text-brand-300">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter — batch alerts */}
          <div className="mt-14 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:p-9 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-xl font-bold">Get new batch alerts &amp; research notes.</h3>
              <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-white/60">
                Restock alerts, new product releases, and research-handling notes. No spam — unsubscribe anytime.
              </p>
            </div>
            <form className="flex flex-col gap-2.5 sm:flex-row">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@lab.co.uk"
                className="h-12 w-full rounded-full border border-white/15 bg-ink-950/60 px-5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand-500"
              />
              <button
                type="button"
                className="brand-gradient h-12 shrink-0 rounded-full px-7 text-sm font-bold text-white transition hover:brightness-110"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-[12px] text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>
              © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
              {SITE.companyNumber && <> · Registered in Scotland no. {SITE.companyNumber}</>}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/legal/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/legal/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/legal/regulatory-notice" className="hover:text-white">
                Regulatory Notice
              </Link>
              <Link href="/shipping" className="hover:text-white">
                Shipping
              </Link>
              <span className="text-white/30">Must be 18+ to purchase</span>
            </div>
          </div>
        </div>

        {/* Studio credit */}
        <div className="border-t border-white/10 bg-ink-950/60">
          <div className="mx-auto max-w-7xl px-5 py-4 text-center text-[11.5px] text-white/35 sm:px-8">
            Powered by <span className="font-semibold text-white/60">Eagle Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
