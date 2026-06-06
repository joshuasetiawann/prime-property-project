import bcrypt from "bcryptjs";
import type { AuditEntry, Property, User } from "./types";
import { seedProperties } from "./properties-data";

// =========================================================================
// In-memory data store (demo backend).
//
// Persisted on `globalThis` so state survives Next.js HMR / module reloads
// within a running dev server. This is a stand-in for a real database —
// see README "Backend integration" for the production swap.
// =========================================================================

export interface Session {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

interface LoginAttempt {
  count: number;
  firstAt: number;
  lockedUntil: number | null;
}

interface Store {
  properties: Property[];
  users: User[];
  sessions: Map<string, Session>;
  audit: AuditEntry[];
  loginAttempts: Map<string, LoginAttempt>;
  seededAt: number;
}

const DEMO_PASSWORD = "Prime2026!";

function seedUsers(): User[] {
  const now = new Date().toISOString();
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);
  return [
    {
      id: "USR-001",
      name: "Sutan Pradana",
      email: "superadmin@primeproperty.id",
      role: "superadmin",
      active: true,
      passwordHash: hash(DEMO_PASSWORD),
      created_at: now,
      last_login_at: null,
    },
    {
      id: "USR-002",
      name: "Maya Lestari",
      email: "admin@primeproperty.id",
      role: "admin",
      active: true,
      passwordHash: hash(DEMO_PASSWORD),
      created_at: now,
      last_login_at: null,
    },
    {
      id: "USR-003",
      name: "Reza Anugrah",
      email: "reza@primeproperty.id",
      role: "admin",
      active: false,
      passwordHash: hash(DEMO_PASSWORD),
      created_at: now,
      last_login_at: null,
    },
  ];
}

function createStore(): Store {
  return {
    properties: seedProperties(),
    users: seedUsers(),
    sessions: new Map(),
    audit: [],
    loginAttempts: new Map(),
    seededAt: Date.now(),
  };
}

const globalRef = globalThis as unknown as { __primeStore?: Store };

export function getStore(): Store {
  if (!globalRef.__primeStore) {
    globalRef.__primeStore = createStore();
  }
  return globalRef.__primeStore;
}

export const DEMO_CREDENTIALS = {
  superadmin: { email: "superadmin@primeproperty.id", password: DEMO_PASSWORD },
  admin: { email: "admin@primeproperty.id", password: DEMO_PASSWORD },
};

// — Audit helpers —

export function recordAudit(entry: Omit<AuditEntry, "id" | "timestamp">): void {
  const store = getStore();
  store.audit.unshift({
    ...entry,
    id: `AUD-${crypto.randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
  });
  // Keep the log bounded.
  if (store.audit.length > 500) store.audit.length = 500;
}
