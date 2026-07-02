"use client";
import { motion } from "framer-motion";
import { Search, MapPin, Pill, Clock, Sparkles, ChevronRight, ShieldCheck, Zap } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { GradientBlob, KenteDivider } from "@/components/brand/african-pattern";
import { Adinkra } from "@/components/brand/adinkra";

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  stats: { pharmacies: number; medications: number; cities: number } | null;
}

export function Hero({ onPrimaryClick, onSecondaryClick, stats }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 sm:pt-24 sm:pb-28">
      {/* Background: warm gradient + blobs + dotted pattern */}
      <div className="absolute inset-0 -z-10 warm-gradient" />
      <GradientBlob color="emerald" className="-top-20 -left-20 w-[28rem] h-[28rem]" />
      <GradientBlob color="gold" className="top-20 -right-32 w-[32rem] h-[32rem]" />
      <GradientBlob color="terra" className="-bottom-32 left-1/3 w-[24rem] h-[24rem] opacity-60" />
      <div className="absolute inset-0 -z-10 dotted-bg opacity-60" />

      {/* Decorative Adinkra symbols */}
      <Adinkra
        name="gye-nyame"
        size={180}
        className="absolute top-24 left-4 text-amber-600/[0.07] hidden lg:block"
        strokeWidth={1}
      />
      <Adinkra
        name="sankofa"
        size={120}
        className="absolute bottom-32 right-8 text-emerald-700/[0.07] hidden lg:block"
        strokeWidth={1}
      />

      {/* Top Kente strip — more visible */}
      <div className="absolute top-16 left-0 right-0 h-1 kente-divider opacity-80" />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur border border-amber-300/40 rounded-full mb-5 shadow-sm"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-glow" />
              <span className="text-xs font-bold text-amber-800 tracking-wide">
                N°1 au Togo · Pharmacies de garde en temps réel
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.04] tracking-tight"
            >
              Vos médicaments,{" "}
              <span className="text-gradient-brand">à portée de main</span>,<br />
              partout au <span className="text-gradient-gold">Togo</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              MediTike vous permet de trouver instantanément la pharmacie de garde la plus proche et de localiser vos médicaments en temps réel auprès de <span className="font-semibold text-foreground">{stats?.pharmacies || 15}+ officines partenaires</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <button
                onClick={onPrimaryClick}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 brand-gradient text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Search className="w-4 h-4" />
                Rechercher un médicament
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onSecondaryClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-foreground font-bold text-sm rounded-2xl border-2 border-border hover:border-emerald-500/40 hover:bg-emerald-50/50 transition-all"
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                Pharmacies de garde
              </button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start text-xs text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Données vérifiées
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Mise à jour temps réel
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                7+ villes couvertes
              </span>
            </motion.div>
          </div>

          {/* Right: Visual hero card with floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, type: "spring" }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* Main search card mockup */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-border/60 overflow-hidden">
              {/* Top brand strip */}
              <div className="brand-gradient p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <LogoMark size={32} />
                  <span className="font-display font-extrabold">MediTike</span>
                </div>
                <div className="flex items-center gap-1 text-white/90 text-xs font-bold bg-white/15 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-amber-300 rounded-full pulse-glow" />
                  EN DIRECT
                </div>
              </div>
              <KenteDivider />

              <div className="p-5">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-muted rounded-xl mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">
                    amoxicilline 500mg
                  </span>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  3 officines ont ce médicament
                </p>

                <div className="space-y-2">
                  {[
                    { name: "Pharmacie de Tokoin", district: "Tokoin", price: "2 500 F", duty: true },
                    { name: "Pharmacie Centrale", district: "Centre-ville", price: "2 300 F", duty: false },
                    { name: "Pharmacie Forever", district: "Lomé Centre", price: "2 700 F", duty: false },
                  ].map((p, i) => (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl hover:border-emerald-400/50 hover:shadow-sm transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold truncate">{p.name}</p>
                          {p.duty && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
                              DE GARDE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{p.district}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-emerald-700">{p.price}</p>
                        <p className="text-[9px] text-emerald-600 font-semibold">EN STOCK</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-2 sm:-right-4 bg-white rounded-2xl shadow-xl border border-border px-3 py-2 float-anim z-10"
              style={{ animationDelay: "0s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Garde ce soir</p>
                  <p className="text-sm font-extrabold leading-none">5 pharmacies</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-2 sm:-left-4 bg-white rounded-2xl shadow-xl border border-border px-3 py-2 float-anim z-10"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Pill className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Médicaments</p>
                  <p className="text-sm font-extrabold leading-none">
                    {stats?.medications || 40}+ référencés
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar — emphasize the key numbers */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            <StatCard value={stats.pharmacies} suffix="+" label="Officines partenaires" accent="emerald" featured />
            <StatCard value={stats.medications} suffix="+" label="Médicaments suivis" accent="gold" />
            <StatCard value={stats.cities} suffix="+" label="Villes couvertes" accent="terra" />
            <StatCard value={1842} suffix="+" label="Recherches servies" accent="emerald" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  value,
  suffix = "",
  label,
  accent,
  featured = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  accent: "emerald" | "gold" | "terra";
  featured?: boolean;
}) {
  const colors: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-700",
    gold: "from-amber-400 to-amber-600",
    terra: "from-orange-500 to-red-600",
  };
  return (
    <div
      className={`relative bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all overflow-hidden ${
        featured ? "border-emerald-200 shadow-md ring-1 ring-emerald-100" : "border-border/60"
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors[accent]}`} />
      <p className={`font-display font-extrabold tracking-tight ${featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}>
        <span className={`bg-gradient-to-br ${colors[accent]} bg-clip-text text-transparent`}>
          {value.toLocaleString("fr-FR")}{suffix}
        </span>
      </p>
      <p className="text-xs text-muted-foreground font-semibold mt-1">{label}</p>
    </div>
  );
}
