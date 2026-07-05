"use client";
import { motion } from "framer-motion";
import { Logo, LogoMark } from "@/components/brand/logo";
import { KenteDivider, GradientBlob } from "@/components/brand/african-pattern";
import {
  Target, Lightbulb, FlaskConical, HeartPulse, Users, ShieldCheck,
  TrendingUp, Microscope, Phone, Mail, MapPin, Sparkles, ChevronRight, ArrowLeft,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size={32} />
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden pt-16 pb-12">
          <div className="absolute inset-0 -z-10 warm-gradient" />
          <GradientBlob color="emerald" className="-top-20 -left-20 w-[24rem] h-[24rem]" />
          <div className="absolute top-14 left-0 right-0 h-1 kente-divider opacity-80" />

          <div className="relative max-w-4xl mx-auto px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 border border-amber-300/40 rounded-full mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-xs font-bold text-amber-800">Projet soumis au Gala Scientifique FSS 2026</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            >
              MediTike : <span className="text-gradient-brand">connecter patients et pharmacies</span> pour un meilleur accès aux médicaments au Togo
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Une plateforme numérique scientifique et sécurisée, conçue pour réduire les délais d'accès aux médicaments et améliorer l'efficacité du système de garde pharmaceutique togolais.
            </motion.p>
          </div>
        </section>

        {/* PROBLÉMATIQUE */}
        <Section
          icon={Target}
          number="01"
          title="Problématique"
          color="emerald"
        >
          <p>
            Au Togo, l'accès aux médicaments en dehors des heures d'ouverture classiques demeure un défi majeur de santé publique. Lorsqu'un patient a besoin d'un médicament en urgence — particulièrement la nuit, le week-end, ou dans les zones mal couvertes — il doit appeler successivement plusieurs pharmacies pour identifier celle qui dispose du produit recherché.
          </p>
          <p>
            Cette situation engendre des retards préjudiciables à la prise en charge thérapeutique, particulièrement pour les pathologies chroniques (diabète, hypertension, infections), les urgences pédiatriques et les traitements antipaludiques. Le Ministère de la Santé publie hebdomadairement la liste officielle des pharmacies de garde, mais cette information reste difficilement accessible aux citoyens dans le feu de l'urgence.
          </p>
          <p className="font-semibold text-foreground">
            Comment rendre cette information accessible en temps réel, et permettre aux patients de contacter directement la pharmacie qui dispose de leur traitement ?
          </p>
        </Section>

        {/* HYPOTHÈSE & OBJECTIFS */}
        <Section
          icon={Lightbulb}
          number="02"
          title="Hypothèse & Objectifs"
          color="gold"
        >
          <p>
            <span className="font-semibold text-foreground">Hypothèse :</span> La digitalisation du circuit de demande de médicaments, couplée à une diffusion en temps réel de la liste officielle des pharmacies de garde, permettrait de réduire significativement les délais d'accès au traitement tout en optimisant la charge opérationnelle des officines.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <Objective num="1" text="Réduire le délai moyen de contact patient-pharmacie de garde de plusieurs dizaines de minutes à moins de 5 minutes." />
            <Objective num="2" text="Centraliser et actualiser automatiquement la liste officielle hebdomadaire du Ministère de la Santé." />
            <Objective num="3" text="Garantir la confidentialité des données patients via auto-suppression des photos après 72 heures." />
            <Objective num="4" text="Fournir un outil accessible (web + mobile) fonctionnant même sur connexions modestes." />
          </div>
        </Section>

        {/* MÉTHODOLOGIE */}
        <Section
          icon={FlaskConical}
          number="03"
          title="Méthodologie"
          color="terra"
        >
          <p>
            Le projet s'est structuré autour d'une démarche scientifique en quatre phases, intégrant l'analyse du terrain, la conception technique, le déploiement et l'évaluation continue.
          </p>
          <div className="space-y-3 mt-4">
            <Phase num="1" title="Analyse du terrain" desc="Étude du fichier officiel du Ministère de la Santé (26 semaines, 1348 entrées de pharmacies de garde) et identification des points de friction dans le parcours patient." />
            <Phase num="2" title="Conception technique" desc="Architecture en Next.js 16 + TypeScript + Prisma + PostgreSQL (Supabase), avec authentification sécurisée (bcrypt + HMAC-SHA256) et stockage objet pour les photos." />
            <Phase num="3" title="Déploiement" desc="Mise en production sur Vercel (frontend + API) et Supabase (base de données + stockage), avec cron jobs automatisés pour la maintenance." />
            <Phase num="4" title="Évaluation" desc="Métriques de suivi : nombre de demandes traitées, délai moyen de réponse, taux de résolution, satisfaction patient. Audit journalisé de toutes les actions administrateur." />
          </div>
        </Section>

        {/* RÉSULTATS ATTENDUS */}
        <Section
          icon={TrendingUp}
          number="04"
          title="Résultats attendus & Impact"
          color="emerald"
        >
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <ImpactStat value="-90%" label="Délai de contact pharmacie" />
            <ImpactStat value="100%" label="Pharmacies de garde couvertes" />
            <ImpactStat value="7" label="Villes togolaises desservies" />
          </div>
          <p>
            Au-delà de l'aspect technique, MediTike vise un impact sanitaire mesurable : réduction des ruptures de traitement, meilleure observance des thérapies chroniques, et désengorgement des services d'urgence hospitaliers pour les cas non critiques. La plateforme s'inscrit dans une démarche d'<span className="font-semibold">innovation frugale</span>, adaptée aux réalités infrastructurelles togolaises.
          </p>
          <p className="mt-3">
            L'architecture modulaire permet une évolution vers la téléconsultation pharmaceutique, l'intégration du paiement Mobile Money (Moov/T-Money), et l'extension à d'autres pays de la sous-région CEDEAO.
          </p>
        </Section>

        {/* SÉCURITÉ */}
        <Section
          icon={ShieldCheck}
          number="05"
          title="Sécurité & Conformité"
          color="gold"
        >
          <p>
            La sécurité des données patients est au cœur de la conception. MediTike implémente les standards actuels de cybersécurité :
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <SecurityItem text="Mots de passe hashés bcrypt (12 rounds)" />
            <SecurityItem text="Sessions cookies HTTP-only signées HMAC-SHA256" />
            <SecurityItem text="Photos auto-supprimées 72h après réponse (7j sans réponse)" />
            <SecurityItem text="Bucket Storage privé avec RLS policies" />
            <SecurityItem text="URL admin secrète (32 caractères aléatoires)" />
            <SecurityItem text="Audit log complet de toutes les actions admin" />
            <SecurityItem text="Validation stricte des entrées (taille, type MIME)" />
            <SecurityItem text="HTTPS forcé en production (cookies Secure)" />
          </div>
        </Section>

        {/* CONCLUSION */}
        <section className="py-16 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-1.5 kente-divider" />
          <div className="relative max-w-4xl mx-auto px-5 text-center">
            <Microscope className="w-12 h-12 text-amber-300 mx-auto mb-4" />
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">Une innovation frugale au service de la santé publique togolaise</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              MediTike démontre qu'il est possible de concevoir une plateforme médicale sécurisée, scalable et accessible, en s'appuyant sur les technologies modernes du web, tout en respectant les réalités du terrain africain.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <Badge icon={Users} text="Projet individuel" />
              <Badge icon={HeartPulse} text="Domaine : Santé publique" />
              <Badge icon={Sparkles} text="Gala Scientifique FSS 2026" />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-5">
            <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="font-display font-bold text-xl mb-4 text-center">Contact du porteur de projet</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <ContactCard icon={Phone} label="Téléphone" value="+228 96 41 72 70" href="tel:+22896417270" />
                <ContactCard icon={Mail} label="Email" value="contact@meditike.tg" href="mailto:contact@meditike.tg" />
                <ContactCard icon={MapPin} label="Localisation" value="Lomé, Togo" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-6">
        <KenteDivider />
        <div className="max-w-5xl mx-auto px-5 text-center text-xs text-background/60 mt-4">
          © {new Date().getFullYear()} MediTike · Projet soumis au Gala Scientifique de la Faculté des Sciences de Santé (FSS) 2026
        </div>
      </footer>
    </div>
  );
}

function Section({ icon: Icon, number, title, color, children }: { icon: any; number: string; title: string; color: "emerald" | "gold" | "terra"; children: React.ReactNode }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gold: "bg-amber-50 text-amber-700 border-amber-200",
    terra: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <section className="py-12 sm:py-14 border-t border-border/40">
      <div className="max-w-4xl mx-auto px-5">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl ${colors[color]} border flex items-center justify-center font-display font-extrabold text-xl shrink-0`}>
            {number}
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h2>
            <Icon className="w-5 h-5 text-muted-foreground mt-1" />
          </div>
        </div>
        <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-3 leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
}

function Objective({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex gap-3 p-3 bg-muted/40 rounded-xl border border-border/40">
      <span className="w-7 h-7 rounded-lg brand-gradient text-white font-bold text-xs flex items-center justify-center shrink-0">{num}</span>
      <p className="text-sm text-foreground leading-snug">{text}</p>
    </div>
  );
}

function Phase({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-3 p-4 bg-white border border-border rounded-xl">
      <div className="w-8 h-8 rounded-lg gold-gradient text-white font-bold text-sm flex items-center justify-center shrink-0">{num}</div>
      <div>
        <p className="font-bold text-sm mb-1">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ImpactStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 text-center">
      <p className="font-display font-extrabold text-3xl text-gradient-brand">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function SecurityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-lg">
      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
      <span className="text-xs text-foreground">{text}</span>
    </div>
  );
}

function Badge({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold">
      <Icon className="w-3.5 h-3.5 text-amber-300" />
      {text}
    </span>
  );
}

function ContactCard({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex flex-col items-center text-center p-4 bg-muted/40 rounded-2xl border border-border/40 hover:border-emerald-300/60 transition-colors">
      <div className="w-10 h-10 rounded-xl brand-gradient text-white flex items-center justify-center mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
