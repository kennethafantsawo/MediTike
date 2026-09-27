"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  X,
  Loader2,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wallet,
  Download,
  Image as ImageIcon,
  Banknote,
} from "lucide-react";
import {
  formatPrice,
  relativeTimeFr,
} from "@/lib/meditike/helpers";
import { toast } from "sonner";
import {
  generateTPCReceipt,
  TPCOrderForReceipt,
} from "@/components/meditike/shared/tpc-receipt";

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
}

interface TPCClient {
  id: string;
  fullName: string | null;
  phone: string;
}

type TPCStatus =
  | "sent"
  | "available"
  | "awaiting_payment"
  | "paid"
  | "completed"
  | "rejected";

interface PharmacistTPCOrder {
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
  client: TPCClient | null;
  pharmacy: TPCPharmacy | null;
}

/**
 * Vue pharmacien du module TPC.
 * Permet au pharmacien de traiter les commandes TPC:
 * - Confirmer la disponibilité et fixer le montant
 * - Confirmer la réception du paiement
 * - Générer le reçu PDF
 */
export function PharmacistTPCView() {
  const [orders, setOrders] = useState<PharmacistTPCOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

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
    let interval: NodeJS.Timeout | null = null;
    const start = () => {
      if (!interval) interval = setInterval(load, 30000);
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

  // Filtrer les commandes par statut
  const sentOrders = orders.filter((o) => o.status === "sent");
  const awaitingOrders = orders.filter((o) => o.status === "awaiting_payment");
  const paidOrders = orders.filter((o) => o.status === "paid");
  const availableOrders = orders.filter((o) => o.status === "available");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const rejectedOrders = orders.filter((o) => o.status === "rejected");

  const todoCount =
    sentOrders.length + awaitingOrders.length + paidOrders.length;

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold mb-1">
          Commandes TPC
        </h1>
        <p className="text-sm text-muted-foreground">
          Traitez les ordonnances de pathologies chroniques envoyées par les patients.
          {todoCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
              {todoCount} à traiter
            </span>
          )}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg mb-1">
            Aucune commande TPC
          </h3>
          <p className="text-sm text-muted-foreground">
            Les commandes TPC des patients apparaîtront ici dès qu'elles seront envoyées.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sentOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                En attente de confirmation · {sentOrders.length}
              </p>
              <div className="space-y-3">
                {sentOrders.map((order) => (
                  <PharmacistTPCCard
                    key={order.id}
                    order={order}
                    responding={responding === order.id}
                    onRespond={() => setResponding(order.id)}
                    onCancel={() => setResponding(null)}
                    onResponded={() => {
                      setResponding(null);
                      load();
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {availableOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                En attente de paiement · {availableOrders.length}
              </p>
              <div className="space-y-3">
                {availableOrders.map((order) => (
                  <PharmacistTPCCard
                    key={order.id}
                    order={order}
                    responding={false}
                    onRespond={() => {}}
                    onCancel={() => {}}
                    onResponded={load}
                  />
                ))}
              </div>
            </div>
          )}

          {awaitingOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Paiement à confirmer · {awaitingOrders.length}
              </p>
              <div className="space-y-3">
                {awaitingOrders.map((order) => (
                  <PharmacistTPCCard
                    key={order.id}
                    order={order}
                    responding={false}
                    onRespond={() => {}}
                    onCancel={() => {}}
                    onResponded={load}
                  />
                ))}
              </div>
            </div>
          )}

          {paidOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Reçu à générer · {paidOrders.length}
              </p>
              <div className="space-y-3">
                {paidOrders.map((order) => (
                  <PharmacistTPCCard
                    key={order.id}
                    order={order}
                    responding={false}
                    onRespond={() => {}}
                    onCancel={() => {}}
                    onResponded={load}
                  />
                ))}
              </div>
            </div>
          )}

          {completedOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 pt-4">
                Terminées · {completedOrders.length}
              </p>
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <PharmacistTPCCard
                    key={order.id}
                    order={order}
                    responding={false}
                    onRespond={() => {}}
                    onCancel={() => {}}
                    onResponded={load}
                  />
                ))}
              </div>
            </div>
          )}

          {rejectedOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 pt-4">
                Refusées · {rejectedOrders.length}
              </p>
              <div className="space-y-3">
                {rejectedOrders.map((order) => (
                  <PharmacistTPCCard
                    key={order.id}
                    order={order}
                    responding={false}
                    onRespond={() => {}}
                    onCancel={() => {}}
                    onResponded={load}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Carte d'une commande TPC côté pharmacien.
 */
function PharmacistTPCCard({
  order,
  responding,
  onRespond,
  onCancel,
  onResponded,
}: {
  order: PharmacistTPCOrder;
  responding: boolean;
  onRespond: () => void;
  onCancel: () => void;
  onResponded: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitAvailability() {
    const totalAmount = parseFloat(amount);
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      toast.error("Veuillez saisir un montant valide");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tpc/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm-availability",
          totalAmount,
          pharmacyNote: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Disponibilité confirmée. Le patient va payer.");
      onResponded();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReject() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tpc/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          reason: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Commande refusée");
      onResponded();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmPayment() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tpc/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm-payment" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Paiement confirmé. Numéro de reçu généré.");
      onResponded();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function completeOrder() {
    if (!order.receiptNumber) {
      toast.error("Numéro de reçu manquant");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Marquer la commande comme "completed"
      const res = await fetch(`/api/tpc/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Générer et télécharger le reçu PDF
      try {
        generateTPCReceipt({
          id: order.id,
          status: "completed",
          clientName: order.clientName || order.client?.fullName || "Patient",
          clientPhone: order.clientPhone || order.client?.phone || null,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          receiptNumber: order.receiptNumber,
          note: order.note,
          pharmacyNote: order.pharmacyNote,
          createdAt: order.createdAt,
          confirmedAt: order.confirmedAt || null,
          paidAt: order.paidAt || null,
          completedAt: new Date().toISOString(),
          pharmacy: order.pharmacy
            ? {
                name: order.pharmacy.name,
                phone1: "",
              }
            : null,
        } as TPCOrderForReceipt);
        toast.success("Reçu PDF généré et téléchargé");
      } catch (err: any) {
        toast.error(err.message || "Erreur génération PDF");
      }
      onResponded();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function downloadReceipt() {
    if (!order.receiptNumber) {
      toast.error("Numéro de reçu manquant");
      return;
    }
    try {
      generateTPCReceipt({
        id: order.id,
        status: order.status,
        clientName: order.clientName || order.client?.fullName || "Patient",
        clientPhone: order.clientPhone || order.client?.phone || null,
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
              phone1: "",
            }
          : null,
      } as TPCOrderForReceipt);
      toast.success("Reçu PDF téléchargé");
    } catch (err: any) {
      toast.error(err.message || "Erreur génération PDF");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-2xl overflow-hidden"
    >
      {/* En-tête avec fil d'Ariane statut */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-base">
                {order.clientName || order.client?.fullName || "Patient"}
              </h3>
              <TPCStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {relativeTimeFr(order.createdAt)}
              {order.client?.phone && ` · ${order.client.phone}`}
              {order.pharmacy && ` · ${order.pharmacy.name}`}
            </p>
            {order.totalAmount && (
              <p className="text-sm font-bold text-emerald-700 mt-1">
                {formatPrice(order.totalAmount)}
                {order.paymentMethod === "mobile_money" && " (Mobile Money)"}
                {order.paymentMethod === "cash" && " (Espèces)"}
              </p>
            )}
            {order.receiptNumber && (
              <p className="text-[10px] text-emerald-700 font-mono font-bold mt-1">
                {order.receiptNumber}
              </p>
            )}
          </div>
        </div>

        {/* Photos d'ordonnance */}
        {order.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {order.photos.map((p) => (
              <a
                key={p.id}
                href={`/api/tpc-photos/${p.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-muted rounded-lg overflow-hidden border border-border relative group"
              >
                <img
                  src={`/api/tpc-photos/${p.id}`}
                  alt="Ordonnance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Note du patient */}
        {order.note && (
          <p className="text-xs text-muted-foreground italic mt-3 p-2 bg-muted/60 rounded-lg">
            Note du patient: "{order.note}"
          </p>
        )}

        {/* Note de la pharmacie (si déjà définie) */}
        {order.pharmacyNote && (
          <div className="text-xs bg-emerald-50 p-2 rounded-lg border border-emerald-100 mt-2">
            <p className="font-bold text-emerald-700 mb-1">Ma note :</p>
            <p className="text-emerald-900">{order.pharmacyNote}</p>
          </div>
        )}

        {/* Preuve de paiement si en attente de confirmation */}
        {order.status === "awaiting_payment" && order.paymentMethod === "mobile_money" && (
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Capture du paiement
            </p>
            <a
              href={`/api/tpc-photos/${order.id}?type=payment`}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-video max-w-xs bg-muted rounded-lg overflow-hidden border border-border relative group"
            >
              <img
                src={`/api/tpc-photos/${order.id}?type=payment`}
                alt="Preuve de paiement"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
              </div>
            </a>
          </div>
        )}
        {order.status === "awaiting_payment" && order.paymentMethod === "cash" && (
          <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            <span>Paiement en espèces à percevoir en pharmacie</span>
          </div>
        )}
      </div>

      {/* Actions selon le statut */}
      {order.status === "sent" && !responding && (
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <button
              onClick={submitReject}
              disabled={submitting}
              className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Refuser
            </button>
            <button
              onClick={onRespond}
              className="flex-1 py-3 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirmer disponibilité
            </button>
          </div>
        </div>
      )}

      {order.status === "sent" && responding && (
        <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Confirmer disponibilité
          </p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant total en FCFA (ex: 15000)"
            className="w-full px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-500"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optionnel) : liste des produits, alternatives..."
            rows={2}
            maxLength={2000}
            className="w-full px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 bg-muted text-muted-foreground font-bold text-sm rounded-xl"
            >
              Annuler
            </button>
            <button
              onClick={submitAvailability}
              disabled={submitting}
              className="flex-1 py-2.5 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Confirmer
            </button>
          </div>
        </div>
      )}

      {order.status === "awaiting_payment" && (
        <div className="px-4 pb-4">
          <button
            onClick={confirmPayment}
            disabled={submitting}
            className="w-full py-3 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Confirmer paiement reçu
          </button>
        </div>
      )}

      {order.status === "paid" && (
        <div className="px-4 pb-4">
          <button
            onClick={completeOrder}
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Générer le reçu PDF
          </button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Le reçu sera téléchargé automatiquement chez le patient.
          </p>
        </div>
      )}

      {order.status === "completed" && order.receiptNumber && (
        <div className="px-4 pb-4">
          <button
            onClick={downloadReceipt}
            className="w-full py-2.5 bg-muted hover:bg-muted/70 text-emerald-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Re-télécharger le reçu
          </button>
        </div>
      )}

      {order.status === "rejected" && (
        <div className="px-4 pb-4 flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-lg mx-0">
          <AlertCircle className="w-4 h-4" />
          <span>Commande refusée</span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Badge coloré selon le statut TPC (côté pharmacien).
 */
function TPCStatusBadge({ status }: { status: TPCStatus }) {
  switch (status) {
    case "sent":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
          <Clock className="w-2.5 h-2.5" /> À CONFIRMER
        </span>
      );
    case "available":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
          <Wallet className="w-2.5 h-2.5" /> EN ATTENTE PAIEMENT
        </span>
      );
    case "awaiting_payment":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
          <Clock className="w-2.5 h-2.5" /> PAIEMENT REÇU À CONFIRMER
        </span>
      );
    case "paid":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-2.5 h-2.5" /> PAYÉ — REÇU À GÉNÉRER
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
