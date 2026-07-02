import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Configuration Capacitor pour build APK Android et IPA iOS.
 *
 * Étapes pour activer le build mobile:
 * 1. Installer Capacitor:
 *    bun add @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
 *    bunx cap init MediTike tg.meditike.app --web-dir=out
 *
 * 2. Build le web:
 *    bun run build
 *
 * 3. Ajouter plateformes:
 *    bunx cap add android
 *    bunx cap add ios
 *
 * 4. Sync le code web vers les plateformes:
 *    bunx cap sync
 *
 * 5. Build APK (Android):
 *    cd android && ./gradlew assembleDebug
 *    # APK généré dans android/app/build/outputs/apk/debug/app-debug.apk
 *
 * 6. Build iOS (nécessite macOS + Xcode):
 *    cd ios && pod install
 *    bunx cap open ios
 *    # Dans Xcode: Product > Archive
 *
 * 7. Pour mettre à jour après changements web:
 *    bun run build && bunx cap sync
 */
const config: CapacitorConfig = {
  appId: "tg.meditike.app",
  appName: "MediTike",
  webDir: "out",
  backgroundColor: "#0f5132",
  server: {
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
      launchShowDuration: 1500,
      backgroundColor: "#0f5132",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Camera: {
      permissions: ["Camera"],
    },
  },
};

export default config;
