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
  useEffect(() => {
    if (user?.role === "admin" && typeof window !== "undefined") {
      window.location.href = "/admin-secret-dev-2024";
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
