"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons";

const DEMO = [
  {
    role: "Superadmin",
    email: "superadmin@primeproperty.id",
    password: "Prime2026!",
  },
  { role: "Admin", email: "admin@primeproperty.id", password: "Prime2026!" },
];

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push(next && next.startsWith("/agent") ? next : "/agent/dashboard");
        router.refresh();
        return;
      }
      setError(data.error ?? "Gagal masuk. Coba lagi.");
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-sold-line bg-sold-bg px-4 py-3 text-sm text-crimson"
        >
          <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Field label="Email" htmlFor="email" required>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="nama@primeproperty.id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" required>
            Password
          </Label>
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="text-xs font-medium text-gold-deep transition-colors hover:text-gold"
          >
            {show ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>
        <Input
          id="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" size="lg" loading={loading} className="w-full">
        {loading ? "Memverifikasi…" : "Masuk ke Portal"}
      </Button>

      {/* Demo credentials — no self-registration; accounts are provisioned. */}
      <div className="rounded-lg border border-line bg-mist/50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-soft">
          Akun demo
        </p>
        <div className="mt-2.5 space-y-2">
          {DEMO.map((d) => (
            <button
              key={d.role}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPassword(d.password);
                setError("");
              }}
              className="flex w-full items-center justify-between gap-3 rounded-md border border-line bg-paper px-3 py-2 text-left text-xs transition-colors hover:border-gold/50 hover:bg-gold-wash/40"
            >
              <span className="flex items-center gap-2">
                {d.role === "Superadmin" ? (
                  <Icon.Crown className="h-4 w-4 text-gold-deep" />
                ) : (
                  <Icon.Shield className="h-4 w-4 text-muted" />
                )}
                <span className="font-medium text-ink">{d.role}</span>
              </span>
              <span className="font-mono text-muted">{d.email}</span>
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-[11px] text-muted-soft">
          Password keduanya: <span className="font-mono">Prime2026!</span> ·
          Klik untuk mengisi otomatis.
        </p>
      </div>
    </form>
  );
}
