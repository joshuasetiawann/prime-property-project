import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { Icon } from "@/components/icons";
import {
  formatDimensions,
  formatHadap,
  formatRupiah,
  formatTingkat,
} from "@/lib/format";
import { TIPE_LABEL } from "@/lib/constants";
import { imageForProperty, resolvePropertyImage } from "@/lib/images";
import type { Property } from "@/lib/types";

export function PropertyShowcaseCard({
  property,
  eager = false,
}: {
  property: Property;
  eager?: boolean;
}) {
  return (
    <Link
      href={`/properti/${property.id}`}
      className="card-lift group flex flex-col overflow-hidden rounded-xl border border-line bg-paper hover:border-gold/40"
    >
      {/* Image */}
      <div className="relative">
        <PropertyImage
          src={resolvePropertyImage(property)}
          fallback={imageForProperty(property.tipe, property.id)}
          alt={property.nama_property}
          eager={eager}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[4/3] w-full"
          imgClassName="group-hover:scale-[1.04]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
          aria-hidden
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <StatusBadge status={property.status} className="shadow-sm" />
        </div>
        <div className="absolute right-3 top-3">
          <span className="rounded-full border border-paper/25 bg-ink/55 px-2.5 py-0.5 text-xs font-medium text-paper backdrop-blur-sm">
            {TIPE_LABEL[property.tipe]}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-paper">
          <Icon.MapPin className="h-4 w-4 text-gold-bright" />
          <span className="text-sm font-medium drop-shadow">
            {property.kawasan[0]}
            {property.kawasan.length > 1 ? ` +${property.kawasan.length - 1}` : ""}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-tight text-ink transition-colors group-hover:text-gold-deep">
          {property.nama_property}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {property.group ? `${property.group} · ` : ""}
          {property.kawasan.join(", ")}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-line py-3 text-center">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-muted-soft">
              Luas
            </dt>
            <dd className="tnum mt-0.5 text-[13px] font-medium text-ink">
              {formatDimensions(property.lebar, property.panjang)}
            </dd>
          </div>
          <div className="border-x border-line">
            <dt className="text-[10px] uppercase tracking-wider text-muted-soft">
              Tingkat
            </dt>
            <dd className="mt-0.5 text-[13px] font-medium text-ink">
              {formatTingkat(property.tingkat)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-muted-soft">
              Hadap
            </dt>
            <dd className="mt-0.5 text-[13px] font-medium text-ink">
              {formatHadap(property.hadap)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-soft">
              Harga
            </p>
            <p className="tnum text-lg font-semibold text-ink">
              {formatRupiah(property.price)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-paper transition-colors group-hover:bg-gold group-hover:text-ink">
            Lihat Detail
            <Icon.ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
