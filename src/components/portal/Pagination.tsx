"use client";

import { Icon } from "@/components/icons";
import { NativeSelect } from "@/components/ui/Field";
import { PER_PAGE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/cn";

function pageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < totalPages - 1) out.push("…");
  out.push(totalPages);
  return out;
}

export function Pagination({
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onPerPageChange,
}: {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted">
          Menampilkan{" "}
          <span className="font-medium text-ink">
            {from}–{to}
          </span>{" "}
          dari <span className="font-medium text-ink">{total}</span> properti
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-soft">Baris</span>
          <NativeSelect
            aria-label="Baris per halaman"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="h-9 w-20"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <nav className="flex items-center gap-1" aria-label="Paginasi">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-paper text-ink transition-colors hover:bg-mist disabled:opacity-40 disabled:hover:bg-paper"
        >
          <Icon.ChevronLeft className="h-4 w-4" />
        </button>

        {pageWindow(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-2 text-sm text-muted-soft">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 text-sm font-medium transition-colors",
                p === page
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink hover:bg-mist"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-paper text-ink transition-colors hover:bg-mist disabled:opacity-40 disabled:hover:bg-paper"
        >
          <Icon.ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
