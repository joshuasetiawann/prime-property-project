import bcrypt from "bcryptjs";
import { getStore, recordAudit } from "./store";
import { toPublicUser } from "./auth";
import type { PublicUser, Role, User } from "./types";

// =========================================================================
// Admin account management (superadmin only — gated in the API layer).
// =========================================================================

interface Actor {
  name: string;
  role: Role;
}

export function listUsers(): PublicUser[] {
  return getStore()
    .users.slice()
    .sort((a, b) => a.name.localeCompare(b.name, "id"))
    .map(toPublicUser);
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
}

export type AdminResult =
  | { ok: true; user: PublicUser }
  | { ok: false; error: string; field?: string };

export function createAdmin(input: CreateAdminInput, actor: Actor): AdminResult {
  const store = getStore();
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (name.length < 2) return { ok: false, error: "Nama wajib diisi.", field: "name" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Email tidak valid.", field: "email" };
  if (store.users.some((u) => u.email.toLowerCase() === email))
    return { ok: false, error: "Email sudah terdaftar.", field: "email" };
  if (input.password.length < 8)
    return { ok: false, error: "Password minimal 8 karakter.", field: "password" };

  const user: User = {
    id: `USR-${String(store.users.length + 1).padStart(3, "0")}`,
    name,
    email,
    role: "admin",
    active: true,
    passwordHash: bcrypt.hashSync(input.password, 10),
    created_at: new Date().toISOString(),
    last_login_at: null,
  };
  store.users.push(user);

  recordAudit({
    actor: actor.name,
    actorRole: actor.role,
    action: "create_admin",
    target: user.name,
    summary: `Membuat akun admin baru: ${user.name} (${user.email}).`,
  });

  return { ok: true, user: toPublicUser(user) };
}

export function setAdminActive(
  id: string,
  active: boolean,
  actor: Actor
): AdminResult {
  const store = getStore();
  const user = store.users.find((u) => u.id === id);
  if (!user) return { ok: false, error: "Akun tidak ditemukan." };
  if (user.role === "superadmin")
    return { ok: false, error: "Akun superadmin tidak dapat dinonaktifkan." };

  user.active = active;
  recordAudit({
    actor: actor.name,
    actorRole: actor.role,
    action: "toggle_admin",
    target: user.name,
    summary: `${active ? "Mengaktifkan" : "Menonaktifkan"} akun admin ${user.name}.`,
  });
  return { ok: true, user: toPublicUser(user) };
}

export function resetAdminPassword(
  id: string,
  newPassword: string,
  actor: Actor
): AdminResult {
  const store = getStore();
  const user = store.users.find((u) => u.id === id);
  if (!user) return { ok: false, error: "Akun tidak ditemukan." };
  if (newPassword.length < 8)
    return { ok: false, error: "Password minimal 8 karakter.", field: "password" };

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  recordAudit({
    actor: actor.name,
    actorRole: actor.role,
    action: "reset_password",
    target: user.name,
    summary: `Mereset password akun admin ${user.name}.`,
  });
  return { ok: true, user: toPublicUser(user) };
}
