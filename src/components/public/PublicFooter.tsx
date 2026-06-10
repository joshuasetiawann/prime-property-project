import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { COMPANY } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/properti", label: "Properti" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path d="M4 5c0 6 5 11 11 11l1.5-2.5-3-2-1.5 1.2A8 8 0 0 1 7.3 8L8.5 6.5l-2-3L4 5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path d="M10 3.2A6.8 6.8 0 0 0 4 13.4L3.3 16.7l3.4-.7A6.8 6.8 0 1 0 10 3.2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7.6 7.2c-.2 0-.5 0-.6.3-.2.3-.6.9-.6 1.7s.6 1.7 1.7 2.7c1.4 1.2 2.6 1.4 3.2 1.3.5-.1 1-.6 1.1-1 .1-.3.1-.6 0-.7l-1.2-.6c-.2-.1-.4 0-.5.1l-.4.5c-.6-.3-1.3-.9-1.6-1.5l.4-.4c.1-.2.2-.3.1-.5l-.5-1.2c-.1-.2-.3-.2-.4-.2Z" fill="currentColor" />
    </svg>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-paper/70">
      <div className="gold-rule absolute inset-x-0 top-0 opacity-60" aria-hidden />
      <Container className="py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo variant="full" tone="light" size="md" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/55">
              Menghadirkan ruko dan villa premium di kawasan terbaik. Setiap
              transaksi dilayani dengan ketelitian dan kepercayaan.
            </p>
          </div>

          {/* Navigasi */}
          <nav aria-label="Tautan footer">
            <h3 className="eyebrow eyebrow-light mb-4">Navigasi</h3>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper/70 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/agent/login"
                  className="text-sm text-paper/70 transition-colors hover:text-gold"
                >
                  Login Agent
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kontak */}
          <div>
            <h3 className="eyebrow eyebrow-light mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm text-paper/70">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-gold">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M10 18s6-5.3 6-9.5A6 6 0 0 0 4 8.5C4 12.7 10 18 10 18Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
                <span className="leading-relaxed">
                  {COMPANY.addressLines.join(", ")}
                </span>
              </li>
              <li>
                <a href={COMPANY.phoneHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                  <span className="text-gold"><PhoneIcon /></span>
                  {COMPANY.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={COMPANY.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-gold">
                  <span className="text-gold"><WhatsAppIcon /></span>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={COMPANY.emailHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                  <span className="text-gold"><MailIcon /></span>
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-7 text-xs text-paper/45 sm:flex-row">
          <p>© 2026 Prime Property. All rights reserved.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:justify-end">
            <span>{COMPANY.legalName}</span>
            <span aria-hidden className="text-paper/25">·</span>
            <span>{COMPANY.hours}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
