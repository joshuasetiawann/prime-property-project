import type { Metadata } from "next";
import { PublicShell } from "@/components/public/PublicShell";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { Icon } from "@/components/icons";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Prime Property melalui telepon, WhatsApp, atau email. Kunjungi kantor kami atau kirim pesan langsung.",
};

const CONTACTS = [
  {
    icon: Icon.MapPin,
    label: "Alamat Kantor",
    value: COMPANY.addressLines.join(", "),
    href: undefined,
  },
  {
    icon: Icon.Phone,
    label: "Telepon",
    value: COMPANY.phoneDisplay,
    href: COMPANY.phoneHref,
  },
  {
    icon: Icon.WhatsApp,
    label: "WhatsApp",
    value: "Chat langsung dengan tim kami",
    href: COMPANY.whatsappHref,
    external: true,
  },
  {
    icon: Icon.Mail,
    label: "Email",
    value: COMPANY.email,
    href: COMPANY.emailHref,
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ properti?: string }>;
}) {
  const { properti } = await searchParams;
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    COMPANY.mapsEmbedQuery
  )}&output=embed`;

  return (
    <PublicShell>
      {/* Header */}
      <section className="border-b border-line bg-mist/50">
        <Container className="pb-14 pt-28 sm:pt-32">
          <div className="flex items-center gap-3">
            <span className="gold-rule-left" aria-hidden />
            <span className="eyebrow">Kontak</span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Mari berbincang tentang properti Anda.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Sampaikan kebutuhan Anda dan tim kami akan menghubungi Anda dengan
            rekomendasi yang paling sesuai.
          </p>
        </Container>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Left — info + map */}
            <div>
              <h2 className="eyebrow mb-6">Informasi Kontak</h2>
              <ul className="space-y-1">
                {CONTACTS.map((c) => {
                  const IconCmp = c.icon;
                  const inner = (
                    <div className="flex items-start gap-4 rounded-xl px-4 py-4 transition-colors duration-300 hover:bg-mist">
                      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-gold">
                        <IconCmp className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-muted-soft">
                          {c.label}
                        </p>
                        <p className="mt-1 text-[15px] font-medium leading-relaxed text-ink">
                          {c.value}
                        </p>
                      </div>
                    </div>
                  );
                  return (
                    <li key={c.label}>
                      {c.href ? (
                        <a
                          href={c.href}
                          target={c.external ? "_blank" : undefined}
                          rel={c.external ? "noopener noreferrer" : undefined}
                          className="block"
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-mist/40 px-5 py-4">
                <Icon.Clock className="h-5 w-5 text-gold-deep" />
                <p className="text-sm text-ink-soft">
                  <span className="font-medium">Jam Operasional</span> ·{" "}
                  {COMPANY.hours}
                </p>
              </div>

              {/* Maps embed */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-line">
                <iframe
                  title="Lokasi Kantor Prime Property"
                  src={mapsSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full"
                />
              </div>
            </div>

            {/* Right — form */}
            <div>
              <div className="rounded-2xl border border-line bg-paper p-7 shadow-sm sm:p-9">
                <h2 className="font-display text-2xl text-ink sm:text-3xl">
                  Kirim Pesan
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Lengkapi formulir berikut. Kolom bertanda{" "}
                  <span className="text-crimson">*</span> wajib diisi.
                </p>
                <div className="mt-7">
                  <ContactForm initialProperty={properti} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
