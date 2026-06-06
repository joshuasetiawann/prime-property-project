"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FilterPanel, FilterChips } from "./PropertyFilters";
import { PropertyTable } from "./PropertyTable";
import { Pagination } from "./Pagination";
import { PropertyDetailView } from "./PropertyDetailView";
import { DeletePropertyDialog } from "./DeletePropertyDialog";
import { Drawer } from "@/components/ui/Drawer";
import { buttonClasses } from "@/components/ui/Button";
import { Input, NativeSelect } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { Icon } from "@/components/icons";
import { DEFAULT_QUERY, SORT_OPTIONS } from "@/lib/constants";
import { activeFilterCount } from "@/lib/filters";
import { queryToString } from "@/lib/query";
import { cn } from "@/lib/cn";
import type {
  ListingQuery,
  ListingResult,
  Property,
  Role,
  SortKey,
} from "@/lib/types";

export function PropertyDashboard({
  role,
  initialQuery,
  initialResult,
}: {
  role: Role;
  initialQuery: ListingQuery;
  initialResult: ListingResult;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isSuper = role === "superadmin";

  const [query, setQuery] = useState<ListingQuery>(initialQuery);
  const [result, setResult] = useState<ListingResult>(initialResult);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(
    activeFilterCount(initialQuery) > 0
  );
  const [drawer, setDrawer] = useState<Property | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const firstRun = useRef(true);
  const qs = queryToString(query);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties${qs}`, { signal });
        if (res.status === 401) {
          router.push("/agent/login");
          return;
        }
        const data = (await res.json()) as ListingResult;
        setResult(data);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          // keep previous result on transient error
        }
      } finally {
        setLoading(false);
      }
    },
    [qs, router]
  );

  // Debounced fetch + shareable URL sync (history API avoids server churn).
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => load(ctrl.signal), 300);
    window.history.replaceState(null, "", `${pathname}${qs}` || pathname);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  const patch = (p: Partial<ListingQuery>) =>
    setQuery((q) => ({ ...q, ...p, page: 1 }));
  const setSort = (sort: SortKey) => setQuery((q) => ({ ...q, sort, page: 1 }));
  const setPage = (page: number) => setQuery((q) => ({ ...q, page }));
  const setPerPage = (perPage: number) =>
    setQuery((q) => ({ ...q, perPage, page: 1 }));
  const reset = () => setQuery({ ...DEFAULT_QUERY });

  const activeCount = activeFilterCount(query);

  return (
    <div className="px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            Properti
          </h1>
          <p className="mt-1 text-sm text-muted">
            Kelola dan telusuri seluruh listing Prime Property.
          </p>
        </div>
        {isSuper && (
          <Link
            href="/agent/properti/baru"
            className={buttonClasses("primary", "md")}
          >
            <Icon.Plus className="h-4 w-4" />
            Tambah Properti
          </Link>
        )}
      </div>

      {/* Toolbar */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-soft sm:inline">Urut</span>
          <NativeSelect
            aria-label="Urutkan"
            value={query.sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full sm:w-52"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="animate-scale-in mt-4 rounded-xl border border-line bg-paper p-5">
          <FilterPanel query={query} onChange={patch} />
        </div>
      )}

      {/* Active chips */}
      <div className="mt-4">
        <FilterChips query={query} onChange={patch} onReset={reset} />
      </div>

      {/* Table */}
      <div className="relative mt-5">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-start justify-center rounded-xl bg-paper/40 pt-24 backdrop-blur-[1px]">
            <Spinner />
          </div>
        )}
        <div className={cn("transition-opacity", loading && "opacity-60")}>
          <PropertyTable
            rows={result.rows}
            sort={query.sort}
            onSortChange={setSort}
            onRowClick={(p) => setDrawer(p)}
            activeId={drawer?.id}
          />
        </div>
      </div>

      {/* Pagination */}
      {result.total > 0 && (
        <div className="mt-6">
          <Pagination
            page={result.page}
            perPage={result.perPage}
            total={result.total}
            totalPages={result.totalPages}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </div>
      )}

      {/* Quick-view drawer */}
      <Drawer
        open={!!drawer}
        onClose={() => setDrawer(null)}
        eyebrow={drawer ? drawer.id : ""}
        title={drawer?.nama_property}
        footer={
          drawer ? (
            <div className="flex w-full items-center justify-between gap-3">
              <Link
                href={`/agent/properti/${drawer.id}`}
                className={buttonClasses("subtle", "sm")}
              >
                Halaman Detail
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
              {isSuper && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/agent/properti/${drawer.id}/edit`}
                    className={buttonClasses("outline", "sm")}
                  >
                    <Icon.Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(drawer)}
                    className={buttonClasses("danger", "sm")}
                  >
                    <Icon.Trash className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              )}
            </div>
          ) : null
        }
      >
        {drawer && <PropertyDetailView property={drawer} />}
      </Drawer>

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeletePropertyDialog
          property={deleteTarget}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            setDrawer(null);
            load();
          }}
        />
      )}
    </div>
  );
}
