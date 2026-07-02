"use client";
import { motion } from "framer-motion";
import { Search, Bell, MessageCircle, ArrowRight } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Search,
    title: "Recherchez votre médicament",
    desc: "Saisissez le nom, le principe actif ou la marque. MediTike scanne en direct les stocks de toutes les officines partenaires et vous montre où il est disponible, avec son prix exact en FCFA.",
  },
  {
    n: "02",
    icon: Bell,
    title: "Lancez une demande si besoin",
    desc: "Médicament introuvable ? Une seule demande suffit. Tous les pharmaciens partenaires reçoivent une notification et peuvent vous répondre en quelques minutes avec une alternative.",
  },
  {
    n: "03",
    icon: MessageCircle,
    title: "Contactez la pharmacie",
    desc: "Cliquez sur WhatsApp ou Appeler pour joindre directement l'officine qui a votre traitement. Vous repartez avec vos médicaments, sans perte de temps ni détours inutiles.",
  },
];

export function HowItWorks() {
  return (
    <section id="comment" className="relative py-20 sm:py-28 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
      {/* Kente strip top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 kente-divider" />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-amber-200 uppercase tracking-wider mb-4"
          >
            3 étapes · 30 secondes
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            Comment ça marche ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-white/70 max-w-2xl mx-auto"
          >
            Une plateforme pensée pour la réalité du terrain : simple, rapide, et qui marche même avec une connexion modeste.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative"
            >
              <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 h-full hover:bg-white/10 transition-colors">
                {/* Step number */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-900 flex items-center justify-center font-display font-extrabold text-xl shadow-lg">
                    {s.n}
                  </div>
                  <s.icon className="w-7 h-7 text-amber-300/80" strokeWidth={1.5} />
                </div>

                <h3 className="font-display font-bold text-xl mb-3 leading-snug">
                  {s.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {s.desc}
                </p>

                {/* Arrow connector for desktop */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 transform -translate-y-1/2 text-amber-300/60">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Kente strip bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 kente-divider" />
    </section>
  );
}
