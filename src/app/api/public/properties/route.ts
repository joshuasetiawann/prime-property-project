import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { listProperties } from "@/lib/properties";
import { parseListingQuery } from "@/lib/query";

// GET /api/public/properties — public marketplace listing (no auth).
// Returns only non-deleted properties (handled by the filter layer).
export async function GET(req: NextRequest) {
  const query = parseListingQuery(req.nextUrl.searchParams);
  const result = listProperties(query);
  return ok(result);
}
