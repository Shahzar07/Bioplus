import { PanelHeader, ACCOUNT_USER } from "@/components/account/AccountShell";

function DarkField({ label, defaultValue, type = "text", placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-white/70">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-brand-400"
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PanelHeader title="Account Settings" subtitle="Update your account details and password." />

      <form className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-base font-bold text-white">Account details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <DarkField label="First name" defaultValue="Darryll" />
          <DarkField label="Last name" defaultValue="Whaley" />
          <DarkField label="Display name" defaultValue={ACCOUNT_USER.username} />
          <DarkField label="Email address" type="email" defaultValue={ACCOUNT_USER.email} />
        </div>

        <h2 className="font-display mt-8 text-base font-bold text-white">Password</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <DarkField label="Current password" type="password" placeholder="••••••••" />
          <div className="hidden sm:block" />
          <DarkField label="New password" type="password" placeholder="••••••••" />
          <DarkField label="Confirm new password" type="password" placeholder="••••••••" />
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            className="brand-gradient h-11 rounded-full px-7 text-sm font-bold text-white transition hover:brightness-110"
          >
            Save changes
          </button>
          <button
            type="reset"
            className="h-11 rounded-full border border-white/15 px-7 text-sm font-semibold text-white/70 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
