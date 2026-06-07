import type { Metadata } from "next";
import { PublicShell } from "@/components/public/PublicShell";
import { Container } from "@/components/ui/Container";
import { PublicBrowse } from "@/components/public/PublicBrowse";
import { listProperties } from "@/lib/properties";
import { parseListingQuery } from "@/lib/query";

export const metadata: Metadata = {
  title: "Properti",
  description:
    "Jelajahi koleksi ruko dan villa premium Prime Property. Filter berdasarkan kawasan, tipe, harga, dan temukan properti idaman Anda.",
};

export default async function PropertiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  if (!params.has("perPage")) params.set("perPage", "12");

  const query = parseListingQuery(params);
  const result = listProperties(query);

  return (
    <PublicShell>
      <section className="border-b border-line bg-mist/40">
        <Container size="wide" className="pb-12 pt-28 sm:pt-32">
          <div className="flex items-center gap-3">
            <span className="gold-rule-left" aria-hidden />
            <span className="eyebrow">Marketplace Properti</span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Jelajahi properti premium kami.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Telusuri ruko dan villa terbaik di kawasan pilihan. Gunakan filter
            untuk menemukan yang paling sesuai dengan kebutuhan Anda.
          </p>
        </Container>
      </section>

      <section className="bg-paper py-12 lg:py-16">
        <Container size="wide">
          <PublicBrowse initialQuery={query} initialResult={result} />
        </Container>
      </section>
    </PublicShell>
  );
}
