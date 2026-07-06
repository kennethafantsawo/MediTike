"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, Lock, User, Phone, Calendar, Loader2, Check, Save,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateFr } from "@/lib/meditike/helpers";

interface ClientUser {
  id: string;
  phone: string;
  fullName: string | null;
  createdAt: string;
}

interface ClientSettingsProps {
  /** Appelé après une mise à jour du profil (ex: pour rafraîchir l'en-tête). */
  onProfileUpdated?: (fullName: string) => void;
}

export function ClientSettings({ onProfileUpdated }: ClientSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [savingPwd, setSavingPwd] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [user, setUser] = useState<ClientUser | null>(null);

  // Changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profil
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/client/settings")
      .then(async (r) => {
        const data = await r.json();
        if (cancelled) return null;
        if (!r.ok || !data?.user) {
          throw new Error(data?.error || "Erreur de chargement");
        }
        return data;
      })
      .then((data) => {
        if (!data || cancelled) return;
        setUser(data.user);
        setFullName(data.user.fullName || "");
        setLoading(false);
      })
      .catch((err: any) => {
        if (cancelled) return;
        toast.error(err?.message || "Erreur de chargement");
        setLoading(false);
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
      const res = await fetch("/api/client/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-password", currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Mot de passe changé avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingPwd(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Le nom complet est requis");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch("/api/client/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-profile", fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Profil mis à jour !");
      setUser((prev) => prev ? { ...prev, fullName: fullName.trim() } : prev);
      onProfileUpdated?.(fullName.trim());
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  // Indicateur de force du mot de passe
  const passwordStrength = getPasswordStrength(newPassword);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-extrabold mb-1">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Gérez votre compte client</p>
      </div>

      {/* Section 1 : Changer le mot de passe */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border rounded-2xl p-5"
      >
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
              <span className="text-[10px] font-bold text-muted-foreground">
                {passwordStrength.label}
              </span>
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

      {/* Section 2 : Modifier le profil */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-border rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <User className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="font-display font-bold text-base">Modifier mon profil</h3>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Votre nom complet"
            maxLength={100}
            className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:border-emerald-500"
          />
          <p className="text-[10px] text-muted-foreground">
            Ce nom sera visible par les pharmaciens quand vous envoyez une demande.
          </p>
          <button
            type="submit"
            disabled={savingProfile}
            className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer mon profil
          </button>
        </form>
      </motion.div>

      {/* Section 3 : Informations du compte */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-border rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Settings className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-display font-bold text-base">Informations du compte</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Téléphone :</span>
              <span className="font-bold font-mono">{user.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Inscrit le :</span>
              <span className="font-bold">{formatDateFr(user.createdAt)}</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            Votre numéro de téléphone sert d'identifiant de connexion et ne peut pas être modifié ici.
          </p>
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
