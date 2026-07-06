"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, Download } from "lucide-react";

/**
 * Événement `beforeinstallprompt` — non standardisé, on déclare un type
 * minimal pour pouvoir appeler `prompt()` et lire `userChoice`.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "meditike_pwa_install_dismissed_at";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

/**
 * PwaInstallPrompt
 *
 * - Enregistre le service worker au montage (active le mode hors-ligne).
 * - Détecte l'événement `beforeinstallprompt` (app installable).
 * - Affiche une bannière discrète en bas d'écran proposant l'installation.
 * - Mémorise le refus pendant 7 jours dans localStorage.
 */
export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  // ── Enregistrement du service worker ──────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silencieux : l'échec d'enregistrement ne doit pas casser l'UI.
    });
  }, []);

  // ── Détection de l'événement beforeinstallprompt ──────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    function handler(e: Event) {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(evt);

      // Ne pas réafficher si l'utilisateur a refusé il y a moins de 7 jours.
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (!Number.isNaN(elapsed) && elapsed < DISMISS_DURATION_MS) return;
      }
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────
  async function handleInstall() {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      }
    } catch {
      // Silencieux : on garde la bannière en cas d'échec.
    } finally {
      setDeferredPrompt(null);
    }
  }

  function handleLater() {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // localStorage peut être indisponible (mode privé) — on ignore.
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md pointer-events-none"
        >
          <div className="bg-white border border-emerald-200 shadow-2xl rounded-2xl p-4 flex items-start gap-3 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">
                Installer MediTike sur votre téléphone
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Accédez-y même hors-ligne, comme une application.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstall}
                  className="inline-flex items-center gap-1.5 px-4 py-2 brand-gradient text-white text-xs font-bold rounded-xl shadow hover:shadow-md active:scale-[0.98] transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Installer
                </button>
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
              aria-label="Fermer la bannière d'installation"
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
