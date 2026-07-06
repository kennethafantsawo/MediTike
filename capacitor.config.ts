import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Configuration Capacitor pour MediTike.
 *
 * Mode hybride : l'APK charge l'app depuis l'URL Vercel (webview).
 * Avantages :
 * - Pas besoin d'export statique (préserve routes API + middleware)
 * - Mises à jour automatiques (pas besoin de republisher l'APK)
 * - L'APK est un wrapper natif avec accès aux fonctionnalités mobiles
 *
 * Pour changer l'URL de production, modifiez server.androidScheme + url ci-dessous.
 */
const config: CapacitorConfig = {
  appId: "tg.meditike.app",
  appName: "MediTike",
  webDir: "out",
  backgroundColor: "#0f5132",
  server: {
    // URL de production Vercel — l'APK charge l'app depuis ici
    url: "https://medi-tike.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: "always",
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#0f5132",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
