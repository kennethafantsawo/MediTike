"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Building2, Pill, Heart } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";

export function CTASection({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[2rem] p-8 sm:p-14 overflow-hidden shadow-2xl"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-40 h-40 dotted-bg opacity-20" />

          {/* Top Kente strip */}
          <div className="absolute top-0 left-0 right-0">
            <KenteDivider />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-300/40 rounded-full text-xs font-bold text-amber-100 uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Rejoignez le réseau
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Prêt à ne plus jamais chercher vos médicaments ?
              </h2>
              <p className="mt-4 text-white/80 leading-relaxed">
                Inscrivez-vous gratuitement en 30 secondes. Vous êtes pharmacien ? Inscrivez votre officine et recevez les demandes de vos futurs clients en temps réel.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onJoin()}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-emerald-700 font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Créer mon compte gratuit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm rounded-2xl transition-all"
                >
                  En savoir plus
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <Card
                icon={<Pill className="w-5 h-5" />}
                title="Pour les patients"
                desc="Trouvez vos médicaments et les pharmacies de garde près de chez vous, gratuitement."
              />
              <Card
                icon={<Building2 className="w-5 h-5" />}
                title="Pour les pharmaciens"
                desc="Recevez les demandes clients en direct, gérez votre stock et votre visibilité."
              />
              <Card
                icon={<Heart className="w-5 h-5" />}
                title="Pour le Togo"
                desc="Une plateforme locale, conçue et opérée pour la réalité togolaise."
              />
            </div>
          </div>

          {/* Bottom watermark logo */}
          <div className="absolute bottom-4 right-4 opacity-10">
            <LogoMark size={120} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 hover:bg-white/15 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-200 flex items-center justify-center">
          {icon}
        </div>
        <h4 className="font-display font-bold text-sm text-white">{title}</h4>
      </div>
      <p className="text-xs text-white/70 leading-relaxed">{desc}</p>
    </div>
  );
}
