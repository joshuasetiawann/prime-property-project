// =========================================================================
// Prime Property — Indonesian formatters
// Currency: Rp 1.350.000.000  ·  Dates: 24 Mei 2026 / 24/05/2026
// Timezone: Asia/Jakarta (WIB)
// =========================================================================

const ID_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** Full rupiah with dot separators — "Rp 1.350.000.000". */
export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const rounded = Math.round(value);
  return `Rp ${rounded.toLocaleString("id-ID")}`;
}

/** Compact rupiah for tight UI — "Rp 1,35 M" / "Rp 850 Jt". */
export function formatRupiahShort(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (value >= 1_000_000_000) {
    const n = value / 1_000_000_000;
    return `Rp ${n.toFixed(n % 1 === 0 ? 0 : 2).replace(".", ",")} M`;
  }
  if (value >= 1_000_000) {
    const n = value / 1_000_000;
    return `Rp ${n.toFixed(n % 1 === 0 ? 0 : 0).replace(".", ",")} Jt`;
  }
  return formatRupiah(value);
}

/** Parse a free-typed rupiah string ("1.350.000.000" / "Rp 1,3M") to integer. */
export function parseRupiah(input: string): number | null {
  if (!input) return null;
  const cleaned = input.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Insert dot thousand separators while typing — "1350000000" → "1.350.000.000". */
export function groupThousands(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function jakartaParts(input: string | Date): {
  d: number;
  m: number;
  y: number;
  hh: string;
  mm: string;
} {
  const date = typeof input === "string" ? new Date(input) : input;
  // Render the instant in Asia/Jakarta regardless of server timezone.
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    d: Number(get("day")),
    m: Number(get("month")),
    y: Number(get("year")),
    hh: get("hour"),
    mm: get("minute"),
  };
}

/** "24 Mei 2026" */
export function formatDateLong(input: string | Date): string {
  const { d, m, y } = jakartaParts(input);
  if (!d) return "—";
  return `${d} ${ID_MONTHS[m - 1]} ${y}`;
}

/** "24/05/2026" */
export function formatDateShort(input: string | Date): string {
  const { d, m, y } = jakartaParts(input);
  if (!d) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d)}/${pad(m)}/${y}`;
}

/** "24 Mei 2026, 14.30 WIB" */
export function formatDateTime(input: string | Date): string {
  const { d, m, y, hh, mm } = jakartaParts(input);
  if (!d) return "—";
  return `${d} ${ID_MONTHS[m - 1]} ${y}, ${hh}.${mm} WIB`;
}

/** Dimensions — "4,5 × 21,5 m". */
export function formatDimensions(lebar: number, panjang: number): string {
  return `${formatMeter(lebar)} × ${formatMeter(panjang)} m`;
}

/** Land area — "96,75 m²". */
export function formatArea(lebar: number, panjang: number): string {
  const area = lebar * panjang;
  return `${formatMeter(area)} m²`;
}

/** Number with comma decimals, trims trailing zeros — "4,5" / "6" / "4,25". */
export function formatMeter(n: number): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n
    .toLocaleString("id-ID", { maximumFractionDigits: 2 })
    .replace(/,00$/, "");
}

/** "2 lantai" / "2,5 lantai" */
export function formatTingkat(n: number): string {
  return `${formatMeter(n)} lantai`;
}

/** Join hadap list — "Utara, Timur". */
export function formatHadap(hadap: string[]): string {
  return hadap.length ? hadap.join(", ") : "—";
}

/** Relative time in Indonesian — "3 jam lalu". */
export function timeAgo(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const diff = Date.now() - date.getTime();
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return "baru saja";
  if (min < 60) return `${min} menit lalu`;
  if (hr < 24) return `${hr} jam lalu`;
  if (day < 30) return `${day} hari lalu`;
  return formatDateShort(date);
}
