import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediTike — Pharmacies de garde & médicaments au Togo",
  description:
    "MediTike vous aide à trouver instantanément les pharmacies de garde à Lomé et partout au Togo, et à localiser vos médicaments en temps réel auprès des officines partenaires.",
  keywords: [
    "MediTike",
    "pharmacie de garde",
    "Togo",
    "Lomé",
    "médicaments",
    "officine",
    "santé Togo",
  ],
  authors: [{ name: "MediTike" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "MediTike — Santé pour tous au Togo",
    description:
      "Trouvez les pharmacies de garde et vos médicaments en temps réel, partout au Togo.",
    siteName: "MediTike",
    type: "website",
    locale: "fr_TG",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediTike",
    description: "Pharmacies de garde & médicaments au Togo",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${sora.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
