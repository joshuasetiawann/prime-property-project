"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Input, Label } from "@/components/ui/Field";
import { Button, buttonClasses } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Icon } from "@/components/icons";
import { MultiSelectDropdown, Segmented } from "./controls";
import { HADAP_OPTIONS, KAWASAN_OPTIONS, SIAP_OPTIONS } from "@/lib/constants";
import { groupThousands } from "@/lib/format";
import {
  coercePropertyInput,
  hasErrors,
  validateProperty,
  type Errors,
} from "@/lib/validation";
import { cn } from "@/lib/cn";
import type { Hadap, Property, Siap, Tipe } from "@/lib/types";

interface FormState {
  nama_property: string;
  group: string;
  tipe: "" | Tipe;
  lebar: string;
  panjang: string;
  tingkat: string;
  price: string; // raw digits
  hadap: Hadap[];
  kawasan: string[];
  status: "" | "in_stock" | "sold_out";
  siap: "" | Siap;
  carport: boolean;
  maps_link: string;
  unit: string;
}

function fromProperty(p?: Property): FormState {
  return {
    nama_property: p?.nama_property ?? "",
    group: p?.group ?? "",
    tipe: p?.tipe ?? "",
    lebar: p ? String(p.lebar) : "",
    panjang: p ? String(p.panjang) : "",
    tingkat: p ? String(p.tingkat) : "",
    price: p ? String(p.price) : "",
    hadap: p?.hadap ?? [],
    kawasan: p?.kawasan ?? [],
    status: p?.status ?? "",
    siap: p?.siap ?? "",
    carport: p?.carport ?? false,
    maps_link: p?.maps_link ?? "",
    unit: p?.unit ?? "",
  };
}

const CHANGE_KEYS = [
  "nama_property",
  "group",
  "lebar",
  "panjang",
  "hadap",
  "tipe",
  "tingkat",
  "price",
  "carport",
  "status",
  "siap",
  "maps_link",
  "kawasan",
  "unit",
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-paper p-6">
      <h2 className="eyebrow mb-5">{title}</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function DirtyDot({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <span
      title="Diubah"
      className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle"
    />
  );
}

export function PropertyForm({
  mode,
  property,
}: {
  mode: "create" | "edit";
  property?: Property;
}) {
  const router = useRouter();
  const toast = useToast();
  const initial = useMemo(() => fromProperty(property), [property]);

  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const coerced = useMemo(
    () => coercePropertyInput(form as unknown as Record<string, unknown>),
    [form]
  );

  // Dirty tracking (edit mode).
  const changed = useMemo(() => {
    const set = new Set<string>();
    if (mode !== "edit" || !property) return set;
    const base = coercePropertyInput(initial as unknown as Record<string, unknown>);
    for (const k of CHANGE_KEYS) {
      if (JSON.stringify(coerced[k]) !== JSON.stringify(base[k])) set.add(k);
    }
    return set;
  }, [coerced, initial, mode, property]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (touched[key]) {
      const next = { ...form, [key]: value };
      setErrors(
        validateProperty(
          coercePropertyInput(next as unknown as Record<string, unknown>)
        )
      );
    }
  };

  const blur = (key: string) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateProperty(coerced));
  };

  const err = (key: string) => (touched[key] ? errors[key] : undefined);

  const submit = async (addAnother: boolean) => {
    const found = validateProperty(coerced);
    setErrors(found);
    setTouched(
      Object.fromEntries(CHANGE_KEYS.map((k) => [k, true]))
    );
    if (hasErrors(found)) {
      toast.error("Periksa kembali", "Beberapa isian belum sesuai.");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "create"
          ? "/api/properties"
          : `/api/properties/${property!.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coerced),
      });

      if (res.ok) {
        const data = await res.json();
        if (mode === "create") {
          toast.success("Properti ditambahkan", `“${coerced.nama_property}” tersimpan.`);
          if (addAnother) {
            setForm(fromProperty());
            setTouched({});
            setErrors({});
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            router.push(`/agent/properti/${data.property.id}`);
            router.refresh();
          }
        } else {
          toast.success("Perubahan disimpan", `“${coerced.nama_property}” diperbarui.`);
          router.push(`/agent/properti/${property!.id}`);
          router.refresh();
        }
      } else if (res.status === 422) {
        const data = await res.json().catch(() => ({}));
        setErrors(data.errors ?? {});
        toast.error("Validasi gagal", "Periksa kembali isian Anda.");
      } else if (res.status === 403) {
        toast.error("Akses ditolak", "Hanya superadmin yang dapat menyimpan.");
      } else {
        toast.error("Gagal menyimpan", "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      toast.error("Gagal menyimpan", "Periksa koneksi Anda dan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const cancelHref =
    mode === "edit" && property
      ? `/agent/properti/${property.id}`
      : "/agent/dashboard";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(false);
      }}
      noValidate
      className="space-y-6"
    >
      {mode === "edit" && changed.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-gold/40 bg-gold-wash px-4 py-2.5 text-sm text-gold-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {changed.size} perubahan belum disimpan
        </div>
      )}

      <Section title="Informasi Dasar">
        <Field
          label="Nama Properti"
          htmlFor="nama_property"
          required
          error={err("nama_property")}
          className="sm:col-span-2"
        >
          <Input
            id="nama_property"
            value={form.nama_property}
            invalid={!!err("nama_property")}
            onChange={(e) => set("nama_property", e.target.value)}
            onBlur={() => blur("nama_property")}
            placeholder="cth. Aston Villas (Blok A)"
          />
        </Field>

        <Field label={<>Group</>} htmlFor="group" error={err("group")}>
          <Input
            id="group"
            value={form.group}
            onChange={(e) => set("group", e.target.value)}
            placeholder="cth. Mentari (opsional)"
          />
        </Field>

        <div className="space-y-1.5">
          <Label required>
            Tipe <DirtyDot on={changed.has("tipe")} />
          </Label>
          <Segmented
            ariaLabel="Tipe"
            options={[
              { value: "ruko", label: "Ruko" },
              { value: "villa", label: "Villa" },
            ]}
            value={form.tipe as Tipe}
            onChange={(v) => set("tipe", v)}
          />
          {err("tipe") && (
            <p className="text-xs text-crimson">{err("tipe")}</p>
          )}
        </div>
      </Section>

      <Section title="Spesifikasi">
        <Field
          label={<>Lebar (m)</>}
          htmlFor="lebar"
          required
          error={err("lebar")}
        >
          <Input
            id="lebar"
            inputMode="decimal"
            value={form.lebar}
            invalid={!!err("lebar")}
            onChange={(e) => set("lebar", e.target.value)}
            onBlur={() => blur("lebar")}
            placeholder="cth. 4.5"
          />
        </Field>

        <Field
          label="Panjang (m)"
          htmlFor="panjang"
          required
          error={err("panjang")}
        >
          <Input
            id="panjang"
            inputMode="decimal"
            value={form.panjang}
            invalid={!!err("panjang")}
            onChange={(e) => set("panjang", e.target.value)}
            onBlur={() => blur("panjang")}
            placeholder="cth. 21.5"
          />
        </Field>

        <Field
          label="Tingkat"
          htmlFor="tingkat"
          required
          error={err("tingkat")}
          hint="1 – 10, maksimum 1 desimal"
        >
          <Input
            id="tingkat"
            inputMode="decimal"
            value={form.tingkat}
            invalid={!!err("tingkat")}
            onChange={(e) => set("tingkat", e.target.value)}
            onBlur={() => blur("tingkat")}
            placeholder="cth. 2"
          />
        </Field>

        <Field
          label="Harga (Rp)"
          htmlFor="price"
          required
          error={err("price")}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-soft">
              Rp
            </span>
            <Input
              id="price"
              inputMode="numeric"
              value={form.price ? groupThousands(form.price) : ""}
              invalid={!!err("price")}
              onChange={(e) =>
                set("price", e.target.value.replace(/\D/g, ""))
              }
              onBlur={() => blur("price")}
              placeholder="1.350.000.000"
              className="pl-9 tnum"
            />
          </div>
        </Field>

        <div className="space-y-1.5 sm:col-span-2">
          <Label required>
            Hadap <DirtyDot on={changed.has("hadap")} />
          </Label>
          <div className="flex flex-wrap gap-2">
            {HADAP_OPTIONS.map((h) => {
              const active = form.hadap.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    set(
                      "hadap",
                      active
                        ? form.hadap.filter((x) => x !== h)
                        : [...form.hadap, h]
                    );
                    setTouched((t) => ({ ...t, hadap: true }));
                  }}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-gold bg-gold-wash text-gold-deep"
                      : "border-line bg-paper text-muted hover:border-line-strong"
                  )}
                >
                  {h}
                </button>
              );
            })}
          </div>
          {err("hadap") && (
            <p className="text-xs text-crimson">{err("hadap")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Carport <DirtyDot on={changed.has("carport")} />
          </Label>
          <Segmented
            ariaLabel="Carport"
            options={[
              { value: "ya", label: "Ya" },
              { value: "tidak", label: "Tidak" },
            ]}
            value={form.carport ? "ya" : "tidak"}
            onChange={(v) => set("carport", v === "ya")}
          />
        </div>
      </Section>

      <Section title="Lokasi & Status">
        <Field
          label="Kawasan"
          required
          error={err("kawasan")}
        >
          <MultiSelectDropdown
            label="Kawasan"
            options={KAWASAN_OPTIONS.map((k) => ({ value: k, label: k }))}
            selected={form.kawasan}
            onChange={(v) => {
              set("kawasan", v);
              setTouched((t) => ({ ...t, kawasan: true }));
            }}
            placeholder="Pilih kawasan"
          />
        </Field>

        <Field label="Unit" htmlFor="unit">
          <Input
            id="unit"
            value={form.unit}
            onChange={(e) => set("unit", e.target.value)}
            placeholder="cth. Ready Siap huni (opsional)"
          />
        </Field>

        <div className="space-y-1.5">
          <Label required>
            Status <DirtyDot on={changed.has("status")} />
          </Label>
          <Segmented
            ariaLabel="Status"
            options={[
              { value: "in_stock", label: "In Stock" },
              { value: "sold_out", label: "Sold Out" },
            ]}
            value={form.status as "in_stock" | "sold_out"}
            onChange={(v) => set("status", v)}
          />
          {err("status") && (
            <p className="text-xs text-crimson">{err("status")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label required>
            Siap <DirtyDot on={changed.has("siap")} />
          </Label>
          <Segmented
            size="sm"
            ariaLabel="Siap"
            options={SIAP_OPTIONS}
            value={form.siap as Siap}
            onChange={(v) => set("siap", v)}
          />
          {err("siap") && (
            <p className="text-xs text-crimson">{err("siap")}</p>
          )}
        </div>

        <Field
          label="Link Google Maps"
          htmlFor="maps_link"
          error={err("maps_link")}
          hint="Opsional · URL yang mengandung google.com/maps"
          className="sm:col-span-2"
        >
          <Input
            id="maps_link"
            value={form.maps_link}
            invalid={!!err("maps_link")}
            onChange={(e) => set("maps_link", e.target.value)}
            onBlur={() => blur("maps_link")}
            placeholder="https://www.google.com/maps/…"
          />
        </Field>
      </Section>

      {/* Actions */}
      <div className="sticky bottom-0 flex flex-col-reverse items-stretch gap-3 rounded-xl border border-line bg-paper/90 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end">
        <a href={cancelHref} className={buttonClasses("ghost", "md")}>
          Batal
        </a>
        {mode === "create" && (
          <Button
            type="button"
            variant="subtle"
            loading={saving}
            onClick={() => submit(true)}
          >
            Simpan &amp; Tambah Lagi
          </Button>
        )}
        <Button type="submit" variant="primary" loading={saving}>
          <Icon.Check className="h-4 w-4" />
          Simpan
        </Button>
      </div>
    </form>
  );
}
