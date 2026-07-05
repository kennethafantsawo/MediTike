"use client";
/**
 * Auth modal — handles client login, register, pharmacy registration, and demo access.
 * Beautiful gradient hero with form card on top.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Phone, User, Building2, Loader2, X, ChevronDown, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthed: (user: any) => void;
  initialMode?: "login" | "register" | "register-pharmacy";
}

export function AuthModal({ open, onClose, onAuthed, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "register-pharmacy">(initialMode);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [city, setCity] = useState("Lomé");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: any = { phone, password };
      if (mode === "register") {
        body.action = "register";
        body.fullName = fullName;
      } else if (mode === "register-pharmacy") {
        body.action = "register-pharmacy";
        body.fullName = fullName;
        body.pharmacyName = pharmacyName;
        body.city = city;
        body.district = district;
        body.address = address;
      }
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onAuthed(data.user);
      // Reset
      setFullName(""); setPhone(""); setPassword("");
      setPharmacyName(""); setDistrict(""); setAddress("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seed-demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAuthed(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isPharmacy = mode === "register-pharmacy";

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
          {/* Decorative gradient header */}
          <div className="brand-gradient relative px-7 pt-6 pb-5 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <LogoMark size={40} />
              <div>
                <h2 className="font-display font-extrabold text-xl leading-none">
                  {mode === "login" ? "Bon retour" : mode === "register" ? "Rejoignez MediTike" : "Inscrire mon officine"}
                </h2>
                <p className="text-white/75 text-xs mt-1 font-medium">
                  {mode === "login" ? "Connectez-vous à votre compte" : "Créez votre compte en 30 secondes"}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <KenteDivider />
            </div>
          </div>

          <div className="px-7 py-6 max-h-[70vh] overflow-y-auto">
            {/* Mode switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-2xl mb-5">
              {([
                { id: "login", label: "Connexion" },
                { id: "register", label: "Patient" },
                { id: "register-pharmacy", label: "Pharmacie" },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setMode(t.id); setError(null); }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === t.id ? "bg-white shadow text-emerald-700" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {(mode === "register" || isPharmacy) && (
                <Field label="Nom complet" icon={<User className="w-4 h-4" />}>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Koffi Mensah"
                    className="input"
                  />
                </Field>
              )}

              {isPharmacy && (
                <>
                  <Field label="Nom de l'officine" icon={<Building2 className="w-4 h-4" />}>
                    <input
                      type="text"
                      required
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      placeholder="Pharmacie Centrale"
                      className="input"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Ville">
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input appearance-none pr-8"
                      >
                        <option>Lomé</option>
                        <option>Kara</option>
                        <option>Sokodé</option>
                        <option>Kpalimé</option>
                        <option>Atakpamé</option>
                        <option>Dapaong</option>
                        <option>Tsévié</option>
                        <option>Autre</option>
                      </select>
                    </Field>
                    <Field label="Quartier">
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Tokoin"
                        className="input"
                      />
                    </Field>
                  </div>
                  <Field label="Adresse précise">
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Près du CHU, rue principale"
                      className="input"
                    />
                  </Field>
                </>
              )}

              <Field label="Numéro WhatsApp (Togo)" icon={<Phone className="w-4 h-4" />}>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex : 90 12 34 56"
                  className="input"
                />
              </Field>
              <p className="text-[10px] text-muted-foreground -mt-2 pl-1">
                8 chiffres → automatiquement au format <span className="font-semibold">+228</span>
              </p>

              <Field label="Mot de passe" icon={<Lock className="w-4 h-4" />}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 brand-gradient text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === "login" ? (
                  "Se connecter"
                ) : isPharmacy ? (
                  "Inscrire mon officine"
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>

            {/* Demo access */}
            <div className="mt-5 pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleDemo}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-amber-400/50 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                Explorer en mode démo
              </button>
              <p className="text-[10px] text-center text-muted-foreground mt-2">
                Démo client — ou utilisez <span className="font-mono font-semibold">+228 90 12 34 56</span> / <span className="font-mono font-semibold">demo1234</span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem 0.625rem 2.25rem;
          font-size: 0.875rem;
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px oklch(0.55 0.13 165 / 0.15);
          background: white;
        }
        .input:not(:has(+ select)) {
          padding-left: 2.25rem;
        }
      `}</style>
    </AnimatePresence>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
