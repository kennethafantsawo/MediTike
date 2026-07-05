"use client";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone, MessageCircle, Navigation, Pill } from "lucide-react";
import { useState, useEffect } from "react";
import { formatTogoPhone, buildWhatsAppLink } from "@/lib/meditike/helpers";
import { Skeleton } from "@/components/ui/skeleton";

interface DutyPharmacy {
  id: string;
  startTime: string;
  endTime: string;
  isDay: boolean;
  pharmacy: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    district?: string;
    openingHours?: string;
    isOpen24h: boolean;
  };
}

export function DutyPreview() {
  const [duties, setDuties] = useState<DutyPharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/duty")
      .then((r) => r.json())
      .then((data) => {
        setDuties(data.duties || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="garde" className="relative py-20 sm:py-28 bg-gradient-to-b from-emerald-50/40 via-background to-amber-50/30">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3"
            >
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full pulse-glow" />
              En direct aujourd'hui
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight"
            >
              Pharmacies de garde à <span className="text-gradient-brand">Lomé</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-muted-foreground"
            >
              Mise à jour chaque matin à 8h. Les officines 24h/24 sont toujours incluses.
            </motion.p>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : duties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border">
            <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune pharmacie de garde trouvée.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {duties.slice(0, 6).map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                {/* Header strip */}
                <div className={`px-5 py-3 flex items-center justify-between ${d.isDay ? "bg-gradient-to-r from-amber-50 to-orange-50" : "bg-gradient-to-r from-emerald-50 to-teal-50"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${d.isDay ? "bg-amber-100" : "bg-emerald-100"}`}>
                      <Clock className={`w-3.5 h-3.5 ${d.isDay ? "text-amber-700" : "text-emerald-700"}`} />
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase ${d.isDay ? "text-amber-700" : "text-emerald-700"}`}>
                        {d.isDay ? "Garde de jour" : "Garde de nuit"}
                      </p>
                      <p className="text-xs font-bold text-foreground">
                        {d.startTime} – {d.endTime}
                      </p>
                    </div>
                  </div>
                  {d.pharmacy.isOpen24h && (
                    <span className="text-[10px] bg-foreground text-background font-bold px-2 py-1 rounded-full">
                      24/24
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-display font-bold text-base mb-2 line-clamp-1">
                    {d.pharmacy.name}
                  </h3>
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {d.pharmacy.district ? `${d.pharmacy.district}, ` : ""}
                      {d.pharmacy.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${d.pharmacy.phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Appeler
                    </a>
                    <a
                      href={buildWhatsAppLink(d.pharmacy.whatsapp || d.pharmacy.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-xl text-sm font-bold hover:border-emerald-500/40 hover:bg-emerald-50/50 transition-all"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
            Voir toutes les pharmacies sur la carte
          </a>
        </div>
      </div>
    </section>
  );
}
