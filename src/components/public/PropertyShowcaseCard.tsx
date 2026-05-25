import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import {
  formatArea,
  formatDimensions,
  formatHadap,
  formatRupiah,
  formatTingkat,
} from "@/lib/format";
import { TIPE_LABEL } from "@/lib/constants";
import type { Property } from "@/lib/types";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-soft">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export function PropertyShowcaseCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/kontak?properti=${encodeURIComponent(property.nama_property)}`}
      className="card-lift group relative flex flex-col rounded-lg border border-line bg-paper p-6 hover:border-gold/50"
    >
      {/* top gold accent on hover */}
      <span
        className="absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />

      <div className="flex items-center justify-between">
        <span className="eyebrow text-[11px]">{TIPE_LABEL[property.tipe]}</span>
        <StatusBadge status={property.status} />
      </div>

      <h3 className="mt-3 font-display text-2xl leading-tight text-ink">
        {property.nama_property}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {property.kawasan.join(" · ")}
        {property.group ? ` — ${property.group}` : ""}
      </p>

      <div className="my-5 h-px bg-line" aria-hidden />

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Spec
          label="Dimensi"
          value={formatDimensions(property.lebar, property.panjang)}
        />
        <Spec
          label="Luas Tanah"
          value={formatArea(property.lebar, property.panjang)}
        />
        <Spec label="Tingkat" value={formatTingkat(property.tingkat)} />
        <Spec label="Hadap" value={formatHadap(property.hadap)} />
      </dl>

      <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-soft">
            Harga
          </p>
          <p className="tnum mt-0.5 text-lg font-semibold text-ink">
            {formatRupiah(property.price)}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep transition-colors group-hover:text-gold">
          Tanya
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
