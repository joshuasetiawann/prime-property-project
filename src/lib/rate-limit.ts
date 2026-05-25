import type { NextRequest } from "next/server";

// =========================================================================
// Tiny in-memory sliding-window rate limiter (demo).
// Keyed by an arbitrary bucket string (e.g. `auth:1.2.3.4`).
// =========================================================================

const globalRef = globalThis as unknown as {
  __primeRate?: Map<string, number[]>;
};

function buckets(): Map<string, number[]> {
  if (!globalRef.__primeRate) globalRef.__primeRate = new Map();
  return globalRef.__primeRate;
}

export interface RateResult {
  ok: boolean;
  retryAfterSec: number;
  remaining: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateResult {
  const now = Date.now();
  const map = buckets();
  const hits = (map.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    map.set(key, hits);
    const retryAfterSec = Math.ceil((windowMs - (now - hits[0])) / 1000);
    return { ok: false, retryAfterSec, remaining: 0 };
  }

  hits.push(now);
  map.set(key, hits);
  return { ok: true, retryAfterSec: 0, remaining: limit - hits.length };
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "127.0.0.1";
}
