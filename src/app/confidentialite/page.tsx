"use client";
import { motion } from "framer-motion";
import { Logo, LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";
import { Shield, Lock, Eye, Trash2, FileText, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";

export default function PrivacyPage() {
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
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">Politique de confidentialité</h1>
              <p className="text-sm text-muted-foreground mt-1">Dernière mise à jour : juillet 2026</p>
            </div>
          </div>
          <KenteDivider />
        </motion.div>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <Section icon={FileText} title="1. Qui sommes-nous">
            <p>
              MediTike est une plateforme togolaise qui connecte les patients aux pharmacies de garde. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.
            </p>
            <p className="font-semibold text-foreground">Responsable du traitement : Kenneth Afantsawo — Lomé, Togo. Contact : +228 96 41 72 70.</p>
          </Section>

          <Section icon={Eye} title="2. Données que nous collectons">
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Numéro de téléphone</strong> : sert d'identifiant de connexion</li>
              <li><strong className="text-foreground">Nom complet</strong> : pour personnaliser votre expérience</li>
              <li><strong className="text-foreground">Mot de passe</strong> : hashé avec bcrypt (jamais en clair)</li>
              <li><strong className="text-foreground">Photos d'ordonnances</strong> : pour faciliter vos demandes de médicaments</li>
              <li><strong className="text-foreground">Demandes de médicaments</strong> : nom du médicament recherché et notes</li>
              <li><strong className="text-foreground">Adresse IP</strong> : pour la sécurité et le journal d'audit (admin uniquement)</li>
            </ul>
          </Section>

          <Section icon={Lock} title="3. Comment nous utilisons vos données">
            <p>Vos données sont utilisées uniquement pour :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Vous authentifier et sécuriser votre compte</li>
              <li>Transmettre vos demandes aux pharmacies de garde</li>
              <li>Vous permettre de contacter les pharmacies</li>
              <li>Améliorer le service (statistiques anonymisées)</li>
              <li>Prévenir les abus et sécuriser la plateforme</li>
            </ul>
            <p className="font-semibold text-foreground">Nous ne vendons JAMAIS vos données à des tiers.</p>
          </Section>

          <Section icon={Trash2} title="4. Suppression automatique des photos">
            <p>
              Les photos que vous envoyez (ordonnances, boîtes de médicaments) sont <strong className="text-foreground">automatiquement supprimées</strong> :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">72 heures</strong> après la première réponse d'une pharmacie</li>
              <li><strong className="text-foreground">7 jours</strong> après l'envoi si aucune pharmacie n'a répondu</li>
            </ul>
            <p>Cette suppression est irréversible et garantit que vos données de santé ne sont pas conservées inutilement.</p>
          </Section>

          <Section icon={Lock} title="5. Sécurité de vos données">
            <p>Nous mettons en œuvre les mesures de sécurité suivantes :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mots de passe hashés avec <strong className="text-foreground">bcrypt (12 rounds)</strong></li>
              <li>Sessions signées avec <strong className="text-foreground">HMAC-SHA256</strong></li>
              <li>Connexion chiffrée <strong className="text-foreground">HTTPS</strong> (comme les banques)</li>
              <li>Photos stockées dans un <strong className="text-foreground">coffre-fort numérique privé</strong></li>
              <li>Validation stricte des fichiers (taille max 2 Mo, types autorisés)</li>
              <li>Journal d'audit de toutes les actions administrateur</li>
              <li>Espace administrateur protégé par URL secrète</li>
              <li>Rate limiting sur les endpoints sensibles (anti brute-force)</li>
              <li>Headers de sécurité (CSP, X-Frame-Options, HSTS)</li>
            </ul>
          </Section>

          <Section icon={Eye} title="6. Qui peut voir vos données">
            <p>
              Vos données ne sont accessibles qu'à :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Vous-même</strong> : vos demandes, photos et réponses</li>
              <li><strong className="text-foreground">Les pharmaciens partenaires</strong> : uniquement les demandes que vous envoyez (nom du médicament, note, photos) — ils ne voient PAS votre mot de passe</li>
              <li><strong className="text-foreground">L'administrateur</strong> : peut voir votre téléphone et nom, peut réinitialiser votre mot de passe (mais ne peut JAMAIS le voir)</li>
            </ul>
          </Section>

          <Section icon={FileText} title="7. Vos droits">
            <p>Conformément aux lois applicables, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Droit d'accès</strong> : consulter les données que nous détenons sur vous</li>
              <li><strong className="text-foreground">Droit de rectification</strong> : corriger des données inexactes</li>
              <li><strong className="text-foreground">Droit de suppression</strong> : demander la suppression de votre compte</li>
              <li><strong className="text-foreground">Droit d'opposition</strong> : refuser certains traitements</li>
            </ul>
            <p>Pour exercer ces droits, contactez-nous via WhatsApp au <strong className="text-foreground">+228 96 41 72 70</strong>.</p>
          </Section>

          <Section icon={FileText} title="8. Conservation des données">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Photos</strong> : 72h après réponse ou 7j sans réponse</li>
              <li><strong className="text-foreground">Demandes</strong> : conservées tant que le compte est actif</li>
              <li><strong className="text-foreground">Compte</strong> : supprimé sur demande de l'utilisateur</li>
              <li><strong className="text-foreground">Journal d'audit</strong> : 1 an (sécurité)</li>
            </ul>
          </Section>

          <Section icon={FileText} title="9. Hébergement">
            <p>
              Vos données sont hébergées chez <strong className="text-foreground">Supabase</strong> (base de données PostgreSQL, région Frankfurt) et <strong className="text-foreground">Vercel</strong> (application web, région Frankfurt). Ces fournisseurs appliquent des standards de sécurité élevés (chiffrement au repos, sauvegardes automatiques, conformité RGPD).
            </p>
          </Section>

          <Section icon={FileText} title="10. Modifications">
            <p>
              Cette politique peut être modifiée à tout moment. Les utilisateurs seront notifiés des changements importants via l'application.
            </p>
          </Section>

          <div className="bg-muted/40 rounded-2xl p-5 border border-border">
            <h3 className="font-display font-bold text-base mb-3 text-foreground">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-600" /> +228 96 41 72 70</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-600" /> contact@meditike.tg</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-600" /> Lomé, Togo</p>
            </div>
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

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-emerald-600 shrink-0" />
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
      </div>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
