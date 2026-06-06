"use client";

import { Icon } from "@/components/icons";
import { Input } from "@/components/ui/Field";
import { FilterField, MultiSelectDropdown, Segmented } from "./controls";
import {
  HADAP_OPTIONS,
  KAWASAN_OPTIONS,
  SIAP_LABEL,
  SIAP_OPTIONS,
  STATUS_LABEL,
  TIPE_LABEL,
} from "@/lib/constants";
import { formatRupiah, groupThousands, parseRupiah } from "@/lib/format";
import { cn } from "@/lib/cn";
import type {
  CarportFilter,
  Hadap,
  ListingQuery,
  Siap,
  StatusFilter,
  TipeFilter,
} from "@/lib/types";

type Patch = Partial<ListingQuery>;

function HargaMaxInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-soft">
        Rp
      </span>
      <Input
        inputMode="numeric"
        placeholder="Tanpa batas"
        value={value !== null ? groupThousands(String(value)) : ""}
        onChange={(e) => onChange(parseRupiah(e.target.value))}
        className="pl-9"
      />
    </div>
  );
}

export function FilterPanel({
  query,
  onChange,
}: {
  query: ListingQuery;
  onChange: (patch: Patch) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <FilterField label="Kawasan">
        <MultiSelectDropdown
          label="Kawasan"
          options={KAWASAN_OPTIONS.map((k) => ({ value: k, label: k }))}
          selected={query.kawasan}
          onChange={(v) => onChange({ kawasan: v })}
        />
      </FilterField>

      <FilterField label="Hadap">
        <MultiSelectDropdown
          label="Hadap"
          options={HADAP_OPTIONS.map((h) => ({ value: h, label: h }))}
          selected={query.hadap}
          onChange={(v) => onChange({ hadap: v as Hadap[] })}
        />
      </FilterField>

      <FilterField label="Siap">
        <MultiSelectDropdown
          label="Siap"
          options={SIAP_OPTIONS}
          selected={query.siap}
          onChange={(v) => onChange({ siap: v as Siap[] })}
        />
      </FilterField>

      <FilterField label="Lebar Min (m)">
        <Input
          inputMode="decimal"
          placeholder="cth. 5"
          value={query.lebarMin ?? ""}
          onChange={(e) => {
            const n = e.target.value.replace(",", ".");
            onChange({ lebarMin: n === "" ? null : Number(n) });
          }}
        />
      </FilterField>

      <FilterField label="Harga Maksimum">
        <HargaMaxInput
          value={query.hargaMax}
          onChange={(v) => onChange({ hargaMax: v })}
        />
      </FilterField>

      <FilterField label="Tipe">
        <Segmented<TipeFilter>
          ariaLabel="Tipe"
          options={[
            { value: "semua", label: "Semua" },
            { value: "ruko", label: "Ruko" },
            { value: "villa", label: "Villa" },
          ]}
          value={query.tipe}
          onChange={(v) => onChange({ tipe: v })}
        />
      </FilterField>

      <FilterField label="Status">
        <Segmented<StatusFilter>
          ariaLabel="Status"
          options={[
            { value: "semua", label: "Semua" },
            { value: "in_stock", label: "In Stock" },
            { value: "sold_out", label: "Sold Out" },
          ]}
          value={query.status}
          onChange={(v) => onChange({ status: v })}
        />
      </FilterField>

      <FilterField label="Carport">
        <Segmented<CarportFilter>
          ariaLabel="Carport"
          options={[
            { value: "semua", label: "Semua" },
            { value: "ya", label: "Ya" },
            { value: "tidak", label: "Tidak" },
          ]}
          value={query.carport}
          onChange={(v) => onChange({ carport: v })}
        />
      </FilterField>
    </div>
  );
}

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function FilterChips({
  query,
  onChange,
  onReset,
}: {
  query: ListingQuery;
  onChange: (patch: Patch) => void;
  onReset: () => void;
}) {
  const chips: Chip[] = [];

  if (query.search.trim())
    chips.push({
      key: "search",
      label: `Cari: “${query.search.trim()}”`,
      onRemove: () => onChange({ search: "" }),
    });

  query.kawasan.forEach((k) =>
    chips.push({
      key: `kawasan-${k}`,
      label: k,
      onRemove: () => onChange({ kawasan: query.kawasan.filter((x) => x !== k) }),
    })
  );

  query.hadap.forEach((h) =>
    chips.push({
      key: `hadap-${h}`,
      label: `Hadap ${h}`,
      onRemove: () => onChange({ hadap: query.hadap.filter((x) => x !== h) }),
    })
  );

  query.siap.forEach((s) =>
    chips.push({
      key: `siap-${s}`,
      label: SIAP_LABEL[s],
      onRemove: () => onChange({ siap: query.siap.filter((x) => x !== s) }),
    })
  );

  if (query.lebarMin !== null)
    chips.push({
      key: "lebar",
      label: `Lebar ≥ ${query.lebarMin} m`,
      onRemove: () => onChange({ lebarMin: null }),
    });

  if (query.hargaMax !== null)
    chips.push({
      key: "harga",
      label: `≤ ${formatRupiah(query.hargaMax)}`,
      onRemove: () => onChange({ hargaMax: null }),
    });

  if (query.tipe !== "semua")
    chips.push({
      key: "tipe",
      label: `Tipe: ${TIPE_LABEL[query.tipe]}`,
      onRemove: () => onChange({ tipe: "semua" }),
    });

  if (query.status !== "semua")
    chips.push({
      key: "status",
      label: `Status: ${STATUS_LABEL[query.status]}`,
      onRemove: () => onChange({ status: "semua" }),
    });

  if (query.carport !== "semua")
    chips.push({
      key: "carport",
      label: `Carport: ${query.carport === "ya" ? "Ya" : "Tidak"}`,
      onRemove: () => onChange({ carport: "semua" }),
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-soft">
        Filter aktif
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold-wash px-3 py-1 text-xs font-medium text-gold-deep transition-colors hover:border-gold hover:bg-gold-soft"
          )}
        >
          {chip.label}
          <Icon.Close className="h-3 w-3 opacity-60 group-hover:opacity-100" />
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-crimson transition-colors hover:bg-crimson-wash"
      >
        Reset Filter
      </button>
    </div>
  );
}
