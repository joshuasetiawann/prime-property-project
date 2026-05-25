import { NextRequest } from "next/server";
import { ERR, fail, ok, requireSuperadmin, requireUser, sameOrigin } from "@/lib/api";
import { createProperty, listProperties } from "@/lib/properties";
import { parseListingQuery } from "@/lib/query";
import { coercePropertyInput, validateProperty, hasErrors } from "@/lib/validation";

// GET /api/properties — list (any authenticated agent).
export async function GET(req: NextRequest) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;

  const query = parseListingQuery(req.nextUrl.searchParams);
  const result = listProperties(query);
  return ok(result);
}

// POST /api/properties — create (superadmin only → 403 for admin).
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  const auth = await requireSuperadmin();
  if ("response" in auth) return auth.response;

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return fail("Format permintaan tidak valid.", 400);
  }

  const input = coercePropertyInput(raw);
  const errors = validateProperty(input);
  if (hasErrors(errors)) return ERR.badRequest(errors);

  const property = createProperty(input, {
    name: auth.user.name,
    role: auth.user.role,
  });
  return ok({ property }, { status: 201 });
}
