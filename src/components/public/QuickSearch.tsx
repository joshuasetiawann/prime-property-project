"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NativeSelect } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import { KAWASAN_OPTIONS } from "@/lib/constants";
import { groupThousands, parseRupiah } from "@/lib/format";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-soft">
      {children}
    </label>
  );
}

export function QuickSearch() {
  const router = useRouter();
  const [kawasan, setKawasan] = useState("");
  const [tipe, setTipe] = useState("semua");
  const [harga, setHarga] = useState<number | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (kawasan) params.set("kawasan", kawasan);
    if (tipe !== "semua") params.set("tipe", tipe);
    if (harga) params.set("hargaMax", String(harga));
    router.push(`/properti${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-line bg-paper/95 p-4 shadow-lg backdrop-blur sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr_auto] lg:items-end lg:gap-4"
    >
      <div>
        <FieldLabel>Kawasan</FieldLabel>
        <NativeSelect value={kawasan} onChange={(e) => setKawasan(e.target.value)}>
          <option value="">Semua Kawasan</option>
          {KAWASAN_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div>
        <FieldLabel>Tipe</FieldLabel>
        <NativeSelect value={tipe} onChange={(e) => setTipe(e.target.value)}>
          <option value="semua">Semua Tipe</option>
          <option value="ruko">Ruko</option>
          <option value="villa">Villa</option>
        </NativeSelect>
      </div>
      <div>
        <FieldLabel>Harga Maksimum</FieldLabel>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-soft">
            Rp
          </span>
          <input
            inputMode="numeric"
            placeholder="Tanpa batas"
            value={harga !== null ? groupThousands(String(harga)) : ""}
            onChange={(e) => setHarga(parseRupiah(e.target.value))}
            className="h-11 w-full rounded-md border border-line bg-paper pl-9 pr-3.5 text-sm text-ink transition-colors placeholder:text-muted-soft focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="lg:px-7">
        <Icon.Search className="h-4 w-4" />
        Cari Properti
      </Button>
    </form>
  );
}
