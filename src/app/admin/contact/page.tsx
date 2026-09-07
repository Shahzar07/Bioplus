import type { Metadata } from "next";
import { Mail, Inbox, Archive, MailOpen, AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { Panel, PanelHead } from "@/components/admin/ui";
import { setContactStatus } from "./actions";

export const metadata: Metadata = { title: "Contact enquiries" };

const TABS = [
  { key: "inbox", label: "Inbox", statuses: ["NEW", "READ"] as const },
  { key: "new", label: "Unread", statuses: ["NEW"] as const },
  { key: "archived", label: "Archived", statuses: ["ARCHIVED"] as const },
] as const;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireStaff("/admin/contact");
  const { tab } = await searchParams;
  const active = TABS.find((t) => t.key === tab) ?? TABS[0];

  const [messages, unread] = await Promise.all([
    db.contactMessage.findMany({
      where: { status: { in: [...active.statuses] } },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.contactMessage.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Contact enquiries</h1>
        <p className="mt-1 text-[13.5px] text-ink-600">
          Everything submitted through the website contact form. Each one is also emailed to the shop
          inbox — this is the record that cannot be lost.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <a
            key={t.key}
            href={`/admin/contact?tab=${t.key}`}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
              t.key === active.key
                ? "bg-ink-900 text-white"
                : "border border-line bg-white text-ink-700 hover:border-brand-400"
            }`}
          >
            {t.label}
            {t.key === "new" && unread > 0 && (
              <span className="ml-1.5 rounded-full bg-brand-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                {unread}
              </span>
            )}
          </a>
        ))}
      </div>

      {messages.length === 0 ? (
        <Panel>
          <div className="p-10 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mist text-ink-500">
              <Inbox size={22} />
            </span>
            <p className="font-display mt-3 text-base font-bold">Nothing here</p>
            <p className="mt-1 text-[13px] text-ink-600">
              {active.key === "archived"
                ? "No archived enquiries."
                : "No enquiries yet — they appear the moment someone uses the contact form."}
            </p>
          </div>
        </Panel>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Panel key={m.id}>
              <PanelHead
                title={`${m.firstName} ${m.lastName}`}
                subtitle={m.subject ?? "No subject"}
              />
              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(
                      m.subject ? `Re: ${m.subject}` : "Your enquiry — BioPlus Labs",
                    )}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
                  >
                    <Mail size={14} /> {m.email}
                  </a>
                  <span className="text-ink-500">
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(m.createdAt)}
                  </span>
                  {m.status === "NEW" && (
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700 ring-1 ring-brand-200">
                      Unread
                    </span>
                  )}
                  {!m.notified && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200"
                      title="The notification email did not send — the enquiry is safe here."
                    >
                      <AlertTriangle size={11} /> Not emailed
                    </span>
                  )}
                </div>

                <p className="whitespace-pre-wrap rounded-xl border border-line bg-mist px-4 py-3 text-[13.5px] leading-relaxed text-ink-800">
                  {m.message}
                </p>

                <div className="flex flex-wrap gap-2">
                  {m.status !== "READ" && (
                    <StatusButton id={m.id} status="READ" icon={<MailOpen size={14} />}>
                      Mark read
                    </StatusButton>
                  )}
                  {m.status === "READ" && (
                    <StatusButton id={m.id} status="NEW" icon={<Inbox size={14} />}>
                      Mark unread
                    </StatusButton>
                  )}
                  {m.status !== "ARCHIVED" ? (
                    <StatusButton id={m.id} status="ARCHIVED" icon={<Archive size={14} />}>
                      Archive
                    </StatusButton>
                  ) : (
                    <StatusButton id={m.id} status="READ" icon={<Inbox size={14} />}>
                      Restore
                    </StatusButton>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusButton({
  id,
  status,
  icon,
  children,
}: {
  id: string;
  status: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <form action={setContactStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
      >
        {icon}
        {children}
      </button>
    </form>
  );
}
