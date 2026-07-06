"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, Upload, FileText, Users, LogOut,
  Loader2, Plus, Trash2, CheckCircle2, AlertCircle, Phone, MapPin,
  TrendingUp, Activity, Shield, Clock, FileSpreadsheet, Download,
  Calendar, PencilLine, KeyRound, Copy, Check, X,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";
import { formatPrice, relativeTimeFr, formatDateShortFr } from "@/lib/meditike/helpers";
import { toast } from "sonner";

interface AdminAppProps {
  user: any;
  onLogout: () => void;
}

type Tab = "dashboard" | "pharmacies" | "import" | "requests" | "users" | "audit";

export function AdminApp({ user, onLogout }: AdminAppProps) {
  const [tab, setTab] = useState<Tab>("dashboard");

  const tabs: Array<{ id: Tab; label: string; icon: any }> = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "pharmacies", label: "Pharmacies", icon: Building2 },
    { id: "import", label: "Import garde", icon: Upload },
    { id: "requests", label: "Demandes", icon: FileText },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "audit", label: "Journal", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/30">
      {/* SIDEBAR (desktop) */}
      <aside className="hidden lg:flex w-64 bg-foreground text-background flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-background/10">
          <div className="flex items-center gap-2 text-white">
            <LogoMark size={32} />
            <div className="leading-none">
              <p className="font-display font-extrabold text-base">MediTike</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">Espace Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.id ? "bg-amber-400 text-emerald-900" : "text-background/70 hover:bg-background/10"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-background/10">
          <div className="px-3 py-2 text-xs text-background/60">
            <p className="font-bold text-background/80">{user.fullName}</p>
            <p>{user.phone}</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-background/70 hover:bg-background/10 rounded-xl">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-30 bg-foreground text-background">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <LogoMark size={28} />
            <span className="font-display font-extrabold text-sm">MediTike Admin</span>
          </div>
          <button onClick={onLogout} className="text-xs font-bold text-amber-300">Déconnexion</button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-1 px-2 pb-2 min-w-max">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${tab === t.id ? "bg-amber-400 text-emerald-900" : "bg-background/10 text-background/70"}`}>
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {tab === "dashboard" && <DashboardTab />}
            {tab === "pharmacies" && <PharmaciesTab />}
            {tab === "import" && <ImportTab />}
            {tab === "requests" && <RequestsTab />}
            {tab === "users" && <UsersTab currentUser={user} />}
            {tab === "audit" && <AuditTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((data) => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  if (!stats) return <div className="text-center py-12 text-muted-foreground">Erreur de chargement</div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold mb-1">Tableau de bord</h1>
      <p className="text-sm text-muted-foreground mb-6">Vue d'ensemble de la plateforme MediTike.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Clients" value={stats.counts.clients} color="emerald" />
        <StatCard icon={Building2} label="Pharmacies" value={stats.counts.pharmacies} color="amber" sub={`${stats.counts.activePharmacies} actives`} />
        <StatCard icon={FileText} label="Demandes" value={stats.requestsByStatus.open + stats.requestsByStatus.responded} color="terra" sub={`${stats.requestsByStatus.open} en attente`} />
        <StatCard icon={Activity} label="Réponses" value={stats.counts.responses} color="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-600" /> Demandes 7 derniers jours</h3>
          <div className="space-y-2">
            {stats.requestsLast7Days.map((d: any) => (
              <div key={d.date} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20">{new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit" })}</span>
                <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden flex">
                  <div className="bg-amber-400 h-full" style={{ width: `${d.total ? (d.responded / d.total) * 100 : 0}%` }} title="Répondues" />
                  <div className="bg-emerald-500 h-full" style={{ width: `${d.total ? (d.open / d.total) * 100 : 0}%` }} title="En attente" />
                </div>
                <span className="text-xs font-bold w-8 text-right">{d.total}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Répondues</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> En attente</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-amber-600" /> Top 5 pharmacies actives</h3>
          {stats.topPharmacies.length === 0 ? (
            <p className="text-xs text-muted-foreground">Pas encore de données.</p>
          ) : (
            <div className="space-y-2">
              {stats.topPharmacies.map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm font-semibold truncate">{p.name}</span>
                  <span className="text-xs font-bold text-emerald-700">{p.responsesCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5">
          <Clock className="w-6 h-6 text-emerald-600 mb-2" />
          <p className="text-2xl font-display font-extrabold">{stats.counts.dutyWeeks}</p>
          <p className="text-xs text-muted-foreground">semaines de garde importées</p>
          <p className="text-[10px] text-muted-foreground mt-1">Semaine courante: {stats.counts.currentWeekDuty} pharmacies</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <Shield className="w-6 h-6 text-amber-600 mb-2" />
          <p className="text-2xl font-display font-extrabold">{stats.photos.active}</p>
          <p className="text-xs text-muted-foreground">photos actives</p>
          <p className="text-[10px] text-muted-foreground mt-1">{stats.photos.deleted} déjà supprimées</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <Activity className="w-6 h-6 text-terra mb-2" style={{ color: "oklch(0.6 0.16 38)" }} />
          <p className="text-2xl font-display font-extrabold">{stats.counts.auditLogs}</p>
          <p className="text-xs text-muted-foreground">actions admin journalisées</p>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" /> Dernières actions admin</h3>
        {stats.recentAuditLogs.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aucune action enregistrée.</p>
        ) : (
          <div className="space-y-2">
            {stats.recentAuditLogs.map((log: any) => (
              <div key={log.id} className="flex items-center gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold">{log.action}</span>
                <span className="text-muted-foreground">par {log.admin?.fullName || log.admin?.phone}</span>
                <span className="text-muted-foreground ml-auto">{relativeTimeFr(log.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, sub }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    terra: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-border p-4">
      <div className={`w-9 h-9 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-display font-extrabold text-2xl leading-none">{value.toLocaleString("fr-FR")}</p>
      <p className="text-xs text-muted-foreground font-semibold mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function PharmaciesTab() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/pharmacies").then((r) => r.json()).then((data) => { setPharmacies(data.pharmacies || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(id: string, current: boolean) {
    if (!confirm(current ? "Désactiver cette pharmacie ? Les pharmaciens liés ne pourront plus se connecter." : "Réactiver cette pharmacie ?")) return;
    const action = current ? "deactivate" : "activate";
    const res = await fetch(`/api/admin/pharmacies?id=${id}&action=${action}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    toast.success(current ? "Pharmacie désactivée" : "Pharmacie réactivée");
    load();
  }

  /**
   * Supprime définitivement une pharmacie. Si elle a de l'historique
   * (réponses liées), l'API la désactive à la place et renvoie un message.
   */
  async function deletePharmacy(id: string, name: string, responsesCount: number) {
    const hasHistory = responsesCount > 0;
    const confirmMsg = hasHistory
      ? `« ${name} » a de l'historique (${responsesCount} réponse(s)). Elle sera désactivée au lieu d'être supprimée. Continuer ?`
      : `Êtes-vous sûr de vouloir supprimer définitivement la pharmacie « ${name} » ? Cette action est irréversible.`;
    if (!confirm(confirmMsg)) return;
    const res = await fetch(`/api/admin/pharmacies?id=${id}&action=delete`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    if (data.action === "deactivated") {
      toast.success("Pharmacie désactivée (historique préservé)", {
        description: data.message,
      });
    } else {
      toast.success("Pharmacie supprimée définitivement");
    }
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold mb-1">Gestion des pharmacies</h1>
          <p className="text-sm text-muted-foreground">Créez et gérez les pharmacies partenaires.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 brand-gradient text-white font-bold text-sm rounded-xl shadow hover:shadow-md transition-all">
          <Plus className="w-4 h-4" /> Nouvelle pharmacie
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      ) : pharmacies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucune pharmacie enregistrée.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground p-3">Pharmacie</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground p-3 hidden sm:table-cell">Téléphone</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground p-3 hidden md:table-cell">Adresse</th>
                <th className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground p-3">Statut</th>
                <th className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p._count?.users || 0} pharmacien(s) · {p._count?.productResponses || 0} réponse(s)</p>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-sm">{p.phone1}</td>
                  <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">{p.district || p.city}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {p.isActive ? "ACTIVE" : "DÉSACTIVÉE"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button onClick={() => toggleActive(p.id, p.isActive)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                        {p.isActive ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        onClick={() => deletePharmacy(p.id, p.name, p._count?.productResponses || 0)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showForm && <NewPharmacyModal onClose={() => setShowForm(false)} onCreated={() => { setShowForm(false); load(); }} />}
      </AnimatePresence>
    </div>
  );
}

function NewPharmacyModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "", phone1: "", phone2: "", whatsapp: "", address: "", city: "Lomé", district: "",
    pharmacistPhone: "", pharmacistPassword: "", pharmacistFullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pharmacies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Pharmacie "${form.name}" créée avec son compte pharmacien`);
      onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="brand-gradient p-5 text-white relative">
          <h2 className="font-display font-extrabold text-xl">Nouvelle pharmacie</h2>
          <p className="text-xs text-white/75 mt-1">Crée la pharmacie + son compte pharmacien.</p>
          <div className="absolute bottom-0 left-0 right-0"><KenteDivider /></div>
        </div>
        <form onSubmit={submit} className="p-5 space-y-3">
          {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-xs font-semibold">{error}</div>}
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-1">Informations pharmacie</div>
          <input required placeholder="Nom pharmacie *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder="Téléphone 1 *" value={form.phone1} onChange={(e) => setForm({ ...form, phone1: e.target.value })} className="admin-input" />
            <input placeholder="Téléphone 2" value={form.phone2} onChange={(e) => setForm({ ...form, phone2: e.target.value })} className="admin-input" />
          </div>
          <input placeholder="WhatsApp (si différent)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="admin-input" />
          <input placeholder="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="admin-input" />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="admin-input" />
            <input placeholder="Quartier" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="admin-input" />
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-3">Compte pharmacien</div>
          <input required placeholder="Nom pharmacien (optionnel)" value={form.pharmacistFullName} onChange={(e) => setForm({ ...form, pharmacistFullName: e.target.value })} className="admin-input" />
          <input required placeholder="Téléphone pharmacien (+228XXXXXXXX) *" value={form.pharmacistPhone} onChange={(e) => setForm({ ...form, pharmacistPhone: e.target.value })} className="admin-input" />
          <input required type="password" placeholder="Mot de passe pharmacien * (min 8 car.)" value={form.pharmacistPassword} onChange={(e) => setForm({ ...form, pharmacistPassword: e.target.value })} className="admin-input" />

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-muted text-muted-foreground font-bold text-sm rounded-xl">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Créer
            </button>
          </div>
        </form>
        <style jsx>{`:global(.admin-input){width:100%;padding:0.625rem 0.875rem;font-size:0.875rem;background:var(--muted);border:1px solid var(--border);border-radius:0.75rem;font-weight:500}:global(.admin-input:focus){outline:none;border-color:var(--primary);background:white}`}</style>
      </motion.div>
    </motion.div>
  );
}

function ImportTab() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Section ajout manuel ─────────────────────────────────────────
  const [selectedWeek, setSelectedWeek] = useState<string>(""); // YYYY-MM-DD
  const [duties, setDuties] = useState<any[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [weekCounts, setWeekCounts] = useState<Record<string, number>>({});
  const [loadingDuties, setLoadingDuties] = useState(false);
  const [manuallyAdding, setManuallyAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone1: "",
    phone2: "",
  });

  /** Charge les pharmacies de garde pour une semaine donnée. */
  const loadDuties = useCallback(async (week: string) => {
    if (!week) return;
    setLoadingDuties(true);
    try {
      const res = await fetch(`/api/admin/duty?week=${encodeURIComponent(week)}`);
      const data = await res.json();
      if (res.ok) {
        setDuties(data.duties || []);
        setAvailableWeeks(data.availableWeeks || []);
        const counts: Record<string, number> = {};
        for (const w of data.weekCounts || []) {
          counts[w.weekStart] = w.count;
        }
        setWeekCounts(counts);
      } else {
        toast.error(data.error || "Erreur de chargement");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoadingDuties(false);
    }
  }, []);

  // Charge la semaine courante au montage
  useEffect(() => {
    fetch("/api/admin/duty")
      .then((r) => r.json())
      .then((data) => {
        setAvailableWeeks(data.availableWeeks || []);
        const counts: Record<string, number> = {};
        for (const w of data.weekCounts || []) {
          counts[w.weekStart] = w.count;
        }
        setWeekCounts(counts);
        if (data.weekStart) {
          setSelectedWeek(data.weekStart);
        }
      })
      .catch(() => {});
  }, []);

  // Recharge les gardes quand la semaine sélectionnée change
  useEffect(() => {
    if (selectedWeek) loadDuties(selectedWeek);
  }, [selectedWeek, loadDuties]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/import", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      toast.success(`${data.weeksImported} semaines importées, ${data.pharmaciesImported} pharmacies`);
      // Recharger les semaines disponibles après import
      if (selectedWeek) loadDuties(selectedWeek);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  /** Soumission du formulaire d'ajout manuel. */
  async function handleManualAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Le nom de la pharmacie est requis");
      return;
    }
    if (!selectedWeek) {
      toast.error("Veuillez sélectionner une semaine");
      return;
    }
    setManuallyAdding(true);
    try {
      const res = await fetch("/api/admin/duty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          phone1: form.phone1,
          phone2: form.phone2,
          weekStart: selectedWeek,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Pharmacie « ${form.name} » ajoutée pour la semaine`);
      setForm({ name: "", address: "", phone1: "", phone2: "" });
      loadDuties(selectedWeek);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setManuallyAdding(false);
    }
  }

  /** Supprime une entrée de garde. */
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer « ${name} » de la liste de garde de cette semaine ?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/duty?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Entrée supprimée");
      loadDuties(selectedWeek);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold mb-1">Import pharmacies de garde</h1>
      <p className="text-sm text-muted-foreground mb-6">Importez le fichier officiel du Ministère de la Santé (.xlsx) ou un fichier JSON personnalisé, ou ajoutez une pharmacie manuellement.</p>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Dropzone */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-border p-8 text-center">
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.json" onChange={handleFile} className="hidden" />
          <FileSpreadsheet className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg mb-1">Glissez ou cliquez pour importer</h3>
          <p className="text-xs text-muted-foreground mb-4">Formats acceptés: .xlsx, .xls, .json (max 10 Mo)</p>
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-5 py-3 brand-gradient text-white font-bold text-sm rounded-xl shadow hover:shadow-lg disabled:opacity-60">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Import en cours..." : "Choisir un fichier"}
          </button>
        </div>

        {/* Format JSON */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-display font-bold text-sm mb-2 flex items-center gap-2"><Download className="w-4 h-4 text-amber-600" /> Format JSON attendu</h3>
          <pre className="text-[10px] bg-foreground text-background p-3 rounded-xl overflow-x-auto leading-relaxed">{`{
  "version": "1.0",
  "source": "Ministère de la Santé Togo",
  "weeks": [
    {
      "weekStart": "2026-07-06",
      "weekEnd": "2026-07-13",
      "pharmacies": [
        {
          "name": "SANTE",
          "address": "Près de NOPATO",
          "phone1": "70 44 91 37",
          "phone2": null
        }
      ]
    }
  ]
}`}</pre>
          <p className="text-[10px] text-muted-foreground mt-2">Dates au format ISO (YYYY-MM-DD). weekStart = lundi.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-semibold mb-4"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}

      {result && (
        <div className="bg-white rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Import réussi</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="font-display font-extrabold text-2xl text-emerald-700">{result.weeksImported}</p>
              <p className="text-[10px] text-muted-foreground">semaines</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="font-display font-extrabold text-2xl text-amber-700">{result.pharmaciesImported}</p>
              <p className="text-[10px] text-muted-foreground">entrées pharmacies</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="font-display font-extrabold text-2xl text-orange-700">{result.errors.length}</p>
              <p className="text-[10px] text-muted-foreground">erreurs</p>
            </div>
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer font-bold text-muted-foreground">Voir le détail ({result.parsed.weeksPreview.length} semaines)</summary>
            <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
              {result.parsed.weeksPreview.map((w: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/40 rounded">
                  <span className="font-mono text-[10px]">{new Date(w.weekStart).toISOString().slice(0, 10)}</span>
                  <span className="flex-1">{w.weekLabel}</span>
                  <span className="font-bold">{w.pharmaciesCount} pharmacies</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* ── GESTION MANUELLE PAR SEMAINE ───────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-1 flex items-center gap-2">
          <PencilLine className="w-4 h-4 text-emerald-600" /> Ajout manuel
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Ajoutez ou retirez une pharmacie de garde pour une semaine précise.
        </p>

        {/* Sélecteur de semaine */}
        <div className="bg-muted/40 rounded-xl p-3 mb-4">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Semaine de garde (lundi)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border rounded-xl font-medium focus:outline-none focus:border-primary"
              />
            </div>
            {availableWeeks.length > 0 && (
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-3 py-2.5 text-sm bg-white border border-border rounded-xl font-medium focus:outline-none focus:border-primary"
              >
                <option value="">— Semaines déjà importées —</option>
                {availableWeeks.map((w) => (
                  <option key={w} value={w}>
                    {formatDateShortFr(w)} ({weekCounts[w] || 0} pharmacies)
                  </option>
                ))}
              </select>
            )}
          </div>
          {selectedWeek && (
            <p className="text-[10px] text-muted-foreground mt-2">
              Semaine du <span className="font-bold">{formatDateShortFr(selectedWeek)}</span>
              {availableWeeks.includes(selectedWeek) && weekCounts[selectedWeek]
                ? ` · ${weekCounts[selectedWeek]} pharmacie(s) déjà enregistrée(s)`
                : " · Aucune pharmacie enregistrée pour cette semaine"}
            </p>
          )}
        </div>

        {/* Liste des pharmacies pour la semaine sélectionnée */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pharmacies de garde pour cette semaine
            </h4>
            <span className="text-[10px] font-bold text-muted-foreground">
              {duties.length} entrée(s)
            </span>
          </div>
          {loadingDuties ? (
            <div className="py-6 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : duties.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl">
              {selectedWeek
                ? "Aucune pharmacie de garde pour cette semaine. Utilisez le formulaire ci-dessous pour en ajouter une."
                : "Sélectionnez une semaine pour voir la liste."}
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {duties.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl border border-border/60"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{d.name}</p>
                    {d.address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {d.address}
                      </p>
                    )}
                    {(d.phone1 || d.phone2) && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {[d.phone1, d.phone2].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {d.sourceFile && d.sourceFile !== "ajout-manuel" && (
                      <p className="text-[10px] text-muted-foreground mt-1 italic">
                        Source : {d.sourceFile}
                      </p>
                    )}
                    {d.sourceFile === "ajout-manuel" && (
                      <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                        Ajout manuel
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(d.id, d.name)}
                    disabled={deletingId === d.id}
                    aria-label={`Supprimer ${d.name}`}
                    className="shrink-0 p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === d.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulaire d'ajout manuel */}
        <form onSubmit={handleManualAdd} className="border-t border-border pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Ajouter une pharmacie pour cette semaine
          </h4>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <input
              required
              placeholder="Nom de la pharmacie *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-xl font-medium focus:outline-none focus:border-primary focus:bg-white"
            />
            <input
              placeholder="Adresse"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-xl font-medium focus:outline-none focus:border-primary focus:bg-white"
            />
            <input
              placeholder="Téléphone 1"
              value={form.phone1}
              onChange={(e) => setForm({ ...form, phone1: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-xl font-medium focus:outline-none focus:border-primary focus:bg-white"
            />
            <input
              placeholder="Téléphone 2"
              value={form.phone2}
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-xl font-medium focus:outline-none focus:border-primary focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={manuallyAdding || !selectedWeek}
            className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 brand-gradient text-white font-bold text-sm rounded-xl shadow hover:shadow-md disabled:opacity-60 transition-all"
          >
            {manuallyAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Ajouter
          </button>
          {!selectedWeek && (
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Sélectionnez d'abord une semaine ci-dessus.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function RequestsTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => { setRequests(data.requests || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  /** Supprime une demande après confirmation. */
  async function handleDelete(req: any) {
    const responsesCount = req.responses?.length || 0;
    const msg = responsesCount > 0
      ? `Supprimer la demande « ${req.productName} » ? Les ${responsesCount} réponse(s) et photos liées seront aussi supprimées. Cette action est irréversible.`
      : `Supprimer la demande « ${req.productName} » ? Les photos liées seront aussi supprimées. Cette action est irréversible.`;
    if (!confirm(msg)) return;
    setDeletingId(req.id);
    try {
      const res = await fetch(`/api/admin/requests?id=${req.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Demande supprimée");
      load();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold mb-1">Toutes les demandes</h1>
      <p className="text-sm text-muted-foreground mb-6">{requests.length} demande(s) au total.</p>
      {loading ? <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div> : requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border"><FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">Aucune demande.</p></div>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-border p-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-amber-600" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{req.productName}</p>
                <p className="text-xs text-muted-foreground">{req.client?.fullName} ({req.client?.phone}) · {relativeTimeFr(req.createdAt)}</p>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">{req.responses?.length || 0} réponse(s)</p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-muted">{req.status}</span>
              <button
                onClick={() => handleDelete(req)}
                disabled={deletingId === req.id}
                aria-label={`Supprimer la demande ${req.productName}`}
                title="Supprimer définitivement"
                className="shrink-0 p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab({ currentUser }: { currentUser: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Mot de passe temporaire affiché dans le modal après réinitialisation
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  // Utilisateur concerné par la réinitialisation (pour le récap)
  const [resetTarget, setResetTarget] = useState<any | null>(null);
  // ID de l'utilisateur dont le reset est en cours
  const [resettingId, setResettingId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((data) => { setUsers(data.users || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggleActive(userId: string, current: boolean) {
    if (userId === currentUser?.id) {
      toast.error("Action interdite sur votre propre compte");
      return;
    }
    const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, isActive: !current }) });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    toast.success(current ? "Utilisateur désactivé" : "Utilisateur activé");
    load();
  }

  /** Réinitialise le mot de passe d'un utilisateur et affiche le modal. */
  async function resetPassword(user: any) {
    if (user.id === currentUser?.id) {
      toast.error("Action interdite sur votre propre compte");
      return;
    }
    if (!confirm(`Réinitialiser le mot de passe de ${user.fullName || user.phone} ? Un nouveau mot de passe temporaire sera généré.`)) return;
    setResettingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "reset-password" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResetTarget(user);
      setTempPassword(data.temporaryPassword);
      toast.success("Mot de passe réinitialisé");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la réinitialisation");
    } finally {
      setResettingId(null);
    }
  }

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold mb-1">Utilisateurs</h1>
      <p className="text-sm text-muted-foreground mb-2">{users.length} utilisateur(s) au total.</p>
      <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
        L'identifiant de connexion est le numéro de téléphone. Les mots de passe sont chiffrés : utilisez « Réinitialiser » pour générer un mot de passe temporaire.
      </p>
      <div className="bg-white rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-xs font-bold uppercase p-3">Nom</th>
              <th className="text-left text-xs font-bold uppercase p-3 hidden sm:table-cell">Identifiant (téléphone)</th>
              <th className="text-left text-xs font-bold uppercase p-3">Rôle</th>
              <th className="text-left text-xs font-bold uppercase p-3 hidden md:table-cell">Pharmacie</th>
              <th className="text-center text-xs font-bold uppercase p-3">Statut</th>
              <th className="text-right text-xs font-bold uppercase p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 text-sm font-bold">{u.fullName || "—"}</td>
                <td className="p-3 hidden sm:table-cell text-sm font-mono">{u.phone}</td>
                <td className="p-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${u.role === "admin" ? "bg-amber-100 text-amber-700" : u.role === "pharmacist" ? "bg-emerald-100 text-emerald-700" : "bg-muted"}`}>{u.role}</span></td>
                <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">{u.pharmacyName || "—"}</td>
                <td className="p-3 text-center"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{u.isActive ? "ACTIF" : "INACTIF"}</span></td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => resetPassword(u)}
                    disabled={resettingId === u.id}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 disabled:opacity-50 inline-flex items-center gap-1"
                    title="Générer un nouveau mot de passe temporaire"
                  >
                    {resettingId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                    Réinitialiser mdp
                  </button>
                  <span className="text-muted-foreground/40 mx-2">·</span>
                  <button onClick={() => toggleActive(u.id, u.isActive)} className="text-xs font-bold text-muted-foreground hover:text-foreground">{u.isActive ? "Désactiver" : "Activer"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal affichant le mot de passe temporaire */}
      <AnimatePresence>
        {tempPassword && resetTarget && (
          <TemporaryPasswordModal
            user={resetTarget}
            password={tempPassword}
            onClose={() => { setTempPassword(null); setResetTarget(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Modal affichant un mot de passe temporaire généré pour un utilisateur.
 * Permet de le copier dans le presse-papier.
 */
function TemporaryPasswordModal({ user, password, onClose }: { user: any; password: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Mot de passe copié");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier automatiquement. Sélectionnez le texte manuellement.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="brand-gradient relative px-6 pt-5 pb-5 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg leading-none">Mot de passe réinitialisé</h2>
              <p className="text-white/75 text-xs mt-1">Communiquez-le à l'utilisateur</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0"><KenteDivider /></div>
        </div>

        {/* Corps */}
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-1">Compte concerné :</p>
          <p className="text-sm font-bold mb-4">
            {user.fullName || "Sans nom"}
            <span className="text-muted-foreground font-normal"> · {user.phone}</span>
          </p>

          <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">
            Mot de passe temporaire
          </label>
          <div className="relative">
            <input
              readOnly
              value={password}
              onFocus={(e) => e.target.select()}
              className="w-full px-4 py-3 pr-12 text-base font-mono font-bold tracking-wider bg-muted border border-border rounded-xl focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white border border-border hover:bg-muted flex items-center justify-center transition-colors"
              title="Copier"
              aria-label="Copier le mot de passe"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
            <p className="text-xs text-amber-900 font-semibold leading-relaxed">
              ⚠️ Ce mot de passe est temporaire. L'utilisateur devra le changer à sa prochaine connexion.
              Ne le communiquez que par un canal sécurisé (en main propre ou appel).
            </p>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié !" : "Copier le mot de passe"}
            </button>
            <button onClick={onClose} className="flex-1 py-3 bg-muted text-muted-foreground font-bold text-sm rounded-xl">
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit?limit=100").then((r) => r.json()).then((data) => { setLogs(data.logs || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold mb-1">Journal d'audit</h1>
      <p className="text-sm text-muted-foreground mb-6">Toutes les actions sensibles sont journalisées.</p>
      {loading ? <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div> : logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border"><Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">Aucune action enregistrée.</p></div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-xl border border-border p-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"><Shield className="w-4 h-4 text-emerald-600" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{log.action}</p>
                <p className="text-xs text-muted-foreground">par {log.admin?.fullName || log.admin?.phone} · {relativeTimeFr(log.createdAt)}</p>
                {log.details && <p className="text-[10px] text-muted-foreground font-mono mt-1 break-all">{log.details}</p>}
              </div>
              {log.ip && <span className="text-[10px] text-muted-foreground font-mono">{log.ip}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
