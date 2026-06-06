import { NextRequest } from "next/server";
import { ERR, fail, ok, sameOrigin } from "@/lib/api";
import {
  clearLoginAttempts,
  findUserByEmail,
  getLockout,
  registerFailedLogin,
  startSession,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";
import { recordAudit } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  // AC-9.2 — 10 req/min/IP on auth endpoints.
  const ipLimit = rateLimit(`auth:${clientIp(req)}`, 10, 60_000);
  if (!ipLimit.ok) return ERR.rateLimited(ipLimit.retryAfterSec);

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return fail("Format permintaan tidak valid.", 400);
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!email || !password) {
    return fail("Email dan password wajib diisi.", 400);
  }

  // AC-5.1 — lockout after repeated failures.
  const lock = getLockout(email);
  if (lock.locked) {
    return fail(
      `Akun terkunci sementara. Coba lagi dalam ${Math.ceil(
        lock.retryAfterSec / 60
      )} menit.`,
      423,
      { retryAfterSec: lock.retryAfterSec }
    );
  }

  const user = findUserByEmail(email);
  const valid = user && user.active && verifyPassword(user, password);

  if (!valid) {
    const after = registerFailedLogin(email);
    const msg = after.locked
      ? "Terlalu banyak percobaan gagal. Akun terkunci selama 15 menit."
      : "Email atau password salah.";
    return fail(msg, 401, { remainingAttempts: after.remainingAttempts });
  }

  clearLoginAttempts(email);
  user.last_login_at = new Date().toISOString();
  await startSession(user.id);

  recordAudit({
    actor: user.name,
    actorRole: user.role,
    action: "login",
    target: user.email,
    summary: `${user.name} masuk ke portal agen.`,
  });

  return ok({ user: toPublicUser(user) });
}
