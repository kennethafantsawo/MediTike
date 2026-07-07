"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Clock, CheckCircle2, Loader2, CalendarDays,
  TrendingUp, Trophy, Pill, Percent, MessageSquareReply,
} from "lucide-react";

// Types miroir de pharmacist-app.tsx (évite un import croisé)
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
  photos: { id: string }[];
  responses: PharmacistResponse[];
}

interface ProductStat {
  productName: string;
  count: number;
  availableCount: number;
}

interface DayBucket {
  label: string; // ex: "lun."
  date: Date;
  count: number;
}

/**
 * Composant PharmacistStats
 * Affiche les statistiques du pharmacien connecté :
 * - Nombre total de réponses données
 * - Réponses ce mois-ci
 * - Délai moyen de réponse (entre la demande et la réponse)
 * - Taux de disponibilité (réponses "available: true" / total)
 * - Mini-graphique des 7 derniers jours (barres CSS pur)
 * - Top 3 des médicaments les plus demandés (ceux auxquels il a répondu)
 *
 * Aucune prop : fetch lui-même /api/requests et filtre les réponses
 * du pharmacien côté client (l'API filtre déjà par pharmacistId côté serveur).
 */
export function PharmacistStats() {
  const [requests, setRequests] = useState<PharmacistRequest[]>([]);
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
    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Calculs statistiques (mémoïsés) ─────────────────────────
  // On ne garde que les demandes auxquelles le pharmacien a répondu.
  const stats = useMemo(() => {
    const answeredRequests = requests.filter((r) => r.responses.length > 0);

    // Toutes mes réponses (à plat) avec leur demande associée
    type FlatResp = {
      response: PharmacistResponse;
      request: PharmacistRequest;
    };
    const flat: FlatResp[] = [];
    answeredRequests.forEach((req) => {
      req.responses.forEach((response) => {
        flat.push({ response, request: req });
      });
    });

    const totalResponses = flat.length;

    // Réponses ce mois-ci
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = flat.filter(
      (f) => new Date(f.response.createdAt) >= firstOfMonth
    ).length;

    // Délai moyen de réponse : temps entre createdAt de la demande
    // et createdAt de la réponse (en minutes).
    const delays: number[] = flat
      .map((f) => {
        const diffMin =
          (new Date(f.response.createdAt).getTime() -
            new Date(f.request.createdAt).getTime()) /
          60000;
        return diffMin >= 0 ? diffMin : 0;
      });
    const avgDelayMin =
      delays.length > 0
        ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length)
        : 0;

    // Taux de disponibilité : réponses "available: true" / total
    const availableCount = flat.filter((f) => f.response.available).length;
    const availabilityRate =
      totalResponses > 0
        ? Math.round((availableCount / totalResponses) * 100)
        : 0;

    // Barres 7 derniers jours : nombre de réponses par jour
    const buckets: DayBucket[] = [];
    const dayLabels = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      buckets.push({ label: dayLabels[d.getDay()], date: d, count: 0 });
    }
    flat.forEach((f) => {
      const rd = new Date(f.response.createdAt);
      rd.setHours(0, 0, 0, 0);
      const bucket = buckets.find((b) => b.date.getTime() === rd.getTime());
      if (bucket) bucket.count += 1;
    });
    const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

    // Top 3 médicaments les plus demandés (ceux auxquels il a répondu)
    const productMap = new Map<string, ProductStat>();
    flat.forEach((f) => {
      const name = f.request.productName;
      const existing = productMap.get(name);
      if (existing) {
        existing.count += 1;
        if (f.response.available) existing.availableCount += 1;
      } else {
        productMap.set(name, {
          productName: name,
          count: 1,
          availableCount: f.response.available ? 1 : 0,
        });
      }
    });
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      totalResponses,
      thisMonth,
      avgDelayMin,
      availabilityRate,
      availableCount,
      buckets,
      maxBucket,
      topProducts,
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
  if (stats.totalResponses === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-border">
        <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-display font-bold text-lg mb-1">
          Pas encore de statistiques
        </h3>
        <p className="text-sm text-muted-foreground">
          Vos statistiques apparaîtront dès votre première réponse à une demande.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Titre */}
      <div>
        <h1 className="font-display text-2xl font-extrabold mb-1">
          Mes statistiques
        </h1>
        <p className="text-sm text-muted-foreground">
          Suivez votre activité et votre réactivité face aux demandes des clients.
        </p>
      </div>

      {/* Cartes stats principales */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<MessageSquareReply className="w-4 h-4" />}
          label="Total des réponses"
          value={stats.totalResponses.toString()}
          hint={`${stats.availableCount} en stock`}
          color="emerald"
        />
        <StatCard
          icon={<CalendarDays className="w-4 h-4" />}
          label="Ce mois-ci"
          value={stats.thisMonth.toString()}
          hint={stats.thisMonth > 0 ? "nouvelle(s) réponse(s)" : "aucune"}
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
          icon={<Percent className="w-4 h-4" />}
          label="Taux de disponibilité"
          value={`${stats.availabilityRate}%`}
          hint={`${stats.availableCount}/${stats.totalResponses} en stock`}
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
            {stats.buckets.reduce((a, b) => a + b.count, 0)} réponses
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 h-28">
          {stats.buckets.map((bucket, i) => {
            const heightPct = (bucket.count / stats.maxBucket) * 100;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div className="flex-1 w-full flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${Math.max(heightPct, bucket.count > 0 ? 8 : 2)}%`,
                    }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`w-full rounded-t-md ${
                      bucket.count > 0 ? "brand-gradient" : "bg-muted"
                    }`}
                    style={{ minHeight: 2 }}
                    title={`${bucket.count} réponse(s)`}
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {bucket.count > 0 ? bucket.count : "·"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {bucket.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top 3 médicaments les plus demandés */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="bg-white border border-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-600" />
          <h3 className="font-display font-bold text-sm">
            Médicaments les plus demandés
          </h3>
        </div>

        {stats.topProducts.length === 0 ? (
          <div className="text-center py-6">
            <Pill className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Aucune réponse envoyée pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.topProducts.map((product, i) => (
              <ProductRankCard key={i} rank={i + 1} stat={product} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Sous-composants ─────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  hint,
  color,
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
      <div
        className={`w-8 h-8 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-2`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-2xl font-extrabold leading-tight mt-0.5">
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>
    </motion.div>
  );
}

function ProductRankCard({
  rank,
  stat,
}: {
  rank: number;
  stat: ProductStat;
}) {
  const rankStyles = [
    { bg: "bg-amber-100", text: "text-amber-700", emoji: "🥇" },
    { bg: "bg-slate-100", text: "text-slate-700", emoji: "🥈" },
    { bg: "bg-orange-100", text: "text-orange-700", emoji: "🥉" },
  ];
  const style = rankStyles[rank - 1] || rankStyles[2];

  return (
    <div className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-xl">
      <div
        className={`w-8 h-8 rounded-lg ${style.bg} ${style.text} flex items-center justify-center text-base shrink-0`}
      >
        {style.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{stat.productName}</p>
        <p className="text-[10px] text-muted-foreground">
          {stat.count} réponse{stat.count > 1 ? "s" : ""} ·{" "}
          {stat.availableCount} en stock
        </p>
      </div>
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 text-emerald-700 font-bold text-sm">
          <CheckCircle2 className="w-3 h-3" />
          {stat.count}
        </div>
        <p className="text-[9px] text-muted-foreground">demandes</p>
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
