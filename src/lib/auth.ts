import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getStore } from "./store";
import type { PublicUser, Role, User } from "./types";

// =========================================================================
// Authentication & session management (server-side, Node runtime).
// Sessions are httpOnly cookies backed by the in-memory session store.
// =========================================================================

export const SESSION_COOKIE = "pp_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Lockout policy (AC-5.1)
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function toPublicUser(user: User): PublicUser {
  const { id, name, email, role, active, created_at, last_login_at } = user;
  return { id, name, email, role, active, created_at, last_login_at };
}

export function verifyPassword(user: User, password: string): boolean {
  return bcrypt.compareSync(password, user.passwordHash);
}

export function findUserByEmail(email: string): User | undefined {
  const store = getStore();
  const lower = email.trim().toLowerCase();
  return store.users.find((u) => u.email.toLowerCase() === lower);
}

// — Lockout —

export interface LockoutState {
  locked: boolean;
  retryAfterSec: number;
  remainingAttempts: number;
}

export function getLockout(email: string): LockoutState {
  const store = getStore();
  const key = email.trim().toLowerCase();
  const rec = store.loginAttempts.get(key);
  const now = Date.now();
  if (!rec) return { locked: false, retryAfterSec: 0, remainingAttempts: MAX_ATTEMPTS };
  if (rec.lockedUntil && rec.lockedUntil > now) {
    return {
      locked: true,
      retryAfterSec: Math.ceil((rec.lockedUntil - now) / 1000),
      remainingAttempts: 0,
    };
  }
  // Window expired → treat as reset.
  if (now - rec.firstAt > ATTEMPT_WINDOW_MS) {
    return { locked: false, retryAfterSec: 0, remainingAttempts: MAX_ATTEMPTS };
  }
  return {
    locked: false,
    retryAfterSec: 0,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - rec.count),
  };
}

export function registerFailedLogin(email: string): LockoutState {
  const store = getStore();
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const rec = store.loginAttempts.get(key);

  if (!rec || now - rec.firstAt > ATTEMPT_WINDOW_MS) {
    store.loginAttempts.set(key, { count: 1, firstAt: now, lockedUntil: null });
    return { locked: false, retryAfterSec: 0, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCKOUT_MS;
    store.loginAttempts.set(key, rec);
    return {
      locked: true,
      retryAfterSec: Math.ceil(LOCKOUT_MS / 1000),
      remainingAttempts: 0,
    };
  }
  store.loginAttempts.set(key, rec);
  return {
    locked: false,
    retryAfterSec: 0,
    remainingAttempts: MAX_ATTEMPTS - rec.count,
  };
}

export function clearLoginAttempts(email: string): void {
  getStore().loginAttempts.delete(email.trim().toLowerCase());
}

// — Sessions —

export async function startSession(userId: string): Promise<void> {
  const store = getStore();
  const token = crypto.randomUUID();
  const now = Date.now();
  store.sessions.set(token, {
    token,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function destroySession(): Promise<void> {
  const store = getStore();
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) store.sessions.delete(token);
  jar.delete(SESSION_COOKIE);
}

/** Resolves the current authenticated user (full record), or null. */
export async function getCurrentUserRecord(): Promise<User | null> {
  const store = getStore();
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = store.sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    store.sessions.delete(token);
    return null;
  }

  const user = store.users.find((u) => u.id === session.userId);
  if (!user || !user.active) return null;
  return user;
}

/** Public-safe current user for UI. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const user = await getCurrentUserRecord();
  return user ? toPublicUser(user) : null;
}

export function hasRole(
  user: { role: Role } | null,
  role: Role
): boolean {
  return user?.role === role;
}

export function isSuperadmin(user: { role: Role } | null): boolean {
  return user?.role === "superadmin";
}
