import { NextRequest } from "next/server";
import { fail, ok, sameOrigin } from "@/lib/api";
import { destroySession, getCurrentUserRecord } from "@/lib/auth";
import { recordAudit } from "@/lib/store";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Origin tidak valid.", 403);

  const user = await getCurrentUserRecord();
  if (user) {
    recordAudit({
      actor: user.name,
      actorRole: user.role,
      action: "logout",
      target: user.email,
      summary: `${user.name} keluar dari portal agen.`,
    });
  }

  await destroySession();
  return ok({ ok: true });
}
