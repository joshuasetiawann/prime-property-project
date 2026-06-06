import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPropertyById } from "@/lib/properties";
import { PropertyDetailView } from "@/components/portal/PropertyDetailView";
import { PropertyDetailActions } from "@/components/portal/PropertyDetailActions";
import { Icon } from "@/components/icons";
import { TIPE_LABEL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyById(id);
  return { title: property ? property.nama_property : "Detail Properti" };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, property] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(getPropertyById(id)),
  ]);

  if (!property) notFound();
  const isSuper = user?.role === "superadmin";

  return (
    <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
      <Link
        href="/agent/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <Icon.ChevronLeft className="h-4 w-4" />
        Kembali ke daftar
      </Link>

      <div className="mt-5 flex flex-col justify-between gap-4 border-b border-line pb-7 sm:flex-row sm:items-start">
        <div>
          <span className="eyebrow">{TIPE_LABEL[property.tipe]}</span>
          <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {property.nama_property}
          </h1>
          <p className="mt-1.5 text-sm text-muted-soft">
            {property.id}
            {property.group ? ` · ${property.group}` : ""}
          </p>
        </div>

        {isSuper ? (
          <PropertyDetailActions
            property={{ id: property.id, nama_property: property.nama_property }}
          />
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-mist px-3 py-2 text-xs text-muted">
            <Icon.Shield className="h-4 w-4" />
            Mode lihat saja
          </span>
        )}
      </div>

      <div className="mt-8">
        <PropertyDetailView property={property} />
      </div>
    </div>
  );
}
