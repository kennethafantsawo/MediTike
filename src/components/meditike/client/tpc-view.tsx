"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ImagePlus,
  X,
  Loader2,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wallet,
  Download,
  CreditCard,
  Banknote,
  RotateCcw,
} from "lucide-react";
import {
  formatPrice,
  relativeTimeFr,
  MAX_PHOTO_SIZE,
} from "@/lib/meditike/helpers";
import { toast } from "sonner";
import { generateTPCReceipt, TPCOrderForReceipt } from "@/components/meditike/shared/tpc-receipt";

interface TPCPhoto {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  type: string;
  originalName: string;
}

interface TPCPharmacy {
  id: string;
  name: string;
  phone1: string;
  phone2?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  district?: string | null;
}

type TPCStatus =
  | "sent"
  | "available"
  | "awaiting_payment"
  | "paid"
  | "completed"
  | "rejected";

interface TPCOrderClient {
  id: string;
  status: TPCStatus;
  clientName: string | null;
  clientPhone: string | null;
  totalAmount: number | null;
  paymentMethod: string | null;
  paymentProofFilename?: string | null;
  paymentProofMime?: string | null;
  paymentProofSize?: number | null;
  receiptNumber: string | null;
  note: string | null;
  pharmacyNote: string | null;
  createdAt: string;
  confirmedAt?: string | null;
  paidAt?: string | null;
  completedAt?: string | null;
  photos: TPCPhoto[];
  pharmacy: TPCPharmacy | null;
}

/**
 * Vue client du module TPC (Traitement des Pathologies Chroniques).
 * Permet au patient d'envoyer son ordonnance, de payer et de télécharger le reçu.
 */
export function TPCView() {
  const [view, setView] = useState<"list" | "new">("list");
  const [orders, setOrders] = useState<TPCOrderClient[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/tpc")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    // Polling 45s, pause si onglet non visible
    let interval: NodeJS.Timeout | null = null;
    const start = () => {
      if (!interval) interval = setInterval(load, 45000);
    };
    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  if (view === "new") {
    return (
      <NewTPCForm
        onSubmitted={() => {
          setView("list");
          load();
        }}
        onCancel={() => setView("list")}
      />
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-1">
              Mes commandes TPC
            </h1>
            <p className="text-sm text-muted-foreground">
              Envoyez votre ordonnance, la pharmacie vous propose un montant, vous payez en ligne.
            </p>
          </div>
        </div>
        <div className="text-center py-12 bg-white rounded-2xl border border-border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg mb-1">
            Aucune commande TPC pour le moment
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Envoyez votre ordonnance pour qu'une pharmacie vous propose un prix.
          </p>
          <button
            onClick={() => setView("new")}
            className="inline-flex items-center gap-2 px-5 py-3 brand-gradient text-white font-bold text-sm rounded-2xl shadow hover:shadow-lg active:scale-[0.98] transition-all"
          >
            <FileText className="w-4 h-4" /> Nouvelle commande TPC
          </button>
        </div>
      </div>
    );
  }

  // Trier: commandes actives en haut, terminées/refusées en bas
  const activeOrders = orders.filter((o) =>
    ["sent", "available", "awaiting_payment", "paid"].includes(o.status)
  );
  const oldOrders = orders.filter((o) =>
    ["completed", "rejected"].includes(o.status)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold mb-1">
            Mes commandes TPC
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivez l'ordre de vos ordonnances de pathologies chroniques.
          </p>
        </div>
        <button
          onClick={() => setView("new")}
          className="inline-flex items-center gap-1.5 px-3 py-2 brand-gradient text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <FileText className="w-3.5 h-3.5" /> Nouvelle
        </button>
      </div>

      <div className="space-y-4">
        {activeOrders.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              En cours · {activeOrders.length}
            </p>
            {activeOrders.map((order) => (
              <TPCOrderCard key={order.id} order={order} onUpdated={load} />
            ))}
          </>
        )}
        {oldOrders.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-4">
              Historique · {oldOrders.length}
            </p>
            {oldOrders.map((order) => (
              <TPCOrderCard key={order.id} order={order} onUpdated={load} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Formulaire de création d'une nouvelle commande TPC.
 */
function NewTPCForm({ onSubmitted, onCancel }: { onSubmitted: () => void; onCancel: () => void }) {
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<TPCPhoto[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crée la commande TPC à la volée (statut "sent"), puis uploads les photos sur cette commande
  async function ensureOrderId(): Promise<string> {
    if (orderId) return orderId;
    setCreating(true);
    try {
      const res = await fetch("/api/tpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrderId(data.order.id);
      return data.order.id;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    } finally {
      setCreating(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (photos.length + files.length > 3) {
      toast.error("Maximum 3 photos d'ordonnance par commande");
      return;
    }
    setUploading(true);
    try {
      const id = await ensureOrderId();
      for (const file of files) {
        if (file.size > MAX_PHOTO_SIZE) {
          toast.error(`${file.name}: trop volumineuse (max 1 Mo)`);
          continue;
        }
        const formData = new FormData();
        formData.append("photo", file);
        const res = await fetch(`/api/tpc/${id}/upload-photo`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPhotos((prev) => [...prev, data.photo]);
        toast.success("Photo ajoutée");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removePhoto(photoId: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (photos.length === 0) {
      toast.error("Veuillez ajouter au moins une photo de votre ordonnance");
      return;
    }
    if (!orderId) {
      // Créer la commande sans photo (rare)
      setSubmitting(true);
      try {
        await ensureOrderId();
        toast.success("Commande TPC envoyée !");
        onSubmitted();
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    // La commande est déjà créée, on update la note si modifiée
    setSubmitting(true);
    try {
      toast.success("Commande TPC envoyée à la pharmacie !", {
        description: "Vous serez notifié quand la pharmacie confirmera le montant.",
      });
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <button
          onClick={onCancel}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-3 inline-flex items-center gap-1"
        >
          ← Retour à mes commandes
        </button>
        <h1 className="font-display text-2xl font-extrabold mb-1">
          Nouvelle commande TPC
        </h1>
        <p className="text-sm text-muted-foreground">
          Photographiez votre ordonnance. Une pharmacie vous proposera un montant total, puis vous paierez en ligne.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photos ordonnance */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase mb-2">
            Photos de l'ordonnance * (max 3 · 1 Mo chacune)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border"
              >
                <img
                  src={`/api/tpc-photos/${photo.id}`}
                  alt="Ordonnance"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                  aria-label="Supprimer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || creating}
                className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all disabled:opacity-50"
              >
                {uploading || creating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ImagePlus className="w-5 h-5" />
                )}
                <span className="text-[10px] font-bold mt-1">Ajouter</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-[10px] text-muted-foreground mt-2 pl-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Vos ordonnances sont conservées en historique permanent (jamais supprimées).
          </p>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase mb-2">
            Note (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Précisions : nom du médecin, durée du traitement, renouvellement..."
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-3 text-sm bg-white border-2 border-border rounded-2xl font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
          />
          <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">
            {note.length}/1000 caractères
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 bg-muted text-muted-foreground font-bold text-sm rounded-2xl transition-colors hover:bg-muted/80"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting || uploading || photos.length === 0}
            className="flex-1 brand-gradient text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Envoyer ma commande TPC
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Carte d'une commande TPC côté client.
 */
function TPCOrderCard({
  order,
  onUpdated,
}: {
  order: TPCOrderClient;
  onUpdated: () => void;
}) {
  const [expanded, setExpanded] = useState(
    !["completed", "rejected"].includes(order.status)
  );
  const [paying, setPaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-base">
                Commande TPC
              </h3>
              <TPCStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {relativeTimeFr(order.createdAt)}
              {order.pharmacy && ` · ${order.pharmacy.name}`}
            </p>
            {order.totalAmount && (
              <p className="text-sm font-bold text-emerald-700 mt-1">
                {formatPrice(order.totalAmount)}
              </p>
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          {/* Photos ordonnance */}
          {order.photos.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Ordonnance
              </p>
              <div className="grid grid-cols-3 gap-2">
                {order.photos.map((p) => (
                  <a
                    key={p.id}
                    href={`/api/tpc-photos/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-muted rounded-xl overflow-hidden border border-border"
                  >
                    <img
                      src={`/api/tpc-photos/${p.id}`}
                      alt="Ordonnance"
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Note patient */}
          {order.note && (
            <p className="text-xs text-muted-foreground italic bg-muted/40 p-2 rounded-lg">
              Ma note: "{order.note}"
            </p>
          )}

          {/* Note pharmacie */}
          {order.pharmacyNote && (
            <div className="text-xs bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
              <p className="font-bold text-emerald-700 mb-1">
                Note de la pharmacie :
              </p>
              <p className="text-emerald-900">{order.pharmacyNote}</p>
            </div>
          )}

          {/* Action selon le statut */}
          {order.status === "sent" && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>En attente de confirmation de la pharmacie...</span>
            </div>
          )}

          {order.status === "available" && (
            <button
              onClick={() => setPaying(true)}
              className="w-full py-3 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              <Wallet className="w-4 h-4" /> Payer {order.totalAmount ? formatPrice(order.totalAmount) : ""}
            </button>
          )}

          {order.status === "awaiting_payment" && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>
                Paiement en attente de confirmation par la pharmacie
                {order.paymentMethod === "cash"
                  ? " (espèces à la pharmacie)"
                  : " (Mobile Money)"}
              </span>
            </div>
          )}

          {order.status === "paid" && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Paiement confirmé. Reçu en cours de génération...
              </span>
            </div>
          )}

          {order.status === "rejected" && (
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>Cette commande a été refusée par la pharmacie.</span>
            </div>
          )}

          {order.status === "completed" && order.receiptNumber && (
            <button
              onClick={() => {
                try {
                  generateTPCReceipt({
                    id: order.id,
                    status: order.status,
                    clientName: order.clientName,
                    clientPhone: order.clientPhone,
                    totalAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    receiptNumber: order.receiptNumber,
                    note: order.note,
                    pharmacyNote: order.pharmacyNote,
                    createdAt: order.createdAt,
                    confirmedAt: order.confirmedAt || null,
                    paidAt: order.paidAt || null,
                    completedAt: order.completedAt || null,
                    pharmacy: order.pharmacy
                      ? {
                          name: order.pharmacy.name,
                          address: order.pharmacy.address,
                          district: order.pharmacy.district,
                          phone1: order.pharmacy.phone1,
                          phone2: order.pharmacy.phone2,
                        }
                      : null,
                  } as TPCOrderForReceipt);
                  toast.success("Reçu PDF téléchargé");
                } catch (err: any) {
                  toast.error(err.message || "Erreur génération PDF");
                }
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Télécharger le reçu
            </button>
          )}

          {/* Numéro de reçu visible si présent */}
          {order.receiptNumber && (
            <p className="text-[10px] text-muted-foreground text-center">
              Reçu: <span className="font-mono font-bold text-emerald-700">{order.receiptNumber}</span>
            </p>
          )}
        </div>
      )}

      {/* Modal paiement */}
      <AnimatePresence>
        {paying && order.status === "available" && (
          <PaymentModal
            order={order}
            onClose={() => setPaying(false)}
            onSubmitted={() => {
              setPaying(false);
              onUpdated();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Badge coloré selon le statut TPC.
 */
function TPCStatusBadge({ status }: { status: TPCStatus }) {
  switch (status) {
    case "sent":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
          <Clock className="w-2.5 h-2.5" /> EN ATTENTE
        </span>
      );
    case "available":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
          <Wallet className="w-2.5 h-2.5" /> À PAYER
        </span>
      );
    case "awaiting_payment":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
          <Clock className="w-2.5 h-2.5" /> PAIEMENT EN COURS
        </span>
      );
    case "paid":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-2.5 h-2.5" /> PAYÉ
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-2.5 h-2.5" /> TERMINÉE
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
          <X className="w-2.5 h-2.5" /> REFUSÉE
        </span>
      );
    default:
      return null;
  }
}

/**
 * Modal de paiement: Mobile Money ou Cash + upload capture si Mobile Money.
 */
function PaymentModal({
  order,
  onClose,
  onSubmitted,
}: {
  order: TPCOrderClient;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<"mobile_money" | "cash">(
    "mobile_money"
  );
  const [proofPhoto, setProofPhoto] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleProofSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const file = files[0];
    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Fichier trop volumineux (max 1 Mo)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch(`/api/tpc/${order.id}/upload-payment`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProofPhoto(data.order);
      toast.success("Capture de paiement ajoutée");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function submitPayment() {
    if (paymentMethod === "mobile_money" && !proofPhoto?.paymentProofFilename && !order.paymentProofFilename) {
      toast.error("Veuillez uploader la capture du paiement Mobile Money");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tpc/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit-payment",
          paymentMethod,
          paymentProofFilename:
            paymentMethod === "mobile_money"
              ? proofPhoto?.paymentProofFilename || order.paymentProofFilename
              : null,
          paymentProofMime:
            paymentMethod === "mobile_money"
              ? proofPhoto?.paymentProofMime || order.paymentProofMime
              : null,
          paymentProofSize:
            paymentMethod === "mobile_money"
              ? proofPhoto?.paymentProofSize || order.paymentProofSize
              : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Paiement soumis ! La pharmacie va confirmer.");
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="brand-gradient relative px-7 pt-6 pb-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="font-display font-extrabold text-xl">Paiement TPC</h2>
          <p className="text-white/75 text-xs mt-1">
            Montant à payer : <span className="font-bold text-white">{order.totalAmount ? formatPrice(order.totalAmount) : ""}</span>
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Choix méthode */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-2">
              Méthode de paiement
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("mobile_money")}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === "mobile_money"
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-white border border-emerald-300 text-emerald-700"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === "cash"
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-white border border-emerald-300 text-emerald-700"
                }`}
              >
                <Banknote className="w-4 h-4" />
                Espèces
              </button>
            </div>
          </div>

          {paymentMethod === "mobile_money" && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                Effectuez votre paiement Mobile Money, puis envoyez la capture d'écran ci-dessous.
              </p>
              <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-2">
                Capture du paiement *
              </label>
              {proofPhoto?.paymentProofFilename || order.paymentProofFilename ? (
                <div className="relative aspect-video bg-muted rounded-xl overflow-hidden border border-border">
                  <img
                    src={`/api/tpc-photos/${order.id}?type=payment`}
                    alt="Preuve de paiement"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProofPhoto(null);
                      // Note: la preuve reste stockée côté serveur — l'utilisateur peut juste la remplacer
                      fileInputRef.current?.click();
                    }}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Remplacer
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <ImagePlus className="w-6 h-6" />
                  )}
                  <span className="text-xs font-bold mt-1">Téléverser la capture</span>
                  <span className="text-[10px] mt-0.5">JPG / PNG / WebP · max 1 Mo</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProofSelect}
                className="hidden"
              />
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
              Vous paierez en espèces directement à la pharmacie. La pharmacie confirmera la réception après votre passage.
            </div>
          )}

          <button
            onClick={submitPayment}
            disabled={submitting}
            className="w-full brand-gradient text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Confirmer le paiement
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
