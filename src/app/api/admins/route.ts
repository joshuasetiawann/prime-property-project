import { NextRequest } from "next/server";
import { fail, ok, requireSuperadmin, sameOrigin } from "@/lib/api";
import { createAdmin, listUsers } from "@/lib/admins";

// GET /api/admins — list accounts (superadmin only).
export async function GET() {
  const auth = await requireSuperadmin();
  if ("response" in auth) return auth.response;
  return ok({ users: listUsers() });
}

// POST /api/admins — create admin account (superadmin only).
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  const auth = await requireSuperadmin();
  if ("response" in auth) return auth.response;

  let raw: { name?: string; email?: string; password?: string };
  try {
    raw = await req.json();
  } catch {
    return fail("Format permintaan tidak valid.", 400);
  }

  const result = createAdmin(
    {
      name: String(raw.name ?? ""),
      email: String(raw.email ?? ""),
      password: String(raw.password ?? ""),
    },
    { name: auth.user.name, role: auth.user.role }
  );

  if (!result.ok)
    return fail(result.error, 422, { field: result.field });
  return ok({ user: result.user }, { status: 201 });
}
