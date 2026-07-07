"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Bell, CheckCircle2 } from "lucide-react";

interface InAppNotificationsProps {
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
 * Notifications in-app temps réel.
 * - Côté client : notifie quand une nouvelle réponse arrive sur une de ses demandes
 * - Côté pharmacien : notifie quand une nouvelle demande est reçue
 *
 * Utilise le polling existant (/api/requests) et compare avec l'état précédent
 * stocké en localStorage pour détecter les nouveautés.
 */
export function InAppNotifications({ type }: InAppNotificationsProps) {
  const lastCheckKey = type === "client" ? "meditike_last_responses" : "meditike_last_requests";
  const knownIdsKey = type === "client" ? "meditike_known_response_ids" : "meditike_known_request_ids";
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typeRef = useRef(type);
  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    async function checkForNewItems() {
      try {
        const currentType = typeRef.current;
        const res = await fetch("/api/requests");
        if (!res.ok) return;
        const data = await res.json();
        const requests: RequestData[] = data.requests || [];

        const currentKnownIdsKey = currentType === "client" ? "meditike_known_response_ids" : "meditike_known_request_ids";

        let knownIds: string[] = [];
        try {
          const raw = localStorage.getItem(currentKnownIdsKey);
          knownIds = raw ? JSON.parse(raw) : [];
        } catch {
          knownIds = [];
        }

        if (currentType === "client") {
          const allResponseIds: string[] = [];
          const newResponses: Array<{ pharmacyName: string; productName: string }> = [];

          for (const req of requests) {
            if (req.responses) {
              for (const resp of req.responses) {
                allResponseIds.push(resp.id);
                if (!knownIds.includes(resp.id)) {
                  newResponses.push({
                    pharmacyName: resp.pharmacy?.name || "Une pharmacie",
                    productName: req.productName,
                  });
                }
              }
            }
          }

          const toNotify = newResponses.slice(0, 3);
          for (const resp of toNotify) {
            toast.success(`🎉 ${resp.pharmacyName} a répondu à votre demande de "${resp.productName}"`, {
              duration: 8000,
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
            });
          }

          if (newResponses.length > 0 && typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }

          localStorage.setItem(currentKnownIdsKey, JSON.stringify(allResponseIds));
        } else {
          const allRequestIds = requests.map((r) => r.id);
          const newRequests = requests.filter((r) => !knownIds.includes(r.id));

          const toNotify = newRequests.slice(0, 3);
          for (const req of toNotify) {
            toast.success(`🔔 Nouvelle demande : "${req.productName}"${req.clientName ? ` par ${req.clientName}` : ""}`, {
              duration: 8000,
              icon: <Bell className="w-4 h-4 text-emerald-600" />,
            });
          }

          if (newRequests.length > 0 && typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }

          localStorage.setItem(currentKnownIdsKey, JSON.stringify(allRequestIds));
        }
      } catch {
        // Silencieux en cas d'erreur réseau
      }
    }

    // Ne pas démarrer immédiatement — attendre que l'app soit chargée
    const startDelay = setTimeout(() => {
      checkForNewItems();
      intervalRef.current = setInterval(checkForNewItems, 25000);
    }, 3000);

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null; // Composant invisible — juste des toasts
}
