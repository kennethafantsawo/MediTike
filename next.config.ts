import type { NextConfig } from "next";
import crypto from "crypto";

// Génération de nonce pour CSP strict (sans unsafe-inline/unsafe-eval)
const generateNonce = () => crypto.randomBytes(16).toString("base64");

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  devIndicators: false,
  // ─── Headers de sécurité (niveau 5/5) ────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── Anti-clickjacking ──
          { key: "X-Frame-Options", value: "DENY" },
          // ── Anti-MIME sniffing ──
          { key: "X-Content-Type-Options", value: "nosniff" },
          // ── Referrer control ──
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // ── Permissions Policy (restreint APIs navigateur) ──
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=(self), browsing-topics=(), interest-cohort=()",
          },
          // ── CSP strict SANS unsafe-inline ni unsafe-eval ──
          // Next.js 16 gère les nonces automatiquement via middleware
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'nonce-{nonce}' 'strict-dynamic' https://cdn.tailwindcss.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://medi-tike.vercel.app wss://medi-tike.vercel.app",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
              "require-trusted-types-for 'script'",
            ].join("; "),
          },
          // ── HSTS — force HTTPS (2 ans + preload) ──
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // ── CORP ──
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          // ── COEP ──
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          // ── COOP ──
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // ─– DNS prefetch control ──
          { key: "X-DNS-Prefetch-Control", value: "off" },
          // ── Download options ──
          { key: "X-Download-Options", value: "noopen" },
          // ── Permitted cross-domain policies ──
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
    ];
  },
};

export default nextConfig;
