"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock, MapPin, Phone, MessageCircle, Navigation, Building2,
  Loader2, Filter, Search,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/meditike/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface DutyPharmacy {
  id: string;
  startTime: string;
  endTime: string;
  isDay: boolean;
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
}

interface PharmacyListItem {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  district?: string;
  openingHours?: string;
  isOpen24h: boolean;
  inStockCount: number;
  onDuty: boolean;
  dutyShift?: { isDay: boolean; startTime: string; endTime: string };
}

export function DutyView() {
  const [view, setView] = useState<"duty" | "all">("duty");
  const [duties, setDuties] = useState<DutyPharmacy[]>([]);
  const [allPharmacies, setAllPharmacies] = useState<PharmacyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/duty").then((r) => r.json()),
      fetch("/api/pharmacies?limit=100").then((r) => r.json()),
    ])
      .then(([dutyData, pharmaData]) => {
        setDuties(dutyData.duties || []);
        setAllPharmacies(pharmaData.pharmacies || []);
        setLoading(false);
      })
      .catch((e) => {
        toast.error("Erreur de chargement");
        setLoading(false);
      });
  }, []);

  const cities = Array.from(new Set(allPharmacies.map((p) => p.city)));

  const filteredAll = allPharmacies.filter((p) => {
    if (cityFilter !== "all" && p.city !== cityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.district || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredDuty = duties.filter((d) => {
    if (cityFilter !== "all" && d.pharmacy.city !== cityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.pharmacy.name.toLowerCase().includes(q) ||
        d.pharmacy.address.toLowerCase().includes(q) ||
        (d.pharmacy.district || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32 lg:pb-12">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-extrabold mb-1">Pharmacies</h1>
        <p className="text-sm text-muted-foreground">
          Trouvez la pharmacie de garde aujourd'hui, ou explorez toutes les officines.
        </p>
      </div>

      {/* View switcher */}
      <div className="grid grid-cols-2 p-1 bg-muted rounded-2xl mb-4">
        <button
          onClick={() => setView("duty")}
          className={`py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            view === "duty" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"
          }`}
        >
          <Clock className="w-4 h-4" />
          De garde ({duties.length})
        </button>
        <button
          onClick={() => setView("all")}
          className={`py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            view === "all" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Toutes ({allPharmacies.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, quartier…"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
        >
          <option value="all">Toutes villes</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Duty list */}
      {!loading && view === "duty" && (
        <div className="space-y-3">
          {filteredDuty.length === 0 ? (
            <EmptyState text="Aucune pharmacie de garde trouvée." />
          ) : (
            filteredDuty.map((d, i) => (
              <DutyCard key={d.id} duty={d} index={i} />
            ))
          )}
        </div>
      )}

      {/* All pharmacies list */}
      {!loading && view === "all" && (
        <div className="space-y-3">
          {filteredAll.length === 0 ? (
            <EmptyState text="Aucune pharmacie ne correspond à votre recherche." />
          ) : (
            filteredAll.map((p, i) => (
              <PharmacyCard key={p.id} pharmacy={p} index={i} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function DutyCard({ duty, index }: { duty: DutyPharmacy; index: number }) {
  const p = duty.pharmacy;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className={`px-5 py-3 flex items-center justify-between ${duty.isDay ? "bg-gradient-to-r from-amber-50 to-orange-50" : "bg-gradient-to-r from-emerald-50 to-teal-50"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${duty.isDay ? "bg-amber-100" : "bg-emerald-100"}`}>
            <Clock className={`w-3.5 h-3.5 ${duty.isDay ? "text-amber-700" : "text-emerald-700"}`} />
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase ${duty.isDay ? "text-amber-700" : "text-emerald-700"}`}>
              {duty.isDay ? "Garde de jour" : "Garde de nuit"}
            </p>
            <p className="text-xs font-bold">{duty.startTime} – {duty.endTime}</p>
          </div>
        </div>
        {p.isOpen24h && (
          <span className="text-[10px] bg-foreground text-background font-bold px-2 py-1 rounded-full">24/24</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-base mb-1">{p.name}</h3>
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            {p.district ? `${p.district}, ` : ""}
            {p.address}
          </span>
        </div>

        <div className="flex gap-2">
          <a href={`tel:${p.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors">
            <Phone className="w-3.5 h-3.5" /> Appeler
          </a>
          <a
            href={buildWhatsAppLink(p.whatsapp || p.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.city}, Togo`)}`}
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

function PharmacyCard({ pharmacy, index }: { pharmacy: PharmacyListItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-border p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl brand-gradient flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-base">{pharmacy.name}</h3>
            {pharmacy.onDuty && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-glow" />
                DE GARDE
              </span>
            )}
            {pharmacy.isOpen24h && (
              <span className="text-[10px] bg-foreground text-background font-bold px-2 py-0.5 rounded-full">24/24</span>
            )}
          </div>
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {pharmacy.district ? `${pharmacy.district}, ` : ""}
              {pharmacy.address}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {pharmacy.openingHours}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Filter className="w-3 h-3" />
              {pharmacy.inStockCount} médicaments
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <a href={`tel:${pharmacy.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors">
          <Phone className="w-3.5 h-3.5" /> Appeler
        </a>
        <a
          href={buildWhatsAppLink(pharmacy.whatsapp || pharmacy.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-border">
      <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
