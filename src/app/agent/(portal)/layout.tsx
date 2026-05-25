import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { getCurrentUser } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full server-side session validation (the cookie-presence check in
  // middleware is only the first gate).
  const user = await getCurrentUser();
  if (!user) redirect("/agent/login");

  return <PortalShell user={user}>{children}</PortalShell>;
}
