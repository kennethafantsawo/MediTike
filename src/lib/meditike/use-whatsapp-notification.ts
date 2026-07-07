"use client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

/**
 * useWhatsAppNotification
 *
 * Hook client pour récupérer l'URL WhatsApp pré-remplie d'une réponse
 * de pharmacie et l'ouvrir dans un nouvel onglet.
 *
 * Utilisation :
 *   const { notify, loading } = useWhatsAppNotification();
 *   <button onClick={() => notify(responseId)}>Recevoir sur WhatsApp</button>
 */
export function useWhatsAppNotification() {
  const [loading, setLoading] = useState(false);

  const notify = useCallback(async (responseId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Impossible de préparer la notification.");
      }

      // Ouvrir WhatsApp dans un nouvel onglet avec le message pré-rempli.
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
      toast.success("WhatsApp ouvert", {
        description: "Le message pré-rempli est prêt à être envoyé.",
      });
    } catch (err: any) {
      toast.error(err?.message || "Impossible d'envoyer la notification.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { notify, loading };
}
