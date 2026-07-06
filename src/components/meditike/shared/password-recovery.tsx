"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, MessageCircle, Shield, Info } from "lucide-react";
import { KenteDivider } from "@/components/brand/african-pattern";

interface PasswordRecoveryProps {
  open: boolean;
  onClose: () => void;
}

export function PasswordRecovery({ open, onClose }: PasswordRecoveryProps) {
  const [phone, setPhone] = useState("");

  if (!open) return null;

  const whatsappUrl = phone
    ? `https://wa.me/22896417270?text=${encodeURIComponent(
        `Bonjour, j'ai oublié mon mot de passe MediTike. Mon numéro de téléphone est : ${phone}. Pouvez-vous me réinitialiser mon mot de passe ?`
      )}`
    : `https://wa.me/22896417270?text=${encodeURIComponent(
        "Bonjour, j'ai oublié mon mot de passe MediTike. Pouvez-vous m'aider ?"
      )}`;

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
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl">Mot de passe oublié</h2>
                <p className="text-white/75 text-xs mt-0.5">Récupération sécurisée via WhatsApp</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0"><KenteDivider /></div>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Pour des raisons de sécurité, la récupération de mot de passe se fait en contactant l'administrateur sur WhatsApp. Vos données sont protégées et ne peuvent pas être récupérées autrement.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">
                Votre numéro de téléphone (optionnel)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +228 90 12 34 56"
                className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl font-medium focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Pré-remplira le message WhatsApp pour faciliter la demande
              </p>
            </div>

            <div className="p-3 bg-muted/60 rounded-xl space-y-1.5">
              <p className="text-xs font-bold text-foreground">Comment ça marche :</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Cliquez sur le bouton WhatsApp ci-dessous</li>
                <li>Envoyez votre numéro à l'administrateur</li>
                <li>L'admin vous renvoie un mot de passe temporaire</li>
                <li>Connectez-vous avec ce mot de passe</li>
                <li>Changez-le dans votre espace (Paramètres)</li>
              </ol>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              Contacter l'admin sur WhatsApp
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-muted text-muted-foreground font-bold text-sm rounded-xl hover:bg-muted/70 transition-colors"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
