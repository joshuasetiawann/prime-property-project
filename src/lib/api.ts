import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserRecord } from "./auth";
import type { User } from "./types";

// =========================================================================
// API helpers — consistent JSON envelopes, auth/role guards, CSRF check.
// =========================================================================

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status: number, extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export const ERR = {
  unauthorized: () => fail("Tidak terautentikasi.", 401),
  forbidden: () =>
    fail("Akses ditolak. Hanya superadmin yang diizinkan.", 403),
  notFound: () => fail("Data tidak ditemukan.", 404),
  badRequest: (errors: Record<string, string>) =>
    fail("Validasi gagal.", 422, { errors }),
  rateLimited: (retryAfterSec: number) =>
    fail("Terlalu banyak permintaan. Coba lagi nanti.", 429, {
      retryAfterSec,
    }),
};

/**
 * Lightweight CSRF defense: for state-changing requests, the Origin header
 * (when present) must match the request Host. Combined with SameSite=Lax
 * cookies this blocks cross-site form/fetch mutations.
 */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-CORS / same-origin navigations
  try {
    const o = new URL(origin);
    const host = req.headers.get("host");
    return o.host === host;
  } catch {
    return false;
  }
}

/** Returns the authenticated user record, or null. */
export async function currentUser(): Promise<User | null> {
  return getCurrentUserRecord();
}

/**
 * Guard for mutating endpoints restricted to superadmin.
 * Returns either `{ user }` or a ready-to-return error Response
 * (401 if unauthenticated, 403 if authenticated but not superadmin).
 *
 * This is the BACKEND authorization gate (AC-5.2): the UI hiding buttons is
 * not the only protection — admins hitting these endpoints get a real 403.
 */
export async function requireSuperadmin(): Promise<
  { user: User } | { response: NextResponse }
> {
  const user = await currentUser();
  if (!user) return { response: ERR.unauthorized() };
  if (user.role !== "superadmin") return { response: ERR.forbidden() };
  return { user };
}

export async function requireUser(): Promise<
  { user: User } | { response: NextResponse }
> {
  const user = await currentUser();
  if (!user) return { response: ERR.unauthorized() };
  return { user };
}
