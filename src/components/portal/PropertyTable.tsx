"use client";

import { SiapBadge, StatusBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/icons";
import {
  formatDimensions,
  formatHadap,
  formatMeter,
  formatRupiah,
} from "@/lib/format";
import { TIPE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { Property, SortKey } from "@/lib/types";

type SortColumn = "nama" | "harga" | "status";

function SortableTh({
  column,
  label,
  sort,
  onSort,
  align = "left",
}: {
  column: SortColumn;
  label: string;
  sort: SortKey;
  onSort: (column: SortColumn) => void;
  align?: "left" | "right";
}) {
  const active =
    (column === "nama" && sort === "nama") ||
    (column === "harga" && (sort === "harga_asc" || sort === "harga_desc")) ||
    (column === "status" && sort === "status");

  const dir =
    column === "harga"
      ? sort === "harga_asc"
        ? "asc"
        : sort === "harga_desc"
          ? "desc"
          : null
      : null;

  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider",
        align === "right" ? "text-right" : "text-left"
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-ink",
          align === "right" && "flex-row-reverse",
          active ? "text-ink" : "text-muted-soft"
        )}
      >
        {label}
        {dir === "asc" ? (
          <Icon.ChevronDown className="h-3.5 w-3.5 rotate-180" />
        ) : dir === "desc" ? (
          <Icon.ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <Icon.Sort className={cn("h-3.5 w-3.5", active && "text-gold")} />
        )}
      </button>
    </th>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-soft",
        align === "right" && "text-right",
        align === "center" && "text-center"
      )}
    >
      {children}
    </th>
  );
}

export function PropertyTable({
  rows,
  sort,
  onSortChange,
  onRowClick,
  activeId,
}: {
  rows: Property[];
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onRowClick: (property: Property) => void;
  activeId?: string | null;
}) {
  const handleSort = (column: SortColumn) => {
    if (column === "nama") onSortChange("nama");
    else if (column === "status") onSortChange("status");
    else if (column === "harga")
      onSortChange(sort === "harga_asc" ? "harga_desc" : "harga_asc");
  };

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-paper px-6 py-20 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mist text-muted-soft">
          <Icon.Search className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-ink">
          Tidak ada properti ditemukan
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted">
          Coba ubah kata kunci pencarian atau atur ulang filter untuk melihat
          lebih banyak hasil.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="scrollbar-prime overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-mist/50">
              <SortableTh column="nama" label="Nama" sort={sort} onSort={handleSort} />
              <Th>Group</Th>
              <Th>Lebar × Panjang</Th>
              <Th>Hadap</Th>
              <Th>Tipe</Th>
              <Th align="right">Tingkat</Th>
              <SortableTh column="harga" label="Harga" sort={sort} onSort={handleSort} align="right" />
              <Th align="center">Carport</Th>
              <SortableTh column="status" label="Status" sort={sort} onSort={handleSort} />
              <Th>Siap</Th>
              <Th>Kawasan</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                onClick={() => onRowClick(p)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick(p);
                  }
                }}
                className={cn(
                  "cursor-pointer border-b border-line/70 transition-colors last:border-0 focus:outline-none focus-visible:bg-gold-wash/50",
                  activeId === p.id ? "bg-gold-wash/50" : "hover:bg-mist/60"
                )}
              >
                <td className="px-3 py-3">
                  <div className="font-medium text-ink">{p.nama_property}</div>
                  <div className="text-xs text-muted-soft">{p.id}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                  {p.group ?? "—"}
                </td>
                <td className="tnum whitespace-nowrap px-3 py-3 text-ink-soft">
                  {formatDimensions(p.lebar, p.panjang)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                  {formatHadap(p.hadap)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                  {TIPE_LABEL[p.tipe]}
                </td>
                <td className="tnum whitespace-nowrap px-3 py-3 text-right text-ink-soft">
                  {formatMeter(p.tingkat)}
                </td>
                <td className="tnum whitespace-nowrap px-3 py-3 text-right font-medium text-ink">
                  {formatRupiah(p.price)}
                </td>
                <td className="px-3 py-3 text-center">
                  {p.carport ? (
                    <Icon.Check className="mx-auto h-4 w-4 text-stock-fg" />
                  ) : (
                    <span className="text-muted-soft">—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-3 py-3">
                  <SiapBadge siap={p.siap} />
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                  {p.kawasan.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
