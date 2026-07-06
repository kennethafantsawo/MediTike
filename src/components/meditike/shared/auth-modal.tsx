"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Phone, User, Loader2, X, Eye, EyeOff, Sparkles, ChevronDown } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";
import { SUPPORTED_COUNTRIES, formatPhoneInput, normalizePhone, validatePhone } from "@/lib/meditike/helpers";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthed: (user: any) => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ open, onClose, onAuthed, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("228"); // Togo par défaut
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  if (!open) return null;

  const selectedCountry = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode) || SUPPORTED_COUNTRIES[0];

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Normaliser le numéro avec l'indicatif pays choisi
      const normalizedPhone = normalizePhone(phone, countryCode);
      if (!validatePhone(phone, countryCode)) {
        const country = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode);
        throw new Error(`Numéro invalide. ${country?.name || "Togo"} attendu : ${country?.phoneLength || 8} chiffres.`);
      }

      const body: any = { phone: normalizedPhone, password };
      if (mode === "register") {
        body.action = "register";
        body.fullName = fullName;
      }
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAuthed(data.user);
      setFullName(""); setPhone(""); setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="brand-gradient relative px-7 pt-6 pb-5 text-white">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <LogoMark size={40} />
              <div>
                <h2 className="font-display font-extrabold text-xl leading-none">
                  {mode === "login" ? "Bon retour" : "Créez votre compte"}
                </h2>
                <p className="text-white/75 text-xs mt-1 font-medium">
                  {mode === "login" ? "Connectez-vous à votre espace sécurisé" : "Espace client sécurisé · 30 secondes"}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0"><KenteDivider /></div>
          </div>

          <div className="px-7 py-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 p-1 bg-muted rounded-2xl mb-5">
              <button type="button" onClick={() => { setMode("login"); setError(null); }} className={`py-2 text-xs font-bold rounded-xl transition-all ${mode === "login" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
                Connexion
              </button>
              <button type="button" onClick={() => { setMode("register"); setError(null); }} className={`py-2 text-xs font-bold rounded-xl transition-all ${mode === "register" ? "bg-white shadow text-emerald-700" : "text-muted-foreground"}`}>
                Inscription
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <Field label="Nom complet" icon={<User className="w-4 h-4" />}>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Koffi Mensah" className="auth-input" />
                </Field>
              )}

              {/* Téléphone avec sélecteur de pays */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">
                  Numéro WhatsApp
                </label>
                <div className="relative flex">
                  {/* Sélecteur de pays */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      className="flex items-center gap-1.5 h-full pl-3 pr-2.5 bg-muted border border-r-0 border-border rounded-l-xl text-sm font-bold hover:bg-muted/70 transition-colors"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-xs">+{selectedCountry.code}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    {countryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto w-56">
                        {SUPPORTED_COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setCountryDropdownOpen(false);
                              setPhone(""); // reset phone when country changes
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-muted transition-colors ${c.code === countryCode ? "bg-emerald-50" : ""}`}
                          >
                            <span className="text-lg">{c.flag}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold">{c.name}</p>
                              <p className="text-[10px] text-muted-foreground">+{c.code}</p>
                            </div>
                            {c.code === countryCode && <span className="text-emerald-600 text-xs font-bold">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Champ téléphone */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder={Array(selectedCountry.phoneLength).fill("0").join("").replace(/(\d{2})/g, "$1 ").trim()}
                      className="auth-input-phone"
                      autoComplete="tel-national"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">
                  {selectedCountry.flag} {selectedCountry.name} · {selectedCountry.phoneLength} chiffres · format automatique avec espaces
                </p>
              </div>

              <Field label="Mot de passe" icon={<Lock className="w-4 h-4" />}>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="auth-input pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              {mode === "register" && (
                <p className="text-[10px] text-muted-foreground -mt-2 pl-1">Min. 8 caractères avec 1 lettre et 1 chiffre.</p>
              )}

              <button type="submit" disabled={loading} className="w-full mt-2 brand-gradient text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Se connecter" : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-border text-center">
              <p className="text-[11px] text-muted-foreground">
                <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                Espace pharmacien ? Vos identifiants vous sont communiqués par l'administrateur.
              </p>
            </div>
          </div>

          <style jsx>{`
            :global(.auth-input) {
              width: 100%;
              padding: 0.625rem 0.875rem 0.625rem 2.25rem;
              font-size: 0.875rem;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 0.875rem;
              font-weight: 500;
              transition: all 0.2s;
            }
            :global(.auth-input:focus) {
              outline: none;
              border-color: var(--primary);
              box-shadow: 0 0 0 3px oklch(0.55 0.13 165 / 0.15);
              background: white;
            }
            :global(.auth-input-phone) {
              width: 100%;
              padding: 0.625rem 0.875rem;
              font-size: 0.875rem;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 0 0.875rem 0.875rem 0;
              font-weight: 500;
              transition: all 0.2s;
              letter-spacing: 0.05em;
            }
            :global(.auth-input-phone:focus) {
              outline: none;
              border-color: var(--primary);
              box-shadow: 0 0 0 3px oklch(0.55 0.13 165 / 0.15);
              background: white;
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">{label}</label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">{icon}</div>}
        {children}
      </div>
    </div>
  );
}
