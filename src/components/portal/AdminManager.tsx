"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input } from "@/components/ui/Field";
import { Icon } from "@/components/icons";
import { RoleBadge } from "./RoleBadge";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/format";
import type { PublicUser } from "@/lib/types";

export function AdminManager({ initialUsers }: { initialUsers: PublicUser[] }) {
  const toast = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<PublicUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const replaceUser = (u: PublicUser) =>
    setUsers((list) =>
      list.some((x) => x.id === u.id)
        ? list.map((x) => (x.id === u.id ? u : x))
        : [...list, u]
    );

  const toggle = async (user: PublicUser) => {
    setBusyId(user.id);
    try {
      const res = await fetch(`/api/admins/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", active: !user.active }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        replaceUser(data.user);
        toast.success(
          data.user.active ? "Akun diaktifkan" : "Akun dinonaktifkan",
          `${user.name} kini ${data.user.active ? "aktif" : "nonaktif"}.`
        );
      } else {
        toast.error("Gagal", data.error ?? "Tidak dapat memperbarui akun.");
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            Akun Admin
          </h1>
          <p className="mt-1 text-sm text-muted">
            Kelola akun agen—buat, aktif/nonaktifkan, dan reset password.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Icon.Plus className="h-4 w-4" />
          Tambah Admin
        </Button>
      </div>

      <div className="mt-7 overflow-hidden rounded-xl border border-line bg-paper">
        <div className="scrollbar-prime overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line bg-mist/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-soft">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Peran</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Terakhir Login</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSuper = u.role === "superadmin";
                return (
                  <tr key={u.id} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-ink">{u.name}</div>
                      <div className="text-xs text-muted-soft">{u.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge tone={u.active ? "stock" : "neutral"} dot>
                        {u.active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-muted">
                      {u.last_login_at ? formatDateTime(u.last_login_at) : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      {isSuper ? (
                        <p className="text-right text-xs text-muted-soft">
                          Akun utama
                        </p>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setResetTarget(u)}
                            className="rounded-md border border-line px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:bg-mist"
                          >
                            Reset Password
                          </button>
                          <button
                            type="button"
                            disabled={busyId === u.id}
                            onClick={() => toggle(u)}
                            className={
                              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 " +
                              (u.active
                                ? "border border-sold-line bg-sold-bg text-crimson hover:bg-crimson-wash"
                                : "border border-stock-line bg-stock-bg text-stock-fg hover:opacity-90")
                            }
                          >
                            {u.active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CreateAdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(u) => {
          replaceUser(u);
          toast.success("Admin dibuat", `Akun untuk ${u.name} berhasil dibuat.`);
        }}
      />

      {resetTarget && (
        <ResetPasswordModal
          user={resetTarget}
          onClose={() => setResetTarget(null)}
          onDone={() => {
            toast.success("Password direset", `Password ${resetTarget.name} diperbarui.`);
            setResetTarget(null);
          }}
        />
      )}
    </>
  );
}

function CreateAdminModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (u: PublicUser) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        onCreated(data.user);
        reset();
        onClose();
      } else {
        setError(data.error ?? "Gagal membuat akun.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah Admin"
      description="Akun baru akan memiliki peran Admin (lihat & filter properti)."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={submit} loading={loading}>
            Buat Akun
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <p className="rounded-md border border-sold-line bg-sold-bg px-3 py-2 text-sm text-crimson">
            {error}
          </p>
        )}
        <Field label="Nama Lengkap" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Dian Pratama" />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@primeproperty.id"
          />
        </Field>
        <Field label="Password Sementara" required hint="Minimal 8 karakter">
          <Input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password awal"
          />
        </Field>
      </div>
    </Modal>
  );
}

function ResetPasswordModal({
  user,
  onClose,
  onDone,
}: {
  user: PublicUser;
  onClose: () => void;
  onDone: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admins/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password", password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) onDone();
      else setError(data.error ?? "Gagal mereset password.");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Reset Password"
      description={`Tetapkan password baru untuk ${user.name}.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={submit} loading={loading}>
            Simpan Password
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <p className="rounded-md border border-sold-line bg-sold-bg px-3 py-2 text-sm text-crimson">
            {error}
          </p>
        )}
        <Field label="Password Baru" required hint="Minimal 8 karakter">
          <Input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password baru"
          />
        </Field>
      </div>
    </Modal>
  );
}
