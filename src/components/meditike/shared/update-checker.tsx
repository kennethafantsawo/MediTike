"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";

/**
 * Version actuelle de l'application MediTike.
 * Doit rester synchronisée avec /public/version.json et package.json.
 */
const CURRENT_VERSION = "v1.5";

/** Endpoint local qui retourne les métadonnées de la dernière release. */
const VERSION_URL = "/version.json";

/** Clés localStorage. */
const LS_LAST_CHECK = "meditike_last_check";
const LS_DISMISSED = "meditike_update_dismissed";

/** Intervalle entre deux vérifications : 24 heures. */
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

/** Schéma de la réponse retournée par /version.json. */
interface VersionManifest {
  version?: string;
  versionCode?: number;
  apkUrl?: string;
  releaseNotes?: string;
  releaseDate?: string;
}

/**
 * Télécharge l'APK puis déclenche son ouverture pour installation.
 *
 * - Sur Android (Capacitor) : le `<a download>` lance le téléchargement
 *   natif, puis l'utilisateur ouvre le fichier pour installer.
 * - Sur web : le navigateur télécharge le fichier APK directement.
 *
 * En cas d'échec (CORS, réseau, etc.) on bascule sur l'ouverture directe
 * du lien dans un nouvel onglet.
 */
async function downloadAndInstall(apkUrl: string): Promise<void> {
  try {
    // Télécharger l'APK sous forme de blob
    const response = await fetch(apkUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();

    // Créer une URL d'objet vers le blob
    const url = URL.createObjectURL(blob);

    // Déclencher le téléchargement / l'installation
    const a = document.createElement("a");
    a.href = url;
    a.download = "MediTike.apk";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Nettoyer l'URL d'objet après un court délai
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    // Fallback : ouvrir directement le lien dans un nouvel onglet
    console.warn("[update-checker] téléchargement blob échoué, fallback:", err);
    window.open(apkUrl, "_blank");
  }
}

/**
 * UpdateChecker
 *
 * Vérifie automatiquement la dernière version publiée sur le site
 * (endpoint /version.json) — plus de dépendance à GitHub.
 *
 * - Une vérification au plus toutes les 24h (timestamp en localStorage).
 * - Si la version distante diffère de la version courante, affiche une
 *   bannière discrète en bas d'écran + vibration courte.
 * - Bouton "Télécharger" : télécharge l'APK depuis /MediTike.apk
 *   (fetch + blob + URL.createObjectURL) et propose l'installation.
 * - Bouton "Plus tard" : ferme la bannière et mémorise la version
 *   refusée pour ne pas réapparaître pour la même release.
 * - Toast sonner à chaque étape (téléchargement, succès, erreur).
 */
export function UpdateChecker() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [apkUrl, setApkUrl] = useState<string>("/MediTike.apk");
  const [releaseNotes, setReleaseNotes] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /**
   * Vérifie la dernière version publiée et décide d'afficher la bannière.
   */
  const checkForUpdates = useCallback(async () => {
    try {
      const res = await fetch(VERSION_URL, { cache: "no-store" });
      if (!res.ok) return;
      const data: VersionManifest = await res.json();
      const remoteTag = data.version?.trim();
      if (!remoteTag) return;

      // Mémoriser le timestamp de la dernière vérification
      try {
        localStorage.setItem(LS_LAST_CHECK, Date.now().toString());
      } catch {
        // localStorage indisponible (mode privé) — on ignore.
      }

      // Comparaison stricte : si la version diffère, une mise à jour
      // est disponible.
      if (remoteTag === CURRENT_VERSION) return;

      // Ne pas réafficher si l'utilisateur a déjà fermé pour cette version
      try {
        const dismissed = localStorage.getItem(LS_DISMISSED);
        if (dismissed === remoteTag) return;
      } catch {
        // Ignore.
      }

      setLatestVersion(remoteTag);
      setApkUrl(data.apkUrl || "/MediTike.apk");
      setReleaseNotes(data.releaseNotes || "");
      setVisible(true);

      // Vibration courte (Android/Capacitor)
      try {
        navigator.vibrate?.(200);
      } catch {
        // Ignore.
      }
    } catch {
      // Silencieux : pas de réseau, serveur injoignable, etc.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Vérifier la date de la dernière vérification
    let shouldCheck = true;
    try {
      const lastCheck = localStorage.getItem(LS_LAST_CHECK);
      if (lastCheck) {
        const elapsed = Date.now() - parseInt(lastCheck, 10);
        if (!Number.isNaN(elapsed) && elapsed < CHECK_INTERVAL_MS) {
          shouldCheck = false;
        }
      }
    } catch {
      // Ignore.
    }

    if (!shouldCheck) return;

    // Petit délai pour ne pas bloquer le premier rendu de l'app
    const timer = window.setTimeout(checkForUpdates, 2500);
    return () => window.clearTimeout(timer);
  }, [checkForUpdates]);

  /**
   * Télécharge l'APK puis propose l'installation.
   */
  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    toast.info("Téléchargement de la mise à jour en cours…");

    try {
      await downloadAndInstall(apkUrl);

      const isNative =
        typeof Capacitor !== "undefined" && Capacitor.isNativePlatform();

      if (isNative) {
        toast.success(
          "Mise à jour téléchargée — ouvrez le fichier APK pour installer.",
          { duration: 6000 }
        );
      } else {
        toast.success(
          "Mise à jour téléchargée — retrouvez le fichier APK dans votre dossier de téléchargements.",
          { duration: 6000 }
        );
      }
    } catch (err) {
      console.error("[update-checker] erreur téléchargement:", err);
      toast.error("Échec du téléchargement. Réessayez plus tard.");
    } finally {
      setDownloading(false);
    }
  }, [apkUrl, downloading]);

  /**
   * Ferme la bannière et mémorise la version pour ne pas réafficher.
   */
  const handleLater = useCallback(() => {
    if (latestVersion) {
      try {
        localStorage.setItem(LS_DISMISSED, latestVersion);
      } catch {
        // Ignore.
      }
    }
    setVisible(false);
  }, [latestVersion]);

  return (
    <AnimatePresence>
      {visible && latestVersion && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-md pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white border border-[#b89968] shadow-2xl rounded-2xl p-4 flex items-start gap-3 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              {downloading ? (
                <Loader2 className="w-5 h-5 text-[#b89968] animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-[#b89968]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">
                Une nouvelle version de MediTike est disponible !
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Version {latestVersion} — vous utilisez {CURRENT_VERSION}.
              </p>
              {releaseNotes && (
                <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">
                  {releaseNotes}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 brand-gradient text-white text-xs font-bold rounded-xl shadow hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Téléchargement…
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Télécharger
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleLater}
                  disabled={downloading}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-60"
                >
                  Plus tard
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLater}
              aria-label="Fermer la bannière de mise à jour"
              className="text-muted-foreground hover:text-foreground p-1 -m-1 shrink-0"
              disabled={downloading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
