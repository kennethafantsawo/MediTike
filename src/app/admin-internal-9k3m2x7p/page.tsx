"use client";
import { useState, useEffect } from "react";
import { AdminApp } from "@/components/meditike/admin/admin-app";
import { SplashScreen } from "@/components/meditike/shared/splash";
import { AuthModal } from "@/components/meditike/shared/auth-modal";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetch("/api/auth").then((r) => r.json()).then(({ user }) => {
      setUser(user);
      setLoading(false);
      if (!user || user.role !== "admin") setShowAuth(true);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <SplashScreen />;

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-foreground p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-background rounded-3xl shadow-2xl overflow-hidden">
          <div className="brand-gradient p-6 text-white text-center relative">
            <div className="absolute bottom-0 left-0 right-0 h-1 kente-divider" />
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-7 h-7 text-amber-300" />
            </div>
            <h1 className="font-display font-extrabold text-xl">Espace réservé</h1>
            <p className="text-xs text-white/70 mt-1">Accès strictement réservé aux administrateurs autorisés.</p>
          </div>
          <div className="p-6 text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">Veuillez vous connecter avec un compte administrateur.</p>
            <button onClick={() => setShowAuth(true)} className="w-full py-3 brand-gradient text-white font-bold text-sm rounded-xl">
              Se connecter
            </button>
            <a href="/" className="block mt-3 text-xs text-muted-foreground hover:text-foreground">← Retour à l'accueil</a>
          </div>
        </motion.div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onAuthed={(u) => { if (u.role === "admin") setUser(u); }} initialMode="login" />
      </div>
    );
  }

  return <AdminApp user={user} onLogout={async () => { await fetch("/api/auth", { method: "DELETE" }); window.location.href = "/"; }} />;
}
