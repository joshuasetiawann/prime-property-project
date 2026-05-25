import { NextRequest } from "next/server";
import {
  ERR,
  fail,
  ok,
  requireSuperadmin,
  requireUser,
  sameOrigin,
} from "@/lib/api";
import {
  getPropertyById,
  softDeleteProperty,
  updateProperty,
} from "@/lib/properties";
import {
  coercePropertyInput,
  hasErrors,
  validateProperty,
} from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/properties/:id — detail (any authenticated agent).
export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  const property = getPropertyById(id);
  if (!property) return ERR.notFound();
  return ok({ property });
}

// PATCH /api/properties/:id — update (superadmin only).
export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  const auth = await requireSuperadmin();
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  if (!getPropertyById(id)) return ERR.notFound();

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return fail("Format permintaan tidak valid.", 400);
  }

  const input = coercePropertyInput(raw);
  const errors = validateProperty(input);
  if (hasErrors(errors)) return ERR.badRequest(errors);

  const property = updateProperty(id, input, {
    name: auth.user.name,
    role: auth.user.role,
  });
  if (!property) return ERR.notFound();
  return ok({ property });
}

// DELETE /api/properties/:id — soft delete (superadmin only).
export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  const auth = await requireSuperadmin();
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  const okDeleted = softDeleteProperty(id, {
    name: auth.user.name,
    role: auth.user.role,
  });
  if (!okDeleted) return ERR.notFound();
  return ok({ ok: true });
}
