import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/public/PublicShell";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/public/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import { Logomark } from "@/components/brand/Logomark";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal Prime Property — agensi properti premium dengan komitmen pada kurasi, transparansi, dan pelayanan terpercaya.",
};

const MISI = [
  "Menyediakan portofolio properti yang terkurasi dengan legalitas dan kualitas terjamin.",
  "Memberikan pendampingan profesional di setiap tahap, dari pencarian hingga serah terima.",
  "Menjaga transparansi data dan harga sehingga setiap keputusan diambil dengan percaya diri.",
  "Membangun hubungan jangka panjang yang dilandasi integritas dan kepercayaan.",
];

const NILAI = [
  {
    icon: Icon.ShieldCheck,
    title: "Integritas",
    desc: "Kami menjunjung kejujuran di setiap interaksi—tidak ada informasi yang disembunyikan.",
  },
  {
    icon: Icon.Sparkle,
    title: "Keunggulan",
    desc: "Standar tinggi pada kualitas properti, layanan, dan pengalaman klien.",
  },
  {
    icon: Icon.Search,
    title: "Ketelitian",
    desc: "Detail menentukan kepercayaan. Setiap data kami verifikasi dengan saksama.",
  },
  {
    icon: Icon.Handshake,
    title: "Klien Utama",
    desc: "Kebutuhan dan ketenangan Anda menjadi pusat dari setiap keputusan kami.",
  },
];

export default function AboutPage() {
  return (
    <PublicShell>
      {/* Page header */}
      <section className="border-b border-line bg-mist/50">
        <Container className="pb-14 pt-28 sm:pt-32">
          <div className="flex items-center gap-3">
            <span className="gold-rule-left" aria-hidden />
            <span className="eyebrow">Tentang Kami</span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Agensi properti yang dibangun di atas kepercayaan.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Sejak awal, Prime Property hadir dengan satu keyakinan: keputusan
            properti yang baik lahir dari informasi yang jujur dan pelayanan
            yang tulus.
          </p>
        </Container>
      </section>

      {/* Profil — 2 columns */}
      <section className="bg-paper py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Profil Perusahaan"
                title="Mendampingi langkah penting Anda di dunia properti"
              />
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-muted">
                <p>
                  Prime Property adalah agensi properti premium yang berfokus
                  pada penjualan ruko dan villa di kawasan-kawasan paling
                  diminati. Kami memadukan pemahaman pasar yang mendalam dengan
                  pelayanan yang personal dan profesional.
                </p>
                <p>
                  Berbeda dari pendekatan konvensional, kami menempatkan
                  ketelitian data dan transparansi sebagai fondasi. Setiap
                  properti dalam katalog kami melalui proses verifikasi
                  legalitas dan kondisi, sehingga Anda dapat mengambil keputusan
                  dengan tenang.
                </p>
                <p>
                  Tim agen kami bukan sekadar perantara, melainkan mitra yang
                  mendampingi Anda dari pencarian pertama hingga kunci berpindah
                  tangan.
                </p>
              </div>
            </div>

            {/* Quote / visual card */}
            <div className="relative">
              <div className="grain relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-ink p-10 text-paper">
                <div className="hero-grid absolute inset-0 opacity-50" aria-hidden />
                <div
                  className="absolute -right-8 -top-8 opacity-[0.08]"
                  aria-hidden
                >
                  <Logomark tone="light" height={220} />
                </div>
                <Logomark tone="light" height={48} />
                <blockquote className="relative mt-10">
                  <p className="font-display text-2xl leading-snug text-paper sm:text-3xl">
                    “Kami percaya properti terbaik bukan hanya soal lokasi,
                    melainkan soal kepercayaan yang menyertainya.”
                  </p>
                  <footer className="mt-6 text-sm text-paper/60">
                    — Filosofi Prime Property
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Visi & Misi */}
      <section className="bg-mist py-20 lg:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="rounded-2xl border border-line bg-paper p-9">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold-wash text-gold-deep">
                <Icon.Compass className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-3xl text-ink">Visi</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Menjadi agensi properti premium paling tepercaya di Sumatera
                Utara—rujukan utama bagi mereka yang mencari hunian dan
                investasi properti berkualitas, dengan pelayanan yang menjunjung
                integritas.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-9">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold-wash text-gold-deep">
                <Icon.Check className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-3xl text-ink">Misi</h2>
              <ul className="mt-4 space-y-3.5">
                {MISI.map((m) => (
                  <li key={m} className="flex items-start gap-3">
                    <span className="mt-1 text-gold">
                      <Icon.Check className="h-4 w-4" />
                    </span>
                    <span className="text-[15px] leading-relaxed text-muted">
                      {m}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Nilai perusahaan */}
      <section className="bg-paper py-20 lg:py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Nilai Perusahaan"
            title="Prinsip yang memandu setiap langkah kami"
            className="mb-14"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {NILAI.map((n) => {
              const IconCmp = n.icon;
              return (
                <div
                  key={n.title}
                  className="card-lift rounded-xl border border-line bg-paper p-7 text-center"
                >
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-gold">
                    <IconCmp className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {n.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-mist">
        <Container className="py-16">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-line bg-paper px-8 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Mari berbincang tentang properti Anda
              </h2>
              <p className="mt-2 text-sm text-muted">
                Tim kami siap mendengar kebutuhan dan membantu menemukan pilihan
                terbaik.
              </p>
            </div>
            <Link
              href="/kontak"
              className={buttonClasses("primary", "lg") + " shrink-0"}
            >
              Hubungi Kami
              <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
