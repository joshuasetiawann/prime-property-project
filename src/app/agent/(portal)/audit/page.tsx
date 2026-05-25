import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { Icon, type IconName } from "@/components/icons";
import { RoleBadge } from "@/components/portal/RoleBadge";
import { formatDateTime, timeAgo } from "@/lib/format";
import type { AuditAction } from "@/lib/types";

export const metadata: Metadata = { title: "Audit Log" };

const META: Record<AuditAction, { icon: IconName; tone: string }> = {
  login: { icon: "Shield", tone: "text-muted bg-mist" },
  logout: { icon: "Logout", tone: "text-muted bg-mist" },
  create_property: { icon: "Plus", tone: "text-stock-fg bg-stock-bg" },
  update_property: { icon: "Edit", tone: "text-huni-fg bg-huni-bg" },
  delete_property: { icon: "Trash", tone: "text-crimson bg-sold-bg" },
  create_admin: { icon: "Users", tone: "text-renov-fg bg-renov-bg" },
  toggle_admin: { icon: "Users", tone: "text-kosong-fg bg-kosong-bg" },
  reset_password: { icon: "Shield", tone: "text-gold-deep bg-gold-wash" },
};

export default async function AuditPage() {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") redirect("/agent/dashboard");

  const entries = getStore().audit.slice(0, 100);

  return (
    <div className="mx-auto max-w-3xl px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
      <div>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Audit Log</h1>
        <p className="mt-1 text-sm text-muted">
          Catatan perubahan—siapa, kapan, dan apa yang diubah.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-paper px-6 py-16 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mist text-muted-soft">
            <Icon.Scroll className="h-7 w-7" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-ink">
            Belum ada aktivitas
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted">
            Setiap login, pembuatan, perubahan, dan penghapusan akan tercatat di
            sini secara otomatis.
          </p>
        </div>
      ) : (
        <ol className="mt-8 space-y-3">
          {entries.map((entry) => {
            const meta = META[entry.action];
            const IconCmp = Icon[meta.icon];
            return (
              <li
                key={entry.id}
                className="flex gap-4 rounded-xl border border-line bg-paper p-4"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}
                >
                  <IconCmp className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">{entry.summary}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-soft">
                    <span className="font-medium text-ink-soft">
                      {entry.actor}
                    </span>
                    <RoleBadge role={entry.actorRole} />
                    <span title={formatDateTime(entry.timestamp)}>
                      {timeAgo(entry.timestamp)}
                    </span>
                  </div>

                  {entry.changes && entry.changes.length > 0 && (
                    <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                      {entry.changes.map((c, i) => (
                        <li
                          key={i}
                          className="flex flex-wrap items-center gap-2 text-xs"
                        >
                          <span className="font-medium text-ink-soft">
                            {c.field}
                          </span>
                          <span className="rounded bg-sold-bg px-1.5 py-0.5 text-crimson line-through decoration-crimson/40">
                            {c.from}
                          </span>
                          <Icon.ArrowRight className="h-3 w-3 text-muted-soft" />
                          <span className="rounded bg-stock-bg px-1.5 py-0.5 text-stock-fg">
                            {c.to}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
