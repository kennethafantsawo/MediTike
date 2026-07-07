"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Lock, MessageCircle, Building2, Loader2, Check, Save } from "lucide-react";
import { toast } from "sonner";

export function PharmacistSettings() {
  const [loading, setLoading] = useState(true);
  const [savingPwd, setSavingPwd] = useState(false);
  const [savingWpp, setSavingWpp] = useState(false);
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Changement mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // WhatsApp
  const [whatsappNumbers, setWhatsappNumbers] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pharmacist/settings")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setPharmacy(data.pharmacy);
        // Parse les numéros WhatsApp existants
        const wpp = data.pharmacy?.whatsapp ? data.pharmacy.whatsapp.split(",").filter(Boolean) : [];
        setWhatsappNumbers([wpp[0] || "", wpp[1] || "", wpp[2] || ""]);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Erreur de chargement");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setSavingPwd(true);
    try {
      const res = await fetch("/api/pharmacist/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-password", currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Mot de passe changé avec succès !");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingPwd(false);
    }
  }

  async function handleSaveWhatsapp() {
    setSavingWpp(true);
    try {
      const filtered = whatsappNumbers.filter((n) => n.trim());
      const res = await fetch("/api/pharmacist/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-whatsapp", whatsappNumbers: filtered }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Numéros WhatsApp enregistrés !");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingWpp(false);
    }
  }

  // Indicateur de force du mot de passe
  const passwordStrength = getPasswordStrength(newPassword);

  if (loading) {
    return <div className="text-center py-12"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-extrabold mb-1">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Gérez votre compte et votre pharmacie</p>
      </div>

      {/* Section : Changer mot de passe */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="font-display font-bold text-base">Changer le mot de passe</h3>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Mot de passe actuel"
            className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-emerald-500"
          />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-emerald-500"
          />
          {newPassword && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.percent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">{passwordStrength.label}</span>
            </div>
          )}
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le nouveau mot de passe"
            className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-emerald-500"
          />
          <p className="text-[10px] text-muted-foreground">
            Min. 8 caractères avec 1 lettre, 1 chiffre et 1 caractère spécial (! @ # $ % & *)
          </p>
          <button
            type="submit"
            disabled={savingPwd}
            className="w-full py-3 brand-gradient text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Changer le mot de passe
          </button>
        </form>
      </motion.div>

      {/* Section : Numéros WhatsApp */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base">Numéros WhatsApp</h3>
            <p className="text-[10px] text-muted-foreground">Les clients pourront vous contacter sur ces numéros</p>
          </div>
        </div>
        <div className="space-y-2">
          {whatsappNumbers.map((num, i) => (
            <input
              key={i}
              type="tel"
              value={num}
              onChange={(e) => {
                const next = [...whatsappNumbers];
                next[i] = e.target.value;
                setWhatsappNumbers(next);
              }}
              placeholder={`WhatsApp ${i + 1} (ex: +228 90 12 34 56)`}
              className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          ))}
        </div>
        <button
          onClick={handleSaveWhatsapp}
          disabled={savingWpp}
          className="w-full mt-3 py-3 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
        >
          {savingWpp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer les numéros
        </button>
      </motion.div>

      {/* Section : Informations pharmacie */}
      {pharmacy && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-display font-bold text-base">Informations pharmacie</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Nom :</span> <span className="font-bold">{pharmacy.name}</span></div>
            {pharmacy.address && <div><span className="text-muted-foreground">Adresse :</span> {pharmacy.address}</div>}
            <div><span className="text-muted-foreground">Téléphone 1 :</span> {pharmacy.phone1}</div>
            {pharmacy.phone2 && <div><span className="text-muted-foreground">Téléphone 2 :</span> {pharmacy.phone2}</div>}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function getPasswordStrength(pwd: string): { percent: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[!@#$%&*]/.test(pwd)) score++;
  if (score <= 2) return { percent: 33, label: "Faible", color: "bg-red-500" };
  if (score <= 4) return { percent: 66, label: "Moyen", color: "bg-amber-500" };
  return { percent: 100, label: "Fort", color: "bg-emerald-500" };
}
