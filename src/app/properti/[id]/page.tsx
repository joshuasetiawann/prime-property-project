import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/PublicShell";
import { Container } from "@/components/ui/Container";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { PropertyShowcaseCard } from "@/components/public/PropertyShowcaseCard";
import { SiapBadge, StatusBadge, TipeBadge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import { getPropertyById, getRelatedProperties } from "@/lib/properties";
import { imageForProperty, resolvePropertyImage } from "@/lib/images";
import {
  formatArea,
  formatDimensions,
  formatHadap,
  formatMeter,
  formatRupiah,
} from "@/lib/format";
import { TIPE_LABEL } from "@/lib/constants";
import type { Property } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = getPropertyById(id);
  return {
    title: p ? `${p.nama_property} — ${formatRupiah(p.price)}` : "Properti",
    description: p
      ? `${TIPE_LABEL[p.tipe]} di ${p.kawasan.join(", ")} · ${formatDimensions(
          p.lebar,
          p.panjang
        )} · ${formatRupiah(p.price)}`
      : undefined,
  };
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-line py-3">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-soft">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export default async function PublicPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property: Property | null = getPropertyById(id);
  if (!property) notFound();

  const related = getRelatedProperties(property, 3);
  const contactHref = `/kontak?properti=${encodeURIComponent(
    property.nama_property
  )}`;

  return (
    <PublicShell>
      <div className="bg-mist/30">
        <Container size="wide" className="pb-16 pt-24 sm:pt-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-ink">
              Beranda
            </Link>
            <Icon.ChevronRight className="h-3.5 w-3.5 text-muted-soft" />
            <Link href="/properti" className="transition-colors hover:text-ink">
              Properti
            </Link>
            <Icon.ChevronRight className="h-3.5 w-3.5 text-muted-soft" />
            <span className="truncate text-ink-soft">
              {property.nama_property}
            </span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
            {/* Left — image + details */}
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <PropertyImage
                  src={resolvePropertyImage(property)}
                  fallback={imageForProperty(property.tipe, property.id)}
                  alt={property.nama_property}
                  eager
                  className="aspect-[16/10] w-full"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent"
                  aria-hidden
                />
                <div className="absolute left-4 top-4 flex gap-2">
                  <StatusBadge status={property.status} className="shadow-sm" />
                  <span className="rounded-full border border-paper/25 bg-ink/55 px-2.5 py-0.5 text-xs font-medium text-paper backdrop-blur-sm">
                    {TIPE_LABEL[property.tipe]}
                  </span>
                </div>
              </div>

              {/* Full details */}
              <div className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-8">
                <h2 className="font-display text-2xl text-ink">
                  Detail Properti
                </h2>
                <dl className="mt-4 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
                  <Fact label="Nama Properti" value={property.nama_property} />
                  <Fact label="Group" value={property.group ?? "—"} />
                  <Fact label="Tipe" value={TIPE_LABEL[property.tipe]} />
                  <Fact
                    label="Lebar × Panjang"
                    value={formatDimensions(property.lebar, property.panjang)}
                  />
                  <Fact
                    label="Luas Tanah"
                    value={formatArea(property.lebar, property.panjang)}
                  />
                  <Fact
                    label="Tingkat"
                    value={`${formatMeter(property.tingkat)} lantai`}
                  />
                  <Fact label="Hadap" value={formatHadap(property.hadap)} />
                  <Fact
                    label="Carport"
                    value={property.carport ? "Ya" : "Tidak"}
                  />
                  <Fact label="Unit" value={property.unit ?? "—"} />
                  <Fact
                    label="Status"
                    value={<StatusBadge status={property.status} />}
                  />
                  <Fact
                    label="Siap"
                    value={<SiapBadge siap={property.siap} />}
                  />
                  <Fact
                    label="Kawasan"
                    value={property.kawasan.join(", ")}
                  />
                </dl>
              </div>
            </div>

            {/* Right — price / info card (sticky) */}
            <div>
              <div className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
                  <div className="border-b border-line bg-ink p-6 text-paper">
                    <div className="flex flex-wrap items-center gap-2">
                      <TipeBadge tipe={property.tipe} />
                      <SiapBadge siap={property.siap} />
                    </div>
                    <h1 className="mt-3 font-display text-2xl leading-tight">
                      {property.nama_property}
                    </h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-paper/70">
                      <Icon.MapPin className="h-4 w-4 text-gold-bright" />
                      {property.kawasan.join(", ")}
                    </p>
                  </div>

                  <div className="p-6">
                    <p className="eyebrow">Informasi Harga</p>
                    <p className="tnum mt-1.5 font-display text-4xl text-ink">
                      {formatRupiah(property.price)}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Harga dapat dinegosiasikan. Hubungi agen kami untuk
                      penawaran terbaik dan ketersediaan terkini.
                    </p>

                    <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-mist/60 p-4 text-center">
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-soft">
                          Dimensi
                        </dt>
                        <dd className="tnum mt-0.5 text-sm font-semibold text-ink">
                          {formatDimensions(property.lebar, property.panjang)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-soft">
                          Luas Tanah
                        </dt>
                        <dd className="tnum mt-0.5 text-sm font-semibold text-ink">
                          {formatArea(property.lebar, property.panjang)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-soft">
                          Tingkat
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">
                          {formatMeter(property.tingkat)} lantai
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-soft">
                          Carport
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">
                          {property.carport ? "Ya" : "Tidak"}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 space-y-2.5">
                      <Link
                        href={contactHref}
                        className={buttonClasses("primary", "lg") + " w-full"}
                      >
                        <Icon.WhatsApp className="h-4 w-4" />
                        Hubungi Agent
                      </Link>
                      {property.maps_link && (
                        <a
                          href={property.maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            buttonClasses("subtle", "lg") + " w-full"
                          }
                        >
                          <Icon.MapPin className="h-4 w-4 text-gold-deep" />
                          Buka di Google Maps
                          <Icon.External className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-soft">
                      <Icon.ShieldCheck className="h-4 w-4 text-stock-fg" />
                      Legalitas terverifikasi oleh Prime Property
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-paper py-16 lg:py-20">
          <Container size="wide">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">
              Properti serupa
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Pilihan lain yang mungkin Anda sukai.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyShowcaseCard key={p.id} property={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </PublicShell>
  );
}
