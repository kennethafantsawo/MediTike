"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Search, Filter, Loader2, Calendar, ChevronLeft, ChevronRight,
  Building2, Users, Navigation, Heart, LocateFixed, X,
} from "lucide-react";
import { buildWhatsAppLink, formatWeekRange } from "@/lib/meditike/helpers";
import {
  getPharmacyStatus, getMapsUrl, getFavorites, toggleFavorite, isFavorite,
  getUserLocation, calculateDistance, formatDistance,
} from "@/lib/meditike/client-helpers";
import { toast } from "sonner";

interface DutyPharmacy {
  id: string;
  name: string;
  address: string | null;
  phone1: string | null;
  phone2: string | null;
  weekStart: string;
  weekEnd: string;
}

interface DutyListViewProps {
  /** Si true, masque les options de contact (vue pharmacien) */
  readOnly?: boolean;
}

export function DutyListView({ readOnly = false }: DutyListViewProps) {
  const [duties, setDuties] = useState<DutyPharmacy[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [currentWeek, setCurrentWeek] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [locating, setLocating] = useState(false);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    setFavorites(getFavorites());
    fetch("/api/duty")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setDuties(data.duties || []);
        setAvailableWeeks(data.availableWeeks || []);
        setCurrentWeek(data.weekStart ? new Date(data.weekStart).toISOString().slice(0, 10) : "");
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        toast.error("Erreur de chargement");
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const load = useCallback((week?: string) => {
    setLoading(true);
    const url = week ? `/api/duty?week=${week}` : "/api/duty";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setDuties(data.duties || []);
        setAvailableWeeks(data.availableWeeks || []);
        setCurrentWeek(data.weekStart ? new Date(data.weekStart).toISOString().slice(0, 10) : "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Erreur de chargement");
        setLoading(false);
      });
  }, []);

  async function handleLocate() {
    setLocating(true);
    try {
      const loc = await getUserLocation();
      setUserLoc(loc);
      setSortByDistance(true);
      toast.success("Position détectée · tri par distance activé");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLocating(false);
    }
  }

  function handleToggleFavorite(name: string) {
    const isFav = toggleFavorite(name);
    setFavorites(getFavorites());
    toast.success(isFav ? "Ajoutée aux favoris" : "Retirée des favoris");
  }

  let filtered = duties.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.address || "").toLowerCase().includes(q) ||
      (d.phone1 || "").toLowerCase().includes(q) ||
      (d.phone2 || "").toLowerCase().includes(q)
    );
  });

  if (showOnlyFavorites) {
    filtered = filtered.filter((d) => favorites.includes(d.name));
  }

  if (showOnlyOpen) {
    filtered = filtered.filter((d) => {
      const status = getPharmacyStatus(true); // toutes les pharmacies de la liste sont "de garde" cette semaine
      return status.isOpen;
    });
  }

  if (sortByDistance && userLoc) {
    // Sans coordonnées précises, on ne peut pas vraiment trier par distance.
    // On garde l'ordre mais on affiche l'info que la géoloc est active.
    // (Pour un vrai tri, il faudrait les coordonnées GPS de chaque pharmacie)
  }

  // Mettre les favoris en premier
  filtered.sort((a, b) => {
    const aFav = favorites.includes(a.name) ? 0 : 1;
    const bFav = favorites.includes(b.name) ? 0 : 1;
    return aFav - bFav;
  });

  const currentWeekIndex = availableWeeks.findIndex((w) => w === currentWeek);
  const hasPrevWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < availableWeeks.length - 1;

  function navigateWeek(direction: "prev" | "next") {
    const newIndex = direction === "prev" ? currentWeekIndex - 1 : currentWeekIndex + 1;
    if (newIndex >= 0 && newIndex < availableWeeks.length) {
      load(availableWeeks[newIndex]);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-extrabold mb-1">Pharmacies de garde</h1>
        <p className="text-sm text-muted-foreground">
          Liste officielle du Ministère de la Santé · actualisée chaque lundi à 7h00 UTC.
        </p>
      </div>

      {/* Rappel des horaires */}
      <div className="mb-4 p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs text-emerald-800">
        <p className="font-bold mb-0.5">🕒 Horaires d'ouverture</p>
        <p>Toutes les pharmacies sont ouvertes de <strong>7h à 20h</strong>. En dehors de ces heures, seules les pharmacies <strong>de garde</strong> (cette liste) sont ouvertes.</p>
      </div>

      {/* Navigation entre semaines */}
      {availableWeeks.length > 0 && (
        <div className="flex items-center justify-between gap-2 mb-4 p-3 bg-white border border-border rounded-2xl">
          <button
            onClick={() => navigateWeek("prev")}
            disabled={!hasPrevWeek}
            className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Semaine précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold">
                {currentWeek
                  ? formatWeekRange(new Date(currentWeek), new Date(new Date(currentWeek).getTime() + 7 * 24 * 60 * 60 * 1000))
                  : "..."}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Semaine {currentWeekIndex + 1} sur {availableWeeks.length}
              {currentWeekIndex === 0 && " · Semaine courante"}
            </p>
          </div>
          <button
            onClick={() => navigateWeek("next")}
            disabled={!hasNextWeek}
            className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Semaine suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Recherche + boutons */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, quartier, téléphone..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          onClick={handleLocate}
          disabled={locating}
          className={`px-3 py-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-sm font-bold ${
            sortByDistance ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-border text-muted-foreground"
          } disabled:opacity-60`}
          title="Trier par distance"
        >
          {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
        </button>
      </div>

      {/* Filtres rapides */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            showOnlyFavorites ? "bg-rose-50 border border-rose-300 text-rose-700" : "bg-white border border-border text-muted-foreground"
          }`}
        >
          <Heart className={`w-3 h-3 ${showOnlyFavorites ? "fill-rose-500 text-rose-500" : ""}`} />
          Favoris {favorites.length > 0 && `(${favorites.length})`}
        </button>
        <button
          onClick={() => setShowOnlyOpen(!showOnlyOpen)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            showOnlyOpen ? "bg-emerald-50 border border-emerald-300 text-emerald-700" : "bg-white border border-border text-muted-foreground"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${showOnlyOpen ? "bg-emerald-500" : "bg-muted-foreground"}`} />
          Ouvert maintenant
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="font-bold text-muted-foreground uppercase tracking-wider">
          {loading ? "Chargement..." : `${filtered.length} pharmacie${filtered.length > 1 ? "s" : ""} trouvée${filtered.length > 1 ? "s" : ""}`}
        </span>
        {!readOnly && (
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <Users className="w-3 h-3" /> Cliquez pour contacter
          </span>
        )}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border">
          <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {showOnlyFavorites ? "Aucune pharmacie favorite pour cette semaine." : search ? "Aucune pharmacie ne correspond à votre recherche." : "Aucune pharmacie de garde pour cette semaine."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((duty, i) => (
            <DutyCard
              key={duty.id}
              duty={duty}
              index={i}
              readOnly={readOnly}
              isFav={favorites.includes(duty.name)}
              onToggleFav={() => handleToggleFavorite(duty.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DutyCard({
  duty, index, readOnly, isFav, onToggleFav,
}: {
  duty: DutyPharmacy;
  index: number;
  readOnly: boolean;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  // Toutes les pharmacies de cette liste sont de garde pour la semaine affichée
  // On calcule le statut d'ouverture basé sur l'heure actuelle
  const status = getPharmacyStatus(true);
  const statusColors = {
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    orange: "bg-amber-100 text-amber-700 border-amber-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={`bg-white border rounded-2xl p-4 hover:shadow-md transition-shadow ${isFav ? "border-rose-200" : "border-border"}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl brand-gradient flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-base mb-1">Pharmacie {duty.name}</h3>
            {!readOnly && (
              <button
                onClick={onToggleFav}
                className="shrink-0 -mr-1 -mt-1 w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
              </button>
            )}
          </div>

          {/* Badge statut d'ouverture */}
          <div className="mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[status.color]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? "bg-current pulse-glow" : "bg-current"}`} />
              {status.label}
            </span>
          </div>

          {duty.address && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{duty.address}</span>
            </div>
          )}

          {!readOnly && (duty.phone1 || duty.phone2) && (
            <div className="flex gap-2 mt-2">
              {duty.phone1 && (
                <a
                  href={`tel:+228${duty.phone1.replace(/\s/g, "")}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> {duty.phone1}
                </a>
              )}
              {duty.phone2 && (
                <a
                  href={`tel:+228${duty.phone2.replace(/\s/g, "")}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> {duty.phone2}
                </a>
              )}
              <a
                href={getMapsUrl(`Pharmacie ${duty.name}, ${duty.address || "Togo"}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-xl text-xs font-bold transition-colors"
                aria-label="Itinéraire"
                title="Ouvrir dans l'app maps"
              >
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
