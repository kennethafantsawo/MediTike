"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Bell, CheckCircle2 } from "lucide-react";

interface PushNotificationsProps {
  type: "client" | "pharmacist";
}

interface RequestData {
  id: string;
  productName: string;
  status: string;
  createdAt: string;
  clientName?: string;
  responses?: Array<{
    id: string;
    createdAt: string;
    pharmacy?: { name: string };
  }>;
}

/**
 * Notifications push système (comme WhatsApp)
 *
 * Logique :
 * 1. Au premier démarrage : enregistre tous les IDs actuels comme "baseline" (SANS notifier)
 * 2. Ensuite : poll toutes les 15s, compare avec le baseline
 * 3. Nouveaux éléments → notification système (si app cachée) ou toast (si app visible)
 * 4. Le polling continue MÊME quand l'app est en arrière-plan
 */
export function PushNotifications({ type }: PushNotificationsProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typeRef = useRef(type);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  // Demander la permission de notifications
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "default") {
      const timer = setTimeout(() => {
        Notification.requestPermission().then((perm) => {
          console.log("[PushNotifications] Permission:", perm);
          if (perm === "granted") {
            toast.success("🔔 Notifications activées ! Vous serez prévenu même en arrière-plan.", {
              duration: 5000,
            });
          }
        });
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      console.log("[PushNotifications] Permission déjà:", Notification.permission);
    }
  }, []);

  // Polling principal
  useEffect(() => {
    /** Affiche une notification système */
    function showSystemNotification(title: string, body: string, url: string) {
      if (typeof window === "undefined") return;

      if ("Notification" in window && Notification.permission !== "granted") {
        console.log("[PushNotifications] Pas de permission pour les notifications système");
        return;
      }

      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: "/logo.svg",
            badge: "/logo.svg",
            vibrate: [200, 100, 200],
            data: { url },
            tag: "meditike-push",
            requireInteraction: false,
            silent: false,
          });
          console.log("[PushNotifications] Notification système affichée via SW");
        }).catch((err) => {
          console.log("[PushNotifications] Erreur SW:", err);
          try {
            const notif = new Notification(title, { body, icon: "/logo.svg" });
            notif.onclick = () => { window.focus(); notif.close(); };
          } catch {}
        });
      } else if ("Notification" in window && Notification.permission === "granted") {
        try {
          const notif = new Notification(title, { body, icon: "/logo.svg", tag: "meditike-push" });
          notif.onclick = () => { window.focus(); notif.close(); };
          console.log("[PushNotifications] Notification système affichée directement");
        } catch (err) {
          console.log("[PushNotifications] Erreur notification:", err);
        }
      }
    }

    async function check() {
      const currentType = typeRef.current;
      const knownKey =
        currentType === "client"
          ? "meditike_push_known_v2"
          : "meditike_push_known_pharma_v2";
      const baselineKey =
        currentType === "client"
          ? "meditike_push_baseline_v2"
          : "meditike_push_baseline_pharma_v2";

      try {
        const res = await fetch("/api/requests");
        if (!res.ok) {
          console.log("[PushNotifications] API error:", res.status);
          return;
        }
        const data = await res.json();
        const requests: RequestData[] = data.requests || [];

        // Charger les IDs connus
        let knownIds: string[] = [];
        try {
          const raw = localStorage.getItem(knownKey);
          knownIds = raw ? JSON.parse(raw) : [];
        } catch {
          knownIds = [];
        }

        // Vérifier si le baseline a déjà été fait
        const baselineDone = localStorage.getItem(baselineKey) === "true";

        if (!baselineDone) {
          // PREMIER DÉMARRAGE : enregistrer tous les IDs actuels comme baseline SANS notifier
          const allIds: string[] = [];
          if (currentType === "client") {
            for (const req of requests) {
              if (req.responses) {
                for (const resp of req.responses) {
                  allIds.push(resp.id);
                }
              }
            }
          } else {
            for (const req of requests) {
              allIds.push(req.id);
            }
          }
          localStorage.setItem(knownKey, JSON.stringify(allIds));
          localStorage.setItem(baselineKey, "true");
          console.log(`[PushNotifications] Baseline défini: ${allIds.length} IDs connus (pas de notification au démarrage)`);
          isInitializedRef.current = true;
          return;
        }

        // Vérifications suivantes : détecter les NOUVEAUX éléments
        const isAppVisible = !document.hidden;
        const newItems: Array<{ title: string; body: string; url: string }> = [];
        const allCurrentIds: string[] = [];

        if (currentType === "client") {
          // Côté client : détecter nouvelles réponses
          for (const req of requests) {
            if (req.responses) {
              for (const resp of req.responses) {
                allCurrentIds.push(resp.id);
                if (!knownIds.includes(resp.id)) {
                  newItems.push({
                    title: "🎉 Réponse reçue sur MediTike",
                    body: `${resp.pharmacy?.name || "Une pharmacie"} a répondu à votre demande de "${req.productName}"`,
                    url: "/",
                  });
                }
              }
            }
          }
        } else {
          // Côté pharmacien : détecter nouvelles demandes
          for (const req of requests) {
            allCurrentIds.push(req.id);
            if (!knownIds.includes(req.id)) {
              newItems.push({
                title: "🔔 Nouvelle demande sur MediTike",
                body: `"${req.productName}"${req.clientName ? ` par ${req.clientName}` : ""}`,
                url: "/",
              });
            }
          }
        }

        // Mettre à jour les IDs connus
        localStorage.setItem(knownKey, JSON.stringify(allCurrentIds));

        // S'il y a de nouveaux éléments, notifier
        if (newItems.length > 0) {
          console.log(`[PushNotifications] ${newItems.length} nouveau(x) élément(s) détecté(s) !`);

          // Vibrer
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }

          // Notifier (max 3 d'un coup)
          for (const item of newItems.slice(0, 3)) {
            if (isAppVisible) {
              // App visible → toast
              toast.success(item.body, {
                duration: 8000,
                icon: currentType === "client" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Bell className="w-4 h-4 text-emerald-600" />
                ),
              });
            }

            // TOUJOURS afficher la notification système (même si app visible)
            // pour que l'utilisateur la voie même s'il est sur une autre app
            showSystemNotification(item.title, item.body, item.url);
          }
        }
      } catch (err) {
        console.log("[PushNotifications] Erreur:", err);
      }
    }

    // Démarrage différé (2s)
    const startDelay = setTimeout(() => {
      console.log("[PushNotifications] Démarrage du polling...");
      check();
      // Polling toutes les 15 secondes — CONTINUE en arrière-plan
      intervalRef.current = setInterval(check, 15000);
    }, 2000);

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
