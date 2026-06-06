"use client";

import { useState } from "react";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { validateContact, type ContactInput } from "@/lib/validation";

const EMPTY: ContactInput = { nama: "", email: "", nomor_hp: "", pesan: "" };

export function ContactForm({ initialProperty }: { initialProperty?: string }) {
  const toast = useToast();
  const [form, setForm] = useState<ContactInput>({
    ...EMPTY,
    pesan: initialProperty
      ? `Halo Prime Property, saya tertarik dengan properti "${initialProperty}". Mohon informasi ketersediaan dan detailnya.`
      : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof ContactInput, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (touched[key]) {
      setErrors(validateContact({ ...form, [key]: value }));
    }
  };

  const onBlur = (key: keyof ContactInput) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateContact(form));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateContact(form);
    setErrors(found);
    setTouched({ nama: true, email: true, nomor_hp: true, pesan: true });
    if (Object.keys(found).length > 0) {
      toast.error("Periksa kembali", "Beberapa isian belum sesuai.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(
          "Pesan terkirim, tim kami akan menghubungi Anda.",
          "Terima kasih telah menghubungi Prime Property."
        );
        setForm(EMPTY);
        setTouched({});
        setErrors({});
      } else if (res.status === 422) {
        const data = await res.json().catch(() => ({}));
        setErrors(data.errors ?? {});
        toast.error("Periksa kembali", "Beberapa isian belum sesuai.");
      } else if (res.status === 429) {
        toast.error(
          "Terlalu banyak percobaan",
          "Anda telah mengirim beberapa pesan. Coba lagi nanti."
        );
      } else {
        toast.error("Gagal mengirim", "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch {
      toast.error("Gagal mengirim", "Periksa koneksi Anda dan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama" htmlFor="nama" required error={touched.nama ? errors.nama : ""}>
          <Input
            id="nama"
            name="nama"
            autoComplete="name"
            placeholder="Nama lengkap Anda"
            value={form.nama}
            invalid={touched.nama && !!errors.nama}
            onChange={(e) => setField("nama", e.target.value)}
            onBlur={() => onBlur("nama")}
          />
        </Field>
        <Field
          label="Nomor HP"
          htmlFor="nomor_hp"
          required
          error={touched.nomor_hp ? errors.nomor_hp : ""}
        >
          <Input
            id="nomor_hp"
            name="nomor_hp"
            inputMode="tel"
            autoComplete="tel"
            placeholder="08xxxxxxxxxx"
            value={form.nomor_hp}
            invalid={touched.nomor_hp && !!errors.nomor_hp}
            onChange={(e) => setField("nomor_hp", e.target.value)}
            onBlur={() => onBlur("nomor_hp")}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" required error={touched.email ? errors.email : ""}>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={form.email}
          invalid={touched.email && !!errors.email}
          onChange={(e) => setField("email", e.target.value)}
          onBlur={() => onBlur("email")}
        />
      </Field>

      <Field label="Pesan" htmlFor="pesan" required error={touched.pesan ? errors.pesan : ""}>
        <Textarea
          id="pesan"
          name="pesan"
          rows={5}
          placeholder="Ceritakan kebutuhan properti Anda…"
          value={form.pesan}
          invalid={touched.pesan && !!errors.pesan}
          onChange={(e) => setField("pesan", e.target.value)}
          onBlur={() => onBlur("pesan")}
        />
      </Field>

      <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
        {submitting ? "Mengirim…" : "Kirim Pesan"}
      </Button>
      <p className="text-xs text-muted-soft">
        Dengan mengirim, Anda setuju dihubungi oleh tim Prime Property terkait
        permintaan ini.
      </p>
    </form>
  );
}
