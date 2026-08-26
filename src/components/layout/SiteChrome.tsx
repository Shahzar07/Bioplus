"use client";

import { usePathname } from "next/navigation";

/**
 * The storefront's shell — announcement bar, header, footer, cart drawer and
 * the age gate — around every page except the dashboard.
 *
 * /admin has its own sidebar layout and is staff-only, so the shop chrome is
 * noise there (and the age gate is meaningless to someone already signed in).
 * The header and footer are rendered on the server and passed in, so the only
 * thing this needs the client for is the current path.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === "/admin" || pathname.startsWith("/admin/");

  // The dashboard layout supplies its own <main>; wrapping it in another one
  // here would nest them.
  if (isDashboard) return <>{children}</>;

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
