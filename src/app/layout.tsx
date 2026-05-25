import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://primeproperty.id"),
  title: {
    default: "Prime Property — Properti Premium Pilihan Anda",
    template: "%s · Prime Property",
  },
  description:
    "Prime Property menghadirkan ruko dan villa premium dengan layanan agen profesional. Temukan properti pilihan di kawasan terbaik dengan kepercayaan dan ketelitian.",
  keywords: [
    "Prime Property",
    "properti premium",
    "ruko",
    "villa",
    "agen properti",
    "investasi properti",
  ],
  openGraph: {
    title: "Prime Property — Properti Premium Pilihan Anda",
    description:
      "Ruko & villa premium di kawasan terbaik. Dilayani agen profesional Prime Property.",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
