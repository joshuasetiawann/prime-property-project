"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

/**
 * Elegant first-load splash. Renders by default (SSR-consistent), then fades
 * out. Shown once per browser session via sessionStorage so it never nags on
 * repeat navigation. All state changes run in timers to stay render-safe.
 */
export function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("pp_splash");
    try {
      window.sessionStorage.setItem("pp_splash", "1");
    } catch {
      /* ignore */
    }
    const hold = seen ? 0 : 1250;
    const t1 = setTimeout(() => setHiding(true), hold);
    const t2 = setTimeout(() => setShow(false), hold + 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "grain fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink transition-opacity duration-[650ms] ease-out",
        hiding ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl"
        style={{ animation: "prime-glow 2.4s ease-in-out infinite" }}
      />
      <div className="relative flex flex-col items-center">
        <div className="animate-scale-in">
          <Logo variant="stacked" tone="light" size="xl" />
        </div>
        <div className="mt-9 h-px w-44 overflow-hidden bg-paper/15">
          <div
            className="h-full origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-bright"
            style={{
              animation: "prime-load 1.25s var(--ease-out-soft) forwards",
            }}
          />
        </div>
        <p className="animate-fade mt-5 text-sm tracking-wide text-paper/55">
          Mempersiapkan properti terbaik untuk Anda
        </p>
      </div>
    </div>
  );
}
