import { SiapBadge, StatusBadge, TipeBadge } from "@/components/ui/Badge";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { imageForProperty, resolvePropertyImage } from "@/lib/images";
import { Icon } from "@/components/icons";
import {
  formatArea,
  formatDateTime,
  formatHadap,
  formatMeter,
  formatRupiah,
} from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Property } from "@/lib/types";

function Fact({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("py-3", className)}>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-soft">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-ink">{children}</dd>
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="eyebrow mb-2">{title}</h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1 border-t border-line pt-1 sm:grid-cols-3">
        {children}
      </dl>
    </section>
  );
}

export function PropertyDetailView({ property }: { property: Property }) {
  return (
    <div className="space-y-8">
      {/* Image banner */}
      <div className="relative overflow-hidden rounded-xl border border-line">
        <PropertyImage
          src={resolvePropertyImage(property)}
          fallback={imageForProperty(property.tipe, property.id)}
          alt={property.nama_property}
          className="aspect-[16/9] w-full"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent"
          aria-hidden
        />
      </div>

      {/* Price + badges header */}
      <div className="rounded-xl border border-line bg-mist/40 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <TipeBadge tipe={property.tipe} />
          <StatusBadge status={property.status} />
          <SiapBadge siap={property.siap} />
        </div>
        <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-muted-soft">
          Harga
        </p>
        <p className="tnum mt-0.5 font-display text-3xl text-ink">
          {formatRupiah(property.price)}
        </p>
      </div>

      <Group title="Spesifikasi">
        <Fact label="Lebar">{formatMeter(property.lebar)} m</Fact>
        <Fact label="Panjang">{formatMeter(property.panjang)} m</Fact>
        <Fact label="Luas Tanah">
          {formatArea(property.lebar, property.panjang)}
        </Fact>
        <Fact label="Hadap">{formatHadap(property.hadap)}</Fact>
        <Fact label="Tingkat">{formatMeter(property.tingkat)} lantai</Fact>
        <Fact label="Carport">
          {property.carport ? (
            <span className="inline-flex items-center gap-1 text-stock-fg">
              <Icon.Check className="h-4 w-4" /> Ya
            </span>
          ) : (
            "Tidak"
          )}
        </Fact>
      </Group>

      <Group title="Lokasi & Klasifikasi">
        <Fact label="Group">{property.group ?? "—"}</Fact>
        <Fact label="Unit">{property.unit ?? "—"}</Fact>
        <Fact label="Tipe">{property.tipe === "ruko" ? "Ruko" : "Villa"}</Fact>
        <Fact label="Kawasan" className="col-span-2 sm:col-span-3">
          <div className="flex flex-wrap gap-1.5">
            {property.kawasan.map((k) => (
              <span
                key={k}
                className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-xs text-ink-soft"
              >
                {k}
              </span>
            ))}
          </div>
        </Fact>
      </Group>

      {property.maps_link && (
        <a
          href={property.maps_link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonClasses("subtle", "md"), "w-full sm:w-auto")}
        >
          <Icon.MapPin className="h-4 w-4 text-gold-deep" />
          Buka di Google Maps
          <Icon.External className="h-4 w-4" />
        </a>
      )}

      <Group title="Metadata">
        <Fact label="ID Properti">{property.id}</Fact>
        <Fact label="Dibuat oleh">{property.created_by}</Fact>
        <Fact label="Tanggal dibuat">{formatDateTime(property.created_at)}</Fact>
        <Fact label="Terakhir diperbarui" className="col-span-2 sm:col-span-3">
          {formatDateTime(property.updated_at)}
        </Fact>
      </Group>
    </div>
  );
}
