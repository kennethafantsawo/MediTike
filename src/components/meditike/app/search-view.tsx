"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Phone, MessageCircle, Clock, Pill, Loader2,
  ChevronRight, X, Building2, Navigation, Sparkles, Send, CheckCircle2,
  Circle, FileText,
} from "lucide-react";
import { formatPrice, buildWhatsAppLink, relativeTimeFr } from "@/lib/meditike/helpers";
import { toast } from "sonner";

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category?: string;
  form?: string;
  dosage?: string;
}

interface PharmacyMatch {
  pharmacy: {
    id: string;
    name: string;
    phone: string;
    whatsapp?: string;
    address: string;
    city: string;
    district?: string;
    openingHours?: string;
    isOpen24h: boolean;
  };
  matches: Array<{
    medication: Medication;
    price: number | null;
    lastVerified: string;
  }>;
  onDuty: boolean;
}

interface SearchViewProps {
  user: any;
}

export function SearchView({ user }: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Medication[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PharmacyMatch[] | null>(null);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [totalMatches, setTotalMatches] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [creatingRequest, setCreatingRequest] = useState(false);

  // Fetch medication suggestions as user types
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/medications?q=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        setSuggestions(data.medications || []);
        setShowSuggestions(true);
      } catch (e) {
        // silent
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setShowSuggestions(false);
    setResults(null);
    setMessage(null);
    try {
      const res = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.pharmacies);
      setTotalMatches(data.totalMatches || 0);
      setSearchedQuery(q);
      if (data.pharmacies.length === 0) {
        setMessage(data.message || "Aucune pharmacie n'a ce médicament en stock actuellement.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRequest = async () => {
    if (!query.trim()) return;
    setCreatingRequest(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Demande envoyée aux pharmaciens partenaires !", {
        description: "Vous recevrez une réponse dans quelques minutes.",
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreatingRequest(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32 lg:pb-12">
      {/* Search header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold mb-1">Rechercher un médicament</h1>
        <p className="text-sm text-muted-foreground">
          Tapez le nom et MediTike trouve les pharmacies qui l'ont en stock.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                runSearch(query);
              }
            }}
            placeholder="Ex : amoxicilline, paracétamol, doliprane…"
            className="w-full pl-12 pr-4 py-4 text-base bg-white border-2 border-border rounded-2xl font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults(null); setSuggestions([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-10"
            >
              <ul className="max-h-72 overflow-y-auto">
                {suggestions.map((m) => (
                  <li key={m.id}>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); setQuery(m.name); runSearch(m.name); }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted text-left transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{m.name}</p>
                        {(m.genericName || m.category) && (
                          <p className="text-xs text-muted-foreground truncate">
                            {m.genericName ? m.genericName : m.category}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search button */}
      <button
        onClick={() => runSearch(query)}
        disabled={loading || !query.trim()}
        className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 brand-gradient text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
        Rechercher
      </button>

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results && results.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {totalMatches} pharmacie{totalMatches > 1 ? "s" : ""} trouvée{totalMatches > 1 ? "s" : ""}
            </p>
            <button
              onClick={createRequest}
              disabled={creatingRequest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-xl transition-colors"
            >
              {creatingRequest ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Demander à toutes
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {results.map((r, i) => (
                <PharmacyResultCard key={r.pharmacy.id} result={r} query={searchedQuery} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* No results + create request CTA */}
      {!loading && results && results.length === 0 && message && (
        <div className="mt-8 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Pill className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="font-display font-bold text-lg mb-2">Médicament introuvable en stock</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            {message} Vous pouvez lancer une demande : tous les pharmaciens partenaires seront notifiés et pourront vous proposer une alternative.
          </p>
          <button
            onClick={createRequest}
            disabled={creatingRequest}
            className="inline-flex items-center gap-2 px-5 py-3 brand-gradient text-white font-bold text-sm rounded-2xl shadow hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {creatingRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Lancer ma demande
          </button>
        </div>
      )}

      {/* Empty state — initial */}
      {!loading && !results && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-2xl mb-4">
            <Sparkles className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="font-display font-bold text-lg mb-1">Commencez votre recherche</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Plus de 40 médicaments suivis en temps réel dans 15+ pharmacies au Togo.
          </p>

          {/* Popular searches */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Recherches populaires
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Paracétamol 500mg", "Amoxicilline 500mg", "Artésunate", "Ibuprofène 400mg", "Cétirizine", "Metformine"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); runSearch(q); }}
                  className="px-3 py-1.5 bg-white border border-border rounded-full text-xs font-semibold hover:border-emerald-400/50 hover:bg-emerald-50/50 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PharmacyResultCard({ result, query, index }: { result: PharmacyMatch; query: string; index: number }) {
  const { pharmacy, matches, onDuty } = result;
  const [expanded, setExpanded] = useState(false);

  // Show the cheapest match in the summary
  const cheapest = matches.reduce(
    (min, m) => (!min || (m.price !== null && m.price < (min.price ?? Infinity))) ? m : min,
    matches[0]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-base">{pharmacy.name}</h3>
              {onDuty && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-glow" />
                  DE GARDE
                </span>
              )}
              {pharmacy.isOpen24h && (
                <span className="text-[10px] bg-foreground text-background font-bold px-2 py-0.5 rounded-full">
                  24/24
                </span>
              )}
            </div>

            <div className="flex items-start gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                {pharmacy.district ? `${pharmacy.district}, ` : ""}
                {pharmacy.address}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                En stock
              </span>
              {cheapest?.price && (
                <span className="font-bold text-foreground">
                  dès {formatPrice(cheapest.price)}
                </span>
              )}
              <span className="text-muted-foreground">
                {matches.length} produit{matches.length > 1 ? "s" : ""} correspondu{matches.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Match details (expandable) */}
        {matches.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full text-left text-xs text-emerald-700 font-bold inline-flex items-center gap-1"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
            {expanded ? "Masquer les détails" : `Voir les ${matches.length} correspondances`}
          </button>
        )}

        <AnimatePresence>
          {(expanded || matches.length === 1) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {matches.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-2.5 bg-muted/60 rounded-xl"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Pill className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{m.medication.name}</p>
                        {m.medication.form && m.medication.dosage && (
                          <p className="text-[10px] text-muted-foreground">
                            {m.medication.form} · {m.medication.dosage}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 shrink-0">
                      {m.price ? formatPrice(m.price) : "Prix en pharmacie"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <a
            href={`tel:${pharmacy.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Appeler
          </a>
          <a
            href={buildWhatsAppLink(pharmacy.whatsapp || pharmacy.phone, query)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pharmacy.name}, ${pharmacy.city}, Togo`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 bg-muted hover:bg-muted/70 text-foreground rounded-xl text-xs font-bold transition-colors"
            aria-label="Itinéraire"
          >
            <Navigation className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
