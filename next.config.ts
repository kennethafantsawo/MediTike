import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  devIndicators: false,
  // ─── Headers de sécurité ──────────────────────────────────────
  // CSP fonctionnel : 'unsafe-inline' et 'unsafe-eval' nécessaires
  // pour Next.js (hydration, Turbopack, Tailwind CDN)
  // Le reste des headers reste strict
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
          // ── Permissions Policy ──
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=(self), browsing-topics=(), interest-cohort=()",
          },
          // ── CSP : strict mais fonctionnel ──
          // 'unsafe-inline' + 'unsafe-eval' requis par Next.js 16 (Turbopack, hydration)
          // 'strict-dynamic' activé pour les scripts de confiance
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https://cdn.tailwindcss.com",
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
            ].join("; "),
          },
          // ── HSTS ──
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // ── CORP ──
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          // ── DNS prefetch ──
          { key: "X-DNS-Prefetch-Control", value: "off" },
          // ── Download options ──
          { key: "X-Download-Options", value: "noopen" },
          // ── Permitted cross-domain ──
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
    ];
  },
};

export default nextConfig;
