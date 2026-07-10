"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Clock, MapPin, ShieldCheck, Pill, ChevronRight, Sparkles, Smartphone, Lock, Phone, Mail, X, Search, Download } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { GradientBlob, KenteDivider } from "@/components/brand/african-pattern";
import { AuthModal } from "@/components/meditike/shared/auth-modal";
import { PwaInstallPrompt } from "@/components/meditike/shared/pwa-install-prompt";

interface LandingProps {
  onAuthed: (user: any) => void;
}

export function Landing({ onAuthed }: LandingProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  const openLogin = () => { setAuthMode("login"); setAuthOpen(true); };
  const openRegister = () => { setAuthMode("register"); setAuthOpen(true); };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size={32} />
          <nav className="hidden md:flex items-center gap-7">
            <a href="#comment" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Comment ça marche</a>
            <a href="#garde" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Pharmacies de garde</a>
            <a href="#securite" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Sécurité</a>
            <a href="/a-propos" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">À propos</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={openLogin} className="px-4 py-2 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-colors">Se connecter</button>
            <button onClick={openRegister} className="inline-flex items-center gap-1.5 px-4 py-2 brand-gradient text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Sparkles className="w-3.5 h-3.5" /> Créer un compte
            </button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28">
          <div className="absolute inset-0 -z-10 warm-gradient" />
          <GradientBlob color="emerald" className="-top-20 -left-20 w-[28rem] h-[28rem]" />
          <GradientBlob color="gold" className="top-20 -right-32 w-[32rem] h-[32rem]" />
          <div className="absolute inset-0 -z-10 dotted-bg opacity-60" />
          <div className="absolute top-16 left-0 right-0 h-1 kente-divider opacity-80" />

          <div className="relative max-w-6xl mx-auto px-5">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
              <div className="text-center lg:text-left">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur border border-amber-300/40 rounded-full mb-5 shadow-sm">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-glow" />
                  <span className="text-xs font-bold text-amber-800 tracking-wide">Plateforme officielle · Togo 🇹🇬</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                  Demandez vos médicaments,{" "}
                  <span className="text-gradient-brand">les pharmacies vous répondent</span>, partout au <span className="text-gradient-gold">Togo</span>.
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                  className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  MediTike vous permet d'envoyer une demande de médicament à toutes les pharmacies de garde proches de vous. Joignez une photo d'ordonnance ou de la boîte, recevez les réponses en temps réel, et contactez directement la pharmacie qui a votre traitement.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                  className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button onClick={openRegister} className="group inline-flex items-center justify-center gap-2 px-7 py-4 brand-gradient text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <MessageCircle className="w-4 h-4" /> Créer ma demande
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <a href="#garde" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-foreground font-bold text-sm rounded-2xl border-2 border-border hover:border-emerald-500/40 hover:bg-emerald-50/50 transition-all">
                    <Clock className="w-4 h-4 text-emerald-600" /> Voir les pharmacies de garde
                  </a>
                  <a href="/MediTike.apk" download="MediTike.apk" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-foreground text-background font-bold text-sm rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <Download className="w-4 h-4" /> Télécharger l'app Android
                  </a>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }}
                  className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-600" /> Espace sécurisé</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Photos auto-supprimées</span>
                  <span className="inline-flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-orange-600" /> Web + Mobile + APK</span>
                </motion.div>
              </div>

              {/* Visual mockup */}
              <motion.div initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, type: "spring" }}
                className="relative mx-auto w-full max-w-md">
                <div className="relative bg-white rounded-3xl shadow-2xl border border-border/60 overflow-hidden">
                  <div className="brand-gradient p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <LogoMark size={32} />
                      <span className="font-display font-extrabold">MediTike</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/90 text-xs font-bold bg-white/15 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-amber-300 rounded-full pulse-glow" /> NOUVELLE DEMANDE
                    </div>
                  </div>
                  <KenteDivider />

                  <div className="p-5">
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-muted rounded-xl mb-3">
                      <Pill className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">Amoxicilline 500mg</span>
                    </div>
                    <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl mb-3 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-emerald-600 text-xs font-bold">📷</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold">ordonnance.jpg</p>
                        <p className="text-[10px] text-muted-foreground">1.2 Mo · auto-supprimée dans 72h</p>
                      </div>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">3 pharmacies ont répondu</p>
                    <div className="space-y-2">
                      {[
                        { name: "Pharmacie de Tokoin", price: "2 500 F", duty: true },
                        { name: "Pharmacie Centrale", price: "2 300 F", duty: false },
                        { name: "Pharmacie Forever", price: "2 700 F", duty: false },
                      ].map((p, i) => (
                        <motion.div key={p.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold truncate">{p.name}</p>
                              {p.duty && <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">DE GARDE</span>}
                            </div>
                            <p className="text-[11px] text-emerald-600 font-semibold">Disponible · cliquez pour contacter</p>
                          </div>
                          <p className="text-sm font-bold text-emerald-700 shrink-0">{p.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div className="absolute -top-4 -right-2 sm:-right-4 bg-white rounded-2xl shadow-xl border border-border px-3 py-2 float-anim z-10" style={{ animationDelay: "0s" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Garde cette semaine</p>
                      <p className="text-sm font-extrabold leading-none">50+ pharmacies</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section id="comment" className="relative py-20 sm:py-28 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-1.5 kente-divider" />

          <div className="relative max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-amber-200 uppercase tracking-wider mb-4">
                3 étapes · 30 secondes
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Comment ça marche ?</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="mt-3 text-white/70 max-w-2xl mx-auto">Une plateforme simple, pensée pour le terrain togolais.</motion.p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { n: "01", icon: MessageCircle, title: "Envoyez votre demande", desc: "Décrivez le médicament recherché, joignez une photo d'ordonnance ou de la boîte si besoin. Votre demande est envoyée instantanément à toutes les pharmacies de garde de votre zone." },
                { n: "02", icon: Sparkles, title: "Recevez les réponses", desc: "Les pharmaciens partenaires reçoivent votre demande en temps réel et vous répondent : disponible ou non, prix en FCFA, et un message personnalisé si besoin." },
                { n: "03", icon: Smartphone, title: "Contactez la pharmacie", desc: "Cliquez sur WhatsApp ou Appeler pour joindre directement la pharmacie qui a votre traitement. Vos photos sont automatiquement supprimées après 72h pour protéger votre vie privée." },
              ].map((s, i) => (
                <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}>
                  <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 h-full hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-900 flex items-center justify-center font-display font-extrabold text-xl shadow-lg">{s.n}</div>
                      <s.icon className="w-7 h-7 text-amber-300/80" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-3 leading-snug">{s.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 kente-divider" />
        </section>

        {/* SÉCURITÉ */}
        <section id="securite" className="py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-12">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4">
                Sécurité & confidentialité
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Vos données sont protégées</motion.h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Lock, title: "Compte sécurisé", desc: "Chaque client dispose d'un espace personnel protégé par mot de passe. Mots de passe hashés avec bcrypt (12 rounds) et sessions signées HMAC-SHA256." },
                { icon: ShieldCheck, title: "Photos éphémères", desc: "Les photos que vous envoyez sont automatiquement supprimées 72h après la première réponse, ou 7 jours après envoi si aucune pharmacie n'a répondu." },
                { icon: Smartphone, title: "Web + Mobile + APK", desc: "Application web responsive (mobile et desktop), installable comme PWA, et bientôt disponible en APK Android et sur l'App Store iOS." },
              ].map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DUTY PREVIEW */}
        <DutyPreview />

        {/* CTA */}
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[2rem] p-8 sm:p-14 overflow-hidden shadow-2xl">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-400/30 rounded-full blur-3xl" />
              <div className="absolute top-0 left-0 right-0"><KenteDivider /></div>
              <div className="relative text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">Prêt à demander vos médicaments ?</h2>
                <p className="mt-4 text-white/80 max-w-xl mx-auto">Inscrivez-vous gratuitement et envoyez votre première demande en 30 secondes.</p>
                <button onClick={openRegister} className="mt-7 inline-flex items-center gap-2 px-7 py-4 bg-white text-emerald-700 font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Sparkles className="w-4 h-4" /> Créer mon compte gratuit
                </button>
              </div>
              <div className="absolute bottom-4 right-4 opacity-10"><LogoMark size={120} /></div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative bg-foreground text-background mt-auto">
        <KenteDivider />
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <Logo variant="light" size={36} />
              <p className="mt-3 text-sm text-background/60 leading-relaxed">La plateforme togolaise qui connecte les patients aux pharmacies de garde en temps réel.</p>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3 text-amber-300">Navigation</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#comment" className="hover:text-background">Comment ça marche</a></li>
                <li><a href="#garde" className="hover:text-background">Pharmacies de garde</a></li>
                <li><a href="#securite" className="hover:text-background">Sécurité</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3 text-amber-300">Contact</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <a href="tel:+22896417270" className="hover:text-background transition-colors">+228 96 41 72 70</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-300" />
                  <span>contact@meditike.tg</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Lomé, Togo</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
            <p>© {new Date().getFullYear()} MediTike.</p>
            <a href="/confidentialite" className="hover:text-background transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthed={(u) => { setAuthOpen(false); onAuthed(u); }} initialMode={authMode} />

      <PwaInstallPrompt />
    </div>
  );
}

function DutyPreview() {
  const [duties, setDuties] = useState<any[]>([]);
  const [weekLabel, setWeekLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAllModal, setShowAllModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/duty")
      .then((r) => r.json())
      .then((data) => {
        setDuties(data.duties || []);
        if (data.weekStart) {
          const start = new Date(data.weekStart);
          const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
          const fmt = (d: Date) => `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
          setWeekLabel(`${fmt(start)} au ${fmt(end)}`);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="garde" className="py-20 sm:py-24 bg-gradient-to-b from-emerald-50/40 via-background to-amber-50/30">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full pulse-glow" /> Semaine du {weekLabel || "..."}
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Pharmacies de garde à <span className="text-gradient-brand">Lomé</span></motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-2 text-muted-foreground">Liste officielle du Ministère de la Santé — actualisée chaque lundi à 7h00 UTC.</motion.p>
        </div>

        {loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : duties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border">
            <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune pharmacie de garde trouvée pour cette semaine.</p>
            <p className="text-xs text-muted-foreground mt-1">La liste est mise à jour chaque lundi à 7h00 UTC.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {duties.slice(0, 6).map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-lg transition-all p-5">
                <h3 className="font-display font-bold text-base mb-2 line-clamp-1">Pharmacie {d.name}</h3>
                {d.address && (
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{d.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {d.phone1 && <a href={`tel:+228${d.phone1.replace(/\s/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors">
                    <Smartphone className="w-3.5 h-3.5" /> {d.phone1}
                  </a>}
                  {d.phone2 && <a href={`tel:+228${d.phone2.replace(/\s/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors">
                    <Smartphone className="w-3.5 h-3.5" /> {d.phone2}
                  </a>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {duties.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAllModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-xl text-sm font-bold hover:border-emerald-500/40 hover:bg-emerald-50/50 transition-all"
            >
              Voir les {duties.length} pharmacie{duties.length > 1 ? "s" : ""} de garde
            </button>
          </div>
        )}

        {/* Modal : toutes les pharmacies de garde */}
        <AnimatePresence>
          {showAllModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAllModal(false)}
            >
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 24, stiffness: 280 }}
                className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="brand-gradient relative px-6 pt-5 pb-4 text-white shrink-0">
                  <button onClick={() => setShowAllModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" aria-label="Fermer">
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="font-display font-extrabold text-xl">Pharmacies de garde</h3>
                  <p className="text-white/75 text-xs mt-1">Semaine du {weekLabel || "..."} · {duties.length} pharmacies</p>
                  <div className="absolute bottom-0 left-0 right-0"><KenteDivider /></div>
                </div>

                {/* Recherche */}
                <div className="p-4 border-b border-border shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher par nom, quartier..."
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Liste scrollable */}
                <div className="overflow-y-auto p-4 space-y-2">
                  {duties
                    .filter((d) => {
                      if (!search) return true;
                      const q = search.toLowerCase();
                      return d.name.toLowerCase().includes(q) || (d.address || "").toLowerCase().includes(q) || (d.phone1 || "").includes(q);
                    })
                    .map((d) => (
                      <div key={d.id} className="bg-white border border-border rounded-2xl p-4 hover:shadow-sm transition-shadow">
                        <h4 className="font-display font-bold text-base mb-1">Pharmacie {d.name}</h4>
                        {d.address && (
                          <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{d.address}</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {d.phone1 && (
                            <a href={`tel:+228${d.phone1.replace(/\s/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors">
                              <Smartphone className="w-3.5 h-3.5" /> {d.phone1}
                            </a>
                          )}
                          {d.phone2 && (
                            <a href={`tel:+228${d.phone2.replace(/\s/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors">
                              <Smartphone className="w-3.5 h-3.5" /> {d.phone2}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
