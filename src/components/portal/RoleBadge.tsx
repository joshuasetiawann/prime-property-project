import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/types";

export function RoleBadge({
  role,
  className,
}: {
  role: Role;
  className?: string;
}) {
  const isSuper = role === "superadmin";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        isSuper
          ? "border-gold/40 bg-gold-wash text-gold-deep"
          : "border-line bg-mist text-ink-soft",
        className
      )}
    >
      {isSuper ? (
        <Icon.Crown className="h-3.5 w-3.5" />
      ) : (
        <Icon.Shield className="h-3.5 w-3.5" />
      )}
      {isSuper ? "Superadmin" : "Admin"}
    </span>
  );
}
