import { NextRequest } from "next/server";
import { fail, ok, requireSuperadmin, sameOrigin } from "@/lib/api";
import { resetAdminPassword, setAdminActive } from "@/lib/admins";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admins/:id — toggle active or reset password (superadmin only).
export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  const auth = await requireSuperadmin();
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  let raw: { action?: string; active?: boolean; password?: string };
  try {
    raw = await req.json();
  } catch {
    return fail("Format permintaan tidak valid.", 400);
  }

  const actor = { name: auth.user.name, role: auth.user.role };

  if (raw.action === "toggle") {
    const result = setAdminActive(id, Boolean(raw.active), actor);
    if (!result.ok) return fail(result.error, 422);
    return ok({ user: result.user });
  }

  if (raw.action === "reset_password") {
    const result = resetAdminPassword(id, String(raw.password ?? ""), actor);
    if (!result.ok) return fail(result.error, 422, { field: result.field });
    return ok({ user: result.user });
  }

  return fail("Aksi tidak dikenal.", 400);
}
