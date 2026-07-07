"use client";
import { useSyncExternalStore, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { toast } from "sonner";

/**
 * Système d'évaluation des pharmacies (MVP localStorage).
 *
 * Stockage: clé `meditike_ratings`
 * Structure: { [responseId]: { pharmacyId, rating, createdAt } }
 *
 * On garde pharmacyId dans la valeur pour pouvoir :
 *  - retrouver la note d'une réponse précise (clé responseId)
 *  - calculer la note moyenne d'une pharmacie (filtre sur pharmacyId)
 *
 * Lecture via `useSyncExternalStore` pour rester compatible SSR
 * (localStorage n'existe pas côté serveur) sans setState-in-effect.
 */

const RATINGS_KEY = "meditike_ratings";

interface RatingEntry {
  pharmacyId: string;
  rating: number; // 1 à 5
  createdAt: string;
}
type RatingsMap = Record<string, RatingEntry>;

// Cache du snapshot : useSyncExternalStore exige une référence stable,
// sinon React boucle sur les re-renders. On garde le dernier JSON parsé.
let cachedRaw: string | null = null;
let cachedMap: RatingsMap = {};

/** Lit la map des évaluations depuis localStorage avec cache par référence. */
function readRatings(): RatingsMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    if (raw === cachedRaw) return cachedMap;
    cachedRaw = raw;
    cachedMap = raw ? (JSON.parse(raw) as RatingsMap) : {};
    return cachedMap;
  } catch {
    return {};
  }
}

/** Sauvegarde la map complète dans localStorage et invalide le cache. */
function saveRatings(map: RatingsMap): void {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = JSON.stringify(map);
    localStorage.setItem(RATINGS_KEY, raw);
    cachedRaw = raw;
    cachedMap = map;
  } catch {
    /* quota dépassé ou mode privé — on ignore silencieusement */
  }
}

/** Calcule la note moyenne d'une pharmacie à partir de toutes les évaluations. */
function computePharmacyAverage(
  pharmacyId: string,
  map: RatingsMap
): { avg: number; count: number } {
  const entries = Object.values(map).filter((e) => e.pharmacyId === pharmacyId);
  if (entries.length === 0) return { avg: 0, count: 0 };
  const sum = entries.reduce((acc, e) => acc + e.rating, 0);
  return { avg: Math.round((sum / entries.length) * 10) / 10, count: entries.length };
}

// Abonnement global : permet à useSyncExternalStore de notifier les composants
// quand la map change (suite à un vote ou à un événement "storage" cross-tab).
const subscribers = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  subscribers.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function onStorage(e: StorageEvent) {
  if (e.key !== RATINGS_KEY && e.key !== null) return;
  // Invalide le cache pour forcer la relecture au prochain getSnapshot
  cachedRaw = null;
  subscribers.forEach((cb) => cb());
}

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

const EMPTY_MAP: RatingsMap = {};

/**
 * Hook SSR-safe pour accéder à la map des évaluations.
 */
function useRatingsMap(): RatingsMap {
  return useSyncExternalStore(
    subscribe,
    readRatings,
    () => EMPTY_MAP
  );
}

// ─── PharmacyRating : saisie cliquable ─────────────────────

interface PharmacyRatingProps {
  pharmacyId: string;
  responseId: string;
  onRated?: (rating: number) => void;
}

/**
 * Composant de saisie d'évaluation.
 * Affiche 5 étoiles cliquables + la note moyenne de la pharmacie.
 * Une seule évaluation par réponse (on peut la modifier).
 */
export function PharmacyRating({ pharmacyId, responseId, onRated }: PharmacyRatingProps) {
  const [hovered, setHovered] = useState(0);
  const ratingsMap = useRatingsMap();

  const userRating = ratingsMap[responseId]?.rating ?? 0;
  const { avg, count } = computePharmacyAverage(pharmacyId, ratingsMap);

  const handleRate = useCallback((rating: number) => {
    const map = readRatings();
    map[responseId] = {
      pharmacyId,
      rating,
      createdAt: new Date().toISOString(),
    };
    saveRatings(map);
    notifySubscribers();
    toast.success("Merci pour votre évaluation !", {
      description: rating === 5
        ? "Top, un avis 5 étoiles a bien été enregistré."
        : `Votre note de ${rating}/5 a été enregistrée.`,
    });
    onRated?.(rating);
  }, [responseId, pharmacyId, onRated]);

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Évaluez cette pharmacie
          </p>
          {userRating > 0 && (
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
              Votre note : {userRating}/5
            </p>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = (hovered || userRating) >= star;
            return (
              <motion.button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                className="p-0.5 rounded-md hover:bg-muted transition-colors"
                aria-label={`Noter ${star} étoile${star > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/40"
                  }`}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Note moyenne de la pharmacie */}
      {count > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-bold text-foreground">{avg.toFixed(1)}</span>
          <span>·</span>
          <span>{count} avi{count > 1 ? "s" : ""}</span>
          <span className="text-muted-foreground/60">· moyenne pharmacie</span>
        </div>
      )}
    </div>
  );
}

// ─── PharmacyRatingDisplay : lecture seule ─────────────────

interface PharmacyRatingDisplayProps {
  pharmacyId: string;
  /** Format compact pour badges (ex: "4.5 (12)"). */
  compact?: boolean;
}

/**
 * Affiche la note moyenne d'une pharmacie en lecture seule.
 * Format par défaut : "⭐ 4.5 (12 avis)"
 * Format compact : "⭐ 4.5 (12)"
 */
export function PharmacyRatingDisplay({ pharmacyId, compact = false }: PharmacyRatingDisplayProps) {
  const ratingsMap = useRatingsMap();
  const { avg, count } = computePharmacyAverage(pharmacyId, ratingsMap);

  // Pendant le rendu serveur (ratingsMap vide) on affiche un placeholder discret
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
        <Star className="w-3 h-3" />
        <span>Pas encore d'avis</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
      <span className="font-bold text-foreground">{avg.toFixed(1)}</span>
      <span>
        {compact
          ? `(${count})`
          : `(${count} avi${count > 1 ? "s" : ""})`}
      </span>
    </span>
  );
}
