"use client";
import { useState, useEffect } from "react";
import { Landing } from "@/components/meditike/landing/landing";
import { ClientApp } from "@/components/meditike/client/client-app";
import { PharmacistApp } from "@/components/meditike/pharmacist/pharmacist-app";
import { SplashScreen } from "@/components/meditike/shared/splash";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth").then((r) => r.json()).then(({ user }) => { setUser(user); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // Redirige les admins vers l'espace admin secret
  // L'URL admin est récupérée côté serveur via /api/admin-redirect (JAMAIS dans le JS client)
  useEffect(() => {
    if (user?.role === "admin" && typeof window !== "undefined") {
      // Redirige vers une API qui fait la vraie redirection (l'URL n'est jamais exposée côté client)
      window.location.href = "/api/admin-redirect";
    }
  }, [user]);

  if (loading) return <SplashScreen />;
  if (!user) return <Landing onAuthed={setUser} />;
  if (user.role === "admin") return <SplashScreen />;

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setUser(null);
  };

  if (user.role === "pharmacist") return <PharmacistApp user={user} onLogout={handleLogout} />;
  return <ClientApp user={user} onLogout={handleLogout} />;
}
