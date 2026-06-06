import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Logomark } from "@/components/brand/Logomark";
import { LoginForm } from "@/components/portal/LoginForm";
import { Icon } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login Agen",
  description: "Portal internal agen Prime Property.",
  robots: { index: false, follow: false },
};

const POINTS = [
  "Kelola katalog properti dengan cepat dan akurat",
  "Filter & pencarian bertenaga untuk ribuan listing",
  "Kontrol akses berbasis peran yang aman",
];

export default async function AgentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/agent/dashboard");
  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="grain relative isolate hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex">
        <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
        <div
          className="absolute -bottom-16 -right-16 opacity-[0.06]"
          aria-hidden
        >
          <Logomark tone="light" height={460} />
        </div>

        <div className="relative">
          <Logo variant="full" tone="light" size="lg" />
        </div>

        <div className="relative max-w-md">
          <div className="mb-6 flex items-center gap-3">
            <span className="gold-rule-left" aria-hidden />
            <span className="eyebrow eyebrow-light">Portal Agen Internal</span>
          </div>
          <h1 className="font-display text-4xl leading-tight text-paper">
            Ruang kerja tepercaya untuk tim Prime Property.
          </h1>
          <ul className="mt-8 space-y-3.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-paper/75">
                <span className="mt-0.5 text-gold">
                  <Icon.Check className="h-5 w-5" />
                </span>
                <span className="text-[15px] leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-paper/40">
          © 2026 Prime Property. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-paper">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10">
          <div className="lg:hidden">
            <Logo variant="full" tone="dark" size="sm" />
          </div>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <Icon.ChevronLeft className="h-4 w-4" />
            Kembali ke beranda
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-gold">
                <Icon.Shield className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-3xl text-ink">
                Masuk ke Portal
              </h2>
              <p className="mt-2 text-sm text-muted">
                Gunakan kredensial agen Anda. Akun dibuat oleh superadmin—tidak
                ada pendaftaran mandiri.
              </p>
            </div>
            <LoginForm next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}
