"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Pill, Clock, CheckCircle2, X, Phone, MapPin, Image as ImageIcon,
  Loader2, Send, RefreshCw, LogOut, Building2, FileText, BarChart3, MessageCircle,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";
import { formatPrice, relativeTimeFr } from "@/lib/meditike/helpers";
import { DutyListView } from "@/components/meditike/shared/duty-list-view";
import { PharmacistStats } from "@/components/meditike/pharmacist/pharmacist-stats";
import { toast } from "sonner";

interface Photo {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

interface PharmacistResponse {
  id: string;
  available: boolean;
  price: number | null;
  note: string | null;
  createdAt: string;
}

interface PharmacistRequest {
  id: string;
  productName: string;
  note: string | null;
  status: string;
  clientName: string | null;
  clientPhone: string | null;
  createdAt: string;
  photos: Photo[];
  responses: PharmacistResponse[];
}

interface PharmacistAppProps {
  user: any;
  onLogout: () => void;
}

export function PharmacistApp({ user, onLogout }: PharmacistAppProps) {
  const [tab, setTab] = useState<"new" | "responded" | "duty" | "stats">("new");
  const [requests, setRequests] = useState<PharmacistRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const load = useCallback(() => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    // Polling toutes les 20s pour nouvelles demandes
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, [load]);

  const newRequests = requests.filter((r) => r.responses.length === 0);
  const respondedRequests = requests.filter((r) => r.responses.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={32} />
            <div className="leading-none">
              <p className="font-display font-extrabold text-base">Medi<span className="text-gradient-gold">Tike</span></p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">{user.pharmacyName || "Pharmacien"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {newRequests.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full pulse-glow">
                <Bell className="w-3 h-3" /> {newRequests.length} nouvelle{newRequests.length > 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 brand-gradient text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
              title="Faire une demande de médicament"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Demander
            </button>
            <button onClick={() => { load(); toast.success("Actualisé"); }} className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center" aria-label="Rafraîchir">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onLogout} className="text-xs font-bold text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-20">
        <div className="grid grid-cols-4 p-1 bg-muted rounded-2xl mb-5 sticky top-14 z-20">
          <button onClick={() => setTab("new")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${tab === "new" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <Bell className="w-4 h-4" /> À répondre
            {newRequests.length > 0 && <span className="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">{newRequests.length}</span>}
          </button>
          <button onClick={() => setTab("responded")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${tab === "responded" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <CheckCircle2 className="w-4 h-4" /> Réponses
            {respondedRequests.length > 0 && <span className="ml-1 text-[10px] bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">{respondedRequests.length}</span>}
          </button>
          <button onClick={() => setTab("duty")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${tab === "duty" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <Building2 className="w-4 h-4" /> Garde
          </button>
          <button onClick={() => setTab("stats")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${tab === "stats" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <BarChart3 className="w-4 h-4" /> Stats
          </button>
        </div>

        {tab === "stats" ? (
          <PharmacistStats />
        ) : loading && tab !== "duty" ? (
          <div className="text-center py-12"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" /></div>
        ) : tab === "duty" ? (
          <DutyListView readOnly />
        ) : tab === "new" ? (
          newRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-border">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg mb-1">Aucune nouvelle demande</h3>
              <p className="text-sm text-muted-foreground">Les nouvelles demandes des clients apparaîtront ici en temps réel.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{newRequests.length} demande{newRequests.length > 1 ? "s" : ""} en attente de réponse</p>
              <AnimatePresence>
                {newRequests.map((req) => (
                  <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <PharmacistRequestCard request={req} responding={responding === req.id} onRespond={() => setResponding(req.id)} onCancel={() => setResponding(null)} onResponded={() => { setResponding(null); load(); }} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )
        ) : respondedRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg mb-1">Vous n'avez pas encore répondu</h3>
            <p className="text-sm text-muted-foreground">Vos réponses aux demandes clients apparaîtront ici.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {respondedRequests.map((req) => {
              const resp = req.responses[0];
              return (
                <div key={req.id} className="bg-white border border-border rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base">{req.productName}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{req.clientName || "Client"} · {relativeTimeFr(req.createdAt)}</p>
                      {req.note && <p className="text-xs text-muted-foreground italic mt-1">"{req.note}"</p>}
                      {resp && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {resp.available ? (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Disponible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                              <X className="w-3 h-3" /> Indisponible
                            </span>
                          )}
                          {resp.price != null && (
                            <span className="text-[11px] font-bold text-emerald-700">{formatPrice(resp.price)}</span>
                          )}
                          {resp.note && (
                            <span className="text-[11px] text-muted-foreground italic">"{resp.note}"</span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-emerald-700 font-bold mt-2">✓ Vous avez répondu</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal : faire une demande (pharmacien peut aussi chercher un médicament) */}
      <AnimatePresence>
        {showRequestModal && (
          <PharmacistRequestModal
            onClose={() => setShowRequestModal(false)}
            onSubmitted={() => {
              setShowRequestModal(false);
              toast.success("Demande envoyée aux pharmacies partenaires !");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PharmacistRequestModal({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: () => void }) {
  const [productName, setProductName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error("Veuillez saisir le nom du médicament");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName.trim(),
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
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
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
          <h2 className="font-display font-extrabold text-xl">Faire une demande</h2>
          <p className="text-white/75 text-xs mt-1">Cherchez un médicament auprès des autres pharmacies</p>
          <div className="absolute bottom-0 left-0 right-0"><KenteDivider /></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">
              Médicament recherché *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Amoxicilline 500mg..."
              maxLength={200}
              className="w-full px-4 py-3 text-sm bg-muted border border-border rounded-xl font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">
              Note (optionnel)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Précisions : dosage, quantité..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 text-sm bg-muted border border-border rounded-xl font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full brand-gradient text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Envoyer ma demande
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function PharmacistRequestCard({ request, responding, onRespond, onCancel, onResponded }: {
  request: PharmacistRequest;
  responding: boolean;
  onRespond: () => void;
  onCancel: () => void;
  onResponded: () => void;
}) {
  const [available, setAvailable] = useState(true);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/requests/${request.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          available,
          price: available && price ? parseFloat(price) : null,
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Réponse envoyée au client !");
      onResponded();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 relative">
            <Pill className="w-5 h-5 text-amber-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white pulse-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-base">{request.productName}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {request.clientName || "Client"} · {relativeTimeFr(request.createdAt)}
            </p>
            {request.note && <p className="text-xs text-muted-foreground italic mt-2 p-2 bg-muted/60 rounded-lg">"{request.note}"</p>}
            {request.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {request.photos.map((p) => (
                  <a key={p.id} href={`/api/photos/${p.id}`} target="_blank" rel="noopener noreferrer" className="aspect-square bg-muted rounded-lg overflow-hidden border border-border relative group">
                    <img src={`/api/photos/${p.id}`} alt="Photo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!responding ? (
        <div className="px-4 pb-4">
          <button onClick={onRespond} className="w-full py-3 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all">
            <Send className="w-4 h-4" /> Répondre au client
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Votre réponse</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setAvailable(true)} className={`py-2.5 rounded-xl text-sm font-bold transition-all ${available ? "bg-emerald-600 text-white shadow" : "bg-white border border-emerald-300 text-emerald-700"}`}>
              ✓ Disponible
            </button>
            <button onClick={() => setAvailable(false)} className={`py-2.5 rounded-xl text-sm font-bold transition-all ${!available ? "bg-red-600 text-white shadow" : "bg-white border border-red-300 text-red-700"}`}>
              ✗ Indisponible
            </button>
          </div>
          {available && (
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Prix en FCFA (ex: 2500)" className="w-full px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-500" />
          )}
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optionnel) : alternative, boîte de X comprimés…" rows={2} maxLength={1000} className="w-full px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-500 resize-none" />
          <div className="flex gap-2">
            <button onClick={onCancel} className="flex-1 py-2.5 bg-muted text-muted-foreground font-bold text-sm rounded-xl">Annuler</button>
            <button onClick={submit} disabled={submitting} className="flex-1 py-2.5 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
