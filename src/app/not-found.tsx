import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="grain relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-paper">
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative">
        <Logo variant="stacked" tone="light" size="lg" />
        <p className="eyebrow eyebrow-light mt-10">Error 404</p>
        <h1 className="mt-3 font-display text-5xl text-paper sm:text-6xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-4 max-w-md text-paper/60">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonClasses("primary", "lg")}>
            <Icon.ChevronLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link href="/kontak" className={buttonClasses("outline-light", "lg")}>
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
}
