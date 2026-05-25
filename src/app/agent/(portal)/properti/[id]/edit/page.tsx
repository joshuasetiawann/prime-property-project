import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPropertyById } from "@/lib/properties";
import { PropertyForm } from "@/components/portal/PropertyForm";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Edit Properti" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") redirect("/agent/dashboard");

  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
      <Link
        href={`/agent/properti/${property.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <Icon.ChevronLeft className="h-4 w-4" />
        Kembali ke detail
      </Link>

      <div className="mb-8 mt-5">
        <span className="eyebrow">Edit Properti</span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          {property.nama_property}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Perubahan akan dicatat pada audit log.
        </p>
      </div>

      <PropertyForm mode="edit" property={property} />
    </div>
  );
}
