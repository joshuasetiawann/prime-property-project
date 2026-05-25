import Link from "next/link";
import { PublicShell } from "@/components/public/PublicShell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/public/SectionHeading";
import { PropertyShowcaseCard } from "@/components/public/PropertyShowcaseCard";
import { Logomark } from "@/components/brand/Logomark";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import {
  countActiveProperties,
  getFeaturedProperties,
} from "@/lib/properties";
import { KAWASAN_OPTIONS } from "@/lib/constants";

const VALUE_PROPS = [
  {
    icon: Icon.Sparkle,
    title: "Kurasi Properti Premium",
    desc: "Setiap unit diseleksi dengan standar tinggi—legalitas jelas, kondisi prima, dan nilai investasi yang terukur.",
  },
  {
    icon: Icon.MapPin,
    title: "Lokasi Paling Diminati",
    desc: "Portofolio kami berada di kawasan strategis dengan akses, fasilitas, dan prospek pertumbuhan terbaik.",
  },
  {
    icon: Icon.ShieldCheck,
    title: "Proses Transparan & Aman",
    desc: "Data properti akurat dan terdokumentasi. Tidak ada biaya tersembunyi, tidak ada kejutan di tengah jalan.",
  },
  {
    icon: Icon.Handshake,
    title: "Pendampingan Profesional",
    desc: "Agen berpengalaman mendampingi Anda dari pencarian, negosiasi, hingga serah terima dengan tenang.",
  },
];

const STATS = [
  { value: "60+", label: "Properti Aktif" },
  { value: "10", label: "Kawasan Premium" },
  { value: "100%", label: "Legalitas Terverifikasi" },
];

export default function LandingPage() {
  const featured = getFeaturedProperties(6);
  const active = countActiveProperties();

  return (
    <PublicShell overlay>
      {/* ============================ HERO ============================ */}
      <section className="grain relative isolate overflow-hidden bg-ink text-paper">
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div
          className="absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-[0.07] lg:block"
          aria-hidden
        >
          <Logomark tone="light" height={520} />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent"
          aria-hidden
        />

        <Container className="relative pb-24 pt-36 sm:pt-44 lg:pb-32">
          <div className="max-w-3xl">
            <div className="animate-fade-up mb-6 flex items-center gap-3">
              <span className="gold-rule-left" aria-hidden />
              <span className="eyebrow eyebrow-light">
                Properti Premium · Medan &amp; Sekitarnya
              </span>
            </div>

            <h1 className="animate-fade-up delay-1 font-display text-5xl leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Properti Premium untuk Setiap{" "}
              <span className="text-gold-gradient">Babak Penting</span> Hidup
              Anda.
            </h1>

            <p className="animate-fade-up delay-2 mt-7 max-w-xl text-lg leading-relaxed text-paper/70">
              Prime Property menghadirkan koleksi ruko dan villa eksklusif di
              kawasan paling diminati—dikurasi dengan teliti dan dilayani agen
              profesional yang menjaga kepercayaan Anda.
            </p>

            <div className="animate-fade-up delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#properti" className={buttonClasses("primary", "lg")}>
                Lihat Properti
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/kontak"
                className={buttonClasses("outline-light", "lg")}
              >
                Hubungi Kami
              </Link>
            </div>

            <dl className="animate-fade-up delay-4 mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-paper/10 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl text-gold sm:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-paper/55">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* ===================== KAWASAN TRUST STRIP ===================== */}
      <section className="border-b border-line bg-mist/60">
        <Container className="flex flex-wrap items-center gap-x-8 gap-y-3 py-6">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-soft">
            Dipercaya di kawasan
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {KAWASAN_OPTIONS.slice(0, 7).map((k) => (
              <span key={k} className="text-sm font-medium text-ink-soft">
                {k}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================== FEATURED PROPERTIES ===================== */}
      <section id="properti" className="scroll-mt-24 bg-paper py-20 lg:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Properti Unggulan"
              title="Koleksi pilihan yang siap Anda miliki"
              description="Cuplikan portofolio terbaik kami. Hubungi tim untuk ketersediaan terkini dan penawaran lengkap."
            />
            <p className="hidden text-sm text-muted sm:block">
              {active} properti aktif dalam katalog
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyShowcaseCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/kontak" className={buttonClasses("dark", "md")}>
              Konsultasikan Kebutuhan Anda
              <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ======================= WHY PRIME PROPERTY ==================== */}
      <section className="bg-mist py-20 lg:py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Mengapa Prime Property"
            title="Kepercayaan yang dibangun di atas detail"
            description="Empat alasan klien memilih kami untuk keputusan properti paling penting mereka."
            className="mb-14"
          />
          <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((vp, i) => {
              const IconCmp = vp.icon;
              return (
                <div
                  key={vp.title}
                  className="group flex flex-col bg-paper p-7 transition-colors duration-300 hover:bg-gold-wash/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-gold transition-transform duration-500 group-hover:-translate-y-0.5">
                      <IconCmp className="h-6 w-6" />
                    </span>
                    <span className="font-display text-3xl text-line-strong">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-ink">
                    {vp.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {vp.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============================ CTA BAND ========================= */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
        <Container className="relative py-20 text-center lg:py-24">
          <SectionHeading
            align="center"
            tone="light"
            eyebrow="Langkah Berikutnya"
            title="Siap menemukan properti yang tepat?"
            description="Tim Prime Property siap membantu Anda menemukan ruko atau villa yang sesuai kebutuhan dan anggaran."
            className="mb-9"
          />
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/kontak" className={buttonClasses("primary", "lg")}>
              Hubungi Kami
              <Icon.ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tentang-kami"
              className={buttonClasses("outline-light", "lg")}
            >
              Tentang Prime Property
            </Link>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
