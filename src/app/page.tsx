"use client";
import { useState, useEffect } from "react";
import { Landing } from "@/components/meditike/landing/landing";
import { AppShell } from "@/components/meditike/app/app-shell";
import { SplashScreen } from "@/components/meditike/splash";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then(({ user }) => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <SplashScreen />;

  if (!user) {
    return <Landing onAuthed={setUser} />;
  }

  return (
    <AppShell
      user={user}
      onLogout={() => setUser(null)}
      initialTab={user.role === "pharmacist" ? "history" : "search"}
    />
  );
}
