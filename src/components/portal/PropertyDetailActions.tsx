"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import { DeletePropertyDialog } from "./DeletePropertyDialog";

export function PropertyDetailActions({
  property,
}: {
  property: { id: string; nama_property: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/agent/properti/${property.id}/edit`}
        className={buttonClasses("outline", "sm")}
      >
        <Icon.Edit className="h-4 w-4" />
        Edit
      </Link>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses("danger", "sm")}
      >
        <Icon.Trash className="h-4 w-4" />
        Hapus
      </button>

      <DeletePropertyDialog
        property={property}
        open={open}
        onClose={() => setOpen(false)}
        onDeleted={() => {
          router.push("/agent/dashboard");
          router.refresh();
        }}
      />
    </div>
  );
}
