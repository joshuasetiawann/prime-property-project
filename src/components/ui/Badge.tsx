import { cn } from "@/lib/cn";
import { SIAP_LABEL, STATUS_LABEL, TIPE_LABEL } from "@/lib/constants";
import type { Siap, Status, Tipe } from "@/lib/types";

type Tone =
  | "neutral"
  | "gold"
  | "stock"
  | "sold"
  | "huni"
  | "kosong"
  | "renov";

const TONES: Record<Tone, string> = {
  neutral: "bg-mist text-ink-soft border-line",
  gold: "bg-gold-wash text-gold-deep border-gold-soft",
  stock: "bg-stock-bg text-stock-fg border-stock-line",
  sold: "bg-sold-bg text-sold-fg border-sold-line",
  huni: "bg-huni-bg text-huni-fg border-huni-line",
  kosong: "bg-kosong-bg text-kosong-fg border-kosong-line",
  renov: "bg-renov-bg text-renov-fg border-renov-line",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  dot = false,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5 whitespace-nowrap",
        TONES[tone],
        className
      )}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <Badge tone={status === "in_stock" ? "stock" : "sold"} dot className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

const SIAP_TONE: Record<Siap, Tone> = {
  siap_huni: "huni",
  siap_kosong: "kosong",
  siap_huni_renovasi: "renov",
};

export function SiapBadge({
  siap,
  className,
}: {
  siap: Siap;
  className?: string;
}) {
  return (
    <Badge tone={SIAP_TONE[siap]} className={className}>
      {SIAP_LABEL[siap]}
    </Badge>
  );
}

export function TipeBadge({ tipe }: { tipe: Tipe }) {
  return <Badge tone="neutral">{TIPE_LABEL[tipe]}</Badge>;
}
