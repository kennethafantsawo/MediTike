"use client";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

const CITIES = [
  { name: "Lomé", region: "Maritime", x: 50, y: 92, primary: true, pharmacies: 10 },
  { name: "Tsévié", region: "Maritime", x: 48, y: 85, pharmacies: 2 },
  { name: "Kpalimé", region: "Plateaux", x: 32, y: 78, pharmacies: 1 },
  { name: "Atakpamé", region: "Plateaux", x: 50, y: 65, pharmacies: 1 },
  { name: "Sokodé", region: "Centrale", x: 55, y: 42, pharmacies: 1 },
  { name: "Kara", region: "Kara", x: 58, y: 28, pharmacies: 1 },
  { name: "Dapaong", region: "Savanes", x: 50, y: 8, pharmacies: 1 },
];

export function CitiesSection() {
  return (
    <section className="relative py-20 sm:py-24 bg-gradient-to-b from-amber-50/40 via-background to-emerald-50/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 bg-amber-100 border border-amber-200 rounded-full text-xs font-bold text-amber-700 uppercase tracking-wider mb-4"
            >
              Présent dans tout le Togo
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight"
            >
              De <span className="text-gradient-brand">Lomé</span> à{" "}
              <span className="text-gradient-gold">Dapaong</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed"
            >
              MediTike couvre les 5 régions du Togo avec des officines partenaires dans toutes les grandes villes. Bientôt dans chaque chef-lieu du pays.
            </motion.p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CITIES.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2 p-2.5 bg-white border border-border rounded-xl"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.primary ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-600"}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {c.pharmacies} pharmacie{c.pharmacies > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>
                Votre ville n'est pas listée ?{" "}
                <a href="#" className="font-bold text-emerald-700 hover:underline">
                  Inscrivez votre pharmacie
                </a>
              </span>
            </div>
          </div>

          {/* Right: stylized Togo map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl border border-border shadow-xl p-6 overflow-hidden">
              {/* Top Kente strip */}
              <div className="absolute top-0 left-0 right-0 h-1 kente-divider" />

              {/* Decorative dotted bg */}
              <div className="absolute inset-0 dotted-bg opacity-40 pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-sm">Carte du Togo</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    7 villes actives
                  </span>
                </div>

                {/* Stylized Togo silhouette (simplified) */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-auto"
                  style={{ maxHeight: 380 }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="togo-fill" x1="0" y1="0" x2="100" y2="100">
                      <stop offset="0" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="1" stopColor="#047857" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>

                  {/* Togo country shape (simplified, slightly abstracted) */}
                  <path
                    d="M 45 4 L 58 4 L 60 12 L 58 22 L 60 32 L 56 42 L 58 55 L 54 65 L 52 76 L 47 84 L 43 92 L 38 96 L 38 88 L 40 76 L 42 64 L 40 52 L 43 40 L 41 28 L 43 16 Z"
                    fill="url(#togo-fill)"
                    stroke="#047857"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />

                  {/* City pins */}
                  {CITIES.map((c, i) => (
                    <motion.g
                      key={c.name}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                    >
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={c.primary ? 2.4 : 1.6}
                        fill={c.primary ? "#047857" : "#f59e0b"}
                        stroke="white"
                        strokeWidth="0.6"
                      />
                      {c.primary && (
                        <circle cx={c.x} cy={c.y} r="4" fill="#047857" opacity="0.2">
                          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <text
                        x={c.x + 3}
                        y={c.y + 1}
                        fontSize="2.4"
                        fontWeight="700"
                        fill="#1f2937"
                        className="font-sans"
                      >
                        {c.name}
                      </text>
                    </motion.g>
                  ))}
                </svg>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-700" />
                    <span className="font-semibold">Ville principale</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold">Ville couverte</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
