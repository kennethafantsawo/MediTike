"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Clock, CheckCircle2, MessageCircle, Loader2,
  Trophy, TrendingUp, Building2, Zap, CalendarDays,
} from "lucide-react";

// Types miroir de client-app.tsx (évite un import croisé)
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
  photos: { id: string }[];
  responses: Response[];
}

interface PharmacyStat {
  pharmacyId: string;
  pharmacyName: string;
  district: string | null;
  responsesCount: number;
  avgDelayMin: number;
}

interface DayBucket {
  label: string; // ex: "lun."
  date: Date;
  count: number;
}

/**
 * Composant ClientStats
 * Affiche les statistiques personnelles du client :
 * - Total des demandes
 * - Demandes ce mois-ci
 * - Délai moyen de réponse (en minutes)
 * - Taux de résolution
 * - Top 3 pharmacies les plus réactives
 * - Mini-graphique des 7 derniers jours (barres CSS pur)
 *
 * Aucune prop : fetch lui-même /api/requests.
 */
export function ClientStats() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/requests")
      .then((r) => {
        if (!r.ok) throw new Error("Impossible de charger vos statistiques");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Erreur de chargement");
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ─── Calculs statistiques (mémoïsés) ─────────────────────────
  const stats = useMemo(() => {
    const total = requests.length;

    // Demandes ce mois-ci
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = requests.filter(
      (r) => new Date(r.createdAt) >= firstOfMonth
    ).length;

    // Délai moyen de réponse : pour chaque réponse,
    // temps écoulé entre createdAt de la demande et createdAt de la réponse.
    const allDelays: number[] = [];
    requests.forEach((req) => {
      const reqDate = new Date(req.createdAt).getTime();
      req.responses.forEach((resp) => {
        const respDate = new Date(resp.createdAt).getTime();
        const diffMin = (respDate - reqDate) / 60000;
        if (diffMin >= 0) allDelays.push(diffMin);
      });
    });
    const avgDelayMin =
      allDelays.length > 0
        ? Math.round(allDelays.reduce((a, b) => a + b, 0) / allDelays.length)
        : 0;

    // Taux de résolution : demandes avec au moins une réponse / total
    const resolvedCount = requests.filter((r) => r.responses.length > 0).length;
    const resolutionRate =
      total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

    // Top pharmacies les plus réactives (délai moyen le plus court, min 1 réponse)
    const pharmacyMap = new Map<string, PharmacyStat>();
    requests.forEach((req) => {
      const reqDate = new Date(req.createdAt).getTime();
      req.responses.forEach((resp) => {
        const diffMin = (new Date(resp.createdAt).getTime() - reqDate) / 60000;
        if (diffMin < 0) return;
        const existing = pharmacyMap.get(resp.pharmacy.id);
        if (existing) {
          // Recalcul de la moyenne incrémentalement
          const totalMin =
            existing.avgDelayMin * existing.responsesCount + diffMin;
          existing.responsesCount += 1;
          existing.avgDelayMin = Math.round(totalMin / existing.responsesCount);
        } else {
          pharmacyMap.set(resp.pharmacy.id, {
            pharmacyId: resp.pharmacy.id,
            pharmacyName: resp.pharmacy.name,
            district: resp.pharmacy.district,
            responsesCount: 1,
            avgDelayMin: Math.round(diffMin),
          });
        }
      });
    });
    const topPharmacies = Array.from(pharmacyMap.values())
      .sort((a, b) => a.avgDelayMin - b.avgDelayMin)
      .slice(0, 3);

    // Barres 7 derniers jours
    const buckets: DayBucket[] = [];
    const dayLabels = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      buckets.push({
        label: dayLabels[d.getDay()],
        date: d,
        count: 0,
      });
    }
    requests.forEach((r) => {
      const rd = new Date(r.createdAt);
      rd.setHours(0, 0, 0, 0);
      const bucket = buckets.find(
        (b) => b.date.getTime() === rd.getTime()
      );
      if (bucket) bucket.count += 1;
    });
    const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

    return {
      total,
      thisMonth,
      avgDelayMin,
      resolutionRate,
      resolvedCount,
      topPharmacies,
      buckets,
      maxBucket,
    };
  }, [requests]);

  // ─── États d'attente / erreur ─────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-border">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-border">
        <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-display font-bold text-lg mb-1">Pas encore de statistiques</h3>
        <p className="text-sm text-muted-foreground">
          Vos statistiques apparaîtront dès votre première demande.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Titre */}
      <div>
        <h1 className="font-display text-2xl font-extrabold mb-1">Mes statistiques</h1>
        <p className="text-sm text-muted-foreground">
          Suivez l'activité de vos demandes et la réactivité des pharmacies.
        </p>
      </div>

      {/* Cartes stats principales */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<MessageCircle className="w-4 h-4" />}
          label="Total des demandes"
          value={stats.total.toString()}
          hint={`${stats.resolvedCount} avec réponse`}
          color="emerald"
        />
        <StatCard
          icon={<CalendarDays className="w-4 h-4" />}
          label="Ce mois-ci"
          value={stats.thisMonth.toString()}
          hint={stats.thisMonth > 0 ? "nouvelle(s) demande(s)" : "aucune"}
          color="bronze"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Délai moyen de réponse"
          value={formatDelay(stats.avgDelayMin)}
          hint={stats.avgDelayMin > 0 ? "réactivité moyenne" : "—"}
          color="emerald"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Taux de résolution"
          value={`${stats.resolutionRate}%`}
          hint={`${stats.resolvedCount}/${stats.total} demandes`}
          color="bronze"
        />
      </div>

      {/* Graphique 7 derniers jours */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white border border-border rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-display font-bold text-sm">7 derniers jours</h3>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            {stats.buckets.reduce((a, b) => a + b.count, 0)} demandes
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 h-28">
          {stats.buckets.map((bucket, i) => {
            const heightPct = (bucket.count / stats.maxBucket) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="flex-1 w-full flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPct, bucket.count > 0 ? 8 : 2)}%` }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`w-full rounded-t-md ${
                      bucket.count > 0
                        ? "brand-gradient"
                        : "bg-muted"
                    }`}
                    style={{ minHeight: 2 }}
                    title={`${bucket.count} demande(s)`}
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {bucket.count > 0 ? bucket.count : "·"}
                </span>
                <span className="text-[10px] text-muted-foreground">{bucket.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top 3 pharmacies les plus réactives */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="bg-white border border-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-600" />
          <h3 className="font-display font-bold text-sm">Pharmacies les plus réactives</h3>
        </div>

        {stats.topPharmacies.length === 0 ? (
          <div className="text-center py-6">
            <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Aucune réponse reçue pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.topPharmacies.map((pharma, i) => (
              <PharmacyRankCard key={pharma.pharmacyId} rank={i + 1} stat={pharma} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Sous-composants ─────────────────────────────────────────

function StatCard({
  icon, label, value, hint, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  color: "emerald" | "bronze";
}) {
  const colors = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      bar: "bg-emerald-500",
    },
    bronze: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      bar: "bg-amber-500",
    },
  };
  const c = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-2xl p-3.5 relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />
      <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-2xl font-extrabold leading-tight mt-0.5">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>
    </motion.div>
  );
}

function PharmacyRankCard({ rank, stat }: { rank: number; stat: PharmacyStat }) {
  const rankStyles = [
    { bg: "bg-amber-100", text: "text-amber-700", emoji: "🥇" },
    { bg: "bg-slate-100", text: "text-slate-700", emoji: "🥈" },
    { bg: "bg-orange-100", text: "text-orange-700", emoji: "🥉" },
  ];
  const style = rankStyles[rank - 1] || rankStyles[2];

  return (
    <div className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-xl">
      <div className={`w-8 h-8 rounded-lg ${style.bg} ${style.text} flex items-center justify-center text-base shrink-0`}>
        {style.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{stat.pharmacyName}</p>
        <p className="text-[10px] text-muted-foreground">
          {stat.district ? `${stat.district} · ` : ""}
          {stat.responsesCount} réponse{stat.responsesCount > 1 ? "s" : ""}
        </p>
      </div>
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 text-emerald-700 font-bold text-sm">
          <Zap className="w-3 h-3" />
          {formatDelay(stat.avgDelayMin)}
        </div>
        <p className="text-[9px] text-muted-foreground">en moyenne</p>
      </div>
    </div>
  );
}

/** Formate un délai en minutes vers une chaîne lisible. */
function formatDelay(min: number): string {
  if (min <= 0) return "—";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return m > 0 ? `${h} h ${m}` : `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} j`;
}
