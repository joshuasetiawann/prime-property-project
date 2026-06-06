import { cn } from "@/lib/cn";

type Tone = "dark" | "light";

const VIEW_W = 92;
const VIEW_H = 104;

/**
 * Prime Property emblem — a vector reconstruction of the brand mark:
 * an ascending gold blade, twin crimson seams, and a dominant ink spire/peak,
 * evoking architecture and upward growth.
 *
 * The ink ("P" spire) shapes use `currentColor` so the mark stays visible on
 * both light and dark backgrounds. Gold and crimson are fixed brand accents.
 *
 * tone="dark"  → ink elements render dark   (for light backgrounds)
 * tone="light" → ink elements render white  (for dark backgrounds)
 */
export function Logomark({
  className,
  tone = "dark",
  height = 36,
  title = "Prime Property",
}: {
  className?: string;
  tone?: Tone;
  height?: number;
  title?: string;
}) {
  const inkColor = tone === "light" ? "#FFFFFF" : "#1A1A1A";
  const width = Math.round((height * VIEW_W) / VIEW_H);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={width}
      height={height}
      role="img"
      aria-label={title}
      className={cn("block shrink-0", className)}
      style={{ color: inkColor }}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="pp-gold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#A98A4B" />
          <stop offset="0.55" stopColor="#C9A961" />
          <stop offset="1" stopColor="#DDC187" />
        </linearGradient>
        <linearGradient id="pp-crimson" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C75151" />
          <stop offset="1" stopColor="#8E2C2C" />
        </linearGradient>
      </defs>

      {/* Gold ascending blade */}
      <path d="M6 92 L30 30 L44 30 L20 92 Z" fill="url(#pp-gold)" />

      {/* Twin crimson seams */}
      <rect x="46.5" y="44" width="5" height="48" fill="url(#pp-crimson)" />
      <rect x="53.5" y="44" width="5" height="48" fill="url(#pp-crimson)" />

      {/* Ink spire / peak (the dominant "P" form) */}
      <path
        d="M60 92 L60 30 L74 8 L88 30 L88 92 L78 92 L78 40 L74 35 L70 40 L70 92 Z"
        fill="currentColor"
      />
    </svg>
  );
}
