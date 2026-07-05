"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock, Phone, MessageCircle, MapPin, Pill, CheckCircle2,
  XCircle, Loader2, RefreshCw, FileText,
} from "lucide-react";
import { buildWhatsAppLink, formatPrice, relativeTimeFr } from "@/lib/meditike/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface RequestItem {
  id: string;
  query: string;
  status: string;
  createdAt: string;
  clientName?: string;
  clientPhone?: string;
  responses: Array<{
    id: string;
    available: boolean;
    price: number | null;
    note: string | null;
    createdAt: string;
    pharmacy: {
      id: string;
      name: string;
      phone: string;
      whatsapp?: string;
      address: string;
      city: string;
      district?: string;
    };
  }>;
}

interface HistoryViewProps {
  user: any;
}

export function HistoryView({ user }: HistoryViewProps) {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Erreur de chargement");
        setLoading(false);
      });
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setRequests(data.requests || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Erreur de chargement");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const isPharmacist = user.role === "pharmacist";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32 lg:pb-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold mb-1">
            {isPharmacist ? "Demandes clients" : "Mes demandes"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isPharmacist
              ? "Répondez aux patients qui cherchent un médicament."
              : "Suivez vos recherches et les réponses des pharmaciens."}
          </p>
        </div>
        <button
          onClick={load}
          className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center"
          aria-label="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {isPharmacist
              ? "Aucune demande en attente pour le moment."
              : "Vous n'avez pas encore fait de demande."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req, i) => (
            <RequestCard
              key={req.id}
              request={req}
              index={i}
              expanded={expanded === req.id}
              onToggle={() => setExpanded(expanded === req.id ? null : req.id)}
              isPharmacist={isPharmacist}
              pharmacyId={user.pharmacyId}
              onResponded={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({
  request, index, expanded, onToggle, isPharmacist, pharmacyId, onResponded,
}: {
  request: RequestItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  isPharmacist: boolean;
  pharmacyId?: string;
  onResponded: () => void;
}) {
  const status = request.status as "pending" | "resolved" | "expired";
  const myResponse = request.responses.find((r) => r.pharmacy.id === pharmacyId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-border rounded-2xl overflow-hidden"
    >
      <button onClick={onToggle} className="w-full text-left p-4 hover:bg-muted/30 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-base">{request.query}</h3>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isPharmacist && request.clientName ? `Demandé par ${request.clientName} · ` : ""}
              {relativeTimeFr(request.createdAt)}
            </p>
            {request.responses.length > 0 && (
              <p className="text-xs text-emerald-700 font-bold mt-1">
                {request.responses.length} réponse{request.responses.length > 1 ? "s" : ""} de pharmacie{request.responses.length > 1 ? "s" : ""}
              </p>
            )}
            {isPharmacist && myResponse && (
              <p className="text-xs text-amber-700 font-bold mt-1">
                Vous avez répondu {myResponse.available ? "✓ disponible" : "✗ indisponible"}
              </p>
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          {/* Pharmacist respond form */}
          {isPharmacist && !myResponse && (
            <PharmacistResponseForm requestId={request.id} onDone={onResponded} />
          )}

          {/* Responses */}
          {request.responses.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Réponses des pharmacies
              </p>
              {request.responses.map((r) => (
                <div key={r.id} className="p-3 bg-muted/60 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold">{r.pharmacy.name}</p>
                    {r.available ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Indisponible
                      </span>
                    )}
                  </div>
                  {r.price && (
                    <p className="text-sm font-bold text-emerald-700">{formatPrice(r.price)}</p>
                  )}
                  {r.note && (
                    <p className="text-xs text-muted-foreground italic mt-1">"{r.note}"</p>
                  )}
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      {r.pharmacy.district ? `${r.pharmacy.district}, ` : ""}
                      {r.pharmacy.address}
                    </span>
                  </div>
                  {r.available && (
                    <div className="flex gap-2 mt-2">
                      <a href={`tel:${r.pharmacy.phone}`} className="flex-1 inline-flex items-center justify-center gap-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                        <Phone className="w-3 h-3" /> Appeler
                      </a>
                      <a
                        href={buildWhatsAppLink(r.pharmacy.whatsapp || r.pharmacy.phone, request.query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !isPharmacist && (
              <div className="text-center py-4">
                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  En attente de réponse des pharmaciens partenaires…
                </p>
              </div>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: "pending" | "resolved" | "expired" }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
        <Clock className="w-2.5 h-2.5" /> EN ATTENTE
      </span>
    );
  }
  if (status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-2.5 h-2.5" /> RÉSOLUE
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded-full">
      <XCircle className="w-2.5 h-2.5" /> EXPIRÉE
    </span>
  );
}

function PharmacistResponseForm({ requestId, onDone }: { requestId: string; onDone: () => void }) {
  const [available, setAvailable] = useState(true);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/requests/${requestId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          available,
          price: price ? parseFloat(price) : null,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Réponse envoyée au patient !");
      onDone();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl mb-3">
      <p className="text-xs font-bold text-emerald-800 mb-2">Répondre à ce patient :</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setAvailable(true)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            available ? "bg-emerald-600 text-white" : "bg-white border border-emerald-300 text-emerald-700"
          }`}
        >
          ✓ Disponible
        </button>
        <button
          onClick={() => setAvailable(false)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            !available ? "bg-red-600 text-white" : "bg-white border border-red-300 text-red-700"
          }`}
        >
          ✗ Indisponible
        </button>
      </div>
      {available && (
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Prix en FCFA (ex: 2500)"
          className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-emerald-500 mb-2"
        />
      )}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optionnel) : alternative, boîte de X comprimés…"
        rows={2}
        className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-emerald-500 mb-2 resize-none"
      />
      <button
        onClick={submit}
        disabled={submitting}
        className="w-full py-2.5 brand-gradient text-white text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
        Envoyer ma réponse
      </button>
    </div>
  );
}
