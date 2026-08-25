import { PanelHeader } from "@/components/account/AccountShell";
import { DarkField, DarkForm } from "@/components/account/DarkForm";
import { requireUser } from "@/lib/auth";
import { updatePassword, updateProfile } from "../actions";

export default async function SettingsPage() {
  const user = await requireUser("/account/settings");

  return (
    <div className="space-y-6">
      <PanelHeader title="Account Settings" subtitle="Update your account details and password." />

      <DarkForm action={updateProfile} title="Account details">
        <div className="grid gap-4 sm:grid-cols-2">
          <DarkField label="Name" name="name" defaultValue={user.name ?? ""} required />
          <DarkField
            label="Email address"
            name="email"
            type="email"
            defaultValue={user.email}
            required
          />
          <DarkField label="Phone (optional)" name="phone" type="tel" defaultValue={user.phone ?? ""} />
          <DarkField
            label="Institution / Lab (optional)"
            name="organisation"
            defaultValue={user.organisation ?? ""}
          />
        </div>
      </DarkForm>

      <DarkForm action={updatePassword} title="Password" submitLabel="Update password">
        <div className="grid gap-4 sm:grid-cols-2">
          <DarkField
            label="Current password"
            name="current"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
          <div className="hidden sm:block" />
          <DarkField
            label="New password"
            name="next"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            hint="At least 10 characters."
            required
          />
          <DarkField
            label="Confirm new password"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
          />
        </div>
      </DarkForm>
    </div>
  );
}
