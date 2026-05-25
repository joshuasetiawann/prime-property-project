import { NextRequest } from "next/server";
import { ERR, fail, ok, sameOrigin } from "@/lib/api";
import { validateContact, hasErrors, type ContactInput } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// POST /api/contact — public contact form.
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  // AC-4.2 — anti-spam: 3 submit / IP / hour.
  const limit = rateLimit(`contact:${clientIp(req)}`, 3, 60 * 60_000);
  if (!limit.ok) return ERR.rateLimited(limit.retryAfterSec);

  let raw: Partial<ContactInput>;
  try {
    raw = await req.json();
  } catch {
    return fail("Format permintaan tidak valid.", 400);
  }

  const input: Partial<ContactInput> = {
    nama: typeof raw.nama === "string" ? raw.nama : "",
    email: typeof raw.email === "string" ? raw.email : "",
    nomor_hp: typeof raw.nomor_hp === "string" ? raw.nomor_hp : "",
    pesan: typeof raw.pesan === "string" ? raw.pesan : "",
  };

  const errors = validateContact(input);
  if (hasErrors(errors)) return ERR.badRequest(errors);

  // In production this dispatches a notification email to the Prime Property
  // admin inbox. Here we acknowledge receipt (demo backend).
  console.info(
    `[contact] Pesan baru dari ${input.nama} <${input.email}> (${input.nomor_hp})`
  );

  return ok({ ok: true });
}
