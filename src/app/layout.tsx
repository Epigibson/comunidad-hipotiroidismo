import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TiroVida — Comunidad de Hipotiroidismo",
    template: "%s | TiroVida",
  },
  description:
    "Plataforma de seguimiento y comunidad para personas con Hipotiroidismo, Hashimoto y SOP. Registra tus síntomas, resultados de laboratorio y conecta con una comunidad que te entiende.",
  keywords: [
    "hipotiroidismo",
    "hashimoto",
    "tiroides",
    "SOP",
    "TSH",
    "T4",
    "levotiroxina",
    "comunidad",
    "salud",
    "tracking",
  ],
  authors: [{ name: "TiroVida" }],
  openGraph: {
    title: "TiroVida — Comunidad de Hipotiroidismo",
    description:
      "Registra tus síntomas, comparte con tu comunidad y genera reportes para tu endocrinólogo.",
    type: "website",
    locale: "es_MX",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "TiroVida",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6a4aa2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${manrope.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
