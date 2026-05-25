"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/icons";
import { RoleBadge } from "./RoleBadge";
import { cn } from "@/lib/cn";
import type { PublicUser } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  superadmin?: boolean;
}

const NAV: NavItem[] = [
  { href: "/agent/dashboard", label: "Dashboard", icon: "Dashboard" },
  { href: "/agent/properti/baru", label: "Tambah Properti", icon: "Plus", superadmin: true },
  { href: "/agent/admin", label: "Akun Admin", icon: "Users", superadmin: true },
  { href: "/agent/audit", label: "Audit Log", icon: "Scroll", superadmin: true },
];

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function PortalShell({
  user,
  children,
}: {
  user: PublicUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isSuper = user.role === "superadmin";
  const items = NAV.filter((n) => !n.superadmin || isSuper);

  const isActive = (href: string) =>
    href === "/agent/dashboard"
      ? pathname === href || pathname.startsWith("/agent/properti")
      : pathname.startsWith(href);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/agent/login");
      router.refresh();
    }
  };

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="border-b border-paper/10 px-6 py-6">
        <Link href="/agent/dashboard" aria-label="Prime Property">
          <Logo variant="full" tone="light" size="md" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Navigasi portal">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-paper/35">
          Menu
        </p>
        {items.map((item) => {
          const IconCmp = Icon[item.icon];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                active
                  ? "bg-paper/10 text-paper"
                  : "text-paper/60 hover:bg-paper/5 hover:text-paper/90"
              )}
            >
              <span className={cn(active ? "text-gold" : "text-paper/45 group-hover:text-gold/80")}>
                <IconCmp className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-paper/10 p-4">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-paper/55 transition-colors hover:bg-paper/5 hover:text-paper/90"
        >
          <Icon.External className="h-4 w-4" />
          Lihat situs publik
        </Link>
        <div className="rounded-xl bg-paper/5 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-paper">
                {user.name}
              </p>
              <p className="truncate text-xs text-paper/45">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <RoleBadge role={user.role} />
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper disabled:opacity-50"
            >
              <Icon.Logout className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-ink lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
        <Logo variant="full" tone="dark" size="sm" />
        <div className="flex items-center gap-2">
          <RoleBadge role={user.role} />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-mist"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="animate-fade absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="animate-drawer-in absolute inset-y-0 left-0 w-72 bg-ink">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md text-paper/70 hover:bg-paper/10"
            >
              <Icon.Close className="h-5 w-5" />
            </button>
            {SidebarInner}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
