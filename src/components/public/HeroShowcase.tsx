import { PropertyImage } from "@/components/ui/PropertyImage";
import { Icon } from "@/components/icons";
import { formatRupiah } from "@/lib/format";
import { TIPE_LABEL } from "@/lib/constants";
import { imageForProperty, resolvePropertyImage } from "@/lib/images";
import type { Property } from "@/lib/types";

export function HeroShowcase({
  primary,
  secondary,
}: {
  primary: Property;
  secondary: Property;
}) {
  return (
    <div className="relative">
      {/* glow */}
      <div
        className="absolute -inset-6 rounded-[2rem] bg-gold/10 blur-3xl"
        aria-hidden
      />

      {/* Primary card */}
      <div className="relative overflow-hidden rounded-2xl border border-paper/10 shadow-lg">
        <PropertyImage
          src={resolvePropertyImage(primary)}
          fallback={imageForProperty(primary.tipe, primary.id)}
          alt={primary.nama_property}
          eager
          className="aspect-[4/5] w-full sm:aspect-[16/12]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent"
          aria-hidden
        />
        {/* verified pill */}
        <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/70 px-3 py-1.5 text-xs font-semibold text-gold-bright backdrop-blur">
          <Icon.ShieldCheck className="h-4 w-4" />
          Legalitas Terverifikasi
        </div>
        {/* info bar */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-bright">
            {TIPE_LABEL[primary.tipe]} · {primary.kawasan[0]}
          </span>
          <h3 className="mt-1 font-display text-2xl text-paper">
            {primary.nama_property}
          </h3>
          <p className="tnum mt-1 text-lg font-semibold text-paper">
            {formatRupiah(primary.price)}
          </p>
        </div>
      </div>

      {/* Secondary floating card */}
      <div className="absolute -bottom-8 -left-8 hidden w-48 overflow-hidden rounded-xl border border-paper/15 shadow-lg sm:block">
        <PropertyImage
          src={resolvePropertyImage(secondary)}
          fallback={imageForProperty(secondary.tipe, secondary.id)}
          alt={secondary.nama_property}
          className="aspect-[4/3] w-full"
        />
        <div className="bg-paper px-3 py-2.5">
          <p className="truncate text-xs font-semibold text-ink">
            {secondary.nama_property}
          </p>
          <p className="tnum text-xs text-gold-deep">
            {formatRupiah(secondary.price)}
          </p>
        </div>
      </div>

      {/* Floating stat chip */}
      <div className="absolute -right-5 top-1/3 hidden rounded-xl border border-line bg-paper px-4 py-3 shadow-lg lg:block">
        <p className="font-display text-2xl text-ink">60+</p>
        <p className="text-[11px] uppercase tracking-wider text-muted">
          Properti Aktif
        </p>
      </div>
    </div>
  );
}
