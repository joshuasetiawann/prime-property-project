import { ok, requireSuperadmin } from "@/lib/api";
import { getStore } from "@/lib/store";

// GET /api/audit — change log (superadmin only, AC-5.2).
export async function GET() {
  const auth = await requireSuperadmin();
  if ("response" in auth) return auth.response;

  return ok({ entries: getStore().audit.slice(0, 100) });
}
