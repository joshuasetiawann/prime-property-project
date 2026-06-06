import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Memuat"
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold",
        className
      )}
    />
  );
}
