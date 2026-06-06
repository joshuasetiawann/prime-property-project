import Link from "next/link";
import { Logomark } from "./Logomark";
import { cn } from "@/lib/cn";

type Tone = "dark" | "light";
type Variant = "full" | "stacked" | "mark";

const SIZES = {
  sm: { mark: 28, prime: "text-base", prop: "text-[8px]", gap: "gap-2.5" },
  md: { mark: 36, prime: "text-xl", prop: "text-[9px]", gap: "gap-3" },
  lg: { mark: 48, prime: "text-2xl", prop: "text-[11px]", gap: "gap-3.5" },
  xl: { mark: 64, prime: "text-4xl", prop: "text-[13px]", gap: "gap-4" },
} as const;

type SizeKey = keyof typeof SIZES;

function Wordmark({
  tone,
  size,
  align = "start",
}: {
  tone: Tone;
  size: SizeKey;
  align?: "start" | "center";
}) {
  const s = SIZES[size];
  const inkText = tone === "light" ? "text-paper" : "text-ink";
  const ruleColor = tone === "light" ? "bg-gold/70" : "bg-gold";
  const propColor = tone === "light" ? "text-gold-bright" : "text-gold-deep";

  return (
    <span
      className={cn(
        "flex flex-col leading-none select-none",
        align === "center" ? "items-center" : "items-start"
      )}
    >
      <span
        className={cn(
          "font-semibold tracking-[0.18em]",
          s.prime,
          inkText
        )}
      >
        PRIME
      </span>
      <span
        className={cn(
          "mt-1 flex items-center gap-1.5",
          align === "center" ? "justify-center" : ""
        )}
      >
        <span className={cn("h-px w-3", ruleColor)} aria-hidden />
        <span
          className={cn(
            "font-medium tracking-[0.42em] uppercase",
            s.prop,
            propColor
          )}
        >
          Property
        </span>
        <span className={cn("h-px w-3", ruleColor)} aria-hidden />
      </span>
    </span>
  );
}

export function Logo({
  variant = "full",
  tone = "dark",
  size = "md",
  className,
  title = "Prime Property",
}: {
  variant?: Variant;
  tone?: Tone;
  size?: SizeKey;
  className?: string;
  title?: string;
}) {
  const s = SIZES[size];

  if (variant === "mark") {
    return (
      <Logomark tone={tone} title={title} height={s.mark} className={className} />
    );
  }

  if (variant === "stacked") {
    return (
      <span className={cn("flex flex-col items-center gap-3", className)}>
        <Logomark tone={tone} title={title} height={Math.round(s.mark * 1.2)} />
        <Wordmark tone={tone} size={size} align="center" />
      </span>
    );
  }

  return (
    <span className={cn("flex items-center", s.gap, className)}>
      <Logomark tone={tone} title={title} height={s.mark} />
      <Wordmark tone={tone} size={size} />
    </span>
  );
}

/**
 * Branded link to the homepage — used in public headers/footers.
 */
export function LogoLink({
  href = "/",
  tone = "dark",
  size = "md",
  className,
}: {
  href?: string;
  tone?: Tone;
  size?: SizeKey;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Prime Property — Beranda"
      className={cn(
        "inline-flex items-center rounded-sm transition-opacity duration-300 hover:opacity-90",
        className
      )}
    >
      <Logo variant="full" tone={tone} size={size} />
    </Link>
  );
}
