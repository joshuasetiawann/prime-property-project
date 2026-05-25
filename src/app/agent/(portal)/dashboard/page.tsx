import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { listProperties } from "@/lib/properties";
import { parseListingQuery } from "@/lib/query";
import { PropertyDashboard } from "@/components/portal/PropertyDashboard";

export const metadata: Metadata = { title: "Dashboard Properti" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  const sp = await searchParams;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  const query = parseListingQuery(params);
  const result = listProperties(query);

  return (
    <PropertyDashboard
      role={user!.role}
      initialQuery={query}
      initialResult={result}
    />
  );
}
