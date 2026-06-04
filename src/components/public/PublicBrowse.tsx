"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FilterPanel, FilterChips } from "@/components/portal/PropertyFilters";
import { Pagination } from "@/components/portal/Pagination";
import { PropertyShowcaseCard } from "./PropertyShowcaseCard";
import { Input, NativeSelect } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Icon } from "@/components/icons";
import { DEFAULT_QUERY, SORT_OPTIONS } from "@/lib/constants";
import { activeFilterCount } from "@/lib/filters";
import { queryToString } from "@/lib/query";
import { cn } from "@/lib/cn";
import type {
  ListingQuery,
  ListingResult,
  SortKey,
} from "@/lib/types";

export function PublicBrowse({
  initialQuery,
  initialResult,
}: {
  initialQuery: ListingQuery;
  initialResult: ListingResult;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState<ListingQuery>(initialQuery);
  const [result, setResult] = useState<ListingResult>(initialResult);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const firstRun = useRef(true);
  const qs = queryToString(query);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/properties${qs}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as ListingResult;
        setResult(data);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        /* keep previous */
      } finally {
        setLoading(false);
      }
    }, 300);
    window.history.replaceState(null, "", `${pathname}${qs}` || pathname);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  const patch = (p: Partial<ListingQuery>) =>
    setQuery((q) => ({ ...q, ...p, page: 1 }));
  const reset = () => setQuery({ ...DEFAULT_QUERY, perPage: query.perPage });
  const activeCount = activeFilterCount(query);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon.Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-soft" />
          <Input
            value={query.search}
            onChange={(e) => patch({ search: e.target.value })}
            placeholder="Cari nama, group, atau kawasan…"
            className="pl-10"
            aria-label="Pencarian properti"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className={cn(
            buttonClasses(filtersOpen ? "dark" : "subtle", "md"),
            "justify-between sm:justify-center"
          )}
          aria-expanded={filtersOpen}
        >
          <span className="flex items-center gap-2">
            <Icon.Filter className="h-4 w-4" />
            Filter
          </span>
          {activeCount > 0 && (
            <span
              className={cn(
                "ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                filtersOpen ? "bg-gold text-ink" : "bg-ink text-paper"
              )}
            >
              {activeCount}
            </span>
          )}
        </button>
        <NativeSelect
          aria-label="Urutkan"
          value={query.sort}
          onChange={(e) =>
            setQuery((q) => ({ ...q, sort: e.target.value as SortKey, page: 1 }))
          }
          className="w-full sm:w-52"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {filtersOpen && (
        <div className="animate-scale-in mt-4 rounded-xl border border-line bg-paper p-5">
          <FilterPanel query={query} onChange={patch} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-4">
        <FilterChips query={query} onChange={patch} onReset={reset} />
        <p className="shrink-0 text-sm text-muted">
          <span className="font-semibold text-ink">{result.total}</span> properti
        </p>
      </div>

      {/* Grid */}
      <div className="relative mt-6 min-h-[40vh]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-24">
            <Spinner />
          </div>
        )}
        {result.rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-paper px-6 py-20 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mist text-muted-soft">
              <Icon.Search className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-ink">
              Tidak ada properti ditemukan
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted">
              Coba ubah kata kunci atau atur ulang filter.
            </p>
            <button
              type="button"
              onClick={reset}
              className={buttonClasses("subtle", "sm") + " mt-5"}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
              loading && "opacity-60"
            )}
          >
            {result.rows.map((p) => (
              <PropertyShowcaseCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>

      {result.total > result.perPage && (
        <div className="mt-10">
          <Pagination
            page={result.page}
            perPage={result.perPage}
            total={result.total}
            totalPages={result.totalPages}
            onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
            onPerPageChange={(perPage) =>
              setQuery((q) => ({ ...q, perPage, page: 1 }))
            }
          />
        </div>
      )}
    </div>
  );
}
