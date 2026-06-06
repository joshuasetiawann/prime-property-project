import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PropertyForm } from "@/components/portal/PropertyForm";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Tambah Properti" };

export default async function CreatePropertyPage() {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") redirect("/agent/dashboard");

  return (
    <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
      <Link
        href="/agent/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <Icon.ChevronLeft className="h-4 w-4" />
        Kembali ke daftar
      </Link>

      <div className="mb-8 mt-5">
        <span className="eyebrow">Properti Baru</span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Tambah Properti
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Lengkapi detail properti. Kolom bertanda{" "}
          <span className="text-crimson">*</span> wajib diisi.
        </p>
      </div>

      <PropertyForm mode="create" />
    </div>
  );
}
