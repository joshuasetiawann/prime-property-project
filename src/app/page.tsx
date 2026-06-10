import Link from "next/link";
import { PublicShell } from "@/components/public/PublicShell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/public/SectionHeading";
import { PropertyShowcaseCard } from "@/components/public/PropertyShowcaseCard";
import { HeroShowcase } from "@/components/public/HeroShowcase";
import { QuickSearch } from "@/components/public/QuickSearch";
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
    title: "Properti Terkurasi",
    desc: "Setiap unit diseleksi dengan standar tinggi—legalitas jelas, kondisi prima, nilai investasi terukur.",
  },
  {
    icon: Icon.MapPin,
    title: "Kawasan Strategis",
    desc: "Portofolio kami berada di lokasi dengan akses, fasilitas, dan prospek pertumbuhan terbaik.",
  },
  {
    icon: Icon.ShieldCheck,
    title: "Legalitas Terverifikasi",
    desc: "Dokumen dan status setiap properti diperiksa saksama. Tanpa biaya tersembunyi.",
  },
  {
    icon: Icon.Handshake,
    title: "Dibantu Agent Profesional",
    desc: "Agen berpengalaman mendampingi Anda dari pencarian hingga serah terima dengan tenang.",
  },
];

const TRUST = [
  { icon: Icon.Building, value: "60+", label: "Properti Aktif" },
  { icon: Icon.MapPin, value: "10", label: "Kawasan Premium" },
  { icon: Icon.ShieldCheck, value: "100%", label: "Legalitas Terverifikasi" },
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
          className="pointer-events-none absolute left-0 top-0 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl sm:h-[32rem] sm:w-[32rem]"
          aria-hidden
        />

        <Container size="wide" className="relative pb-24 pt-24 sm:pb-28 sm:pt-36 lg:pb-36">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            {/* Copy */}
            <div className="min-w-0">
              <div className="animate-fade-up mb-5 flex min-w-0 items-center gap-3 sm:mb-6">
                <span className="gold-rule-left hidden shrink-0 min-[380px]:block" aria-hidden />
                <span className="eyebrow eyebrow-light min-w-0 text-[0.62rem] min-[380px]:text-[0.68rem] sm:text-[0.72rem]">
                  Marketplace Properti Premium · Medan
                </span>
              </div>

              <h1 className="animate-fade-up delay-1 font-display text-[2.7rem] leading-[1.05] tracking-tight min-[390px]:text-5xl sm:text-6xl lg:text-[4.2rem]">
                Temukan Properti{" "}
                <span className="text-gold-gradient">Premium</span> Pilihan Anda.
              </h1>

              <p className="animate-fade-up delay-2 mt-5 max-w-xl text-base leading-relaxed text-paper/70 sm:mt-6 sm:text-lg">
                Jelajahi koleksi ruko dan villa eksklusif di kawasan paling
                diminati—dikurasi dengan teliti, lengkap dengan harga
                transparan dan pendampingan agen profesional.
              </p>

              <div className="animate-fade-up delay-3 mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Link href="/properti" className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
                  Lihat Properti
                  <Icon.ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/kontak"
                  className={buttonClasses("outline-light", "lg", "w-full sm:w-auto")}
                >
                  Hubungi Kami
                </Link>
              </div>

              <dl className="animate-fade-up delay-4 mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-paper/10 pt-6 min-[390px]:gap-4 sm:mt-12 sm:gap-6 sm:pt-8">
                {TRUST.map((s) => (
                  <div key={s.label}>
                    <dt className="font-display text-2xl text-gold min-[390px]:text-3xl sm:text-4xl">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-[10px] uppercase leading-snug tracking-wide text-paper/55 min-[390px]:text-xs min-[390px]:tracking-wider">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Visual */}
            <div className="animate-fade-up delay-2 min-w-0 lg:pl-6">
              {featured.length >= 2 && (
                <HeroShowcase primary={featured[0]} secondary={featured[1]} />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ===================== QUICK SEARCH (overlap) ================= */}
      <Container size="wide" className="relative z-10 -mt-12 sm:-mt-14">
        <QuickSearch />
      </Container>

      {/* ===================== KAWASAN TRUST STRIP ===================== */}
      <section className="bg-paper">
        <Container size="wide" className="py-12">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-soft">
              Dipercaya di kawasan
            </span>
            {KAWASAN_OPTIONS.slice(0, 8).map((k) => (
              <span key={k} className="text-sm font-medium text-ink-soft">
                {k}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================== FEATURED PROPERTIES ===================== */}
      <section id="properti" className="scroll-mt-24 bg-mist/40 py-20 lg:py-28">
        <Container size="wide">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Properti Unggulan"
              title="Koleksi pilihan yang siap Anda miliki"
              description="Cuplikan portofolio terbaik kami—klik untuk melihat detail dan informasi harga lengkap."
            />
            <Link
              href="/properti"
              className={buttonClasses("outline", "md", "w-full shrink-0 sm:w-auto")}
            >
              Lihat Semua ({active})
              <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <PropertyShowcaseCard
                key={property.id}
                property={property}
                eager={i < 3}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ======================= WHY PRIME PROPERTY ==================== */}
      <section className="bg-paper py-20 lg:py-28">
        <Container size="wide">
          <SectionHeading
            align="center"
            eyebrow="Mengapa Prime Property"
            title="Kepercayaan yang dibangun di atas detail"
            description="Empat alasan klien memilih kami untuk keputusan properti paling penting mereka."
            className="mb-14"
          />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((vp, i) => {
              const IconCmp = vp.icon;
              return (
                <div
                  key={vp.title}
                  className="group flex flex-col bg-paper p-7 transition-colors duration-300 hover:bg-gold-wash/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-gold transition-transform duration-500 group-hover:-translate-y-0.5">
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

      {/* ========================= ABOUT PREVIEW ====================== */}
      <section className="bg-ink py-20 text-paper lg:py-28">
        <Container size="wide">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-2xl border border-paper/10">
              <HeroAbout />
            </div>
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="gold-rule-left" aria-hidden />
                <span className="eyebrow eyebrow-light">Tentang Kami</span>
              </div>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                Agensi properti yang dibangun di atas kepercayaan.
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-paper/65">
                Prime Property memadukan pemahaman pasar yang mendalam dengan
                pelayanan personal. Kami menempatkan ketelitian data dan
                transparansi sebagai fondasi—agar setiap keputusan properti Anda
                diambil dengan tenang dan percaya diri.
              </p>
              <Link
                href="/tentang-kami"
                className={buttonClasses("outline-light", "md") + " mt-8"}
              >
                Pelajari Lebih Lanjut
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================ CTA BAND ========================= */}
      <section className="bg-paper">
        <Container size="wide" className="py-16 lg:py-20">
          <div className="grain relative isolate overflow-hidden rounded-2xl bg-ink px-5 py-12 text-center text-paper sm:rounded-3xl sm:px-8 sm:py-14 lg:px-16 lg:py-20">
            <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <span className="eyebrow eyebrow-light">Langkah Berikutnya</span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl">
                Siap menemukan properti yang tepat?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-paper/65">
                Tim Prime Property siap membantu Anda menemukan ruko atau villa
                yang sesuai kebutuhan dan anggaran.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/kontak" className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
                  <Icon.WhatsApp className="h-4 w-4" />
                  Hubungi via WhatsApp
                </Link>
                <Link
                  href="/properti"
                  className={buttonClasses("outline-light", "lg", "w-full sm:w-auto")}
                >
                  Jelajahi Properti
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}

// Brand-story visual for the about preview (bundled scene).
function HeroAbout() {
  return (
    <div className="relative aspect-[16/11] w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/properties/p09.jpg"
        alt="Properti premium Prime Property"
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-ink/10 to-transparent" />
    </div>
  );
}
