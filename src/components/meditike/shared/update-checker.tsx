"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

/**
 * Version actuelle de l'application MediTike.
 * Doit rester synchronisée avec le champ `version` de package.json.
 */
const CURRENT_VERSION = "v1.2";

/** Repository GitHub à surveiller (owner/repo). */
const GITHUB_REPO = "kennethafantsawo/MediTike";
const GITHUB_RELEASES_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const GITHUB_DOWNLOAD_URL = `https://github.com/${GITHUB_REPO}/releases/latest`;

/** Clés localStorage. */
const LS_LAST_CHECK = "meditike_last_check";
const LS_DISMISSED = "meditike_update_dismissed";

/** Intervalle entre deux vérifications : 24 heures. */
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 * Compare deux tags de version au format "vX.Y" ou "vX.Y.Z".
 * Retourne true si `remote` est plus récent que `current`.
 */
function isNewerVersion(remote: string, current: string): boolean {
  const normalize = (v: string) => v.trim().replace(/^v/i, "");
  const a = normalize(remote).split(".").map((n) => parseInt(n, 10) || 0);
  const b = normalize(current).split(".").map((n) => parseInt(n, 10) || 0);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const ra = a[i] || 0;
    const rb = b[i] || 0;
    if (ra > rb) return true;
    if (ra < rb) return false;
  }
  return false;
}

interface GitHubRelease {
  tag_name?: string;
  html_url?: string;
  name?: string;
}

/**
 * UpdateChecker
 *
 * Vérifie automatiquement la dernière release GitHub publiée.
 * - Une vérification au plus toutes les 24h (timestamp en localStorage).
 * - Si une version plus récente que la version courante est détectée,
 *   affiche une bannière discrète en bas d'écran.
 * - L'utilisateur peut fermer la bannière ("Plus tard") : la version
 *   est mémorisée dans localStorage pour ne pas réapparaître pour la
 *   même release.
 */
export function UpdateChecker() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  /** Vérifie la dernière release GitHub et décide d'afficher la bannière. */
  const checkForUpdates = useCallback(async () => {
    try {
      const res = await fetch(GITHUB_RELEASES_URL, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
      });
      if (!res.ok) return;
      const data: GitHubRelease = await res.json();
      const remoteTag = data.tag_name?.trim();
      if (!remoteTag) return;

      // Mémoriser le timestamp de la dernière vérification
      try {
        localStorage.setItem(LS_LAST_CHECK, Date.now().toString());
      } catch {
        // localStorage indisponible (mode privé) — on ignore.
      }

      if (!isNewerVersion(remoteTag, CURRENT_VERSION)) return;

      // Ne pas réafficher si l'utilisateur a déjà fermé pour cette version
      try {
        const dismissed = localStorage.getItem(LS_DISMISSED);
        if (dismissed === remoteTag) return;
      } catch {
        // Ignore.
      }

      setLatestVersion(remoteTag);
      setVisible(true);
    } catch {
      // Silencieux : pas de réseau, rate limit GitHub, etc.
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

  /** Ferme la bannière et mémorise la version pour ne pas réafficher. */
  function handleLater() {
    if (latestVersion) {
      try {
        localStorage.setItem(LS_DISMISSED, latestVersion);
      } catch {
        // Ignore.
      }
    }
    setVisible(false);
  }

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
              <Download className="w-5 h-5 text-[#b89968]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">
                Une nouvelle version de MediTike est disponible !
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Version {latestVersion} — vous utilisez {CURRENT_VERSION}.
              </p>
              <div className="flex gap-2 mt-3">
                <a
                  href={GITHUB_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 brand-gradient text-white text-xs font-bold rounded-xl shadow hover:shadow-md active:scale-[0.98] transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Télécharger
                </a>
                <button
                  type="button"
                  onClick={handleLater}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
