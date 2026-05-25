"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function DeletePropertyDialog({
  property,
  open,
  onClose,
  onDeleted,
}: {
  property: { id: string; nama_property: string };
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(
          "Properti dihapus",
          `“${property.nama_property}” telah dihapus dari katalog.`
        );
        onClose();
        onDeleted();
      } else if (res.status === 403) {
        toast.error("Akses ditolak", "Hanya superadmin yang dapat menghapus.");
      } else {
        toast.error("Gagal menghapus", "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      toast.error("Gagal menghapus", "Periksa koneksi Anda dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Hapus Properti"
      description={
        <>
          Yakin hapus properti{" "}
          <span className="font-semibold text-ink">
            {property.nama_property}
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirm} loading={loading}>
            Ya, Hapus Properti
          </Button>
        </>
      }
    />
  );
}
