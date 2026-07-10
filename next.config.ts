import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  devIndicators: false,
  // ─── Headers de sécurité ──────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Empêche le clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Contrôle du Referrer
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions Policy (restreint les APIs navigateur)
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=(self), browsing-topics=()",
          },
          // Content Security Policy — restreint les sources de contenu
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com",
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
          // HSTS — force HTTPS
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // CORP — isole les ressources
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
