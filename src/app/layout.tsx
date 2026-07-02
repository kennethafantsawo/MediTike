import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  title: "MediTike — Demandez vos médicaments aux pharmacies du Togo",
  description: "Plateforme officielle togolaise pour demander vos médicaments auprès des pharmacies de garde. Sécurisé, en temps réel, photos auto-supprimées.",
  keywords: ["MediTike", "pharmacie", "garde", "Togo", "Lomé", "médicaments", "santé"],
  authors: [{ name: "MediTike" }],
  icons: { icon: "/logo.svg" },
  manifest: "/manifest.json",
  openGraph: {
    title: "MediTike — Santé pour tous au Togo",
    description: "Demandez vos médicaments aux pharmacies de garde, en temps réel.",
    siteName: "MediTike",
    type: "website",
    locale: "fr_TG",
  },
  twitter: { card: "summary_large_image", title: "MediTike", description: "Pharmacies de garde & médicaments au Togo" },
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${sora.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
