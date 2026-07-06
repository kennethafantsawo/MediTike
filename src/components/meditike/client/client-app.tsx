"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Send, ImagePlus, X, Loader2, Clock, CheckCircle2,
  Phone, MapPin, Pill, ChevronRight, FileText, AlertCircle, Trash2, RefreshCw, Bell, Building2,
  BarChart3,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";
import { formatPrice, relativeTimeFr, MAX_PHOTO_SIZE } from "@/lib/meditike/helpers";
import { DutyListView } from "@/components/meditike/shared/duty-list-view";
import { PharmacyRating } from "@/components/meditike/shared/pharmacy-rating";
import { ChatThread } from "@/components/meditike/shared/chat-thread";
import { ClientStats } from "@/components/meditike/client/client-stats";
import { useWhatsAppNotification } from "@/lib/meditike/use-whatsapp-notification";
import { toast } from "sonner";

interface Photo {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

interface Response {
  id: string;
  available: boolean;
  price: number | null;
  note: string | null;
  read: boolean;
  createdAt: string;
  pharmacy: {
    id: string;
    name: string;
    phone1: string;
    phone2: string | null;
    whatsapp: string | null;
    address: string | null;
    district: string | null;
  };
}

interface ClientRequest {
  id: string;
  productName: string;
  note: string | null;
  status: string;
  notifiedPharmacies: number;
  createdAt: string;
  photos: Photo[];
  responses: Response[];
}

interface ClientAppProps {
  user: any;
  onLogout: () => void;
}

export function ClientApp({ user, onLogout }: ClientAppProps) {
  const [view, setView] = useState<"new" | "history" | "duty" | "stats">("new");
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(() => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadRequests();
    // Polling toutes les 30s pour les nouvelles réponses
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  const unreadCount = requests.reduce(
    (sum, r) => sum + r.responses.filter((resp) => !resp.read).length,
    0
  );

  const activeRequests = requests.filter((r) => r.status === "open" || r.status === "responded");
  const oldRequests = requests.filter((r) => r.status === "expired" || r.status === "closed");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={32} />
            <div className="leading-none">
              <p className="font-display font-extrabold text-base">Medi<span className="text-gradient-gold">Tike</span></p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Espace client</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                <Bell className="w-3 h-3" /> {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
              </span>
            )}
            <button onClick={onLogout} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-20">
        {/* TABS */}
        <div className="grid grid-cols-4 p-1 bg-muted rounded-2xl mb-5 sticky top-14 z-20">
          <button onClick={() => setView("new")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${view === "new" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <MessageCircle className="w-4 h-4" /> Demande
          </button>
          <button onClick={() => setView("history")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${view === "history" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <Clock className="w-4 h-4" /> Mes demandes
            {requests.length > 0 && <span className="ml-1 text-[10px] bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">{requests.length}</span>}
          </button>
          <button onClick={() => setView("duty")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${view === "duty" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <Building2 className="w-4 h-4" /> Pharmacies
          </button>
          <button onClick={() => setView("stats")} className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${view === "stats" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
            <BarChart3 className="w-4 h-4" /> Stats
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === "new" ? (
            <motion.div key="new" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <NewRequestForm onSubmitted={() => { setView("history"); loadRequests(); }} />
            </motion.div>
          ) : view === "history" ? (
            <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {loading ? (
                <div className="text-center py-12"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" /></div>
              ) : requests.length === 0 ? (
                <EmptyState onAction={() => setView("new")} />
              ) : (
                <div className="space-y-4">
                  {activeRequests.length > 0 && (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Demandes en cours · {activeRequests.length}</p>
                      {activeRequests.map((req) => <RequestCard key={req.id} request={req} user={user} />)}
                    </>
                  )}
                  {oldRequests.length > 0 && (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-4">Demandes passées · {oldRequests.length}</p>
                      {oldRequests.map((req) => <RequestCard key={req.id} request={req} user={user} />)}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          ) : view === "duty" ? (
            <motion.div key="duty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <DutyListView />
            </motion.div>
          ) : (
            <motion.div key="stats" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <ClientStats />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NewRequestForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [productName, setProductName] = useState("");
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [draftRequestId, setDraftRequestId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (photos.length + files.length > 3) {
      toast.error("Maximum 3 photos par demande");
      return;
    }
    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > MAX_PHOTO_SIZE) {
          toast.error(`${file.name}: trop volumineuse (max 2 Mo)`);
          continue;
        }
        const formData = new FormData();
        formData.append("photo", file);
        if (draftRequestId) formData.append("requestId", draftRequestId);
        const res = await fetch("/api/photos/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (!draftRequestId && data.photo.requestId) {
          setDraftRequestId(data.photo.requestId);
        }
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

  async function removePhoto(photoId: string) {
    // Note: la photo sera supprimée automatiquement par le cron si pas de demande envoyée
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

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
          photoIds: photos.map((p) => p.id),
          draftRequestId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Demande envoyée à ${data.request.notifiedPharmacies} pharmacies !`, {
        description: "Vous recevrez les réponses en temps réel.",
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
        <h1 className="font-display text-2xl font-extrabold mb-1">Nouvelle demande</h1>
        <p className="text-sm text-muted-foreground">Décrivez le médicament que vous cherchez. Votre demande sera envoyée à toutes les pharmacies de garde.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product name */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase mb-2">
            Médicament recherché *
          </label>
          <div className="relative">
            <Pill className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Amoxicilline 500mg, Paracétamol sirop..."
              maxLength={200}
              className="w-full pl-11 pr-4 py-3.5 text-sm bg-white border-2 border-border rounded-2xl font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{productName.length}/200 caractères</p>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase mb-2">
            Note (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Précisions : dosage, forme (sirop/comprimé), quantité, etc."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 text-sm bg-white border-2 border-border rounded-2xl font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
          />
          <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{note.length}/500 caractères</p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase mb-2">
            Photos (optionnel · max 3 · 2 Mo chacune)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                <img src={`/api/photos/${photo.id}`} alt="Photo demande" className="w-full h-full object-cover" />
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
                disabled={uploading}
                className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                <span className="text-[10px] font-bold mt-1">Ajouter</span>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple onChange={handleFileSelect} className="hidden" />
          <p className="text-[10px] text-muted-foreground mt-2 pl-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Vos photos seront supprimées 72h après la 1ère réponse (ou 7j sans réponse).
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !productName.trim()}
          className="w-full brand-gradient text-white py-4 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Envoyer ma demande aux pharmacies
        </button>
      </form>
    </div>
  );
}

function RequestCard({ request, user }: { request: ClientRequest; user: any }) {
  const [expanded, setExpanded] = useState(request.status === "responded");
  const status = request.status as "open" | "responded" | "expired" | "closed";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 hover:bg-muted/30 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-base">{request.productName}</h3>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{relativeTimeFr(request.createdAt)} · {request.notifiedPharmacies} pharmacies notifiées</p>
            {request.responses.length > 0 && (
              <p className="text-xs text-emerald-700 font-bold mt-1">
                {request.responses.length} réponse{request.responses.length > 1 ? "s" : ""} reçue{request.responses.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          {request.note && <p className="text-xs text-muted-foreground italic">Note: "{request.note}"</p>}
          {request.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {request.photos.map((p) => (
                <a key={p.id} href={`/api/photos/${p.id}`} target="_blank" rel="noopener noreferrer" className="aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                  <img src={`/api/photos/${p.id}`} alt="Photo" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}

          {request.responses.length === 0 ? (
            <div className="text-center py-4">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">En attente de réponse des pharmaciens...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Réponses des pharmacies</p>
              {request.responses.map((resp) => <ResponseCard key={resp.id} response={resp} user={user} />)}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function ResponseCard({ response, user }: { response: Response; user: any }) {
  const p = response.pharmacy;
  const { notify, loading: notifLoading } = useWhatsAppNotification();
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <div className="p-3 bg-muted/60 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold">{p.name}</p>
        {response.available ? (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-bold">
            <X className="w-3.5 h-3.5" /> Indisponible
          </span>
        )}
      </div>
      {response.price && <p className="text-base font-bold text-emerald-700 mb-1">{formatPrice(response.price)}</p>}
      {response.note && <p className="text-xs text-muted-foreground italic mb-2">"{response.note}"</p>}
      {p.address && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{p.district ? `${p.district}, ` : ""}{p.address}</span>
        </div>
      )}
      <p className="text-[10px] text-muted-foreground mb-2">{relativeTimeFr(response.createdAt)}</p>
      {response.available && (
        <div className="flex gap-2 flex-wrap">
          <a href={`tel:+228${p.phone1.replace(/\s/g, "")}`} className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors">
            <Phone className="w-3 h-3" /> Appeler
          </a>
          {p.whatsapp && (
            <a href={`https://wa.me/228${p.whatsapp.replace(/\s/g, "").replace("+228", "")}`} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition-colors">
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3 h-3" /> Discuter
          </button>
          {p.whatsapp && (
            <button
              type="button"
              onClick={() => notify(response.id)}
              disabled={notifLoading}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
            >
              {notifLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
              Recevoir sur WhatsApp
            </button>
          )}
        </div>
      )}

      {/* Évaluation de la pharmacie — visible uniquement si le produit est disponible */}
      {response.available && (
        <PharmacyRating pharmacyId={p.id} responseId={response.id} />
      )}

      {/* Modal de discussion client ↔ pharmacien */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-background w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-3 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-display font-bold text-sm">
                  Discussion avec {p.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center"
                  aria-label="Fermer la discussion"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ChatThread
                responseId={response.id}
                currentUser={{
                  id: user.id,
                  fullName: user.fullName,
                  role: user.role,
                }}
                otherUserName={p.name}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: "open" | "responded" | "expired" | "closed" }) {
  if (status === "open") return <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full"><Clock className="w-2.5 h-2.5" /> EN ATTENTE</span>;
  if (status === "responded") return <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full"><CheckCircle2 className="w-2.5 h-2.5" /> RÉPONDUE</span>;
  if (status === "expired") return <span className="inline-flex items-center gap-1 text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded-full"><X className="w-2.5 h-2.5" /> EXPIRÉE</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded-full">CLÔTURÉE</span>;
}

function EmptyState({ onAction }: { onAction: () => void }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-border">
      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-display font-bold text-lg mb-1">Aucune demande pour le moment</h3>
      <p className="text-sm text-muted-foreground mb-5">Envoyez votre première demande de médicament.</p>
      <button onClick={onAction} className="inline-flex items-center gap-2 px-5 py-3 brand-gradient text-white font-bold text-sm rounded-2xl shadow hover:shadow-lg active:scale-[0.98] transition-all">
        <MessageCircle className="w-4 h-4" /> Créer ma demande
      </button>
    </div>
  );
}
