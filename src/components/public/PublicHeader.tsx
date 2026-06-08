"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLink } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/properti", label: "Properti" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isDark = overlay && !scrolled && !menuOpen;
  const tone = isDark ? "light" : "dark";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isDark
          ? "bg-transparent"
          : "border-b border-line bg-paper/90 shadow-xs backdrop-blur-xl"
      )}
    >
      {/* legibility scrim over the dark hero */}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/30 to-transparent"
          aria-hidden
        />
      )}
      {/* hairline gold accent on solid header */}
      {!isDark && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      )}

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:gap-6 sm:px-8 lg:px-10">
        {/* Logo */}
        <div className="min-w-0 lg:hidden">
          <LogoLink tone={tone} size="sm" className="max-w-[13.5rem] sm:max-w-none" />
        </div>
        <div className="hidden lg:block">
          <LogoLink tone={tone} size="lg" />
        </div>

        {/* Center nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navigasi utama"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative rounded-md px-4 py-2.5 text-[15px] font-medium transition-colors duration-300",
                  isDark
                    ? "text-paper/90 hover:text-paper"
                    : "text-ink-soft hover:text-ink",
                  active && (isDark ? "text-paper" : "text-ink")
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-gold transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <Link
            href="/agent/login"
            className={cn(
              buttonClasses(isDark ? "outline-light" : "outline", "sm"),
              "hidden md:inline-flex"
            )}
          >
            Login Agent
          </Link>
          <Link
            href="/kontak"
            className={cn(
              buttonClasses("primary", "sm"),
              "hidden sm:inline-flex"
            )}
          >
            Hubungi Kami
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors sm:h-11 sm:w-11 lg:hidden",
              isDark
                ? "border-paper/20 text-paper hover:bg-paper/10"
                : "border-line text-ink hover:bg-mist"
            )}
          >
            {menuOpen ? (
              <Icon.Close className="h-5 w-5" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-fade border-t border-line bg-paper lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-8"
            aria-label="Navigasi seluler"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-3.5 text-[15px] font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-mist text-ink"
                    : "text-ink-soft hover:bg-mist"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                )}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2">
              <Link
                href="/agent/login"
                onClick={() => setMenuOpen(false)}
                className={buttonClasses("outline", "md")}
              >
                Login Agent
              </Link>
              <Link
                href="/kontak"
                onClick={() => setMenuOpen(false)}
                className={buttonClasses("primary", "md")}
              >
                Hubungi Kami
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
