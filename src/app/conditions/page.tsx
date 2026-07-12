"use client";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";
import { FileText, ArrowLeft, Shield, Lock, Eye, AlertTriangle, Phone } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size={32} />
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">Conditions d'utilisation</h1>
              <p className="text-sm text-muted-foreground mt-1">Dernière mise à jour : juillet 2026</p>
            </div>
          </div>
          <KenteDivider />
        </motion.div>

        <div className="space-y-4">
          <Section title="1. Acceptation des conditions">
            <p>En utilisant MediTike, vous acceptez les présentes conditions. Si vous n'acceptez pas, veuillez ne pas utiliser l'application.</p>
          </Section>

          <Section title="2. Description du service">
            <p>MediTike met en relation les patients et les pharmacies de garde au Togo. Le service permet d'envoyer des demandes de médicaments et de recevoir des réponses des pharmacies.</p>
            <p className="font-semibold text-foreground">MediTike ne vend pas de médicaments. Les transactions se font directement entre patient et pharmacie.</p>
          </Section>

          <Section title="3. Inscription et compte">
            <p>Vous devez créer un compte avec votre numéro de téléphone. Vous êtes responsable de :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintenir la confidentialité de votre mot de passe</li>
              <li>Toutes les activités depuis votre compte</li>
              <li>Fournir des informations exactes</li>
            </ul>
          </Section>

          <Section title="4. Utilisation responsable" icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}>
            <p>Vous vous engagez à ne pas :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Envoyer de fausses demandes ou spammer les pharmacies</li>
              <li>Utiliser le service à des fins illégales</li>
              <li>Tenter d'accéder au compte d'un autre utilisateur</li>
              <li>Contourner les mesures de sécurité</li>
            </ul>
            <p className="font-semibold text-foreground">Tout abus entraîne la désactivation immédiate du compte.</p>
          </Section>

          <Section title="5. Photos et données" icon={<Lock className="w-5 h-5 text-emerald-600" />}>
            <p>Les photos sont supprimées automatiquement 72h après réponse (ou 7j sans réponse). Consultez notre <a href="/confidentialite" className="font-bold text-emerald-600 hover:underline">Politique de confidentialité</a>.</p>
          </Section>

          <Section title="6. Responsabilité" icon={<Shield className="w-5 h-5 text-emerald-600" />}>
            <p>MediTike est un intermédiaire. Nous ne sommes pas responsables de la disponibilité réelle, des prix, ou de la qualité des médicaments.</p>
          </Section>

          <Section title="7. Conseils de sécurité" icon={<Eye className="w-5 h-5 text-emerald-600" />}>
            <ul className="list-disc pl-5 space-y-1">
              <li>Utilisez un mot de passe unique</li>
              <li>Ne partagez jamais votre mot de passe</li>
              <li>MediTike ne vous demandera JAMAIS votre mot de passe</li>
              <li>Site officiel : medi-tike.vercel.app</li>
              <li>Changez votre mot de passe si suspicion de compromission</li>
            </ul>
          </Section>

          <Section title="8. Loi applicable">
            <p>Ces conditions sont régies par le droit togolais.</p>
          </Section>

          <div className="bg-muted/40 rounded-2xl p-5 border border-border">
            <h3 className="font-display font-bold text-base mb-2 text-foreground">Questions ?</h3>
            <p className="text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-600" /> WhatsApp : +228 96 41 72 70</p>
          </div>
        </div>
      </main>

      <footer className="bg-foreground text-background py-6">
        <KenteDivider />
        <div className="max-w-3xl mx-auto px-5 text-center text-xs text-background/60 mt-4">
          © {new Date().getFullYear()} MediTike
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="bg-white border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon || <FileText className="w-5 h-5 text-emerald-600 shrink-0" />}
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
