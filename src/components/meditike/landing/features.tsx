"use client";
import { motion } from "framer-motion";
import { Search, MapPin, Bell, ShieldCheck, Clock, Pill, Smartphone, Heart } from "lucide-react";
import { KenteDivider } from "@/components/brand/african-pattern";
import { Adinkra } from "@/components/brand/adinkra";

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Recherche intelligente",
      desc: "Tapez le nom d'un médicament et MediTike trouve en temps réel les pharmacies qui l'ont en stock, avec le prix.",
      color: "from-emerald-500 to-emerald-700",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: Clock,
      title: "Pharmacies de garde",
      desc: "Plus besoin d'appeler 5 pharmacies pour trouver celle qui est de garde ce soir. La liste est mise à jour quotidiennement.",
      color: "from-amber-400 to-amber-600",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: MapPin,
      title: "Géolocalisation",
      desc: "Visualisez les officines les plus proches de vous, avec leurs horaires et leurs coordonnées directes.",
      color: "from-orange-500 to-red-600",
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: Bell,
      title: "Demandes en direct",
      desc: "Si votre médicament est rare, lancez une demande : les pharmaciens partenaires vous répondent en quelques minutes.",
      color: "from-teal-500 to-emerald-700",
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      icon: Smartphone,
      title: "WhatsApp intégré",
      desc: "Contactez directement la pharmacie via WhatsApp, avec un message pré-rempli. Sans friction, sans perte de temps.",
      color: "from-emerald-500 to-green-600",
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: ShieldCheck,
      title: "Données vérifiées",
      desc: "Les stocks et les prix sont vérifiés et mis à jour par les pharmaciens partenaires. Vous pouvez y aller les yeux fermés.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <section id="features" className="relative py-20 sm:py-28">
      {/* Decorative Adinkra */}
      <Adinkra
        name="duafe"
        size={140}
        className="absolute top-12 right-8 text-amber-600/[0.05] hidden lg:block"
        strokeWidth={1}
      />

      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4"
          >
            Pourquoi MediTike ?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
          >
            Tout ce qu'il faut pour ne plus jamais{" "}
            <span className="text-gradient-brand">chercher un médicament</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg"
          >
            MediTike connecte les patients togolais aux pharmacies en temps réel. Une plateforme conçue pour le terrain africain — pensée pour fonctionner même avec une connexion modeste.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group relative bg-white rounded-2xl p-6 border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>

              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <KenteDivider />
        </div>
      </div>
    </section>
  );
}
