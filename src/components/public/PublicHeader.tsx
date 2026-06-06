"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLink } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    // Defer the initial read so we don't setState synchronously in the effect.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Transparent over the dark hero only while at the top.
  const isDark = overlay && !scrolled;
  const tone = isDark ? "light" : "dark";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isDark
          ? "bg-transparent"
          : "border-b border-line bg-paper/85 shadow-xs backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <LogoLink tone={tone} size="md" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                isDark
                  ? "text-paper/85 hover:text-paper"
                  : "text-ink-soft hover:text-ink",
                isActive(item.href) &&
                  (isDark ? "text-paper" : "text-ink")
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3.5 -bottom-px h-px bg-gold" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/agent/login"
            className={cn(
              buttonClasses(isDark ? "outline-light" : "outline", "sm"),
              "hidden sm:inline-flex"
            )}
          >
            Login Agent
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Buka menu"
            aria-expanded={menuOpen}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors md:hidden",
              isDark ? "text-paper hover:bg-paper/10" : "text-ink hover:bg-mist"
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-fade border-t border-line bg-paper md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8" aria-label="Navigasi seluler">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-[15px] font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-mist text-ink"
                    : "text-ink-soft hover:bg-mist"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/agent/login"
              onClick={() => setMenuOpen(false)}
              className={cn(buttonClasses("dark", "md"), "mt-2 w-full")}
            >
              Login Agent
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
