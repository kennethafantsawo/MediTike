"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Bell, CheckCircle2, BellRing } from "lucide-react";

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
 * - Demande la permission de notifications au démarrage
 * - Continue le polling MÊME quand l'app est en arrière-plan
 * - Affiche des notifications système (Notification API) quand l'app n'est pas visible
 * - Affiche des toasts quand l'app est visible
 * - Le service worker gère l'affichage et le clic sur notification
 */
export function PushNotifications({ type }: PushNotificationsProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typeRef = useRef(type);
  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  // Demander la permission au démarrage
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "default") {
      // Attendre 5s après le chargement pour ne pas être trop intrusif
      const timer = setTimeout(() => {
        Notification.requestPermission().then((perm) => {
          setPermission(perm);
          if (perm === "granted") {
            toast.success("🔔 Notifications activées ! Vous serez prévenu même quand l'app est en arrière-plan.", {
              duration: 5000,
            });
          }
        });
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setPermission(Notification.permission);
    }
  }, []);

  // Polling + notifications
  useEffect(() => {
    let isChecking = false;

    async function checkForNewItems() {
      if (isChecking) return; // Éviter les chevauchements
      isChecking = true;

      try {
        const currentType = typeRef.current;
        const res = await fetch("/api/requests");
        if (!res.ok) return;
        const data = await res.json();
        const requests: RequestData[] = data.requests || [];

        const knownIdsKey =
          currentType === "client"
            ? "meditike_known_response_ids"
            : "meditike_known_request_ids";

        let knownIds: string[] = [];
        try {
          const raw = localStorage.getItem(knownIdsKey);
          knownIds = raw ? JSON.parse(raw) : [];
        } catch {
          knownIds = [];
        }

        const isAppVisible = !document.hidden;

        if (currentType === "client") {
          // Côté client : détecter nouvelles réponses
          const allResponseIds: string[] = [];
          const newResponses: Array<{ pharmacyName: string; productName: string; responseId: string }> = [];

          for (const req of requests) {
            if (req.responses) {
              for (const resp of req.responses) {
                allResponseIds.push(resp.id);
                if (!knownIds.includes(resp.id)) {
                  newResponses.push({
                    pharmacyName: resp.pharmacy?.name || "Une pharmacie",
                    productName: req.productName,
                    responseId: resp.id,
                  });
                }
              }
            }
          }

          if (newResponses.length > 0) {
            // Vibrer
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }

            for (const resp of newResponses.slice(0, 3)) {
              const title = "🎉 Réponse reçue";
              const body = `${resp.pharmacyName} a répondu à votre demande de "${resp.productName}"`;

              if (isAppVisible) {
                // App visible : toast
                toast.success(body, {
                  duration: 8000,
                  icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
                });
              } else {
                // App en arrière-plan : notification système
                showSystemNotification(title, body, "/");
              }
            }
          }

          localStorage.setItem(knownIdsKey, JSON.stringify(allResponseIds));
        } else {
          // Côté pharmacien : détecter nouvelles demandes
          const allRequestIds = requests.map((r) => r.id);
          const newRequests = requests.filter((r) => !knownIds.includes(r.id));

          if (newRequests.length > 0) {
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }

            for (const req of newRequests.slice(0, 3)) {
              const title = "🔔 Nouvelle demande";
              const body = `"${req.productName}"${req.clientName ? ` par ${req.clientName}` : ""}`;

              if (isAppVisible) {
                toast.success(body, {
                  duration: 8000,
                  icon: <Bell className="w-4 h-4 text-emerald-600" />,
                });
              } else {
                showSystemNotification(title, body, "/");
              }
            }
          }

          localStorage.setItem(knownIdsKey, JSON.stringify(allRequestIds));
        }
      } catch {
        // Silencieux
      } finally {
        isChecking = false;
      }
    }

    // Démarrage différé (3s)
    const startDelay = setTimeout(() => {
      checkForNewItems();
      // IMPORTANT : le polling continue MÊME quand l'app est en arrière-plan
      // (contrairement aux autres pollings qui s'arrêtent)
      intervalRef.current = setInterval(checkForNewItems, 20000);
    }, 3000);

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /** Affiche une notification système via le service worker */
  function showSystemNotification(title: string, body: string, url: string) {
    if (typeof window === "undefined") return;

    // Si on a un service worker, utiliser showNotification (meilleur support)
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
        });
      });
    } else if ("Notification" in window && Notification.permission === "granted") {
      // Fallback : notification directe
      const notif = new Notification(title, {
        body,
        icon: "/logo.svg",
        badge: "/logo.svg",
        tag: "meditike-push",
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    }
  }

  return null; // Composant invisible
}
